(() => {
  const readPreference = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    } catch {
      return null;
    }
  };

  const savedTheme = readPreference("quality_theme");
  const preferredTheme =
    savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  const savedLanguage = readPreference("quality_language");
  const preferredLanguage = savedLanguage === "en" ? "en" : "ar";

  document.documentElement.dataset.theme = preferredTheme;
  document.documentElement.lang = preferredLanguage;
  document.documentElement.dir = preferredLanguage === "en" ? "ltr" : "rtl";
})();
