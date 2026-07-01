import EDRPGUtils from "../system/EDRPGUtils";
import EDRPG from "../system/EDRPG";
import EDRPGSkillTests from "../tests/EDRPGSkillTests";

export default class ActorEDRPG extends Actor {

  speakerData(token) {
    if (this.isToken || token) {
      return {
        token: token?.id || this.token.id,
        scene: token?.parent.id || this.token.parent.id
      }
    }
    return {
      actor: this.id,
      token: token?.id,
      scene: token?.parent.id
    }
  }

  findSkillByInternalId(internalId, context = null) {
    if(!context) {
      context = this;
    }
    for (let item of context.items) {
      if (item.system.internalId.value && item.system.internalId.value.toLowerCase() === internalId.toLowerCase() && item.type.toLowerCase() === 'skills') {
        return item;
      }
    }
    return null;
  }

  findItemByInternalId(internalId, context = null) {
    if(!context) {
      context = this;
    }
    for (let item of context.items) {
      if (item.system.internalId.value && item.system.internalId.value.toLowerCase() === internalId.toLowerCase()) {
        return item;
      }
    }
    return null;
  }

  /**
   * Expose extra roll data for the Combat Tracker initiative formula.
   * Initiative is rolled as 1d10 + the Tactics skill bonus (a decimal/tens value),
   * with no difficulty level. The bonus is read live from the Tactics skill and
   * falls back to the stored value, defaulting to 0 for actors without that skill.
   */
  getRollData() {
    const data = super.getRollData() ?? {};
    const tactics = this.findSkillByInternalId('tactics');
    const bonus = tactics
      ? Number(tactics.system?.skill?.skillBonus?.value)
      : Number(this.system?.status?.initiative?.value);
    data.initiativeBonus = Number.isFinite(bonus) ? bonus : 0;
    return data;
  }


  async updateMainAttributes() {
    const dodge = this.findSkillByInternalId('dodge');
    const initiative = this.findSkillByInternalId('tactics');
    const parry = this.findSkillByInternalId('parry');
    const updateAttributes = {};
    if (dodge) {
      updateAttributes['system.status.dodge.value'] = dodge.system.skill.skillBonus.value;
    }
    if (parry) {
      updateAttributes['system.status.parry.value'] = parry.system.skill.skillBonus.value;
    }
    if (initiative) {
      updateAttributes['system.status.initiative.value'] = initiative.system.skill.skillBonus.value;
    }
    return await this.update(updateAttributes);
  }

  async changeSkillValue(item, value) {
    value = Number(value);
    let maxCap = Number(item.system.skill.skillGenius.value) + Number(this._source.system.status.rank.value.skillCap);
    /* maximum cap cannot be more than 100 */
    if (maxCap > 100) {
      maxCap = 100;
    }
    if (value > maxCap) {
      ui.notifications.warn(game.i18n.format('WARN.MaxCapWarning', {
        maxCap: maxCap,
        skillValue: value,
        skillName: item.name,
      }));
      value = maxCap;
    }
    if (value < 0) {
      value = 0;
    }
    const updates = {
      'system.skill.skillScoreStart.value': value,
      'system.skill.skillBonus.value': Math.floor(value / 10),
    };
    await item.update(updates);
    await this.updateMainAttributes()
    for (let actor of game.actors) {
      if(actor.system.pilot && actor.system.pilot._id === this._id){
        await actor.update({
          'system.pilot': this
        });
      }
    }
    return true;
  }

  async addSkillValue(skillsToChange) {
    for (const element of skillsToChange) {
      const item = this.findSkillByInternalId(element.skillId);
      if (item && item.system) {
        let maxCap = Number(item.system.skill.skillGenius.value) + Number(this._source.system.status.rank.value.skillCap);
        let skillValue = item.system.skill.skillScoreStart.value + Number(element.skillValue);
        if (skillValue > maxCap) {
          ui.notifications.warn(game.i18n.format('WARN.MaxCapWarning', {
            maxCap: maxCap,
            skillValue: skillValue,
            skillName: item.name,
          }));
          skillValue = maxCap;
        } else if (skillValue < 0) {
          skillValue = 0;
        }
        await item.update({
          'system.skill.skillScoreStart.value': skillValue,
          'system.skill.skillBonus.value': Math.floor(skillValue / 10),
        });
      }
    }
    //return await this.updateMainAttributes();
  }

  async addBackgrounds(item) {
    const effects = item.system.backgrounds.effects;
    const skills = [];
    if (effects && effects.length) {
      effects.forEach(effect => {
        if (effect.type === 'skill') {
          skills.push(effect);
        }
        /** @todo other types! **/
      });
    }
    if (skills.length > 0) {
      await this.addSkillValue(skills);
    }
    return true;
  }

  async removeBackgrounds(item) {
    const effects = item.system.backgrounds.effects;
    const skills = [];
    if (effects && effects.length) {
      effects.forEach(effect => {
        if (effect.type === 'skill') {
          skills.push({skillId: effect.skillId, skillValue: -effect.skillValue});
        }
        /** @todo other types! **/
      });
    }
    if (skills.length > 0) {
      await this.addSkillValue(skills);
    }
    return true;
  }

  async calculateSocialFactor() {
    const socialFactor = foundry.utils.duplicate(this._source.system.socialFactor);
    const cap = parseInt(game.settings.get("edrpg", 'socialFactorCap'), 10);
    socialFactor.sfWornItems.value = 0;
    this.items.forEach(item => {
      socialFactor.sfWornItems.value += item.socialFactor;
    });
    socialFactor.sfHonoraryRanks.value = parseInt(this._source.system.honoraryRanks.imperial.socialFactor, 10) + parseInt(this._source.system.honoraryRanks.federation.socialFactor, 10);
    socialFactor.sfTotal.value = parseInt(socialFactor.sfOther.value, 10) + parseInt(socialFactor.sfHonoraryRanks.value, 10) + parseInt(socialFactor.sfWornItems.value, 10);
    if (cap > 0 && cap < socialFactor.sfTotal.value) {
      socialFactor.sfTotal.value = cap;
    }
    return await this.update({"system.socialFactor": socialFactor});
  }

  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    let items = this.items.map((i) => i.toObject())
    if (['Character', 'NPC'].indexOf(this.type) !== -1) {
      const skills = await EDRPGUtils.findItemsByType('Skills');
      for (let idx in skills) {
        let object = foundry.utils.duplicate(skills[idx]);
        items.push(object);
      }
      await this.updateSource({items});
    }
    if (['Ship', 'Vehicle'].indexOf(this.type) !== -1) {
      this.updateSource({pilot: null});
    }
  }

  async _onCreateShipData(data, options, user){
  }

  async _onCreateCharacterData(data, options, user){
    const pilotTrained = await EDRPGUtils.findItemByInternalID('PILOT TRAINED', 'Backgrounds');
    if (pilotTrained) {
      let items = this.items.map((i) => i.toObject())
      let object = pilotTrained.toObject();
      object.system.removable.value = false;
      object.system.backgrounds.choices.value = 0;
      items.push(object);
      await this.update({items});
      await this.addBackgrounds(pilotTrained);
    }
    const escapeDeath = await EDRPGUtils.findItemByInternalID('ESCAPE DEATH', 'Karma Capabilities');
    if (escapeDeath) {
      let items = this.items.map((i) => i.toObject())
      let object = escapeDeath.toObject();
      object.system.removable.value = false;
      items.push(object);
      await this.update({items});
    }
    const fighting = await EDRPGUtils.findItemByInternalID('Fighting', 'Melee Weapons');
    if (fighting) {
      let items = this.items.map((i) => i.toObject())
      let object = fighting.toObject();
      object.system.removable.value = false;
      items.push(object);
      await this.update({items});
    }
    return await this.updateMainAttributes();
  }

  async _onCreate(data, options, user) {
    await super._onCreate(data, options, user);
    /** Add default items */
    if (['Ship'].indexOf(this.type) !== -1) {
      await this._onCreateShipData(data, options, user);
    }
    if (['Character', 'NPC'].indexOf(this.type) !== -1) {
      await this._onCreateCharacterData(data, options, user);
    }
  }


  prepareBaseData() {
    super.prepareBaseData();
  }
}
