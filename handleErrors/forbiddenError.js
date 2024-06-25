const BaseError = require("./baseError");

class forbiddenError extends BaseError {
  constructor(message) {
    super(403, message);
  }
}

module.exports = forbiddenError;
