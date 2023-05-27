const DemandService = require("../db/models/DemandService.model");
const ServiceProvider = require("../db/models/ServiceProvider.model");
const sendNotification = require("../service/Notification/sendNotification");

const demandaService = async (req, res, next) => {
    const { title, description, images, price, category, sub_category, dateTime } = req.body;
    const id = req.id
    try {
        const orderID = `JD-${title.split(' ').map((e) => e.charAt(0)).join('')}${Math.floor(Math.random() * 100)}`.toUpperCase();
        const doc = new DemandService({
            title,
            description,
            images,
            price,
            type: {
                category,
                sub_category
            },
            dateTime,
            orderID,
            user: id
        })
        await doc.save()
        res.send({
            response: true
        })
        const SPdoc = ServiceProvider.find({ professtion: category }).select("token name")
        SPdoc.forEach((e, i)=>{
            sendNotification(e.token,`${e.name} you had received an Order`,`This is a Demanded Service for ${title.slice(0,10)} Grab this Opportunity` )
        })
        // next()
    } catch (e) {
        res.send({
            response: false,
            error: e.message
        })
    }
}

const acceptDemandedService = async (req, res) => {
    const { demandedServiceID } = req.body
    const id = req.id
    
    const doc = await DemandService.findOne({ _id: demandedServiceID }).populate('user','toekn name')
    // const SPdoc = await ServiceProvider.findOne({ _id: id }).select('name token')
    doc.serviceProvider = id
    await doc.save()
    sendNotification(doc.token, `Your Demand for ${doc.title.slice(0, 5)}... has beed Accepted `, `${doc.name} will arrive to Your Location Soon`, "", "")
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

}

module.exports = { demandaService, acceptDemandedService }
