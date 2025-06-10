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

// المقررات المتاحة
const availableCourses = [
    {
        code: 'EDU101',
        name: 'أصول التربية',
        instructor: 'د. أحمد محمد',
        time: '8:00 - 9:30',
        room: 'قاعة 101',
        credits: 3
    },
    {
        code: 'EDU102',
        name: 'علم النفس التربوي',
        instructor: 'د. سارة عبدالله',
        time: '10:00 - 11:30',
        room: 'قاعة 102',
        credits: 3
    },
    {
        code: 'EDU103',
        name: 'مناهج وطرق تدريس',
        instructor: 'د. محمد علي',
        time: '12:00 - 1:30',
        room: 'قاعة 103',
        credits: 3
    },
    {
        code: 'EDU104',
        name: 'تقنيات التعليم',
        instructor: 'د. فاطمة أحمد',
        time: '2:00 - 3:30',
        room: 'قاعة 104',
        credits: 3
    }
];

// تحميل المقررات المسجلة من localStorage
function loadRegisteredCourses() {
    const savedCourses = localStorage.getItem('registeredCourses');
    if (savedCourses) {
        currentUser.registeredCourses = JSON.parse(savedCourses);
        console.log('تم تحميل المقررات المسجلة من التخزين المحلي');
    }
}

// حفظ المقررات المسجلة في localStorage
function saveRegisteredCourses() {
    localStorage.setItem('registeredCourses', JSON.stringify(currentUser.registeredCourses));
    console.log('تم حفظ المقررات المسجلة في التخزين المحلي');
}

// تحديث حالة التسجيل
function updateRegistrationStatus() {
    console.log('تحديث حالة التسجيل');
    const statusElement = document.getElementById('registrationStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const statusDescription = document.getElementById('statusDescription');

    if (!statusElement || !statusIcon || !statusText || !statusDescription) {
        console.error('لم يتم العثور على عناصر حالة التسجيل');
        return;
    }

    if (currentUser.registrationBlocked) {
        statusElement.className = 'status-blocked';
        statusIcon.className = 'fas fa-ban';
        statusText.textContent = 'التسجيل غير متاح';
        statusDescription.textContent = 'يرجى سداد الرسوم المستحقة لتفعيل التسجيل';
    } else {
        statusElement.className = 'status-available';
        statusIcon.className = 'fas fa-check-circle';
        statusText.textContent = 'التسجيل متاح';
        statusDescription.textContent = 'يمكنك إضافة أو إلغاء المقررات';
    }
}

// عرض المقررات المتاحة
function displayAvailableCourses() {
    console.log('عرض المقررات المتاحة');
    const coursesList = document.getElementById('coursesList');
    if (!coursesList) {
        console.error('لم يتم العثور على عنصر قائمة المقررات المتاحة');
        return;
    }

    coursesList.innerHTML = '';

    availableCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.innerHTML = `
            <div class="course-header">
                <h3>${course.name}</h3>
                <span class="course-code">${course.code}</span>
            </div>
            <div class="course-details">
                <p><i class="fas fa-user"></i> ${course.instructor}</p>
                <p><i class="fas fa-clock"></i> ${course.time}</p>
                <p><i class="fas fa-door-open"></i> ${course.room}</p>
                <p><i class="fas fa-graduation-cap"></i> ${course.credits} ساعات</p>
            </div>
            <button class="register-btn" onclick="registerCourse('${course.code}')">
                <i class="fas fa-plus"></i>
                تسجيل
            </button>
        `;
        coursesList.appendChild(courseCard);
    });
}

// عرض المقررات المسجلة
function displayRegisteredCourses() {
    console.log('عرض المقررات المسجلة');
    const registeredCoursesList = document.getElementById('registeredCoursesList');
    if (!registeredCoursesList) {
        console.error('لم يتم العثور على عنصر قائمة المقررات المسجلة');
        return;
    }

    if (currentUser.registeredCourses.length === 0) {
        registeredCoursesList.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book"></i>
                <p>لا توجد مقررات مسجلة</p>
            </div>
        `;
        return;
    }

    registeredCoursesList.innerHTML = '';

    currentUser.registeredCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card registered';
        courseCard.innerHTML = `
            <div class="course-header">
                <h3>${course.name}</h3>
                <span class="course-code">${course.code}</span>
            </div>
            <div class="course-details">
                <p><i class="fas fa-user"></i> ${course.instructor}</p>
                <p><i class="fas fa-clock"></i> ${course.time}</p>
                <p><i class="fas fa-door-open"></i> ${course.room}</p>
                <p><i class="fas fa-graduation-cap"></i> ${course.credits} ساعات</p>
            </div>
            <button class="register-btn" onclick="cancelRegistration('${course.code}')">
                <i class="fas fa-times"></i>
                إلغاء التسجيل
            </button>
        `;
        registeredCoursesList.appendChild(courseCard);
    });
}

// تسجيل مقرر
function registerCourse(courseCode) {
    console.log('تسجيل مقرر:', courseCode);
    const course = availableCourses.find(c => c.code === courseCode);
    if (!course) {
        console.error('لم يتم العثور على المقرر:', courseCode);
        return;
    }

    // التحقق من عدم وجود تعارض في المواعيد
    const hasConflict = currentUser.registeredCourses.some(registeredCourse => {
        return registeredCourse.time === course.time;
    });

    if (hasConflict) {
        alert('تعذر التسجيل: يوجد تعارض في مواعيد المحاضرات');
        return;
    }

    // التحقق من عدد الساعات المسجلة
    const totalCredits = currentUser.registeredCourses.reduce((sum, c) => sum + c.credits, 0) + course.credits;
    if (totalCredits > 21) {
        alert('تعذر التسجيل: تجاوز الحد الأقصى للساعات المسجلة');
        return;
    }

    // إضافة المقرر للمقررات المسجلة
    currentUser.registeredCourses.push(course);
    
    // حفظ المقررات المسجلة
    saveRegisteredCourses();
    
    // تحديث الإحصائيات
    updateRegistrationStats();
    
    // تحديث قائمة المقررات المسجلة
    displayRegisteredCourses();
    
    // تحديث الجدول الدراسي
    updateSchedule();
    
    // إظهار رسالة نجاح
    alert('تم تسجيل المقرر بنجاح');
}

// إلغاء تسجيل مقرر
function cancelRegistration(courseCode) {
    console.log('إلغاء تسجيل مقرر:', courseCode);
    const courseIndex = currentUser.registeredCourses.findIndex(c => c.code === courseCode);
    if (courseIndex === -1) {
        console.error('لم يتم العثور على المقرر المسجل:', courseCode);
        return;
    }

    // إزالة المقرر من المقررات المسجلة
    currentUser.registeredCourses.splice(courseIndex, 1);
    
    // حفظ المقررات المسجلة
    saveRegisteredCourses();
    
    // تحديث الإحصائيات
    updateRegistrationStats();
    
    // تحديث قائمة المقررات المسجلة
    displayRegisteredCourses();
    
    // تحديث الجدول الدراسي
    updateSchedule();
    
    // إظهار رسالة نجاح
    alert('تم إلغاء تسجيل المقرر بنجاح');
}

// تحديث الإحصائيات
function updateRegistrationStats() {
    console.log('تحديث الإحصائيات');
    const registeredCoursesCount = document.getElementById('registeredCoursesCount');
    const totalCredits = document.getElementById('totalCredits');
    const availableCoursesCount = document.getElementById('availableCoursesCount');
    const conflictsCount = document.getElementById('conflictsCount');

    if (registeredCoursesCount) registeredCoursesCount.textContent = currentUser.registeredCourses.length;
    if (totalCredits) totalCredits.textContent = currentUser.registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    if (availableCoursesCount) availableCoursesCount.textContent = availableCourses.length;
    if (conflictsCount) conflictsCount.textContent = '0';
}

// تحديث الجدول الدراسي
function updateSchedule() {
    console.log('تحديث الجدول الدراسي');
    const scheduleTable = document.getElementById('scheduleTable');
    if (!scheduleTable) {
        console.error('لم يتم العثور على عنصر الجدول الدراسي');
        return;
    }

    const timeSlots = ['8:00 - 9:30', '10:00 - 11:30', '12:00 - 1:30', '2:00 - 3:30'];
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

    // إنشاء مصفوفة لتخزين المقررات في كل خلية
    const schedule = Array(timeSlots.length).fill().map(() => Array(days.length).fill(null));

    // توزيع المقررات على الأيام
    currentUser.registeredCourses.forEach(course => {
        const timeIndex = timeSlots.indexOf(course.time);
        if (timeIndex !== -1) {
            // توزيع المقرر على يوم واحد في الأسبوع
            const availableDays = days.map((_, index) => index).filter(dayIndex => 
                !schedule[timeIndex][dayIndex]
            );
            
            if (availableDays.length > 0) {
                // اختيار يوم واحد عشوائي
                const dayIndex = availableDays[Math.floor(Math.random() * availableDays.length)];
                schedule[timeIndex][dayIndex] = course;
            }
        }
    });

    // إنشاء الجدول
    let tableHTML = '<table>';
    
    // رأس الجدول
    tableHTML += '<thead><tr><th>الوقت</th>';
    days.forEach(day => {
        tableHTML += `<th>${day}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    // محتوى الجدول
    tableHTML += '<tbody>';
    timeSlots.forEach((timeSlot, timeIndex) => {
        tableHTML += '<tr>';
        tableHTML += `<td>${timeSlot}</td>`;
        
        days.forEach((day, dayIndex) => {
            const course = schedule[timeIndex][dayIndex];
            if (course) {
                tableHTML += `
                    <td class="course-slot">
                        <div class="course-info">
                            <h4>${course.name}</h4>
                            <p>${course.code}</p>
                            <p>${course.room}</p>
                        </div>
                    </td>`;
            } else {
                tableHTML += '<td></td>';
            }
        });
        
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    scheduleTable.innerHTML = tableHTML;
}

// تحديث الصفحة عند التحميل
console.log('بدء تحميل الصفحة');
loadRegisteredCourses(); // تحميل المقررات المسجلة من التخزين المحلي
updateRegistrationStatus();
displayAvailableCourses();
displayRegisteredCourses();
updateRegistrationStats();
updateSchedule(); 