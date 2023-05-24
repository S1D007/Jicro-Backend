const mongoose = require("mongoose")

const demandService = require("../schemas/demansService.schema")

const DemandService = mongoose.model("DemandedService",demandService)

module.exports = DemandService