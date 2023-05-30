const Service = require("../db/models/Service.model");
const User = require("../db/models/User.model");
const Order = require("../db/models/Order.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");
const { client } = require("../config/redisConnect");
const sendNotification = require("../service/Notification/sendNotification");

const addService = async (req, res) => {
  const id = req.id;
  const { title, images, price, details, note, included, notIncluded, category, sub_category } = req.body;
  const orderID = `J-${title.split(' ').map((e) => e.charAt(0)).join('')}${Math.floor(Math.random() * 100)}`.toUpperCase();
  const random = Math.random() * 4;
  const multiplyVal = Math.floor(random) === 0 ? 1 : random;
  const multipliedVal = Math.floor(price * multiplyVal);
  const endsWithZeroOrFive = multipliedVal.toString().endsWith('0') || multipliedVal.toString().endsWith('5');
  const manipulated = !multipliedVal === 100 && endsWithZeroOrFive ? multipliedVal - 1 : multipliedVal;
  const discount = (((manipulated - price) / manipulated) * 100).toFixed(0);

  try {
    const SP = await ServiceProvider.findOne({ _id: id });
    const service = new Service({
      title,
      images,
      price: {
        manipulated,
        discount,
        actual: price
      },
      ratings: "0.0",
      details,
      provider: id,
      buyers: [],
      orderID,
      note,
      included,
      notIncluded,
      type: {
        category,
        sub_category
      }
    });
    await Promise.all([service.save(), SP.services.push(service._id), SP.save()]);
    res.status(200).json({
      response: true,
      data: service
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while adding the service"
    });
  }
};

const getServices = async (req, res) => {
  const {
    latitude,
    longitude,
    radius,
    minPrice,
    maxPrice,
    minRatings,
    page = 1,
    perPage = 10,
    sortBy,
    discount,
    category,
    subCategory
  } = req.body;

  try {
    const nearbySP = await ServiceProvider.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radius
        }
      }
    })
      .select('_id')
      .limit(perPage)
      .skip((page - 1) * perPage);

    const serviceQuery = {
      provider: {
        $in: nearbySP.map((provider) => provider._id)
      }
    };

    if (minPrice && maxPrice) {
      serviceQuery['price.manipulated'] = {
        $gte: minPrice,
        $lte: maxPrice
      };
    } else if (minPrice) {
      serviceQuery['price.manipulated'] = { $gte: minPrice };
    } else if (maxPrice) {
      serviceQuery['price.manipulated'] = { $lte: maxPrice };
    }

    if (minRatings) {
      serviceQuery['provider.ratings'] = { $gte: minRatings };
    }

    if (discount) {
      serviceQuery['price.discount'] = { $gt: 0 };
    }

    if (category) {
      serviceQuery['type.category'] = category;
    }
    if (subCategory) {
      serviceQuery['type.sub_category'] = subCategory;
    }

    const sortQuery = {};

    if (sortBy === 'priceAsc') {
      sortQuery['price.manipulated'] = 1;
    } else if (sortBy === 'priceDesc') {
      sortQuery['price.manipulated'] = -1;
    } else if (sortBy === 'ratingAsc') {
      sortQuery['ratings'] = 1;
    } else if (sortBy === 'ratingDesc') {
      sortQuery['ratings'] = -1;
    }

    const servicesList = await Service.find(serviceQuery)
      .populate('provider', 'name ratings logo profession location.coordinates')
      .sort(sortQuery);

    const services = servicesList.map((service) => service);
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).send({
      response:false,
      error:"An error Occured while Fetching the Services"
    });
  }
};

const getService = async (req, res) => {
  const { _id } = req.body;
  try {
    const doc = await Service.findOne({ _id }).populate('provider', 'name title banner logo ratings');
    res.send(doc);
  } catch (error) {
    console.error("Error getting service:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while getting the service"
    });
  }
};

const getAllServices = async (req, res) => {
  const _id = req.id;
  try {
    const services = await Service.find({ provider: _id });
    res.send({
      response: true,
      data: services
    });
  } catch (error) {
    console.error("Error getting all services:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while getting all services"
    });
  }
};

const orderService = async (req, res) => {
  const { service_provider_id, service_id, note } = req.body;
  const user_id = req.id;

  try {
    const [user, serviceProvider, service] = await Promise.all([
      User.findOne({ _id: user_id }).select('orders token name').lean(),
      ServiceProvider.findOne({ _id: service_provider_id }).select('orders token name').lean(),
      Service.findOne({ _id: service_id }).select('buyers orderID title').lean()
    ]);

    const orderID = `${service.orderID}${Math.floor(Math.random() * 100)}`;
    const order = new Order({
      user: user_id,
      service: service_id,
      provider: service_provider_id,
      orderID,
      note
    });

    await Promise.all([
      order.save(),
      User.updateOne({ _id: user_id }, { $push: { orders: { order: order._id } } }),
      ServiceProvider.updateOne({ _id: service_provider_id }, { $push: { orders: { order: order._id } } }),
      Service.updateOne({ _id: service_id }, { $push: { buyers: { orders: { order: order._id } } } })
    ]);

    sendNotification(
      user.token,
      `Your Order 📦 for ${service.title} has been Placed 😏 `,
      `The Order has been placed ${serviceProvider.name} will Come to Your House Shortly, Check For Your Order's Page for More Details`
    );
    sendNotification(
      serviceProvider.token,
      `You have received 📲 a New Order for 🤑 ${service.title} `,
      `Please Come to ${user.name} as Soon as Possible`
    );

    res.send({ response: true, orderID });
  } catch (error) {
    console.error("Error ordering service:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while ordering the service"
    });
  }
};

const updateStatus = async (req, res) => {
  const { _id, status } = req.body;
  try {
    await Order.findOneAndUpdate({ _id }, {
      $set: {
        status
      }
    });
    res.send({
      response: true
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while updating the status"
    });
  }
};

const updateService = async (req, res) => {
  const { _id, updates } = req.body;
  try {
    await Service.findOneAndUpdate({ _id }, {
      $set: updates
    });
    res.send({
      response: true
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(400).json({
      response: false,
      error: "An error occurred while updating the service"
    });
  }
};

module.exports = { addService, getServices, getService, orderService, updateStatus, getAllServices, updateService };
