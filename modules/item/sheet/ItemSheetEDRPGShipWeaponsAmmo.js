import ItemSheetEDRPG from "./ItemSheetEDRPG.js";

export default class ItemSheetEDRPGShipWeaponsAmmo extends ItemSheetEDRPG {
  get template() {
    return "systems/edrpg/templates/items/ship-weapons-ammo.html";
  }


  activateListeners(html) {
    super.activateListeners(html);
  }
}
