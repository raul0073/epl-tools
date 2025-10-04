// Central config for client / server access
export const config = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  SERVER_URL: process.env.SRVER_URL || "http://localhost:8000/api",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  SECRET_KEY: process.env.SECRET_KEY!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  EMAIL_FROM: process.env.EMAIL_FROM!,
  MONGODB_URI: process.env.MONGODB_URI!,
  DB_NAME: process.env.DB_NAME!,
  COL_NAME: process.env.COL_NAME!,
  NOD_ENV:process.env.NOD_ENV!
};