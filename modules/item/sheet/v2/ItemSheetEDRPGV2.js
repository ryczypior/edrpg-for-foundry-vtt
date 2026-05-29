import EDRPG from "../../../system/EDRPG.js";
import EDRPGUtils from "../../../system/EDRPGUtils.js";
import { getTextEditor } from "../../../system/compat.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

/**
 * Shared ApplicationV2 base for all EDRPG item sheets (replaces the deprecated
 * V1 `ItemSheetEDRPG`). Subclasses normally only set `static BODY_TEMPLATE`; the
 * header and all shared logic live here.
 *
 * V1 -> V2 notes:
 *   getData()            -> _prepareContext()
 *   _handleEnrichment()  -> #enrich() driven by overridable _enrichmentTargets()
 *   activateListeners()  -> _onRender() with native DOM listeners
 *   data-edit img        -> built-in `editImage` action (DocumentSheetV2)
 *   {{editor}}           -> <prose-mirror> (in the shared partials)
 *   form submit          -> form.submitOnChange (named inputs, no _updateObject)
 */
export default class ItemSheetEDRPGV2 extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["edrpgitemsheet", "edrpg-v2"],
    tag: "form",
    position: { width: 900, height: 500 },
    window: { resizable: true },
    form: { submitOnChange: true, closeOnSubmit: false }
  };

  /** Shared header part; subclasses provide the body via `static BODY_TEMPLATE`. */
  static PARTS = {
    header: { template: "systems/edrpg/templates/items/partials/item-all-header.html" },
    body: { template: "systems/edrpg/templates/items/v2/empty-body.html", scrollable: [""] }
  };

  /** Per-type body template; override in subclasses. */
  static BODY_TEMPLATE = null;

  tabGroups = { primary: "main" };

  _configureRenderParts(options) {
    const parts = super._configureRenderParts(options);
    if (this.constructor.BODY_TEMPLATE) {
      parts.body = { template: this.constructor.BODY_TEMPLATE, scrollable: [""] };
    }
    return parts;
  }

  get isGM() {
    return game.user.isGM;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.isGM = this.isGM;
    context.editable = this.isEditable;
    context.owner = this.document.isOwner;
    context.activeTab = this.tabGroups.primary;

    context.rangedWeaponsTypes = foundry.utils.duplicate(EDRPG.rangedWeaponsTypes);
    context.meleeWeaponsTypes = foundry.utils.duplicate(EDRPG.meleeWeaponsTypes);
    context.meleeHands = foundry.utils.duplicate(EDRPG.meleeHands);
    context.shipComponentClasses = EDRPG.shipComponentClasses;
    context.shipComponentTypes = EDRPG.shipComponentTypes;
    context.shipWeaponsSizes = EDRPG.shipWeaponsSizes;
    context.shipWeaponsMountTypes = EDRPG.shipWeaponsMountTypes;
    context.skills = await this.#buildSkills();
    context.ammoClips = await EDRPGUtils.findItemsByType('Ammo Clips');
    context.enhancements = await EDRPGUtils.findItemsByType('Enhancements');
    context.enrichment = await this.#enrich();
    return context;
  }

  async #buildSkills() {
    const skills = foundry.utils.duplicate(EDRPG.skillsCategories);
    const skillItems = await EDRPGUtils.findItemsByType('Skills');
    if (skillItems) {
      for (const key of Object.keys(skillItems)) {
        const skill = skillItems[key];
        if (!skill.system.internalId.value || skill.system.internalId.value === "") continue;
        const category = skill.system.skill.skillCategory.value;
        if (!skills[category]) skills[category] = { skills: {} };
        skills[category].skills[skill.system.internalId.value] = {
          "type": "Number",
          "label": skill.name,
          "description": skill.system.details.description.value,
          "initial": skill.system.skill.skillScoreStart.value,
          "isChecked": 0,
          "value": skill.system.skill.skillScoreStart.value,
          "bonus": Math.floor(skill.system.skill.skillScoreStart.value / 10),
          "maxCapModifier": 0
        };
      }
    }
    return skills;
  }

  /**
   * Source paths (dotted) of rich-text fields to enrich. Override in subclasses
   * to add type-specific fields (karma, backgrounds, …).
   */
  _enrichmentTargets() {
    const s = this.item.system;
    const targets = [];
    if (s.details?.description) targets.push("system.details.description.value");
    if (s.details?.gmdescription) targets.push("system.details.gmdescription.value");
    if (s.notes) targets.push("system.notes.value");
    return targets;
  }

  async #enrich() {
    const TextEditor = getTextEditor();
    const out = {};
    for (const path of this._enrichmentTargets()) {
      const raw = foundry.utils.getProperty(this.item, path) ?? "";
      out[path] = await TextEditor.enrichHTML(raw, { async: true });
    }
    return foundry.utils.expandObject(out);
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
    bind('.discreet', 'change', this._onDiscreetChange);
    bind('.destroyCover', 'change', this._onDestroyCoverChange);
    bind('.directFireExplosive', 'change', this._onDirectFireExplosiveChange);
    bind('.divideFire', 'change', this._onDivideFireChange);
    bind('.isTwoHanded', 'change', this._onIsTwoHandedChange);
    bind('.rangedWeaponDamage', 'change', this._onRangedDamageChange);
    bind('.absorbToxic', 'change', this._onAbsorbToxicChange);
    bind('.isWearable', 'change', this._onIsWearableChange);
    bind('.effectCreate', 'click', this._onEffectCreateClick);
    bind('.effectRemove', 'click', this._onEffectRemoveClick);
    bind('.changeEffect', 'change', this._onChangeEffect);
    bind('.changeEffectValue', 'change', this._onChangeEffectValue);

    // Manual tab switching (toggle .active, no re-render to preserve editor state).
    // Works with the V1 tab markup (no data-group needed).
    for (const link of el.querySelectorAll('.tabs [data-tab]')) {
      link.addEventListener('click', () => this.#activateTab(link.dataset.tab));
    }
    // Set the initial active tab (V1 content panels have no `.active` class).
    this.#activateTab(this.tabGroups.primary);
  }

  #activateTab(tab) {
    this.tabGroups.primary = tab;
    const el = this.element;
    for (const link of el.querySelectorAll('.tabs [data-tab]')) {
      link.classList.toggle('active', link.dataset.tab === tab);
    }
    for (const panel of el.querySelectorAll('.tab-sections .content .tab[data-tab]')) {
      panel.classList.toggle('active', panel.dataset.tab === tab);
    }
  }

  /* -------------------------------------------- */
  /*  Field handlers (ported from V1 base)        */
  /* -------------------------------------------- */

  async _onDiscreetChange(event) {
    const armour = foundry.utils.duplicate(this.item._source.system.armour);
    armour.discreet.value = event.target.checked;
    return await this.item.update({ "system.armour": armour });
  }

  async _onIsWearableChange(event) {
    const wearable = foundry.utils.duplicate(this.item._source.system.wearable);
    wearable.value = event.target.checked;
    return await this.item.update({ "system.wearable": wearable });
  }

  async _onAbsorbToxicChange(event) {
    const armour = foundry.utils.duplicate(this.item._source.system.armour);
    armour.absorbToxic.value = event.target.checked;
    return await this.item.update({ "system.armour": armour });
  }

  async _onEffectCreateClick(event) {
    let effects = { value: [] };
    if (this.item._source.system.effects) {
      effects = foundry.utils.duplicate(this.item._source.system.effects);
    }
    const effect = foundry.utils.duplicate(game.edrpg.ItemEffect);
    effects.value.push(effect);
    return await this.item.update({ "system.effects": effects });
  }

  async _onEffectRemoveClick(event) {
    if (event) {
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
      event.preventDefault?.();
    }
    const effects = foundry.utils.duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value.splice(index, 1);
    return await this.item.update({ "system.effects": effects });
  }

  async _onChangeEffect(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value[index].skillId = event.target.value;
    return await this.item.update({ "system.effects": effects });
  }

  async _onChangeEffectValue(event) {
    const effects = foundry.utils.duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value[index].skillValue = parseInt(event.target.value, 10) || 10;
    return await this.item.update({ "system.effects": effects });
  }

  async _onDestroyCoverChange(event) {
    const rangedWeapons = foundry.utils.duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.destroyCover.value = event.target.checked;
    return await this.item.update({ "system.rangedWeapons": rangedWeapons });
  }

  async _onDivideFireChange(event) {
    const rangedWeapons = foundry.utils.duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.divideFire.value = event.target.checked;
    return await this.item.update({ "system.rangedWeapons": rangedWeapons });
  }

  async _onDirectFireExplosiveChange(event) {
    const rangedWeapons = foundry.utils.duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.directFireExplosive.value = event.target.checked;
    return await this.item.update({ "system.rangedWeapons": rangedWeapons });
  }

  async _onIsTwoHandedChange(event) {
    const rangedWeapons = foundry.utils.duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.isTwoHanded.value = event.target.checked;
    return await this.item.update({ "system.rangedWeapons": rangedWeapons });
  }

  async _onRangedDamageChange(event) {
    const rangedWeapons = foundry.utils.duplicate(this.item._source.system.rangedWeapons);
    const setIfEmpty = (key, selectorName) => {
      if (EDRPGUtils.isEmpty(rangedWeapons[key].value)) {
        rangedWeapons[key].value = event.target.value;
        const field = this.element.querySelector(`[name="system.rangedWeapons.${selectorName}.value"]`);
        if (field) field.value = event.target.value;
      }
    };
    setIfEmpty('shortRangeDamage', 'shortRangeDamage');
    setIfEmpty('mediumRangeDamage', 'mediumRangeDamage');
    setIfEmpty('longRangeDamage', 'longRangeDamage');
    return await this.item.update({ "system.rangedWeapons": rangedWeapons });
  }

  _onRemoveFromCharacter(actor) {
    return null;
  }
}
