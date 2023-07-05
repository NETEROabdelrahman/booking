import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import HotelModel from "../models/HotelModel.js";
import RoomModel from "../models/RoomModel.js";
import auth from '../middleware/auth.js'


const router = express.Router();


//get hotels

router.get("/", async (req, res) => {
    const { min, max, ...others } = req.query;
    try {
      const hotels = await HotelModel.find({
        ...others,
        cheapestPrice: { $gt: min | 1, $lt: max || 8000 }
      })
      res.status(200).json(hotels);
    } catch (error) {
      res.status(500).json(error)
    }
})


//post hotels

router.post("/",auth, async (req, res) => {
    const newHotel = new HotelModel(req.body)
   try {
       const savedHotel = await newHotel.save();
       res.status(201).json(savedHotel)
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//update hotels

router.put("/find/:id",auth, async (req, res) => {
   try {
       const hotel = await HotelModel.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
       res.status(201).json(hotel)
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//delete hotels

router.delete("/find/:id",auth, async (req, res) => {
   try {
        await HotelModel.findByIdAndDelete(req.params.id)
       res.status(201).json('deleted')
   } catch (error) {
    res.status(500).json(error)
   }
});
  

//get one hotel

router.get("/find/:id", async (req, res) => {
   try {
      const hotel = await HotelModel.findById(req.params.id)
       res.status(201).json(hotel)
   } catch (error) {
    res.status(500).json(error)
  }
});


//get hotel rooms

router.get("/room/:id", async (req, res) => {
  try {
    const hotel = await HotelModel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return RoomModel.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (error) {
    res.status(500).json(error)
  }
});
  
//count by city

router.get("/countbycity", async (req, res) => {
    const cities = req.query.cities.split(",");
    
    try {
        const list = await Promise.all(
            cities.map((city) => {
                return HotelModel.countDocuments({ city: city });
            })
            );
            res.status(200).json(list);
        } catch (error) {
          res.status(500).json(error)
          
        }
    });
    
    
    //count by type
    
    router.get("/countbytype", async (req, res) => {
    try {
        const hotelCount = await HotelModel.countDocuments({ type: "hotel" });
        const apartmentCount = await HotelModel.countDocuments({ type: "apartment" });
        const resortCount = await HotelModel.countDocuments({ type: "resort" });
        const villaCount = await HotelModel.countDocuments({ type: "villa" });
        const cabinCount = await HotelModel.countDocuments({ type: "cabin" });
        
        res.status(200).json([
          { type: "hotel", count: hotelCount },
          { type: "apartments", count: apartmentCount },
          { type: "resorts", count: resortCount },
          { type: "villas", count: villaCount },
          { type: "cabins", count: cabinCount },
        ]);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
      }
  });



export {router as hotelRouter}