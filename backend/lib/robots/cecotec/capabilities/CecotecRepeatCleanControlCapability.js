const RepeatCleanControlCapability = require("../../../core/capabilities/RepeatCleanControlCapability");

/**
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

        return this.robot.robot.device.config?.isRepeatCleanEnabled || false;
    }

    /**
     * @returns {Promise<void>}
     */
    async enable() {
        await this.setRepeatClean(true);
    }

    /**
     * @returns {Promise<void>}
     */
    async disable() {
        await this.setRepeatClean(false);
    }

    /**
     * Agnoc reads repeatClean but has no setter for it (unlike setCarpetMode), so send the
     * clean preference directly and update the cached device config the same way it does.
     *
     * @private
     * @param {boolean} enable
     * @returns {Promise<void>}
     */
    async setRepeatClean(enable) {
        const agnocRobot = this.robot.robot;

        if (!agnocRobot) {
            throw new Error("There is no robot connected to server");
        }

        await agnocRobot.sendRecv("USER_SET_DEVICE_CLEANPREFERENCE_REQ", "USER_SET_DEVICE_CLEANPREFERENCE_RSP", {
            repeatClean: enable
        });

        if (agnocRobot.device.config) {
            // @ts-expect-error props is protected; agnoc's own update*() setters write it the same way
            agnocRobot.device.config.props.isRepeatCleanEnabled = enable;
        }
    }
}

module.exports = CecotecRepeatCleanControlCapability;
