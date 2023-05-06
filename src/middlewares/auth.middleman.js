const { client } = require("../config/redisConnect")
const axios = require("axios");
module.exports = async function check(req, res, next) {
    console.log(req.body)
    const { waId } = req?.body
    const config = {
        headers: {
            'clientId': 'lytvflbj',
            'clientSecret': 'eepo0q116dir3603',
            'Content-Type': 'application/json',
        },
    };

    await axios.post('https://jicro.authlink.me', {
        waId
    }, config).then(async (data) => {
        client.keys(`*${data.data.data.userMobile}*`).then(async (keys) => {
            if (!keys === []) {
                const key = keys[0];
                client.get(key).then((e) => {
                    if (!e) {
                        res.status(400).json({
                            response: false,
                            error: err, 
                        });
                    } else {
                        res.status(200).json({
                            response: true,
                            user: value,
                        });
                    }
                })
            } else {
                next()
            }
        })
    }).catch((error) => {
        res.status(400).json({
            response: false,
            error: error.message,
        });
    })
}