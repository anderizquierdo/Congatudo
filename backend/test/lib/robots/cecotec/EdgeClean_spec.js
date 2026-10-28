const capabilities = require("../../../../lib/core/capabilities");
const CecotecCongaRobot = require("../../../../lib/robots/cecotec/CecotecCongaRobot");
const Configuration = require("../../../../lib/Configuration");
const should = require("should");
const sinon = require("sinon");
const ValetudoEventStore = require("../../../../lib/ValetudoEventStore");
const { CloudServer } = require("@agnoc/core");

const EDGES_START = ["DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {ctrlValue: 1, cleanType: 3}];
const EDGES_PAUSE = ["DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {ctrlValue: 2, cleanType: 3}];
const EDGES_STOP = ["DEVICE_AUTO_CLEAN_REQ", "DEVICE_AUTO_CLEAN_RSP", {ctrlValue: 0, cleanType: 3}];

describe("Edges cleanup (Cecotec)", function () {
    let agnocRobot;
    let conga;
    let edges;
    let repeatClean;
    let basicControl;

    beforeEach(function () {
        sinon.stub(Configuration.prototype, "loadConfig");
        sinon.stub(Configuration.prototype, "persist");
        sinon.stub(CloudServer.prototype, "listen");

        agnocRobot = {
            device: {config: {props: {isRepeatCleanEnabled: false}, get isRepeatCleanEnabled() {
                return this.props.isRepeatCleanEnabled;
            }}},
            sendRecv: sinon.stub().resolves(),
            start: sinon.stub().resolves(),
            pause: sinon.stub().resolves(),
            stop: sinon.stub().resolves(),
        };
        sinon.stub(CecotecCongaRobot.prototype, "robot").get(function () {
            return agnocRobot;
        });
        conga = new CecotecCongaRobot({valetudoEventStore: new ValetudoEventStore(), config: new Configuration()});
        edges = conga.capabilities[capabilities.EdgeCleanControlCapability.TYPE];
        repeatClean = conga.capabilities[capabilities.RepeatCleanControlCapability.TYPE];
        basicControl = conga.capabilities[capabilities.BasicControlCapability.TYPE];
    });

    afterEach(function () {
        sinon.restore();
    });

    it("turns double pass off and starts an edges cleanup instead of a full one", async function () {
        await repeatClean.enable();
        await edges.enable();

        should(await edges.isEnabled()).be.true();
        should(await repeatClean.isEnabled()).be.false();

        agnocRobot.sendRecv.resetHistory();
        await basicControl.start();

        sinon.assert.calledWith(agnocRobot.sendRecv,
            "USER_SET_DEVICE_CLEANPREFERENCE_REQ", "USER_SET_DEVICE_CLEANPREFERENCE_RSP", {repeatClean: false});
        sinon.assert.calledWith(agnocRobot.sendRecv, ...EDGES_START);
        sinon.assert.notCalled(agnocRobot.start);
    });

    it("turning double pass on turns edges off before the cleanup starts", async function () {
        await edges.enable();
        await repeatClean.enable();

        should(await edges.isEnabled()).be.false();
    });

    it("pauses and resumes as edges, and turns itself off when stopped", async function () {
        await edges.enable();
        await basicControl.start();
        await basicControl.pause();
        await basicControl.start();

        sinon.assert.calledWith(agnocRobot.sendRecv, ...EDGES_PAUSE);
        sinon.assert.notCalled(agnocRobot.pause);
        sinon.assert.notCalled(agnocRobot.start);

        await basicControl.stop();

        sinon.assert.calledWith(agnocRobot.sendRecv, ...EDGES_STOP);
        sinon.assert.notCalled(agnocRobot.stop);
        should(await edges.isEnabled()).be.false();

        await basicControl.start();
        sinon.assert.calledOnce(agnocRobot.start);
    });

    it("turns itself off when the cleanup ends, but not while it is going on", async function () {
        await edges.enable();
        await basicControl.start();

        conga.onStatusChange("docked", "cleaning");
        conga.onStatusChange("cleaning", "paused");
        should(await edges.isEnabled()).be.true();

        conga.onStatusChange("paused", "cleaning");
        conga.onStatusChange("cleaning", "returning");
        should(await edges.isEnabled()).be.false();
    });

    it("stays on while armed and the robot sits in the dock", async function () {
        await edges.enable();

        conga.onStatusChange("returning", "docked");
        should(await edges.isEnabled()).be.true();
    });
});
