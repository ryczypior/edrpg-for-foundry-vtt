import ActorEDRPG from "./modules/actor/ActorEDRPG.js";
import ActorSheetEDRPG from "./modules/actor/sheet/v2/ActorSheetEDRPGV2.js";
import ActorSheetEDRPGCharacter from "./modules/actor/sheet/ActorSheetEDRPGCharacter.js";
import ItemEDRPG from "./modules/item/ItemEDRPG.js";
import ItemSheetEDRPG from "./modules/item/sheet/v2/ItemSheetEDRPGV2.js";
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
import ItemSheetEDRPGShipInternalPlanetaryScanners
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalPlanetaryScanners";
import ItemSheetEDRPGShipInternalFighterHangar
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalFighterHangar";
import ItemSheetEDRPGShipInternalSpaceshipHangar
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalSpaceshipHangar";
import ItemSheetEDRPGShipInternalPassengerCabins
  from "./modules/item/sheet/ItemSheetEDRPGShipInternalPassengerCabins";
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
  // In Foundry v13 the global ActorSheet/ItemSheet moved to foundry.appv1.sheets.*
  // and the Actors/Items collections moved to foundry.documents.collections.*.
  // Fall back to the legacy globals so v10–v12 keep working.
  const ActorSheetClass = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;
  const ItemSheetClass = foundry.appv1?.sheets?.ItemSheet ?? ItemSheet;
  const ActorsCollection = foundry.documents?.collections?.Actors ?? Actors;
  const ItemsCollection = foundry.documents?.collections?.Items ?? Items;
  ActorsCollection.unregisterSheet('core', ActorSheetClass);
  ActorsCollection.registerSheet('edrpg', ActorSheetEDRPGCharacter, {types: ['Character'], makeDefault: true});
  ActorsCollection.registerSheet('edrpg', ActorSheetEDRPGNPC, {types: ['NPC'], makeDefault: true});
  ActorsCollection.registerSheet('edrpg', ActorSheetEDRPGVehicle, {types: ['Vehicle'], makeDefault: true});
  ActorsCollection.registerSheet('edrpg', ActorSheetEDRPGCreature, {types: ['Creature'], makeDefault: true});
  ActorsCollection.registerSheet('edrpg', ActorSheetEDRPGShip, {types: ['Ship'], makeDefault: true});
  ItemsCollection.unregisterSheet('core', ItemSheetClass);
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGSkills, {types: ['Skills'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGBackground, {types: ['Backgrounds'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGEnhancement, {types: ['Enhancements'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGKarmaCap, {types: ['Karma Capabilities'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGArmour, {types: ['Armour'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGAmmoClips, {types: ['Ammo Clips'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGCybernetics, {types: ['Cybernetics'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGGeneralEquipment, {types: ['General Equipment'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGWearables, {types: ['Wearables'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGRangedWeapons, {types: ['Ranged Weapons'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGMeleeWeapons, {types: ['Melee Weapons'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGCommodities, {types: ['Commodities'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipBulkheads, {types: ['Ship Bulkheads'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipPowerPlants, {types: ['Ship Power Plants'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipThrusters, {types: ['Ship Thrusters'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipFSD, {types: ['Ship FSD'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipLifeSupport, {types: ['Ship Life Support'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipPowerDistributors, {types: ['Ship Power Distributor'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipSensors, {types: ['Ship Sensors'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipShields, {types: ['Ship Shields'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipWeapons, {types: ['Ship Weapons'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipWeaponsAmmo, {types: ['Ship Weapons Ammo'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipCargoHatch, {types: ['Ship Cargo Hatch'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipUtilityMounts, {types: ['Ship Utility Mounts'], makeDefault: true});

  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalAFMUnits, {types: ['Ship Internal - AFM Units'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalCargoRacks, {types: ['Ship Internal - Cargo Racks'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalCollectorLimpetControllers, {types: ['Ship Internal - Collector Limpet Controllers'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalDockingComputer, {types: ['Ship Internal - Docking Computer'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalFSDInterdictors, {types: ['Ship Internal - FSD Interdictor'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalFuelScoops, {types: ['Ship Internal - Fuel Scoops'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalHBLimpetControllers, {types: ['Ship Internal - Hatch Breaker Limpet Controllers'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalHullReinforcementPackages, {types: ['Ship Internal - Hull Reinforcement Packages'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalModuleReinforcementPackages, {types: ['Ship Internal - Module Reinforcement Packages'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalProspectorLimpetControllers, {types: ['Ship Internal - Prospector Limpet Controllers'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalPlanetaryVehicleHangars, {types: ['Ship Internal - Planetary Vehicle Hangars'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalPlanetaryScanners, {types: ['Ship Internal - Planetary Scanners'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalFighterHangar, {types: ['Ship Internal - Fighter Hangar'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalSpaceshipHangar, {types: ['Ship Internal - Spaceship Hangar'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalPassengerCabins, {types: ['Ship Internal - Passenger Cabins'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalRefineries, {types: ['Ship Internal - Refineries'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalShieldCellBanks, {types: ['Ship Internal - Shield Cell Banks'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGShipInternalShieldGenerators, {types: ['Ship Internal - Shield Generators'], makeDefault: true});

  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGVehicleShields, {types: ['Vehicle Shields'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGVehicleWeapons, {types: ['Vehicle Weapons'], makeDefault: true});
  ItemsCollection.registerSheet('edrpg', ItemSheetEDRPGVehicleSpecials, {types: ['Vehicle Specials'], makeDefault: true});
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
      ItemSheetEDRPGShipInternalPlanetaryScanners,
      ItemSheetEDRPGShipInternalFighterHangar,
      ItemSheetEDRPGShipInternalSpaceshipHangar,
      ItemSheetEDRPGShipInternalPassengerCabins,
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

