const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const path = require('path');


router.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views' });
});


router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});


router.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: './views' });
});


router.post('/login', authController.login);


router.post('/signup', authController.signup);


router.get('/patient-form', (req, res) => {
  res.sendFile('patient-form.html', { root: './views' });
});


router.post('/submit-patient-info', authController.submitPatientInfo);


router.get('/patient-dashboard', (req, res) => {
  res.sendFile('patient-dashboard.html', { root: './views' });
});


router.post('/send-message', authController.sendMessage);

router.get('/doctor-dashboard', (req, res) => {
  res.sendFile('doctor-dashboard.html', { root: './views' });
});


router.post('/send-prescription', authController.sendPrescription);


router.get('/pharmacist-dashboard', (req, res) => {
  res.sendFile('pharmacist-dashboard.html', { root: './views' });
});


router.post('/send-prescription-to-patient', authController.sendPrescriptionToPatient);


router.get('/hospital-database', (req, res) => {
  res.sendFile('hospital-database.html', { root: './views' });
});


router.get('/api/doctor-messages', authController.getDoctorMessages);
router.get('/api/pharmacist-prescriptions', authController.getPharmacistPrescriptions);
router.get('/api/patient-prescriptions', authController.getPatientPrescriptions);
router.get('/api/hospital-data', authController.getHospitalData);

module.exports = router;