class RoomController {
  constructor(roomRepository) {
    this.roomRepository = roomRepository
  }

  async addRoom(newRoom) {
    return await this.roomRepository.addRoom(newRoom)
  }

  async getAllRooms() {
    return await this.roomRepository.getAllRooms()
  }

  async getRoomById(roomId) {
    return await this.roomRepository.getRoomById(roomId)
  }

  async editRoom(id, updateRoom) {
    return await this.roomRepository.editRoom(id, updateRoom)
  }

  async deleteRoom(id) {
    return await this.roomRepository.deleteRoom(id);
  }
  async getRoomNotReservations(checkIn,checkOut ){
    return await this.roomRepository.getRoomNotReservations(checkIn,checkOut );
  } 
}

module.exports = RoomController
