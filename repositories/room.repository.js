const Room = require("../models/room.model")

class roomRepository{
    async getAllRooms(query,sortBy,skip,limit){

    const   data=  await Room.find(query).populate('roomTypeId').sort(sortBy)
    .skip(skip)
    .limit(limit);
    const documentCount=await Room.countDocuments(query);
        //populate('hotelId')
        return{data,documentCount}
    }
    // async getRoomCount(query) {
    //     console.log("getRoomCount")
    //     return await Room.countDocuments(query);
    // }
    async getRoomById (id){
        //populate('hotelId')
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