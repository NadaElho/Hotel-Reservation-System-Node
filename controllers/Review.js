const Room = require("../models/room")

class ReviewController {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository
    }
  
    async getReviews(skip, limit) {
        return await this.reviewRepository.getReviews(skip, limit)
    }

    async getRoomReviews(id) {
        return await this.reviewRepository.getRoomReviews(id)
    }
  
    async addReview(body) {
        const {roomId} = body
        const roomReviews = await this.reviewRepository.getRoomReviews(body.roomId)
        const countReviews = roomReviews.length
        const sumRatings = roomReviews.reviews.reduce((total, review)=>{
            return total + review.rating
        }, 0)
        const avg = (sumRatings + body.rating) / (countReviews + 1)
        await Room.findOneAndUpdate({_id: roomId}, {
            ratingAvg: avg,
        })
        return await this.reviewRepository.addReview(body)
    }
  
    async editReview(id, body) {
        const {rating} = body
        if(rating){
            const review = await this.reviewRepository.getReview(id)
            const prevRating = review.rating
            const roomReviews = await this.reviewRepository.getRoomReviews(review.roomId)

            const countReviews = roomReviews.reviews.length
            const sumRatings = roomReviews.reviews.reduce((total, review)=>{
               return total + review.rating
            }, 0)
            const avg = (sumRatings + body.rating - prevRating) / (countReviews)
            await Room.findOneAndUpdate({_id: review.roomId}, {
                ratingAvg: isNaN(avg) ? 0 : avg 
            })
        }
      return await this.reviewRepository.editReview(id, body)
    }
  
    async deleteReview(id) {
        const review = await this.reviewRepository.getReview(id)
        const rating = review.rating;
        const roomReviews = await this.reviewRepository.getRoomReviews(review.roomId)
        const sumRatings = roomReviews.reviews.reduce((total, review)=>{
            return total + review.rating
            }, 0)
            const avg = (sumRatings - rating) / (roomReviews.reviews.length - 1) 
        await Room.findOneAndUpdate({_id: review.roomId}, {
            ratingAvg: isNaN(avg) ? 0 : avg 
        })
        return await this.reviewRepository.deleteReview(id)
    }
  }
  
  module.exports = ReviewController
  