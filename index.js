require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();

const mainRouter = express.Router()
const NotFoundError = require('./utils/notFoundError')

// Importing repositories
const ReservationRepository = require("./repositories/reservation");
const ReservationSatusRepository = require("./repositories/reservationStatus");
const RoomTypeRepository = require("./repositories/roomType");
const RoomRepository = require("./repositories/room");
const HotelRepository = require("./repositories/hotel");
const AmentyRepository = require("./repositories/amenty");
const UserRepository = require("./repositories/user");
const AuthRepository = require("./repositories/auth");
const RoleRepository = require("./repositories/role");

// Importing controllers
const ReservationController = require("./controllers/reservation");
const ReservationSatusController = require("./controllers/reservationStatus");
const RoomTypeController = require("./controllers/roomType");
const RoomController = require("./controllers/room");
const HotelController = require("./controllers/hotel");
const AmentyController = require("./controllers/amenty");
const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const RoleController = require("./controllers/role");

// Importing routers
const reservationRouter = require("./routes/reservation");
const reservationSatusRouter = require("./routes/reservationStatus");
const roomTypeRouter = require("./routes/roomType");
const roomRouter = require("./routes/room");
const hotelRouter = require("./routes/hotel");
const amentyRouter = require("./routes/amenty");
const userRouter = require("./routes/user");
const roleRouter = require("./routes/role");

app.use(express.json());
app.use(cors());
app.use("/api/v1", mainRouter);

// Creating instances of repositories
const reservationRepository = new ReservationRepository();
const reservationSatusRepository = new ReservationSatusRepository();
const roomTypeRepository = new RoomTypeRepository();
const roomRepository = new RoomRepository();
const hotelRepository = new HotelRepository();
const amentyRepository = new AmentyRepository();
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const roleRepository = new RoleRepository();

// Creating instances of controllers
const reservationController = new ReservationController(reservationRepository);
const reservationSatusController = new ReservationSatusController(
  reservationSatusRepository
);
const roomTypeController = new RoomTypeController(roomTypeRepository);
const roomController = new RoomController(roomRepository);
const hotelController = new HotelController(hotelRepository);
const amentyController = new AmentyController(amentyRepository);
const authController = new AuthController(authRepository);
const userController = new UserController(userRepository);
const roleController = new RoleController(roleRepository);

// routers with controllers
mainRouter.use("/reservations", reservationRouter(reservationController));
mainRouter.use(
  "/reservation-status",
  reservationSatusRouter(reservationSatusController)
);
mainRouter.use("/room-type", roomTypeRouter(roomTypeController));
mainRouter.use("/rooms", roomRouter(roomController));
mainRouter.use("/hotels", hotelRouter(hotelController));
mainRouter.use("/amenties", amentyRouter(amentyController));
mainRouter.use("/users", userRouter(userController, authController));
mainRouter.use("/roles", roleRouter(roleController));

//if router not found will display this message
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`))
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`listening on port ${port} ...`)
})

