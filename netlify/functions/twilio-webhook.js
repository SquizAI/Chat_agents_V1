exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = new URLSearchParams(event.body);
    const messageData = {
      MessageSid: data.get('MessageSid'),
      From: data.get('From'),
      To: data.get('To'),
      Body: data.get('Body'),
      Status: data.get('MessageStatus')
    };

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/xml'
      },
      body: '<?xml version="1.0" encoding="UTF-8"?><Response></Response>'
    };
  } catch (error) {
    console.error('Webhook Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};