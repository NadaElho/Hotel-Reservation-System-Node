const BaseError = require("./baseError");

class authError extends BaseError {
  constructor(message) {
    super(401, message);
  }
}

module.exports = authError;
