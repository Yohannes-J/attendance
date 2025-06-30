import jwt from "jsonwebtoken";

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET);

      res.status(200).json({
        success: true,
        user: {
          id: "admin-001", // static or generate a real one if needed
          email,
          name: "System Admin",
          role: "system admin", // ✅ frontend expects this to navigate
        },
        token,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginAdmin };
