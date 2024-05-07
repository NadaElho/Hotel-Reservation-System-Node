const Room = require("../models/room.model")

class roomRepository{
    async getAllRooms(){
        //populate('hotelId')
        return await Room.find().populate('roomTypeId');
    }
    async getRoomById (id){
        //populate('hotelId')
        return await Room.findOne(id).populate('roomTypeId');
    
    }
    
    async addRoom(req){
        return await Room.create(req);
    
    }
    async  editRoom(id,req){
        return await Room.updateOne(id,req);
    
    }
    async deleteRoom (id){
        return  await Room.deleteOne(id)
    }
}

module.exports = roomRepository;