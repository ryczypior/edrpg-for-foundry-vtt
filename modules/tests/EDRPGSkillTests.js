import EDRPGTests from "./EDRPGTests.js";
import { renderTemplateCompat as renderTemplate } from "../system/compat.js";

export default class EDRPGSkillTests extends EDRPGTests {
  constructor(skill, actor) {
    const data = {
      title: game.i18n.format('TEST.SkillCheck', {skill: skill.name}),
      test: '1d10',
      testName: skill.name,
      bonus: Number(skill.system.skill.skillBonus.value),
      difficulty: Number(skill.difficulty),
      bonusModifier: 0,
      callback: skill.callback,
    }
    super(data, actor);
    this.item = skill;
  }


  async prepareTest() {
    const data = {
      skillName: this.item.name,
      skillBonus: Number(this.item.system.skill.skillBonus.value),
      testDifficulty: Number(this.item.difficulty),
      bonusModifier: Number(this.item.bonusModifier),
      difficultyNumbers: this.difficultyNumbers,
    };
    let html = await renderTemplate("/systems/edrpg/templates/tests/skill-test.html", data);

    const DialogV2 = foundry.applications.api.DialogV2;
    return new Promise((resolve) => {
      const dialog = new DialogV2({
        window: { title: this.data.title },
        position: { width: 420 },
        content: html,
        buttons: [
          {
            action: "rollButton",
            label: game.i18n.localize("TEST.Roll"),
            default: true,
            callback: () => resolve(this.roll())
          }
        ]
      });
      // ApplicationV2 emits a "render" lifecycle event; wrap the native root
      // element in jQuery so the shared listener logic keeps working.
      dialog.addEventListener("render", () => this.activateListeners($(dialog.element)));
      dialog.render({ force: true });
    });
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
