// DEVE essere il PRIMO import di chronos-card.ts: gli import degli screen
// registrano i custom element al load, e questo shim va installato prima.
//
// Perché esiste: se il bundle viene caricato due volte (resource Lovelace
// /local + add_extra_js_url, oppure una copia vecchia in cache della
// companion app accanto a quella fresca), il secondo customElements.define
// con lo stesso nome lancia "already defined" e abbatte l'intero script a
// metà, lasciando la card in uno stato inconsistente. Qui rendiamo define
// idempotente per i SOLI elementi chronos-*: la prima definizione vince,
// le successive sono no-op con un warning in console. Gli elementi di
// altre card non vengono toccati.
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
