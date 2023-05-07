const mongoose = require("mongoose")
const url = process.env.URI;

const connectToDatabase = () => {
    mongoose.connect(url ,{useNewUrlParser: true,
        useUnifiedTopology: true}).then(() => {
        
      })
      .catch((e) => {
        
      });
};

module.exports = connectToDatabase;