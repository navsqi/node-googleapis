// https://developers.google.com/drive/api/v3/folder#create_a_folder
// 1. https://console.cloud.google.com/
// 2. Create New Project
// 3. Select Project
// 4. Klik menu APIs & Services
// 5. Pilih api / services
// 6. Enable terlebih dahulu
// 7. Pilih api / services
// 8. Klik menu Credentials, pilih OAuth
// 9. Pilih button CONFIGURE CONSENT SCREEN
// 10. Pilih External

// https://developers.google.com/oauthplayground/
// https://www.npmjs.com/package/googleapis#authentication-and-authorization

// Email: landaushan@gmail.com

const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

const CLIENT_ID =
  "1015514742080-gqvjjpaejb5bnsv52d60ls6imbu60jgs.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
// const REDIRECT_URI = "https://developers.google.com/oauthplayground";
// const REDIRECT_URI = "http://localhost:3001";

const REFRESH_TOKEN =
  "1//04MQWjtQpX0GpCgYIARAAGAQSNwF-L9IrgiTPaiyFKpEMYwKJnCcJXbRJJy_TeZ6UUWtguv6hzMDIADLQ7VhgBy7gGt5MZDqo7lg";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const filePath = path.join(__dirname, "tes.png");

var fileMetadata = {
  name: "Invoices",
  mimeType: "application/vnd.google-apps.folder",
};

async function uploadFile() {
  try {
    const response = await drive.files.create({
      // == CREATE NEW FOLDER ONLY
      resource: fileMetadata,
      fields: "id",
      // == UPLOAD FILE
      // requestBody: {
      //   name: "tes.png", //This can be name of your choice
      //   mimeType: "image/png",
      // },
      // media: {
      //   mimeType: "image/png",
      //   body: fs.createReadStream(filePath),
      // },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.message);
  }
}

// uploadFile();

async function generatePublicUrl() {
  try {
    const fileId = "1P5z-4xeidzA8IK6NeIcWHt5hBzcnQROL";
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    /* 
    webViewLink: View the file in browser
    webContentLink: Direct download link 
    */
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

generatePublicUrl();
