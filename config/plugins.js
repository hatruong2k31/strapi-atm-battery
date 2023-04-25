module.exports = ({ env }) => ({
  upload: {
    // config: {
    //   provider: "aws-s3",
    //   providerOptions: {
    //     localServer: {
    //       maxage: 300000,
    //     },
    //     sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
    //   },
    //   breakpoints: {
    //     xlarge: 1920,
    //     large: 1000,
    //     medium: 750,
    //     small: 500,
    //     xsmall: 64,
    //   },
    // },
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
      sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
    },
  },
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
      jwt: {
        expiresIn: "30d",
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.example.com"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("DEFAULT_FROM"),
        defaultReplyTo: env("DEFAULT_REPLY_TO"),
      },
    },
  },
});
