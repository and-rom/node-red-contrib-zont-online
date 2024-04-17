var rp = require('request-promise');

module.exports = function(RED) {

    function AccountNode(config) {
        RED.nodes.createNode(this, config);

        let node = this;
        node.devices = config.devices;
    }

    RED.nodes.registerType("zont-account", AccountNode, {
            credentials: {
                email: {type:"text"},
                token: {type:"text"}
            },
            devices: {}
        });

    RED.httpAdmin.get("/zont-devices/:id", RED.auth.needsPermission('account.read'), function(req, res) {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            if (req.query.remote) {
                (async () => {
                    let result = await getDevices(node.credentials.email, node.credentials.token);
                    res.json(result);
                })();
            } else {
                res.json({"ok": true, "devices": node.devices});
            }
        } else {
            res.json({"ok": false});
        }
    });

    async function getDevices(email, token) {
        let options = {
            method: 'POST',
            url: 'https://lk.zont-online.ru/api/devices',
            headers: {
                'Content-Type': 'application/json',
                'X-ZONT-Client': email,
                'X-ZONT-Token': token
            },
            json: true
        };

        let result = await rp(options)
        .then(function(response) {
            let devices = response.devices.map(({id, name}) => ({id, name}));
            return {"ok": true, "devices": devices};
        })
        .catch(function (error) {
            return {"ok": false};
        });

        return result;
    }

}