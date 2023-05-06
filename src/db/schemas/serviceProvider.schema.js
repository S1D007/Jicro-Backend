const mongoose = require('mongoose')

const serviceProviderSchema = mongoose.Schema({
    phone_number: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    location: {
        address_formated: String,
        coordinates: {
            type: [Number]
        },
        type: {
            type: String,
            default: 'Point'
        }
    },
    services: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Service"
        }
    ],
    profession: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: ""
    },
    banner: {
        type: String,
        default: ""
    },
    bank: {
        account_number: {
            type: String,
            default: ""
        },
        ifsc_code: {
            type: String,
            default: ""
        }
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        history: [
            {
                from: String,
                amount: Number,
                balance: Number
            }
        ]
    },
    orders: [
        {
            order: {
                type: mongoose.Types.ObjectId,
                ref: "Order"
            },
        }
    ],
    ratings: {
        type: Number,
        default: 0.0
    },
    proof: {
        type: String,
    },
    token:String
})

serviceProviderSchema.index({ location: '2dsphere' });

module.exports = serviceProviderSchema;
