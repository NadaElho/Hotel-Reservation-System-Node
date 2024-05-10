class roomTypeController {
    constructor(roomTypeRepository) {
      this.roomTypeRepository = roomTypeRepository,
      // Bind methods to the instance to maintain the correct context
      this.addRoomType = this.addRoomType.bind(this);
      this.getAllRoomsType = this.getAllRoomsType.bind(this);
      this.editRoomType = this.editRoomType.bind(this);
      this.deleteRoomType = this.deleteRoomType.bind(this);
    }
    async  addRoomType (req, res){
        try {
            const roomType = await  this.roomTypeRepository.addRoomType({...req.body})
            res.status(201).json({
                status: "success",
                message: ' Rome Type added successfully',
                roomType:roomType
              });
        } catch (err) {
            res.status(400).json({'Error happened ' : err.message})
        }
      }
    
    async getAllRoomsType(req, res) {
            try {
                const roomstype= await this.roomTypeRepository.getAllRoomsType()
              
                res.status(200).json({status: "success",roomstype :roomstype });
            } catch (err) {
                res.status(400).json({'Error happened ' : err.message})
            }
    }
    async editRoomType(req,res){
        try{
            const{id}=req.params
            const room = await this.roomTypeRepository.getRoomTypeById ({_id: id});
           
              if (!room) {
                res.status(404).json("Room Type not found");
                return;
              }
            const updateRoomType = await this.roomTypeRepository.editRoomType({_id: id},{...req.body});
           
              
            const findNewRomeType= await this.roomTypeRepository.getRoomTypeById ({
                _id: id,
              });
              res.status(200).json({
                status: "success",
                message: ' Room Type updated successfully',
                roomType:findNewRomeType
              });
    
        }catch(err){
            res.status(500).json({'Error happened ' : err.message})
        }
    
    }
  
  
    async deleteRoomType(req,res){
        try{
            const{id}=req.params
            const room = await this.roomTypeRepository.getRoomTypeById ({_id: id});
           
              if (!room) {
                res.status(404).json("Room Type not found");
                return;
              }
             await this.roomTypeRepository.deleteRoomType({_id: id});
           
              
              res.status(200).json({
                status: "success",
                message: ' Room Type deleted successfully',
              });
    
        }catch(err){
            res.status(400).json({'Error happened ' : err.message})
        }
    
    }
  
  }
  
  module.exports = roomTypeController
  