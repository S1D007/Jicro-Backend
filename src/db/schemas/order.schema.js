const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    provider:{
        type:mongoose.Types.ObjectId,
        ref:'ServiceProvider'
    },
    service:{
        type:mongoose.Types.ObjectId,
        ref:'Service'
    },
    orderID:{
        type:String
    },
    status:{
        type:String,
        default:'Pending'
    },
    dateTime:{
        type:mongoose.Schema.Types.Date,
        default:new Date()
    }
})

module.exports = orderSchema;