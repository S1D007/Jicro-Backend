const mongoose = require("mongoose")

const serviceSchema = require("../schemas/service.schema")

const Service = mongoose.model("Service",serviceSchema)

module.exports = Service