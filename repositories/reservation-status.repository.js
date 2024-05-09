const ReservationStatus = require('../models/reservation-status.model')

class reservationSatusRepository {
  async getReservationStatus() {
    const reservationStatus = await ReservationStatus.find()
    return reservationStatus
  }

  async addReservationStatus({ name_en, name_ar }) {
    await ReservationStatus.create({ name_en, name_ar })
  }

  async editReservationStatus(id, { name_en, name_ar }) {
    await ReservationStatus.updateOne({ _id: id }, { name_en, name_ar })
  }

  async deleteReservationStatus(id) {
    await ReservationStatus.deleteOne({ _id: id })
  }
}

module.exports = reservationSatusRepository
