const express = require("express");
const app = express();
const MainRouter = require("./routes/index");
const mongoose = require("mongoose");
const errorHandler = require("./middleware/error-handler");
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/portfolio_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Database connection error"));

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*");
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", MainRouter);

// Error handling
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
