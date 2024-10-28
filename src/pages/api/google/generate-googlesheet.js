// /api/google/generate-googlesheet.js

const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
import authMiddleware from "../../../../middleware/auth";

const ROOT_PATH = process.cwd();

// Update paths to use the project root
const CREDENTIALS_PATH = path.join(
  ROOT_PATH,
  "src/pages/api/google/credentials.json"
);
const TOKEN_PATH = (username) =>
  path.join(ROOT_PATH, `src/pages/api/google/token_${username}.json`);

let oAuth2Client;

// Initialize the OAuth2 client
async function initializeOAuthClient() {
  try {
    // Check if credentials file exists
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      throw new Error(
        "Credentials file not found. Please provide the credentials.json file."
      );
    }

    const content = fs.readFileSync(CREDENTIALS_PATH);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } =
      credentials.installed || credentials.web;

    oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0] // This should match your redirect URI
    );
  } catch (err) {
    console.error("Error loading client secret file:", err);
    throw err; // Rethrow the error for handling in the caller
  }
}

// Authorize the OAuth2 client
async function authorizeClient(username) {
  if (!oAuth2Client) {
    await initializeOAuthClient();
  }

  try {
    // Check if token file exists
    if (!fs.existsSync(TOKEN_PATH(username))) {
      console.log(
        "Token file not found or invalid, need to generate a new token."
      );
      return await getNewToken(username); // Return the URL to redirect
    }

    const tokenBuffer = fs.readFileSync(TOKEN_PATH(username));
    const token = JSON.parse(tokenBuffer.toString());
    oAuth2Client.setCredentials(token);
    console.log(
      "OAuth2 Client initialized with token:",
      oAuth2Client.credentials
    );

    // Check if the access token is expired
    const currentTime = Date.now();
    if (token.expiry_date && currentTime > token.expiry_date) {
      console.log("Access token expired, refreshing...");
      await refreshAccessToken(username);
    }
  } catch (err) {
    console.error("Error in authorizing client:", err);
    return await getNewToken(username); // Return the URL to redirect
  }
}

// Get a new token after prompting for user authorization
async function getNewToken(username) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
    prompt: "consent",
    state: username,
  });

  return authUrl; // Instead of console logging, return the URL
}

// Refresh the access token if it has expired
async function refreshAccessToken(username) {
  console.log("Refreshing access token...");
  try {
    const { token } = await oAuth2Client.getAccessToken();
    console.log("REFRESHED TOKEN............", token);
    oAuth2Client.setCredentials({
      ...oAuth2Client.credentials,
      access_token: token,
    });

    console.log("CREDENTIALS ARE SET");

    fs.writeFileSync(
      TOKEN_PATH(username),
      JSON.stringify(oAuth2Client.credentials)
    );
    console.log("Access token refreshed and saved to disk");
  } catch (error) {
    console.error("Error refreshing access token:", error);
    await getNewToken(username); // Return the URL for redirection
  }
}

// Function to write data to Google Sheets
const writeDataToSheet = async (data, title, username) => {
  // await authorizeClient(username);
  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  try {
    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: title || "New Spreadsheet",
        },
      },
    });
    const newSpreadsheetId = createResponse.data.spreadsheetId;
    console.log("Created new spreadsheet with ID:", newSpreadsheetId);

    const request = {
      spreadsheetId: newSpreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: {
        values: data,
      },
    };
    await sheets.spreadsheets.values.update(request);

    await drive.permissions.create({
      fileId: newSpreadsheetId,
      resource: {
        role: "commenter",
        type: "anyone",
      },
    });

    const sheetUrl = `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`;
    return sheetUrl;
  } catch (error) {
    console.error("Error writing to sheet:", error);
    throw error; // Rethrow the error for handling in the caller
  }
};

// Default API route function to handle incoming requests
export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    try {
      const { data, title } = req.body; // Assume data comes from the request body

      if (!authMiddleware(req, res, ["admin", "user"])) {
        return;
      }

      // console.log({ user: req.user, session: req.session });

      const username = req.user.userId;

      // Authorize and get the redirect URL if needed
      const authUrl = await authorizeClient(username);
      // console.log({ authUrl });
      if (authUrl) {
        res.status(200).json({ authUrl }); // Redirect the user to the authorization URL
      }

      const sheetUrl = await writeDataToSheet(data, title, username);
      res.status(200).json({ url: sheetUrl });
    } catch (error) {
      console.error("Error in API route:", error);
      res.status(500).json({ error: "Error creating Google Sheet" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
