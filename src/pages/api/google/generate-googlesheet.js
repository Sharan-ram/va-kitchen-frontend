import dbConnect from "../../../../lib/dbConnect";
import { writeDataToSheet } from "../../../../utils/googleSheets"; // Helper for Google Sheets API
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }
        const { data, title } = req.body;

        // Write data to Google Sheet
        const sheetUrl = await writeDataToSheet(data, title);

        res.status(200).json({
          success: true,
          message: "Data written to Google Sheets successfully.",
          sheetUrl, // Return the URL
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to write data to Google Sheets.",
          error: error.message,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
