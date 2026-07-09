// MUST be the FIRST import of chronos-card.ts: the screen imports
// register their custom elements at load time, and this shim has to be
// installed before that happens.
//
// Why it exists: when the bundle is loaded twice (Lovelace /local
// resource + add_extra_js_url, or a stale cached copy in the companion
// app next to a fresh one), the second customElements.define with the
// same name throws "already defined" and kills the whole script halfway,
// leaving the card in an inconsistent state. Here we make define
// idempotent for chronos-* elements ONLY: the first definition wins,
// later ones are no-ops with a console warning. Other cards' elements
// are untouched.
const origDefine = customElements.define.bind(customElements);
customElements.define = ((
  name: string,
  ctor: CustomElementConstructor,
  options?: ElementDefinitionOptions,
) => {
  if (name.startsWith("chronos-") && customElements.get(name)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Chronos] <${name}> already defined, skipping duplicate registration (bundle loaded twice?)`,
    );
    return;
  }
  origDefine(name, ctor, options);
}) as typeof customElements.define;

export {};
