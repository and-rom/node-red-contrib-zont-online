module.exports = function(RED) {
    function DeviceOutNode(config) {
        RED.nodes.createNode(this,config);
        // node-specific code goes here

    }
    RED.nodes.registerType("device-out",DeviceOutNode);
}