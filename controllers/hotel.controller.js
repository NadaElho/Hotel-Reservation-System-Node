class hotelController {
  constructor(hotelRepository) {
    this.hotelRepository = hotelRepository;
  }
  getAllHotels() {
    return this.hotelRepository.getAllHotels();
  }
  //
  getHotelById(id){
    return this.hotelRepository.getHotelById(id);
  }
  addHotel(newHotel){
   return this.hotelRepository.addHotel(newHotel)
  }
  ///
  editHotel(id,body){
   return this.hotelRepository.editHotel(id,body)
  }
  //
  deleteHotel(id) {
   return this.hotelRepository.deleteHotel(id);
  }
}
module.exports = hotelController;
