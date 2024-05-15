const ReservationStatus = require('../models/reservationStatus')

class reservationSatusRepository {
  async getReservationStatus() {
    const reservationStatus = await ReservationStatus.find()
    return reservationStatus
  }

  async addReservationStatus(newStatus) {
    await ReservationStatus.create(newStatus)
  }

  async editReservationStatus(id, body) {
    await ReservationStatus.updateOne({ _id: id }, body)
  }

  async deleteReservationStatus(id) {
    await ReservationStatus.deleteOne({ _id: id })
  }
}

module.exports = reservationSatusRepository
