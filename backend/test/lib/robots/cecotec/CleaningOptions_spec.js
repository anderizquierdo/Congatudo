const capabilities = require("../../../../lib/core/capabilities");
const CecotecCongaRobot = require("../../../../lib/robots/cecotec/CecotecCongaRobot");
const Configuration = require("../../../../lib/Configuration");
const should = require("should");
const sinon = require("sinon");
const ValetudoEventStore = require("../../../../lib/ValetudoEventStore");
const { CloudServer } = require("@agnoc/core");

describe("Remembered cleaning options (Cecotec)", function () {
    let agnocRobot;
    let conga;

    beforeEach(function () {
        sinon.stub(Configuration.prototype, "loadConfig");
        sinon.stub(Configuration.prototype, "persist");
        sinon.stub(CloudServer.prototype, "listen");

        agnocRobot = {
            device: {config: {props: {isRepeatCleanEnabled: false}, get isRepeatCleanEnabled() {
                return this.props.isRepeatCleanEnabled;
            }}},
            sendRecv: sinon.stub().resolves(),
            setFanSpeed: sinon.stub().resolves(),
            setWaterLevel: sinon.stub().resolves(),
            start: sinon.stub().resolves(),
        };
        sinon.stub(CecotecCongaRobot.prototype, "robot").get(function () {
            return agnocRobot;
        });
        conga = new CecotecCongaRobot({valetudoEventStore: new ValetudoEventStore(), config: new Configuration()});
    });

    afterEach(function () {
        sinon.restore();
    });

    it("sends double pass, fan speed and water level again before a cleanup, after the robot reset them", async function () {
        await conga.capabilities[capabilities.RepeatCleanControlCapability.TYPE].enable();
        await conga.capabilities[capabilities.FanSpeedControlCapability.TYPE].selectPreset("low");
        await conga.capabilities[capabilities.WaterUsageControlCapability.TYPE].selectPreset("off");

        // The robot forgets them when a cleanup ends
        agnocRobot.device.config.props.isRepeatCleanEnabled = false;
        agnocRobot.sendRecv.resetHistory();
        agnocRobot.setFanSpeed.resetHistory();
        agnocRobot.setWaterLevel.resetHistory();

        should(await conga.capabilities[capabilities.RepeatCleanControlCapability.TYPE].isEnabled()).be.true();
        should(conga.getIntensityState(agnocRobot).value).equal("low");
        should(conga.getWaterUsageState(agnocRobot).value).equal("off");

        await conga.capabilities[capabilities.BasicControlCapability.TYPE].start();

        sinon.assert.calledWith(agnocRobot.sendRecv,
            "USER_SET_DEVICE_CLEANPREFERENCE_REQ", "USER_SET_DEVICE_CLEANPREFERENCE_RSP", {repeatClean: true});
        should(agnocRobot.setFanSpeed.firstCall.args[0].value).equal("low");
        should(agnocRobot.setWaterLevel.firstCall.args[0].value).equal("off");
        sinon.assert.callOrder(agnocRobot.sendRecv, agnocRobot.setFanSpeed, agnocRobot.setWaterLevel, agnocRobot.start);
    });

    it("still starts the cleanup when an option cannot be applied", async function () {
        await conga.capabilities[capabilities.RepeatCleanControlCapability.TYPE].enable();
        agnocRobot.sendRecv.rejects(new Error("timeout"));

        await conga.capabilities[capabilities.BasicControlCapability.TYPE].start();

        sinon.assert.calledOnce(agnocRobot.start);
    });
});
