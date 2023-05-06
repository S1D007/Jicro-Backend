const mongoose = require("mongoose")

const serviceProviderSchema = require("../schemas/serviceProvider.schema")
const ServiceProvider = mongoose.models.ServiceProvider || mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider