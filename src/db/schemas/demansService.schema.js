const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String,
    },
    images: [
        {
            type: String
        }
    ],
    price:{
        type: Number
    },
    type: {
        category:{
            type: String
        },
        sub_category:{
            type: String
        }
    },
    orderID: {
        type: String
    },
    status: {
        type: String,
        default: 'Pending'
    },
    dateTime: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    serviceProvider: {
        type: mongoose.Types.ObjectId,
        ref: 'ServiceProvider'
    }
})

module.exports = orderSchema;
