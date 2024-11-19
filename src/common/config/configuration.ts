export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      uri: process.env.MONGO_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '3d',
    },
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    mailtrap: {
      token: process.env.MAILTRAP_TOKEN,
      from: {
        email: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
    },
    client: {
      url: process.env.CLIENT_URL,
    },
  });