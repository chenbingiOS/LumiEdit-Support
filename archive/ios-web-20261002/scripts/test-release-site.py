#!/usr/bin/env python3
"""验证政策联系段落的生成约束、重复生成和网页转义。"""
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location("release_site", Path(__file__).with_name("prepare-release-site.py"))
site = importlib.util.module_from_spec(spec)
spec.loader.exec_module(site)


class LegalDocumentTests(unittest.TestCase):
    """确保真实配置将来补齐后也不会在协议末尾重新加入额外字段。"""

    def setUp(self):
        """使用完整的虚拟发行资料，覆盖当前空字段无法暴露的追加回归。"""
        self.publisher = {
            "developer_name": "Test Publisher", "copyright": "Test Copyright",
            "support_email": "support@example.test",
            "privacy_url": "https://example.test/privacy",
            "support_url": "https://example.test/support",
        }

    def test_legal_footer_contains_email_only_and_is_idempotent(self):
        """中英文旧联系段落替换后只有邮箱，二次生成保持完全一致。"""
        for language, title, label in [("en", "Contact", "Support email"), ("zh-Hans", "联系渠道", "支持邮箱")]:
            source = f"Title\n\nBody\n\n{title}\nOld website: https://old.example.test\n"
            result = site.document_text(source, language, self.publisher, email_only=True)
            self.assertEqual(result, f"Title\n\nBody\n\n{title}\n{label}: support@example.test\n")
            self.assertEqual(site.document_text(result, language, self.publisher, email_only=True), result)

    def test_help_removes_contact_section_and_legal_links(self):
        """中英文帮助移除联系渠道及其后内容，重复生成不能恢复协议链接。"""
        for language, title in [("en", "Contact"), ("zh-Hans", "联系渠道")]:
            source = f"Title\n\nBody\n\n{title}\nOld email and links\n\nExtra section"
            result = site.document_text(source, language, self.publisher, omit_contact=True)
            self.assertEqual(result, "Title\n\nBody\n")
            self.assertEqual(site.document_text(result, language, self.publisher, omit_contact=True), result)
            page = site.webpage(language, "Title", result, "support")
            self.assertNotIn("mailto:", page)
            self.assertNotIn("privacy", page)
            self.assertNotIn("terms", page)
            self.assertEqual(page.count("<img "), 2)
            self.assertNotIn("images/acne-", page)
            self.assertNotIn("Acne Removal", page)
            self.assertNotIn("祛痘", page)

    def test_generated_legal_pages_end_with_mail_link_only(self):
        """使用真实双语文件生成协议网页，最后正文段落只能包含可点击的支持邮箱。"""
        root = Path(__file__).resolve().parents[1]
        for language, label in [("en", "Support email"), ("zh-Hans", "支持邮箱")]:
            for document, slug in [("Privacy", "privacy"), ("Terms", "terms")]:
                source = (root / f"Resources/{language}.lproj/{document}.txt").read_text()
                content = site.document_text(source, language, self.publisher, email_only=True)
                page = site.webpage(language, content.splitlines()[0], content, slug)
                footer = page.rsplit("<p>", 1)[1].split("</p>", 1)[0]
                self.assertIn(f'{label}: <a href="mailto:support@example.test">support@example.test</a>', footer)
                self.assertEqual(footer.count("<a "), 1)
                self.assertNotIn("https://", footer)
                self.assertNotIn("Test Publisher", footer)
                self.assertNotIn("Test Copyright", footer)

    def test_webpage_escapes_body_markup(self):
        """正文中的标签必须作为普通文本显示，不能被当成网页脚本执行。"""
        page = site.webpage("en", "Title", 'Title\n\n<script>alert("x")</script>', "privacy")
        self.assertNotIn("<script>", page)
        self.assertIn("&lt;script&gt;", page)


if __name__ == "__main__":
    unittest.main()
