const User = require("../db/models/User.model");
const axios = require('axios');
const ServiceProvider = require("../db/models/ServiceProvider.model");
const jwt = require("jsonwebtoken");

const auth_user = async (req, res) => {
    try {
        const { waId, address, long, lat, token } = req.body;
        const config = {
            headers: {
                'clientId': 'lytvflbj',
                'clientSecret': 'eepo0q116dir3603',
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('https://jicro.authlink.me', { waId }, config);
        const { userMobile, userName } = data.data;
        const UserData = await User.findOne({ phone_number: userMobile });
        if (UserData) {
            await User.findOneAndUpdate({phone_number: userMobile},{
                $set:{
                    token
                }
            })
            const JWT = jwt.sign({ id: UserData._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.send({
                response: true,
                user:UserData,
                token: JWT,
            })
        }else{
                const user = new User({
                phone_number: userMobile,
                name: userName,
                location: {
                    address_formated: address,
                    coordinates: [long, lat]
                },
                token
            });

            const JWT = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

            await user.save();
            res.status(200).json({
                response: true,
                user,
                token: JWT,
            });
        }
        
    } catch (error) {
        
        res.status(400).json({
            response: false,
            error: error.message,
        });
    }
};

const auth_serviceProvider = async (req, res) => {
    try {
        const { waId, name, profession, logo, banner, proof, address, coords, type, token } = req.body;
        const config = {
            headers: {
                'clientId': 'lytvflbj',
                'clientSecret': 'eepo0q116dir3603',
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('https://jicro.authlink.me', { waId }, config);
        const { userMobile } = data.data;
        const serviceProvider = await ServiceProvider.findOne({ phone_number: userMobile });
        if (serviceProvider && type === "login") {
            await ServiceProvider.findOneAndUpdate({ phone_number: userMobile }, {
                $set: {
                    token
                }
            });
            const JWT = jwt.sign({ id: serviceProvider._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.status(200).json({
                response: true,
                user: serviceProvider,
                token: JWT,
            });
        } else {
            if (!serviceProvider && type === "login") {
                res.status(404).json({
                    response: false,
                    error: `Service Provider not found with phone number ${userMobile}`
                })
            } else if (!serviceProvider) {
                const serviceProviderDoc = new ServiceProvider({
                    phone_number: userMobile,
                    name,
                    location: {
                        address_formated: address,
                        coordinates: [coords.long, coords.lat]
                    },
                    profession,
                    logo,
                    banner,
                    proof,
                    token
                });

                const JWT = jwt.sign({ id: serviceProviderDoc._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
                await serviceProviderDoc.save();
                res.status(200).json({
                    response: true,
                    data: serviceProviderDoc,
                    token: JWT,
                });
            } else {
                res.status(400).json({
                    response: false,
                    error: `${serviceProvider.name} Already Exists for Phone Number ${userMobile}`,
                });
            }
        }
    } catch (error) {
        
        res.status(400).json({
            response: false,
            error: error.message,
        });
    }
};

module.exports = { auth_user, auth_serviceProvider };
