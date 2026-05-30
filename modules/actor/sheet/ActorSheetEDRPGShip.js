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
    "Ship Internal - Planetary Scanners",
    "Ship Internal - Fighter Hangar",
    "Ship Internal - Spaceship Hangar",
    "Ship Internal - Passenger Cabins",
    ...Object.keys(this.fixedComponentsTypes),
  ];

  validCharacterSheetTypes = [
    'Character',
    'NPC',
  ];

  /** Personal-equipment item types shown in the ship's Equipment tab. */
  equipmentTypes = [
    'Armour',
    'Cybernetics',
    'General Equipment',
    'Ranged Weapons',
    'Melee Weapons',
    'Ammo Clips',
    'Wearables',
    'Commodities',
  ];

  async getFixedComponents() {
    const fc = this.actor.system.shipFixedComponents;
    const make = (key, titleKey) => ({
      title: game.i18n.localize(titleKey),
      size: fc[key].size,
      item: fc[key].item,
      model: fc[key].model,
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
      // Be resilient to pilots whose data lacks these fields (old/imported actors).
      context.pilotDodge = context.pilot.system?.info?.dodge?.value ?? 0;
      context.pilotInitiative = context.pilot.system?.info?.initiative?.value ?? 0;
      const spaceshipPiloting = this.actor.findSkillByInternalId('Spaceship Piloting', context.pilot);
      if (spaceshipPiloting) {
        context.pilotSpaceshipPiloting = spaceshipPiloting.system?.skill?.skillBonus?.value ?? 0;
      }
    }
    context.fixedComponents = await this.getFixedComponents();
    context.internalComponents = this.actor.system.shipInternalComponents;
    context.utilityMounts = this.actor.system.shipUtilityMounts;
    context.weapons = this.actor.system.shipWeapons;
    context.shipType = EDRPG.shipTypes;
    context.landingPadSize = EDRPG.landingPadSizes;

    const power = this.calculatePower();
    context.shipPower = power;
    context.shipPowerClass = power > 0 ? "positive" : (power < 0 ? "negative" : "");

    // Crew slots: one per `shipInfo.crew` count, filled from the crew array.
    const crewCount = Math.max(0, Number(this.actor.system.shipInfo?.crew?.value ?? 0));
    const crew = this.actor.system.crew ?? [];
    context.crewSlots = Array.from({ length: crewCount }, (_, i) => crew[i] ?? null);

    // Only items that were transferred onto the ship (tagged with a last owner);
    // a ship with no transfers shows an empty list.
    context.shipEquipment = this.actor.items.filter(i => i.flags?.edrpg?.lastOwner != null);

    // Extra hull points from internal components (e.g. Hull Reinforcement Packages)
    // are auto-added to the ship's hull.
    let hullBonus = 0;
    for (const slot of (this.actor.system.shipInternalComponents ?? [])) {
      hullBonus += Number(slot?.item?.system?.extraHullPoints?.value ?? 0);
    }
    context.hullBonus = hullBonus;
    context.hullTotal = Number(this.actor.system.shipInfo?.hull?.value ?? 0) + hullBonus;
    return context;
  }

  /**
   * Net power balance = generated − consumed across all component items
   * (weapons, utility mounts, fixed components, internal components).
   */
  calculatePower() {
    const sys = this.actor.system;
    let power = 0;
    const add = (slot) => {
      const it = slot?.item;
      if (!it) return;
      power += Number(it.system?.powerGenerated?.value ?? 0);
      power -= Number(it.system?.powerConsumed?.value ?? 0);
    };
    for (const key of Object.keys(sys.shipFixedComponents ?? {})) add(sys.shipFixedComponents[key]);
    for (const type of ["shipWeapons", "shipUtilityMounts", "shipInternalComponents"]) {
      for (const slot of (sys[type] ?? [])) add(slot);
    }
    return Math.round(power * 100) / 100;
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
    // Crew slots are also `.pilot` (for styling), so check `.crew-slot` first.
    const crewSlot = event.target.closest(".crew-slot");
    if (crewSlot) {
      const idx = Number(crewSlot.dataset.idx);
      const crew = foundry.utils.duplicate(this.actor.system.crew ?? []);
      // No duplicates: the same actor can't be both pilot and crew, nor occupy
      // two crew slots.
      if (this.actor.system.pilot?._id === source.id) {
        ui.notifications.warn(game.i18n.format('WARN.ShipCrewIsPilot', { name: source.name }));
        return false;
      }
      if (crew.some((member, j) => member?._id === source.id && j !== idx)) {
        ui.notifications.warn(game.i18n.format('WARN.ShipCrewAlreadyAssigned', { name: source.name }));
        return false;
      }
      crew[idx] = source;
      await this.actor.update({ 'system.crew': crew });
      return true;
    }
    if (event.target.closest(".pilot")) {
      // Either pilot OR crew, never both: if this actor is already in the crew,
      // remove them from there when promoting to pilot.
      const update = { 'system.pilot': source };
      const crew = foundry.utils.duplicate(this.actor.system.crew ?? []);
      let movedFromCrew = false;
      for (let i = 0; i < crew.length; i++) {
        if (crew[i]?._id === source.id) {
          crew[i] = null;
          movedFromCrew = true;
        }
      }
      if (movedFromCrew) update['system.crew'] = crew;
      await this.actor.update(update);
      return true;
    }
    await this.recalculateFormulas();
    return false;
  }

  /** Remove a crew member from a crew slot (keeps the slot). */
  async _onRemoveCrew(event) {
    event.preventDefault?.();
    event.stopPropagation?.();
    const idx = Number(event.currentTarget.getAttribute('data-idx'));
    const crew = foundry.utils.duplicate(this.actor.system.crew ?? []);
    if (idx < crew.length) {
      crew[idx] = null;
      await this.actor.update({ 'system.crew': crew });
    }
    return true;
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
          const bonus = Number(spaceshipPiloting.system?.skill?.skillBonus?.value ?? 0);
          data['system.shipInfo.defence.value'] += bonus;
          data['system.shipInfo.pursuit.value'] += Math.floor(bonus / 2);
        }
        data['system.shipInfo.initiative.value'] += Number(this.actor.system.pilot.system?.info?.initiative?.value ?? 0);
      }
      data['system.shipInfo.defence.value'] += Number(this.actor.system.shipInfo?.agility?.value ?? 0);
      data['system.shipInfo.pursuit.value'] += Number(this.actor.system.shipInfo?.speed?.value ?? 0);
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
    // Dropped onto a weapon slot card → slot assignment with size validation.
    const weaponSlot = event.target?.closest?.('.component.shipWeapons');
    if (weaponSlot) {
      return await this._onDropWeapon(event, item, Number(weaponSlot.dataset.idx));
    }
    // Dropped onto a utility/internal slot row → type-checked slot assignment.
    const componentSlot = event.target?.closest?.('.component-slot');
    if (componentSlot) {
      return await this._onDropComponentSlot(event, item, componentSlot);
    }
    // Personal equipment dragged from a player's sheet → stow on the ship and
    // record who it last belonged to.
    const fromActor = item.parent?.documentName === "Actor" && item.parent.id !== this.actor.id;
    if (fromActor && this.equipmentTypes.includes(item.type)) {
      const itemData = item.toObject();
      itemData.flags = foundry.utils.mergeObject(itemData.flags ?? {}, { edrpg: { lastOwner: item.parent.name } });
      return await this.actor.createEmbeddedDocuments("Item", [itemData]);
    }
    return await super._onDropItem(event, item);
  }

  /** Assign a Ship Weapon to a weapon slot; only Ship Weapons, size must fit. */
  async _onDropWeapon(event, item, idx) {
    if (item.type !== "Ship Weapons") {
      ui.notifications.warn(game.i18n.localize('WARN.ShipWeaponOnlySlot'));
      return false;
    }
    const weapons = foundry.utils.duplicate(this.actor.system.shipWeapons);
    if (!weapons[idx]) return false;
    const weaponSize = Number(item.system.size?.value ?? 0);
    const slotSize = Number(weapons[idx].size ?? 0);
    if (weaponSize && slotSize && weaponSize > slotSize) {
      ui.notifications.warn(game.i18n.format('WARN.ShipWeaponTooLarge', {
        itemName: item.name, weaponSize, slotSize,
      }));
      return false;
    }
    weapons[idx].item = item;
    await this.actor.update({ 'system.shipWeapons': weapons });
    return await this.recalculateFormulas();
  }

  /** Remove the item from a component slot without deleting the slot itself. */
  async _onRemoveShipComponent(event) {
    event.preventDefault?.();
    event.stopPropagation?.();
    const el = event.currentTarget;
    const type = el.getAttribute('data-component-name');
    const idx = el.getAttribute('data-idx');
    if (type === '__fixed') {
      await this.actor.update({ [`system.shipFixedComponents.${idx}.item`]: null });
      return await this.recalculateFormulas();
    }
    const components = foundry.utils.duplicate(this.actor.system[type]);
    const i = Number(idx);
    if (!components[i]) return null;
    components[i].item = null;
    await this.actor.update({ [`system.${type}`]: components });
    return await this.recalculateFormulas();
  }

  /** Assign a utility-mount / internal item to its slot (type-checked). */
  async _onDropComponentSlot(event, item, slotEl) {
    const componentType = slotEl.dataset.componentName;
    const idx = Number(slotEl.dataset.idx);
    const accepts = {
      shipUtilityMounts: (t) => t === 'Ship Utility Mounts',
      shipInternalComponents: (t) => t.startsWith('Ship Internal'),
    }[componentType];
    if (!accepts || !accepts(item.type)) {
      ui.notifications.warn(game.i18n.format('WARN.ShipComponentWrongType', { itemName: item.name }));
      return false;
    }
    const components = foundry.utils.duplicate(this.actor.system[componentType] ?? []);
    if (!components[idx]) return false;
    // Internal components: the item's size must fit the slot's max size
    // (both on the shipComponentClasses 1–8 scale).
    if (componentType === 'shipInternalComponents') {
      const itemSize = Number(item.system?.size?.value ?? 0);
      const slotSize = Number(components[idx].size ?? 0);
      if (itemSize && slotSize && itemSize > slotSize) {
        ui.notifications.warn(game.i18n.format('WARN.ShipImproperSlotSize', { itemSize, slotSize }));
        return false;
      }
      // Only one Shield Generator may be installed across the internal slots.
      if (item.type === 'Ship Internal - Shield Generators'
        && components.some((slot, j) => j !== idx && slot?.item?.type === 'Ship Internal - Shield Generators')) {
        ui.notifications.warn(game.i18n.localize('WARN.ShipOneShieldGenerator'));
        return false;
      }
    }
    components[idx].item = item;
    await this.actor.update({ [`system.${componentType}`]: components });
    return await this.recalculateFormulas();
  }

  /** Gear icon on a weapon slot → pick the slot's max weapon size. */
  async _onWeaponSlotSettings(event) {
    const idx = Number(event.currentTarget.getAttribute('data-idx'));
    const current = Number(this.actor.system.shipWeapons[idx]?.size ?? 1);
    const options = Object.entries(EDRPG.shipWeaponsSizes).map(([key, val]) =>
      `<option value="${key}" ${Number(key) === current ? 'selected' : ''}>${game.i18n.localize(val.name)}</option>`
    ).join('');
    const content = `<form><div class="form-group">
        <label>${game.i18n.localize('SHIPSHEET.WeaponSlotMaxSize')}</label>
        <select name="size">${options}</select>
      </div></form>`;
    const DialogV2 = foundry.applications.api.DialogV2;
    await DialogV2.wait({
      window: { title: game.i18n.localize('SHIPSHEET.WeaponSlotMaxSize') },
      content,
      rejectClose: false,
      buttons: [
        {
          action: 'save',
          icon: 'fas fa-check',
          label: game.i18n.localize('CHAT.Submit'),
          default: true,
          callback: async (e, button, dialog) => {
            const value = Number(dialog.element.querySelector('[name="size"]').value);
            const weapons = foundry.utils.duplicate(this.actor.system.shipWeapons);
            if (!weapons[idx]) return;
            weapons[idx].size = value;
            await this.actor.update({ 'system.shipWeapons': weapons });
          }
        },
        { action: 'cancel', icon: 'fas fa-times', label: game.i18n.localize('CHAT.Cancel') }
      ]
    });
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
          components.push({ size: 1, strength: 0, power: 0, item: null, model: "" });
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

  /** Fixed components are keyed (bulkhead, powerPlant…); data-idx is the key. */
  async _onChangeFixedComponentSize(event) {
    const key = event.currentTarget.getAttribute('data-idx');
    const value = event.currentTarget.value;
    return await this.actor.update({ [`system.shipFixedComponents.${key}.size`]: value });
  }

  /** Internal/utility components are arrays; data-idx is the numeric index. */
  async _onChangeArrayComponentSize(event, componentType) {
    const idx = Number(event.currentTarget.getAttribute('data-idx'));
    const components = foundry.utils.duplicate(this.actor.system[componentType]);
    if (!components[idx]) return null;
    components[idx].size = event.currentTarget.value;
    return await this.actor.update({ [`system.${componentType}`]: components });
  }

  /** Free-text model/designation per slot (fixed components, keyed by data-idx). */
  async _onChangeFixedComponentModel(event) {
    const key = event.currentTarget.getAttribute('data-idx');
    const value = event.currentTarget.value;
    return await this.actor.update({ [`system.shipFixedComponents.${key}.model`]: value });
  }

  /** Free-text model/designation per slot (array components). */
  async _onChangeArrayComponentModel(event, componentType) {
    const idx = Number(event.currentTarget.getAttribute('data-idx'));
    const value = event.currentTarget.value;
    const components = foundry.utils.duplicate(this.actor.system[componentType]);
    if (!components[idx]) return null;
    components[idx].model = value;
    return await this.actor.update({ [`system.${componentType}`]: components });
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const el = this.element;
    el.querySelectorAll('.remove-pilot').forEach(n => n.addEventListener('click', this._onRemovePilot.bind(this)));
    el.querySelectorAll('.remove-crew').forEach(n => n.addEventListener('click', this._onRemoveCrew.bind(this)));
    el.querySelectorAll('.changeComponentCount').forEach(n => n.addEventListener('change', this._changeComponentCount.bind(this)));
    el.querySelectorAll('.changeFixedComponentSize').forEach(n => n.addEventListener('change', this._onChangeFixedComponentSize.bind(this)));
    el.querySelectorAll('.changeInternalComponentsSize').forEach(n => n.addEventListener('change', e => this._onChangeArrayComponentSize(e, 'shipInternalComponents')));
    el.querySelectorAll('.changeUtilityMountSize').forEach(n => n.addEventListener('change', e => this._onChangeArrayComponentSize(e, 'shipUtilityMounts')));
    el.querySelectorAll('.changeFixedComponentModel').forEach(n => n.addEventListener('change', this._onChangeFixedComponentModel.bind(this)));
    el.querySelectorAll('.changeInternalComponentsModel').forEach(n => n.addEventListener('change', e => this._onChangeArrayComponentModel(e, 'shipInternalComponents')));
    el.querySelectorAll('.changeUtilityMountModel').forEach(n => n.addEventListener('change', e => this._onChangeArrayComponentModel(e, 'shipUtilityMounts')));
    el.querySelectorAll('.weaponSlotSettings').forEach(n => n.addEventListener('click', this._onWeaponSlotSettings.bind(this)));
    el.querySelectorAll('.removeShipComponent').forEach(n => n.addEventListener('click', this._onRemoveShipComponent.bind(this)));
    const debouncedRecalc = foundry.utils.debounce((event) => this.recalculateFormulas(event), 200);
    el.querySelectorAll('.recalculateFormula').forEach(n => n.addEventListener('change', debouncedRecalc));
  }
}
