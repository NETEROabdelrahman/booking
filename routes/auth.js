import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";


const router = express.Router();


//get users

router.get("/", async (req, res) => {
    try {
        const users =await UserModel.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})


//register users

router.post("/register", async (req, res) => {
    const { username, password,email,country,img,city,phone,isAdmin } = req.body;
    const user = await UserModel.findOne({ username });
    const Email = await UserModel.findOne({ email });
  if (user) {
      return res.status(400).send('Username already exists');
    }
    if (Email) {
      return res.status(400).send("email already exists" );
    }
    if (!email||!password||!username) {
      return res.status(400).send("please fill all credentials");
    }
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword,email,country,img,city,phone,isAdmin });
  
    await newUser.save();
    res.json({ message: "User registered successfully" });
});
  

//login users

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "incorrect username or password" });
    }
    
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        return res.status(400).json({ message: "incorrect username or password" });
    }
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "secret")
    res.json({
        token,
        userID: user._id,
        isAdmin: user.isAdmin,
        img: user.img,
        username
      });  
    
  });



export {router as authRouter}