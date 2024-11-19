import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  mailtrapToken: process.env.MAILTRAP_TOKEN,
  from: {
    email: process.env.EMAIL_FROM,
    name: process.env.EMAIL_FROM_NAME,
  },
  clientUrl: process.env.CLIENT_URL,
})); 