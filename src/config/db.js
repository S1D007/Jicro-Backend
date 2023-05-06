const mongoose = require("mongoose")
const url = process.env.URI;

const connectToDatabase = () => {
    mongoose.connect(url ,{useNewUrlParser: true,
        useUnifiedTopology: true}).then(() => {
        console.log("Succesfully connected to database ℹ");
      })
      .catch((e) => {
        console.log(`Error > \n ${e.message}`);
      });
};

module.exports = connectToDatabase;