#!/usr/bin/env python3
"""检查双语协议的完整正文、目录导航、旧地址和安全边界。"""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
DOCUMENTS = json.loads((ROOT / 'src/legal/documents.json').read_text())


class DocumentParser(HTMLParser):
    """仅解析生成页面的可见文本与链接，不运行任何客户端代码。"""
    def __init__(self, html):
        """收集结构以验证无脚本阅读和锚点定位。"""
        super().__init__()
        self.ids = []
        self.links = []
        self.scripts = []
        self.text = []
        self.headings = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        """检查链接、标识和脚本资源，阻止无意引入第三方请求。"""
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if tag == 'script':
            self.scripts.append(attrs.get('src', ''))
        if tag == 'h1':
            self.headings += 1
        for name in attrs:
            if name.startswith('on'):
                raise AssertionError('不允许内联事件处理器')

    def handle_data(self, text):
        """保留全部静态文本，确保正文不是等待脚本加载的空壳。"""
        self.text.append(text)


class LegalDocumentTests(unittest.TestCase):
    """同时约束主站、镜像与英文／简体中文文档的语义结构。"""
    def test_languages_have_matching_sections(self):
        """中英文使用相同章节标识，防止仅更新一端结构。"""
        for versions in DOCUMENTS.values():
            self.assertEqual([s['id'] for s in versions['en']['sections']],
                             [s['id'] for s in versions['zh-Hans']['sections']])
            self.assertEqual([len(s['paragraphs']) for s in versions['en']['sections']],
                             [len(s['paragraphs']) for s in versions['zh-Hans']['sections']])

    def test_full_content_and_working_navigation(self):
        """六份正文和摘要完整生成，目录与文档链接均有真实目标。"""
        for kind, versions in DOCUMENTS.items():
            for language, document in versions.items():
                filename = f'{kind}-{language}.html'
                html = (ROOT / 'public' / filename).read_text()
                page = DocumentParser(html)
                with self.subTest(page=filename):
                    self.assertEqual(page.headings, 1)
                    self.assertEqual(len(page.ids), len(set(page.ids)))
                    self.assertEqual(page.scripts, ['legal/reader.js'])
                    text = ''.join(page.text)
                    self.assertIn(document['displayTitle'], text)
                    if kind != 'support':
                        self.assertIn('notice-title', page.ids)
                        self.assertNotIn('summary-title', page.ids)
                        for internal_or_false_label in ('待审修订稿', 'DRAFT FOR REVIEW', '律师审核通过', '全球合规认证'):
                            self.assertNotIn(internal_or_false_label, text)
                        for notice in document['notices']:
                            self.assertIn(notice, text)
                        for article, section in enumerate(document['sections'], 1):
                            for clause in range(1, len(section['paragraphs']) + 1):
                                self.assertIn(f'class="clause-number">{article}.{clause}</span>', html)
                    for section in document['sections']:
                        self.assertIn(section['id'], page.ids)
                        for paragraph in section['paragraphs']:
                            self.assertIn(re.sub(r"^\d+\.\s*", "", paragraph), text)
                    for link in page.links:
                        self.assertTrue(link)
                        if link.startswith('#'):
                            self.assertIn(link[1:], page.ids)
                        elif not re.match(r'^(https://|mailto:)', link):
                            target = ROOT / 'public' / link
                            self.assertTrue(target.exists() or link in ('index.html', 'zh/index.html'), link)
                    for lang in ('en', 'zh-Hans'):
                        self.assertIn(f'https://glowmuse.top/{kind}-{lang}.html', html)
                    self.assertNotIn('maximum-scale', html)
                    self.assertNotIn('user-scalable=no', html)

    def test_no_template_claims_or_tracking(self):
        """禁止重新加入模板中无证据的承诺、模拟手机框及外部字体脚本。"""
        content = (ROOT / 'src/legal/documents.json').read_text()
        for claim in ('15 个工作日', '15 business days', '杜绝任何肖像泄露', 'Zero cloud database', 'Neural Engine', 'By downloading, accessing, or using'):
            self.assertNotIn(claim, content)
        for file in (ROOT / 'public/legal').iterdir():
            text = file.read_text()
            for token in ('googleapis.com', 'googletagmanager', 'localStorage', 'fetch(', 'XMLHttpRequest', 'DeviceFrameWrapper'):
                self.assertNotIn(token, text)

    def test_built_documents_match_sources(self):
        """双路径构建必须保留完整 HTML 和阅读资源，不产生另一套条款。"""
        for directory in ('dist', 'dist-pages'):
            for path in list((ROOT / 'public').glob('*-*.html')) + list((ROOT / 'public/legal').iterdir()):
                self.assertEqual(path.read_bytes(), (ROOT / directory / path.relative_to(ROOT / 'public')).read_bytes())


if __name__ == '__main__':
    unittest.main()
