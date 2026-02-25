// ================= DATA STORAGE =================
let students = [];

// Tanzania O-Level Subjects
const subjects = [
    "Mathematics", "English", "Kiswahili",
    "Biology", "Chemistry", "Physics",
    "History", "Geography", "Civics"
];

// ================= REGISTER STUDENT =================
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let id = document.getElementById("studentId").value.trim();
    let age = parseInt(document.getElementById("age").value);
    let gender = document.getElementById("gender").value;
    let form = parseInt(document.getElementById("formLevel").value);

    if (!/^[A-Za-z ]+$/.test(name)) {
        alert("Invalid name.");
        return;
    }

    if (students.some(s => s.id === id)) {
        alert("ID must be unique.");
        return;
    }

    students.push({
        id,
        name,
        age,
        gender,
        form,
        performance: []
    });

    alert("Student Registered Successfully.");
    this.reset();
});

// ================= LOAD CLASS DASHBOARD =================
function loadClass() {

    let selectedForm = parseInt(document.getElementById("formSelector").value);
    let table = document.getElementById("classTable");
    table.innerHTML = "";

    let classStudents = students.filter(s => s.form === selectedForm);

    classStudents.forEach((student, index) => {

        table.innerHTML += `
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${calculateAverage(student)}</td>
            <td>
                <button onclick="addResults('${student.id}')">
                Add Results
                </button>
            </td>
        </tr>
        `;
    });
}

// ================= TEACHER ADD RESULTS =================
function addResults(studentId) {

    let student = students.find(s => s.id === studentId);

    let record = {
        form: student.form,
        subjects: {}
    };

    for (let i = 0; i < subjects.length; i++) {

        let score = parseInt(prompt(subjects[i] + " score:"));

        if (isNaN(score) || score < 0 || score > 100) {
            alert("Invalid score.");
            return;
        }

        record.subjects[subjects[i]] = score;
    }

    student.performance.push(record);

    alert("Results Added Successfully.");
}

// ================= CALCULATE AVERAGE =================
function calculateAverage(student) {

    if (student.performance.length === 0) return "N/A";

    let latest = student.performance[student.performance.length - 1];
    let scores = Object.values(latest.subjects);

    let total = scores.reduce((sum, val) => sum + val, 0);
    return (total / scores.length).toFixed(2);
}

// ================= SUBJECT PERFORMANCE ANALYSIS =================
function analyzeSubject() {

    let subject = document.getElementById("subjectSelector").value;

    if (!subject) {
        alert("Select subject first.");
        return;
    }

    let scores = [];

    students.forEach(student => {
        if (student.performance.length > 0) {
            let latest = student.performance[student.performance.length - 1];
            if (latest.subjects[subject] !== undefined) {
                scores.push(latest.subjects[subject]);
            }
        }
    });

    if (scores.length === 0) {
        document.getElementById("subjectResult").innerText =
            "No data available.";
        return;
    }

    let total = scores.reduce((a, b) => a + b, 0);
    let avg = (total / scores.length).toFixed(2);

    let highest = Math.max(...scores);
    let lowest = Math.min(...scores);

    document.getElementById("subjectResult").innerText =
        `Subject: ${subject}
        | Average: ${avg}
        | Highest: ${highest}
        | Lowest: ${lowest}`;
}