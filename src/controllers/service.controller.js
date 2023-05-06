const Service = require("../db/models/Service.model");
const User = require("../db/models/User.model");
const Order = require("../db/models/Order.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");
const { client } = require("../config/redisConnect");
const sendNotification = require("../service/Notification/sendNotification");

const add_service = async (req, res) => {
  const id = req.id;
  const { title, images, price, details, note, included, notIncluded } = req.body;
  const orderID = `J-${title.split(' ').map((e) => e.charAt(0)).join('')}${Math.floor(Math.random() * 100)}`.toUpperCase();
  const random = (Math.random() * 4)
  const multiplyVal = Math.floor(random) === 0 ? 1 : random
  const multipliedVal = Math.floor(price * multiplyVal)
  const endsWithZeroOrFiveorSomethingShit = multipliedVal.toString().endsWith('0') || multipliedVal.toString().endsWith('5') || multipliedVal.toString().endsWith('01')
  const manupulated = !multipliedVal === 100 && endsWithZeroOrFiveorSomethingShit ? multipliedVal - 1 : multipliedVal
  const discount = (((manupulated - 100) / manupulated) * 100).toFixed(0)
  try {
    const SP = await ServiceProvider.findOne({ _id: id });
    const service = new Service({
      title,
      images,
      price: {
        manupulated: manupulated,
        discount: discount,
        actual: price
      },
      ratings: "0.0",
      details,
      provider: id,
      buyers: [],
      orderID,
      note,
      included,
      notIncluded
    });
    await Promise.all([service.save(), SP.services.push(service._id), SP.save()]);
    res.status(200).json({
      response: true,
      data: service
    });
  } catch (e) {
    res.status(400).json({
      response: false,
      error: e
    });
  }
};

const get_services = async (req, res) => {
  const { latitude, longitude, limit, radius } = req.body;
  console.log(req.body)
  const nearbySP = await ServiceProvider.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: radius * 1000,
      }
    }
  }).select("_id").limit(limit)

  await Service.find({
    provider: {
      $in: nearbySP.map(provider => provider._id)
    }
  }).populate('provider', 'name ratings logo profession location.coordinates')
    .then((servicesList) => {
      console.log(servicesList)
      const services = servicesList.map(service => service)
      res.json(services);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred while fetching services');
    });
};
const get_service = async (req, res) => {
  const { _id } = req.body;
  const doc  = await Service.findOne({_id}).populate('provider','name title banner logo ratings')
  res.send(doc)
}
const order_service = async (req, res) => {
  const { service_provider_id, service_id, note } = req.body;
  const user_id = req.id;

  const [user, serviceProvider, service] = await Promise.all([
    User.findOne({ _id: user_id }).select('orders token name').lean(),
    ServiceProvider.findOne({ _id: service_provider_id }).select('orders token name').lean(),
    Service.findOne({ _id: service_id }).select('buyers orderID title').lean(),
  ]);

  const orderID = `${service.orderID}${Math.floor(Math.random() * 100)}`;
  const order = new Order({
    user: user_id,
    service: service_id,
    provider: service_provider_id,
    orderID
  });

  await Promise.all([
    order.save(),
    User.updateOne({ _id: user_id }, { $push: { orders: { order: order._id } } }),
    ServiceProvider.updateOne({ _id: service_provider_id }, { $push: { orders: { order: order._id } } }),
    Service.updateOne({ _id: service_id }, { $push: { buyers: { orders: { order: order._id } } } }),
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
};



module.exports = { add_service, get_services, get_service, order_service };
