const mongoose = require ('mongoose');

const dburi = process.env.DB_URL ;
const dbConnection = mongoose.connect(dburi).
then((data)=>console.log("Successful connection to Mongodb"))
.catch((err)=>console.log(err))
module.exports = dbConnection

