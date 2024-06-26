document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const studentsTableBody = document.getElementById('studentsTableBody');
  const studentSelect = document.getElementById('student');
  const marksForm = document.getElementById('marksForm');
  const marksTableBody = document.getElementById('marksTableBody');
  const rankingsTableBody = document.getElementById('rankingsTableBody');
  const loginPage = document.getElementById('loginPage');
  const mainContent = document.getElementById('mainContent');

  fetchAndDisplayStudents();
  fetchAndDisplayMarks();
  fetchAndDisplayRankings();

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Doncarlos' && password === 'Don123') {
      loginPage.style.display = 'none';
      mainContent.style.display = 'block';
      fetchAndDisplayStudents(); 
    } else {
      alert('Invalid credentials');
    }
  });

  function fetchAndDisplayStudents() {
    fetch('/students')
      .then(response => response.json())
      .then(students => {
        studentsTableBody.innerHTML = '';
        studentSelect.innerHTML = '';
        students.forEach(student => {
          addStudentToTable(student);
          addStudentToDropdown(student);
        });
      })
      .catch(error => console.error('Error fetching students:', error));
  }

  function addStudentToTable(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${student.admissionNumber}</td>
      <td>${student.name}</td>
      <td>${student.stream}</td>
      <td>${student.form}</td>
    `;
    studentsTableBody.appendChild(row);
  }

  function addStudentToDropdown(student) {
    const option = document.createElement('option');
    option.value = student.admissionNumber;
    option.textContent = `${student.name} (${student.admissionNumber})`;
    studentSelect.appendChild(option);
  }

  function fetchAndDisplayMarks() {
    fetch('/marks')
      .then(response => response.json())
      .then(marks => {
        marksTableBody.innerHTML = '';
        marks.forEach(mark => {
          addMarkToTable(mark);
        });
      })
      .catch(error => console.error('Error fetching marks:', error));
  }

  function addMarkToTable(mark) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${mark.student.name}</td>
      <td>${mark.subject}</td>
      <td>${mark.marks}</td>
    `;
    marksTableBody.appendChild(row);
  }

  function fetchAndDisplayRankings() {
    fetch('/rankings')
      .then(response => response.json())
      .then(rankings => {
        rankingsTableBody.innerHTML = '';
        rankings.forEach(ranking => {
          addRankingToTable(ranking);
        });
      })
      .catch(error => console.error('Error fetching rankings:', error));
  }

  function addRankingToTable(ranking) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${ranking.name}</td>
      <td>${ranking.admissionNumber}</td>
      <td>${ranking.totalMarks}</td>
      <td>${ranking.grade}</td>
    `;
    rankingsTableBody.appendChild(row);
  }

  registerForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(registerForm);
    const formObject = Object.fromEntries(formData);

    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject)
    })
      .then(response => response.json())
      .then(student => {
        addStudentToTable(student);
        addStudentToDropdown(student);
      })
      .catch(error => console.error('Error registering student:', error));
  });

  marksForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(marksForm);
    const formObject = Object.fromEntries(formData);

    fetch('/submitMarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formObject)
    })
      .then(response => response.json())
      .then(mark => {
        fetchAndDisplayMarks();
        fetchAndDisplayRankings(); 
      })
      .catch(error => console.error('Error submitting marks:', error));
  });
});
