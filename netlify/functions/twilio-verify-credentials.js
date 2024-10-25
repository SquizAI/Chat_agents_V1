const twilio = require('twilio');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Verify credentials by attempting to fetch account info
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Credentials verified successfully'
      })
    };
  } catch (error) {
    console.error('Twilio Verification Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to verify Twilio credentials',
        details: error.message
      })
    };
  }
};