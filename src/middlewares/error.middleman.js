const fs = require("fs");

const errorLogger = (err, req, res, next) => {
  // Log the error to a file
  const errorMessage = `${new Date().toISOString()} - ${err.stack}\n`;
  fs.appendFile("error.log", errorMessage, (error) => {
    if (error) {
      console.error("Error logging the error:", error);
    }
  });

  // Continue to the next middleware
  next(err);
};

module.exports = errorLogger;
