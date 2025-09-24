const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { dbConnection } = require("./connection");
const { authenticateToken } = require("./middleware/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// MongoDB connection
dbConnection("mongodb://127.0.0.1:27017/blog-app")
  .then(() => console.log("✅ Connection established Successfully"))
  .catch((err) => console.error("❌ Error in Connecting Database", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

// 🔑 Make user available globally in all views (without blocking public pages)
app.use(authenticateToken("token")); 
app.use((req, res, next) => {
  res.locals.user = req.user || null; 
  next();
});

// Home route
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).populate("createdBy");
    res.render("home", { blogs: allBlogs });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong while fetching blogs");
  }
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

// Protected blog routes
app.use("/blog", authenticateToken("token"), blogRouter);

// Public user routes
app.use("/user", userRouter);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
