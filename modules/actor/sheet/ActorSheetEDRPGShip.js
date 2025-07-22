import ActorSheetEDRPG from "./ActorSheetEDRPG.js";
import EDRPGSkillTests from "../../tests/EDRPGSkillTests.js";
import EDRPG from "../../system/EDRPG";

export default class ActorSheetEDRPGShip extends ActorSheetEDRPG {

  fixedComponentsTypes = {
    'Ship Bulkheads': 'bulkhead',
    'Ship Power Plants': 'powerPlant',
    'Ship Thrusters': 'thrusters',
    'Ship FSD': 'fsd',
    'Ship Life Support': 'lifeSupport',
    'Ship Power Distributor': 'powerDistributor',
    'Ship Sensors': 'sensors',
    'Ship Cargo Hatch': 'cargoHatch',
  };

  validItemTypes = [
    'Armour',
    'Cybernetics',
    'General Equipment',
    'Ranged Weapons',
    'Melee Weapons',
    'Ammo Clips',
    'Wearables',
    "Ranged Weapons",
    "Melee Weapons",
    "Ammo Clips",
    "Commodities",
    "Ship Shields",
    "Ship Weapons",
    "Ship Utility Mounts",
    "Ship Internal - AFM Units",
    "Ship Internal - Cargo Racks",
    "Ship Internal - Collector Limpet Controllers",
    "Ship Internal - Docking Computer",
    "Ship Internal - FSD Interdictor",
    "Ship Internal - Fuel Scoops",
    "Ship Internal - Hatch Breaker Limpet Controllers",
    "Ship Internal - Hull Reinforcement Packages",
    "Ship Internal - Module Reinforcement Packages",
    "Ship Internal - Prospector Limpet Controllers",
    "Ship Internal - Planetary Vehicle Hangars",
    "Ship Internal - Refineries",
    "Ship Internal - Shield Cell Banks",
    "Ship Internal - Shield Generators",
  ] + Object.keys(this.fixedComponentsTypes);

  validCharacterSheetTypes = [
    'Character',
    'NPC',
  ]

  get template() {
    let template = super.template;
    return "systems/edrpg/templates/sheets/ship-sheet.html";
  }

  async getFixedComponents() {
    const elements = {
      "bulkhead": {
        title: game.i18n.localize("SHIPSHEET.FixedBulkhead"),
        size: this.actor.system.shipFixedComponents.bulkhead.size,
        item: this.actor.system.shipFixedComponents.bulkhead.item,
      },
      "powerPlant": {
        title: game.i18n.localize("SHIPSHEET.FixedPowerPlant"),
        size: this.actor.system.shipFixedComponents.powerPlant.size,
        item: this.actor.system.shipFixedComponents.powerPlant.item,
      },
      "thrusters": {
        title: game.i18n.localize("SHIPSHEET.FixedThrusters"),
        size: this.actor.system.shipFixedComponents.thrusters.size,
        item: this.actor.system.shipFixedComponents.thrusters.item,
      },
      "fsd": {
        title: game.i18n.localize("SHIPSHEET.FixedFSD"),
        size: this.actor.system.shipFixedComponents.fsd.size,
        item: this.actor.system.shipFixedComponents.fsd.item,
      },
      "lifeSupport": {
        title: game.i18n.localize("SHIPSHEET.FixedLifeSupport"),
        size: this.actor.system.shipFixedComponents.lifeSupport.size,
        item: this.actor.system.shipFixedComponents.lifeSupport.item,
      },
      "powerDistributor": {
        title: game.i18n.localize("SHIPSHEET.FixedPowerDistributor"),
        size: this.actor.system.shipFixedComponents.powerDistributor.size,
        item: this.actor.system.shipFixedComponents.powerDistributor.item,
      },
      "sensors": {
        title: game.i18n.localize("SHIPSHEET.FixedSensors"),
        size: this.actor.system.shipFixedComponents.sensors.size,
        item: this.actor.system.shipFixedComponents.sensors.item,
      },
      "cargoHatch": {
        title: game.i18n.localize("SHIPSHEET.FixedCargoHatch"),
        size: this.actor.system.shipFixedComponents.cargoHatch.size,
        item: this.actor.system.shipFixedComponents.cargoHatch.item,
      },
    }
    return elements;
  }

  async getData() {
    const sheetData = await super.getData();
    console.log(this.actor);
    sheetData.pilot = this.actor.system.pilot;
    sheetData.pilotDodge = 0;
    sheetData.pilotInitiative = 0;
    sheetData.pilotSpaceshipPiloting = 0;
    sheetData.shipComponentClasses = EDRPG.shipComponentClasses;
    sheetData.shipComponentTypes = EDRPG.shipComponentTypes;
    sheetData.shipWeaponsSizes = EDRPG.shipWeaponsSizes;
    sheetData.shipCategories = EDRPG.shipTypes;
    sheetData.landingPadSizes = EDRPG.landingPadSizeses;
    if (sheetData.pilot) {
      sheetData.pilotDodge = sheetData.pilot.system.info.dodge.value;
      sheetData.pilotInitiative = sheetData.pilot.system.info.initiative.value;
      const spaceshipPiloting = this.actor.findSkillByInternalId('Spaceship Piloting', sheetData.pilot);
      if (spaceshipPiloting) {
        sheetData.pilotSpaceshipPiloting = spaceshipPiloting.system.skill.skillBonus.value;
      }
    }
    sheetData.fixedComponents = await this.getFixedComponents();
    sheetData.internalComponents = await this.actor.system.shipInternalComponents;
    sheetData.utilityMounts = await this.actor.system.shipUtilityMounts;
    sheetData.weapons = await this.actor.system.shipWeapons;
    sheetData.shipType = EDRPG.shipTypes;
    sheetData.landingPadSize = EDRPG.landingPadSizeses;
    sheetData.landingPadSize = EDRPG.landingPadSizeses;
    return sheetData;
  }

  async _onDropActor(event, data) {
    const source = await fromUuid(data.uuid);
    if (!source) return false;
    if (!this.validCharacterSheetTypes.includes(source.type)) return false;
    if (event.target.closest(".pilot")) {
      await this.actor.update({
        'system.pilot': source
      });
      return true;
    } else if (event.target.closest(".crew")) {
      const crew = duplicate(this.actor.system.crew);
      crew.push(source);
      await this.actor.update({
        'system.crew': crew
      });
      return true;
    }
    await this.recalculateFormulas();
    return false;
  }

  async recalculateFormulas(event) {
    if (event) {
      const data = {
        'system.shipInfo.defence.value': 0,
        'system.shipInfo.initiative.value': 0,
        'system.shipInfo.pursuit.value': 0,
        'system.shipInfo.dogfight.value': 0,
      };
      if (this.actor.system.pilot) {
        const spaceshipPiloting = this.actor.findSkillByInternalId('Spaceship Piloting', this.actor.system.pilot);
        if(spaceshipPiloting) {
          data['system.shipInfo.defence.value'] += Number(spaceshipPiloting.system.skill.skillBonus.value);
          data['system.shipInfo.pursuit.value'] += Math.floor(Number(spaceshipPiloting.system.skill.skillBonus.value) / 2);
        }
        data['system.shipInfo.initiative.value'] += Number(this.actor.system.pilot.system.info.initiative.value);
      }
      data['system.shipInfo.defence.value'] += Number(this.actor.system.shipInfo.agility.value);
      data['system.shipInfo.pursuit.value'] += Number(this.actor.system.shipInfo.speed.value);
      await this.actor.update(data);
    }
    return true;
  }

  async _onDropFixedComponents(event, item) {
    if (event.target.closest(".ship-components-fixed")) {
      const itemType = item.type;
      if (this.fixedComponentsTypes[itemType] === undefined) {
        return true;
      }
      let itemSize = 0;
      let slotSize = 0;
      if (item.system.size) {
        itemSize = Number(item.system.size.value);
      }
      if (this.actor.system.shipFixedComponents[this.fixedComponentsTypes[itemType]].size) {
        slotSize = Number(this.actor.system.shipFixedComponents[this.fixedComponentsTypes[itemType]].size);
      }
      if (itemSize !== 0 && slotSize !== 0 && itemSize !== slotSize) {
        ui.notifications.warn(game.i18n.format('WARN.ShipImproperSlotSize', {
          itemSize, slotSize, itemName: item.name,
        }));
        return true;
      }
      const idx = {
        [`system.shipFixedComponents.${this.fixedComponentsTypes[itemType]}.item`]: item
      };
      await this.actor.update(idx);
      return await this.recalculateFormulas();
    }
    return false;
  }

  async _onDropItem(event, data) {
    const item = await fromUuid(data.uuid);
    if (Object.keys(this.fixedComponentsTypes).indexOf(item.type) !== -1) {
      return await this._onDropFixedComponents(event, item);
    }
    await this.recalculateFormulas();
    return true;
  }

  async _onRemovePilot(event) {
    await this.actor.update({
      'system.pilot': null
    });
    return await this.recalculateFormulas();
  }

  async _changeComponentCount(event) {
    const componentTypes = ['shipWeapons', 'shipUtilityMounts', 'shipInternalComponents'];
    const componentType = event.target.getAttribute('data-componentName');
    console.log(componentType);
    if (componentTypes.indexOf(componentType) === -1) {
      return null;
    }
    let components = duplicate(this.actor.system[componentType]);
    let componentsCount = components.length;
    let newCount = Number(event.target.value);
    if(newCount >= 0){
      if(newCount > componentsCount){
        for (let i = componentsCount; i < newCount; i++) {
          components.push({
            size: 1,
            strength: 0,
            power: 0,
            item: null,
          });
        }
      } else {
        components = components.slice(0, newCount);
      }
      let updateValue = {};
      updateValue[`system.${componentType}`] = components;
      await this.actor.update(updateValue);
    }
    return await this.recalculateFormulas();
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('.skill-roll').click(this._onSkillClick.bind(this));
    html.find('.remove-pilot').click(this._onRemovePilot.bind(this));
    html.find('.changeComponentCount').change(this._changeComponentCount.bind(this));
    html.find('.recalculateFormula').change(debounce(async (event) => {
      await this.recalculateFormulas(event);
    }, 200));
  }
}
