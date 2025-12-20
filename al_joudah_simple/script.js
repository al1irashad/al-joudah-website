/* ============================================
   AL-JOUDAH LAUNDRY - CARPET CALCULATOR
   مغاسل الجودة الآلية - حاسبة تنظيف السجاد
   ============================================ */

// Constants - الثوابت
const PRICE_PER_SQUARE_METER = 30; // السعر: 30 ريال للمتر المربع

// Global Variables - المتغيرات العامة
let carpets = []; // Array to store carpet data

/* ============================================
   INITIALIZATION - التهيئة
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ موقع مغاسل الجودة الآلية تم تحميله بنجاح');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Load saved data from localStorage if available
    loadSavedData();
});

/* ============================================
   EVENT LISTENERS - مستمعي الأحداث
   ============================================ */

function initializeEventListeners() {
    // Allow Enter key to add carpet
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    
    if (lengthInput && widthInput) {
        lengthInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addCarpet();
        });
        
        widthInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addCarpet();
        });
    }
}

/* ============================================
   MAIN CALCULATOR FUNCTIONS - وظائف الحاسبة الرئيسية
   ============================================ */

/**
 * Add a new carpet to the calculator
 * إضافة سجادة جديدة إلى الحاسبة
 */
function addCarpet() {
    // Get input values
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    
    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    
    // Validation - التحقق من البيانات
    if (!validateInputs(length, width)) {
        return;
    }
    
    // Calculate area and price
    const area = length * width;
    const price = area * PRICE_PER_SQUARE_METER;
    
    // Create carpet object
    const carpet = {
        id: Date.now(), // Unique ID
        length: length,
        width: width,
        area: area.toFixed(2),
        price: price.toFixed(2)
    };
    
    // Add to carpets array
    carpets.push(carpet);
    
    // Save to localStorage
    saveCarpetData();
    
    // Clear inputs
    lengthInput.value = '';
    widthInput.value = '';
    lengthInput.focus();
    
    // Update display
    displayCarpets();
    updateSummary();
    
    // Show success message
    showNotification('✅ تم إضافة السجادة بنجاح', 'success');
}

/**
 * Validate input values
 * التحقق من صحة المدخلات
 */
function validateInputs(length, width) {
    // Check if inputs are empty
    if (!length || !width) {
        showNotification('⚠️ الرجاء إدخال الطول والعرض', 'warning');
        return false;
    }
    
    // Check if inputs are positive numbers
    if (length <= 0 || width <= 0) {
        showNotification('⚠️ يجب أن تكون القيم أكبر من صفر', 'warning');
        return false;
    }
    
    // Check if inputs are reasonable (not too large)
    if (length > 100 || width > 100) {
        showNotification('⚠️ القيم كبيرة جداً. الحد الأقصى 100 متر', 'warning');
        return false;
    }
    
    return true;
}

/**
 * Display all carpets in the list
 * عرض جميع السجاد في القائمة
 */
function displayCarpets() {
    const carpetsList = document.getElementById('carpetsList');
    
    // Clear the list
    carpetsList.innerHTML = '';
    
    // If no carpets, show empty message
    if (carpets.length === 0) {
        carpetsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">لم تضف أي سجادة حتى الآن</p>';
        return;
    }
    
    // Display each carpet
    carpets.forEach((carpet, index) => {
        const carpetElement = createCarpetElement(carpet, index);
        carpetsList.appendChild(carpetElement);
    });
}

/**
 * Create a carpet item element
 * إنشاء عنصر السجادة
 */
function createCarpetElement(carpet, index) {
    const div = document.createElement('div');
    div.className = 'carpet-item';
    div.setAttribute('data-id', carpet.id);
    
    div.innerHTML = `
        <div class="carpet-info">
            <p><strong>السجادة #${index + 1}</strong></p>
            <p>الطول: ${carpet.length} م | العرض: ${carpet.width} م</p>
            <p>المساحة: <strong>${carpet.area}</strong> م²</p>
            <p>السعر: <strong style="color: #0052CC; font-size: 18px;">${carpet.price}</strong> ر.س</p>
        </div>
        <button class="carpet-remove" onclick="removeCarpet(${carpet.id})" aria-label="حذف السجادة">
            🗑️ حذف
        </button>
    `;
    
    return div;
}

/**
 * Remove a carpet from the calculator
 * حذف سجادة من الحاسبة
 */
function removeCarpet(id) {
    // Find and remove the carpet
    carpets = carpets.filter(carpet => carpet.id !== id);
    
    // Save to localStorage
    saveCarpetData();
    
    // Update display
    displayCarpets();
    updateSummary();
    
    // Show success message
    showNotification('✅ تم حذف السجادة', 'success');
}

/**
 * Update the summary section
 * تحديث قسم الملخص
 */
function updateSummary() {
    const summary = document.getElementById('summary');
    
    // If no carpets, hide summary
    if (carpets.length === 0) {
        summary.style.display = 'none';
        return;
    }
    
    // Show summary
    summary.style.display = 'block';
    
    // Calculate totals
    const totalArea = carpets.reduce((sum, carpet) => sum + parseFloat(carpet.area), 0).toFixed(2);
    const totalPrice = carpets.reduce((sum, carpet) => sum + parseFloat(carpet.price), 0).toFixed(2);
    
    // Update display
    document.getElementById('carpetCount').textContent = carpets.length;
    document.getElementById('totalArea').textContent = totalArea;
    document.getElementById('totalPrice').textContent = totalPrice;
    
    // Format price with thousands separator
    const formattedPrice = formatPrice(totalPrice);
    document.getElementById('totalPrice').textContent = formattedPrice;
}

/**
 * Format price with thousands separator
 * تنسيق السعر بفواصل الآلاف
 */
function formatPrice(price) {
    return parseFloat(price).toLocaleString('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/* ============================================
   UTILITY FUNCTIONS - وظائف مساعدة
   ============================================ */

/**
 * Scroll to calculator section
 * الانتقال إلى قسم الحاسبة
 */
function scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth' });
        // Focus on the first input
        setTimeout(() => {
            document.getElementById('length').focus();
        }, 500);
    }
}

/**
 * Show notification message
 * عرض رسالة إخطار
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#25D366' : type === 'warning' ? '#FFC107' : '#0052CC'};
        color: ${type === 'warning' ? '#333' : 'white'};
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Clear all carpets
 * حذف جميع السجاد
 */
function clearAllCarpets() {
    if (carpets.length === 0) {
        showNotification('⚠️ لا توجد سجاد لحذفها', 'warning');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف جميع السجاد؟')) {
        carpets = [];
        saveCarpetData();
        displayCarpets();
        updateSummary();
        showNotification('✅ تم حذف جميع السجاد', 'success');
    }
}

/* ============================================
   LOCAL STORAGE - التخزين المحلي
   ============================================ */

/**
 * Save carpet data to localStorage
 * حفظ بيانات السجاد في التخزين المحلي
 */
function saveCarpetData() {
    try {
        localStorage.setItem('al_joudah_carpets', JSON.stringify(carpets));
        console.log('✅ تم حفظ البيانات');
    } catch (error) {
        console.error('❌ خطأ في حفظ البيانات:', error);
    }
}

/**
 * Load carpet data from localStorage
 * تحميل بيانات السجاد من التخزين المحلي
 */
function loadSavedData() {
    try {
        const saved = localStorage.getItem('al_joudah_carpets');
        if (saved) {
            carpets = JSON.parse(saved);
            displayCarpets();
            updateSummary();
            console.log('✅ تم تحميل البيانات المحفوظة');
        }
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        carpets = [];
    }
}

/**
 * Export data as JSON
 * تصدير البيانات كـ JSON
 */
function exportData() {
    if (carpets.length === 0) {
        showNotification('⚠️ لا توجد بيانات لتصديرها', 'warning');
        return;
    }
    
    const dataStr = JSON.stringify(carpets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `al-joudah-carpets-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('✅ تم تصدير البيانات', 'success');
}

/* ============================================
   ANALYTICS TRACKING - تتبع التحليلات
   ============================================ */

/**
 * Track user actions for analytics
 * تتبع إجراءات المستخدم للتحليلات
 */
function trackEvent(eventName, eventData = {}) {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Console log for debugging
    console.log(`📊 Event: ${eventName}`, eventData);
}

// Track when user adds a carpet
function trackCarpetAdded() {
    trackEvent('carpet_added', {
        'carpet_count': carpets.length,
        'total_area': carpets.reduce((sum, c) => sum + parseFloat(c.area), 0),
        'total_price': carpets.reduce((sum, c) => sum + parseFloat(c.price), 0)
    });
}

// Override addCarpet to include tracking
const originalAddCarpet = addCarpet;
addCarpet = function() {
    originalAddCarpet();
    if (carpets.length > 0) {
        trackCarpetAdded();
    }
};

/* ============================================
   PERFORMANCE OPTIMIZATION - تحسين الأداء
   ============================================ */

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ============================================
   ACCESSIBILITY FEATURES - ميزات الوصول
   ============================================ */

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Alt + C to focus on calculator
    if (e.altKey && e.key === 'c') {
        document.getElementById('length').focus();
    }
    
    // Alt + W to open WhatsApp
    if (e.altKey && e.key === 'w') {
        const whatsappLink = document.querySelector('.whatsapp-float');
        if (whatsappLink) {
            whatsappLink.click();
        }
    }
});

// Announce page sections for screen readers
function announceSection(sectionName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `قسم ${sectionName}`;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

/* ============================================
   DARK MODE SUPPORT - دعم الوضع الليلي
   ============================================ */

// Check for dark mode preference
function initDarkModeSupport() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#f0f0f0';
    }
}

// Listen for dark mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#f0f0f0';
    } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.color = '#333333';
    }
});

/* ============================================
   INITIALIZATION ON LOAD - التهيئة عند التحميل
   ============================================ */

// Initialize dark mode support
initDarkModeSupport();

// Log app version
console.log('🚀 Al-Joudah Laundry Calculator v1.0');
console.log('📍 جميع الحقوق محفوظة لمغاسل الجودة الآلية');
