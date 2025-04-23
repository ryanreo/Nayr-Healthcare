const db = require('../database/db');
const bcrypt = require('bcryptjs');


const hardcodedUsers = [
  {
    username: 'dr_smith',
    password: 'smith123', 
    role: 'doctor',
    fullName: 'Dr. Smith'
  },
  {
    username: 'dr_jane',
    password: 'jane123',
    role: 'doctor',
    fullName: 'Dr. Jane'
  },
  {
    username: 'dr_miles',
    password: 'miles123',
    role: 'doctor',
    fullName: 'Dr. Miles'
  },
  {
    username: 'pharmacist_tim',
    password: 'tim123',
    role: 'pharmacist',
    fullName: 'Pharmacist Tim'
  }
];

const authController = {
  login: async (req, res) => {
    const { username, password, role } = req.body;

    if (role === 'doctor' || role === 'pharmacist') {
      
      const user = hardcodedUsers.find(
        (u) => u.username === username && u.role === role
      );

      if (user) {
        
        if (password === user.password) {
          req.session.userId = user.username; 
          req.session.role = user.role; 
          req.session.fullName = user.fullName; 

          
          if (role === 'doctor') {
            res.redirect('/doctor-dashboard');
          } else if (role === 'pharmacist') {
            res.redirect('/pharmacist-dashboard');
          }
        } else {
          res.send('Invalid credentials');
        }
      } else {
        res.send('User not found for the selected role');
      }
    } else if (role === 'patient') {
      const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
      db.query(query, [username, role], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).send('Database error');
        }

        if (results.length > 0) {
          const user = results[0];

          
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.error('Error comparing passwords:', err);
              return res.status(500).send('Internal server error');
            }

            if (isMatch) {
              req.session.userId = user.username; 
              req.session.role = user.role; 
              req.session.fullName = user.fullName; 

              const checkPatientQuery = 'SELECT * FROM patients WHERE user_id = ?';
              db.query(checkPatientQuery, [req.session.userId], (err, patientResults) => {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).send('Database error');
                }

                if (patientResults.length > 0) {
                  res.redirect('/patient-dashboard');
                } else {
                  res.redirect('/patient-form');
                }
              });
            } else {
              res.send('Invalid credentials');
            }
          });
        } else {
          res.send('User not found for the selected role');
        }
      });
    } else {
      res.send('Invalid role');
    }
  },

  signup: async (req, res) => {
    const { username, email, password, role } = req.body;

    
    if (role !== 'patient') {
      return res.status(400).send('Sign-up is only allowed for patients');
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const query = 'INSERT INTO users (username, email, password, role, fullName) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, hashedPassword, role, username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Failed to sign up');
      }
      res.send(`Sign-up successful! Welcome, ${role}.`);
    });
  },

  submitPatientInfo: (req, res) => {
    const { fullName, phoneNumber, hasSurgery, hasDiabetes, otherMedicalInfo } = req.body;
    const userId = req.session.userId;

    const query = `
        INSERT INTO patients (user_id, full_name, phone_number, has_surgery, has_diabetes, other_medical_info)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [userId, fullName, phoneNumber, hasSurgery, hasDiabetes, otherMedicalInfo], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Failed to submit patient info');
      }
      res.redirect('/patient-dashboard');
    });
  },

  sendMessage: (req, res) => {
    const { doctor, message } = req.body;
    const patientId = req.session.userId; 
  
    const query = `
        INSERT INTO messages (patient_id, doctor_name, message)
        VALUES (?, ?, ?)
    `;
    
    db.query(query, [patientId, doctor, message], (err, results) => {
      if (err) {
        console.error('Error sending message:', err);
        return res.status(500).send('Failed to send message');
      }
      res.redirect('/patient-dashboard');
    });
  },

  sendPrescription: (req, res) => {
    const { prescription } = req.body;
    const doctorId = req.session.userId; 
    
   
    const query = `
        INSERT INTO prescriptions (doctor_id, pharmacist_name, prescription)
        VALUES (?, 'Pharmacist Tim', ?)
    `;
    
    db.query(query, [doctorId, prescription], (err, results) => {
      if (err) {
        console.error('Error sending prescription:', err);
        return res.status(500).send('Failed to send prescription');
      }
      res.redirect('/doctor-dashboard');
    });
  },

  sendPrescriptionToPatient: (req, res) => {
    const { prescription } = req.body;

    const query = `
        INSERT INTO patient_prescriptions (pharmacist_name, prescription)
        VALUES ('Pharmacist Tim', ?)
    `;
    db.query(query, [prescription], (err, results) => {
      if (err) {
        console.error('Error sending prescription to patient:', err);
        return res.status(500).send('Failed to send prescription');
      }
      res.redirect('/pharmacist-dashboard');
    });
  },

  getDoctorMessages: (req, res) => {
    const doctorName = req.session.fullName; 

    const query = 'SELECT * FROM messages WHERE doctor_name = ?';
    db.query(query, [doctorName], (err, results) => {
      if (err) {
        console.error('Error fetching messages:', err);
        return res.status(500).json({ error: 'Failed to fetch messages' });
      }
      res.json({ messages: results });
    });
  },

  getPharmacistPrescriptions: (req, res) => {
    const pharmacistName = 'Pharmacist Tim'; // Hardcoded pharmacist

    const query = 'SELECT * FROM prescriptions WHERE pharmacist_name = ?';
    db.query(query, [pharmacistName], (err, results) => {
      if (err) {
        console.error('Error fetching prescriptions:', err);
        return res.status(500).json({ error: 'Failed to fetch prescriptions' });
      }
      res.json({ prescriptions: results });
    });
  },

  getPatientPrescriptions: (req, res) => {
    const query = 'SELECT * FROM patient_prescriptions';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching patient prescriptions:', err);
        return res.status(500).json({ error: 'Failed to fetch prescriptions' });
      }
      res.json({ prescriptions: results });
    });
  },

  getHospitalData: (req, res) => {
    const patientsQuery = 'SELECT * FROM patients';
    const doctorsQuery = 'SELECT * FROM users WHERE role = "doctor"';
    const prescriptionsQuery = 'SELECT * FROM prescriptions';

    db.query(patientsQuery, (err, patients) => {
      if (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'Failed to fetch patients' });
      }

      db.query(doctorsQuery, (err, doctors) => {
        if (err) {
          console.error('Error fetching doctors:', err);
          return res.status(500).json({ error: 'Failed to fetch doctors' });
        }

        db.query(prescriptionsQuery, (err, prescriptions) => {
          if (err) {
            console.error('Error fetching prescriptions:', err);
            return res.status(500).json({ error: 'Failed to fetch prescriptions' });
          }

          res.json({
            patients,
            doctors,
            prescriptions
          });
        });
      });
    });
  }
};

module.exports = authController;