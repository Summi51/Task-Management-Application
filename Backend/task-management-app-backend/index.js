const express = require("express");
const {connection} = require("./config/db")
require("dotenv").config();
const cors = require('cors')
const app = express();

app.use(cors()) 

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello');
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, async () => {

  console.log(`Server is comming from port ${PORT}`);
  
  try {
  await connection;
  console.log("backend connected to database");
  } catch (error) {
  console.log(error);
  console.log("error getting to connect with data base");
  }
  });

