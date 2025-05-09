import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.js"
import path from "path"
import { fileURLToPath } from "url"

// Load environment variables
dotenv.config()

// Fix Mongoose deprecation warning
mongoose.set("strictQuery", false)

// Create Express app
const app = express()

// Middleware
app.use(cors())

// Increase the body parser limit to handle larger payloads (like base64 images)
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`)
  // Log request body for POST requests (but truncate if too large)
  if (req.method === "POST" || req.method === "PUT") {
    const bodyClone = { ...req.body }
    // Don't log large fields like profile images
    if (bodyClone.profileImage && bodyClone.profileImage.length > 100) {
      bodyClone.profileImage = `[Base64 image data - ${bodyClone.profileImage.length} chars]`
    }
    console.log("Request body:", bodyClone)
  }
  next()
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-auth")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// API routes
app.use("/api/auth", authRoutes)

// Test route to verify server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" })
})

// Route debugging - log all registered routes
console.log("Registered routes:")
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    // Routes registered directly on the app
    console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`)
  } else if (middleware.name === "router") {
    // Router middleware
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        const path = handler.route.path
        const methods = Object.keys(handler.route.methods)
        console.log(`${methods} /api/auth${path}`)
      }
    })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  app.use(express.static(path.join(__dirname, "../client/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
  })
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api/auth`)
})
