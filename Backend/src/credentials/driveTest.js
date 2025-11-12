import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "new-credentials.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

async function createClientFolder(clientEmail) {
  const folder = await drive.files.create({
    resource: {
      name: `Client_${clientEmail}_${Date.now()}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1WmHYwKBvtzJghEBoj-akkk1BQtpfCm0J"], // ID of 'Client Uploads'
    },
    fields: "id",
  });

  await drive.permissions.create({
    fileId: folder.data.id,
    resource: {
      type: "user",
      role: "writer",
      emailAddress: clientEmail,
    },
    fields: "id",
  });

  return `https://drive.google.com/drive/folders/${folder.data.id}`;
}
