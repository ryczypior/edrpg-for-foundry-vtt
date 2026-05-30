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

  registerDropHints();
}

/**
 * Drag & drop affordance: while dragging a document, highlight the sheet sections
 * that accept it (`[data-drop-types]`) and dim the others. Drop zones declare the
 * accepted document types in `data-drop-types` (pipe-separated); actors use the
 * sentinel `__actor`.
 */
function registerDropHints() {
  const clear = () => {
    document.body.classList.remove("edrpg-dragging");
    document.querySelectorAll(".edrpg-drop-valid, .edrpg-drop-dim")
      .forEach(el => el.classList.remove("edrpg-drop-valid", "edrpg-drop-dim"));
  };

  const apply = (dragType) => {
    document.querySelectorAll(".application.edrpg-v2 [data-drop-types]").forEach(zone => {
      const accepts = (zone.dataset.dropTypes || "").split("|").map(s => s.trim());
      zone.classList.add(accepts.includes(dragType) ? "edrpg-drop-valid" : "edrpg-drop-dim");
    });
  };

  const typeOf = (doc) => {
    if (!doc) return null;
    return (doc.documentName === "Actor") ? "__actor" : (doc.type ?? null);
  };

  document.addEventListener("dragstart", async (event) => {
    let dragType = null;
    try {
      // 1) dataTransfer payload (when Foundry has already set it).
      let payload = null;
      try { payload = JSON.parse(event.dataTransfer.getData("text/plain")); } catch (e) { /* not set yet */ }

      // 2) Fall back to the dragged element's dataset (more reliable / timing-safe).
      const el = event.target?.closest?.("[data-uuid], [data-document-id], [data-entry-id]");
      const uuid = payload?.uuid ?? el?.dataset?.uuid;
      const id = el?.dataset?.documentId ?? el?.dataset?.entryId;

      if (payload?.type === "Actor") dragType = "__actor";
      else if (uuid) dragType = typeOf(await fromUuid(uuid));
      else if (id) dragType = typeOf(game.items.get(id) ?? game.actors.get(id));
    } catch (e) {
      return;
    }
    if (!dragType) return;
    document.body.classList.add("edrpg-dragging");
    apply(dragType);
  });

  document.addEventListener("dragend", clear);
  document.addEventListener("drop", clear);
}
