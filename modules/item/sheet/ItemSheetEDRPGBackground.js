import ItemSheetEDRPGV2 from "./v2/ItemSheetEDRPGV2.js";
import EDRPG from "../../system/EDRPG.js";

export default class ItemSheetEDRPGBackground extends ItemSheetEDRPGV2 {
  static BODY_TEMPLATE = "systems/edrpg/templates/items/v2/backgrounds.html";

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.backgroundBonusTypes = foundry.utils.duplicate(EDRPG.backgroundBonusTypes);
    return context;
  }

  _enrichmentTargets() {
    const targets = super._enrichmentTargets();
    targets.push("system.backgrounds.bonuses.value");
    return targets;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const el = this.element;
    const bind = (selector, event, handler) => {
      el.querySelectorAll(selector).forEach(node => node.addEventListener(event, handler.bind(this)));
    };
    bind('.bonusEffectCreate', 'click', this._onBonusEffectCreateClick);
    bind('.bonusEffectRemove', 'click', this._onBonusEffectRemoveClick);
    bind('.changeEffectType', 'change', this._onChangeEffectType);
    bind('.changeEffectSkillType', 'change', this._onChangeEffectSkillType);
    bind('.changeEffectSkill', 'change', this._onChangeEffectSkill);
    bind('.changeEffectEnhancement', 'change', this._onChangeEffectEnhancement);
    bind('.changeEffectSkillValue', 'change', this._onChangeEffectSkillValue);
  }

  async _onBonusEffectCreateClick(event) {
    let effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    if (!effects) {
      effects = [];
    }
    const effect = foundry.utils.duplicate(game.edrpg.BackgroundEffect);
    effects.push(effect);
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onBonusEffectRemoveClick(event) {
    if (event) {
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
      event.preventDefault?.();
    }
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects.splice(index, 1);
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onChangeEffectType(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects[index].type = event.target.value;
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onChangeEffectSkillType(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects[index].skillSelect = event.target.value;
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onChangeEffectSkill(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects[index].skillId = event.target.value;
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onChangeEffectEnhancement(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects[index].enhancementId = event.target.value;
    return await this.item.update({ "system.backgrounds.effects": effects });
  }

  async _onChangeEffectSkillValue(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.backgrounds.effects);
    const index = event.target.getAttribute('data-idx');
    effects[index].skillValue = parseInt(event.target.value, 10) || 10;
    return await this.item.update({ "system.backgrounds.effects": effects });
  }
}
