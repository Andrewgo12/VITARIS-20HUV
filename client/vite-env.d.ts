/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SMTP_HOST?: string
  readonly VITE_SMTP_PORT?: string
  readonly VITE_SMTP_USER?: string
  readonly VITE_SMTP_PASS?: string
  readonly VITE_TWILIO_ACCOUNT_SID?: string
  readonly VITE_TWILIO_AUTH_TOKEN?: string
  readonly VITE_TWILIO_FROM_NUMBER?: string
  readonly VITE_AWS_S3_BUCKET?: string
  readonly VITE_AWS_REGION?: string
  readonly VITE_AWS_ACCESS_KEY_ID?: string
  readonly VITE_AWS_SECRET_ACCESS_KEY?: string
  readonly VITE_GA_TRACKING_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
