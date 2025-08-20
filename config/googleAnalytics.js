const { google } = require('googleapis');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Almacenamiento simple de tokens (en producción usa una base de datos)
const analyticsTokens = {};

module.exports = {
  oauth2Client,
  analyticsTokens,
  google
};