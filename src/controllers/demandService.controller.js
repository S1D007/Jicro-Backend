const DemandService = require("../db/models/DemandService.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");
const sendNotification = require("../service/Notification/sendNotification");

const demandService = async (req, res) => {
  try {
    const { title, description, image, budget, category, sub_category, date } = req.body;
    const id = req.id;
    const orderID = `JD-${title.split(' ').map((e) => e.charAt(0)).join('')}${Math.floor(Math.random() * 100)}`.toUpperCase();
    
    const doc = new DemandService({
      title,
      description,
      image,
      price: budget,
      type: {
        category,
        sub_category
      },
      dateTime: date,
      orderID,
      user: id
    });

    await doc.save();

    res.send({
      response: true
    });

    const SPdocs = await ServiceProvider.find({ profession: category }).select("token name");
    SPdocs.forEach((doc) => {
      sendNotification(doc.token, `${doc.name}, you have received an order`, `This is a Demanded Service for ${title.slice(0, 10)}. Grab this opportunity.`);
    });

  } catch (error) {
    console.error("Error creating demanded service:", error);
    res.status(400).send({
      response: false,
      error: error.message
    });
  }
};

const acceptDemandedService = async (req, res) => {
  try {
    const { demandedServiceID } = req.body;
    const id = req.id;
    const doc = await DemandService.findOne({ _id: demandedServiceID });

    if (!doc) {
      return res.status(404).send({
        response: false,
        error: "Demanded service not found",
      });
    }

    if (doc.serviceProvider) {
      return res.status(400).send({
        response: false,
        error: "This order has already been accepted by another service provider",
      });
    }

    doc.serviceProvider = id;
    doc.status = "Accepted";
    await doc.save();

    sendNotification(
      doc.token,
      `Your Demand for ${doc.title.slice(0, 5)}... has been Accepted`,
      `${doc.name} will arrive at your location soon`,
      "",
      ""
    );

    res.send({
      response: true,
    });

  } catch (error) {
    console.error("Error accepting demanded service:", error);
    res.status(500).send({
      response: false,
      error: "An error occurred while accepting the demanded service",
    });
  }
};

const getDemandedService = async (req, res) => {
  try {
    const { type } = req.body;
    const id = req.id;

    const check = type === "user" ? { user: id } : { serviceProvider: id };
    const doc = await DemandService.find(check).populate("user").populate("serviceProvider");

    res.send({
      data: doc
    });

  } catch (error) {
    console.error("Error fetching demanded services:", error);
    res.status(500).send({
      error: "An error occurred while fetching demanded services."
    });
  }
};

const getDemandedServiceForAll = async (req, res) => {
  try {
    const { profession } = req.body;
    const doc = await DemandService.find({ "type.category": profession, serviceProvider: null }).populate("user");

    res.send({
      data: doc
    });

  } catch (error) {
    console.error("Error fetching demanded services:", error);
    res.status(500).send({
      error: "An error occurred while fetching demanded services."
    });
  }
};

module.exports = { demandService, acceptDemandedService, getDemandedService, getDemandedServiceForAll };
