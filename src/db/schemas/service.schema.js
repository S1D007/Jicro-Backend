const mongoose = require("mongoose");

const scrviceSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    price: {
        manupulated: {
            type: Number
        },
        discount: {
            type: Number
        },
        actual: {
            type: Number
        }
    },
    ratings: {
        type: Number,
        default: 0.0
    },
    provider: {
        type: mongoose.Types.ObjectId,
        ref: "ServiceProvider"
    },
    details: {
        type: String,
    },
    included: [],
    notIncluded: [],
    buyers: [
        {
            order:{
                type: mongoose.Types.ObjectId,
                ref: "Order"
            }
        }
    ],
    orderID: String,
    note: String,
    type:{
        category:{
            type:String
        },
        sub_category:{
            type:String
        }
    }
})

module.exports = scrviceSchema;