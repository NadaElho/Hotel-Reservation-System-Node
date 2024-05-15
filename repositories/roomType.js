const RoomType = require("../models/roomType")

class RoomTypeRepository{
    async getAllRoomsType(){
        return await RoomType.find();
    }

    async getRoomTypeById (id){
        return await RoomType.findOne(id);
    }
    
    async addRoomType(req){
        return await RoomType.create(req);
    }

    async  editRoomType(id,req){
        return await RoomType.updateOne(id,req);
    }
    
    async deleteRoomType (id){
        return  await RoomType.deleteOne(id)
    }
}

module.exports = RoomTypeRepository;