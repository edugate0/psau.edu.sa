// وظائف البطاقة الجامعية

function flipCard() {
    const cardContainer = document.querySelector('.card-container');
    cardContainer.classList.toggle('flipped');
}

function printCard() {
    // إخفاء العناصر غير المرغوب فيها أثناء الطباعة
    const elementsToHide = [
        '.sidebar',
        '.top-header', 
        '.card-controls',
        '.additional-info'
    ];
    
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // طباعة الصفحة
    window.print();
    
    // إعادة إظهار العناصر بعد الطباعة
    setTimeout(() => {
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = '';
            }
        });
    }, 1000);
}

function downloadCard() {
    // محاكاة تحميل البطاقة
    showAlert('جاري تحضير البطاقة للتحميل...', 'info');
    
    setTimeout(() => {
        // إنشاء رابط تحميل وهمي
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'student-card-202500145.pdf';
        
        showAlert('تم تحضير البطاقة بنجاح! سيتم التحميل قريباً', 'success');
        
        // في التطبيق الحقيقي، هنا سيتم إنشاء PDF فعلي
        console.log('تحميل البطاقة الجامعية...');
    }, 2000);
}

// تحديث بيانات البطاقة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCardData();
});

function updateCardData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // تحديث بيانات البطاقة
    const cardElements = {
        'cardStudentPhoto': user.profileImage,
        'cardStudentName': user.name,
        'cardStudentId': user.id,
        'cardCollege': user.college,
        'cardMajor': user.major,
        'cardLevel': user.level
    };
    
    Object.entries(cardElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'cardStudentPhoto') {
                element.src = value;
            } else {
                element.textContent = value;
            }
        }
    });
    
    // تحديث رقم البطاقة
    const cardNumber = `PSU-2025-${user.id.slice(-5)}`;
    const cardNumberElement = document.getElementById('cardNumber');
    if (cardNumberElement) {
        cardNumberElement.textContent = cardNumber;
    }
    
    // تحديث تاريخ الانتهاء
    const currentYear = new Date().getFullYear();
    const expiryDate = `${currentYear + 1}/06/30`;
    const cardExpiryElement = document.getElementById('cardExpiry');
    if (cardExpiryElement) {
        cardExpiryElement.textContent = expiryDate;
    }
}

function getCurrentUser() {
    // بيانات الطالبة المطلوبة
    return {
        profileImage: "https://via.placeholder.com/120/2563eb/ffffff?text=س.أ",
        name: "أثير قبلان منير الدوسري",
        id: "202500145",
        college: " كلية التربية",
        major: "بكالوريوس رياض أطفال",
        level: "الأول"
    };
}

