const fetch = require('node-fetch');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, headers, body } = JSON.parse(event.body);

    console.log('🛬 Incoming Request to proxy:');
    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);

    const fetchOptions = {
      method: 'POST',
      headers,
    };

    if (body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    const resText = await response.text();

    console.log('✅ Response from Nuvei:');
    console.log('Status:', response.status);
    console.log('Body:', resText);

    return {
      statusCode: response.status,
      body: resText,
      headers: {
        'Content-Type': 'application/json'
      }
    };

  } catch (err) {
    console.error('❌ Proxy Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
