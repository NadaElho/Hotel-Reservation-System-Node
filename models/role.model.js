const mongoose = require("mongoose");
const roleSchema=mongoose.Schema({
   
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
        unique: true
  
    }
   

});
const Role = mongoose.model('Role',roleSchema);
module.exports = Role;

