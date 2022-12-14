const TOTAL_MARK = 150;
const PASS_PERCENT = 40;

const createElement = function (elName, className, textContent) {
  const createdElement = document.createElement(elName);
  createdElement.className = className;

  if (textContent) {
    createdElement.textContent = textContent;
  }

  return createdElement
}

const appendChildren = function (parentElement, children) {
  for (let i = 0; i < children.length; i++) {
    parentElement.append(children[i])
  }
}

const addZero = function (number) {
  return number < 10 ? "0" + number : number
}

const showDate = function (dateString) {
  const date = new Date(dateString);

  return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const renderStudent = function (student) {
  const {
    id,
    name: stName,
    lastName,
    mark,
    markedDate
  } = student;

  const studentRow = document.createElement("tr");

  const studentId = createElement("td", "py-3 text-center", id)
  const studentName = createElement("td", "py-3 fw-bold", `${stName} ${lastName}`);
  const studentMarkedDate = createElement("td", "py-3", showDate(markedDate));

  const markPercent = Math.round(mark * 100 / TOTAL_MARK);
  const studentMark = createElement("td", "py-3 text-center", markPercent + "%");

  const studentPassStatus = createElement("td", "py-3 text-center");
  const studentPassParagraph = createElement("p", "h5");
  const studentPassBadge = createElement("span", "badge rounded-pill")

  if (markPercent >= PASS_PERCENT) {
    studentPassBadge.textContent = "Pass";
    studentPassBadge.classList.add("bg-success");
  } else {
    studentPassBadge.textContent = "Fail";
    studentPassBadge.classList.add("bg-danger");
  }
  studentPassParagraph.append(studentPassBadge);
  studentPassStatus.append(studentPassParagraph);

  const studentEdit = createElement("td", "py-3 text-center");
  const studentEditBtn = createElement("button", "btn btn-outline-secondary");
  const studentEditIcon = createElement("i", "fa-solid fa-pen");
  studentEditBtn.append(studentEditIcon);
  studentEdit.append(studentEditBtn);


  const studentDel = createElement("td", "py-3 text-center");
  const studentDelBtn = createElement("button", "btn btn-outline-danger");
  const studentDelIcon = createElement("i", "fa-solid fa-trash");
  studentDelIcon.style.pointerEvents = "none";
  studentDelBtn.append(studentDelIcon);
  studentDel.append(studentDelBtn);
  studentDelBtn.setAttribute("data-student", id);

  appendChildren(studentRow, [studentId, studentName, studentMarkedDate, studentMark, studentPassStatus, studentEdit, studentDel]);

  return studentRow;
}

const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");
const elementCount = document.querySelector(".count")
const percentDisplay = document.getElementById('percent')



const renderStudents = function () {
  let sum = 0
  students.forEach((student) => {
    sum += student.mark
  })
  const percent = Math.round(sum * 100 / TOTAL_MARK / students.length)
    
  studentsTableBody.innerHTML = "";
  elementCount.innerHTML = `Count: ${students.length}`
  percentDisplay.innerHTML = `Average mark: ${percent}%`

  students.forEach(function (student) {
  const studentRow = renderStudent(student);
  studentsTableBody.append(studentRow);
  })
  console.log(sum);
}
renderStudents();

const addStudentModalEl = document.querySelector("#edit-student-modal");
const addStudentModal = new bootstrap.Modal(addStudentModalEl);

// ADD student

const form = document.getElementById("add-form")
form.addEventListener("submit", function(e) {
    e.preventDefault();
    const element = e.target.elements;

    const nameSt = element.name.value;
    const lastName = element.lastname.value;
    const mark = +element.mark.value;

    if(nameSt.trim() && lastName.trim() && mark >= 0 && mark <= TOTAL_MARK){
        const newStudent = {
            id: Math.floor(Math.random() * 1000),
            name: nameSt,
            lastName: lastName,
            mark: mark,
            markedDate: new Date().toISOString()
        }
        students.push(newStudent)
    }
    renderStudents(); 
    form.reset();

    addStudentModal.hide()
})


// REMOVE STUDENT

studentsTable.addEventListener("click", (e) => {

  if(e.target.matches(".btn-outline-danger")){
    const clickedBtn = +e.target.dataset.student

    const clickedStudent = students.findIndex((student) => {
      return student.id == clickedBtn
    })

    students.splice(clickedStudent, 1)
  }
  renderStudents()
})

// EDIT STUDENT

const editModal = document.getElementById("edit-student-modal")
const editForm = document.getElementById("add-form")

editForm.addEventListener("submit", (e) => {

})


// SORT

const filterForm = document.getElementById('filter')

filterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const sortValue = e.target.elements.sortby.value
  const searchValue = e.target.elements.search.value

  students.sort((a, b) => {
    switch (sortValue) {
      case "1":
        if (a.name > b.name) {
          return 1
        } else if(b.name > a.name){
          return -1
        } else{
          return 0
        }
      case "2":
        return b.mark - a.mark
      case "3":
        return a.mark - b.mark
      case "4":
        return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime()
      default:

        break;
    }
  })
  renderStudents()
})