# Architecture Rulebook

## ⚠️ Complexity Risks
- New modules should not be created for one-off template styling, copy, or minor layout differences.
- Workflows should not become a general-purpose behavior bucket; if a concern belongs to a domain, it should live in a module or config object.
- The builder core must never branch on `templateId` or module ID values to implement special cases.
- Validation should be centralized in workflows and modules, not split unpredictably between the builder and template definitions.

## 🧩 Module Control Strategy
- Allow a new module only when a new domain of behavior is required, not when the difference is purely stylistic or copy-related.
- Do not create modules for:
  - theme variants
  - single-template formatting
  - localized copy
  - narrow event label changes
- Use semantic module IDs like `events.standard`, `media.luxury`, `ceremony.standard`, `custom.minimalist`.
- Avoid template-specific module IDs like `events.nikah` or `media.royal-maroon`.
- Version modules explicitly when behavior changes incompatibly: `events.standard.v2`.
- Before adding a module, prefer configuration extensions on an existing module.

## 📦 Workflow Boundaries
- Workflows MUST contain:
  - `steps` and step visibility rules
  - module selection references
  - template-specific validation rules
  - payment plan configuration
  - feature gating such as `allowTemplateSwitching`
- Workflows MUST NEVER contain:
  - event visibility logic or event label metadata (belongs in `events` module)
  - ceremony naming logic (belongs in `ceremony` module)
  - media rules and validation (belongs in `media` module)
  - translation or language copy logic (belongs in `language` module)
  - UI rendering decisions, template ID switches, or core navigation behavior
- Keep workflow definitions declarative and minimal.

## 🔧 Simplification Suggestions
- Remove any unused workflow fields and module interface methods.
- If a module method is unused by the builder, remove it from the interface.
- Prefer plain config objects over new abstractions.
- Keep `InvitationBuilder` and `renderDynamicStep()` generic: they should only consume workflow steps and module-driven rendering props.
- Avoid adding builder-level helpers for template-specific behavior; let workflows and modules handle it.

## 📜 Final Rulebook
### Architecture rules
- The builder core must only orchestrate workflows and render steps.
- Template-specific behavior belongs in workflow config or module implementations.
- No hardcoded template IDs in the core code.

### Module rules
- A module exists for a domain, not a template.
- Module IDs are domain-qualified, not template-qualified.
- Reuse an existing module and extend it with config before creating a new one.
- Version a module only when behavior is broadly incompatible.

### Workflow rules
- A workflow may define steps, modules, validation, and payment.
- A workflow may not implement domain logic already covered by modules.
- A workflow may not contain UI or layout logic.
- All templates must have a workflow and valid module references.

### Developer rules
- If a change affects only one template, first ask: can this be solved with config?
- Keep modules small, explicit, and reusable.
- Keep workflows as data, not as code.
- Document new modules and workflow patterns at the time of creation.
