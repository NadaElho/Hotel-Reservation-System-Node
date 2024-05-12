require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();

const AppError = require("./unites/appError");
const userRouter = require("./routes/user.router");


const mainRouter = express.Router();

// Importing repositories
const ReservationRepository = require('./repositories/reservation.repository')
const ReservationSatusRepository = require('./repositories/reservation-status.repository')
const RoomTypeRepository = require('./repositories/room-type.repository')
const RoomRepository = require("./repositories/room.repository");
const HotelRepository = require('./repositories/hotel.repository');
const AmentyRepository = require('./repositories/amenty.repository');

// Importing controllers
const ReservationController = require("./controllers/reservation.controller");
const ReservationSatusController = require('./controllers/reservation-status.controller')
const RoomTypeController = require('./controllers/room-type.controller')
const RoomController = require("./controllers/room.controller");
const HotelController = require('./controllers/hotel.controller');
const AmentyController = require('./controllers/amenty.controller');

// Importing routers
const reservationRouter = require('./routes/reservation.router')
const reservationSatusRouter = require('./routes/reservation-status.router')
const roomTypeRouter = require('./routes/room-type.router');
const roomRouter = require("./routes/room.router");
const hotelRouter = require('./routes/hotel.router');
const amentyRouter = require('./routes/amenty.router');

app.use(express.json())
app.use(cors());
app.use('/api/v1', mainRouter);

// Creating instances of repositories
const reservationRepository = new ReservationRepository()
const reservationSatusRepository = new ReservationSatusRepository()
const roomTypeRepository = new RoomTypeRepository()
const roomRepository=new RoomRepository()
const hotelRepository = new HotelRepository();
const amentyRepository = new AmentyRepository();

// Creating instances of controllers
const reservationController = new ReservationController(reservationRepository)
const reservationSatusController = new ReservationSatusController(reservationSatusRepository)
const roomTypeController = new RoomTypeController(roomTypeRepository)
const roomController = new RoomController(roomRepository)
const hotelController = new HotelController(hotelRepository);
const amentyController = new AmentyController(amentyRepository)

//if router not found will display this message
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// routers with controllers
mainRouter.use("/users", userRouter);
mainRouter.use('/reservations', reservationRouter(reservationController))
mainRouter.use('/reservation-status', reservationSatusRouter(reservationSatusController))
mainRouter.use('/room-type', roomTypeRouter(roomTypeController))
mainRouter.use('/rooms',roomRouter(roomController))
mainRouter.use('/hotels', hotelRouter(hotelController));
mainRouter.use('/amenties', amentyRouter(amentyController))

app.listen(3000, () => {
  console.log(`listening on port 3000 ...`);
});
