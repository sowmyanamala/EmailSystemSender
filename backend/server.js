const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME
});
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// API route to save user and send email
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).send(err);

    // Email setup
    // const transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS
    //   }
    // });

    const transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 1025, 
        secure: false
      });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmation Email',
      text: `Good morning ${name},\n\nYour email (${email}) has been registered successfully!\n\nBest regards,\nTeam Admin`
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) return res.status(500).send(error);
      res.send({ message: 'User saved and email sent!' });
    });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
