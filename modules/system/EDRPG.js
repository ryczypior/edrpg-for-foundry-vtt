const EDRPG = {};

EDRPG.statusTiers = {
  "cr": {
    'toCredit': 1,
    'name': 'TIER.Credits',
    'abbr': 'TIER.CreditsAbbrev',
  },
  "mcr": {
    'toCredit': 100,
    'name': 'TIER.MicroCredits',
    'abbr': 'TIER.MicroCreditsAbbrev',
  },
  "u": {
    'toCredit': 10000,
    'name': 'TIER.Units',
    'abbr': 'TIER.UnitsAbbrev',
  },
};

EDRPG.ranks = {
  'harmless': {
    'name': 'RANK.Harmless',
    'minRankPoints': 0,
    'maxRankPoints': 7,
    'skillCap': 40,
    'karmaPoints': 10,
    'karmaCap': 3,
    'endurance': 20,
  },
  'mostlyharmless': {
    'name': 'RANK.MostlyHarmless',
    'minRankPoints': 8,
    'maxRankPoints': 19,
    'skillCap': 50,
    'karmaPoints': 11,
    'karmaCap': 4,
    'endurance': 25,
  },
  'novice': {
    'name': 'RANK.Novice',
    'minRankPoints': 20,
    'maxRankPoints': 39,
    'skillCap': 55,
    'karmaPoints': 12,
    'karmaCap': 5,
    'endurance': 30,
  },
  'competent': {
    'name': 'RANK.Competent',
    'minRankPoints': 40,
    'maxRankPoints': 69,
    'skillCap': 60,
    'karmaPoints': 13,
    'karmaCap': 6,
    'endurance': 35,
  },
  'expert': {
    'name': 'RANK.Expert',
    'minRankPoints': 70,
    'maxRankPoints': 99,
    'skillCap': 65,
    'karmaPoints': 14,
    'karmaCap': 7,
    'endurance': 40,
  },
  'master': {
    'name': 'RANK.Master',
    'minRankPoints': 100,
    'maxRankPoints': 149,
    'skillCap': 70,
    'karmaPoints': 15,
    'karmaCap': 8,
    'endurance': 45,
  },
  'dangerous': {
    'name': 'RANK.Dangerous',
    'minRankPoints': 150,
    'maxRankPoints': 199,
    'skillCap': 80,
    'karmaPoints': 16,
    'karmaCap': 9,
    'endurance': 50,
  },
  'deadly': {
    'name': 'RANK.Deadly',
    'minRankPoints': 200,
    'maxRankPoints': 299,
    'skillCap': 90,
    'karmaPoints': 17,
    'karmaCap': 10,
    'endurance': 55,
  },
  'elite': {
    'name': 'RANK.Elite',
    'minRankPoints': 300,
    'maxRankPoints': null,
    'skillCap': 100,
    'karmaPoints': 18,
    'karmaCap': 11,
    'endurance': 60,
  }
};

EDRPG.imperialHonoraryRanks = {
  'none': {
    'name': 'RANK.None',
    'socialFactor': 0,
    'unlocks': null,
  },
  'outsider': {
    'name': 'RANK.Imperial.Outsider',
    'socialFactor': 0,
    'unlocks': 'Imperial Eagle',
  },
  'serf': {
    'name': 'RANK.Imperial.Serf',
    'socialFactor': 1,
    'unlocks': 'Imperial Eagle',
  },
  'master': {
    'name': 'RANK.Imperial.Master',
    'socialFactor': 1,
    'unlocks': 'Imperial Eagle, Imperial Courier',
  },
  'squire': {
    'name': 'RANK.Imperial.Squire',
    'socialFactor': 1,
    'unlocks': 'Imperial Eagle, Imperial Courier',
  },
  'knight': {
    'name': 'RANK.Imperial.Knight',
    'socialFactor': 1,
    'unlocks': 'Imperial Eagle, Imperial Courier',
  },
  'lord': {
    'name': 'RANK.Imperial.Lord',
    'socialFactor': 2,
    'unlocks': 'Imperial Eagle, Imperial Courier',
  },
  'baron': {
    'name': 'RANK.Imperial.Baron',
    'socialFactor': 2,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper',
  },
  'viscount': {
    'name': 'RANK.Imperial.Viscount',
    'socialFactor': 2,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper',
  },
  'count': {
    'name': 'RANK.Imperial.Count',
    'socialFactor': 2,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper',
  },
  'earl': {
    'name': 'RANK.Imperial.Earl',
    'socialFactor': 3,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper',
  },
  'marquis': {
    'name': 'RANK.Imperial.Marquis',
    'socialFactor': 3,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper',
  },
  'duke': {
    'name': 'RANK.Imperial.Duke',
    'socialFactor': 3,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper, Imperial Cutter',
  },
  'prince': {
    'name': 'RANK.Imperial.Prince',
    'socialFactor': 3,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper, Imperial Cutter',
  },
  'king': {
    'name': 'RANK.Imperial.King',
    'socialFactor': 4,
    'unlocks': 'Imperial Eagle, Imperial Courier, Imperial Clipper, Imperial Cutter, Imperial Explorer',
  },
};
EDRPG.federationHonoraryRanks = {
  'none': {
    'name': 'RANK.None',
    'socialFactor': 0,
    'unlocks': null,
  },
  'recruit': {
    'name': 'RANK.Federation.Recruit',
    'socialFactor': 0,
    'unlocks': null,
  },
  'cadet': {
    'name': 'RANK.Federation.Cadet',
    'socialFactor': 1,
    'unlocks': null,
  },
  'midshipman': {
    'name': 'RANK.Federation.Midshipman',
    'socialFactor': 1,
    'unlocks': 'Federal Dropship',
  },
  'pettyOfficer': {
    'name': 'RANK.Federation.PettyOfficer',
    'socialFactor': 1,
    'unlocks': 'Federal Dropship',
  },
  'chiefPettyOfficer': {
    'name': 'RANK.Federation.ChiefPettyOfficer',
    'socialFactor': 1,
    'unlocks': 'Federal Dropship, Federal Assault Ship',
  },
  'warrantOfficer': {
    'name': 'RANK.Federation.WarrantOfficer',
    'socialFactor': 2,
    'unlocks': 'Federal Dropship, Federal Assault Ship',
  },
  'ensign': {
    'name': 'RANK.Federation.Ensign',
    'socialFactor': 2,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship',
  },
  'lieutenantCommander': {
    'name': 'RANK.Federation.LieutenantCommander',
    'socialFactor': 2,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship',
  },
  'lieutenant': {
    'name': 'RANK.Federation.Lieutenant',
    'socialFactor': 2,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship',
  },
  'postCommander': {
    'name': 'RANK.Federation.PostCommander',
    'socialFactor': 2,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship',
  },
  'postCaptain': {
    'name': 'RANK.Federation.PostCaptain',
    'socialFactor': 3,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship',
  },
  'rearAdmiral': {
    'name': 'RANK.Federation.RearAdmiral',
    'socialFactor': 3,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship, Federal Corvette',
  },
  'viceAdmiral': {
    'name': 'RANK.Federation.ViceAdmiral',
    'socialFactor': 3,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship, Federal Corvette',
  },
  'admiral': {
    'name': 'RANK.Federation.Admiral',
    'socialFactor': 4,
    'unlocks': 'Federal Dropship, Federal Assault Ship, Federal Gunship, Federal Corvette',
  },
};

EDRPG.skills = {
  "personalCombat": {
    "label": "SHEET.Skills.PersonalCombat",
    "isEvolution": false,
    "skills": {
      "dodge": {
        "type": "Number",
        "label": "SHEET.Skills.PC.Dodge",
        "description": "SHEET.Skills.PC.Dodge.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "energyWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.PC.EnergyWeapons",
        "description": "SHEET.Skills.PC.EnergyWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "fighting": {
        "type": "Number",
        "label": "SHEET.Skills.PC.Fighting",
        "description": "SHEET.Skills.PC.Fighting.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "grenade": {
        "type": "Number",
        "label": "SHEET.Skills.PC.Grenade",
        "description": "SHEET.Skills.PC.Grenade.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "heavyWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.PC.HeavyWeapons",
        "description": "SHEET.Skills.PC.HeavyWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "kineticWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.PC.KineticWeapons",
        "description": "SHEET.Skills.PC.KineticWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "meleeWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.PC.MeleeWeapons",
        "description": "SHEET.Skills.PC.MeleeWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "parry": {
        "type": "Number",
        "label": "SHEET.Skills.PC.Parry",
        "description": "SHEET.Skills.PC.Parry.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      }
    }
  },
  "intelligence": {
    "label": "SHEET.Skills.Intelligence",
    "isEvolution": false,
    "skills": {
      "computer": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Computer",
        "description": "SHEET.Skills.INT.Computer.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "cultureAndLaw": {
        "type": "Number",
        "label": "SHEET.Skills.INT.CultureAndLaw",
        "description": "SHEET.Skills.INT.CultureAndLaw.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "cyber": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Cyber",
        "description": "SHEET.Skills.INT.Cyber.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "medicine": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Medicine",
        "description": "SHEET.Skills.INT.Medicine.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "planetaryKnowledge": {
        "type": "Number",
        "label": "SHEET.Skills.INT.PlanetaryKnowledge",
        "description": "SHEET.Skills.INT.PlanetaryKnowledge.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "science": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Science",
        "description": "SHEET.Skills.INT.Science.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "tactics": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Tactics",
        "description": "SHEET.Skills.INT.Tactics.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "trading": {
        "type": "Number",
        "label": "SHEET.Skills.INT.Trading",
        "description": "SHEET.Skills.INT.Trading.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      }
    }
  },
  "social": {
    "isEvolution": false,
    "label": "SHEET.Skills.SocialSkills",
    "skills": {
      "bargain": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Bargain",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "bluff": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Bluff",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "charm": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Charm",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "diplomacy": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Diplomacy",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "gambling": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Gambling",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "insight": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Insight",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "intimidate": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Intimidate",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "streetwise": {
        "type": "Number",
        "label": "SHEET.Skills.SOC.Streetwise",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      }
    }
  },
  "vehicleSkills": {
    "label": "SHEET.Skills.VehicleSkills",
    "isEvolution": false,
    "skills": {
      "navigation": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.Navigation",
        "description": "SHEET.Skills.VEH.Navigation.Description",
        "isChecked": 0,
        "value": 10,
        "initial": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "repair": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.Repair",
        "description": "SHEET.Skills.VEH.Repair.Description",
        "isChecked": 0,
        "value": 10,
        "initial": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "spaceshipPiloting": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.SpaceshipPiloting",
        "description": "SHEET.Skills.VEH.SpaceshipPiloting.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "spaceshipWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.SpaceshipWeapons",
        "description": "SHEET.Skills.VEH.SpaceshipWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "systems": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.Systems",
        "description": "SHEET.Skills.VEH.Systems.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "vehiclePiloting": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.VehiclePiloting",
        "description": "SHEET.Skills.VEH.VehiclePiloting.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "vehicleWeapons": {
        "type": "Number",
        "label": "SHEET.Skills.VEH.VehicleWeapons",
        "description": "SHEET.Skills.VEH.VehicleWeapons.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      }
    }
  },
  "espionage": {
    "label": "SHEET.Skills.Espionage",
    "isEvolution": false,
    "skills": {
      "athletics": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.Athletics",
        "description": "SHEET.Skills.ESP.Athletics.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "perception": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.Perception",
        "description": "SHEET.Skills.ESP.Perception.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "security": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.Security",
        "description": "SHEET.Skills.ESP.Security.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "sleightOfHand": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.SleightOfHand",
        "description": "SHEET.Skills.ESP.SleightOfHand.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "stealth": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.Stealth",
        "description": "SHEET.Skills.ESP.Stealth.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      },
      "survival": {
        "type": "Number",
        "label": "SHEET.Skills.ESP.Survival",
        "description": "SHEET.Skills.ESP.Survival.Description",
        "initial": 10,
        "isChecked": 0,
        "value": 10,
        "bonus": 1,
        "maxCapModifier": 0
      }
    }
  },
  "evolution": {
    "label": "SHEET.Skills.Evolution",
    "isEvolution": true,
    "skills": {}
  }
};
EDRPG.skillsCategories = {
  "personalCombat": {
    "label": "SHEET.Skills.PersonalCombat",
    "isEvolution": false,
    "skills": {
    }
  },
  "intelligence": {
    "label": "SHEET.Skills.Intelligence",
    "isEvolution": false,
    "skills": {
    }
  },
  "social": {
    "isEvolution": false,
    "label": "SHEET.Skills.SocialSkills",
    "skills": {
    }
  },
  "vehicleSkills": {
    "label": "SHEET.Skills.VehicleSkills",
    "isEvolution": false,
    "skills": {
    }
  },
  "espionage": {
    "label": "SHEET.Skills.Espionage",
    "isEvolution": false,
    "skills": {
    }
  },
  "evolution": {
    "label": "SHEET.Skills.Evolution",
    "isEvolution": true,
    "skills": {}
  }
};

EDRPG.backgroundBonusTypes = {
  "skill": {
    'name': 'ITEM.BackgroundTypeSkill',
  },
  "enhancement": {
    'name': 'ITEM.BackgroundTypeEnhancement',
  },
  "skillSelect": {
    'name': 'ITEM.BackgroundTypeSkillSelect',
  },
  "enhancementSelect": {
    'name': 'ITEM.BackgroundTypeEnhancementSelect',
  },
}

EDRPG.meleeHands = {
  'onehand': {
    'name': 'ITEM.OneHanded'
  },
  'twohand': {
    'name': 'ITEM.TwoHanded'
  },
  'onetwohand': {
    'name': 'ITEM.OneTwoHanded'
  }
}

EDRPG.meleeWeaponsTypes = {
  'fighting': {
    'name': 'ITEM.MeleeWeapons.TypeFighting'
  }
  ,
  'melee': {
    'name': 'ITEM.MeleeWeapons.TypeMelee'
  }
}

EDRPG.rangedWeaponsTypes = {
  'kinetic': {
    'name': 'ITEM.RangedWeapons.TypeKinetic'
  },
  'energy': {
    'name': 'ITEM.RangedWeapons.TypeEnergy'
  },
  'grenade': {
    'name': 'ITEM.RangedWeapons.TypeGrenade'
  },
  'heavyKinetic': {
    'name': 'ITEM.RangedWeapons.TypeHeavyKinetic'
  },
  'heavyEnergy': {
    'name': 'ITEM.RangedWeapons.TypeHeavyEnergy'
  },
  'heavyExplosive': {
    'name': 'ITEM.RangedWeapons.TypeHeavyExplosive'
  },
}

EDRPG.shipTypes = {
  small: {
    name: "SHIPSHEET.ShipTypeSmall",
  },
  medium: {
    name: "SHIPSHEET.ShipTypeMedium",
  },
  large: {
    name: "SHIPSHEET.ShipTypeLarge",
  }
}

EDRPG.landingPadSizes = {
  small: {
    name: "SHIPSHEET.LandingPadSizeSmall",
  },
  medium: {
    name: "SHIPSHEET.LandingPadSizeMedium",
  },
  large: {
    name: "SHIPSHEET.LandingPadSizeLarge",
  }
}

EDRPG.shipWeaponsSizes = {
  1: {
    name: "SHIPSHEET.WeaponSizeSmall",
  },
  2: {
    name: "SHIPSHEET.WeaponSizeMedium",
  },
  3: {
    name: "SHIPSHEET.WeaponSizeLarge",
  },
  4: {
    name: "SHIPSHEET.WeaponSizeHuge",
  }
};

EDRPG.shipWeaponsMountTypes = {
  1: {
    name: "SHIPSHEET.WeaponTypeFixed",
  },
  2: {
    name: "SHIPSHEET.WeaponTypeGimballed",
  },
  3: {
    name: "SHIPSHEET.WeaponTypeTurreted",
  }
};

EDRPG.sizes = {
  small: 1,
  medium: 2,
  large: 3,
  huge: 4,
};

EDRPG.shipComponentClasses = [
  1,2,3,4,5,6,7,8
];
EDRPG.shipComponentTypes = [
  'E','D','C','B','A'
];


export default EDRPG;
