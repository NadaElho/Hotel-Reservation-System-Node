const ReservationStatus = require("../models/reservation-status.model")

class reservationSatusRepository{
    async getReservationStatus(){
        const reservationStatus = await ReservationStatus.find()
        return reservationStatus
    }

    async addReservationStatus({name}){
        await ReservationStatus.create({name})
    }

    async editReservationStatus(id,{name}){
        await ReservationStatus.updateOne({_id: id}, {name})
    }

    async deleteReservationStatus(id){
        await ReservationStatus.deleteOne({_id: id})
    }
}

module.exports = reservationSatusRepository
