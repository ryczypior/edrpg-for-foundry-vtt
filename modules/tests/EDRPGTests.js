import EDRPGUtils from "../system/EDRPGUtils";
import { renderTemplateCompat as renderTemplate } from "../system/compat.js";

export default class EDRPGTests {
  constructor(data, actor) {
    if (!data) {
      data = {};
    }
    /**
     *
     * @type [{}]
     */
    this.difficultyNumbers = [
      { number: 1, difficultyType: game.i18n.localize("TEST.ChildishlySimple")},
      { number: 2, difficultyType: game.i18n.localize("TEST.ChildishlySimple")},
      { number: 3, difficultyType: game.i18n.localize("TEST.VeryEasy")},
      { number: 4, difficultyType: game.i18n.localize("TEST.VeryEasy")},
      { number: 5, difficultyType: game.i18n.localize("TEST.VeryEasy")},
      { number: 6, difficultyType: game.i18n.localize("TEST.Easy")},
      { number: 7, difficultyType: game.i18n.localize("TEST.Easy")},
      { number: 8, difficultyType: game.i18n.localize("TEST.Easy")},
      { number: 9, difficultyType: game.i18n.localize("TEST.Average")},
      { number: 10, difficultyType: game.i18n.localize("TEST.Average")},
      { number: 11, difficultyType: game.i18n.localize("TEST.Average")},
      { number: 12, difficultyType: game.i18n.localize("TEST.Hard")},
      { number: 13, difficultyType: game.i18n.localize("TEST.Hard")},
      { number: 14, difficultyType: game.i18n.localize("TEST.Hard")},
      { number: 15, difficultyType: game.i18n.localize("TEST.VeryHard")},
      { number: 16, difficultyType: game.i18n.localize("TEST.VeryHard")},
      { number: 17, difficultyType: game.i18n.localize("TEST.VeryHard")},
      { number: 18, difficultyType: game.i18n.localize("TEST.AlmostImpossible")},
      { number: 19, difficultyType: game.i18n.localize("TEST.AlmostImpossible")},
      { number: 20, difficultyType: game.i18n.localize("TEST.AlmostImpossible")},
    ];
    this.callback = data.callback;
    this.actor = actor;
    this.data = {
      title: data.title,
      test: data.test,
      roll: data.roll,
      testName: data.testName,
      difficulty: data.difficulty,
      bonus: data.bonus,
      bonusModifier: data.bonusModifier,
      rollMode: data.rollMode,
      reroll: data.reroll || false,
      messageId: data.messageId,
      speaker: data.speaker,
      targets: data.targets,
      opposedMessageIds: data.opposedMessageIds || [],
    }
    if (this.data.speaker && this.actor.isOpposing && this.data.targets.length) {
      ui.notifications.notify(game.i18n.localize("TEST.TargetingCancelled"))
      this.data.targets = [];
    }

    if (!this.data.speaker && actor) {
      this.data.speaker = actor.speakerData();
    }
  }

  /**
   * Add support for the Dice So Nice module
   * @param {Object} roll
   * @param {String} rollMode
   */
  async _showDiceSoNice(roll, rollMode, speaker) {
    if (game.modules.get("dice-so-nice") && game.modules.get("dice-so-nice").active) {

      if (game.settings.get("dice-so-nice", "hideNpcRolls")) {
        let actorType = null;
        if (speaker.actor)
          actorType = game.actors.get(speaker.actor).type;
        else if (speaker.token && speaker.scene)
          actorType = game.scenes.get(speaker.scene).tokens.get(speaker.token).actor.type;
        if (actorType != "character")
          return;
      }

      let whisper = null;
      let blind = false;
      let sync = true;
      switch (rollMode) {
        case "blindroll": //GM only
          blind = true;
        case "gmroll": //GM + rolling player
          let gmList = game.users.filter(user => user.isGM);
          let gmIDList = [];
          gmList.forEach(gm => gmIDList.push(gm.id));
          whisper = gmIDList;
          break;
        case "selfroll":
          sync = false;
          break;
        case "roll": //everybody
          let userList = game.users.filter(user => user.active);
          let userIDList = [];
          userList.forEach(user => userIDList.push(user.id));
          whisper = userIDList;
          break;
      }
      await game.dice3d.showForRoll(roll, game.user, sync, whisper, blind);
    }
  }

  async roll() {
    let roll = await new Roll(this.data.test).roll({async: true});
    await this._showDiceSoNice(roll, this.data.rollMode || "roll", this.data.speaker);
    this.data.roll = roll.total;
    if(this.callback){
      await this.callback();
    }
    await this.showTest();
  }

  async _onDifficultyClick(event){
    if(event && event.preventDefault){
      event.preventDefault();
    }
    this.data.difficulty = parseInt(event.target.getAttribute('data-difficulty'), 10);
    event.target.parentNode.querySelectorAll('.difficulty-button').forEach(node => {
      node.classList.remove('selected');
    });
    event.target.classList.add('selected');
  }

  async _onBonusChange(event){
    this.data.bonusModifier = parseInt(event.target.value, 10);
  }

  async _onRollModeChange(event){
    this.data.rollMode = event.target.value;
  }

  activateListeners(html){
    html.find('.difficulty-button').click(this._onDifficultyClick.bind(this));
    html.find('.bonusModifier').change(this._onBonusChange.bind(this));
    html.find('.roll-mode').change(this._onRollModeChange.bind(this));
  }

  async showTest(){
    const canReRoll = game.settings.get('edrpg', 'allowToRerollAllTests') || parseInt(this.data.roll, 10) === 1;
    const templateData = {
      title: this.data.title,
      difficulty: this.data.difficulty,
      bonus: parseInt(this.data.bonus, 10),
      bonusModifier: parseInt(this.data.bonusModifier, 10),
      roll: parseInt(this.data.roll, 10),
      result: parseInt(this.data.roll) + parseInt(this.data.bonusModifier, 10) + parseInt(this.data.bonus,10),
      actorName: this.actor ? this.actor.name : null,
      actorImage: this.actor ? this.actor.img : null,
      isPassed: true,
      isCritical: false,
      canReRoll: canReRoll,
    };
    templateData.isPassed = templateData.result >= templateData.difficulty;
    if(templateData.roll === 1){
      templateData.isPassed = false;
      templateData.isCritical = true;
    }
    if(templateData.roll === 10){
      templateData.isPassed = true;
      templateData.isCritical = true;
    }
    let html = await renderTemplate("/systems/edrpg/templates/chat/roll/skill.html", templateData);
    const chatOptions = {
      content: html,
      type: 0,
      sound: CONFIG.sounds.dice,
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(this.data.speaker),
      rollMode: this.data.rollMode,
      flags: { roll: this.data, actor: this.actor },
    };
    if (["gmroll", "blindroll"].includes(chatOptions.rollMode)) {
      chatOptions["whisper"] = ChatMessage.getWhisperRecipients("GM").map(u => u.id);
    }
    if (chatOptions.rollMode === "blindroll") {
      chatOptions["blind"] = true;
    } else if (chatOptions.rollMode === "selfroll") {
      chatOptions["whisper"] = [game.user];
    }
    await ChatMessage.create(chatOptions);
  }

};
