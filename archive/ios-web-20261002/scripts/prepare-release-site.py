#!/usr/bin/env python3
"""从应用双语文档生成政策网站，统一联系资料；缺少真实资料时禁止通过发布检查。"""
import argparse
import html
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlparse


def publisher_errors(publisher):
    """验证公开发行字段，不替用户猜测身份；返回可操作的错误列表。"""
    errors = []
    for key in ("developer_name", "support_email", "privacy_url", "support_url", "copyright"):
        if not isinstance(publisher.get(key), str) or not publisher[key].strip():
            errors.append(f"publisher.json 缺少真实字段：{key}")
    email = publisher.get("support_email", "")
    if not isinstance(email, str):
        email = ""
    if email and not re.fullmatch(r"[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+", email):
        errors.append("支持邮箱格式无效")
    for key in ("privacy_url", "support_url"):
        value = publisher.get(key, "")
        if not isinstance(value, str):
            continue
        parsed = urlparse(value)
        if value and (parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password):
            errors.append(f"{key} 必须为无凭据的公开 HTTPS 地址")
        if parsed.hostname and (parsed.hostname in ("localhost", "example.com") or parsed.hostname.endswith(".example.com")):
            errors.append(f"{key} 不能使用本地或示例域名")
    return errors


def document_text(source, language, publisher, email_only=False, omit_contact=False):
    """统一联系段落：协议仅保留邮箱，帮助移除联系渠道及其后全部内容。"""
    title = "联系渠道" if language == "zh-Hans" else "Contact"
    body = source.split(f"\n\n{title}\n", 1)[0].strip()
    if omit_contact:
        return body + "\n"
    fields = [("developer_name", "开发者" if language == "zh-Hans" else "Developer"),
              ("support_email", "支持邮箱" if language == "zh-Hans" else "Support email"),
              ("privacy_url", "隐私政策" if language == "zh-Hans" else "Privacy policy"),
              ("support_url", "帮助与支持" if language == "zh-Hans" else "Support"),
              ("copyright", "版权" if language == "zh-Hans" else "Copyright")]
    if email_only:
        fields = [(key, label) for key, label in fields if key == "support_email"]
    lines = [f"{label}: {publisher[key].strip()}" for key, label in fields
             if isinstance(publisher.get(key), str) and publisher[key].strip()]
    # 尚未收到资料时不把占位联系人写进应用；严格发布模式会单独拒绝缺项。
    if lines:
        body += f"\n\n{title}\n" + "\n".join(lines)
    return body + "\n"


def linked_text(content):
    """将正文中的公开网址和邮箱转为链接，其余文本与链接属性均转义。"""
    pattern = r"https://[^\s<>]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
    parts = []
    cursor = 0
    for match in re.finditer(pattern, content):
        parts.append(html.escape(content[cursor:match.start()]))
        value = match.group()
        # 只允许显式安全协议，避免把任意文本误识别为可执行地址。
        href = value if value.startswith("https://") else "mailto:" + value
        parts.append(f'<a href="{html.escape(href, quote=True)}">{html.escape(value)}</a>')
        cursor = match.end()
    parts.append(html.escape(content[cursor:]))
    return "".join(parts)


def webpage(language, title, content, slug):
    """生成无需脚本和跟踪的静态页面，全部正文转义，防止联系资料被解释为网页代码。"""
    paragraphs = content.strip().split("\n\n")
    body = "".join(f"<p>{linked_text(p)}</p>" for p in paragraphs[1:])
    if slug == "support":
        # 网站与应用复用同一组内置示意图，不将演示包装为真实用户处理效果。
        before, after = ("处理前", "处理后") if language == "zh-Hans" else ("Before", "After")
        caption = "操作示意，实际效果因照片而异。" if language == "zh-Hans" else "Illustration only. Results vary by photo."
        cards = []
        for prefix, label in [("healing", "消除笔" if language == "zh-Hans" else "Healing Brush")]:
            cards.append(f'<section><h2>{label}</h2><div style="display:flex;gap:12px">'
                         f'<figure style="margin:0;flex:1;min-width:0"><img style="width:100%;border-radius:12px" src="images/{prefix}-before.jpg" alt="{label} — {before}"><figcaption>{before}</figcaption></figure>'
                         f'<figure style="margin:0;flex:1;min-width:0"><img style="width:100%;border-radius:12px" src="images/{prefix}-after.jpg" alt="{label} — {after}"><figcaption>{after}</figcaption></figure></div><p>{caption}</p></section>')
        body = "".join(cards) + body
    other_language = "en" if language == "zh-Hans" else "zh-Hans"
    other_label = "English" if language == "zh-Hans" else "简体中文"
    return f'''<!doctype html>
<html lang="{language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><link rel="canonical" href="https://glowmuse.top/{slug}-{language}.html">
<style>body{{font:17px/1.75 -apple-system,BlinkMacSystemFont,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;color:#222;background:#FAFAFA}}h1{{line-height:1.25}}p{{white-space:pre-wrap;overflow-wrap:anywhere}}a,a:visited{{color:#C74529}}nav{{margin:24px 0}}</style></head>
<body><nav><a href="index.html">GlowMuse · 微光修图</a> · <a href="{slug}-{other_language}.html" lang="{other_language}">{other_label}</a></nav><main><h1>{html.escape(title)}</h1>{body}</main></body></html>
'''


def main():
    """默认同步应用联系段落与网页；检查模式只读，严格模式缺少真实发行信息即失败。"""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="只校验内容同步，不写文件")
    parser.add_argument("--require-publisher", action="store_true", help="要求完整真实联系资料和公开地址")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1], help="仓库根目录，支持独立故障验证")
    args = parser.parse_args()
    publisher = json.loads((args.root / "release/publisher.json").read_text())
    errors = publisher_errors(publisher)
    if args.require_publisher and errors:
        raise SystemExit("\n".join(errors))
    expected = {}
    for language in ("en", "zh-Hans"):
        for document, slug in (("Privacy", "privacy"), ("Help", "support"), ("Terms", "terms")):
            source = args.root / f"Resources/{language}.lproj/{document}.txt"
            text = document_text(source.read_text(), language, publisher, email_only=document in ("Privacy", "Terms"), omit_contact=document == "Help")
            expected[source] = text
            expected[args.root / f"release/site/{slug}-{language}.html"] = webpage(language, text.splitlines()[0], text, slug)
    index = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GlowMuse · 微光修图</title><link rel="canonical" href="https://glowmuse.top/"><style>body{color:#222;background:#FAFAFA}a,a:visited{color:#C74529}</style></head>
<body style="font:18px/1.8 -apple-system,sans-serif;max-width:760px;margin:40px auto;padding:24px"><main><h1>GlowMuse · 微光修图</h1><p>Local photo editing. 本地照片编辑。</p><ul><li><a href="terms-en.html">Terms of use</a></li><li><a href="privacy-en.html">Privacy policy</a></li><li><a href="support-en.html">Help &amp; support</a></li><li><a href="terms-zh-Hans.html">用户协议</a></li><li><a href="privacy-zh-Hans.html">隐私政策</a></li><li><a href="support-zh-Hans.html">帮助与支持</a></li></ul></main></body></html>
"""
    expected[args.root / "release/site/index.html"] = index
    # 二进制图片也参与同步检查，阻止只更新网页路径却漏发素材。
    for prefix, asset, filename in [("healing", "HealingDemo", "wall.jpg")]:
        for state in ["Before", "After"]:
            expected[args.root / f"release/site/images/{prefix}-{state.lower()}.jpg"] = (
                args.root / f"Resources/Assets.xcassets/{asset}{state}.imageset/{filename}"
            ).read_bytes()
    drift = []
    for path, content in expected.items():
        if args.check:
            if not path.exists() or (path.read_bytes() if isinstance(content, bytes) else path.read_text()) != content:
                drift.append(str(path.relative_to(args.root)))
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            if isinstance(content, bytes):
                path.write_bytes(content)
            else:
                path.write_text(content)
    if drift:
        raise SystemExit("政策/网站不同步，请运行 prepare-release-site.py：\n" + "\n".join(drift))
    print("双语政策与网站同步检查通过。" if args.check else "双语政策与网站已生成。")
    if errors:
        print("发行资料仍有缺项或无效值；使用 --require-publisher 核实：\n" + "\n".join(errors))


if __name__ == "__main__":
    main()
