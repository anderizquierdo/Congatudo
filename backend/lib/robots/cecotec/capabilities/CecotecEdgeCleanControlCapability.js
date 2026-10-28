const EdgeCleanControlCapability = require("../../../core/capabilities/EdgeCleanControlCapability");

/**
 * Makes the next full cleanup an edges cleanup. It is a one-shot choice: it is not remembered and
 * turns itself off when the cleanup is stopped or ends (see CecotecCongaRobot.edgeClean).
 *
 * @extends EdgeCleanControlCapability<import("../CecotecCongaRobot")>
 */
class CecotecEdgeCleanControlCapability extends EdgeCleanControlCapability {
    /**
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        return this.robot.edgeClean !== "off";
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.robot.setEdgeClean(true);
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        await this.robot.setEdgeClean(false);
    }
}

module.exports = CecotecEdgeCleanControlCapability;
