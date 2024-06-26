const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3006;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname))); 

mongoose.connect('mongodb://localhost:27017/studentManagement', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const studentSchema = new mongoose.Schema({
  admissionNumber: Number,
  name: String,
  stream: String,
  form: String
});

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject: String,
  marks: Number
});

const Student = mongoose.model('Student', studentSchema);
const Mark = mongoose.model('Mark', markSchema);

app.post('/register', async (req, res) => {
  const { name, stream, form } = req.body;
  const admissionNumber = Math.floor(Math.random() * 1000000);
  const student = new Student({ admissionNumber, name, stream, form });

  try {
    await student.save();
    res.json(student);
  } catch (err) {
    console.error('Error registering student:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/submitMarks', async (req, res) => {
  const { student, subject, marks } = req.body;

  try {
    const studentInfo = await Student.findOne({ admissionNumber: parseInt(student) });
    if (!studentInfo) {
      return res.status(400).send('Student not found');
    }

    const mark = new Mark({ student: studentInfo._id, subject, marks: parseInt(marks) });
    await mark.save();

    res.json({ student, subject, marks: parseInt(marks), studentName: studentInfo.name });
  } catch (err) {
    console.error('Error submitting marks:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Error reading students:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/marks', async (req, res) => {
  try {
    const marks = await Mark.find().populate('student');
    res.json(marks);
  } catch (err) {
    console.error('Error reading marks:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/rankings', async (req, res) => {
  try {
    const students = await Student.find();
    const marks = await Mark.find().populate('student');

    const studentMap = new Map();

    students.forEach(student => {
      studentMap.set(student.admissionNumber, {
        name: student.name,
        admissionNumber: student.admissionNumber,
        totalMarks: 0,
        grade: '',
      });
    });

    marks.forEach(mark => {
      const student = studentMap.get(parseInt(mark.student.admissionNumber));
      if (student) {
        student.totalMarks += mark.marks;
      }
    });

    studentMap.forEach(student => {
      student.grade = calculateGrade(student.totalMarks);
    });

    const rankings = Array.from(studentMap.values())
      .sort((a, b) => b.totalMarks - a.totalMarks);

    res.json(rankings);
  } catch (err) {
    console.error('Error calculating rankings:', err);
    res.status(500).send('Internal Server Error');
  }
});

function calculateGrade(totalMarks) {
  if (totalMarks >= 500) return 'A';
  if (totalMarks >= 400) return 'B';
  if (totalMarks >= 300) return 'C';
  if (totalMarks >= 100) return 'D';
  return 'F';
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
