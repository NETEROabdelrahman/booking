import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import auth from "../middleware/auth.js";


const router = express.Router();


//get users

router.get("/", auth, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            const users =await UserModel.find()
            res.status(200).json(users)
        } catch (error) {
            res.status(404).json(error)
        }
    } else {
        res.status(403).json("You are not the admin");
    }
})


//get one user

router.get("/:id", async (req, res) => {
    try {
        const user =await UserModel.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json(error)
    }
})


//update users

router.put("/:id",auth, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, 10);
          console.log(req.body.password);
          try {
            const updatedUser = await UserModel.findByIdAndUpdate(
              req.params.id,
              {
                $set: req.body,
              },
              { new: true }
            );
            console.log(updatedUser);
            res.status(200).json(updatedUser);
          } catch (err) {
            console.log(err);
            res.status(500).json(err);
          }
        } else {
          res.status(403).json("You can update only your account!");
        }
      } else {
        res.status(403).json("You can update only your account!");
      }
});
  

//delete users

router.delete("/:id", auth, async (req, res) => {
    const user = await UserModel.findById(req.params.id)
    console.log(user)
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await UserModel.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted.");
        } catch (error) {
          console.log(error)
            res.status(500).json(error)
        }
    } else {
        res.status(500).json('you are not authorized')
    }
    
});
  
//GET USER STATS
router.get("/find/stats", async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await UserModel.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});




export {router as userRouter}