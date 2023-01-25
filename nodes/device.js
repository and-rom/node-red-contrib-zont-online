module.exports = function(RED) {
    function DeviceNode(config) {
        RED.nodes.createNode(this,config);

    };
    RED.nodes.registerType("device",DeviceNode);
}