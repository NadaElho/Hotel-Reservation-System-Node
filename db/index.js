const mongoose = require ('mongoose');

const dburi = process.env.DB_URI ;
const dbConnection = mongoose.connect(process.env.DB_URI).
then((data)=>console.log(data.connection.host))
.catch((err)=>console.log(err))
module.exports = dbConnection

