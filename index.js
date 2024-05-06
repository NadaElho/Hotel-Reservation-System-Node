require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();
app.use(express.json())

const mainRouter = express.Router();
//reservation Satus
const reservationSatusRouter = require('./routes/reservation-status.router')

const ReservationSatusRepository = require('./repositories/reservation-status.repository')

const ReservationSatusController = require('./controllers/reservation-status.controller')

//Room Type
const roomTypeRouter = require('./routes/room-type.router')

const RoomTypeRepository = require('./repositories/room-type.repository')

const RoomTypeController = require('./controllers/room-type.controller')


//reservation Satus
const reservationSatusRepository = new ReservationSatusRepository()

const reservationSatusController = new ReservationSatusController(reservationSatusRepository)
//Room Type

const roomTypeRepository = new RoomTypeRepository()

const roomTypeController = new RoomTypeController(roomTypeRepository)

app.use(cors());

app.use('/api/v1', mainRouter);

mainRouter.use('/reservation-status', reservationSatusRouter(reservationSatusController))

mainRouter.use('/room-type', roomTypeRouter(roomTypeController))

app.listen(3000, () => {
    console.log(`listening on port ${3000} ...`);
});