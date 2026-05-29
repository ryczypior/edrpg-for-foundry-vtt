/**
 * Foundry v13 compatibility shims.
 *
 * In v13 several globals moved into namespaces (backwards-compatible support is
 * scheduled for removal in v15). These helpers resolve the new location when
 * present and fall back to the legacy global so v12 keeps working.
 *
 * IMPORTANT: the system bundle is loaded as a classic script (system.json
 * `scripts`), so any top-level identifier becomes a global. These functions are
 * therefore suffixed `*Compat` to avoid clashing with Foundry's own globals of
 * the same name (loadTemplates / renderTemplate / getTemplate). Import them with
 * an alias, e.g. `import { renderTemplateCompat as renderTemplate } from ...`.
 *
 * Note: foundry.utils.* helpers (mergeObject, duplicate, expandObject, …) have
 * existed since v10, so those call sites use `foundry.utils.*` directly and do
 * not need a shim here.
 */

const handlebars = () => foundry.applications?.handlebars;

export function loadTemplatesCompat(...args) {
  return (handlebars()?.loadTemplates ?? globalThis.loadTemplates)(...args);
}

export function renderTemplateCompat(...args) {
  return (handlebars()?.renderTemplate ?? globalThis.renderTemplate)(...args);
}

export function getTemplateCompat(...args) {
  return (handlebars()?.getTemplate ?? globalThis.getTemplate)(...args);
}

/** v13: foundry.applications.ux.TextEditor — falls back to the legacy global. */
export function getTextEditor() {
  return foundry.applications?.ux?.TextEditor ?? globalThis.TextEditor;
}
