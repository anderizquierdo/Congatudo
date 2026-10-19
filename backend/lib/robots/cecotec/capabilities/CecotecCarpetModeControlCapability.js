const CarpetModeControlCapability = require("../../../core/capabilities/CarpetModeControlCapability");

/**
 * @extends CarpetModeControlCapability<import("../CecotecCongaRobot")>
 */
class CecotecCarpetModeControlCapability extends CarpetModeControlCapability {
    /**
     * This function polls the current carpet mode state and stores the attributes in our robostate
     *
     * @abstract
     * @returns {Promise<boolean>}
     */
    async isEnabled() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        return this.robot.getCleaningOptions().carpetMode ?? this.robot.robot.device.config?.isCarpetModeEnabled ?? false;
    }

    /**
     * @abstract
     * @returns {Promise<void>}
     */
    async enable() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.setCarpetMode(true);
        this.robot.setCleaningOption("carpetMode", true);
    }

    /**
     * @abstract
     * @returns {Promise<void>}
     */
    async disable() {
        if (!this.robot.robot) {
            throw new Error("There is no robot connected to server");
        }

        await this.robot.robot.setCarpetMode(false);
        this.robot.setCleaningOption("carpetMode", false);
    }
}

module.exports = CecotecCarpetModeControlCapability;
