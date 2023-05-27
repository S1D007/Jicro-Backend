const DemandService = require("../db/models/DemandService.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");
const sendNotification = require("../service/Notification/sendNotification");

const demandService = async (req, res, next) => {
  const { title, description, image, budget, category, sub_category, date } = req.body;
  const id = req.id;
  try {
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
    
    // next()
  } catch (error) {
    res.send({
      response: false,
      error: error.message
    });
  }
};

const acceptDemandedService = async (req, res) => {
    const { demandedServiceID } = req.body
    const id = req.id
     const doc = await DemandService.findOne({ _id: demandedServiceID }).populate('user','toekn name')
    // const SPdoc = await ServiceProvider.findOne({ _id: id }).select('name token')
    if(!doc.serviceProvider){
        doc.serviceProvider = id
    doc.status = "Accepted"
    await doc.save()
    sendNotification(doc.token, `Your Demand for ${doc.title.slice(0, 5)}... has beed Accepted `, `${doc.name} will arrive to Your Location Soon`, "", "")
    res.send({
        response:true
    })
    }else{
        res.status(400).send({
            response:false,
            error: "This Orders Has Already been Accepted By Another Service Provider"
        })
    }
}
const getDemanedService = async (req, res) => {
    const {type} = req.body;
    const id = req.id
    const check = type === "user"? {
        user:id
    }:{
        serviceProvider:id
    }
    const doc = await DemandService.findOne({ check }).populate("user").populate("serviceProvider")
    res.send({
        data:doc
    })
}
const getDemanedServiceForAll = async (req, res) => {
    const {profession} = req.body;
    const doc = await DemandService.findOne({ type:{category: profession} }).populate("user").populate("serviceProvider")
    if(!doc.serviceProvider){
        res.send({
        data:doc
        })
    }else{
    res.send({
        data:[]
    })}
}

module.exports = { demandaService, acceptDemandedService, getDemanedService, getDemanedServiceForAll }
