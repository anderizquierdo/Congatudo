const RepeatCleanControlCapability = require("../../../core/capabilities/RepeatCleanControlCapability");

/**
 * The robot turns repeat clean off when a cleanup ends, so the user's choice is remembered
 * and sent again before every cleanup (see CecotecCongaRobot.applyCleaningOptions).
 *
 * @extends RepeatCleanControlCapability<import("../CecotecCongaRobot")>
 */
class CecotecRepeatCleanControlCapability extends RepeatCleanControlCapability {
    /**
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        return this.robot.getCleaningOptions().repeatClean ?? this.robot.robot.device.config?.isRepeatCleanEnabled ?? false;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.robot.setRepeatClean(true);
        this.robot.setCleaningOption("repeatClean", true);
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        await this.robot.setRepeatClean(false);
        this.robot.setCleaningOption("repeatClean", false);
    }
}

module.exports = CecotecRepeatCleanControlCapability;
