class RoomTypeController {
  constructor(roomTypeRepository) {
    this.roomTypeRepository = roomTypeRepository;
  }

  async getAllRoomsType(skip, limit) {
    return await this.roomTypeRepository.getAllRoomsType(skip, limit);
  }

  async getRoomTypeById(id) {
    return await this.roomTypeRepository.getRoomTypeById(id);
  }

  async addRoomType(newRoomType) {
    return await this.roomTypeRepository.addRoomType(newRoomType);
  }

  async editRoomType(id, UpdateRoomType) {
    return await this.roomTypeRepository.editRoomType(id, UpdateRoomType);
  }

  async deleteRoomType(id) {
    return await this.roomTypeRepository.deleteRoomType(id);
  }
}

module.exports = RoomTypeController;
