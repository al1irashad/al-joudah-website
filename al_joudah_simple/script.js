const CONFIG = {
  businessName: "مغاسل الجودة الآلية",
  phoneDisplay: "0563010660",
  phoneInternational: "966563010660",
  pricePerSquareMeter: 8,
  address: "2975 شارع الحمدانية، حي الحمدانية، جدة 23743",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=2975+Al+Hamadaniyyah+Jeddah+23743",
  hours: "السبت – الخميس، 10:00 ص – 10:00 م",
};

const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};

const currentLanguage = () => window.QualityI18n?.getLanguage?.() || "ar";
const translate = (text) => window.QualityI18n?.t?.(text) || text;

const formatNumber = (value, decimals = 0) =>
  new Intl.NumberFormat(currentLanguage() === "en" ? "en-US" : "ar-SA", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Number(value) || 0);

const normalizeDigits = (value = "") =>
  String(value)
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit));

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.phoneInternational}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  const text = toast.querySelector("span");
  if (text) text.textContent = translate(message);
  toast.classList.add("show");
  clearTimeout(window.qualityToastTimer);
  window.qualityToastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons({
      attrs: {
        "aria-hidden": "true",
        "stroke-width": 1.8,
      },
    });
  }
}

function initPreferenceControls() {
  const actions = document.querySelector(".nav-actions");
  if (!actions || actions.querySelector("[data-preference-controls]")) return;

  const controls = document.createElement("div");
  controls.className = "utility-controls";
  controls.dataset.preferenceControls = "";
  controls.innerHTML = `
    <button class="utility-btn" type="button" data-theme-toggle>
      <i data-lucide="moon"></i>
    </button>
    <button class="utility-btn language-btn" type="button" data-language-toggle>EN</button>
  `;
  actions.prepend(controls);

  const themeButton = controls.querySelector("[data-theme-toggle]");
  const languageButton = controls.querySelector("[data-language-toggle]");

  const update = () => {
    const language = currentLanguage();
    const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    if (themeButton) {
      themeButton.innerHTML = `<i data-lucide="${theme === "dark" ? "sun" : "moon"}"></i>`;
      themeButton.setAttribute(
        "aria-label",
        language === "en"
          ? theme === "dark"
            ? "Switch to light theme"
            : "Switch to dark theme"
          : theme === "dark"
            ? "تفعيل الوضع النهاري"
            : "تفعيل الوضع الليلي",
      );
      themeButton.title = themeButton.getAttribute("aria-label");
    }
    if (languageButton) {
      languageButton.textContent = language === "en" ? "AR" : "EN";
      languageButton.setAttribute(
        "aria-label",
        language === "en" ? "Switch to Arabic" : "Switch to English",
      );
      languageButton.title = languageButton.getAttribute("aria-label");
    }
    refreshIcons();
  };

  themeButton?.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storage.set("quality_theme", next);
    update();
    showToast(next === "dark" ? "تم تفعيل الوضع الليلي" : "تم تفعيل الوضع النهاري");
  });

  languageButton?.addEventListener("click", () => {
    window.QualityI18n?.setLanguage(currentLanguage() === "en" ? "ar" : "en");
    update();
    initGlobalLinks();
    renderCalculator();
    refreshIcons();
  });

  document.addEventListener("quality:languagechange", update);
  update();
}

function injectDeveloperCredit() {
  const footer = document.querySelector(".footer-bottom");
  if (!footer || footer.querySelector(".developer-credit")) return;
  const credit = document.createElement("span");
  credit.className = "developer-credit";
  credit.innerHTML =
    '<i data-lucide="code-2"></i><span>Designed &amp; developed by <strong>Rashad Al1i</strong></span>';
  footer.append(credit);
}

function initWashLab() {
  const root = document.querySelector("[data-wash-lab]");
  if (!root) return;

  const stages = {
    ar: [
      {
        short: "الفحص",
        title: "الفحص الذكي",
        description: "نتعرّف على النسيج والبقع والمناطق التي تحتاج عناية إضافية.",
        icon: "scan-search",
      },
      {
        short: "الغبار",
        title: "وداعاً للغبار",
        description: "يهتز الغبار خارج الألياف قبل أن تصل قطرة ماء واحدة إلى السجادة.",
        icon: "wind",
      },
      {
        short: "المنظف",
        title: "رغوة محسوبة",
        description: "تُوزّع مادة التنظيف المناسبة بانتظام على المساحة التي تحتاجها.",
        icon: "flask-conical",
      },
      {
        short: "الفرك",
        title: "رقصة الفُرش الآلية",
        description: "تعمل الفُرش بحركة متوازنة لتفكيك الأوساخ من دون عشوائية.",
        icon: "settings-2",
      },
      {
        short: "الشطف",
        title: "شطف وشفط",
        description: "تخرج الرغوة وما حملته من أوساخ، وتبدأ الألوان بالعودة إلى حضورها.",
        icon: "waves",
      },
      {
        short: "الجاهزية",
        title: "جاهزة للعودة إلى البيت",
        description: "تجفيف وتمشيط وفحص أخير؛ ثم لمعة صغيرة تقول إن الرحلة اكتملت.",
        icon: "sparkles",
      },
    ],
    en: [
      {
        short: "Inspect",
        title: "Smart inspection",
        description: "We identify the fabric, stains, and areas that need extra care.",
        icon: "scan-search",
      },
      {
        short: "Dust",
        title: "Dust, be gone",
        description: "Loose dust is shaken from the fibers before a single drop of water arrives.",
        icon: "wind",
      },
      {
        short: "Foam",
        title: "Measured foam",
        description: "The right cleaning solution is distributed evenly where it is needed.",
        icon: "flask-conical",
      },
      {
        short: "Scrub",
        title: "The brush dance",
        description: "Automated brushes move in balance to loosen dirt without guesswork.",
        icon: "settings-2",
      },
      {
        short: "Rinse",
        title: "Rinse & extract",
        description: "Foam and suspended dirt leave together as the colors return to life.",
        icon: "waves",
      },
      {
        short: "Ready",
        title: "Ready to come home",
        description: "Drying, grooming, and one last check—then a tiny sparkle says it is done.",
        icon: "sparkles",
      },
    ],
  };

  const machine = root.querySelector("[data-machine-stage]");
  const buttons = [...root.querySelectorAll("[data-lab-step]")];
  const toggle = root.querySelector("[data-lab-toggle]");
  const toggleLabel = root.querySelector("[data-lab-toggle-label]");
  const title = root.querySelector("[data-lab-title]");
  const description = root.querySelector("[data-lab-description]");
  const counter = root.querySelector("[data-lab-counter]");
  const icon = root.querySelector("[data-lab-icon]");
  const progress = root.querySelector("[data-lab-progress]");
  let active = 0;
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = null;

  const render = () => {
    const language = currentLanguage();
    const items = stages[language];
    const stage = items[active];
    machine.className = `machine-stage stage-${active + 1}`;
    buttons.forEach((button, index) => {
      const selected = index === active;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
      const label = button.querySelector("strong");
      if (label) label.textContent = items[index].short;
    });
    if (title) title.textContent = stage.title;
    if (description) description.textContent = stage.description;
    if (counter) {
      counter.textContent =
        language === "en"
          ? `Stage ${active + 1} of ${items.length}`
          : `المرحلة ${active + 1} من ${items.length}`;
    }
    if (icon) icon.innerHTML = `<i data-lucide="${stage.icon}"></i>`;
    if (progress) progress.style.width = `${((active + 1) / items.length) * 100}%`;
    if (toggleLabel) {
      toggleLabel.textContent =
        language === "en"
          ? paused
            ? "Play show"
            : "Pause show"
          : paused
            ? "تشغيل العرض"
            : "إيقاف العرض";
    }
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(paused));
      const toggleIcon = toggle.querySelector("i, svg");
      if (toggleIcon) toggleIcon.outerHTML = `<i data-lucide="${paused ? "play" : "pause"}"></i>`;
    }
    refreshIcons();
  };

  const schedule = () => {
    clearInterval(timer);
    if (paused) return;
    timer = setInterval(() => {
      active = (active + 1) % stages.ar.length;
      render();
    }, 3200);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      active = Number(button.dataset.labStep) || 0;
      render();
      schedule();
    });
  });

  toggle?.addEventListener("click", () => {
    paused = !paused;
    render();
    schedule();
  });

  document.addEventListener("quality:languagechange", render);
  render();
  schedule();
}

function initGlobalLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const customMessage = link.dataset.message;
    const message =
      customMessage ||
      (currentLanguage() === "en"
        ? "Hello, I would like to ask about Al Joudah Automated Laundry services."
        : `السلام عليكم، أرغب في الاستفسار عن خدمات ${CONFIG.businessName}.`);
    link.href = whatsappUrl(
      currentLanguage() === "en" ? translate(message) : message,
    );
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-call]").forEach((link) => {
    link.href = `tel:+${CONFIG.phoneInternational}`;
  });

  document.querySelectorAll("[data-maps]").forEach((link) => {
    link.href = CONFIG.mapsUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

function initHeader() {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector("[data-scroll-progress]");
  const scrollTop = document.querySelector("[data-scroll-top]");
  const menu = document.querySelector("[data-nav-links]");
  const toggle = document.querySelector("[data-menu-toggle]");
  const updateMenuLabel = () => {
    if (!toggle) return;
    const open = Boolean(menu?.classList.contains("open"));
    const english = currentLanguage() === "en";
    toggle.setAttribute(
      "aria-label",
      english
        ? open
          ? "Close navigation menu"
          : "Open navigation menu"
        : open
          ? "إغلاق قائمة التنقل"
          : "فتح قائمة التنقل",
    );
  };

  const updateScroll = () => {
    const top = window.scrollY;
    header?.classList.toggle("scrolled", top > 15);
    scrollTop?.classList.toggle("visible", top > 600);

    if (progress) {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${height > 0 ? Math.min(100, (top / height) * 100) : 0}%`;
    }
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  toggle?.addEventListener("click", () => {
    const open = menu?.classList.toggle("open");
    document.body.classList.toggle("menu-open", Boolean(open));
    toggle.setAttribute("aria-expanded", String(Boolean(open)));
    updateMenuLabel();
    toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    refreshIcons();
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle?.setAttribute("aria-expanded", "false");
      if (toggle) toggle.innerHTML = '<i data-lucide="menu"></i>';
      updateMenuLabel();
      refreshIcons();
    });
  });

  document.addEventListener("quality:languagechange", updateMenuLabel);

  scrollTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const pageName = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-links] a").forEach((link) => {
    const linkName = (link.getAttribute("href") || "").split("#")[0];
    const isHome =
      (pageName === "" || pageName === "index.html") &&
      (linkName === "index.html" || linkName === "./");
    link.classList.toggle("active", isHome || linkName === pageName);
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 },
  );

  items.forEach((item) => observer.observe(item));
}

function initFaq() {
  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      item
        .closest(".faq-list")
        ?.querySelectorAll(".faq-item")
        .forEach((entry) => {
          entry.classList.remove("open");
          entry.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
        });
      if (!wasOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}

function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabsRoot) => {
    const buttons = tabsRoot.querySelectorAll("[data-tab]");
    const panels = tabsRoot.querySelectorAll("[data-tab-panel]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;
        buttons.forEach((entry) => {
          entry.classList.toggle("active", entry === button);
          entry.setAttribute("aria-selected", String(entry === button));
        });
        panels.forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.tabPanel === target);
        });
      });
    });
  });
}

function initQuickOrder() {
  const modal = document.querySelector("[data-quick-modal]");
  if (!modal) return;

  const form = modal.querySelector("form");
  const openModal = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    setTimeout(() => modal.querySelector("input")?.focus(), 120);
  };
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  document
    .querySelectorAll("[data-open-order]")
    .forEach((button) => button.addEventListener("click", openModal));
  modal
    .querySelectorAll("[data-close-modal]")
    .forEach((button) => button.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const draft = {
      name: String(data.get("name") || "").trim(),
      phone: normalizeDigits(data.get("phone") || "").replace(/\D/g, ""),
      district: String(data.get("district") || "").trim(),
      service: String(data.get("service") || "تنظيف سجاد منزلي"),
    };

    if (!draft.name || draft.phone.length < 9) {
      showToast("أدخل الاسم ورقم جوال صحيحاً لإكمال الطلب");
      return;
    }

    storage.set("quality_booking_draft", draft);
    location.href = "booking.html";
  });
}

let calculatorItems = [];

function removeQualityCarpet(targetIndex) {
  const index = Number(targetIndex);
  if (!Number.isInteger(index) || index < 0 || index >= calculatorItems.length) return;
  calculatorItems.splice(index, 1);
  storage.set("quality_cart", calculatorItems);
  renderCalculator();
}

function calculatorTotals() {
  const totalArea = calculatorItems.reduce((sum, item) => sum + item.area, 0);
  const total = totalArea * CONFIG.pricePerSquareMeter;
  return { totalArea, total };
}

function renderCalculator() {
  const list = document.querySelector("[data-calc-list]");
  if (!list) return;
  const empty = document.querySelector("[data-calc-empty]");
  const count = document.querySelector("[data-calc-count]");
  const area = document.querySelector("[data-calc-area]");
  const total = document.querySelector("[data-calc-total]");
  const { totalArea, total: totalPrice } = calculatorTotals();

  list.innerHTML = calculatorItems
    .map(
      (item, index) => `
        <div class="carpet-line">
          <div>
            <strong>${translate("سجادة")} ${formatNumber(index + 1)}</strong>
            <span>${formatNumber(item.length, 1)} × ${formatNumber(item.width, 1)} ${currentLanguage() === "en" ? "m" : "م"}</span>
            <span>${formatNumber(item.area, 2)} ${currentLanguage() === "en" ? "m²" : "م²"}</span>
            <span>${formatNumber(item.area * CONFIG.pricePerSquareMeter)} ${currentLanguage() === "en" ? "SAR" : "ر.س"}</span>
          </div>
          <button class="icon-btn" type="button" data-remove-carpet="${index}" onclick="removeQualityCarpet(${index})" aria-label="${currentLanguage() === "en" ? "Remove carpet" : "حذف السجادة"}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `,
    )
    .join("");

  empty?.classList.toggle("hidden", calculatorItems.length > 0);
  if (count) count.textContent = formatNumber(calculatorItems.length);
  if (area) {
    area.textContent = `${formatNumber(totalArea, 2)} ${currentLanguage() === "en" ? "m²" : "م²"}`;
  }
  if (total) {
    total.innerHTML = `${formatNumber(totalPrice)} <small>${currentLanguage() === "en" ? "SAR approx." : "ر.س تقريباً"}</small>`;
  }

  window.QualityI18n?.apply(list);
  refreshIcons();
}

function initCalculator() {
  const form = document.querySelector("[data-calculator-form]");
  if (!form) return;

  calculatorItems = storage.get("quality_cart", []);
  renderCalculator();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const lengthInput = form.querySelector("[name='length']");
    const widthInput = form.querySelector("[name='width']");
    const length = Number(normalizeDigits(lengthInput.value).replace(",", "."));
    const width = Number(normalizeDigits(widthInput.value).replace(",", "."));

    if (!length || !width || length <= 0 || width <= 0 || length > 100 || width > 100) {
      showToast("أدخل طولاً وعرضاً صحيحين بالمتر");
      return;
    }

    calculatorItems.push({
      id: Date.now(),
      length,
      width,
      area: length * width,
    });
    storage.set("quality_cart", calculatorItems);
    lengthInput.value = "";
    widthInput.value = "";
    lengthInput.focus();
    renderCalculator();
    showToast("تمت إضافة السجادة إلى التقدير");
  });

  document.querySelector("[data-book-cart]")?.addEventListener("click", () => {
    if (!calculatorItems.length) {
      showToast("أضف سجادة واحدة على الأقل قبل المتابعة");
      return;
    }
    location.href = "booking.html";
  });
}

function bookingCartFromForm() {
  const length = Number(
    normalizeDigits(document.querySelector("[name='booking_length']")?.value || "").replace(
      ",",
      ".",
    ),
  );
  const width = Number(
    normalizeDigits(document.querySelector("[name='booking_width']")?.value || "").replace(
      ",",
      ".",
    ),
  );
  if (!length || !width || length <= 0 || width <= 0) return [];
  return [{ id: Date.now(), length, width, area: length * width }];
}

function createOrderCode() {
  const now = new Date();
  const datePart = `${String(now.getFullYear()).slice(-2)}${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `QD-${datePart}-${randomPart}`;
}

function bookingMessage(order) {
  if (currentLanguage() === "en") {
    return [
      "Hello, this is a new request from the Al Joudah Automated Laundry website:",
      `Order number: ${order.code}`,
      `Name: ${order.name}`,
      `Mobile: ${order.phone}`,
      `Service: ${translate(order.service)}`,
      `District: ${order.district}`,
      `Preferred date: ${order.date || "To be confirmed"}`,
      `Handover: ${translate(order.fulfilment)}`,
      `Carpets: ${order.items.length}`,
      `Total area: ${order.area.toFixed(2)} m²`,
      `Initial estimate: ${Math.round(order.estimate)} SAR`,
      `Notes: ${order.notes || "None"}`,
      "",
      "Please confirm the appointment and final cost.",
    ].join("\n");
  }
  const lines = [
    `السلام عليكم، هذا طلب جديد من موقع ${CONFIG.businessName}:`,
    `رقم الطلب: ${order.code}`,
    `الاسم: ${order.name}`,
    `الجوال: ${order.phone}`,
    `نوع الخدمة: ${order.service}`,
    `الحي: ${order.district}`,
    `الموعد المفضل: ${order.date || "يُحدد بالتواصل"}`,
    `طريقة التسليم: ${order.fulfilment}`,
    `عدد السجاد: ${order.items.length}`,
    `إجمالي المساحة: ${order.area.toFixed(2)} م²`,
    `التقدير الأولي: ${Math.round(order.estimate)} ر.س`,
    `ملاحظات: ${order.notes || "لا توجد"}`,
    "",
    "أرجو تأكيد الموعد والتكلفة النهائية.",
  ];
  return lines.join("\n");
}

function initBooking() {
  const root = document.querySelector("[data-booking]");
  if (!root) return;

  const pages = [...root.querySelectorAll("[data-wizard-page]")];
  const stepNodes = [...root.querySelectorAll("[data-wizard-step]")];
  const draft = storage.get("quality_booking_draft", {});
  let items = storage.get("quality_cart", []);
  let currentStep = 1;

  const nameInput = root.querySelector("[name='name']");
  const phoneInput = root.querySelector("[name='phone']");
  const districtInput = root.querySelector("[name='district']");
  if (nameInput && draft.name) nameInput.value = draft.name;
  if (phoneInput && draft.phone) phoneInput.value = draft.phone;
  if (districtInput && draft.district) districtInput.value = draft.district;
  if (draft.service) {
    const serviceInput = root.querySelector(
      `[name='service'][value='${CSS.escape(draft.service)}']`,
    );
    if (serviceInput) serviceInput.checked = true;
  }

  const dateInput = root.querySelector("[name='date']");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split("T")[0];
  }

  const updateSummary = () => {
    const formCart = bookingCartFromForm();
    const activeItems = items.length ? items : formCart;
    const area = activeItems.reduce((sum, item) => sum + item.area, 0);
    const estimate = area * CONFIG.pricePerSquareMeter;
    const service =
      root.querySelector("[name='service']:checked")?.value || "تنظيف سجاد منزلي";

    const countNode = document.querySelector("[data-booking-count]");
    const areaNode = document.querySelector("[data-booking-area]");
    const priceNode = document.querySelector("[data-booking-price]");
    const serviceNode = document.querySelector("[data-booking-service]");
    if (countNode) countNode.textContent = formatNumber(activeItems.length);
    if (areaNode) {
      areaNode.textContent = `${formatNumber(area, 2)} ${currentLanguage() === "en" ? "m²" : "م²"}`;
    }
    if (priceNode) {
      priceNode.textContent = `${formatNumber(estimate)} ${currentLanguage() === "en" ? "SAR" : "ر.س"}`;
    }
    if (serviceNode) serviceNode.textContent = translate(service);
    return { activeItems, area, estimate, service };
  };

  document.addEventListener("quality:languagechange", updateSummary);

  const showStep = (step) => {
    currentStep = Math.max(1, Math.min(3, step));
    pages.forEach((page) =>
      page.classList.toggle("active", Number(page.dataset.wizardPage) === currentStep),
    );
    stepNodes.forEach((node) => {
      const nodeStep = Number(node.dataset.wizardStep);
      node.classList.toggle("active", nodeStep === currentStep);
      node.classList.toggle("done", nodeStep < currentStep);
    });
    updateSummary();
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  root.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", updateSummary);
    input.addEventListener("change", updateSummary);
  });

  root.querySelectorAll("[data-next-step]").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep === 1) {
        const summary = updateSummary();
        if (!summary.activeItems.length || summary.area <= 0) {
          showToast("أدخل أبعاد السجاد أو ابدأ من الحاسبة");
          return;
        }
        if (!items.length) {
          items = summary.activeItems;
          storage.set("quality_cart", items);
        }
      }

      if (currentStep === 2) {
        const name = String(nameInput?.value || "").trim();
        const phone = normalizeDigits(phoneInput?.value || "").replace(/\D/g, "");
        const district = String(districtInput?.value || "").trim();
        if (!name || phone.length < 9 || !district) {
          showToast("أكمل الاسم ورقم الجوال والحي");
          return;
        }
      }
      showStep(currentStep + 1);
    });
  });

  root.querySelectorAll("[data-prev-step]").forEach((button) => {
    button.addEventListener("click", () => showStep(currentStep - 1));
  });

  root.querySelector("[data-submit-booking]")?.addEventListener("click", () => {
    const summary = updateSummary();
    const formData = new FormData(root.querySelector("form"));
    const order = {
      code: createOrderCode(),
      name: String(formData.get("name") || "").trim(),
      phone: normalizeDigits(formData.get("phone") || "").replace(/\D/g, ""),
      district: String(formData.get("district") || "").trim(),
      date: String(formData.get("date") || ""),
      service: summary.service,
      fulfilment: String(formData.get("fulfilment") || "تسليم إلى الفرع"),
      notes: String(formData.get("notes") || "").trim(),
      items: summary.activeItems,
      area: summary.area,
      estimate: summary.estimate,
      status: 1,
      createdAt: new Date().toISOString(),
    };

    const orders = storage.get("quality_orders", []);
    orders.unshift(order);
    storage.set("quality_orders", orders.slice(0, 12));
    storage.set("quality_last_order", order.code);
    storage.set("quality_cart", []);
    storage.set("quality_booking_draft", {});

    const bookingShell = document.querySelector(".booking-shell");
    const success = document.querySelector("[data-booking-success]");
    if (bookingShell) bookingShell.classList.add("hidden");
    if (success) {
      success.classList.remove("hidden");
      const code = success.querySelector("[data-success-code]");
      const link = success.querySelector("[data-send-order]");
      if (code) code.textContent = order.code;
      if (link) link.href = whatsappUrl(bookingMessage(order));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshIcons();
  });

  document.querySelector("[data-copy-code]")?.addEventListener("click", async () => {
    const code = document.querySelector("[data-success-code]")?.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
      showToast("تم نسخ رقم الطلب");
    } catch {
      showToast(`رقم الطلب: ${code}`);
    }
  });

  updateSummary();
  showStep(1);
}

function demoOrder(code) {
  if (code !== "QD-DEMO") return null;
  return {
    code: "QD-DEMO",
    name: "طلب تجريبي",
    phone: "05XXXXXXXX",
    district: "حي الحمدانية",
    service: "تنظيف سجاد منزلي",
    fulfilment: "تأكيد الاستلام بالتواصل",
    items: [{ area: 12 }],
    area: 12,
    estimate: 96,
    status: 3,
    createdAt: new Date().toISOString(),
    demo: true,
  };
}

function renderTracking(order) {
  const result = document.querySelector("[data-tracking-result]");
  if (!result) return;
  const empty = document.querySelector("[data-tracking-empty]");
  const content = document.querySelector("[data-tracking-content]");
  empty?.classList.add("hidden");
  content?.classList.remove("hidden");

  const nodes = {
    code: content?.querySelector("[data-track-code]"),
    name: content?.querySelector("[data-track-name]"),
    service: content?.querySelector("[data-track-service]"),
    estimate: content?.querySelector("[data-track-estimate]"),
    date: content?.querySelector("[data-track-date]"),
    note: content?.querySelector("[data-track-note]"),
    progress: content?.querySelector("[data-timeline-progress]"),
  };

  if (nodes.code) nodes.code.textContent = order.code;
  if (nodes.name) nodes.name.textContent = translate(order.name);
  if (nodes.service) nodes.service.textContent = translate(order.service);
  if (nodes.estimate) {
    nodes.estimate.textContent = `${formatNumber(order.estimate)} ${currentLanguage() === "en" ? "SAR" : "ر.س"}`;
  }
  if (nodes.date) {
    nodes.date.textContent = order.date
      ? new Intl.DateTimeFormat(currentLanguage() === "en" ? "en-US" : "ar-SA", {
          dateStyle: "long",
        }).format(
          new Date(`${order.date}T12:00:00`),
        )
      : translate("يُحدد بالتواصل");
  }
  if (nodes.note) {
    const note = order.demo
      ? "هذه معاينة توضيحية لشكل التتبع. الطلبات التي تُنشئها من صفحة الحجز تُحفظ وتظهر هنا على جهازك."
      : "تم استلام طلبك رقمياً. يُرجى إرسال تفاصيله عبر واتساب لتأكيد الموعد وتحديث الحالة مع فريق المغسلة.";
    nodes.note.textContent = translate(note);
  }

  const status = Math.max(1, Math.min(5, Number(order.status) || 1));
  content?.querySelectorAll("[data-timeline-step]").forEach((step) => {
    const value = Number(step.dataset.timelineStep);
    step.classList.toggle("done", value < status);
    step.classList.toggle("active", value === status);
  });
  if (nodes.progress) nodes.progress.style.width = `${((status - 1) / 4) * 80}%`;

  const support = content?.querySelector("[data-track-support]");
  if (support) {
    support.href = whatsappUrl(
      currentLanguage() === "en"
        ? `Hello, I would like to ask about order ${order.code}.`
        : `السلام عليكم، أريد الاستفسار عن حالة الطلب رقم ${order.code}.`,
    );
  }
  result.classList.remove("hidden");
  refreshIcons();
}

function initTracking() {
  const form = document.querySelector("[data-track-form]");
  if (!form) return;
  const input = form.querySelector("input");
  let activeOrder = null;

  const lookup = (rawCode) => {
    const code = normalizeDigits(rawCode).trim().toUpperCase();
    if (!code) {
      showToast("أدخل رقم الطلب أولاً");
      return;
    }
    const orders = storage.get("quality_orders", []);
    const order = orders.find((entry) => entry.code.toUpperCase() === code) || demoOrder(code);
    const empty = document.querySelector("[data-tracking-empty]");
    const content = document.querySelector("[data-tracking-content]");

    if (!order) {
      activeOrder = null;
      content?.classList.add("hidden");
      empty?.classList.remove("hidden");
      document.querySelector("[data-tracking-result]")?.classList.remove("hidden");
      const help = empty?.querySelector("[data-missing-help]");
      if (help) {
        help.href = whatsappUrl(
          currentLanguage() === "en"
            ? `Hello, I need help finding my order. Entered number: ${code}`
            : `السلام عليكم، أحتاج مساعدة في العثور على طلبي. الرقم المدخل: ${code}`,
        );
      }
      refreshIcons();
      return;
    }
    activeOrder = order;
    renderTracking(order);
  };

  document.addEventListener("quality:languagechange", () => {
    if (activeOrder) renderTracking(activeOrder);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    lookup(input.value);
  });

  const queryOrder = new URLSearchParams(location.search).get("order");
  const lastOrder = storage.get("quality_last_order", "");
  const initialOrder = queryOrder || lastOrder;
  if (initialOrder) {
    input.value = initialOrder;
    lookup(initialOrder);
  }
}

function initBusinessForm() {
  const form = document.querySelector("[data-business-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = normalizeDigits(data.get("phone") || "").replace(/\D/g, "");
    const organization = String(data.get("organization") || "").trim();
    const type = String(data.get("type") || "");
    const details = String(data.get("details") || "").trim();

    if (!name || phone.length < 9 || !organization) {
      showToast("أكمل الاسم والجوال واسم المنشأة");
      return;
    }

    const message =
      currentLanguage() === "en"
        ? [
            "Hello, I would like a business-service quote from Al Joudah Automated Laundry.",
            `Name: ${name}`,
            `Mobile: ${phone}`,
            `Business: ${organization}`,
            `Business type: ${translate(type)}`,
            `Request details: ${details || "To be discussed"}`,
          ].join("\n")
        : [
            `السلام عليكم، أطلب عرضاً لخدمات المنشآت من ${CONFIG.businessName}.`,
            `الاسم: ${name}`,
            `الجوال: ${phone}`,
            `المنشأة: ${organization}`,
            `نوع المنشأة: ${type}`,
            `تفاصيل الطلب: ${details || "تُناقش بالتواصل"}`,
          ].join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = normalizeDigits(data.get("phone") || "").replace(/\D/g, "");
    const subject = String(data.get("subject") || "استفسار عام");
    const message = String(data.get("message") || "").trim();

    if (!name || phone.length < 9 || !message) {
      showToast("أكمل الاسم ورقم الجوال وتفاصيل الرسالة");
      return;
    }

    const text =
      currentLanguage() === "en"
        ? [
            "Hello, I have an inquiry through the Al Joudah Automated Laundry website.",
            `Name: ${name}`,
            `Mobile: ${phone}`,
            `Inquiry type: ${translate(subject)}`,
            `Details: ${message}`,
          ].join("\n")
        : [
            `السلام عليكم، لدي استفسار عبر موقع ${CONFIG.businessName}.`,
            `الاسم: ${name}`,
            `الجوال: ${phone}`,
            `نوع الاستفسار: ${subject}`,
            `التفاصيل: ${message}`,
          ].join("\n");

    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  });
}

function initRecentOrder() {
  const banner = document.querySelector("[data-recent-order]");
  if (!banner) return;
  const code = storage.get("quality_last_order", "");
  if (!code) return;
  banner.classList.remove("hidden");
  const codeNode = banner.querySelector("[data-recent-code]");
  if (codeNode) codeNode.textContent = code;
  const link = banner.querySelector("a");
  if (link) link.href = `track.html?order=${encodeURIComponent(code)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initGlobalLinks();
  initHeader();
  initPreferenceControls();
  injectDeveloperCredit();
  window.QualityI18n?.init();
  initReveal();
  initFaq();
  initTabs();
  initWashLab();
  initQuickOrder();
  initCalculator();
  initBooking();
  initTracking();
  initBusinessForm();
  initContactForm();
  initRecentOrder();
  window.QualityI18n?.apply();
  refreshIcons();
});

window.CONFIG = CONFIG;
window.removeQualityCarpet = removeQualityCarpet;
