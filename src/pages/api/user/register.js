import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User"; // Assuming you have a User model already defined
import bcrypt from "bcrypt";
import authMiddleware from "../../../../middleware/auth"; // Adjust this path as per your setup

export default async function handler(req, res) {
  await dbConnect(); // Ensure database connection

  // Ensure this route only allows POST requests
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  // Authenticate if the user is admin (you need to call the middleware function directly here)
  if (!authMiddleware(req, res, ["admin"])) {
    return;
  }

  const { username, email, password, role } = req.body;

  // Validate email format
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Check for existing users with the same username or email
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const user = new User({ username, email, password: hashedPassword, role });

    // Save the user in the database
    await user.save();

    // Return success message
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: error.message });
  }
}
