import ActorSheetEDRPGV2 from "./v2/ActorSheetEDRPGV2.js";
import EDRPG from "../../system/EDRPG";

export default class ActorSheetEDRPGShip extends ActorSheetEDRPGV2 {
  static HEADER_TEMPLATE = "systems/edrpg/templates/sheets/v2/ship-header.html";
  static BODY_TEMPLATE = "systems/edrpg/templates/sheets/v2/ship-body.html";

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
    ...Object.keys(this.fixedComponentsTypes),
  ];

  validCharacterSheetTypes = [
    'Character',
    'NPC',
  ];

  async getFixedComponents() {
    const fc = this.actor.system.shipFixedComponents;
    const make = (key, titleKey) => ({
      title: game.i18n.localize(titleKey),
      size: fc[key].size,
      item: fc[key].item,
    });
    return {
      "bulkhead": make("bulkhead", "SHIPSHEET.FixedBulkhead"),
      "powerPlant": make("powerPlant", "SHIPSHEET.FixedPowerPlant"),
      "thrusters": make("thrusters", "SHIPSHEET.FixedThrusters"),
      "fsd": make("fsd", "SHIPSHEET.FixedFSD"),
      "lifeSupport": make("lifeSupport", "SHIPSHEET.FixedLifeSupport"),
      "powerDistributor": make("powerDistributor", "SHIPSHEET.FixedPowerDistributor"),
      "sensors": make("sensors", "SHIPSHEET.FixedSensors"),
      "cargoHatch": make("cargoHatch", "SHIPSHEET.FixedCargoHatch"),
    };
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.pilot = this.actor.system.pilot;
    context.pilotDodge = 0;
    context.pilotInitiative = 0;
    context.pilotSpaceshipPiloting = 0;
    context.shipComponentClasses = EDRPG.shipComponentClasses;
    context.shipComponentTypes = EDRPG.shipComponentTypes;
    context.shipWeaponsSizes = EDRPG.shipWeaponsSizes;
    context.shipCategories = EDRPG.shipTypes;
    context.landingPadSizes = EDRPG.landingPadSizes;
    if (context.pilot) {
      context.pilotDodge = context.pilot.system.info.dodge.value;
      context.pilotInitiative = context.pilot.system.info.initiative.value;
      const spaceshipPiloting = this.actor.findSkillByInternalId('Spaceship Piloting', context.pilot);
      if (spaceshipPiloting) {
        context.pilotSpaceshipPiloting = spaceshipPiloting.system.skill.skillBonus.value;
      }
    }
    context.fixedComponents = await this.getFixedComponents();
    context.internalComponents = this.actor.system.shipInternalComponents;
    context.utilityMounts = this.actor.system.shipUtilityMounts;
    context.weapons = this.actor.system.shipWeapons;
    context.shipType = EDRPG.shipTypes;
    context.landingPadSize = EDRPG.landingPadSizes;
    return context;
  }

  /** V2 routes document drops here; dispatch Actors to our handler. */
  async _onDropDocument(event, document) {
    if (document instanceof Actor) {
      return this._onDropActor(event, document);
    }
    return super._onDropDocument(event, document);
  }

  async _onDropActor(event, source) {
    if (!source) return false;
    if (!this.validCharacterSheetTypes.includes(source.type)) return false;
    if (event.target.closest(".pilot")) {
      await this.actor.update({ 'system.pilot': source });
      return true;
    } else if (event.target.closest(".crew")) {
      const crew = foundry.utils.duplicate(this.actor.system.crew);
      crew.push(source);
      await this.actor.update({ 'system.crew': crew });
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
        if (spaceshipPiloting) {
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

  async _onDropItem(event, item) {
    if (Object.keys(this.fixedComponentsTypes).indexOf(item.type) !== -1) {
      return await this._onDropFixedComponents(event, item);
    }
    return await super._onDropItem(event, item);
  }

  async _onRemovePilot(event) {
    await this.actor.update({ 'system.pilot': null });
    return await this.recalculateFormulas();
  }

  async _changeComponentCount(event) {
    const componentTypes = ['shipWeapons', 'shipUtilityMounts', 'shipInternalComponents'];
    const componentType = event.target.getAttribute('data-componentName');
    if (componentTypes.indexOf(componentType) === -1) {
      return null;
    }
    let components = foundry.utils.duplicate(this.actor.system[componentType]);
    let componentsCount = components.length;
    let newCount = Number(event.target.value);
    if (newCount >= 0) {
      if (newCount > componentsCount) {
        for (let i = componentsCount; i < newCount; i++) {
          components.push({ size: 1, strength: 0, power: 0, item: null });
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

  _onRender(context, options) {
    super._onRender(context, options);
    const el = this.element;
    el.querySelectorAll('.remove-pilot').forEach(n => n.addEventListener('click', this._onRemovePilot.bind(this)));
    el.querySelectorAll('.changeComponentCount').forEach(n => n.addEventListener('change', this._changeComponentCount.bind(this)));
    const debouncedRecalc = foundry.utils.debounce((event) => this.recalculateFormulas(event), 200);
    el.querySelectorAll('.recalculateFormula').forEach(n => n.addEventListener('change', debouncedRecalc));
  }
}
