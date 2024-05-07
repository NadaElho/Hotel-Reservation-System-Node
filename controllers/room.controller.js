const { populate } = require("dotenv");

class roomController {
    constructor(roomRepository) {
      this.roomRepository = roomRepository,
      // Bind methods to the instance to maintain the correct context
      this.addRoom = this.addRoom.bind(this);
      this.getAllRooms = this.getAllRooms.bind(this);
      this.getRoomById = this.getRoomById.bind(this);
      this.editRoom = this.editRoom.bind(this);
      this.deleteRoom = this.deleteRoom.bind(this);
    }
    async  addRoom (req, res){
        try {
            const room = await  this.roomRepository.addRoom({...req.body})
            res.status(201).json({
                status: "success",
                message: ' Rome added successfully',
                room:room
              });
        } catch (err) {
            res.status(400).json({'Error happened ' : err.message})
        }
      }
    
    async getAllRooms(req, res) {
            try {
                const rooms= await this.roomRepository.getAllRooms();             
                res.status(200).json({status: "success",rooms :rooms });
            } catch (err) {
                res.status(400).json({'Error happened ' : err.message})
            }
    }

    async getRoomById(req,res){
      try{
          const{id}=req.params
          const room = await this.roomRepository.getRoomById ({_id: id});
         
            if (!room) {
              res.status(404).json("Room  not found");
              return;
            }
            res.status(200).json({
              status: "success",
              message: ' Room  updated successfully',
              room:room
            });
  
      }catch(err){
          res.status(500).json({'Error happened ' : err.message})
      }
  
  }
    async editRoom(req,res){
        try{
            const{id}=req.params
            const room = await this.roomRepository.getRoomById ({_id: id});
           
              if (!room) {
                res.status(404).json("Room not found");
                return;
              }
            const updateRoom = await this.roomRepository.editRoom({_id: id},{...req.body});
           
              
            const findNewRome= await this.roomRepository.getRoomById ({
                _id: id,
              });
              res.status(200).json({
                status: "success",
                message: ' Room updated successfully',
                room:findNewRome
              });
    
        }catch(err){
            res.status(500).json({'Error happened ' : err.message})
        }
    
    }
  
  
    async deleteRoom(req,res){
        try{
            const{id}=req.params
            const room = await this.roomRepository.getRoomById ({_id: id});
           
              if (!room) {
                res.status(404).json("Room  not found");
                return;
              }
             await this.roomRepository.deleteRoom({_id: id});
           
              
              res.status(200).json({
                status: "success",
                message: ' Room deleted successfully',
              });
    
        }catch(err){
            res.status(400).json({'Error happened ' : err.message})
        }
    
    }
  
  }
  
  module.exports = roomController
  