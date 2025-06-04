// Global Variables
let currentStep = 0; // Start with inquiry step
let isAdmissionConfirmed = false;
let uploadedFile = null;
let studentData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    generateInvoiceNumber();
});

// Initialize application
function initializeApp() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Set up initial state
    updateProgressBar();
    
    console.log('بوابة القبول - جامعة الأمير سطام بن عبدالعزيز');
}

// Setup event listeners
function setupEventListeners() {
    // Inquiry form
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquirySubmit);
    }
    
    // Input validation for national ID
    const nationalIdInput = document.getElementById('nationalId');
    if (nationalIdInput) {
        nationalIdInput.addEventListener('input', validateNationalId);
    }
    
    // Input validation for phone number
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', validatePhoneNumber);
    }
    
    // File upload area
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('receiptFile');
    
    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag and drop
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        
        // File input change
        fileInput.addEventListener('change', handleFileSelect);
    }
}

// Inquiry form submission
function handleInquirySubmit(e) {
    e.preventDefault();
    
    const applicationNumber = document.getElementById('applicationNumber').value;
    const nationalId = document.getElementById('nationalId').value;
    const birthDate = document.getElementById('birthDate').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    // Validate inputs
    if (!validateInquiryData(applicationNumber, nationalId, birthDate, phoneNumber)) {
        return;
    }
    
    showLoading();
    
    // Simulate API call to check admission status
    setTimeout(() => {
        hideLoading();
        
        // Check if student data matches our records
        if (checkStudentData(applicationNumber, nationalId, phoneNumber)) {
            showSuccess('تم العثور على بيانات القبول الخاصة بك');
            setTimeout(() => {
                showProgressBar();
                goToStep(1);
            }, 2000);
        } else {
            showInquiryError();
        }
    }, 2000);
}

// Validate inquiry data
function validateInquiryData(applicationNumber, nationalId, birthDate, phoneNumber) {
    if (!applicationNumber || applicationNumber.length < 5) {
        showError('يرجى إدخال رقم طلب القبول الصحيح');
        return false;
    }
    
    if (nationalId.length !== 10 || !/^\d+$/.test(nationalId)) {
        showError('رقم الهوية يجب أن يتكون من 10 أرقام');
        return false;
    }
    
    if (!birthDate) {
        showError('يرجى إدخال تاريخ الميلاد');
        return false;
    }
    
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith('05')) {
        showError('رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام');
        return false;
    }
    
    return true;
}

// Check if student data matches records
function checkStudentData(applicationNumber, nationalId, phoneNumber) {
    // Check against Atheer Al-Dosari's data
    const correctApplicationNumber = 'APP202500146';
    const correctNationalId = '1139150252';
    const correctPhoneNumber = '0566781458';
    
    return applicationNumber === correctApplicationNumber && 
           nationalId === correctNationalId && 
           phoneNumber === correctPhoneNumber;
}

// Show inquiry error
function showInquiryError() {
    const errorMessage = `
        <div class="inquiry-error">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>لم يتم العثور على بيانات القبول</h3>
            <p>البيانات المدخلة غير متطابقة مع سجلاتنا. يرجى التأكد من:</p>
            <ul>
                <li>رقم طلب القبول صحيح ومطابق للمرسل إليك</li>
                <li>رقم الهوية الوطنية صحيح</li>
                <li>تاريخ الميلاد مطابق للهوية</li>
                <li>رقم الجوال المسجل في طلب القبول</li>
            </ul>
            <div class="contact-info">
                <h4>للمساعدة والاستفسار:</h4>
                <p><i class="fas fa-phone"></i> 011-588-8000</p>
                <p><i class="fas fa-envelope"></i> admission@psau.edu.sa</p>
            </div>
        </div>
    `;
    
    const inquiryForm = document.querySelector('.inquiry-form');
    if (inquiryForm) {
        inquiryForm.innerHTML = errorMessage;
    }
}

// Show progress bar
function showProgressBar() {
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
}

// Input validation functions
function validateNationalId(e) {
    const value = e.target.value;
    e.target.value = value.replace(/\D/g, ''); // Only numbers
}

function validatePhoneNumber(e) {
    const value = e.target.value;
    e.target.value = value.replace(/\D/g, ''); // Only numbers
}

// Navigation Functions
function nextStep(step) {
    if (step === 3 && !isAdmissionConfirmed) {
        showError('يجب تأكيد القبول أولاً');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        goToStep(step);
    }, 1000);
}

function prevStep(step) {
    goToStep(step);
}

function goToStep(step) {
    // Hide all steps
    const allSteps = document.querySelectorAll('.step-content');
    allSteps.forEach(stepElement => {
        stepElement.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${step}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStep = step;
        updateProgressBar();
        saveDataToStorage();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Progress bar update
function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-bar .step');
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

// Admission confirmation
function confirmAdmission(accepted) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        if (accepted) {
            isAdmissionConfirmed = true;
            showSuccess('تم تأكيد قبولك بنجاح!');
            setTimeout(() => {
                nextStep(3);
            }, 2000);
        } else {
            showRejectionMessage();
        }
        
        saveDataToStorage();
    }, 1500);
}

// Show rejection message
function showRejectionMessage() {
    const allSteps = document.querySelectorAll('.step-content');
    allSteps.forEach(step => step.classList.remove('active'));
    
    const rejectionSection = document.getElementById('rejection-message');
    if (rejectionSection) {
        rejectionSection.classList.add('active');
    }
}

// Invoice functions
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const invoiceNumber = `INV-${year}${month}${day}-${random}`;
    
    const invoiceNumberElement = document.getElementById('invoiceNumber');
    if (invoiceNumberElement) {
        invoiceNumberElement.textContent = invoiceNumber;
    }
    
    return invoiceNumber;
}

function printInvoice() {
    window.print();
}

function copyAccountNumber() {
    const accountNumber = 'SA5880000109608016558132';
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            showSuccess('تم نسخ رقم الحساب');
        }).catch(() => {
            fallbackCopyTextToClipboard(accountNumber);
        });
    } else {
        fallbackCopyTextToClipboard(accountNumber);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showSuccess('تم نسخ رقم الحساب');
    } catch (err) {
        showError('فشل في نسخ رقم الحساب');
    }
    
    document.body.removeChild(textArea);
}

// File upload functions
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        showError('نوع الملف غير مدعوم. يرجى رفع ملف JPG أو PNG أو PDF');
        return;
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
    }
    
    uploadedFile = file;
    displayUploadedFile(file);
    enableSubmitButton();
}

function displayUploadedFile(file) {
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFileDiv = document.getElementById('uploadedFile');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    if (uploadArea && uploadedFileDiv && fileName && fileSize) {
        uploadArea.style.display = 'none';
        uploadedFileDiv.style.display = 'block';
        
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
    }
}

function removeFile() {
    uploadedFile = null;
    
    const uploadArea = document.getElementById('uploadArea');
    const uploadedFileDiv = document.getElementById('uploadedFile');
    const fileInput = document.getElementById('receiptFile');
    
    if (uploadArea && uploadedFileDiv && fileInput) {
        uploadArea.style.display = 'block';
        uploadedFileDiv.style.display = 'none';
        fileInput.value = '';
    }
    
    disableSubmitButton();
}

function enableSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
    }
}

function disableSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
    }
}

function submitReceipt() {
    if (!uploadedFile) {
        showError('يرجى رفع إيصال السداد أولاً');
        return;
    }
    
    showLoading();
    
    // Simulate upload process
    setTimeout(() => {
        hideLoading();
        
        // Generate reference number
        const referenceNumber = generateReferenceNumber();
        
        // Show success message
        showSubmissionSuccess(referenceNumber);
        
        // Save to localStorage
        saveReceiptData(referenceNumber);
        
    }, 3000);
}

function generateReferenceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `REF-${year}${month}${day}${hours}${minutes}-${random}`;
}

function showSubmissionSuccess(referenceNumber) {
    const submissionSection = document.getElementById('submissionSection');
    const referenceNumberSpan = document.getElementById('referenceNumber');
    
    if (submissionSection && referenceNumberSpan) {
        referenceNumberSpan.textContent = referenceNumber;
        submissionSection.style.display = 'block';
        
        // Hide upload area and uploaded file
        const uploadArea = document.getElementById('uploadArea');
        const uploadedFileDiv = document.getElementById('uploadedFile');
        
        if (uploadArea && uploadedFileDiv) {
            uploadArea.style.display = 'none';
            uploadedFileDiv.style.display = 'none';
        }
        
        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> تم الإرسال';
        }
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Notification functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'hsl(122, 49%, 47%)' : 'hsl(0, 74%, 58%)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-family: var(--font-family);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// Loading functions
function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Local Storage functions
function saveDataToStorage() {
    const data = {
        currentStep: currentStep,
        isAdmissionConfirmed: isAdmissionConfirmed,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('admissionPortalData', JSON.stringify(data));
}

function loadSavedData() {
    try {
        const savedData = localStorage.getItem('admissionPortalData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Check if data is not too old (24 hours)
            const now = new Date().getTime();
            const dataAge = now - (data.timestamp || 0);
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
            
            if (dataAge < maxAge) {
                currentStep = data.currentStep || 1;
                isAdmissionConfirmed = data.isAdmissionConfirmed || false;
                
                // Restore UI state
                goToStep(currentStep);
            } else {
                // Clear old data
                localStorage.removeItem('admissionPortalData');
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
        localStorage.removeItem('admissionPortalData');
    }
}

function saveReceiptData(referenceNumber) {
    const receiptData = {
        fileName: uploadedFile ? uploadedFile.name : null,
        fileSize: uploadedFile ? uploadedFile.size : null,
        referenceNumber: referenceNumber,
        submissionDate: new Date().toISOString(),
        invoiceNumber: document.getElementById('invoiceNumber')?.textContent || ''
    };
    
    localStorage.setItem('receiptSubmission', JSON.stringify(receiptData));
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('خطأ في التطبيق:', e.error);
    showError('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.');
});

// Prevent form submission on enter key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh invoice number if needed
        if (currentStep === 3 && !document.getElementById('invoiceNumber').textContent) {
            generateInvoiceNumber();
        }
    }
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Handle escape key to close modals/notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
        
        if (document.getElementById('loadingOverlay').style.display === 'flex') {
            hideLoading();
        }
    }
});

// Mobile responsive handling
function handleMobileMenu() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Mobile specific adjustments
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.margin = '10px 0';
        });
    }
}

window.addEventListener('resize', handleMobileMenu);
window.addEventListener('load', handleMobileMenu);

// Performance optimization
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

// Optimized resize handler
const optimizedResize = debounce(handleMobileMenu, 250);
window.addEventListener('resize', optimizedResize);
