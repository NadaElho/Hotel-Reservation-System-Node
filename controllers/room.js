class roomController {
  constructor(roomRepository) {
    this.roomRepository = roomRepository;
  }

  async addRoom(newRoom) {
    return await this.roomRepository.addRoom(newRoom);
  }

   async getAllRooms() {
    return await this.roomRepository.getAllRooms();
  }

  async getRoomById(roomId) {
    return await this.roomRepository.getRoomById(roomId);
  }

  async editRoom(id, updateRoom) {
    return await this.roomRepository.editRoom(id, updateRoom);
  }

  async deleteRoom(id) {
    return await this.roomRepository.deleteRoom(id);
  }
}

module.exports = roomController;
