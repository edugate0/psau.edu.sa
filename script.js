// بيانات وهمية للطلاب
const studentsData = {
    '202500145': {
        id: '202500145',
        name: ' أثير قبلان منير الدوسري ',
        email: 's0549514131@gmail.com',
        college: 'كلية التربية',
        major: ' رياض اطفال',
        level: 'الأول',
        gpa: '-',
        totalHours: 0,
        completedHours: 0,
        password: '1139150252',
        paymentStatus: 'paid',
        registrationBlocked: false,
        outstandingAmount: 0,
        profileImage: 'https://via.placeholder.com/150/2563eb/ffffff?text=س.أ'
    }
};

// بيانات المقررات المتاحة للطلاب المستجدين

// المتغيرات العامة
let currentUser = null;
let registeredCourses = [];

// وظائف تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();
    
    // معالج نموذج تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // معالج إظهار/إخفاء كلمة المرور
    const togglePassword = document.getElementById('togglePassword');
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }
});

function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && window.location.pathname.includes('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (!savedUser && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // التحقق من صحة البيانات
    if (studentsData[studentId] && studentsData[studentId].password === password) {
        currentUser = studentsData[studentId];
        
        // حفظ بيانات المستخدم
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        showAlert('تم تسجيل الدخول بنجاح', 'success');
        
        // تأخير الانتقال لإظهار رسالة النجاح
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert('الرقم الجامعي أو كلمة المرور غير صحيحة', 'error');
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showAlert(message, type) {
    // إزالة التنبيهات السابقة
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // إنشاء تنبيه جديد
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    alert.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // إدراج التنبيه في الصفحة
    const loginForm = document.querySelector('.login-form');
    loginForm.insertBefore(alert, loginForm.firstChild);
    
    // إزالة التنبيه بعد 5 ثوان
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// وظائف لوحة التحكم
function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;
    
    // تحديث معلومات المستخدم
    updateUserInfo(user);
    
    // تحديث الإحصائيات
    updateDashboardStats(user);
    
    // تحديث التنبيهات
    updateNotifications(user);
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function updateUserInfo(user) {
    const elements = {
        'userName': user.name,
        'userEmail': user.email,
        'userCollege': user.college,
        'userMajor': user.major,
        'userLevel': user.level,
        'userGPA': user.gpa,
        'userImage': user.profileImage
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'userImage') {
                element.src = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

function updateDashboardStats(user) {
    const stats = {
        'totalHours': user.totalHours,
        'completedHours': user.completedHours,
        'remainingHours': user.totalHours - user.completedHours,
        'currentGPA': user.gpa,
        'registeredCourses': registeredCourses.length,
        'outstandingAmount': user.outstandingAmount
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

function updateNotifications(user) {
    const notificationsContainer = document.getElementById('notifications');
    if (!notificationsContainer) return;
    const notifications = [];
    // لا تنبه بالحجب أبداً
    if (user.outstandingAmount > 0) {
        notifications.push({
            type: 'warning',
            icon: 'fa-exclamation-triangle',
            message: 'يوجد مبلغ مستحق للسداد.'
        });
    }
    notificationsContainer.innerHTML = notifications.map(n => `<div class="alert alert-${n.type}"><i class="fas ${n.icon}"></i> ${n.message}</div>`).join('');
}

// وظائف تسجيل المقررات
function loadCourseRegistration() {
    const user = getCurrentUser();
    if (!user) return;
    
    displayAvailableCourses();
    displayRegisteredCourses();
    updateRegistrationStatus(user);
}

function displayAvailableCourses() {
    const container = document.getElementById('availableCourses');
    if (!container) return;
    
    container.innerHTML = availableCourses.map(course => `
        <div class="course-card">
            <div class="course-header">
                <h3>${course.name}</h3>
                <span class="course-code">${course.id}</span>
            </div>
            <div class="course-details">
                <p><i class="fas fa-user"></i> ${course.instructor}</p>
                <p><i class="fas fa-clock"></i> ${course.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${course.location}</p>
                <p><i class="fas fa-credit-card"></i> ${course.credits} ساعة معتمدة</p>
                <p><i class="fas fa-users"></i> ${course.enrolled}/${course.capacity} طالب</p>
            </div>
            <div class="course-actions">
                <button class="btn btn-primary" onclick="registerCourse('${course.id}')" 
                        ${course.status === 'full' ? 'disabled' : ''}>
                    ${course.status === 'full' ? 'مكتمل' : 'تسجيل'}
                </button>
            </div>
        </div>
    `).join('');
}

function displayRegisteredCourses() {
    const container = document.getElementById('registeredCourses');
    if (!container) return;
    
    if (registeredCourses.length === 0) {
        container.innerHTML = '<p class="no-courses">لم يتم تسجيل أي مقررات بعد</p>';
        return;
    }
    
    container.innerHTML = registeredCourses.map(courseId => {
        const course = availableCourses.find(c => c.id === courseId);
        return `
            <div class="course-card registered">
                <div class="course-header">
                    <h3>${course.name}</h3>
                    <span class="course-code">${course.id}</span>
                </div>
                <div class="course-details">
                    <p><i class="fas fa-user"></i> ${course.instructor}</p>
                    <p><i class="fas fa-clock"></i> ${course.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${course.location}</p>
                </div>
                <div class="course-actions">
                    <button class="btn btn-danger" onclick="unregisterCourse('${course.id}')">
                        حذف
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function registerCourse(courseId) {
    const user = getCurrentUser();
    if (!user) return;
    
    if (registeredCourses.includes(courseId)) {
        showAlert('المقرر مسجل بالفعل', 'error');
        return;
    }
    
    const course = availableCourses.find(c => c.id === courseId);
    if (course.status === 'full') {
        showAlert('المقرر مكتمل العدد', 'error');
        return;
    }
    
    registeredCourses.push(courseId);
    showAlert(`تم تسجيل مقرر ${course.name} بنجاح`, 'success');
    displayRegisteredCourses();
}

function unregisterCourse(courseId) {
    const course = availableCourses.find(c => c.id === courseId);
    
    if (confirm(`هل أنت متأكد من حذف مقرر ${course.name}؟`)) {
        registeredCourses = registeredCourses.filter(id => id !== courseId);
        showAlert(`تم حذف مقرر ${course.name} بنجاح`, 'success');
        displayRegisteredCourses();
    }
}

function updateRegistrationStatus(user) {
    const statusElement = document.getElementById('registrationStatus');
    if (!statusElement) return;
    
    if (user.registrationBlocked) {
        statusElement.innerHTML = `
            <div class="status-blocked">
                <i class="fas fa-lock"></i>
                <span>تسجيل المقررات محجوب</span>
            </div>
        `;
    } else {
        statusElement.innerHTML = `
            <div class="status-active">
                <i class="fas fa-check-circle"></i>
                <span>تسجيل المقررات متاح</span>
            </div>
        `;
    }
}

// وظائف نظام السداد
function loadPaymentSystem() {
    displayInvoices();
    updatePaymentStatus();
}

function displayInvoices() {
    const container = document.getElementById('invoicesList');
    if (!container) return;
    
    container.innerHTML = invoicesData.map(invoice => `
        <div class="invoice-card">
            <div class="invoice-header">
                <h3>فاتورة رقم: ${invoice.id}</h3>
                <span class="invoice-status status-${invoice.status}">
                    ${invoice.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                </span>
            </div>
            <div class="invoice-details">
                <p><strong>الفصل الدراسي:</strong> ${invoice.semester}</p>
                <p><strong>تاريخ الاستحقاق:</strong> ${invoice.dueDate}</p>
                <p><strong>المبلغ الإجمالي:</strong> ${invoice.amount} ريال</p>
            </div>
            <div class="invoice-items">
                <h4>تفاصيل الفاتورة:</h4>
                ${invoice.items.map(item => `
                    <div class="invoice-item">
                        <span>${item.description}</span>
                        <span>${item.amount} ريال</span>
                    </div>
                `).join('')}
            </div>
            <div class="invoice-actions">
                ${invoice.status === 'unpaid' ? `
                    <button class="btn btn-primary" onclick="payInvoice('${invoice.id}')">
                        دفع الآن
                    </button>
                    <button class="btn btn-secondary" onclick="uploadReceipt('${invoice.id}')">
                        رفع إيصال
                    </button>
                ` : `
                    <button class="btn btn-success" disabled>
                        <i class="fas fa-check"></i> مدفوعة
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

function payInvoice(invoiceId) {
    // محاكاة عملية الدفع
    showAlert('جاري تحويلك لبوابة الدفع...', 'info');
    
    setTimeout(() => {
        const invoice = invoicesData.find(inv => inv.id === invoiceId);
        invoice.status = 'paid';
        
        // تحديث حالة الطالب
        const user = getCurrentUser();
        user.paymentStatus = 'paid';
        user.registrationBlocked = false;
        user.outstandingAmount = 0;
        
        // حفظ التحديثات
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        showAlert('تم الدفع بنجاح! تم إلغاء حجب تسجيل المقررات', 'success');
        displayInvoices();
        updatePaymentStatus();
    }, 2000);
}

function uploadReceipt(invoiceId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            showAlert(`تم رفع الإيصال بنجاح. سيتم مراجعته خلال 24 ساعة`, 'success');
        }
    };
    input.click();
}

function updatePaymentStatus() {
    const user = getCurrentUser();
    if (!user) return;
    
    const statusElement = document.getElementById('paymentStatus');
    if (statusElement) {
        if (user.outstandingAmount > 0) {
            statusElement.innerHTML = `
                <div class="payment-status unpaid">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>لديك رسوم مستحقة: ${user.outstandingAmount} ريال</span>
                </div>
            `;
        } else {
            statusElement.innerHTML = `
                <div class="payment-status paid">
                    <i class="fas fa-check-circle"></i>
                    <span>جميع الرسوم مدفوعة</span>
                </div>
            `;
        }
    }
}

// وظائف عامة
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
}

// وظائف نموذج الدفع
function showPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hidePaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPaymentDetails() {
    const paymentForm = document.getElementById('paymentForm');
    paymentForm.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// معالجة تقديم نموذج الإيصال
document.getElementById('receiptForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const receiptNumber = document.getElementById('receiptNumber').value;
    const receiptDate = document.getElementById('receiptDate').value;
    const receiptFile = document.getElementById('receiptFile').files[0];
    
    if (!receiptNumber || !receiptDate || !receiptFile) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // هنا يمكن إضافة كود لإرسال البيانات إلى الخادم
    alert('تم استلام إيصال السداد بنجاح. سيتم مراجعته من قبل الإدارة.');
    hidePaymentForm();
    
    // إعادة تعيين النموذج
    this.reset();
});

// إغلاق النموذج عند النقر خارج المحتوى
document.getElementById('paymentForm').addEventListener('click', function(e) {
    if (e.target === this) {
        hidePaymentForm();
    }
});

// تحميل المحتوى حسب الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'course-registration.html':
            loadCourseRegistration();
            break;
        case 'payment.html':
            loadPaymentSystem();
            break;
    }
});

