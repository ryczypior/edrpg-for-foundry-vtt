import EDRPG from "../../../system/EDRPG.js";
import EDRPGSkillTests from "../../../tests/EDRPGSkillTests.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * Shared ApplicationV2 base for EDRPG actor sheets (replaces the deprecated V1
 * `ActorSheetEDRPG`). Subclasses set `static HEADER_TEMPLATE` / `static BODY_TEMPLATE`
 * and `validItemTypes`; the shared logic lives here.
 *
 * ActorSheetV2 provides drag/drop automatically. Note the V2 signature change:
 * `_onDropItem(event, item)` receives the ALREADY-RESOLVED Item (no fromUuid),
 * and document drops route through `_onDropDocument(event, document)`.
 */
export default class ActorSheetEDRPGV2 extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["edrpgsheet", "edrpg-v2"],
    tag: "form",
    position: { width: 990, height: 800 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false }
  };

  /** Item types this sheet accepts on drop; override in subclasses. */
  validItemTypes = [];

  tabGroups = { primary: "main" };

  /** Per-type templates; override in subclasses. */
  static HEADER_TEMPLATE = null;
  static BODY_TEMPLATE = null;

  _configureRenderParts(options) {
    // Limited (non-owner) view: single minimal body, no header.
    if (!game.user.isGM && this.actor.limited) {
      return { body: { template: "systems/edrpg/templates/sheets/character-limited.html", scrollable: [""] } };
    }
    const parts = {};
    if (this.constructor.HEADER_TEMPLATE) {
      parts.header = { template: this.constructor.HEADER_TEMPLATE };
    }
    parts.body = {
      template: this.constructor.BODY_TEMPLATE ?? "systems/edrpg/templates/sheets/v2/empty-body.html",
      scrollable: [""]
    };
    return parts;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.actor = this.actor;
    context.system = this.actor.system;
    context.editable = this.isEditable;
    context.owner = this.document.isOwner;
    context.activeTab = this.tabGroups.primary;
    context.items = this.actor.items.contents.slice().sort((a, b) => {
      const an = a.name.toLowerCase(), bn = b.name.toLowerCase();
      return an < bn ? -1 : (an > bn ? 1 : 0);
    });
    context.meleeWeaponsTypes = EDRPG.meleeWeaponsTypes;
    context.meleeHands = EDRPG.meleeHands;
    context.socialFactorCap = game.settings.get("edrpg", 'socialFactorCap');
    context.skillsCategories = EDRPG.skillsCategories;
    context.imperialRanks = EDRPG.imperialHonoraryRanks;
    context.federationRanks = EDRPG.federationHonoraryRanks;
    return context;
  }

  /* -------------------------------------------- */
  /*  Rendering / listeners                       */
  /* -------------------------------------------- */

  _onRender(context, options) {
    super._onRender(context, options);
    const el = this.element;
    const bind = (selector, event, handler) => {
      el.querySelectorAll(selector).forEach(node => node.addEventListener(event, handler.bind(this)));
    };
    bind(".changeStatusValue", "change", this._onChangeStatusValue);
    bind(".changeSkillValue", "change", this._onChangeSkillValue);
    bind(".changeCapValue", "change", this._onChangeCapValue);
    bind(".clickChecked", "click", this._onClickChecked);
    bind(".clickRemoveItem", "click", this._onClickRemoveItem);
    bind(".onChangeActiveDescription", "click", this._onChangeActiveDescription);
    bind(".skill-roll", "click", this._onSkillClick);
    bind(".skill-roll-by-internalId", "click", this._onSkillByInternalIDClick);
    bind(".systemSocialFactorSfOtherValue", "change", this._onChangeSocialFactor);
    bind("[name='system.honoraryRanks.federation.value']", "change", this._onChangeFederationRank);
    bind("[name='system.honoraryRanks.imperial.value']", "change", this._onChangeImperialRank);
    bind(".clickCheckedWorn", "click", this._onClickCheckedWorn);
    bind(".clickCheckedEquipped", "click", this._onClickCheckedEquipped);

    // Manual tab switching (toggle .active, no re-render) to keep existing CSS.
    for (const link of el.querySelectorAll('.tabs [data-tab]')) {
      link.addEventListener('click', () => this.#activateTab(link.dataset.tab));
    }
    this.#activateTab(this.tabGroups.primary);
  }

  #activateTab(tab) {
    this.tabGroups.primary = tab;
    const el = this.element;
    for (const link of el.querySelectorAll('.tabs [data-tab]')) {
      link.classList.toggle('active', link.dataset.tab === tab);
    }
    for (const panel of el.querySelectorAll('[id="tab-sections"] .content .tab[data-tab], .tab-sections .content .tab[data-tab]')) {
      panel.classList.toggle('active', panel.dataset.tab === tab);
    }
  }

  /* -------------------------------------------- */
  /*  Drag & drop (V2: resolved documents)        */
  /* -------------------------------------------- */

  async _onDropItem(event, item) {
    if (this.validItemTypes.indexOf(item.type) === -1) {
      ui.notifications.warn(game.i18n.localize('WARN.ItemCannotBeAdded'));
      return null;
    }
    const method = 'add' + item.type.charAt(0).toUpperCase() + item.type.slice(1);
    if (this.actor[method]) {
      await this.actor[method](item);
    }
    return await super._onDropItem(event, item);
  }

  /* -------------------------------------------- */
  /*  Field / skill handlers (ported from V1)     */
  /* -------------------------------------------- */

  async _onChangeStatusValue(event) {
    event.preventDefault();
    const status = foundry.utils.duplicate(this.actor._source.system.status);
    status[event.currentTarget.attributes['data-stateid'].value].value = Number(event.target.value);
    return await this.actor.update({ "system.status": status });
  }

  async _onChangeCapValue(event) {
    event.preventDefault();
    const item = this.actor.items.get(event.currentTarget.attributes['data-skill'].value);
    if (isNaN(event.target.value)) {
      event.target.value = 0;
    }
    return await item.update({ 'system.skill.skillGenius.value': Number(event.target.value) });
  }

  async addSkillValue(skillsToChange) {
    await this.actor.addSkillValue(skillsToChange);
    return this.render();
  }

  async _onChangeSkillValue(event) {
    event.preventDefault();
    const item = this.actor.items.get(event.currentTarget.attributes['data-skill'].value);
    await this.actor.changeSkillValue(item, event.target.value);
    return this.render();
  }

  async _onClickChecked(event) {
    event.preventDefault();
    const item = this.actor.items.get(event.currentTarget.attributes['data-skill'].value);
    return await item.update({ 'system.skill.skillChecked.value': !item.system.skill.skillChecked.value });
  }

  async _onRemoveSkill(event) {
    event.preventDefault();
    const skillId = event.currentTarget.attributes['data-skill'].value;
    const sectionId = event.currentTarget.attributes['data-section'].value;
    await this.actor.removeSkill(skillId, sectionId);
    return this.render();
  }

  async __wearItem(item) {
    try {
      const worn = foundry.utils.duplicate(item._source.system.worn);
      worn.value = true;
      await item.update({ "system.worn": worn });
    } catch (e) {
    }
    await this.actor.calculateSocialFactor();
    return item;
  }

  async __unWearItem(item) {
    try {
      const worn = foundry.utils.duplicate(item._source.system.worn);
      worn.value = false;
      await item.update({ "system.worn": worn });
    } catch (e) {
    }
    await this.actor.calculateSocialFactor();
    return item;
  }

  async _onClickCheckedWorn(event) {
    event.preventDefault();
    const id = event.currentTarget.attributes['data-id'].value;
    const item = this.actor.items.get(id);
    if (!item) {
      ui.notifications.warn("Item not found");
      return null;
    }
    if (item._source.system.worn.value === false) {
      await this.__wearItem(item);
    } else {
      await this.__unWearItem(item);
    }
    return null;
  }

  async _onClickCheckedEquipped(event) {
    event.preventDefault();
    const id = event.currentTarget.attributes['data-id'].value;
    const item = this.actor.items.get(id);
    if (!item) {
      ui.notifications.warn("Item not found");
      return null;
    }
    if (item._source.system.equipped.value === false) {
      await this.__wearItem(item);
    } else {
      await this.__unWearItem(item);
    }
    return null;
  }

  async _onRemoveItem(id) {
    const item = this.actor.items.get(id);
    if (item) {
      await this.__unWearItem(item);
      const method = 'remove' + item.type.charAt(0).toUpperCase() + item.type.slice(1);
      if (!this.actor[method]) {
        return null;
      }
      return await this.actor[method](item);
    }
    return null;
  }

  _onClickRemoveItem(event) {
    event.preventDefault();
    const id = event.currentTarget.attributes['data-id'].value;
    this._onRemoveItem(id);
    this.actor.deleteEmbeddedDocuments("Item", [id]);
  }

  _onChangeActiveDescription(event) {
    event.preventDefault();
    const elements = event.currentTarget.closest('.tablerow').getElementsByClassName("tabledescripion");
    for (const x of elements) {
      x.style.display = x.style.display === 'block' ? 'none' : 'block';
    }
  }

  async _onChangeSocialFactor(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (isNaN(event.target.value)) {
      event.target.value = 0;
    }
    const socialFactor = foundry.utils.duplicate(this.actor._source.system.socialFactor);
    socialFactor.sfOther.value = Number(event.target.value);
    await this.actor.update({ "system.socialFactor": socialFactor });
    return await this.actor.calculateSocialFactor();
  }

  async skillRoll(item) {
    const data = {
      ...item, ...{
        callback: async () => {
          if (!item.system.skill.skillChecked.value) {
            await item.update({ 'system.skill.skillChecked.value': true });
          }
        },
        difficulty: game.settings.get("edrpg", 'defaultDifficultyNumber')
      }
    };
    const roll = new EDRPGSkillTests(data, this.actor);
    return await roll.prepareTest();
  }

  async _onSkillClick(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const item = this.actor.items.get(event.currentTarget.attributes['data-skill'].value);
    if (!item) {
      return null;
    }
    return await this.skillRoll(item);
  }

  async _onSkillByInternalIDClick(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const item = this.actor.items.find((element) => {
      return element.system.internalId.value.toLowerCase() == event.currentTarget.attributes['data-skill'].value.toLowerCase();
    });
    if (!item) {
      return null;
    }
    return await this.skillRoll(item);
  }

  async _onChangeFederationRank(event) {
    const honoraryRanks = foundry.utils.duplicate(this.actor._source.system.honoraryRanks);
    honoraryRanks.federation.socialFactor = EDRPG.federationHonoraryRanks[event.target.value].socialFactor;
    honoraryRanks.federation.unlocks = EDRPG.federationHonoraryRanks[event.target.value].unlocks;
    await this.actor.update({ "system.honoraryRanks": honoraryRanks });
    return await this.actor.calculateSocialFactor();
  }

  async _onChangeImperialRank(event) {
    const honoraryRanks = foundry.utils.duplicate(this.actor._source.system.honoraryRanks);
    honoraryRanks.imperial.socialFactor = EDRPG.imperialHonoraryRanks[event.target.value].socialFactor;
    honoraryRanks.imperial.unlocks = EDRPG.imperialHonoraryRanks[event.target.value].unlocks;
    await this.actor.update({ "system.honoraryRanks": honoraryRanks });
    return await this.actor.calculateSocialFactor();
  }
}
