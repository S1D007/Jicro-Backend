const User = require("../db/models/User.model");
const axios = require('axios');
const ServiceProvider = require("../db/models/ServiceProvider.model");
const jwt = require("jsonwebtoken");

const auth_user = async (req, res) => {
    try {
        const { waId, address, long, lat, token, test_num } = req.body;
        const config = {
            headers: {
                'clientId': 'lytvflbj',
                'clientSecret': 'eepo0q116dir3603',
                'Content-Type': 'application/json',
            },
        };

        let userMobile, userName, UserData;

        if (!test_num) {
            const { data } = await axios.post('https://jicro.authlink.me', { waId }, config);
            ({ userMobile, userName } = data.data);
            UserData = await User.findOne({ phone_number: userMobile });
        } else {
            const test_user = await User.findOne({ phone_number: test_num })
            const JWT = jwt.sign({ id: test_user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.status(200).json({
                response: true,
                user: test_user,
                token: JWT,
            });
        }

        if (UserData) {
            if (!test_num) {
                await User.findOneAndUpdate({ phone_number: userMobile }, { $set: { token } });
            }
        } else if (!test_num && !UserData) {
            const user = new User({
                phone_number: userMobile,
                name: userName,
                location: {
                    address_formated: address,
                    coordinates: [long, lat]
                },
                token
            });

            await user.save();
            UserData = user;
        }

        const JWT = jwt.sign({ id: UserData._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.status(200).json({
            response: true,
            user: UserData,
            token: JWT,
        });
    } catch (error) {
        console.log(error)
        // res.status(400).json({
        //     response: false,
        //     error: error.message,
        // });
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
