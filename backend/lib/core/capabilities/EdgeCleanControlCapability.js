const SimpleToggleCapability = require("./SimpleToggleCapability");

/**
 * Cleans along the walls and around obstacles only (edges mode) instead of the whole floor.
 *
 * @template {import("../ValetudoRobot")} T
 * @extends SimpleToggleCapability<T>
 */
class EdgeCleanControlCapability extends SimpleToggleCapability {
    getType() {
        return EdgeCleanControlCapability.TYPE;
    }
}

EdgeCleanControlCapability.TYPE = "EdgeCleanControlCapability";

module.exports = EdgeCleanControlCapability;
