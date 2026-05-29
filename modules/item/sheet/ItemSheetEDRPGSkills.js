import ItemSheetEDRPGV2 from "./v2/ItemSheetEDRPGV2.js";
import EDRPG from "../../system/EDRPG.js";

export default class ItemSheetEDRPGSkills extends ItemSheetEDRPGV2 {
  static BODY_TEMPLATE = "systems/edrpg/templates/items/v2/skill.html";

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.skillsCategories = foundry.utils.duplicate(EDRPG.skillsCategories);
    return context;
  }
}
