const ReservationStatus = require('../models/reservationStatus')
const NotFoundError = require('../handleErrors/notFoundError')

class ReservationSatusRepository {
  async getReservationStatus() {
    const reservationStatus = await ReservationStatus.find()
    if (!reservationStatus.length) {
      throw new NotFoundError('No reservation statuses found')
    }
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

module.exports = ReservationSatusRepository
