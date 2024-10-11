import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const sheets = google.sheets("v4");

export const writeDataToSheet = async (data, title) => {
  const auth = await getOAuth2Client();

  // Prepare data to write
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `${title}!A1`,
    valueInputOption: "RAW",
    resource: {
      values: data,
    },
    auth,
  };

  const response = await sheets.spreadsheets.values.update(request);
  return response.data.spreadsheetUrl; // Return the URL
};

// Add the rest of the authentication logic here, e.g., getting OAuth client, etc.
