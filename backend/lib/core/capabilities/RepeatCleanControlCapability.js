const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * Cleans everything twice: when the first pass ends, the robot starts the second one
 * from where it is instead of returning to the dock.
 *
 * @template {import("../ValetudoRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class RepeatCleanControlCapability extends SimpleToggleCapability {
    getType() {
        return RepeatCleanControlCapability.TYPE;
    }
}

RepeatCleanControlCapability.TYPE = "RepeatCleanControlCapability";

module.exports = RepeatCleanControlCapability;
