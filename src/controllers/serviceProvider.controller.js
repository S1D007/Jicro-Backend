const { client } = require("../config/redisConnect");
const Order = require("../db/models/Order.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");

const getDetails = async (req, res) => {
  const id = req.id;
  try {
    const serviceProvider = await ServiceProvider.findOne({ _id: id }).select('logo banner ratings name services profession');
    if (!serviceProvider) {
      return res.status(404).json({
        response: false,
        error: `No service provider found with id ${id}`,
      });
    }
    res.status(200).json({
      response: true,
      data: serviceProvider,
    });
  } catch (error) {
    console.error("Error getting service provider details:", error);
    res.status(500).json({
      response: false,
      error: "Internal server error",
    });
  }
};

const getOrders = async (req, res) => {
  const _id = req.id;
  try {
    const doc = await Order.find({ provider: _id })
      .populate('service', 'title price phone_number images type.sub_category')
      .populate('user', 'name location phone_number');
    res.status(200).json({
      response: true,
      data: doc,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      response: false,
      error: "Internal server error",
    });
  }
};

const updateProfile = async (req, res) => {
  const _id = req.id;
  const { updates } = req.body;

  try {
    await ServiceProvider.findOneAndUpdate({ _id }, { $set: updates });
    res.status(200).json({
      response: true,
    });
  } catch (error) {
    console.error("Error updating service provider profile:", error);
    res.status(500).json({
      response: false,
      error: "Internal server error",
    });
  }
};

module.exports = { getDetails, getOrders, updateProfile };
