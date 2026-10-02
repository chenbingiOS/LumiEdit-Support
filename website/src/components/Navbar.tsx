import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { docUrl, homeUrl } from "../data/content";
import type { Language } from "../types";
import { DownloadLink } from "./DownloadLink";
export function Navbar({ language }: { language: Language }) {
  const zh = language === "zh";
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const links = (
    <>
      <a href="#features" onClick={() => setOpen(false)}>
        {zh ? "功能特色" : "Features"}
      </a>
      <a href="#gallery" onClick={() => setOpen(false)}>
        {zh ? "灵感影集" : "Gallery"}
      </a>
      <a href={docUrl("support", language)}>{zh ? "帮助与支持" : "Support"}</a>
    </>
  );
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="nav-inner">
        <a className="wordmark" href={homeUrl(language)}>
          GlowMuse
          <span className="brand-dot" />
          {zh && <span className="brand-zh">微光修图</span>}
        </a>
        <nav
          className="desktop-nav"
          aria-label={zh ? "主导航" : "Main navigation"}
        >
          {links}
        </nav>
        <div className="nav-actions">
          <a
            className="language"
            href={homeUrl(zh ? "en" : "zh")}
            lang={zh ? "en" : "zh-Hans"}
            hrefLang={zh ? "en" : "zh-Hans"}
          >
            {zh ? "EN" : "中文"}
          </a>
          <span className="desktop-download">
            <DownloadLink language={language} compact />
          </span>
          <button
            ref={trigger}
            className="menu-button"
            aria-label={zh ? "菜单" : "Menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        hidden={!open}
        aria-label={zh ? "移动导航" : "Mobile navigation"}
      >
        {links}
        <DownloadLink language={language} />
      </nav>
    </header>
  );
}
