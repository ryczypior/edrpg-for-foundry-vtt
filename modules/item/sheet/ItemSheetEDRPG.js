import EDRPG from "../../system/EDRPG";
import EDRPGUtils from "../../system/EDRPGUtils";

export default class ItemSheetEDRPG extends ItemSheet {
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.tabs = [{navSelector: ".tabs", contentSelector: ".content", initial: "main"}]
    options.classes = mergeObject(options.classes, ['edrpgitemsheet']);
    options.height = 500;
    options.width = 900;
    return options;
  }

  async getData() {
    const sheetData = await super.getData();
    sheetData.system = sheetData.data.system // project system data so that handlebars has the same name and value paths
    sheetData.isGM = this.isGM === true;
    sheetData.rangedWeaponsTypes = duplicate(EDRPG.rangedWeaponsTypes);
    sheetData.meleeWeaponsTypes = duplicate(EDRPG.meleeWeaponsTypes);
    sheetData.meleeHands = duplicate(EDRPG.meleeHands);
    sheetData.shipComponentClasses = EDRPG.shipComponentClasses;
    sheetData.shipComponentTypes = EDRPG.shipComponentTypes;
    sheetData.shipWeaponsSizes = EDRPG.shipWeaponsSizes;
    sheetData.shipWeaponsMountTypes = EDRPG.shipWeaponsMountTypes;
    sheetData.skills = duplicate(EDRPG.skillsCategories);
    const skills = await EDRPGUtils.findItemsByType('Skills');
    if(skills){
      for(let key of Object.keys(skills)){
        const skill = skills[key];
        if(!skill.system.internalId.value || skill.system.internalId.value === "" ) {
          continue;
        }
        if(!sheetData.skills[skill.system.skill.skillCategory.value]) {
          sheetData.skills[skill.system.skill.skillCategory.value] = {skills: {}};
        }
        sheetData.skills[skill.system.skill.skillCategory.value].skills[skill.system.internalId.value] = {
          "type": "Number",
          "label": skill.name,
          "description": skill.system.details.description.value,
          "initial": skill.system.skill.skillScoreStart.value,
          "isChecked": 0,
          "value": skill.system.skill.skillScoreStart.value,
          "bonus": Math.floor(skill.system.skill.skillScoreStart.value/10),
          "maxCapModifier": 0
        };
      }
    }
    sheetData.ammoClips = await EDRPGUtils.findItemsByType('Ammo Clips');
    sheetData.enhancements = await EDRPGUtils.findItemsByType('Enhancements');
    console.log(sheetData.enhancements);
    sheetData.enrichment = await this._handleEnrichment(sheetData.system);
    return sheetData;
  }

  get isGM(){
    return game.user.isGM;
  }

  async _handleEnrichment(system)
  {
    let enrichment = {};
    console.log(system.details.description);
    if(system.details.description) {
      enrichment["system.details.description.value"] = await TextEditor.enrichHTML(system.details.description.value, {async: true});
    }
    if(system.details.gmdescription) {
      enrichment["system.details.gmdescription.value"] = await TextEditor.enrichHTML(system.details.gmdescription.value, {async: true});
    }
    if(system.notes){
      enrichment["system.notes.value"] = await TextEditor.enrichHTML(system.notes.value, { async: true });
    }
    return expandObject(enrichment);
  }

  async _onDiscreetChange (event){
    const armour = duplicate(this.item._source.system.armour);
    armour.discreet.value = event.target.checked;
    return await this.item.update({"system.armour": armour});
  }

  async _onIsWearableChange (event){
    const wearable = duplicate(this.item._source.system.wearable);
    wearable.value = event.target.checked;
    return await this.item.update({"system.wearable": wearable});
  }

  async _onAbsorbToxicChange (event){
    const armour = duplicate(this.item._source.system.armour);
    armour.absorbToxic.value = event.target.checked;
    return await this.item.update({"system.armour": armour});
  }

  async _onEffectCreateClick(event) {
    let effects = {value: []};
    if(this.item._source.system.effects){
      effects = duplicate(this.item._source.system.effects);
    }
    const effect = duplicate(game.edrpg.ItemEffect);
    effects.value.push(effect);
    return await this.item.update({"system.effects": effects});
  }

  async _onEffectRemoveClick(event) {
    if(event){
      if(event.stopPropagation){
        event.stopPropagation()
      }
      if(event.stopImmediatePropagation){
        event.stopImmediatePropagation();
      }
      if(event.preventDefault){
        event.preventDefault();
      }
    }
    const effects = duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value.splice(index, 1);
    return await this.item.update({"system.effects": effects});
  }

  async _onChangeEffect(event) {
    const effects = duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value[index].skillId = event.target.value;
    return await this.item.update({"system.effects": effects});
  }

  async _onChangeEffectValue(event) {
    const effects = duplicate(this.item._source.system.effects);
    const index = event.target.getAttribute('data-idx');
    effects.value[index].skillValue = parseInt(event.target.value, 10) || 10;
    return await this.item.update({"system.effects": effects});
  }

  async _onDestroyCoverChange (event){
    const rangedWeapons = duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.destroyCover.value = event.target.checked;
    return await this.item.update({"system.rangedWeapons": rangedWeapons});
  }

  async _onDivideFireChange (event){
    const rangedWeapons = duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.divideFire.value = event.target.checked;
    return await this.item.update({"system.rangedWeapons": rangedWeapons});
  }

  async _onDirectFireExplosiveChange (event){
    const rangedWeapons = duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.directFireExplosive.value = event.target.checked;
    return await this.item.update({"system.rangedWeapons": rangedWeapons});
  }

  async _onIsTwoHandedChange (event){
    const rangedWeapons = duplicate(this.item._source.system.rangedWeapons);
    rangedWeapons.isTwoHanded.value = event.target.checked;
    return await this.item.update({"system.rangedWeapons": rangedWeapons});
  }

  _onRemoveFromCharacter(actor){
    return null;
  }

  async _onRangedDamageChange(event){
    console.log(event);
    const rangedWeapons = duplicate(this.item._source.system.rangedWeapons);
    if(EDRPGUtils.isEmpty(rangedWeapons.shortRangeDamage.value)){
      rangedWeapons.shortRangeDamage.value = event.target.value;
      event.data.html.find('[name="system.rangedWeapons.shortRangeDamage.value"]').val(event.target.value);
    }
    if(EDRPGUtils.isEmpty(rangedWeapons.mediumRangeDamage.value)){
      rangedWeapons.mediumRangeDamage.value = event.target.value;
      event.data.html.find('[name="system.rangedWeapons.mediumRangeDamage.value"]').val(event.target.value);
    }
    if(EDRPGUtils.isEmpty(rangedWeapons.longRangeDamage.value)){
      rangedWeapons.longRangeDamage.value = event.target.value;
      event.data.html.find('[name="system.rangedWeapons.longRangeDamage.value"]').val(event.target.value);
    }
    return await this.item.update({"system.rangedWeapons": rangedWeapons});
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.discreet').on('change', this._onDiscreetChange.bind(this));
    html.find('.destroyCover').on('change', this._onDestroyCoverChange.bind(this));
    html.find('.directFireExplosive').on('change', this._onDirectFireExplosiveChange.bind(this));
    html.find('.divideFire').on('change', this._onDivideFireChange.bind(this));
    html.find('.isTwoHanded').on('change', this._onIsTwoHandedChange.bind(this));
    html.find('.rangedWeaponDamage').on('change', {html}, this._onRangedDamageChange.bind(this));
    html.find('.absorbToxic').on('change', this._onAbsorbToxicChange.bind(this));
    html.find('.isWearable').on('change', this._onIsWearableChange.bind(this));
    html.find('.effectCreate').on('click', this._onEffectCreateClick.bind(this));
    html.find('.effectRemove').on('click', this._onEffectRemoveClick.bind(this));
    html.find('.changeEffect').on('change', this._onChangeEffect.bind(this));
    html.find('.changeEffectValue').on('change', this._onChangeEffectValue.bind(this));
  }
}
