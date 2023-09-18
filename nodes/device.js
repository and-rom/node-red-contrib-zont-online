var rp = require('request-promise');

module.exports = function(RED) {

    function DeviceNode(config) {
        RED.nodes.createNode(this,config);

        let node = this;

        node.account = RED.nodes.getNode(config.account);
        node.device_id = config.device_id;

        this.on('input', (msg, send, done) => {
            send = send || function() { node.send.apply(node,arguments) }

            console.log('msg: ', msg);
            console.log('node: ', node);

            msg.payload = getDevice(node.account.credentials.email, node.account.credentials.token, node.device_id);
            send(msg);

            console.log('done');
            if (done) {done();}
        });

    };

    RED.nodes.registerType("device",DeviceNode);

    async function getDevice(email, token, device_id) {
        console.log('getDevice');
        let options = {
            method: 'POST',
            url: 'https://zont-online.ru/api/devices',
            headers: {
                'Content-Type': 'application/json',
                'X-ZONT-Client': email,
                'X-ZONT-Token': token
            },
            json: true
        };

        let result = await rp(options)
        .then(function(response) {
            console.log('then');
            let device = response.devices.filter(device => {device.id === device_id});
            return {"ok": true, "device": device};
        })
        .catch(function (error) {
            console.log('catch');
            return {"ok": false};
        });

        return result;
    }

}