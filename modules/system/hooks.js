import * as initHooks from "../hooks/init.js"
import * as handlebarsHooks from "../hooks/handlebars.js";
import ChatMessageEDRPG from "./ChatMessageEDRPG.js";

export default function registerHooks() {
  initHooks.default();
  handlebarsHooks.default();


  // #if _ENV === "development"
  Hooks.on("renderApplication", (app, html, data) => {
  });
  //#endif
  // v13 renamed renderChatMessage -> renderChatMessageHTML (passes a native
  // HTMLElement instead of jQuery). Both hooks fire in v13, so pick exactly one
  // by version to avoid attaching listeners twice. game.release is only reliable
  // from the init hook onward. $(html) is idempotent for jQuery and wraps a raw
  // element, so activateListeners keeps working in both v12 and v13.
  Hooks.once("init", () => {
    const chatHook = (game.release?.generation ?? 12) >= 13
      ? "renderChatMessageHTML"
      : "renderChatMessage";
    Hooks.on(chatHook, (message, html, data) => {
      ChatMessageEDRPG.activateListeners($(html), message, data);
    });
  });

}
