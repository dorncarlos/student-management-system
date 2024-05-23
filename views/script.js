document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm')
    const studentsTableBody = document.getElementById('studentsTableBody')
  
    function fetchAndDisplayStudents() {
      fetch('/students')
        .then(response => response.json())
        .then(students => {
          studentsTableBody.innerHTML = ''
          students.forEach(student => {
            addStudentToTable(student)
          });
        })
        .catch(error => console.error('Error fetching students:', error))
    }
  
    function addStudentToTable(student) {
      const row = document.createElement('tr')
      row.innerHTML = `
        <td>${student.admissionNumber}</td>
        <td>${student.name}</td>
        <td>${student.stream}</td>
        <td>${student.form}</td>
      `
      studentsTableBody.appendChild(row)
    }
  
    fetchAndDisplayStudents()
  
    registerForm.addEventListener('submit', event => {
      event.preventDefault()
      const formData = new FormData(registerForm)
      const formObject = Object.fromEntries(formData)
  
      fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
      })
      .then(response => response.json())
      .then(student => {
        addStudentToTable(student)
      })
      .catch(error => console.error('Error registering student:', error))
    });
  });
  