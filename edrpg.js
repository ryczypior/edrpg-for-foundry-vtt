import ActorEDRPG from "./modules/actor/ActorEDRPG.js";
import ActorSheetEDRPG from "./modules/actor/sheet/ActorSheetEDRPG.js";
import ActorSheetEDRPGCharacter from "./modules/actor/sheet/ActorSheetEDRPGCharacter.js";
import ItemEDRPG from "./modules/item/ItemEDRPG.js";
import ItemSheetEDRPG from "./modules/item/sheet/ItemSheetEDRPG.js";
import ItemSheetEDRPGSkills from "./modules/item/sheet/ItemSheetEDRPGSkills.js";
import ItemSheetEDRPGBackground from "./modules/item/sheet/ItemSheetEDRPGBackground.js";
import ItemSheetEDRPGEnhancement from "./modules/item/sheet/ItemSheetEDRPGEnhancement.js";
import ItemSheetEDRPGKarmaCap from "./modules/item/sheet/ItemSheetEDRPGKarmaCap.js";
import registerHooks from "./modules/system/hooks.js"
import EDRPG from "./modules/system/EDRPG";
import BackgroundEffect from "./modules/item/helpers/BackgroundEffect";
import ChatMessageEDRPG from "./modules/system/ChatMessageEDRPG";
import ItemSheetEDRPGArmour from "./modules/item/sheet/ItemSheetEDRPGArmour";
import ActorSheetEDRPGNPC from "./modules/actor/sheet/ActorSheetEDRPGNPC";
import ActorSheetEDRPGVehicle from "./modules/actor/sheet/ActorSheetEDRPGVehicle";
import ActorSheetEDRPGCreature from "./modules/actor/sheet/ActorSheetEDRPGCreature";
import ItemSheetEDRPGAmmoClips from "./modules/item/sheet/ItemSheetEDRPGAmmoClips";
import ItemSheetEDRPGCybernetics from "./modules/item/sheet/ItemSheetEDRPGCybernetics";
import ItemSheetEDRPGGeneralEquipment from "./modules/item/sheet/ItemSheetEDRPGGeneralEquipment";
import ItemSheetEDRPGRangedWeapons from "./modules/item/sheet/ItemSheetEDRPGRangedWeapons";
import ItemSheetEDRPGMeleeWeapons from "./modules/item/sheet/ItemSheetEDRPGMeleeWeapons";
import ItemSheetEDRPGCommodities from "./modules/item/sheet/ItemSheetEDRPGCommodities";
import ItemSheetEDRPGShipBulkheads from "./modules/item/sheet/ItemSheetEDRPGShipBulkheads";
import ItemSheetEDRPGShipPowerPlants from "./modules/item/sheet/ItemSheetEDRPGShipPowerPlants";
import ItemSheetEDRPGShipThrusters from "./modules/item/sheet/ItemSheetEDRPGShipThrusters";
import ItemSheetEDRPGShipFSD from "./modules/item/sheet/ItemSheetEDRPGShipFSD";
import ItemSheetEDRPGShipLifeSupport from "./modules/item/sheet/ItemSheetEDRPGShipLifeSupport";
import ItemSheetEDRPGShipPowerDistributors from "./modules/item/sheet/ItemSheetEDRPGShipPowerDistributors";
import ItemSheetEDRPGShipSensors from "./modules/item/sheet/ItemSheetEDRPGShipSensors";
import ItemSheetEDRPGShipShields from "./modules/item/sheet/ItemSheetEDRPGShipShields";
import ItemSheetEDRPGShipWeapons from "./modules/item/sheet/ItemSheetEDRPGShipWeapons";
import ItemSheetEDRPGShipWeaponsAmmo from "./modules/item/sheet/ItemSheetEDRPGShipWeaponsAmmo";
import ItemSheetEDRPGShipUtilityMounts from "./modules/item/sheet/ItemSheetEDRPGShipUtilityMounts";
import ItemSheetEDRPGShipInternalAFMUnits from "./modules/item/sheet/ItemSheetEDRPGShipInternalAFMUnits";
import ItemSheetEDRPGShipInternalCargoRacks from "./modules/item/sheet/ItemSheetEDRPGShipInternalCargoRacks";
import ItemSheetEDRPGShipInternalCollectorLimpetControllers
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalCollectorLimpetControllers";
import ItemSheetEDRPGShipInternalDockingComputer from "./modules/item/sheet/ItemSheetEDRPGShipInternalDockingComputer";
import ItemSheetEDRPGShipInternalFSDInterdictors from "./modules/item/sheet/ItemSheetEDRPGShipInternalFSDInterdictors";
import ItemSheetEDRPGShipInternalFuelScoops from "./modules/item/sheet/ItemSheetEDRPGShipInternalFuelScoops";
import ItemSheetEDRPGShipInternalHBLimpetControllers
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalHBLimpetControllers";
import ItemSheetEDRPGShipInternalHullReinforcementPackages
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalHullReinforcementPackages";
import ItemSheetEDRPGShipInternalModuleReinforcementPackages
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalModuleReinforcementPackages";
import ItemSheetEDRPGShipInternalProspectorLimpetControllers
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalProspectorLimpetControllers";
import ItemSheetEDRPGShipInternalPlanetaryVehicleHangars
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalPlanetaryVehicleHangars";
import ItemSheetEDRPGShipInternalRefineries from "./modules/item/sheet/ItemSheetEDRPGShipInternalRefineries";
import ItemSheetEDRPGShipInternalShieldCellBanks from "./modules/item/sheet/ItemSheetEDRPGShipInternalShieldCellBanks";
import ItemSheetEDRPGShipInternalShieldGenerators
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalShieldGenerators";
import ItemSheetEDRPGVehicleShields from "./modules/item/sheet/ItemSheetEDRPGVehicleShields";
import ItemSheetEDRPGVehicleWeapons from "./modules/item/sheet/ItemSheetEDRPGVehicleWeapons";
import ItemSheetEDRPGVehicleSpecials from "./modules/item/sheet/ItemSheetEDRPGVehicleSpecials";
import ActorSheetEDRPGShip from "./modules/actor/sheet/ActorSheetEDRPGShip";
import ItemEffects from "./modules/item/helpers/ItemEffects";
import ItemSheetEDRPGWearables from "./modules/item/sheet/ItemSheetEDRPGWearables";
import './static/css/edrpg.scss';
import ItemSheetEDRPGShipCargoHatch from "./modules/item/sheet/ItemSheetEDRPGShipCargoHatch";
Hooks.once("init", async function () {
  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('edrpg', ActorSheetEDRPGCharacter, {types: ['Character'], makeDefault: true});
  Actors.registerSheet('edrpg', ActorSheetEDRPGNPC, {types: ['NPC'], makeDefault: true});
  Actors.registerSheet('edrpg', ActorSheetEDRPGVehicle, {types: ['Vehicle'], makeDefault: true});
  Actors.registerSheet('edrpg', ActorSheetEDRPGCreature, {types: ['Creature'], makeDefault: true});
  Actors.registerSheet('edrpg', ActorSheetEDRPGShip, {types: ['Ship'], makeDefault: true});
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('edrpg', ItemSheetEDRPGSkills, {types: ['Skills'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGBackground, {types: ['Backgrounds'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGEnhancement, {types: ['Enhancements'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGKarmaCap, {types: ['Karma Capabilities'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGArmour, {types: ['Armour'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGAmmoClips, {types: ['Ammo Clips'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGCybernetics, {types: ['Cybernetics'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGGeneralEquipment, {types: ['General Equipment'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGWearables, {types: ['Wearables'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGRangedWeapons, {types: ['Ranged Weapons'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGMeleeWeapons, {types: ['Melee Weapons'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGCommodities, {types: ['Commodities'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipBulkheads, {types: ['Ship Bulkheads'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipPowerPlants, {types: ['Ship Power Plants'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipThrusters, {types: ['Ship Thrusters'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipFSD, {types: ['Ship FSD'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipLifeSupport, {types: ['Ship Life Support'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipPowerDistributors, {types: ['Ship Power Distributor'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipSensors, {types: ['Ship Sensors'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipShields, {types: ['Ship Shields'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipWeapons, {types: ['Ship Weapons'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipWeaponsAmmo, {types: ['Ship Weapons Ammo'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipCargoHatch, {types: ['Ship Cargo Hatch'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipUtilityMounts, {types: ['Ship Utility Mounts'], makeDefault: true});

  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalAFMUnits, {types: ['Ship Internal - AFM Units'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalCargoRacks, {types: ['Ship Internal - Cargo Racks'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalCollectorLimpetControllers, {types: ['Ship Internal - Collector Limpet Controllers'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalDockingComputer, {types: ['Ship Internal - Docking Computer'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalFSDInterdictors, {types: ['Ship Internal - FSD Interdictor'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalFuelScoops, {types: ['Ship Internal - Fuel Scoops'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalHBLimpetControllers, {types: ['Ship Internal - Hatch Breaker Limpet Controllers'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalHullReinforcementPackages, {types: ['Ship Internal - Hull Reinforcement Packages'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalModuleReinforcementPackages, {types: ['Ship Internal - Module Reinforcement Packages'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalProspectorLimpetControllers, {types: ['Ship Internal - Prospector Limpet Controllers'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalPlanetaryVehicleHangars, {types: ['Ship Internal - Planetary Vehicle Hangars'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalRefineries, {types: ['Ship Internal - Refineries'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalShieldCellBanks, {types: ['Ship Internal - Shield Cell Banks'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGShipInternalShieldGenerators, {types: ['Ship Internal - Shield Generators'], makeDefault: true});

  Items.registerSheet('edrpg', ItemSheetEDRPGVehicleShields, {types: ['Vehicle Shields'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGVehicleWeapons, {types: ['Vehicle Weapons'], makeDefault: true});
  Items.registerSheet('edrpg', ItemSheetEDRPGVehicleSpecials, {types: ['Vehicle Specials'], makeDefault: true});
  game.edrpg = {
    apps: {
      ActorSheetEDRPG,
      ActorSheetEDRPGCharacter,
      ActorSheetEDRPGNPC,
      ActorSheetEDRPGVehicle,
      ActorSheetEDRPGCreature,
      ItemSheetEDRPG,
      ItemSheetEDRPGBackground,
      ItemSheetEDRPGSkills,
      ItemSheetEDRPGEnhancement,
      ItemSheetEDRPGKarmaCap,
      ItemSheetEDRPGArmour,
      ItemSheetEDRPGAmmoClips,
      ItemSheetEDRPGCybernetics,
      ItemSheetEDRPGGeneralEquipment,
      ItemSheetEDRPGWearables,
      ItemSheetEDRPGRangedWeapons,
      ItemSheetEDRPGMeleeWeapons,
      ItemSheetEDRPGCommodities,
      ItemSheetEDRPGShipBulkheads,
      ItemSheetEDRPGShipPowerPlants,
      ItemSheetEDRPGShipThrusters,
      ItemSheetEDRPGShipFSD,
      ItemSheetEDRPGShipLifeSupport,
      ItemSheetEDRPGShipPowerDistributors,
      ItemSheetEDRPGShipSensors,
      ItemSheetEDRPGShipShields,
      ItemSheetEDRPGShipCargoHatch,
      ItemSheetEDRPGShipWeapons,
      ItemSheetEDRPGShipWeaponsAmmo,
      ItemSheetEDRPGShipUtilityMounts,
      ItemSheetEDRPGShipInternalAFMUnits,
      ItemSheetEDRPGShipInternalCargoRacks,
      ItemSheetEDRPGShipInternalCollectorLimpetControllers,
      ItemSheetEDRPGShipInternalDockingComputer,
      ItemSheetEDRPGShipInternalFSDInterdictors,
      ItemSheetEDRPGShipInternalFuelScoops,
      ItemSheetEDRPGShipInternalHBLimpetControllers,
      ItemSheetEDRPGShipInternalHullReinforcementPackages,
      ItemSheetEDRPGShipInternalModuleReinforcementPackages,
      ItemSheetEDRPGShipInternalProspectorLimpetControllers,
      ItemSheetEDRPGShipInternalPlanetaryVehicleHangars,
      ItemSheetEDRPGShipInternalRefineries,
      ItemSheetEDRPGShipInternalShieldCellBanks,
      ItemSheetEDRPGShipInternalShieldGenerators,
      ItemSheetEDRPGVehicleShields,
      ItemSheetEDRPGVehicleWeapons,
      ItemSheetEDRPGVehicleSpecials,
    },
    entities: {
      ActorEDRPG,
      ItemEDRPG
    },
    config: EDRPG,
    BackgroundEffect: BackgroundEffect,
    ItemEffect: ItemEffects,
    chat: ChatMessageEDRPG
  };
  CONFIG.Actor.documentClass = ActorEDRPG;
  CONFIG.Item.documentClass = ItemEDRPG;
});

registerHooks();
