var rp = require('request-promise');

module.exports = function(RED) {

    function DeviceNode(config) {
        RED.nodes.createNode(this,config);

        let node = this;

        node.account = RED.nodes.getNode(config.account);
        node.device_id = config.device_id;

        this.on('input', async (msg, send, done) => {
            send = send || function() { node.send.apply(node,arguments) }
            switch (msg.payload) {
                case "get":
                    msg.payload = await getDevice(node.account.credentials.email,
                                                  node.account.credentials.token,
                                                  parseInt(node.device_id),
                                                  typeof msg.load_io == 'boolean' ? msg.load_io : false);
                    break;
                case "set":
                    msg.payload = "not implemented yet"
                    break;
                default:
                    msg.payload = "no request type specified"
                    break;
            }
            send(msg);

            if (done) {done();}
        });

    };

    RED.nodes.registerType("zont-device",DeviceNode);

    async function getDevice(email, token, device_id, load_io = false) {
        let options = {
            method: 'POST',
            url: 'https://my.zont.online/api/devices',
            headers: {
                'Content-Type': 'application/json',
                'X-ZONT-Client': email,
                'X-ZONT-Token': token
            },
            body: {
                load_io: load_io
            },
            json: true
        };

        let result = await rp(options)
        .then(function(response) {
            let device = response.devices.find(device => device.id === device_id);
            return {"ok": true, "device": device};
        })
        .catch(function (error) {
            return {"ok": false, "error": error};
        });

        return result;
    }

}