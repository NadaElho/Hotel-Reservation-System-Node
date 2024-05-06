require("dotenv").config();
require("./db");
const cors = require("cors");

const express = require("express");
const app = express();
app.use(express.json())

const mainRouter = express.Router();
const reservationSatusRouter = require('./routes/reservation-status.router')

const ReservationSatusRepository = require('./repositories/reservation-status.repository')

const ReservationSatusController = require('./controllers/reservation-status.controller')

const reservationSatusRepository = new ReservationSatusRepository()

const reservationSatusController = new ReservationSatusController(reservationSatusRepository)

app.use(cors());
app.use('/api/v1', mainRouter);
mainRouter.use('/reservation-status', reservationSatusRouter(reservationSatusController))

app.listen(3000, () => {
    console.log(`listening on port ${3000} ...`);
});