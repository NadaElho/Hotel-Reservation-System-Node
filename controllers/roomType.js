class RoomTypeController {
  constructor(roomTypeRepository) {
    this.roomTypeRepository = roomTypeRepository;
  }

  async addRoomType(newRoomType) {
    return await this.roomTypeRepository.addRoomType(newRoomType);
  }

  async getAllRoomsType() {
    return await this.roomTypeRepository.getAllRoomsType();
  }

  async editRoomType(id, UpdateRoomType) {
    return await this.roomTypeRepository.editRoomType(id, UpdateRoomType);
  }

  async deleteRoomType(id) {
    return await this.roomTypeRepository.deleteRoomType(id);
  }
}

module.exports = RoomTypeController;