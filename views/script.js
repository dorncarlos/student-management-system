document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const studentsTableBody = document.getElementById('studentsTableBody');

    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      
      fetch('/register', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(student => {
        addStudentToTable(student);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });

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
});
