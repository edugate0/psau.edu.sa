// وظائف نظام السداد

let selectedPaymentMethod = null;
let uploadedReceipt = null;

// بيانات الطالب الحالي
const currentUser = {
    id: '202500145',
    name: 'أثير قبلان منير الدوسري',
    college: 'التربية',
    department: 'التربية الخاصة',
    level: 'الثالث',
    semester: 'الأول',
    academicYear: '2025',
    paymentStatus: 'paid',
    outstandingAmount: 0,
    registrationBlocked: false,
    registeredCourses: []
};

// تحميل صفحة السداد
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('payment.html')) {
        loadPaymentPage();
    }
});

function loadPaymentPage() {
    const user = getCurrentUser();
    if (!user) return;
    
    updatePaymentStatus(user);
    updateFeesSummary(user);
    displayOutstandingInvoices(user);
    displayPaymentHistory();
}

function updatePaymentStatus(user) {
    const statusElement = document.querySelector('.payment-status');
    if (!statusElement) return;

    if (user.paymentStatus === 'paid') {
        statusElement.innerHTML = `
            <div class="status-paid">
                <i class="fas fa-check-circle"></i>
                <div class="status-content">
                    <h3>تم سداد جميع الرسوم</h3>
                    <p>تم تحديث حسابك بنجاح</p>
                </div>
            </div>
        `;
    }
}

function getCurrentUser() {
    // بيانات الطالبة مع الرسوم المطلوبة حسب طلبك
    return {
        profileImage: "https://via.placeholder.com/120/2563eb/ffffff?text=س.أ",
        name: "أثير قبلان منير الدوسري",
        id: "202500145",
        college: "   ",
        major: "بكالوريوس رياض أطفال",
        level: "الأول",
        outstandingAmount: 0, // تم السداد
        registrationBlocked: false, // تم إلغاء الحجب
        paymentStatus: 'paid',
        registeredCourses: []
    };
}

function updateFeesSummary(user) {
    const totalAmount = document.querySelector('.summary-card.total h3');
    const paidAmount = document.querySelector('.summary-card.paid h3');
    const outstandingAmount = document.querySelector('.summary-card.outstanding h3');

    if (totalAmount) totalAmount.textContent = '2000';
    if (paidAmount) paidAmount.textContent = '2000';
    if (outstandingAmount) outstandingAmount.textContent = '0';
}

function displayOutstandingInvoices(user) {
    const container = document.getElementById('outstandingInvoicesList');
    if (!container) return;
    
    if (user.outstandingAmount === 0) {
        container.innerHTML = '<p class="no-courses">لا توجد فواتير مستحقة</p>';
        return;
    }
    
    const invoices = [
        {
            id: 'INV-2025-001',
            description: 'الرسوم الدراسية - الفصل الاول',
            amount: user.outstandingAmount,
            dueDate: '2025-06-09',
            isOverdue: false
        }
    ];
    
    container.innerHTML = invoices.map(invoice => {
        const isOverdue = new Date(invoice.dueDate) < new Date();
        
        return `
            <div class="invoice-card ${isOverdue ? 'overdue' : ''}">
                <div class="invoice-header">
                    <h3>${invoice.description}</h3>
                    <span class="invoice-amount">${invoice.amount} ريال</span>
                </div>
                <div class="invoice-details">
                    <p>
                        <span class="label">رقم الفاتورة:</span>
                        <span class="value">${invoice.id}</span>
                    </p>
                    <p>
                        <span class="label">تاريخ الاستحقاق:</span>
                        <span class="value">${invoice.dueDate}</span>
                    </p>
                    <p>
                        <span class="label">الحالة:</span>
                        <span class="value">
                            ${isOverdue ? '<span class="overdue-badge">متأخر</span>' : 'مستحق'}
                        </span>
                    </p>
                </div>
            </div>
        `;
    }).join('');
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    // إزالة التحديد من جميع الخيارات
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // تحديد الخيار المختار
    const selectedOption = document.querySelector(`#${method}`).closest('.payment-option');
    selectedOption.classList.add('selected');
    
    // تحديث حالة الراديو
    document.getElementById(method).checked = true;
    
    // إظهار تفاصيل الدفع
    showPaymentDetails(method);
}

function showPaymentDetails(method) {
    const detailsSection = document.getElementById('paymentDetails');
    const allForms = document.querySelectorAll('.payment-form');
    
    // إخفاء جميع النماذج
    allForms.forEach(form => form.style.display = 'none');
    
    // إظهار النموذج المناسب
    const targetForm = document.getElementById(`${method.replace('_', '')}Details`);
    if (targetForm) {
        targetForm.style.display = 'block';
    }
    
    // إظهار قسم التفاصيل
    detailsSection.style.display = 'block';
    
    // تحديث نص الزر
    const proceedBtn = document.getElementById('proceedPaymentBtn');
    const buttonTexts = {
        'bank_transfer': 'عرض معلومات التحويل',
        'credit_card': 'دفع بالبطاقة الائتمانية',
        'sadad': 'عرض معلومات سداد',
        'receipt_upload': 'رفع إيصال السداد'
    };
    
    if (proceedBtn) {
        proceedBtn.innerHTML = `
            <i class="fas fa-credit-card"></i>
            ${buttonTexts[method] || 'متابعة الدفع'}
        `;
    }
}

function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // التحقق من نوع الملف
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('نوع الملف غير مدعوم. يرجى اختيار ملف JPG أو PNG أو PDF', 'error');
        return;
    }
    
    // التحقق من حجم الملف (5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت', 'error');
        return;
    }
    
    uploadedReceipt = file;
    
    // عرض معلومات الملف
    const uploadedFileDiv = document.getElementById('uploadedFile');
    uploadedFileDiv.style.display = 'flex';
    uploadedFileDiv.innerHTML = `
        <i class="fas fa-file-${file.type.includes('pdf') ? 'pdf' : 'image'}"></i>
        <div class="file-info">
            <h4>${file.name}</h4>
            <p>${(file.size / 1024 / 1024).toFixed(2)} ميجابايت</p>
        </div>
        <button class="remove-file" onclick="removeUploadedFile()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    showAlert('تم رفع الملف بنجاح', 'success');
}

function removeUploadedFile() {
    uploadedReceipt = null;
    document.getElementById('receiptFile').value = '';
    document.getElementById('uploadedFile').style.display = 'none';
}

function proceedPayment() {
    if (!selectedPaymentMethod) {
        showAlert('يرجى اختيار طريقة الدفع', 'error');
        return;
    }
    
    const user = getCurrentUser();
    
    switch (selectedPaymentMethod) {
        case 'bank_transfer':
            showBankTransferInfo();
            break;
        case 'credit_card':
            processCreditCardPayment();
            break;
        case 'sadad':
            showSadadInfo();
            break;
        case 'receipt_upload':
            processReceiptUpload();
            break;
    }
}

function showBankTransferInfo() {
    showAlert('تم عرض معلومات التحويل البنكي. يرجى إجراء التحويل وإرفاق الإيصال لاحقاً', 'info');
}

function processCreditCardPayment() {
    // التحقق من صحة بيانات البطاقة
    const cardForm = document.querySelector('.card-form');
    const inputs = cardForm.querySelectorAll('input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'var(--danger-color)';
        } else {
            input.style.borderColor = 'var(--medium-gray)';
        }
    });
    
    if (!isValid) {
        showAlert('يرجى ملء جميع بيانات البطاقة', 'error');
        return;
    }
    
    showPaymentConfirmation();
}

function showSadadInfo() {
    showAlert('تم عرض معلومات الدفع عبر سداد. يمكنك الدفع عبر تطبيق البنك أو أجهزة الصراف الآلي', 'info');
}

function processReceiptUpload() {
    if (!uploadedReceipt) {
        showAlert('يرجى رفع إيصال السداد', 'error');
        return;
    }
    
    const paymentDate = document.getElementById('paymentDate').value;
    const paidAmount = document.getElementById('paidAmountInput').value;
    
    if (!paymentDate || !paidAmount) {
        showAlert('يرجى ملء تاريخ السداد والمبلغ المدفوع', 'error');
        return;
    }
    
    if (parseFloat(paidAmount) <= 0) {
        showAlert('يرجى إدخال مبلغ صحيح', 'error');
        return;
    }
    
    showReceiptUploadConfirmation();
}

function showPaymentConfirmation() {
    const user = getCurrentUser();
    
    document.getElementById('paymentSummaryDetails').innerHTML = `
        <div class="payment-summary-item">
            <span>المبلغ المستحق:</span>
            <span>${user.outstandingAmount} ريال</span>
        </div>
        <div class="payment-summary-item">
            <span>طريقة الدفع:</span>
            <span>البطاقة الائتمانية</span>
        </div>
        <div class="payment-summary-item">
            <span>رسوم المعاملة:</span>
            <span>0 ريال</span>
        </div>
        <div class="payment-summary-item">
            <span>الإجمالي:</span>
            <span>${user.outstandingAmount} ريال</span>
        </div>
    `;
    
    document.getElementById('confirmPaymentBtn').onclick = () => confirmCreditCardPayment();
    document.getElementById('paymentConfirmModal').style.display = 'block';
}

function showReceiptUploadConfirmation() {
    const paidAmount = document.getElementById('paidAmountInput').value;
    const paymentDate = document.getElementById('paymentDate').value;
    
    document.getElementById('paymentSummaryDetails').innerHTML = `
        <div class="payment-summary-item">
            <span>المبلغ المدفوع:</span>
            <span>${paidAmount} ريال</span>
        </div>
        <div class="payment-summary-item">
            <span>تاريخ السداد:</span>
            <span>${paymentDate}</span>
        </div>
        <div class="payment-summary-item">
            <span>طريقة الدفع:</span>
            <span>إيصال مرفق</span>
        </div>
        <div class="payment-summary-item">
            <span>الملف المرفق:</span>
            <span>${uploadedReceipt.name}</span>
        </div>
    `;
    
    document.getElementById('confirmPaymentBtn').onclick = () => confirmReceiptUpload();
    document.getElementById('paymentConfirmModal').style.display = 'block';
}

function confirmCreditCardPayment() {
    // محاكاة معالجة الدفع
    showAlert('جاري معالجة الدفع...', 'info');
    
    setTimeout(() => {
        const user = getCurrentUser();
        
        // تحديث بيانات المستخدم
        user.outstandingAmount = 0;
        user.registrationBlocked = false;
        
        // إضافة سجل دفع جديد
        addPaymentRecord({
            id: 'PAY-' + Date.now(),
            description: 'دفع الرسوم الدراسية - بطاقة ائتمانية',
            amount: 2500,
            date: new Date().toISOString().split('T')[0],
            status: 'completed',
            method: 'البطاقة الائتمانية'
        });
        
        showAlert('تم الدفع بنجاح! سيتم تحديث حسابك خلال دقائق', 'success');
        closePaymentModal();
        loadPaymentPage();
    }, 3000);
}

function confirmReceiptUpload() {
    const paidAmount = parseFloat(document.getElementById('paidAmountInput').value);
    const paymentDate = document.getElementById('paymentDate').value;
    const notes = document.getElementById('paymentNotes').value;
    
    // إضافة سجل دفع معلق
    addPaymentRecord({
        id: 'PAY-' + Date.now(),
        description: 'رفع إيصال سداد - قيد المراجعة',
        amount: paidAmount,
        date: paymentDate,
        status: 'pending',
        method: 'إيصال مرفق',
        notes: notes,
        receipt: uploadedReceipt.name
    });
    
    showAlert('تم رفع الإيصال بنجاح! سيتم مراجعته خلال 24-48 ساعة', 'success');
    closePaymentModal();
    
    // إعادة تعيين النموذج
    document.getElementById('paymentDate').value = '';
    document.getElementById('paidAmountInput').value = '';
    document.getElementById('paymentNotes').value = '';
    removeUploadedFile();
    
    loadPaymentPage();
}

function addPaymentRecord(payment) {
    let paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    paymentHistory.unshift(payment);
    localStorage.setItem('paymentHistory', JSON.stringify(paymentHistory));
}

function displayPaymentHistory() {
    const container = document.getElementById('paymentHistoryList');
    if (!container) return;
    
    const paymentHistory = JSON.parse(localStorage.getItem('paymentHistory') || '[]');
    
    if (paymentHistory.length === 0) {
        container.innerHTML = '<p class="no-courses">لا يوجد سجل مدفوعات</p>';
        return;
    }
    
    container.innerHTML = paymentHistory.map(payment => `
        <div class="history-item">
            <div class="history-info">
                <h4>${payment.description}</h4>
                <p>
                    ${payment.date} • ${payment.method}
                    ${payment.notes ? ` • ${payment.notes}` : ''}
                    ${payment.receipt ? ` • ${payment.receipt}` : ''}
                </p>
            </div>
            <div class="history-amount">
                <div class="amount">${payment.amount} ريال</div>
                <div class="status status-${payment.status}">
                    ${payment.status === 'completed' ? 'مكتمل' : 
                      payment.status === 'pending' ? 'قيد المراجعة' : 'فشل'}
                </div>
            </div>
        </div>
    `).join('');
}

function cancelPayment() {
    selectedPaymentMethod = null;
    document.getElementById('paymentDetails').style.display = 'none';
    
    // إزالة التحديد من جميع الخيارات
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.checked = false;
    });
}

function closePaymentModal() {
    document.getElementById('paymentConfirmModal').style.display = 'none';
}

// إضافة دعم السحب والإفلات للملفات
document.addEventListener('DOMContentLoaded', function() {
    const uploadZone = document.querySelector('.upload-zone');
    if (!uploadZone) return;
    
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const fileInput = document.getElementById('receiptFile');
            fileInput.files = files;
            handleFileUpload(fileInput);
        }
    });
});

