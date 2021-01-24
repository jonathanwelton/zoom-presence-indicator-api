// Store the credential variables in .env file and retrieve the values from here.

const dotenv = require('dotenv');
dotenv.config();

 module.exports= {
  ZOOM_VERIFICATION_TOKEN: process.env.ZOOM_VERIFICATION_TOKEN,
  AZURE_IOT_HUB_NAME: process.env.AZURE_IOT_HUB_NAME,
  AZURE_IOT_HUB_DEVICE_ID: process.env.AZURE_IOT_HUB_DEVICE_ID,
  AZURE_IOT_HUB_PASSWORD: process.env.AZURE_IOT_HUB_PASSWORD,
  VERIFICATION_TOKEN: process.env.VERIFICATION_TOKEN
};
