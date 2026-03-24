fetch('http://localhost:8081/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        password: 'password123',
        role: 'HOMEOWNER',
        fullName: 'Test User Node',
        email: 'testnode2@example.com'
    })
}).then(async res => {
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
}).catch(err => {
    console.error("Error:", err);
});
