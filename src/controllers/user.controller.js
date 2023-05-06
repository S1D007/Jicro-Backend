const Order = require("../db/models/Order.model");
const User = require("../db/models/User.model");

const get_bookings = async(req, res) => {
    const _id = req.id
    // TODO change orders ->  Booings in { Schema }
    const doc = await Order.find({
      user:_id
    })
    .populate('provider', 'name banner logo ratings')
    .populate('service','images title price')
    res.send({
        response:true,
        data:doc
    })
}

module.exports = get_bookings