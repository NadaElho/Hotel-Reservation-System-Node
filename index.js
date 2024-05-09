require("dotenv").config();
require("./db");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
const cors = require('cors')
app.use(cors());

// Router
const hotelRouter = require('./routes/hotel.router');
const amentyRouter = require('./routes/amenty.router');
///
const HotelController = require('./controllers/hotel.controller');
const HotelRepository = require('./repository/hotel.repository');
const AmentyController = require('./controllers/amenty.controller');
const AmentyRepository = require('./repository/amenty.repository');

//get insatance of HotelController
const hotelRepository = new HotelRepository();
//get insatance of HotelRepository
const hotelController = new HotelController(hotelRepository);
//get insatance of AmentyRepository 
const  amentyRepository = new AmentyRepository();
//get insatance of AmentyController
const  amentyController = new AmentyController(amentyRepository)

const mainRouter = express.Router();
mainRouter.use('/hotels', hotelRouter(hotelController));
mainRouter.use('/amenties' ,amentyRouter(amentyController) )
app.use('/api/v1', mainRouter);

app.listen(3000, () => {
    console.log(`Listening on port ${3000} ...`);
});
