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
    const { to, code } = JSON.parse(event.body);

    if (!to || !code) {
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

    const verificationCheck = await client.verify.v2
      .services(process.env.VITE_TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to,
        code
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        valid: verificationCheck.status === 'approved'
      })
    };
  } catch (error) {
    console.error('Twilio Verification Check Error:', error);
    
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