// const express = require("express");
// const { Pool } = require("pg");
// const cors = require("cors");
// const bcrypt = require("bcrypt");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Connexion PostgreSQL
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "loginsection",
//   password: "hassan2004",
//   port: 5432,
// });

// // ✅ Test route
// app.get("/", (req, res) => {
//   res.send("API is running ✅");
// });

// // ✅ Register user
// app.post("/register", async (req, res) => {
//   const { user_name, mail, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   await pool.query(
//     "INSERT INTO users (user_name, mail, password) VALUES ($1, $2, $3)",
//     [user_name, mail, hashedPassword]
//   );

//   res.json({ message: "User registered ✅" });
// });

// // ✅ Get all users
// app.get("/users", async (req, res) => {
//   const result = await pool.query("SELECT id, user_name, mail FROM users");
//   res.json(result.rows);
// });

// app.listen(5000, () => console.log("✅ Backend running on port 5000"));





const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "loginsection",
//   password: "hassan2004",
//   port: 5432,
// });
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// ✅ Register user
app.post("/register", async (req, res) => {
  try {
    const { user_name, mail, password } = req.body;

    // Validation
    if (!user_name || !mail || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Vérifier si l'utilisateur existe déjà
    const checkUser = await pool.query(
      "SELECT mail FROM users WHERE mail = $1",
      [mail]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer dans la BD
    await pool.query(
      "INSERT INTO users (user_name, mail, password) VALUES ($1, $2, $3)",
      [user_name, mail, hashedPassword]
    );

    res.json({ 
      message: "User registered ✅",
      user: { name: user_name, email: mail }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration error: " + err.message });
  }
});

// ✅ LOGIN user - NOUVELLE ROUTE
app.post("/login", async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Validation
    if (!mail || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Chercher l'utilisateur
    const result = await pool.query(
      "SELECT user_name, mail, password FROM users WHERE mail = $1",
      [mail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Comparer les mots de passe avec bcrypt
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Login réussi
    res.json({ 
      name: user.user_name, 
      email: user.mail 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login error: " + err.message });
  }
});

// ✅ Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, user_name, mail FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Error: " + err.message });
  }
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
