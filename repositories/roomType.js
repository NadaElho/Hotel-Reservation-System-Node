const RoomType = require("../models/roomType")
const NotFoundError = require('../utils/notFoundError')
class roomTypeRepository{
    async getAllRoomsType(){
        const roomType =await RoomType.find();
        if (!roomType) {
            throw new NotFoundError('No roomsType found')
          }
          return roomType
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

module.exports = roomTypeRepository;