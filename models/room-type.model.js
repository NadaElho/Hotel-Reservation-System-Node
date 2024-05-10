const mongoose=require("mongoose");
const roomTypeSchema=mongoose.Schema({
    type:{
        type: String,
        required: [true, 'RoomType  must have Type']

    },

});
const RoomType=mongoose.model('RoomType',roomTypeSchema);
module.exports=RoomType;