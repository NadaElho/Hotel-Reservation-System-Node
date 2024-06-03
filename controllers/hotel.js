class HotelController {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository
  }
 async getAllHotels(skip,limit) {
    return await this.hotelRepository.getAllHotels(skip,limit)
  }

 async getHotelById(id) {
    return await this.hotelRepository.getHotelById(id)
  }

 async addHotel(newHotel) {
    return await this.hotelRepository.addHotel(newHotel)
  }

 async editHotel(id, body) {
    return await this.hotelRepository.editHotel(id, body)
  }

  async deleteHotel(id) {
    return await this.hotelRepository.deleteHotel(id)
  }
}
module.exports = HotelController
