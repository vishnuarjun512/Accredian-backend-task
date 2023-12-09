import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { db } from "../index.js";
const JWT_SECRET_KEY = "Accredian";

export const loginUser = async (req, res, err) => {
  try {
    const { username, password, email } = req.body;

    const query = "SELECT * FROM users WHERE username=? OR email=?";
    const values = [username, email];

    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(201).json({ error: "Internal Server Error" });
      }

      if (results.length > 0) {
        const token = jwt.sign({ username: username }, JWT_SECRET_KEY);
        const checkPassword = bcryptjs.compareSync(
          password,
          results[0].password
        );
        if (checkPassword) {
          return res
            .cookie("login_token", token)
            .status(200)
            .json({ message: "Login Success", user: results[0].username });
        } else {
          return res.status(201).json({ error: "Credentials dont match" });
        }
      } else {
        console.log("User not found failed");
        return res.status(201).json({ error: "User not found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: "Internal Server Error" });
  }
};

export const registerUser = async (req, res, err) => {
  try {
    const { username, email, password } = req.body;
    var query = "SELECT * FROM users WHERE email=? OR username=?";
    var values = [email, username];
    //Checking for already if the user has registered
    db.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        return res
          .status(201)
          .json({ error: "Registration Error from Server" });
      }
      if (results.length > 0) {
        console.log("User Already Present");
        return res.status(201).json({ error: "User Already Registered" });
      }

      query = "INSERT INTO users (username,email,password) VALUES(?,?,?)";
      const hashedPassword = bcryptjs.hashSync(password, 10);
      values = [username, email, hashedPassword];
      db.query(query, values, (err, results) => {
        if (err) {
          console.log(err);
          return res
            .status(201)
            .json({ error: "Registration Error from Server" });
        } else {
          console.log("User Inserted Successfully ->", results);
          return res.status(200).json({ message: "Registration Success" });
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({ error: "Internal Server Error" });
  }
};

export const signout = async (req, res, err) => {
  try {
    res
      .clearCookie("login_token")
      .status(200)
      .json({ message: "Log out Successful" });
  } catch (error) {
    res.status(201).json({ message: "Log out Unsuccessful" });
  }
};

export const profile = async (req, res, err) => {
  try {
    const token = req.cookies.login_token;
    const tokenData = jwt.verify(token, JWT_SECRET_KEY);
    res.status(200).json({ username: tokenData.username });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Profile Not Found" });
  }
};
