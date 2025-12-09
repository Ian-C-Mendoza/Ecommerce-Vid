import { createClientFolder } from "./driveTest.js";

async function test() {
  try {
    const folderUrl = await createClientFolder("client@example.com");
    console.log("Folder created successfully:", folderUrl);
  } catch (err) {
    console.error("Error creating folder:", err);
  }
}

test();
