import ActorSheetEDRPGV2 from "./v2/ActorSheetEDRPGV2.js";

export default class ActorSheetEDRPGCharacter extends ActorSheetEDRPGV2 {
  static HEADER_TEMPLATE = "systems/edrpg/templates/sheets/v2/character-header.html";
  static BODY_TEMPLATE = "systems/edrpg/templates/sheets/v2/character-body.html";

  validItemTypes = [
    'Backgrounds',
    'Enhancements',
    'Karma Capabilities',
    'Armour',
    'Cybernetics',
    'General Equipment',
    'Ranged Weapons',
    'Melee Weapons',
    'Ammo Clips',
    'Wearables',
    'Skills',
  ];

  async _checkRankPoints() {
    let status = foundry.utils.duplicate(this.actor.system.status);
    let currentPoints = status.rankPoints.value;
    for (let rankIndex of Object.keys(game.edrpg.config.ranks)) {
      const rank = game.edrpg.config.ranks[rankIndex];
      if (currentPoints >= rank.minRankPoints && (currentPoints <= rank.maxRankPoints || rank.maxRankPoints === null)) {
        status.rank.value = rank;
      }
    }
    return await this.actor.update({ "system.status": status });
  }

  async _onChangeStatusValue(event) {
    // Capture before awaiting: native event.currentTarget is nulled once the
    // event finishes dispatching (i.e. after the first await).
    const stateId = event.currentTarget?.attributes['data-stateid']?.value;
    let ret = await super._onChangeStatusValue(event);
    if (stateId === 'rankPoints') {
      ret = await this._checkRankPoints();
    }
    return ret;
  }

  async _onDropBackgrounds(item) {
    return await this.actor.addBackgrounds(item);
  }

  async _onRemoveBackgrounds(item) {
    return await this.actor.removeBackgrounds(item);
  }
}
