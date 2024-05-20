const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.post('/register', (req, res) => {
  const { name, stream, form } = req.body;
  const admissionNumber = Math.floor(Math.random() * 1000000);
  const student = { admissionNumber, name, stream, form };

  console.log('New student registered:', student); 

  let students = [];
  try {
    const data = fs.readFileSync('students.json', 'utf8');
    students = JSON.parse(data);
  } catch (err) {
    console.error('Error reading students file:', err);
  }

  students.push(student);

  fs.writeFile('students.json', JSON.stringify(students, null, 2), err => {
    if (err) {
      console.error('Error writing students file:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Sending response to client:', student); 
      //res.json(student);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
