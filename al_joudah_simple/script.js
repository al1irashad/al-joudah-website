// ============================================
// CONFIGURATION - الإعدادات المركزية
// ============================================
// جميع القيم المهمة في مكان واحد - غيّر هنا فقط!

const CONFIG = {
  // معلومات الاتصال
  PHONE_NUMBER: '0563010660',           // رقم الهاتف الرئيسي
  WHATSAPP_NUMBER: '966563010660',      // رقم WhatsApp (بدون 0 في البداية)
  
  // معلومات الخدمة
  BUSINESS_NAME: 'مغاسل الجودة الآلية',
  BUSINESS_ADDRESS: '2975 شارع الحمدانية، جدة',
  
  // الأسعار
  PRICE_PER_SQUARE_METER: 8,            // السعر: 8 ريال للمتر المربع
  
  // ساعات العمل
  WORKING_HOURS: 'السبت - الخميس من 10:00 صباحاً إلى 10:00 مساءً',
  
  // رسالة WhatsApp الافتراضية
  WHATSAPP_MESSAGE: 'السلام عليكم ورحمة الله وبركاته، أريد الاستفسار عن خدمات تنظيف السجاد'
};

// ============================================
// HELPER FUNCTIONS - دوال مساعدة
// ============================================

/**
 * إنشاء رابط WhatsApp
 * @param {string} message - الرسالة المراد إرسالها
 * @returns {string} رابط WhatsApp كامل
 */
function getWhatsAppLink(message = CONFIG.WHATSAPP_MESSAGE) {
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * إنشاء رابط الاتصال الهاتفي
 * @returns {string} رابط الاتصال
 */
function getPhoneLink() {
  return `tel:+966${CONFIG.PHONE_NUMBER.substring(1)}`;
}

/**
 * تحديث جميع روابط WhatsApp في الصفحة
 */
function updateAllWhatsAppLinks() {
  const whatsappLink = getWhatsAppLink();
  
  // تحديث جميع الروابط
  const elements = [
    'headerWhatsApp',
    'heroWhatsApp',
    'contactWhatsApp',
    'floatingWhatsApp',
    'footerWhatsApp',
    'footerWhatsAppLink',
    'whatsappLink',
    'confirmOrderBtn'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.href = whatsappLink;
    }
  });
}

/**
 * تحديث عرض السعر في الصفحة
 */
function updatePriceDisplay() {
  const priceDisplay = document.getElementById('priceDisplay');
  if (priceDisplay) {
    priceDisplay.textContent = CONFIG.PRICE_PER_SQUARE_METER;
  }
}

// ============================================
// CALCULATOR FUNCTIONS - دوال الحاسبة
// ============================================

let carpets = [];

/**
 * إضافة سجادة إلى القائمة
 */
function addCarpet() {
  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  
  const length = parseFloat(lengthInput.value);
  const width = parseFloat(widthInput.value);
  
  // التحقق من صحة المدخلات
  if (!length || !width || length <= 0 || width <= 0) {
    alert('الرجاء إدخال قيم صحيحة للطول والعرض');
    return;
  }
  
  // حساب المساحة والسعر
  const area = length * width;
  const price = area * CONFIG.PRICE_PER_SQUARE_METER;
  
  // إضافة السجادة إلى المصفوفة
  const carpet = {
    id: Date.now(),
    length: length,
    width: width,
    area: area,
    price: price
  };
  
  carpets.push(carpet);
  
  // تحديث العرض
  displayCarpets();
  updateSummary();
  
  // مسح المدخلات
  lengthInput.value = '';
  widthInput.value = '';
  lengthInput.focus();
}

/**
 * حذف سجادة من القائمة
 * @param {number} id - معرّف السجادة
 */
function removeCarpet(id) {
  carpets = carpets.filter(carpet => carpet.id !== id);
  displayCarpets();
  updateSummary();
}

/**
 * عرض قائمة السجاد
 */
function displayCarpets() {
  const carpetsList = document.getElementById('carpetsList');
  
  if (carpets.length === 0) {
    carpetsList.innerHTML = '';
    return;
  }
  
  carpetsList.innerHTML = carpets.map(carpet => `
    <div class="carpet-item">
      <div class="carpet-info">
        <p>الطول: <strong>${carpet.length}</strong> م</p>
        <p>العرض: <strong>${carpet.width}</strong> م</p>
        <p>المساحة: <strong>${carpet.area.toFixed(2)}</strong> م²</p>
        <p class="carpet-price">السعر: <strong>${carpet.price.toFixed(0)}</strong> ر.س</p>
      </div>
      <button class="btn-remove" onclick="removeCarpet(${carpet.id})" aria-label="حذف هذه السجادة">
        ✕ حذف
      </button>
    </div>
  `).join('');
}

/**
 * تحديث الملخص
 */
function updateSummary() {
  const summary = document.getElementById('summary');
  
  if (carpets.length === 0) {
    summary.style.display = 'none';
    return;
  }
  
  // حساب الإجمالي
  const totalArea = carpets.reduce((sum, carpet) => sum + carpet.area, 0);
  const totalPrice = carpets.reduce((sum, carpet) => sum + carpet.price, 0);
  
  // تحديث الأرقام
  document.getElementById('carpetCount').textContent = carpets.length;
  document.getElementById('totalArea').textContent = totalArea.toFixed(2);
  document.getElementById('totalPrice').textContent = totalPrice.toFixed(0);
  
  // عرض الملخص
  summary.style.display = 'block';
}

/**
 * الانتقال إلى حاسبة التكاليف
 */
function scrollToCalculator() {
  const calculator = document.getElementById('calculator');
  calculator.scrollIntoView({ behavior: 'smooth' });
  document.getElementById('length').focus();
}

// ============================================
// EVENT LISTENERS - مستمعات الأحداث
// ============================================

/**
 * السماح بالضغط على Enter لإضافة السجادة
 */
document.addEventListener('DOMContentLoaded', function() {
  const lengthInput = document.getElementById('length');
  const widthInput = document.getElementById('width');
  
  if (lengthInput && widthInput) {
    lengthInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        widthInput.focus();
      }
    });
    
    widthInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        addCarpet();
      }
    });
  }
  
  // تحديث روابط WhatsApp
  updateAllWhatsAppLinks();
  
  // تحديث عرض السعر
  updatePriceDisplay();
});

// ============================================
// UTILITY FUNCTIONS - دوال مساعدة إضافية
// ============================================

/**
 * تنسيق الرقم بفواصل الآلاف
 * @param {number} num - الرقم
 * @returns {string} الرقم المنسق
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * حساب المساحة من الطول والعرض
 * @param {number} length - الطول
 * @param {number} width - العرض
 * @returns {number} المساحة
 */
function calculateArea(length, width) {
  return length * width;
}

/**
 * حساب السعر من المساحة
 * @param {number} area - المساحة
 * @returns {number} السعر
 */
function calculatePrice(area) {
  return area * CONFIG.PRICE_PER_SQUARE_METER;
}

// ============================================
// EXPORT - تصدير الدوال (للاستخدام الخارجي)
// ============================================

// يمكن استخدام هذه الدوال في أماكن أخرى من الموقع
window.CONFIG = CONFIG;
window.getWhatsAppLink = getWhatsAppLink;
window.getPhoneLink = getPhoneLink;
window.addCarpet = addCarpet;
window.removeCarpet = removeCarpet;
window.scrollToCalculator = scrollToCalculator;
window.calculateArea = calculateArea;
window.calculatePrice = calculatePrice;
