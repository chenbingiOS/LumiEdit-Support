import type { Language } from "./types";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeatureStories } from "./components/FeatureStories";
import { GallerySection } from "./components/GallerySection";
import { PrivacySection } from "./components/PrivacySection";
import { FaqSection } from "./components/FaqSection";
import { CtaBanner } from "./components/CtaBanner";
import { Footer } from "./components/Footer";
// 双语页面在构建时分别预渲染，客户端仅接管菜单和画廊。
export default function App({ language = "en" }: { language?: Language }) {
  return (
    <>
      <a className="skip-link" href="#main">
        {language === "zh" ? "跳转到正文" : "Skip to content"}
      </a>
      <Navbar language={language} />
      <main id="main">
        <HeroSection language={language} />
        <FeatureStories language={language} />
        <GallerySection language={language} />
        <PrivacySection language={language} />
        <FaqSection language={language} />
        <CtaBanner language={language} />
      </main>
      <Footer language={language} />
    </>
  );
}
