document.addEventListener('DOMContentLoaded', function() {
    
    fetchPrescriptions();

    
    function fetchPrescriptions() {
        fetch('/api/pharmacist-prescriptions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayPrescriptions(data.prescriptions);
            })
            .catch(error => {
                console.error('Error fetching prescriptions:', error);
                document.getElementById('prescriptions').innerHTML = 
                    '<p class="error">Error loading prescriptions. Please try again later.</p>';
            });
    }

   
    function displayPrescriptions(prescriptions) {
        const prescriptionsContainer = document.getElementById('prescriptions');
        
        if (!prescriptions || prescriptions.length === 0) {
            prescriptionsContainer.innerHTML = '<p>No prescriptions received yet.</p>';
            return;
        }

        let html = '';
        prescriptions.forEach(prescription => {
            html += `
                <div class="prescription-card">
                    <p><strong>From Doctor:</strong> ${prescription.doctor_id}</p>
                    <p><strong>Prescription:</strong> ${prescription.prescription}</p>
                    <p><strong>Date:</strong> ${new Date(prescription.created_at).toLocaleString()}</p>
                </div>
            `;
        });

        prescriptionsContainer.innerHTML = html;
    }
});