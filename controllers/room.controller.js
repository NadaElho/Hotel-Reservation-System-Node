const { populate } = require("dotenv");

class roomController {
    constructor(roomRepository) {
      this.roomRepository = roomRepository;
      // Bind methods to the instance to maintain the correct context
      this.addRoom = this.addRoom.bind(this);
      this.getAllRooms = this.getAllRooms.bind(this);
      this.getRoomById = this.getRoomById.bind(this);
      this.editRoom = this.editRoom.bind(this);
      this.deleteRoom = this.deleteRoom.bind(this);
      ///
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
          /// filter roomNumber[gte]=50
            const queryObj = { ...req.query };
            const excludedFields = ['page', 'sort', 'limit', 'fields'];
            excludedFields.forEach(el => delete queryObj[el]);
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
            const page = req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 6;
            const skip = (page - 1) * limit;
            const endIndex = page * limit;
            let query = {};
            let sortBy ;
    
      
z
            if (req.query.checkIn && req.query.checkOut&&req.query.hoteId&&req.query.roomType) {
                          
             const amenityIds = req.query.amenityId.split(',');

              query= [
                  { _id: { $in: await this.getRoomIdsByReservationDates(req.query.checkIn, req.query.checkOut) }
                 },
    
               
            
      
              ];
          }
    
            const parsed = JSON.parse(queryStr);
            query = { ...query, ...parsed };
    

    //sort
            if (req.query.sort) {
                sortBy = req.query.sort.split(',').join(' ');
                
            } else {
              sortBy = '-creatAt';
              
            }
          //   const totalDocuments = await this.roomRepository.getRoomCount(query);
          //  const documentCount = totalDocuments.length;
          let result = await this.roomRepository.getAllRooms(query,sortBy,skip,limit);
          const {
            data,
            documentCount
        } = result;
        // const sortBy1 = req.query.sortg.split(',').join(' ');
        // data = data.sort(sortBy1);
        // console.log('data',sortBy1 )
          // const documentCount= await this.roomRepository.getRoomCount(query);
  
    //pagination 
            const pagination = {
                currentPage: page,
                limit,
                numberPages: Math.ceil(documentCount / limit),
                documentCount
            };
    
            if (endIndex < documentCount) {
                pagination.nextPage = page + 1;
            }
    
            if (skip > 0) {
                pagination.prevPage = page - 1;
            }
    
            res.status(200).json({ status: "success", pagination, data: data });
        } catch (err) {
            res.status(400).json({ 'Error happened': err.message });
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
                res.status(404).json("Room not found");
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
  