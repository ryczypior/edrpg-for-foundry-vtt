import EDRPGTests from "../tests/EDRPGTests";
import EDRPGUtils from "./EDRPGUtils";
import { renderTemplateCompat as renderTemplate } from "./compat.js";

export default class ChatMessageEDRPG {
  static async activateListeners (html, message, data){
    html.find('.reroll').click(ev => ChatMessageEDRPG._onReRollClick(ev, message, data));
    html.find('.edit-roll').click(ev => ChatMessageEDRPG._onEditRollClick(ev, message, data));
  }

  static async _onReRollClick(event, message, data){
    const actor = EDRPGUtils.findActorById(message.flags.actor._id);
    if(!actor){
      ui.notifications.warn(game.i18n.localize('CHAT.ActorNotFound'));
      return;
    }
    const status = foundry.utils.duplicate(actor._source.system.status);
    if(status.karma.value <= 0){
      ui.notifications.warn(game.i18n.localize('CHAT.NoKarmaPoints'));
      return;
    }
    status.karma.value = status.karma.value - 1;
    await actor.update({"system.status": status});
    const templateData = {
      title: game.i18n.localize('CHAT.ReRollUsingKarmaTitle'),
      message: game.i18n.format('CHAT.ReRollUsingKarmaMessage', {actorName: actor.name, testName: game.i18n.localize(message.flags.roll.testName)}),
      actorName: actor.name,
      actorImage: actor.img,
    };
    let html = await renderTemplate("/systems/edrpg/templates/chat/message.html", templateData);
    const chatOptions = {
      content: html,
      type: 0,
      user: game.user.id,
      speaker: ChatMessage.getSpeaker(actor.speakerData()),
    };
    await ChatMessage.create(chatOptions);
    const rollData = {...message.flags.roll};
    rollData.reroll = true;
    const test = new EDRPGTests(rollData, message.flags.actor);
    test.roll();
  }

  static async _onEditRollClick(event, message, data) {
    // Create a dialog to input a new roll value
    const rollData = foundry.utils.duplicate(message.flags.roll);
    const actor = message.flags.actor;

    const DialogV2 = foundry.applications.api.DialogV2;
    await DialogV2.wait({
      window: { title: game.i18n.localize("CHAT.EditRoll") || "Edit Roll" },
      content: `
        <form>
          <div class="form-group">
            <label>New Roll Value:</label>
            <input type="number" name="rollValue" value="${rollData.roll}" min="1" max="10">
          </div>
        </form>
      `,
      rejectClose: false,
      buttons: [
        {
          action: "submit",
          icon: "fas fa-check",
          label: game.i18n.localize("CHAT.Submit") || "Submit",
          default: true,
          callback: async (clickEvent, button, dialog) => {
            const input = dialog.element.querySelector('[name="rollValue"]');
            const newRollValue = parseInt(input?.value, 10);

            // Update the roll value in the message flags
            rollData.roll = newRollValue;

            // Create a new test with the updated roll value
            const test = new EDRPGTests(rollData, actor);

            // Show the updated test result
            await test.showTest();
          }
        },
        {
          action: "cancel",
          icon: "fas fa-times",
          label: game.i18n.localize("CHAT.Cancel") || "Cancel"
        }
      ]
    });
  }


}
