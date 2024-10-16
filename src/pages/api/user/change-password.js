import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import authMiddleware from "../../../../middleware/auth";

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        if (!authMiddleware(req, res, ["admin", "user"])) {
          return;
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId; // User info set by the auth middleware

        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Verify if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ message: "Current password is incorrect" });
        }

        // Set and hash the new password
        user.password = newPassword;

        // Save the new password to the database
        await user.save();

        res
          .status(200)
          .json({ message: "Password has been changed successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
