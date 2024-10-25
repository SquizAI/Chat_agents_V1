export const env = {
  TWILIO_ACCOUNT_SID: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
  TWILIO_RECOVERY_CODE: import.meta.env.VITE_TWILIO_RECOVERY_CODE,
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY,
  APP_URL: import.meta.env.VITE_APP_URL || window.location.origin,
};