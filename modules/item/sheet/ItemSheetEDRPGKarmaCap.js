import ItemSheetEDRPGV2 from "./v2/ItemSheetEDRPGV2.js";

export default class ItemSheetEDRPGKarmaCap extends ItemSheetEDRPGV2 {
  static BODY_TEMPLATE = "systems/edrpg/templates/items/v2/karma-capabilities.html";

  _enrichmentTargets() {
    const targets = super._enrichmentTargets();
    targets.push("system.karma.effect.value", "system.karma.prerequisite.value");
    return targets;
  }
}
