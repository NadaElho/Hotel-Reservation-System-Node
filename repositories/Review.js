const Review = require('../models/review')
const NotFoundError = require('../handleErrors/notFoundError')

class ReviewRepository {
  async getReviews() {
    const reviews = await Review.find()
    if (!reviews.length) {
      throw new NotFoundError('No reviews found')
    }
    return reviews
  }

  async getRoomReviews(id){
    const reviews = await Review.find({roomId: id})
    return reviews
  }

  async getReview(id){
    const review = await Review.findOne({_id: id})
    if (!review) {
        throw new NotFoundError('No review found with this id')
    }
    return review
  }

  async addReview(body) {
    await Review.create(body)
  }

  async editReview(id, body) {
    await Review.updateOne({ _id: id }, body)
  }

  async deleteReview(id) {
    await Review.deleteOne({ _id: id })
  }
}

module.exports = ReviewRepository
