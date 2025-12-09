import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "newestcredentials.json",
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export async function createClientFolder(clientEmail) {
  const folder = await drive.files.create({
    resource: {
      name: `Client_${clientEmail}_${Date.now()}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1Pur_3HEklJM9nEDgoQHekfl3HW13M5GK"], // ID of 'Client Uploads'
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
