const BasicControlCapability = require("../../../core/capabilities/BasicControlCapability");

/**
 * @extends BasicControlCapability<import("../CecotecCongaRobot")>
 */
module.exports = class CecotecBasicControlCapability extends BasicControlCapability {
    async start() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.applyCleaningOptions();
        if (this.robot.edgeClean !== "off") {
            // Also resumes a paused edges cleanup: agnoc's start() would resume it as a full one
            await this.robot.startEdgeClean();
        } else {
            await this.robot.robot.start();
        }
    }

    async stop() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        if (this.robot.edgeClean === "started") {
            await this.robot.stopEdgeClean();
        } else {
            this.robot.edgeClean = "off";
            await this.robot.robot.stop();
        }
    }

    async pause() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        if (this.robot.edgeClean === "started") {
            await this.robot.pauseEdgeClean();
        } else {
            await this.robot.robot.pause();
        }
    }

    async home() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.home();
    }
};
