const CecotecRepeatCleanControlCapability = require("../../../../../lib/robots/cecotec/capabilities/CecotecRepeatCleanControlCapability");
const should = require("should");
const sinon = require("sinon");

describe("CecotecRepeatCleanControlCapability", function () {
    const newCapability = function (isRepeatCleanEnabled) {
        const agnocRobot = {
            device: {config: {props: {isRepeatCleanEnabled: isRepeatCleanEnabled}, get isRepeatCleanEnabled() {
                return this.props.isRepeatCleanEnabled;
            }}},
            sendRecv: sinon.stub().resolves(),
        };

        return {agnocRobot: agnocRobot, capability: new CecotecRepeatCleanControlCapability({robot: {robot: agnocRobot}})};
    };

    it("reads the robot's repeat clean preference", async function () {
        should(await newCapability(true).capability.isEnabled()).be.true();
        should(await newCapability(false).capability.isEnabled()).be.false();
    });

    it("sends the clean preference and reflects it without waiting for the robot", async function () {
        const {agnocRobot, capability} = newCapability(false);

        await capability.enable();

        sinon.assert.calledOnceWithExactly(agnocRobot.sendRecv,
            "USER_SET_DEVICE_CLEANPREFERENCE_REQ", "USER_SET_DEVICE_CLEANPREFERENCE_RSP", {repeatClean: true});
        should(await capability.isEnabled()).be.true();

        await capability.disable();

        sinon.assert.calledWith(agnocRobot.sendRecv.secondCall,
            "USER_SET_DEVICE_CLEANPREFERENCE_REQ", "USER_SET_DEVICE_CLEANPREFERENCE_RSP", {repeatClean: false});
        should(await capability.isEnabled()).be.false();
    });
});
