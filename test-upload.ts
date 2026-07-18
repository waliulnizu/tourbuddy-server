async function run(): Promise<void> {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@tourbuddy.com', password: 'admin123' })
    });
    const loginData = await loginRes.json() as { token: string };
    const token = loginData.token;

    console.log('Token acquired. Posting guide...');

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';

    body += `--${boundary}\r\nContent-Disposition: form-data; name="name"\r\n\r\nTest Name\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="phone"\r\n\r\n123456\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="designation"\r\n\r\nGuide\r\n`;
    body += `--${boundary}\r\nContent-Disposition: form-data; name="status"\r\n\r\nactive\r\n`;

    const fileContent = 'dummy image content';
    body += `--${boundary}\r\nContent-Disposition: form-data; name="guide_image"; filename="test.jpg"\r\nContent-Type: image/jpeg\r\n\r\n${fileContent}\r\n`;
    body += `--${boundary}--\r\n`;

    const res = await fetch('http://localhost:5000/api/admin/guides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      },
      body: body
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
