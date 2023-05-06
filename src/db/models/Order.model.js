const mongoose = require("mongoose")

const orderSchema = require("../schemas/order.schema")
const Order = mongoose.models.order || mongoose.model('order', orderSchema);

module.exports = Order