// ================= IMAGE SLIDER =================
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }, 3000);
}

// ================= DATA =================
let students = [];
let academicYear = "";

// ================= ACADEMIC YEAR =================
function setAcademicYear() {
    academicYear = document.getElementById("academicYear").value;
    document.getElementById("yearDisplay").innerText =
        "Current Academic Year: " + academicYear;
}

// ================= REGISTER =================
const form = document.getElementById("studentForm");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        let id = studentId.value.trim();
        let name = studentName.value.trim();
        let age = studentAge.value;
        let gender = studentGender.value;
        let formLevel = studentFormLevel.value;

        if (students.some(s => s.id === id)) {
            alert("Student ID must be unique");
            return;
        }

        students.push({
            id, name, age, gender,
            form: parseInt(formLevel),
            performance: []
        });

        displayStudents();
        updateDashboard();
        this.reset();
    });
}

// ================= DISPLAY =================
function displayStudents() {
    let table = document.getElementById("studentTableBody");
    if (!table) return;

    table.innerHTML = "";

    students.forEach(student => {
        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>Form ${student.form}</td>
                <td>${calculateAverage(student)}</td>
                <td>
                    <button onclick="viewStudent('${student.id}')">View</button>
                    <button class="promo-btn" onclick="promoteStudent('${student.id}')">Promote</button>
                    <button class="delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;
    });

    updateSubjectAnalysis();
}

// ================= VIEW =================
function viewStudent(id) {
    let student = students.find(s => s.id === id);

    document.getElementById("studentDetails").innerHTML = `
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Form:</strong> ${student.form}</p>
        <button onclick="addPerformance('${id}')">Add / Update Performance</button>
    `;
}

// ================= ADD PERFORMANCE =================
function addPerformance(id) {
    let student = students.find(s => s.id === id);

    let math = parseInt(prompt("Math:"));
    let english = parseInt(prompt("English:"));
    let science = parseInt(prompt("Science:"));
    let social = parseInt(prompt("Social Studies:"));

    if (isNaN(math)) return;

    student.performance = [{ math, english, science, social }];

    displayStudents();
}

// ================= AVERAGE =================
function calculateAverage(student) {
    if (student.performance.length === 0) return 0;

    let p = student.performance[0];
    return ((p.math + p.english + p.science + p.social) / 4).toFixed(2);
}

// ================= PROMOTION =================
function promoteStudent(id) {
    let student = students.find(s => s.id === id);

    if (student.form < 4) {
        student.form++;
        alert("Promoted successfully");
    } else {
        alert("Completed O-Level");
    }

    displayStudents();
    updateDashboard();
}

// ================= DELETE =================
function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    displayStudents();
    updateDashboard();
}

// ================= SEARCH =================
function searchStudent() {
    let id = prompt("Enter Student ID:");
    let student = students.find(s => s.id === id);
    if (student) viewStudent(id);
    else alert("Student not found");
}

// ================= DASHBOARD =================
function updateDashboard() {
    let dashboard = document.getElementById("dashboard");
    if (!dashboard) return;

    let form1 = students.filter(s => s.form === 1).length;
    let form2 = students.filter(s => s.form === 2).length;
    let form3 = students.filter(s => s.form === 3).length;
    let form4 = students.filter(s => s.form === 4).length;

    dashboard.innerHTML = `
        <p>Form 1: ${form1} students</p>
        <p>Form 2: ${form2} students</p>
        <p>Form 3: ${form3} students</p>
        <p>Form 4: ${form4} students</p>
        <p>Total Students: ${students.length}</p>
    `;
}

// ================= SUBJECT ANALYSIS =================
function updateSubjectAnalysis() {
    let div = document.getElementById("subjectAnalysis");
    if (!div) return;

    let totals = { math:0, english:0, science:0, social:0 };
    let count = 0;

    students.forEach(s => {
        if (s.performance.length > 0) {
            let p = s.performance[0];
            totals.math += p.math;
            totals.english += p.english;
            totals.science += p.science;
            totals.social += p.social;
            count++;
        }
    });

    if (count === 0) {
        div.innerHTML = "No performance data available.";
        return;
    }

    div.innerHTML = `
        <p>Math Average: ${(totals.math/count).toFixed(2)}</p>
        <p>English Average: ${(totals.english/count).toFixed(2)}</p>
        <p>Science Average: ${(totals.science/count).toFixed(2)}</p>
        <p>Social Studies Average: ${(totals.social/count).toFixed(2)}</p>
    `;
}
