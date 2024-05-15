class reservationSatusController {
  constructor(reservationSatusRepository) {
    this.reservationSatusRepository = reservationSatusRepository
  }
  getReservationStatus() {
    return this.reservationSatusRepository.getReservationStatus()
  }

  async addReservationStatus(body){
    return await this.reservationSatusRepository.addReservationStatus(body)
  }

  editReservationStatus(id, body){
    return this.reservationSatusRepository.editReservationStatus(id, body)
  }

  async deleteReservationStatus(id){
    return await this.reservationSatusRepository.deleteReservationStatus(id)
  }
}

module.exports = reservationSatusController
