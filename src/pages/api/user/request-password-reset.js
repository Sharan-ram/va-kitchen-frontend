import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/user";
import crypto from "crypto";
import sendEmail from "../../../../utils/sendEmail";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email } = req.body;
    try {
      await dbConnect();

      const user = await User.findOne({ username, email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate reset token
      const resetPasswordToken = crypto.randomBytes(32).toString("hex");
      const resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = resetPasswordExpires;
      await user.save();

      // Send email
      const resetUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/user/reset-password?token=${resetPasswordToken}`;
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: "Password Reset Request",
        text: `Please click on the link to reset your password: ${resetUrl}`,
      };

      await sendEmail(mailOptions);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
