const twilio = require('twilio');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
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
    const { to, body } = JSON.parse(event.body);

    if (!to || !body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    const client = twilio(
      process.env.VITE_TWILIO_ACCOUNT_SID,
      process.env.VITE_TWILIO_AUTH_TOKEN
    );

    const message = await client.messages.create({
      to,
      from: process.env.VITE_TWILIO_PHONE_NUMBER,
      body,
      statusCallback: `${process.env.VITE_APP_URL}/.netlify/functions/twilio-status-callback`
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sid: message.sid
      })
    };
  } catch (error) {
    console.error('Twilio Error:', error);
    
    return {
      statusCode: error.status || 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
        code: error.code
      })
    };
  }
};