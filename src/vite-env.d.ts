/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TWILIO_ACCOUNT_SID: string
  readonly VITE_TWILIO_AUTH_TOKEN: string
  readonly VITE_TWILIO_PHONE_NUMBER: string
  readonly VITE_TWILIO_RECOVERY_CODE: string
  readonly VITE_OPENAI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}