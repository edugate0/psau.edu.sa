// بيانات مقررات رياض الأطفال (محجوبة)
const availableCourses = [
    {
        id: "EDU101",
        code: "EDU101",
        name: "مدخل إلى رياض الأطفال",
        credits: 3,
        instructor: "د. سارة العتيبي",
        room: "قاعة 201",
        time: "الأحد 10-12",
        status: "locked"
    },
    {
        id: "EDU102",
        code: "EDU102",
        name: "أسس التربية",
        credits: 2,
        instructor: "د. منى السبيعي",
        room: "قاعة 105",
        time: "الإثنين 8-10",
        status: "locked"
    },
    {
        id: "PSY101",
        code: "PSY101",
        name: "مدخل إلى علم النفس",
        credits: 3,
        instructor: "د. ريم الحربي",
        room: "قاعة 210",
        time: "الثلاثاء 12-2",
        status: "locked"
    },
    {
        id: "ARAB101",
        code: "ARAB101",
        name: "مهارات اللغة العربية",
        credits: 2,
        instructor: "د. فهد الدوسري",
        room: "قاعة 120",
        time: "الأربعاء 9-11",
        status: "locked"
    },
    {
        id: "ENG101",
        code: "ENG101",
        name: "مهارات اللغة الإنجليزية",
        credits: 2,
        instructor: "أ. هدى الشمري",
        room: "قاعة 130",
        time: "الخميس 11-1",
        status: "locked"
    }
];

// جميع المقررات محجوبة
const registrationBlocked = true;

// وظائف تسجيل المقررات

let filteredCourses = [...availableCourses];
let currentAction = null;
let currentCourseId = null;

// تحميل صفحة تسجيل المقررات
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('course-registration.html')) {
        loadCourseRegistration();
        generateScheduleTable();
    }
});

function loadCourseRegistration() {
    const user = getCurrentUser();
    if (!user) return;
    
    updateRegistrationStatus(user);
    updateRegistrationStats();
    displayAvailableCourses();
    displayRegisteredCourses();
    updateSchedulePreview();
}

function updateRegistrationStatus(user) {
    const statusElement = document.getElementById('registrationStatus');
    if (!statusElement) return;
    
    if (user.registrationBlocked) {
        statusElement.innerHTML = `
            <div class="status-blocked">
                <i class="fas fa-lock"></i>
                <span>تسجيل المقررات محجوب حتى سداد الرسوم المستحقة (${user.outstandingAmount} ريال)</span>
            </div>
        `;
    } else {
        statusElement.innerHTML = `
            <div class="status-active">
                <i class="fas fa-check-circle"></i>
                <span>تسجيل المقررات متاح - يمكنك إضافة وحذف المقررات</span>
            </div>
        `;
    }
}

function updateRegistrationStats() {
    const totalCredits = registeredCourses.reduce((sum, courseId) => {
        const course = availableCourses.find(c => c.id === courseId);
        return sum + (course ? course.credits : 0);
    }, 0);
    
    const stats = {
        'registeredCoursesCount': registeredCourses.length,
        'totalCredits': totalCredits,
        'availableCoursesCount': availableCourses.filter(c => c.status === 'available').length,
        'conflictsCount': checkTimeConflicts().length
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// عرض المقررات المتاحة (محجوبة)
function displayAvailableCourses() {
    const container = document.getElementById('availableCourses');
    if (!container) return;
    container.innerHTML = availableCourses.map(course => `
        <div class="course-card locked">
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <span class="course-status locked">محجوب</span>
            </div>
            <div class="course-title">${course.name}</div>
            <div class="course-details">
                <span><i class="fas fa-user"></i> ${course.instructor}</span>
                <span><i class="fas fa-clock"></i> ${course.time}</span>
                <span><i class="fas fa-door-open"></i> ${course.room}</span>
                <span><i class="fas fa-layer-group"></i> ${course.credits} ساعات</span>
            </div>
            <div class="course-lock-msg">
                <i class="fas fa-lock"></i> لن تتمكن من التسجيل إلا بعد سداد الرسوم
            </div>
        </div>
    `).join('');
}

// البحث والفلترة (تعمل فقط على اسم المقرر)
function filterCourses() {
    const search = document.getElementById('courseSearch').value.trim();
    const college = document.getElementById('collegeFilter').value;
    const credits = document.getElementById('creditsFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filtered = availableCourses.filter(course => {
        let match = true;
        if (search && !course.name.includes(search)) match = false;
        if (college && college !== "EDU") match = false;
        if (credits && course.credits.toString() !== credits) match = false;
        if (status && status !== "locked") match = false;
        return match;
    });

    const container = document.getElementById('availableCourses');
    if (!container) return;
    if (filtered.length === 0) {
        container.innerHTML = `<div class="no-data" style="color:#888; font-size:1.1rem; background:#f9fafb; padding:20px; border-radius:10px;">لا توجد مقررات مطابقة</div>`;
    } else {
        container.innerHTML = filtered.map(course => `
            <div class="course-card locked">
                <div class="course-header">
                    <span class="course-code">${course.code}</span>
                    <span class="course-status locked">محجوب</span>
                </div>
                <div class="course-title">${course.name}</div>
                <div class="course-details">
                    <span><i class="fas fa-user"></i> ${course.instructor}</span>
                    <span><i class="fas fa-clock"></i> ${course.time}</span>
                    <span><i class="fas fa-door-open"></i> ${course.room}</span>
                    <span><i class="fas fa-layer-group"></i> ${course.credits} ساعات</span>
                </div>
                <div class="course-lock-msg">
                    <i class="fas fa-lock"></i> لن تتمكن من التسجيل إلا بعد سداد الرسوم
                </div>
            </div>
        `).join('');
    }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    displayAvailableCourses();
});

