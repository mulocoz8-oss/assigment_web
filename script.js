// ================= IMAGE SLIDER =================
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
if(slides.length>0){
    setInterval(()=>{
        slides[currentSlide].classList.remove("active");
        currentSlide++;
        if(currentSlide>=slides.length) currentSlide=0;
        slides[currentSlide].classList.add("active");
    },3000);
}

// ================= DATA STORAGE =================
let students = [];

// ================= REGISTER STUDENT =================
document.getElementById("studentForm").addEventListener("submit", e=>{
    e.preventDefault();
    let name = document.getElementById("studentName").value.trim();
    let studentId = document.getElementById("studentId").value.trim();
    let age = parseInt(document.getElementById("studentAge").value);
    let gender = document.getElementById("studentGender").value;
    let form = parseInt(document.getElementById("studentFormLevel").value);
    let year = document.getElementById("academicYear").value;

    if(!name || !studentId || !age || !gender || !form || !year){
        alert("Please fill all fields"); return;
    }
    if(students.some(s=>s.id===studentId && s.academicYear===year)){
        alert("Student ID must be unique for this academic year"); return;
    }

    students.push({id: studentId,name,age,gender,form,academicYear: year,performance: []});
    alert("Student registered successfully");
    document.getElementById("studentForm").reset();
    updateDashboard();
    displayStudents();
});

// ================= DISPLAY STUDENTS =================
function displayStudents(){
    let tbody = document.getElementById("studentTableBody");
    tbody.innerHTML = "";
    let year = document.getElementById("academicYear").value;
    let filtered = students.filter(s=>s.academicYear===year);

    filtered.forEach(s=>{
        let avg = calculateAverage(s);
        tbody.innerHTML+=`
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>Form ${s.form}</td>
                <td>${avg}</td>
                <td>
                    <button onclick="viewStudent('${s.id}')">View</button>
                    <button class="promo" onclick="promoteStudent('${s.id}')">Promote</button>
                    <button class="delete-btn" onclick="deleteStudent('${s.id}')">Delete</button>
                </td>
            </tr>`;
    });
}

// ================= VIEW STUDENT =================
function viewStudent(id){
    let student = students.find(s=>s.id===id);
    let div = document.getElementById("studentDetails");
    let html = `<p><strong>ID:</strong>${student.id}</p>
                <p><strong>Name:</strong>${student.name}</p>
                <p><strong>Age:</strong>${student.age}</p>
                <p><strong>Gender:</strong>${student.gender}</p>
                <p><strong>Form:</strong>${student.form}</p>
                <button onclick="addPerformance('${student.id}')">Add / Update Performance</button>`;

    student.performance.forEach(p=>{
        html+=`<p><strong>Form ${p.form}</strong></p>
               <ul>
                <li>Math: ${p.subjects.math}</li>
                <li>English: ${p.subjects.english}</li>
                <li>Science: ${p.subjects.science}</li>
                <li>Social Studies: ${p.subjects.social}</li>
               </ul>`;
    });
    div.innerHTML = html;
}

// ================= ADD / UPDATE PERFORMANCE =================
function addPerformance(id){
    let student = students.find(s=>s.id===id);
    let math=parseInt(prompt("Math Score:"));
    let english=parseInt(prompt("English Score:"));
    let science=parseInt(prompt("Science Score:"));
    let social=parseInt(prompt("Social Studies Score:"));

    if([math,english,science,social].some(isNaN)){ alert("Invalid scores"); return; }

    let record = {form: student.form, subjects:{math,english,science,social}};
    let existing = student.performance.find(p=>p.form===student.form);
    if(existing) existing.subjects = record.subjects; else student.performance.push(record);

    viewStudent(id); displayStudents(); updateDashboard();
}

// ================= CALCULATE AVERAGE =================
function calculateAverage(student){
    if(student.performance.length===0) return 0;
    let total=0,count=0;
    student.performance.forEach(p=>{
        for(let key in p.subjects){total+=p.subjects[key]; count++;}
    });
    return (total/count).toFixed(2);
}

// ================= PROMOTE =================
function promoteStudent(id){
    let student=students.find(s=>s.id===id);
    if(student.form<4){ student.form++; alert("Student promoted!"); }
    else alert("Student has completed O-Level.");
    displayStudents(); viewStudent(id); updateDashboard();
}

// ================= DELETE =================
function deleteStudent(id){
    let year = document.getElementById("academicYear").value;
    students = students.filter(s=>!(s.id===id && s.academicYear===year));
    document.getElementById("studentDetails").innerHTML="";
    displayStudents(); updateDashboard();
}

// ================= SEARCH =================
function searchStudent(){
    let id = prompt("Enter Student ID:");
    let year = document.getElementById("academicYear").value;
    let student = students.find(s=>s.id===id && s.academicYear===year);
    if(student){ viewStudent(id); alert("Student found: "+student.name);}
    else alert("Student not found.");
}

// ================= DASHBOARD =================
function updateDashboard(){
    let year = document.getElementById("academicYear").value;
    let filtered = students.filter(s=>s.academicYear===year);

    document.getElementById("totalForm1").innerText=filtered.filter(s=>s.form===1).length;
    document.getElementById("totalForm2").innerText=filtered.filter(s=>s.form===2).length;
    document.getElementById("totalForm3").innerText=filtered.filter(s=>s.form===3).length;
    document.getElementById("totalForm4").innerText=filtered.filter(s=>s.form===4).length;

    let subjects=["math","english","science","social"];
    let ul=document.getElementById("subjectAverages");
    ul.innerHTML="";
    subjects.forEach(sub=>{
        let total=0,count=0;
        filtered.forEach(s=>s.performance.forEach(p=>{
            if(p.subjects[sub]!==undefined){ total+=p.subjects[sub]; count++;}
        }));
        let avg = count>0 ? (total/count).toFixed(2) : 0;
        ul.innerHTML+=`<li>${sub.charAt(0).toUpperCase()+sub.slice(1)}: ${avg}</li>`;
    });
}

// ================= UPDATE DASHBOARD ON YEAR CHANGE =================
document.getElementById("academicYear").addEventListener("change", ()=>{
    updateDashboard(); displayStudents();
});