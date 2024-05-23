const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3005

const studentsFile = path.join(__dirname, 'students.json')


if (!fs.existsSync(studentsFile)) {
  fs.writeFileSync(studentsFile, JSON.stringify([]))
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname)))

app.post('/register', (req, res) => {
  const { name, stream, form } = req.body;
  const admissionNumber = Math.floor(Math.random() * 1000000)
  const student = { admissionNumber, name, stream, form }

  let students = []
  try {
    const data = fs.readFileSync(studentsFile, 'utf8')
    students = JSON.parse(data)
  } catch (err) {
    console.error('Error reading students file:', err)
  }

  students.push(student)

  fs.writeFile(studentsFile, JSON.stringify(students, null, 2), err => {
    if (err) {
      console.error('Error writing students file:', err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(student)
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/students', (req, res) => {
  try {
    const data = fs.readFileSync(studentsFile, 'utf8')
    const students = JSON.parse(data)
    res.json(students)
  } catch (err) {
    console.error('Error reading students file:', err)
    res.status(500).send('Internal Server Error')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
