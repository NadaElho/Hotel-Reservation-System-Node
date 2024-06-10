require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();

const mainRouter = express.Router();
const NotFoundError = require("./handleErrors/notFoundError");

// Importing repositories
const ReservationRepository = require("./repositories/reservation");
const ReservationSatusRepository = require("./repositories/reservationStatus");
const RoomTypeRepository = require("./repositories/roomType");
const RoomRepository = require("./repositories/room");
const HotelRepository = require("./repositories/hotel");
const AmenityRepository = require("./repositories/amenity");
const UserRepository = require("./repositories/user");
const AuthRepository = require("./repositories/auth");
const RoleRepository = require("./repositories/role");
const PromotionRepository = require("./repositories/promotion");
// Importing controllers
const ReservationController = require("./controllers/reservation");
const ReservationSatusController = require("./controllers/reservationStatus");
const RoomTypeController = require("./controllers/roomType");
const RoomController = require("./controllers/room");
const HotelController = require("./controllers/hotel");
const AmenityController = require("./controllers/amenity");
const AuthController = require("./controllers/auth");
const UserController = require("./controllers/user");
const RoleController = require("./controllers/role");
const PromotionController = require("./controllers/promotion");
// Importing routers
const reservationRouter = require("./routes/reservation");
const reservationSatusRouter = require("./routes/reservationStatus");
const roomTypeRouter = require("./routes/roomType");
const roomRouter = require("./routes/room");
const hotelRouter = require("./routes/hotel");
const amenityRouter = require("./routes/amenity");
const userRouter = require("./routes/user");
const roleRouter = require("./routes/role");
const promotionRouter = require("./routes/promotion");

app.use(express.json());
app.use(cors());
app.use("/api/v1", mainRouter);

// Creating instances of repositories
const reservationRepository = new ReservationRepository();
const reservationSatusRepository = new ReservationSatusRepository();
const roomTypeRepository = new RoomTypeRepository();
const roomRepository = new RoomRepository();
const hotelRepository = new HotelRepository();
const amenityRepository = new AmenityRepository();
const userRepository = new UserRepository();
const authRepository = new AuthRepository();
const roleRepository = new RoleRepository();
const promotionRepository = new PromotionRepository();
// Creating instances of controllers
const reservationController = new ReservationController(reservationRepository);
const reservationSatusController = new ReservationSatusController(
  reservationSatusRepository
);
const roomTypeController = new RoomTypeController(roomTypeRepository);
const roomController = new RoomController(roomRepository);
const hotelController = new HotelController(hotelRepository);
const amenityController = new AmenityController(amenityRepository);
const authController = new AuthController(authRepository);
const userController = new UserController(userRepository);
const roleController = new RoleController(roleRepository);
const promotionController = new PromotionController(promotionRepository);
// routers with controllers
mainRouter.use("/reservations", reservationRouter(reservationController));
mainRouter.use(
  "/reservation-status",
  reservationSatusRouter(reservationSatusController)
);
mainRouter.use("/room-type", roomTypeRouter(roomTypeController));
mainRouter.use("/rooms", roomRouter(roomController));
mainRouter.use("/hotels", hotelRouter(hotelController));
mainRouter.use("/amenities", amenityRouter(amenityController));
mainRouter.use("/users", userRouter(userController, authController));
mainRouter.use("/roles", roleRouter(roleController));
mainRouter.use("/promotions" , promotionRouter(promotionController))
//if router not found will display this message
app.all("*", (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`listening on port ${port} ...`);
});
