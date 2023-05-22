const fs = require('fs').promises
const path = require('path')
const dir = path.join(__dirname, 'test-conditions.json')
module.exports.isTest = async (req, res) => {
    const data = await fs.readFile(dir, 'utf8');
    res.send({
        response: JSON.parse(data).isTest
    })
}
module.exports.setTest = async (req, res) => {
    const data = await fs.readFile(dir, 'utf8');
    const _data = JSON.parse(data);
    _data.isTest = req.body.isTest;
    const __data = JSON.stringify(_data, null, 2);
    await fs.writeFile(dir, __data);
    res.send({
        response: true
    })
}