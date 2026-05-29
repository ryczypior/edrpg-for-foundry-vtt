export default class EDRPGUtils {
  static findActorById(id) {
    return game.actors.find(actor => actor.id == id);
  }

  static async findItemByInternalID(internalId, type = null) {
    /** Search local items first */
    let item = game.items.find(item => {
      let additionalCondition = true;
      if (type !== null) {
        additionalCondition = item && item.type === type;
      }
      return item.system.internalId && item.system.internalId.value && item.system.internalId.value.toLowerCase() === internalId.toLowerCase() && additionalCondition;
    });
    if (item) {
      return item;
    }
    /** search in compendium */
    const packs = Array.from(game.packs.keys());
    for(let x = 0; x < packs.length; x++){
      if(/^edrpg/.test(packs[x])){
        let packItems = await game.packs.get(packs[x]).getDocuments();
        let item = packItems.find((itemDocument) => {
          const item = itemDocument.toObject();
          let additionalCondition = true;
          if (type !== null) {
            additionalCondition = item && item.type === type;
          }
          return item.system.internalId && item.system.internalId.value && item.system.internalId.value.toLowerCase() === internalId.toLowerCase() && additionalCondition;
        });
        if (item) {
          return item;
        }
      }
    }
    if(type === null){
      type = game.i18n.localize('ITEM.Any');
    }
    ui.notifications.warn(game.i18n.format('WARN.ItemNotFound', {internalId, type}));
    /** item not found */
    return null;
  }

  static async findItemsByType(type) {
    /** Search local items first */
    let items = {};
    game.items.forEach(item => {
      if(item.type && item.type === type){
        items[item.system.internalId.value] = foundry.utils.duplicate(item);
      }
    });
    /** search in compendium */
    const packs = Array.from(game.packs.keys());
    for(let x = 0; x < packs.length; x++){
      if(/edrpg/.test(packs[x])){
        let packItems = await game.packs.get(packs[x]).getDocuments();
        packItems.forEach(item => {
          if(item.type === type){
            items[item.system.internalId.value] = foundry.utils.duplicate(item);
          }
        });
      }
    }
    return items;
  }

  static isEmpty(value){
    if(!value){
      return true;
    }
    if(value === "" || value === 0 || value === "0"){
      return true;
    }
    return false
  }
}
