// /api/google/oauth2callback.js
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import authMiddleware from "../../../../middleware/auth";

// Define paths for token and credentials
const TOKEN_PATH = (username) =>
  path.join(process.cwd(), `src/pages/api/google/token_${username}.json`);
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "src/pages/api/google/credentials.json"
);

// Initialize OAuth2 client
let oAuth2Client;

// Load credentials and create OAuth2 client
const initializeOAuthClient = () => {
  try {
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
      redirect_uris[0]
    );
  } catch (error) {
    console.error("Error loading client secret file:", error);
    throw error; // Rethrow for handling in the caller
  }
};

// API route handler
export default async function handler(req, res) {
  if (req.method === "GET") {
    const { code, state: username } = req.query;
    console.log({ username });

    // Initialize the OAuth2 client
    initializeOAuthClient();

    try {
      // Exchange authorization code for tokens
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);

      // Store the token securely
      // console.log({ user: req.user });

      // const username = "user1";
      fs.writeFileSync(TOKEN_PATH(username), JSON.stringify(tokens));

      // Redirect or respond with success
      res.status(200).json({ message: "Authentication successful" }); // Replace with your success page or endpoint
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      res
        .status(500)
        .json({ error: "Failed to exchange authorization code for token." });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
