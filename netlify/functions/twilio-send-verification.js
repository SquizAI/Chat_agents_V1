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
    const { to } = JSON.parse(event.body);

    if (!to) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing phone number' })
      };
    }

    const client = twilio(
      process.env.VITE_TWILIO_ACCOUNT_SID,
      process.env.VITE_TWILIO_AUTH_TOKEN
    );

    const verification = await client.verify.v2
      .services(process.env.VITE_TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to,
        channel: 'sms'
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        sid: verification.sid
      })
    };
  } catch (error) {
    console.error('Twilio Verification Error:', error);
    
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