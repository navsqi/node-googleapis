const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");
const express = require("express");
const open = require("open");

const app = express();

const CLIENT_ID = "";
const CLIENT_SECRET = "";
const REDIRECT_URI = "http://localhost:3001/google/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

async function generatePublicUrl(_id) {
  try {
    const fileId = _id;
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

    process.exit();
  } catch (error) {
    console.log(error.message);
  }
}

app.get("/", (req, res) => res.send("Hello world!"));

app.post("/sharelink", (req, res, next) => {
  // Membuka browser login google
  open(
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/drive",
      state: JSON.stringify({
        _id: "1P5z-4xeidzA8IK6NeIcWHt5hBzcnQROL",
      }),
    })
  );
});

app.get("/google/callback", (req, res, next) => {
  // Jika login sukses halaman browser di-redirect ke...
  res.redirect("http://localhost:3001");

  // setelah redirect jalankan generate url google drive
  console.log(req.query);

  const { _id } = JSON.parse(req.query.state);

  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) {
      console.log(error);
      return;
    }

    oauth2Client.setCredentials(tokens);

    generatePublicUrl(_id);
  });
});

app.listen(3001, () => console.log("app is running on port 3001"));
