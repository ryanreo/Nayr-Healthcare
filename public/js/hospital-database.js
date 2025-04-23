document.addEventListener('DOMContentLoaded', function() {
    // Fetch hospital data from the server
    fetchHospitalData();

    // Function to fetch hospital data
    function fetchHospitalData() {
        fetch('/api/hospital-data')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayPatients(data.patients);
                displayDoctors(data.doctors);
                displayPrescriptions(data.prescriptions);
            })
            .catch(error => {
                console.error('Error fetching hospital data:', error);
                document.getElementById('patients').innerHTML = 
                    '<p class="error">Error loading hospital data. Please try again later.</p>';
            });
    }

    // Function to display patients
    function displayPatients(patients) {
        const patientsContainer = document.getElementById('patients');
        
        if (!patients || patients.length === 0) {
            patientsContainer.innerHTML = '<p>No patients registered yet.</p>';
            return;
        }

        let html = '<table class="data-table"><tr><th>ID</th><th>Name</th><th>Phone</th><th>Medical Info</th></tr>';
        patients.forEach(patient => {
            html += `
                <tr>
                    <td>${patient.user_id}</td>
                    <td>${patient.full_name}</td>
                    <td>${patient.phone_number}</td>
                    <td>
                        <p>Surgery: ${patient.has_surgery ? 'Yes' : 'No'}</p>
                        <p>Diabetes: ${patient.has_diabetes ? 'Yes' : 'No'}</p>
                        <p>Other: ${patient.other_medical_info || 'None'}</p>
                    </td>
                </tr>
            `;
        });
        html += '</table>';

        patientsContainer.innerHTML = html;
    }

    // Function to display doctors
    function displayDoctors(doctors) {
        const doctorsContainer = document.getElementById('doctors');
        
        if (!doctors || doctors.length === 0) {
            doctorsContainer.innerHTML = '<p>No doctors registered yet.</p>';
            return;
        }

        let html = '<table class="data-table"><tr><th>Username</th><th>Email</th><th>Role</th></tr>';
        doctors.forEach(doctor => {
            html += `
                <tr>
                    <td>${doctor.username}</td>
                    <td>${doctor.email || 'Not provided'}</td>
                    <td>${doctor.role}</td>
                </tr>
            `;
        });
        html += '</table>';

        doctorsContainer.innerHTML = html;
    }

    function displayPrescriptions(prescriptions) {
        const prescriptionsContainer = document.getElementById('prescriptions');
        
        if (!prescriptions || prescriptions.length === 0) {
            prescriptionsContainer.innerHTML = '<p>No prescriptions issued yet.</p>';
            return;
        }

        let html = '<table class="data-table"><tr><th>Doctor</th><th>Pharmacist</th><th>Prescription</th><th>Date</th></tr>';
        prescriptions.forEach(prescription => {
            html += `
                <tr>
                    <td>${prescription.doctor_id}</td>
                    <td>${prescription.pharmacist_name}</td>
                    <td>${prescription.prescription}</td>
                    <td>${new Date(prescription.created_at).toLocaleString()}</td>
                </tr>
            `;
        });
        html += '</table>';

        prescriptionsContainer.innerHTML = html;
    }
});