const Reservation = require("../models/reservation");
const NotFoundError = require("../handleErrors/notFoundError");

class ReservationRepository {
  async getAllReservations(skip, limit) {
    const documentCount = await Reservation.countDocuments();
    const data = await Reservation.find()
      .populate("roomId")
      .populate("status")
      .populate("userId")
      .skip(skip)
      .limit(limit);

    if (!data.length) {
      throw new NotFoundError("No reservations found");
    }
    return { data, documentCount };
    // return reservations
  }

  async getUserReservations(userId) {
    const userReservations = await Reservation.find({ userId })
      .populate("roomId")
      .populate("status")
      .populate("userId");

    if (!userReservations.length) {
      throw new NotFoundError("No reservations found for this user");
    }
    return userReservations;
  }

  async getReservation(id) {
    const reservation = await Reservation.findOne({ _id: id })
      .populate("roomId")
      .populate("status")
      .populate("userId");

    if (!reservation) {
      throw new NotFoundError("No reservation found with this id");
    }
    return reservation;
  }

  async getRoomReservations(roomId) {
    const roomReservations = await Reservation.find({ roomId })
      .populate("roomId")
      .populate("status")
      .populate("userId");

    if (!roomReservations.length) {
      throw new NotFoundError("No reservations found for this room");
    }
    return roomReservations;
  }

  async addNewReservation({
    userId,
    roomId,
    status,
    checkIn,
    checkOut,
    totalPrice,
  }) {
    await Reservation.create({
      userId,
      roomId,
      status,
      checkIn,
      checkOut,
      totalPrice,
    });
  }

  async editReservation(id, { checkIn, checkOut }) {
    await Reservation.updateOne({ _id: id }, { checkIn, checkOut });
  }

  async userPaid(id){
    return await Reservation.updateOne(
      { _id: id },
      { $set: { paid: true } }
    );
  }

  async cancelReservation(id) {
    await Reservation.updateOne(
      { _id: id },
      { $set: { status: "663a8158e3427acea0ef0b54" } }
    );
  }

  async payWithStripe(id) {
    const reservation = await Reservation.findOne({ _id: id }).populate(
      "roomId"
    );
    return reservation;
  }

  async isRoomReserved(roomId, checkIn, checkOut, id) {
    const getRoomReservations = await Reservation.find({
      roomId,
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
        { checkIn: { $lte: checkIn }, checkOut: { $gte: checkOut } },
      ],
    }).populate("status");

    const reservationsExceptEditing = getRoomReservations.filter(
      (reservation) => {
        return reservation.id != id && reservation.status.name_en != "canceled";
      }
    );
    return reservationsExceptEditing.length;
  }
}

module.exports = ReservationRepository;
