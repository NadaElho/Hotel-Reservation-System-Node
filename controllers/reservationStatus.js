class ReservationSatusController {
  constructor(reservationStatusRepository) {
    this.reservationStatusRepository = reservationStatusRepository;
  }
  async getReservationStatus() {
    return await this.reservationStatusRepository.getReservationStatus();
  }

  async getReservationStatusById(id) {
    return await this.reservationStatusRepository.getReservationStatusById(id);
  }
  async addReservationStatus(body) {
    return await this.reservationStatusRepository.addReservationStatus(body);
  }

  async editReservationStatus(id, body) {
    return await this.reservationStatusRepository.editReservationStatus(
      id,
      body
    );
  }

  async deleteReservationStatus(id) {
    return await this.reservationStatusRepository.deleteReservationStatus(id);
  }
}

module.exports = ReservationSatusController;
