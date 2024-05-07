const{mongoose}=require("mongoose");
const roomSchema=mongoose.Schema({
    hotelId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hotel',
        required: [true, 'Rome must have Hotel Id']
    },
    roomNumber :{
        type: Number,
        required: [true, 'Room must have Room Number']

    },
    description:{
        type: String,
        required: [true, 'Room must have Description']

    },
    amenityId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Amenity'

    }],
    roomTypeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RoomType',
        required: [true, ' Room must have Room Type Id']

    } ,
    price:{
        type: Number,
        required: [true, 'Room must have Price']


    },
    currency:{
        type: String,
        required: [true, 'Room must have currency']

    },
    images:[{
        type: String,
        required: [true, 'Room must have Image']

    }],
    imagesId:[{
        type: String,
        default: ""

    }]

});
const Room=mongoose.model('Room',roomSchema);
module.exports=Room;