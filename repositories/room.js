const Room = require("../models/room")

class roomRepository{
    async getAllRooms(query,sortBy,skip,limit){

    const data=  await Room.find(query).populate('roomTypeId').sort(sortBy)
    .skip(skip)
    .limit(limit);
    const documentCount=await Room.countDocuments(query);
        return{data,documentCount}
    }
   
    async getRoomById (id){
        return await Room.findOne(id).populate('amentiesIds').populate('hotelId').populate('roomTypeId');
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