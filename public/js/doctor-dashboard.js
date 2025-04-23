document.addEventListener('DOMContentLoaded', function() {

    fetchMessages();

    function fetchMessages() {
        fetch('/api/doctor-messages')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayMessages(data.messages);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                document.getElementById('messages').innerHTML = 
                    '<p class="error">Error loading messages. Please try again later.</p>';
            });
    }

    function displayMessages(messages) {
        const messagesContainer = document.getElementById('messages');
        
        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = '<p>No messages received yet.</p>';
            return;
        }

        let html = '';
        messages.forEach(message => {
            html += `
                <div class="message-card">
                    <p><strong>From Patient:</strong> ${message.patient_id}</p>
                    <p><strong>Message:</strong> ${message.message}</p>
                    <p><strong>Date:</strong> ${new Date(message.created_at).toLocaleString()}</p>
                </div>
            `;
        });

        messagesContainer.innerHTML = html;
    }
});