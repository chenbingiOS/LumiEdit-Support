import { APP_STORE_URL } from "../data/content";
import type { Language } from "../types";
export function DownloadLink({
  language,
  compact = false,
}: {
  language: Language;
  compact?: boolean;
}) {
  return (
    <a
      className={compact ? "download-link compact" : "download-link"}
      href={APP_STORE_URL}
    >
      <span>
        {language === "zh" ? "前往 App Store" : "View on the App Store"}
      </span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
