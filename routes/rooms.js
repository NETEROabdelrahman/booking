import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import RoomModel from "../models/RoomModel.js";
import auth from '../middleware/auth.js'
import HotelModel from "../models/HotelModel.js";


const router = express.Router();


//get rooms

router.get("/", async (req, res) => {
    try {
        const rooms =await RoomModel.find()
        res.status(200).json(rooms)
    } catch (error) {
        res.status(500).json(error)
    }
})


//post room

router.post("/:hotelId", auth, async (req, res) => {
    const hotelId = req.params.hotelId
    const newRoom = new RoomModel(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await HotelModel.findByIdAndUpdate(hotelId, {
                $push: { rooms: savedRoom._id },
            });
        } catch (error) {
            res.status(500).json(error)
        }
        res.status(201).json(savedRoom)
    } catch (error) {
        res.status(500).json(error)
    }
});


//delete room

router.delete("/:id/:hotelId",auth, async (req, res) => {
    const hotelId = req.params.hotelId
    const roomId = req.params.id

   try {
        await RoomModel.findByIdAndDelete(roomId)
       try {
        await HotelModel.findByIdAndUpdate(hotelId, {
            $pull: { rooms: roomId },
          });
       } catch (error) {
           res.status(500).json(error)
       }

       res.status(200).json("deleted the room")
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//update rooms

router.put("/:id",auth, async (req, res) => {
   try {
       const room = await RoomModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
       res.status(201).json(room)
   } catch (error) {
       console.log(error)
    res.status(500).json(error)
}
});
  
//update rooms availability

router.put("/availability/:id", async (req, res) => {
    console.log(req.body)
    try {
        await RoomModel.updateOne(
            { "roomNumbers._id": req.params.id },
            {
                $push: {
                    "roomNumbers.$.unavailableDates": req.body.dates
            },
        }
        );
        res.status(200).json("Room status has been updated.");
    } catch (error) {
        console.log(error)
          res.status(500).json(error)
      }
});
  

//delete hotels

router.delete("/:id",auth, async (req, res) => {
   try {
        await HotelModel.findByIdAndDelete(req.params.id)
       res.status(201).json('deleted')
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//get one room

router.get("/:id", async (req, res) => {
   try {
      const room = await RoomModel.findById(req.params.id)
       res.status(201).json(room)
   } catch (error) {
    res.status(500).json(error)
   }
  });



export {router as roomRouter}