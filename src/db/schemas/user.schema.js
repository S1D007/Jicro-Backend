const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    phone_number: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    location: {
        address_formated:{
            type:String,
            required:true
        },
        coordinates:[Number],
        type:{
            type:String,
            default:'Point'
        }
    },
    orders:[
        {
            order: {
                type: mongoose.Types.ObjectId,
                ref: "Order"
            },
        }
    ],
    refers:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ],
    searches:[],
    token:String
})

module.exports = userSchema