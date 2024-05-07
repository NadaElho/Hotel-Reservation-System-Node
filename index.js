require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();

const mainRouter = express.Router();

// Importing repositories
const ReservationSatusRepository = require('./repositories/reservation-status.repository')
const RoomTypeRepository = require('./repositories/room-type.repository')
const RoomRepository = require("./repositories/room.repository");

// Importing controllers
const RoomTypeController = require('./controllers/room-type.controller')
const ReservationSatusController = require('./controllers/reservation-status.controller')
const RoomController = require("./controllers/room.controller");

// Importing routers
const reservationSatusRouter = require('./routes/reservation-status.router')
const roomTypeRouter = require('./routes/room-type.router');
const roomRouter = require("./routes/room.router");

app.use(express.json())
app.use(cors());
app.use('/api/v1', mainRouter);

// Creating instances of repositories
const reservationSatusRepository = new ReservationSatusRepository()
const roomTypeRepository = new RoomTypeRepository()
const roomRepository=new RoomRepository()

// Creating instances of controllers
const reservationSatusController = new ReservationSatusController(reservationSatusRepository)
const roomTypeController = new RoomTypeController(roomTypeRepository)
const roomController = new RoomController(roomRepository)

// routers with controllers
mainRouter.use('/reservation-status', reservationSatusRouter(reservationSatusController))
mainRouter.use('/room-type', roomTypeRouter(roomTypeController))
mainRouter.use('/rooms',roomRouter(roomController))


app.listen(3000, () => {
    console.log(`listening on port ${3000} ...`);
});