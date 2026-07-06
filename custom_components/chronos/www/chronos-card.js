function e(e,t,i,a){var s,r=arguments.length,n=r<3?t:null===a?a=Object.getOwnPropertyDescriptor(t,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,a);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(n=(r<3?s(n):r>3?s(t,i,n):s(t,i))||n);return r>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=customElements.define.bind(customElements);customElements.define=(e,i,a)=>{e.startsWith("chronos-")&&customElements.get(e)?console.warn(`[Chronos] <${e}> already defined, skipping duplicate registration (bundle loaded twice?)`):t(e,i,a)};const i=globalThis,a=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const o=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new n(i,e,s)},l=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:d,defineProperty:c,getOwnPropertyDescriptor:u,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:v}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!d(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&c(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:s}=u(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const r=a?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=v(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(l(e))}else void 0!==e&&t.push(l(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(a)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const a of t){const t=document.createElement("style"),s=i.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=a.cssText,e.appendChild(t)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=a;const r=s.fromAttribute(t,e.type);this[a]=r??this._$Ej?.get(a)??r,this._$Em=null}}requestUpdate(e,t,i,a=!1,s){if(void 0!==e){const r=this.constructor;if(!1===a&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??w)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,_?.({ReactiveElement:k}),(m.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,S=e=>e,A=$.trustedTypes,z=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,C="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+M,I=`<${E}>`,D=document,N=()=>D.createComment(""),B=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,T="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,q=/-->/g,H=/>/g,P=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,W=/"/g,V=/^(?:script|style|textarea|title)$/i,F=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),j=F(1),U=F(2),G=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Z=new WeakMap,K=D.createTreeWalker(D,129);function Q(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const X=(e,t)=>{const i=e.length-1,a=[];let s,r=2===t?"<svg>":3===t?"<math>":"",n=O;for(let t=0;t<i;t++){const i=e[t];let o,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===O?"!--"===l[1]?n=q:void 0!==l[1]?n=H:void 0!==l[2]?(V.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=P):void 0!==l[3]&&(n=P):n===P?">"===l[0]?(n=s??O,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?P:'"'===l[3]?W:L):n===W||n===L?n=P:n===q||n===H?n=O:(n=P,s=void 0);const u=n===P&&e[t+1].startsWith("/>")?" ":"";r+=n===O?i+I:d>=0?(a.push(o),i.slice(0,d)+C+i.slice(d)+M+u):i+M+(-2===d?t:u)}return[Q(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class Y{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let s=0,r=0;const n=e.length-1,o=this.parts,[l,d]=X(e,t);if(this.el=Y.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=K.nextNode())&&o.length<n;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(C)){const t=d[r++],i=a.getAttribute(e).split(M),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:s,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?re:"@"===n[1]?ne:ae}),a.removeAttribute(e)}else e.startsWith(M)&&(o.push({type:6,index:s}),a.removeAttribute(e));if(V.test(a.tagName)){const e=a.textContent.split(M),t=e.length-1;if(t>0){a.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],N()),K.nextNode(),o.push({type:2,index:++s});a.append(e[t],N())}}}else if(8===a.nodeType)if(a.data===E)o.push({type:2,index:s});else{let e=-1;for(;-1!==(e=a.data.indexOf(M,e+1));)o.push({type:7,index:s}),e+=M.length-1}s++}}static createElement(e,t){const i=D.createElement("template");return i.innerHTML=e,i}}function ee(e,t,i=e,a){if(t===G)return t;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const r=B(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(t=ee(e,s._$AS(e,t.values),s,a)),t}class te{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??D).importNode(t,!0);K.currentNode=a;let s=K.nextNode(),r=0,n=0,o=i[0];for(;void 0!==o;){if(r===o.index){let t;2===o.type?t=new ie(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new oe(s,this,e)),this._$AV.push(t),o=i[++n]}r!==o?.index&&(s=K.nextNode(),r++)}return K.currentNode=D,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ie{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ee(this,e,t),B(e)?e===J||null==e||""===e?(this._$AH!==J&&this._$AR(),this._$AH=J):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==J&&B(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Y.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new te(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new Y(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const s of e)a===t.length?t.push(i=new ie(this.O(N()),this.O(N()),this,this.options)):i=t[a],i._$AI(s),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=S(e).nextSibling;S(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ae{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,s){this.type=1,this._$AH=J,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(e,t=this,i,a){const s=this.strings;let r=!1;if(void 0===s)e=ee(this,e,t,0),r=!B(e)||e!==this._$AH&&e!==G,r&&(this._$AH=e);else{const a=e;let n,o;for(e=s[0],n=0;n<s.length-1;n++)o=ee(this,a[i+n],t,n),o===G&&(o=this._$AH[n]),r||=!B(o)||o!==this._$AH[n],o===J?e=J:e!==J&&(e+=(o??"")+s[n+1]),this._$AH[n]=o}r&&!a&&this.j(e)}j(e){e===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ae{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===J?void 0:e}}class re extends ae{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==J)}}class ne extends ae{constructor(e,t,i,a,s){super(e,t,i,a,s),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??J)===G)return;const i=this._$AH,a=e===J&&i!==J||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==J&&(i===J||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const le=$.litHtmlPolyfillSupport;le?.(Y,ie),($.litHtmlVersions??=[]).push("3.3.2");const de=globalThis;class ce extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let s=a._$litPart$;if(void 0===s){const e=i?.renderBefore??null;a._$litPart$=s=new ie(t.insertBefore(N(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}ce._$litElement$=!0,ce.finalized=!0,de.litElementHydrateSupport?.({LitElement:ce});const ue=de.litElementPolyfillSupport;ue?.({LitElement:ce}),(de.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:w},ve=(e=he,t,i)=>{const{kind:a,metadata:s}=i;let r=globalThis.litPropertyMetadata.get(s);if(void 0===r&&globalThis.litPropertyMetadata.set(s,r=new Map),"setter"===a&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===a){const{name:a}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(a,s,e,!0,i)},init(t){return void 0!==t&&this.C(a,void 0,e,t),t}}}if("setter"===a){const{name:a}=i;return function(i){const s=this[a];t.call(this,i),this.requestUpdate(a,s,e,!0,i)}}throw Error("Unsupported decorator location: "+a)};function me(e){return(t,i)=>"object"==typeof i?ve(e,t,i):((e,t,i)=>{const a=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),a?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function fe(e){return me({...e,state:!0,attribute:!1})}const ge=o`
  :host {
    display: block;
    height: 100%;
    box-sizing: border-box;
  }
  /* Lovelace "panel" view: HA gives us the full viewport height and overlays
   * its app bar on top of the card instead of pushing it below. Without
   * compensating padding our sidebar and topbar sit at y=0 of the viewport,
   * directly under (and visually overlapping) the HA app bar. The host
   * element exposes a panel-mode attribute set by chronos-card.ts when
   * runtime detection identifies this layout; the padding then offsets the
   * card content by the app bar height. */
  :host([panel-mode]) {
    padding-top: var(--chronos-panel-offset, var(--header-height, 56px));
  }
  :host {
    --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

    /* Chrome — follow HA theme. Layered cascade for max compatibility:
     *   --ha-card-background → --card-background-color → --primary-background-color
     * so themes that only define one of those still work. Our oklch values are
     * the final fallback for installations without theme tokens. */
    --bg: var(--ha-card-background, var(--card-background-color, var(--primary-background-color, oklch(0.985 0.004 85))));
    --bg-soft: var(--secondary-background-color, var(--primary-background-color, oklch(0.965 0.005 85)));
    --bg-sunken: var(--primary-background-color, var(--secondary-background-color, oklch(0.945 0.006 85)));
    --surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    --border: var(--divider-color, oklch(0.90 0.006 85));
    --border-soft: var(--divider-color, oklch(0.93 0.005 85));
    --text: var(--primary-text-color, oklch(0.22 0.012 85));
    --text-soft: var(--secondary-text-color, oklch(0.42 0.012 85));
    --text-muted: var(--disabled-text-color, var(--secondary-text-color, oklch(0.60 0.010 85)));

    /* Accent — Chronos identity. Stay our oklch (with HA accent as soft override
     * for users who want their theme accent to influence Chronos too). */
    --accent: var(--accent-color, oklch(0.55 0.15 265));
    --accent-soft: oklch(0.93 0.04 265);
    --accent-ink: oklch(0.35 0.15 265);
    --weather: oklch(0.72 0.15 65);
    --weather-soft: oklch(0.95 0.04 65);
    --weather-ink: oklch(0.48 0.15 65);

    /* Semantic — keep ours for consistency */
    --ok: var(--success-color, oklch(0.65 0.14 155));
    --warn: var(--warning-color, oklch(0.72 0.15 65));
    --danger: var(--error-color, oklch(0.60 0.18 25));
    --info: var(--info-color, oklch(0.60 0.13 230));

    /* Block kind colors — Chronos identity, never change */
    --mode-eco: oklch(0.70 0.12 155);
    --mode-comfort: oklch(0.55 0.15 265);
    --mode-boost: oklch(0.62 0.20 30);
    --mode-night: oklch(0.45 0.10 280);
    --mode-off: oklch(0.70 0.01 85);

    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 16px;
    --r-xl: 22px;
    --r-pill: 999px;

    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);

    --block-edge: var(--primary-text-color, #000);

    --density-pad: 16px;
    --density-gap: 16px;
    --row-h: 56px;

    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.45;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  :host([density="compact"]) {
    --density-pad: 10px;
    --density-gap: 10px;
    --row-h: 44px;
  }
`,_e=o`
  :host { display: block; }

  * { box-sizing: border-box; }
  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; padding: 0; }
  input, textarea, select { outline: none; }

  .mono { font-family: var(--font-mono); font-feature-settings: "tnum" 1; }

  /* App shell */
  .app {
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 600px;
    height: 100%;
    background: var(--bg);
    border-radius: var(--r-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    position: relative;
    /* Establish a fresh stacking context so position:sticky / absolute /
     * z-index children (sidebar, topbar, drawers) can't escape the card
     * boundary in browsers where border-radius + overflow:hidden alone
     * fails to clip composited layers (Safari / iOS WebKit notably). */
    isolation: isolate;
    /* Belt-and-braces clipping: inset rounds defeat Safari's known
     * issue where overflow:hidden doesn't clip transform-promoted or
     * sticky descendants against the rounded corners. */
    clip-path: inset(0 round var(--r-lg));
  }

  .sidebar {
    width: 244px;
    background: var(--bg-soft);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    /* Extra top padding so the brand icon sits below the visual line of
     * the topbar / HA app header on tablet and mobile. Reported overlap on
     * narrow devices when the card edge-to-edge against the HA app bar. */
    padding: 24px 14px 18px;
    gap: 4px;
    min-height: 0;
    overflow-y: auto;
    position: relative;
    z-index: 30;
    transition: width 180ms ease;
  }
  .sidebar[data-mode="mini"] {
    width: 64px;
    padding: 18px 8px 14px;
    align-items: center;
  }
  .sidebar[data-mode="drawer"] {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 244px;
    box-shadow: 0 0 30px rgba(0,0,0,0.18);
  }
  .sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.32);
    z-index: 25;
    backdrop-filter: blur(2px);
  }
  .sidebar__hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; margin-bottom: 6px;
    border-radius: var(--r-md);
    color: var(--text-soft);
    transition: background 120ms, color 120ms;
  }
  .sidebar__hamburger:hover { background: var(--bg-sunken); color: var(--text); }
  .sidebar[data-mode="mini"] .sidebar__hamburger { align-self: center; }

  .sidebar__brand {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 8px 18px;
    border-bottom: 1px solid var(--border-soft);
    margin-bottom: 10px;
  }
  .sidebar[data-mode="mini"] .sidebar__brand {
    padding: 6px 0 14px;
    border-bottom: 1px solid var(--border-soft);
    margin-bottom: 8px;
    width: 100%; justify-content: center;
  }
  .sidebar[data-mode="mini"] .nav-item {
    width: 40px; height: 40px;
    padding: 0;
    justify-content: center;
    gap: 0;
  }
  .sidebar[data-mode="mini"] .sidebar__footer {
    padding-top: 10px; align-items: center;
  }
  .sidebar__brand-mark {
    width: 30px; height: 30px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), var(--weather));
    display: grid; place-items: center; color: white;
    font-weight: 700; font-size: 13px; letter-spacing: -0.02em;
    box-shadow: var(--shadow-sm);
  }
  .sidebar__brand-name { font-weight: 600; letter-spacing: -0.01em; font-size: 15px; }
  .sidebar__brand-sub { color: var(--text-muted); font-size: 11px; font-family: var(--font-mono); margin-top: 2px; }

  .nav-section { padding: 14px 8px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 10px;
    border-radius: var(--r-md);
    color: var(--text-soft); font-size: 13.5px; font-weight: 500;
    text-align: left;
    transition: background 120ms, color 120ms;
  }
  .nav-item:hover { background: var(--bg-sunken); color: var(--text); }
  .nav-item[data-active="true"] {
    background: var(--accent-soft); color: var(--accent-ink); font-weight: 600;
  }
  .nav-item svg { width: 16px; height: 16px; flex: none; }

  .sidebar__footer { margin-top: auto; display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid var(--border-soft); }

  /* Content area */
  .content { overflow: auto; min-height: 0; position: relative; }
  .content__inner { padding: 28px 36px 60px; max-width: 1400px; margin: 0 auto; }

  .topbar {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; gap: 14px;
    padding: 14px 36px;
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: saturate(1.2) blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }
  .topbar__title { font-size: 18px; font-weight: 600; letter-spacing: -0.015em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .topbar__crumbs { color: var(--text-muted); font-size: 12.5px; font-family: var(--font-mono); }
  .topbar__spacer { flex: 1; }
  .topbar__time {
    font-family: var(--font-mono); font-size: 13px; color: var(--text-soft);
    background: var(--bg-sunken); padding: 6px 10px; border-radius: var(--r-md);
    border: 1px solid var(--border-soft);
    display: flex; align-items: center; gap: 8px;
  }
  .time-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent); }

  .page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 4px; }
  .page-sub { color: var(--text-muted); font-size: 14px; margin: 0 0 22px; }

  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: var(--density-pad);
    box-shadow: var(--shadow-xs);
    /* Same reason as the forecast row: as a flex item inside .col, the
     * default min-width auto equals min-content and can blow the card out
     * of the parent width when its inner content (a long horizontal strip,
     * a wide table, etc.) doesn't shrink. Setting min-width:0 lets the
     * card honour its parent's bounds. */
    min-width: 0;
  }
  .card--pad-lg { padding: 22px; }
  .card--ghost { background: var(--bg-soft); }
  .card__header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .card__title { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; margin: 0; }
  .card__sub { color: var(--text-muted); font-size: 12.5px; margin: 2px 0 0; }

  /* Button */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: var(--r-md);
    border: 1px solid var(--border); background: var(--surface);
    font-size: 13px; font-weight: 500; color: var(--text);
    transition: background 120ms, border-color 120ms, transform 60ms;
  }
  .btn:hover { background: var(--bg-soft); }
  .btn:active { transform: translateY(1px); }
  .btn--primary { background: var(--accent); color: white; border-color: transparent; box-shadow: var(--shadow-sm); }
  .btn--primary:hover { background: color-mix(in srgb, var(--accent) 90%, black); }
  .btn--ghost { border-color: transparent; background: transparent; color: var(--text-soft); }
  .btn--ghost:hover { background: var(--bg-sunken); color: var(--text); }
  .btn--sm { padding: 5px 10px; font-size: 12px; }
  .btn--icon { padding: 8px; }
  .btn svg { width: 16px; height: 16px; }

  /* Chip */
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 3px 9px; border-radius: var(--r-pill);
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    color: var(--text-soft); font-size: 11.5px; font-weight: 500;
  }
  .chip--accent { background: var(--accent-soft); color: var(--accent-ink); border-color: transparent; }
  .chip--weather { background: var(--weather-soft); color: var(--weather-ink); border-color: transparent; }
  .chip--on { background: color-mix(in srgb, var(--ok) 15%, transparent); color: var(--ok); border-color: transparent; }
  .chip svg { width: 11px; height: 11px; }
  .chip__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);
    padding: 2px 6px; border-radius: 5px; background: var(--bg-sunken);
  }

  /* Switch */
  .switch { position: relative; display: inline-block; width: 36px; height: 20px; cursor: pointer; }
  .switch input { display: none; }
  .switch__track {
    position: absolute; inset: 0; background: var(--border); border-radius: 999px;
    transition: background 150ms;
  }
  .switch__thumb {
    position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
    background: white; border-radius: 50%;
    transition: transform 180ms cubic-bezier(.2,.8,.2,1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .switch input:checked ~ .switch__track { background: var(--accent); }
  .switch input:checked ~ .switch__thumb { transform: translateX(16px); }

  /* Input */
  .input, .select, .textarea {
    width: 100%; padding: 9px 12px; border-radius: var(--r-md);
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text); font-size: 13px;
    transition: border-color 120ms, box-shadow 120ms;
  }
  .input:focus, .select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
  /* Inline-editable text that must LOOK editable on hover: transparent at
   * rest, border + soft background under the pointer. Pair with an .edit-hint
   * icon in the same .row to make the affordance visible without hovering. */
  .input--ghost { border-color: transparent; background: transparent; }
  .input--ghost:hover { border-color: var(--border); background: var(--bg-soft); }
  .row:hover > .edit-hint, .input--ghost:hover ~ .edit-hint { color: var(--text-soft); }
  .edit-hint { color: var(--text-muted); opacity: 0.7; flex: 0 0 auto; display: inline-flex; cursor: pointer; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field__label { font-size: 12px; font-weight: 500; color: var(--text-soft); }
  .field__hint { font-size: 11.5px; color: var(--text-muted); }

  /* Segmented */
  .segmented {
    display: inline-flex; padding: 3px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); gap: 2px;
  }
  .segmented button {
    padding: 6px 12px; border-radius: 7px; color: var(--text-soft);
    font-size: 12.5px; font-weight: 500;
    transition: background 120ms, color 120ms;
  }
  .segmented button[data-active="true"] {
    background: var(--surface); color: var(--text); box-shadow: var(--shadow-xs);
  }

  .divider { height: 1px; background: var(--border-soft); margin: 16px 0; border: 0; }

  /* Timeline */
  .timeline {
    position: relative; width: 100%; height: 88px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); overflow: hidden; user-select: none;
  }
  .timeline--compact { height: 36px; }
  .timeline--mini { height: 14px; border-radius: 7px; }

  .timeline__hours {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: repeat(24, 1fr);
    pointer-events: none;
  }
  .timeline__hours > div { border-right: 1px solid color-mix(in srgb, var(--border) 50%, transparent); }
  .timeline__hours > div:nth-child(6n+1) { border-right-color: var(--border); }
  .timeline__hours > div:last-child { border-right: 0; }

  .timeline__labels {
    position: absolute; inset: 0; pointer-events: none;
    font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
  }
  .timeline__labels span { position: absolute; bottom: 3px; transform: translateX(-50%); }

  .tl-block {
    position: absolute; top: 6px; bottom: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 8px; font-size: 11.5px; font-weight: 600; color: white;
    overflow: hidden; cursor: grab;
    transition: filter 120ms, box-shadow 120ms;
    border: 1.5px solid var(--block-edge);
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    /* On touch devices the browser by default tries to scroll the page when
     * the finger drags on a non-scrollable element. touch-action: none stops
     * that, so our pointermove drag handlers can actually receive the events
     * and the user can move blocks on phones / tablets. */
    touch-action: none;
  }
  .tl-block:hover { filter: brightness(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
  .tl-block[data-selected="true"] { outline: 2px solid var(--accent); outline-offset: 2px; z-index: 2; }
  .timeline--compact .tl-block { top: 3px; bottom: 3px; font-size: 10.5px; padding: 0 6px; }
  .timeline--mini .tl-block { top: 0; bottom: 0; border-radius: 0; font-size: 0; border-width: 1px; }

  .tl-block__handle {
    position: absolute; top: 0; bottom: 0; width: 6px;
    cursor: ew-resize; background: rgba(255,255,255,0.0);
    transition: background 120ms;
  }
  .tl-block__handle:hover { background: rgba(255,255,255,0.25); }
  .tl-block__handle--l { left: 0; border-radius: 6px 0 0 6px; }
  .tl-block__handle--r { right: 0; border-radius: 0 6px 6px 0; }

  .tl-now {
    position: absolute; top: 0; bottom: 0; width: 2px;
    background: var(--danger); pointer-events: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 20%, transparent);
  }
  .tl-now::before {
    content: ""; position: absolute; top: -4px; left: -4px;
    width: 10px; height: 10px; background: var(--danger); border-radius: 50%;
    border: 2px solid var(--bg);
  }

  .tl-weather { position: absolute; top: 0; left: 0; right: 0; height: 6px; }
  .tl-weather__cell { position: absolute; top: 0; bottom: 0; }
  .tl-weather__cell[data-state="rain"] { background: color-mix(in srgb, var(--info) 50%, transparent); }
  .tl-weather__cell[data-state="sun"] { background: color-mix(in srgb, var(--weather) 60%, transparent); }
  .tl-weather__cell[data-state="cloud"] { background: color-mix(in srgb, var(--text-muted) 30%, transparent); }
  .tl-weather__cell[data-state="snow"] { background: color-mix(in srgb, var(--info) 25%, transparent); }

  /* Radial */
  .radial { width: 100%; aspect-ratio: 1; max-width: 520px; margin: 0 auto; display: block; }
  .radial text { font-family: var(--font-mono); fill: var(--text-soft); }
  .radial .radial__label { font-family: var(--font-sans); fill: var(--text); font-weight: 700; }

  /* List timeline */
  .tl-list { display: flex; flex-direction: column; gap: 6px; }
  .tl-list__row {
    display: grid; grid-template-columns: 110px 1fr auto;
    align-items: center; gap: 14px; padding: 10px 12px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); cursor: pointer;
  }
  /* Selezione: mix di accent sul fondo del tema, NON --accent-soft fisso
   * chiaro. --accent-soft senza il suo --accent-ink diventa illeggibile in
   * dark mode (sfondo chiaro + testo chiaro del tema HA). */
  .tl-list__row[data-selected="true"] {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 14%, var(--bg-sunken));
  }
  .tl-list__time { font-family: var(--font-mono); font-size: 13px; color: var(--text); font-weight: 500; }
  .tl-list__mode-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle; }
  .tl-list__mode { font-size: 13px; font-weight: 500; }

  /* Week grid */
  .weekgrid { display: grid; gap: 6px; }
  .weekgrid__row { display: grid; grid-template-columns: 50px 1fr; gap: 8px; align-items: center; }
  .weekgrid__day { font-size: 12px; font-weight: 600; color: var(--text-soft); font-family: var(--font-mono); text-transform: uppercase; }

  /* Schedule card */
  .sched-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px;
    display: flex; flex-direction: column; gap: 14px;
    transition: border-color 120ms, transform 120ms, box-shadow 120ms;
    cursor: pointer;
  }
  .sched-card:hover { border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); box-shadow: var(--shadow-sm); }
  .sched-card[data-selected="true"] { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
  .sched-card__header { display: flex; align-items: center; gap: 12px; }
  .sched-card__title { font-size: 15.5px; font-weight: 600; letter-spacing: -0.01em; margin: 0; flex: 1; }
  .sched-card__sub { color: var(--text-muted); font-size: 12.5px; margin: 2px 0 0; font-family: var(--font-mono); }
  .sched-card__footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sched-card__devices { display: flex; gap: 4px; }
  .device-icon-pill {
    width: 26px; height: 26px; border-radius: 7px;
    background: var(--bg-sunken); display: grid; place-items: center;
    color: var(--text-soft); border: 1px solid var(--border-soft);
  }
  .device-icon-pill svg { width: 14px; height: 14px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--density-gap); }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--density-gap); }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--density-gap); }

  /* Device row */
  .device-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: var(--r-md);
    transition: background 120ms;
  }
  .device-row:hover { background: var(--bg-sunken); }
  .device-row__icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--bg-sunken); display: grid; place-items: center;
    color: var(--text-soft); border: 1px solid var(--border-soft);
    flex-shrink: 0;
  }
  .device-row__icon svg { width: 17px; height: 17px; }
  .device-row__main { flex: 1; min-width: 0; }
  .device-row__name { font-weight: 500; font-size: 13.5px; }
  .device-row__meta { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); }

  /* Rule builder */
  .rule-block {
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); padding: 14px;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .rule-block__label {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    padding: 3px 8px; border-radius: 5px;
  }
  .rule-block__label--if { background: var(--weather-soft); color: var(--weather-ink); }
  .rule-block__label--then { background: var(--accent-soft); color: var(--accent-ink); }
  .rule-token {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 7px; padding: 5px 10px; font-size: 12.5px;
  }
  .rule-token--accent { background: var(--accent-soft); border-color: transparent; color: var(--accent-ink); font-weight: 500; }
  .rule-token--weather { background: var(--weather-soft); border-color: transparent; color: var(--weather-ink); font-weight: 500; }
  /* Drop indicator while reordering rules manually. */
  .rule-block--dragover { box-shadow: inset 0 2px 0 0 var(--accent); }

  /* Sticky action bar for long builder forms: keeps Save/Cancel reachable
   * without scrolling to the very bottom of the page. Sits inside the
   * scrolling .content area, pinned to its bottom edge. */
  .builder-actions {
    position: sticky; bottom: 0; z-index: 5;
    display: flex; justify-content: flex-end; gap: 8px; align-items: center;
    padding: 12px 4px; margin-top: 4px;
    background: color-mix(in srgb, var(--bg) 90%, transparent);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    border-top: 1px solid var(--border-soft);
  }

  /* Weather hero */
  .weather-hero {
    display: grid; grid-template-columns: auto 1fr auto;
    gap: 18px; align-items: center; padding: 18px;
    border-radius: var(--r-lg);
    background: linear-gradient(135deg, color-mix(in srgb, var(--weather) 14%, var(--surface)), var(--surface));
    border: 1px solid var(--border);
  }
  .weather-hero__icon {
    width: 64px; height: 64px; border-radius: 18px;
    background: color-mix(in srgb, var(--weather) 25%, white);
    display: grid; place-items: center; color: var(--weather-ink);
  }
  .weather-hero__icon svg { width: 32px; height: 32px; }
  .weather-hero__temp { font-size: 34px; font-weight: 700; letter-spacing: -0.03em; font-family: var(--font-mono); }
  .weather-hero__cond { color: var(--text-soft); font-size: 13px; }

  /* Forecast strip: fixed grid, no horizontal scroll. 12 cells split in
   * two rows of 6 so all hours stay visible without panning. The grid
   * naturally fits the parent card width: when the card narrows the cells
   * shrink instead of overflowing or scrolling. */
  .forecast-row {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
  }
  .forecast-cell {
    min-width: 0;
    text-align: center; padding: 10px 4px;
    border-radius: var(--r-md); background: var(--bg-sunken); border: 1px solid var(--border-soft);
    overflow: hidden;
  }
  .forecast-cell__hour { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }
  .forecast-cell__icon { color: var(--weather-ink); margin: 6px 0 4px; }
  .forecast-cell__icon svg { width: 20px; height: 20px; }
  .forecast-cell__temp { font-size: 13px; font-weight: 600; font-family: var(--font-mono); }
  .forecast-cell__wind {
    font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);
    display: flex; align-items: center; justify-content: center; gap: 3px; margin-top: 3px;
  }

  /* KPI */
  .kpi { padding: 16px; border-radius: var(--r-lg); background: var(--surface); border: 1px solid var(--border); }
  .kpi__label { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }
  .kpi__value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; font-family: var(--font-mono); margin-top: 6px; }
  .kpi__delta { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

  .live-device {
    display: grid; grid-template-columns: 40px 1fr auto auto;
    gap: 12px; align-items: center; padding: 10px 12px;
    border-radius: var(--r-md); border: 1px solid var(--border-soft);
  }
  .live-device + .live-device { margin-top: 6px; }
  .live-device__bar { width: 80px; height: 6px; border-radius: 3px; background: var(--bg-sunken); overflow: hidden; }
  .live-device__bar > div { height: 100%; background: var(--accent); border-radius: 3px; transition: width 300ms; }

  /* Wizard */
  .wizard-stepper { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
  .wizard-step {
    flex: 1 1 0; min-width: 0;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; border-radius: var(--r-md);
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    font-size: 12.5px; color: var(--text-muted); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wizard-step[data-state="active"] { background: var(--accent-soft); color: var(--accent-ink); border-color: transparent; }
  .wizard-step[data-state="done"] { background: color-mix(in srgb, var(--ok) 12%, transparent); color: var(--ok); border-color: transparent; }
  .wizard-step__num {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--surface); border: 1px solid var(--border);
    display: grid; place-items: center; font-size: 11px; font-weight: 600;
    font-family: var(--font-mono);
    flex-shrink: 0;
  }
  .wizard-step[data-state="done"] .wizard-step__num { background: var(--ok); color: white; border-color: transparent; }
  .wizard-step[data-state="active"] .wizard-step__num { background: var(--accent); color: white; border-color: transparent; }
  /* Narrow viewports: collapse the step labels except for the active one
   * so all six step indicators stay visible without overflowing. */
  @media (max-width: 700px) {
    .wizard-stepper { gap: 4px; }
    .wizard-step { padding: 8px 10px; gap: 6px; }
    .wizard-step > span:not(.wizard-step__num) { display: none; }
    .wizard-step[data-state="active"] > span:not(.wizard-step__num) { display: inline; }
  }

  .tile-pick {
    padding: 14px; border-radius: var(--r-lg); border: 1px solid var(--border);
    background: var(--surface); cursor: pointer;
    display: flex; flex-direction: column; gap: 8px;
    transition: border-color 120ms, background 120ms; text-align: left; width: 100%;
  }
  .tile-pick:hover { border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); }
  .tile-pick[data-selected="true"] { border-color: var(--accent); background: color-mix(in srgb, var(--accent-soft) 60%, var(--surface)); }
  .tile-pick__icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--accent-soft); color: var(--accent-ink);
    display: grid; place-items: center;
  }
  .tile-pick__name { font-weight: 600; font-size: 13.5px; }
  .tile-pick__desc { color: var(--text-muted); font-size: 12px; }

  /* Modal overlay */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300;
    display: grid; place-items: center; padding: 20px;
  }

  /* Utility */
  .row { display: flex; align-items: center; gap: 10px; }
  .col { display: flex; flex-direction: column; gap: 10px; }
  .sp-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .text-mute { color: var(--text-muted); }
  .text-soft { color: var(--text-soft); }
  .text-sm { font-size: 12.5px; }
  .text-xs { font-size: 11.5px; }
  .fw-600 { font-weight: 600; }
  .fw-500 { font-weight: 500; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Editor 2-column layout (timeline + block detail). Stacks on tablet. */
  .editor-cols {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 18px;
  }

  /* Rule builder weather variables picker grid */
  .wr-vars { max-height: 380px; overflow-y: auto; padding-right: 4px; }

  @media (max-width: 1000px) {
    .editor-cols { grid-template-columns: 1fr; }
  }

  @media (max-width: 900px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .content__inner { padding: 18px 16px 40px; }
    .topbar { padding: 12px 16px; }
    .topbar__crumbs { display: none; }
    .topbar__title { font-size: 16px; }
  }

  @media (max-width: 600px) {
    .content__inner { padding: 14px 10px 30px; }
    .topbar { padding: 10px 12px; gap: 8px; }
    .topbar__title { font-size: 14px; }
    .page-title { font-size: 22px !important; }
    .page-sub { font-size: 12px !important; }
    .card { padding: 12px !important; }
    .card--pad-lg { padding: 16px !important; }
    .device-row { flex-wrap: wrap; gap: 8px; padding: 10px 8px !important; }
    .device-row__main { flex: 1 1 100%; min-width: 0; }
    .rule-block { flex-wrap: wrap; padding: 10px 8px !important; gap: 6px; }
    .timeline { height: 76px; }
    .radial { max-width: 360px; }
    .weekgrid__row { grid-template-columns: 38px 1fr; gap: 6px; }
    .kpi { padding: 12px; }
    .kpi__value { font-size: 22px; }
    .sched-card { padding: 12px; gap: 10px; }
    .grid-auto { grid-template-columns: 1fr !important; }
    /* Forecast: fewer columns on phone so each hour stays legible. 12
     * cells become 3 rows of 4 instead of 2 rows of 6. */
    .forecast-row { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .wr-vars { max-height: 260px; }
    .segmented button { padding: 5px 8px; font-size: 11.5px; }
    .btn { padding: 7px 10px; font-size: 12.5px; }
  }
`;function be(e,t=16,i=1.6){const a=t,s=i;switch(e){case"dashboard":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`;case"calendar":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;case"clock":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;case"cloud":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 10a3.5 3.5 0 0 1-.5 7H7z"/></svg>`;case"sun":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>`;case"rain":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 8a3.5 3.5 0 0 1-.5 7"/><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"/></svg>`;case"snow":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7l14 10M19 7 5 17"/></svg>`;case"device":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/></svg>`;case"live":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"/></svg>`;case"settings":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;case"wand":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4"/><path d="m3 21 9-9"/><path d="M12.5 11.5 14 10l2 2-1.5 1.5z"/></svg>`;case"plus":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;case"chevron-right":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`;case"chevron-left":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>`;case"chevron-up":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>`;case"chevron-down":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;case"grip":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>`;case"sort":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M6 12h12M9 18h6"/></svg>`;case"play":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></svg>`;case"pause":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>`;case"thermostat":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="12" rx="2"/><circle cx="12" cy="17" r="3.5"/><path d="M12 8v7"/></svg>`;case"light":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3V17h6v-1.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3z"/></svg>`;case"blind":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M4 4v14h16V4M4 8h16M4 12h16M4 16h16M11 20v2M13 20v2"/></svg>`;case"irrigation":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z"/></svg>`;case"plug":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5"/></svg>`;case"fan":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10V5a4 4 0 0 1 4 4M14 12h5a4 4 0 0 1-4 4M12 14v5a4 4 0 0 1-4-4M10 12H5a4 4 0 0 1 4-4"/></svg>`;case"boiler":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M9 16h6"/></svg>`;case"mower":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-1 3a2 2 0 0 1-2 1.5H6A2 2 0 0 1 4 18zM7 15v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M10 7V4M14 7V4"/></svg>`;case"vacuum":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2"/></svg>`;case"repeat":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 12v-2a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 0 1-4 4H3"/></svg>`;case"bolt":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>`;case"check":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`;case"close":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`;case"menu":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;case"info":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>`;case"edit":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/></svg>`;case"trash":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`;case"temp":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0z"/></svg>`;case"droplet":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/></svg>`;case"wind":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h9"/></svg>`;case"power":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9M6 6a8 8 0 1 0 12 0"/></svg>`;case"moon":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>`;case"shield":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.6 8 9 4.6-.4 8-4.5 8-9V6z"/></svg>`;case"toggle":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="8" rx="4"/><circle cx="16" cy="12" r="2.5" fill="currentColor"/></svg>`;case"hash":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/></svg>`;case"list":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`;case"terminal":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></svg>`;case"history":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>`;case"copy":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;case"download":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/></svg>`;case"upload":return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 19h16"/></svg>`;default:return U`<svg width="${a}" height="${a}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`}}const ye={thermostat:"thermostat",light:"light",blind:"blind",irrigation:"irrigation",plug:"plug",fan:"fan",boiler:"boiler",mower:"mower",vacuum:"vacuum",scene:"wand",automation:"wand",alarm:"shield",input_boolean:"toggle",input_number:"hash",input_select:"list",service:"terminal"};function we(e,t=16){return be(ye[e]||"device",t)}const xe={sun:"sun",sunny:"sun",rain:"rain",rainy:"rain",cloud:"cloud",cloudy:"cloud",partlycloudy:"cloud",snow:"snow",snowy:"snow",fog:"cloud",windy:"wind"};function ke(e,t=16){return be(xe[e]||"cloud",t)}const $e=[{max:10,color:"#3b82f6"},{max:15,color:"#06b6d4"},{max:19,color:"#fbbf24"},{max:23,color:"#10b981"},{max:25,color:"#fbbf24"},{max:999,color:"#ef4444"}],Se=[{max:35,color:"#3b82f6"},{max:50,color:"#10b981"},{max:60,color:"#fbbf24"},{max:999,color:"#ef4444"}],Ae={eco:"#10b981",comfort:"#3b82f6",sleep:"#6366f1",away:"#9ca3af",boost:"#ef4444",home:"#06b6d4",none:"#9ca3af"},ze={on:"#10b981",off:"#9ca3af",set:"#06b6d4",preset:"#6366f1",cmd:"#f59e0b"},Ce={plug:{active:"#10b981",inactive:"#9ca3af"},mower:{active:"#10b981",inactive:"#9ca3af"},vacuum:{active:"#10b981",inactive:"#9ca3af"},irrigation:{active:"#10b981",inactive:"#9ca3af"},alarm:{active:"#10b981",inactive:"#9ca3af"},input_boolean:{active:"#10b981",inactive:"#9ca3af"},input_select:{active:"#10b981",inactive:"#9ca3af"},input_number:{active:"#10b981",inactive:"#9ca3af"}},Me={blind:{start:"#3c5078",end:"#c8b4ff"},fan:{start:"#06b6d4",end:"#3b82f6"}},Ee={on:"var(--mode-comfort)",off:"var(--mode-off)",set:"var(--mode-eco)",preset:"var(--mode-night)",cmd:"var(--mode-boost)"};function Ie(e,t){const i=t?.color_kind?.[e];return"string"==typeof i&&i?i:Ee[e]||ze[e]||"#9ca3af"}function De(e,t){const i=t?.color_simple?.[e];return i&&"object"==typeof i&&i.active&&i.inactive?i:Ce[e]||{active:"#10b981",inactive:"#9ca3af"}}function Ne(e,t){const i=t?.color_range?.[e];return i&&"object"==typeof i&&i.start&&i.end?i:Me[e]||{start:"#3c5078",end:"#c8b4ff"}}function Be(e,t){if(!e)return"boiler"===t?Se:$e;const i=e["boiler"===t?"color_stops_boiler":"color_stops_climate"];return i&&i.length?[...i].sort((e,t)=>e.max-t.max):"boiler"===t?Se:$e}function Re(e){const t=e?.color_presets;return{...Ae,...t||{}}}function Te(e){const t=e?.color_light_use_state;return void 0===t||!!t}const Oe={accent:"var(--accent)",soft:"var(--accent-soft)",live:!1};function qe(e,t,i){if(!t)return Oe;const a=t.state||"",s=t.attributes||{};if("light"===e.type){if("off"===a||"unavailable"===a)return{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1};if(Te(i)){const e=s.rgb_color;if(Array.isArray(e)&&3===e.length){return{accent:`rgb(${e[0]}, ${e[1]}, ${e[2]})`,soft:`rgba(${e[0]}, ${e[1]}, ${e[2]}, 0.18)`,live:!0}}}return{accent:"#fbbf24",soft:"rgba(251, 191, 36, 0.18)",live:!0}}if("thermostat"===e.type||"boiler"===e.type){const t=Re(i),r=s.preset_mode;if(r&&t[r]&&"off"!==a){const e=t[r];return{accent:e,soft:He(e),live:!0}}const n=function(e){const t=[e.current_temperature,e.temperature];for(const e of t){if("number"==typeof e)return e;const t=parseFloat(e);if(!isNaN(t))return t}return}(s);if("number"==typeof n){const t=function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"#9ca3af"}(n,Be(i,e.type));return{accent:t,soft:He(t),live:!0}}return Oe}if("blind"===e.type){const e=s.current_position;if("number"==typeof e){const t=Ne("blind",i),a=Pe(t.start,t.end,e/100);return{accent:a,soft:He(a),live:!0}}}if("fan"===e.type){const e=s.percentage;if("number"==typeof e&&"on"===a){const t=Ne("fan",i),a=Pe(t.start,t.end,e/100);return{accent:a,soft:He(a),live:!0}}}const r=new Set(["on","open","cleaning","mowing","armed_home","armed_away","armed_night","armed_vacation","triggered"]),n=new Set(["off","closed","docked","unavailable","unknown","disarmed","idle"]);if(Ce[e.type]){const t=De(e.type,i);return r.has(a)||"input_number"===e.type&&""!==a&&"unavailable"!==a&&"unknown"!==a?{accent:t.active,soft:He(t.active),live:!0}:n.has(a)?{accent:t.inactive,soft:He(t.inactive),live:!1}:{accent:t.active,soft:He(t.active),live:!1}}return r.has(a)?{accent:"#10b981",soft:"rgba(16, 185, 129, 0.18)",live:!0}:n.has(a)?{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1}:Oe}function He(e){if(!e.startsWith("#"))return"var(--bg-sunken)";const t=e.replace("#","");return`rgba(${parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16)}, ${parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16)}, ${parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)}, 0.18)`}function Pe(e,t,i){const a=e=>{if(!e)return null;if(e.startsWith("#")){const t=e.replace("#","");return 3===t.length?[parseInt(t[0]+t[0],16),parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16)]:6===t.length?[parseInt(t.slice(0,2),16),parseInt(t.slice(2,4),16),parseInt(t.slice(4,6),16)]:null}const t=e.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);return t?[parseInt(t[1],10),parseInt(t[2],10),parseInt(t[3],10)]:null},s=a(e)||[60,80,120],r=a(t)||[200,180,255],n=Math.max(0,Math.min(1,i));return`rgb(${Math.round(s[0]+(r[0]-s[0])*n)}, ${Math.round(s[1]+(r[1]-s[1])*n)}, ${Math.round(s[2]+(r[2]-s[2])*n)})`}const Le=["it","en","fr","de"];let We="it";function Ve(e,t){const i=Fe[e];let a=i?.[We]||i?.it||e;if(t)for(const e of Object.keys(t))a=a.replace(new RegExp(`\\{${e}\\}`,"g"),String(t[e]));return a}const Fe={"common.cancel":{it:"Annulla",en:"Cancel",fr:"Annuler",de:"Abbrechen"},"common.save":{it:"Salva",en:"Save",fr:"Enregistrer",de:"Speichern"},"common.delete":{it:"Elimina",en:"Delete",fr:"Supprimer",de:"Löschen"},"common.edit":{it:"Modifica",en:"Edit",fr:"Modifier",de:"Bearbeiten"},"common.remove":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"common.add":{it:"Aggiungi",en:"Add",fr:"Ajouter",de:"Hinzufügen"},"common.back":{it:"Indietro",en:"Back",fr:"Retour",de:"Zurück"},"common.next":{it:"Avanti",en:"Next",fr:"Suivant",de:"Weiter"},"common.confirm":{it:"Conferma",en:"Confirm",fr:"Confirmer",de:"Bestätigen"},"common.close":{it:"Chiudi",en:"Close",fr:"Fermer",de:"Schließen"},"common.reset":{it:"Reset",en:"Reset",fr:"Réinitialiser",de:"Zurücksetzen"},"common.default":{it:"Default",en:"Default",fr:"Défaut",de:"Standard"},"common.none":{it:"Nessuna",en:"None",fr:"Aucune",de:"Keine"},"common.search":{it:"Cerca",en:"Search",fr:"Rechercher",de:"Suchen"},"common.yes":{it:"Sì",en:"Yes",fr:"Oui",de:"Ja"},"common.no":{it:"No",en:"No",fr:"Non",de:"Nein"},"common.enabled":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"common.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"common.loading":{it:"Caricamento…",en:"Loading…",fr:"Chargement…",de:"Lädt…"},"common.optional":{it:"opzionale",en:"optional",fr:"facultatif",de:"optional"},"common.value":{it:"Valore",en:"Value",fr:"Valeur",de:"Wert"},"common.min":{it:"min",en:"min",fr:"min",de:"Min."},"common.hour_short":{it:"h",en:"h",fr:"h",de:"Std."},"nav.section.main":{it:"Principale",en:"Main",fr:"Principal",de:"Hauptmenü"},"nav.section.actions":{it:"Azioni",en:"Actions",fr:"Actions",de:"Aktionen"},"nav.overview":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"nav.editor":{it:"Editor",en:"Editor",fr:"Éditeur",de:"Editor"},"nav.week":{it:"Settimana",en:"Week",fr:"Semaine",de:"Woche"},"nav.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"nav.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"nav.live":{it:"Stato live",en:"Live",fr:"Direct",de:"Live"},"nav.new_schedule":{it:"Nuova schedulazione",en:"New schedule",fr:"Nouvelle planification",de:"Neuer Zeitplan"},"nav.manage_devices":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"nav.settings":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"nav.help":{it:"Aiuto",en:"Help",fr:"Aide",de:"Hilfe"},"nav.history":{it:"Storico",en:"History",fr:"Historique",de:"Verlauf"},"nav.menu_open":{it:"Apri menu",en:"Open menu",fr:"Ouvrir le menu",de:"Menü öffnen"},"nav.menu_close":{it:"Chiudi menu",en:"Close menu",fr:"Fermer le menu",de:"Menü schließen"},"screen.overview.title":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"screen.editor.title":{it:"Editor schedulazione",en:"Schedule editor",fr:"Éditeur de planification",de:"Zeitplan-Editor"},"screen.weather_rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"screen.device.title":{it:"Dispositivo",en:"Device",fr:"Appareil",de:"Gerät"},"screen.week.title":{it:"Vista settimanale",en:"Week view",fr:"Vue semaine",de:"Wochenansicht"},"screen.live.title":{it:"Stato live",en:"Live status",fr:"État en direct",de:"Live-Status"},"screen.history.title":{it:"Storico esecuzioni",en:"Execution history",fr:"Historique des exécutions",de:"Ausführungsverlauf"},"screen.wizard.title":{it:"Wizard",en:"Wizard",fr:"Assistant",de:"Assistent"},"screen.devices.title":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"screen.settings.title":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"modal.unsaved.title":{it:"Modifiche non salvate",en:"Unsaved changes",fr:"Modifications non enregistrées",de:"Nicht gespeicherte Änderungen"},"modal.unsaved.body":{it:"Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?",en:"You have pending changes on this schedule. Leave and discard them?",fr:"Des modifications sont en attente sur cette planification. Quitter et les perdre ?",de:"Du hast noch offene Änderungen an diesem Zeitplan. Wirklich verlassen und verwerfen?"},"modal.unsaved.stay":{it:"Resta qui",en:"Stay",fr:"Rester",de:"Bleiben"},"modal.unsaved.discard":{it:"Scarta modifiche",en:"Discard changes",fr:"Ignorer",de:"Verwerfen"},"modal.unsaved.save":{it:"Salva ed esci",en:"Save and exit",fr:"Enregistrer et quitter",de:"Speichern und verlassen"},"overview.subtitle":{it:"Schedulazioni configurate · {n} attive su {tot}",en:"Configured schedules · {n} active of {tot}",fr:"Planifications configurées · {n} actives sur {tot}",de:"Konfigurierte Zeitpläne · {n} aktiv von {tot}"},"overview.no_devices":{it:"Nessun dispositivo",en:"No device linked",fr:"Aucun appareil",de:"Kein Gerät verknüpft"},"overview.no_devices.tooltip":{it:"La schedulazione non ha dispositivi: non eseguirà nessuna azione finché non ne aggiungi almeno uno.",en:"This schedule has no devices: it won't fire any action until at least one is linked.",fr:"Cette planification n'a aucun appareil : aucune action ne sera exécutée tant que tu n'en lies pas un.",de:"Dieser Zeitplan hat keine Geräte: er führt keine Aktion aus, bis mindestens eines verknüpft wird."},"editor.no_devices":{it:"Nessun dispositivo collegato",en:"No device linked",fr:"Aucun appareil lié",de:"Kein Gerät verknüpft"},"editor.no_devices.tooltip":{it:"Aggiungi un dispositivo dal selettore qui sotto, oppure questa schedulazione non eseguirà nessuna azione.",en:"Add a device from the picker below, otherwise this schedule won't fire any action.",fr:"Ajoute un appareil depuis le sélecteur ci-dessous, sinon cette planification n'exécutera aucune action.",de:"Füge ein Gerät über den Selektor unten hinzu, sonst führt dieser Zeitplan keine Aktion aus."},"overview.kpi.active":{it:"Attive",en:"Active",fr:"Actives",de:"Aktiv"},"overview.kpi.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"overview.kpi.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"overview.kpi.now":{it:"Ora corrente",en:"Now",fr:"Maintenant",de:"Jetzt"},"overview.no_schedules":{it:"Nessuna schedulazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"overview.no_schedules.cta":{it:"Avvia il wizard per crearne una",en:"Start the wizard to create one",fr:"Lance l'assistant pour en créer une",de:"Starte den Assistenten, um einen zu erstellen"},"overview.rules_count":{it:"{n} regole",en:"{n} rules",fr:"{n} règles",de:"{n} Regeln"},"editor.field.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"editor.timeline_variant":{it:"Visualizzazione",en:"View",fr:"Affichage",de:"Ansicht"},"editor.id_chip.title":{it:"ID schedulazione, usato dai servizi chronos.schedule_toggle e chronos.fire_block. Click per copiare",en:"Schedule ID, used by the chronos.schedule_toggle and chronos.fire_block services. Click to copy",fr:"ID du planning, utilisé par les services chronos.schedule_toggle et chronos.fire_block. Cliquer pour copier",de:"Zeitplan-ID, verwendet von den Diensten chronos.schedule_toggle und chronos.fire_block. Zum Kopieren klicken"},"editor.auto_off.label":{it:"Spegni da solo dopo",en:"Auto-off after",fr:"Arrêt automatique après",de:"Automatisch ausschalten nach"},"editor.auto_off.hint":{it:"Chronos spegne i dispositivi del blocco N minuti dopo l'accensione. Vuoto = disattivato. Sopravvive ai riavvii: se HA riparte a timer in corso, lo spegnimento avviene al riavvio",en:"Chronos switches the block's devices off N minutes after turning them on. Empty = disabled. Restart-safe: if HA restarts mid-timer, the switch-off happens at startup",fr:"Chronos éteint les appareils du bloc N minutes après l'allumage. Vide = désactivé. Résiste aux redémarrages : si HA redémarre pendant le minuteur, l'arrêt a lieu au démarrage",de:"Chronos schaltet die Geräte des Blocks N Minuten nach dem Einschalten aus. Leer = deaktiviert. Neustartsicher: startet HA währenddessen neu, erfolgt die Abschaltung beim Start"},"load.retry.hint":{it:"L'integrazione potrebbe essere ancora in avvio: riprovo automaticamente…",en:"The integration may still be starting: retrying automatically…",fr:"L'intégration démarre peut-être encore : nouvelle tentative automatique…",de:"Die Integration startet möglicherweise noch: automatischer neuer Versuch…"},"editor.add_block_hint":{it:"Clicca su una zona vuota della barra per aggiungere una fascia. Trascina i bordi per modificare durata e posizione.",en:"Click on an empty area of the bar to add a block. Drag the edges to adjust duration and position.",fr:"Clique sur une zone vide de la barre pour ajouter un créneau. Fais glisser les bords pour ajuster la durée et la position.",de:"Klicke auf einen freien Bereich der Leiste, um einen Block hinzuzufügen. Ziehe die Ränder, um Dauer und Position anzupassen."},"editor.block.from":{it:"Da",en:"From",fr:"De",de:"Von"},"editor.block.to":{it:"A",en:"To",fr:"À",de:"Bis"},"editor.block.fixed":{it:"Ora fissa",en:"Fixed time",fr:"Heure fixe",de:"Feste Zeit"},"editor.block.sunrise":{it:"Alba",en:"Sunrise",fr:"Lever du soleil",de:"Sonnenaufgang"},"editor.block.sunset":{it:"Tramonto",en:"Sunset",fr:"Coucher du soleil",de:"Sonnenuntergang"},"editor.block.today":{it:"oggi:",en:"today:",fr:"aujourd'hui :",de:"heute:"},"editor.block.action":{it:"Azione",en:"Action",fr:"Action",de:"Aktion"},"editor.irrigation.mode":{it:"Gestione durata valvole",en:"Valve duration mode",fr:"Mode de durée des vannes",de:"Ventil-Dauermodus"},"editor.irrigation.mode.global":{it:"Durata globale",en:"Global duration",fr:"Durée globale",de:"Globale Dauer"},"editor.irrigation.mode.sequential":{it:"Sequenza per valvola",en:"Per-valve sequence",fr:"Séquence par vanne",de:"Sequenz pro Ventil"},"editor.irrigation.seq.hint":{it:"Chronos apre le valvole una alla volta, ognuna per i minuti indicati, poi passa alla successiva. La durata totale del programma è la somma dei singoli tempi.",en:"Chronos opens the valves one at a time, each for the minutes set below, then moves to the next. Total program length is the sum of all the times.",fr:"Chronos ouvre les vannes une par une, chacune pour les minutes indiquées, puis passe à la suivante. La durée totale est la somme des temps.",de:"Chronos öffnet die Ventile nacheinander, jedes für die angegebenen Minuten, dann das nächste. Gesamtdauer = Summe aller Zeiten."},"editor.irrigation.seq.no_valves":{it:"Nessuna valvola collegata a questa schedulazione. Aggiungine almeno una dal selettore dispositivi.",en:"No valve linked to this schedule. Add at least one from the device picker.",fr:"Aucune vanne liée à cette planification. Ajoutes-en une depuis le sélecteur d'appareils.",de:"Kein Ventil mit diesem Zeitplan verknüpft. Füge mindestens eines über den Geräte-Selektor hinzu."},"editor.irrigation.seq.total":{it:"Durata totale programma:",en:"Total program length:",fr:"Durée totale du programme :",de:"Gesamtdauer des Programms:"},"settings.irrigation.title":{it:"Irrigazione",en:"Irrigation",fr:"Irrigation",de:"Bewässerung"},"settings.irrigation.conflict_block.title":{it:"Blocca salvataggio su conflitto valvole",en:"Block save on valve conflict",fr:"Bloquer l'enregistrement en cas de conflit de vanne",de:"Speichern bei Ventilkonflikt blockieren"},"settings.irrigation.conflict_block.desc":{it:"Se due programmi sequenziali si sovrappongono nel tempo e condividono la stessa valvola, impedisce di salvare (rischio pressione acqua). Se disattivato mostra solo un avviso e lasci decidere a te.",en:"If two sequential programs overlap in time and share the same valve, prevents saving (water-pressure hazard). When off, only a warning is shown and you decide.",fr:"Si deux programmes séquentiels se chevauchent dans le temps et partagent la même vanne, empêche l'enregistrement (risque de pression d'eau). Désactivé : seulement un avertissement.",de:"Wenn sich zwei sequentielle Programme zeitlich überschneiden und dasselbe Ventil teilen, wird das Speichern blockiert (Wasserdruck-Risiko). Aus: nur eine Warnung."},"editor.irrigation.conflict.warn":{it:"Attenzione: questo programma sequenziale si sovrappone nel tempo a un'altra schedulazione che usa la valvola {valve}. Avviarli insieme può causare problemi di pressione dell'acqua.",en:"Warning: this sequential program overlaps in time with another schedule using valve {valve}. Running them together can cause water-pressure problems.",fr:"Attention : ce programme séquentiel chevauche une autre planification utilisant la vanne {valve}. Les lancer ensemble peut causer des problèmes de pression d'eau.",de:"Achtung: Dieses sequentielle Programm überschneidet sich zeitlich mit einem anderen Zeitplan, der Ventil {valve} nutzt. Gleichzeitiger Betrieb kann Wasserdruckprobleme verursachen."},"editor.irrigation.conflict.blocked":{it:"Salvataggio bloccato per conflitto valvole (vedi Impostazioni → Irrigazione). Risolvi la sovrapposizione o disabilita il blocco.",en:"Save blocked due to valve conflict (see Settings → Irrigation). Resolve the overlap or disable the block.",fr:"Enregistrement bloqué pour conflit de vanne (voir Paramètres → Irrigation). Résous le chevauchement ou désactive le blocage.",de:"Speichern wegen Ventilkonflikt blockiert (siehe Einstellungen → Bewässerung). Überschneidung lösen oder Blockierung deaktivieren."},"history.kind.system":{it:"Sistema",en:"System",fr:"Système",de:"System"},"history.system.restart":{it:"Integrazione riavviata",en:"Integration restarted",fr:"Intégration redémarrée",de:"Integration neu gestartet"},"history.system.restart_abort":{it:"Irrigazione sequenziale interrotta dal riavvio, valvole chiuse per sicurezza",en:"Sequential irrigation interrupted by restart, valves closed for safety",fr:"Irrigation séquentielle interrompue par le redémarrage, vannes fermées par sécurité",de:"Sequentielle Bewässerung durch Neustart unterbrochen, Ventile sicherheitshalber geschlossen"},"history.system.restart_off":{it:"Timer di spegnimento interrotto dal riavvio, dispositivi spenti per sicurezza",en:"Auto-off timer interrupted by restart, devices switched off for safety",fr:"Minuterie d'arrêt interrompue par le redémarrage, appareils éteints par sécurité",de:"Auto-Abschalt-Timer durch Neustart unterbrochen, Geräte sicherheitshalber ausgeschaltet"},"editor.block.delete":{it:"Elimina fascia",en:"Delete block",fr:"Supprimer le créneau",de:"Block löschen"},"editor.block.no_selection":{it:"Nessuna fascia selezionata. Clicca su una fascia esistente per modificarla, oppure su una zona libera per aggiungerne una nuova.",en:"No block selected. Click an existing block to edit it, or an empty area to add a new one.",fr:"Aucun créneau sélectionné. Clique sur un créneau existant pour le modifier, ou sur une zone libre pour en ajouter un.",de:"Kein Block ausgewählt. Klicke auf einen vorhandenen Block, um ihn zu bearbeiten, oder in einen freien Bereich, um einen neuen hinzuzufügen."},"editor.coverage":{it:"{n} fasce · totale coperto {h}h / 24h",en:"{n} blocks · total coverage {h}h / 24h",fr:"{n} créneaux · couverture totale {h}h / 24h",de:"{n} Blöcke · Abdeckung gesamt {h}h / 24h"},"editor.days.repeat":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"editor.days.all":{it:"Tutti i giorni",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"editor.days.weekdays":{it:"Lavorativi",en:"Weekdays",fr:"Jours ouvrés",de:"Wochentags"},"editor.days.weekend":{it:"Weekend",en:"Weekend",fr:"Week-end",de:"Wochenende"},"editor.weather_rules.title":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"editor.weather_rules.add":{it:"Aggiungi regola",en:"Add rule",fr:"Ajouter une règle",de:"Regel hinzufügen"},"editor.weather_rules.empty":{it:"Nessuna regola meteo · esecuzione fissa indipendente dal meteo",en:"No weather rules · fixed execution regardless of weather",fr:"Aucune règle météo · exécution fixe indépendamment de la météo",de:"Keine Wetterregeln · feste Ausführung unabhängig vom Wetter"},"editor.devices_section":{it:"Dispositivi influenzati",en:"Affected devices",fr:"Appareils concernés",de:"Betroffene Geräte"},"editor.devices_count":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"editor.devices_empty":{it:"Nessun dispositivo collegato a questa schedulazione.",en:"No devices linked to this schedule.",fr:"Aucun appareil lié à cette planification.",de:"Keine Geräte mit diesem Zeitplan verknüpft."},"editor.devices_no_more":{it:"Tutti i dispositivi compatibili ({type}) sono già stati aggiunti.",en:"All compatible devices ({type}) are already added.",fr:"Tous les appareils compatibles ({type}) sont déjà ajoutés.",de:"Alle kompatiblen Geräte ({type}) sind bereits hinzugefügt."},"editor.block.targets":{it:"Dispositivi attivi in questa fascia",en:"Devices active for this block",fr:"Appareils actifs sur ce créneau",de:"Geräte aktiv in diesem Block"},"editor.block.targets.all":{it:"Tutti",en:"All",fr:"Tous",de:"Alle"},"editor.block.targets.hint":{it:'Tocca un dispositivo per escluderlo da questa fascia. "Tutti" ripristina il default.',en:'Tap a device to exclude it from this block. "All" restores the default.',fr:"Touche un appareil pour l'exclure de ce créneau. « Tous » remet le défaut.",de:'Tippe auf ein Gerät, um es aus diesem Block auszuschließen. „Alle" stellt den Standard wieder her.'},"editor.entity.empty":{it:"Nessuna entità disponibile",en:"No entities available",fr:"Aucune entité disponible",de:"Keine Entitäten verfügbar"},"editor.entity.count":{it:"{n} selezionate",en:"{n} selected",fr:"{n} sélectionnées",de:"{n} ausgewählt"},"editor.entity.search":{it:"Cerca per nome o entity_id…",en:"Search by name or entity_id…",fr:"Rechercher par nom ou entity_id…",de:"Nach Name oder Entity-ID suchen…"},"editor.entity.no_match":{it:"Nessun risultato per la ricerca",en:"No matches for the search",fr:"Aucun résultat pour la recherche",de:"Keine Treffer für die Suche"},"editor.automation.section":{it:"Schedulazione automazioni",en:"Automation-based schedule",fr:"Planification d'automatisations",de:"Automatisierungsplan"},"editor.automation.section.hint":{it:"Le schedulazioni di tipo automazione attivano, disattivano o triggerano automazioni di Home Assistant per fascia oraria.",en:"Automation schedules turn on/off or trigger HA automations per time block.",fr:"Les planifications d'automatisations activent/désactivent ou déclenchent des automatisations par créneau.",de:"Automatisierungspläne aktivieren/deaktivieren oder triggern HA-Automatisierungen pro Zeitblock."},"editor.automation.no_devices":{it:"Le automazioni non richiedono dispositivi: ogni fascia oraria seleziona quali automazioni attivare nel pannello di destra.",en:"Automations don't need devices: each time block picks which automations to act on in the right panel.",fr:"Les automatisations ne nécessitent pas d'appareils : chaque créneau choisit lesquelles activer.",de:"Automatisierungen brauchen keine Geräte: jeder Zeitblock wählt rechts die Ziel-Automatisierungen."},"editor.automation.pick_placeholder":{it:"— Seleziona un'automazione —",en:"— Pick an automation —",fr:"— Choisir une automatisation —",de:"— Automatisierung auswählen —"},"editor.automation.pick_warn":{it:"Seleziona almeno un'automazione, altrimenti questa fascia non farà nulla.",en:"Pick at least one automation, otherwise this block will do nothing.",fr:"Sélectionne au moins une automatisation.",de:"Wähle mindestens eine Automatisierung aus."},"wizard.devices.automation_tile":{it:"Attiva automazioni (generica)",en:"Activate automations (generic)",fr:"Activer des automatisations (générique)",de:"Automatisierungen aktivieren (generisch)"},"wizard.devices.automation_tile.desc":{it:"Una sola schedulazione, più automazioni accese/spente per fascia",en:"One schedule, multiple automations toggled per block",fr:"Une seule planification, plusieurs automatisations basculées par créneau",de:"Ein Plan, mehrere Automatisierungen pro Block ein-/ausschalten"},"wizard.review.automation_mode":{it:"Modalità automazioni (nessun dispositivo)",en:"Automation mode (no devices)",fr:"Mode automatisations (aucun appareil)",de:"Automatisierungsmodus (keine Geräte)"},"overview.new_automation":{it:"Schedula automazioni",en:"Schedule automations",fr:"Planifier des automatisations",de:"Automatisierungen planen"},"overview.new_automation.hint":{it:"Crea una schedulazione che attiva o disattiva automazioni a orari diversi",en:"Create a schedule that turns automations on/off at different times",fr:"Créer une planification qui active/désactive des automatisations à différents horaires",de:"Plan erstellen, der zu unterschiedlichen Zeiten Automatisierungen ein-/ausschaltet"},"overview.new_automation_default_name":{it:"Nuova schedulazione automazioni",en:"New automation schedule",fr:"Nouvelle planification d'automatisations",de:"Neuer Automatisierungsplan"},"editor.block.wrap_warn.title":{it:"Attenzione: blocco oltre la mezzanotte",en:"Warning: block crosses midnight",fr:"Attention : bloc au-delà de minuit",de:"Achtung: Block überschreitet Mitternacht"},"editor.block.wrap_warn.body":{it:"Non puoi schedulare orari che attraversano la mezzanotte. Dividi il blocco in due parti (es. 22:00-23:59 e 00:00-06:00) altrimenti questa fascia non verrà mai eseguita.",en:"You can't schedule a block that crosses midnight. Split it into two parts (e.g. 22:00-23:59 and 00:00-06:00) otherwise this block will never fire.",fr:"Tu ne peux pas planifier un bloc qui traverse minuit. Divise-le en deux parties (ex. 22:00-23:59 et 00:00-06:00) sinon ce bloc ne s'exécutera jamais.",de:"Ein Block über Mitternacht ist nicht möglich. Teile ihn in zwei Blöcke (z. B. 22:00-23:59 und 00:00-06:00), sonst wird er nie ausgeführt."},"wizard.devices.scene_tile":{it:"Attivazione scena (generica)",en:"Activate scene (generic)",fr:"Activer une scène (générique)",de:"Szene aktivieren (generisch)"},"wizard.devices.scene_tile.desc":{it:"Una sola schedulazione, una scena diversa per ogni fascia oraria",en:"One schedule, a different scene per time block",fr:"Une seule planification, une scène différente par créneau",de:"Ein Plan, pro Zeitblock eine andere Szene"},"wizard.review.scene_mode":{it:"Modalità scene (nessun dispositivo)",en:"Scene mode (no devices)",fr:"Mode scènes (aucun appareil)",de:"Szenenmodus (keine Geräte)"},"editor.scene.section":{it:"Scena della schedulazione",en:"Scene-based schedule",fr:"Planification de scènes",de:"Szenenplan"},"editor.scene.section.hint":{it:"Le schedulazioni di tipo scena attivano una scena diversa per ogni fascia oraria.",en:"Scene schedules fire a different scene for each time block.",fr:"Les planifications de scènes déclenchent une scène différente pour chaque créneau.",de:"Szenenpläne lösen pro Zeitblock eine andere Szene aus."},"editor.scene.no_devices":{it:"Le scene non richiedono dispositivi: ogni fascia oraria seleziona quale scena attivare nel pannello di destra.",en:"Scenes don't need devices: each time block picks which scene to activate in the right panel.",fr:"Les scènes ne nécessitent pas d'appareils : chaque créneau choisit la scène à activer.",de:"Szenen brauchen keine Geräte: jeder Zeitblock wählt die zu aktivierende Szene."},"editor.scene.pick_placeholder":{it:"— Seleziona una scena —",en:"— Pick a scene —",fr:"— Choisir une scène —",de:"— Szene auswählen —"},"editor.scene.pick_warn":{it:"Seleziona una scena, altrimenti questa fascia non farà nulla.",en:"Pick a scene, otherwise this block will do nothing.",fr:"Choisis une scène, sinon ce créneau ne fera rien.",de:"Wähle eine Szene aus, sonst tut dieser Block nichts."},"overview.new_scene":{it:"Schedula scene",en:"Schedule scenes",fr:"Planifier des scènes",de:"Szenen planen"},"overview.new_scene.hint":{it:"Crea una schedulazione che attiva scene diverse a orari diversi",en:"Create a schedule that activates different scenes at different times",fr:"Créer une planification qui active différentes scènes à différents horaires",de:"Plan erstellen, der zu unterschiedlichen Zeiten verschiedene Szenen auslöst"},"overview.new_scene_default_name":{it:"Nuova schedulazione scene",en:"New scene schedule",fr:"Nouvelle planification de scènes",de:"Neuer Szenenplan"},"editor.block.extras":{it:"Parametri avanzati",en:"Advanced parameters",fr:"Paramètres avancés",de:"Erweiterte Parameter"},"editor.block.extras.hint":{it:"Lascia vuoto per usare il default. I valori vengono passati direttamente al servizio HA al momento dell'esecuzione.",en:"Leave empty to use defaults. Values are passed directly to the HA service when fired.",fr:"Laisse vide pour le défaut. Les valeurs sont passées directement au service HA.",de:"Leer lassen für Standardwerte. Werte werden direkt an den HA-Dienst übergeben."},"editor.date_range.toggle":{it:"Periodo dell'anno specifico (ricorrente)",en:"Specific date range (yearly recurring)",fr:"Plage de dates spécifique (annuelle)",de:"Bestimmter Zeitraum (jährlich wiederkehrend)"},"editor.date_range.hint":{it:"Limita la schedulazione a un intervallo di date dell'anno. Si ripete ogni anno.",en:"Limit the schedule to a date range. Repeats every year.",fr:"Limite la planification à une plage de dates. Se répète chaque année.",de:"Begrenzt den Zeitplan auf einen Datumsbereich. Wiederholt sich jährlich."},"editor.date_range.from":{it:"Da",en:"From",fr:"Du",de:"Von"},"editor.date_range.to":{it:"A",en:"To",fr:"Au",de:"Bis"},"editor.date_range.wraps":{it:"Il periodo attraversa il fine anno (la schedulazione resta attiva da inizio anno fino alla data di fine).",en:"The range wraps across year-end (schedule remains active until the end date in the new year).",fr:"La plage traverse la fin d'année.",de:"Der Bereich überspannt den Jahreswechsel."},"month.1":{it:"Gennaio",en:"January",fr:"Janvier",de:"Januar"},"month.2":{it:"Febbraio",en:"February",fr:"Février",de:"Februar"},"month.3":{it:"Marzo",en:"March",fr:"Mars",de:"März"},"month.4":{it:"Aprile",en:"April",fr:"Avril",de:"April"},"month.5":{it:"Maggio",en:"May",fr:"Mai",de:"Mai"},"month.6":{it:"Giugno",en:"June",fr:"Juin",de:"Juni"},"month.7":{it:"Luglio",en:"July",fr:"Juillet",de:"Juli"},"month.8":{it:"Agosto",en:"August",fr:"Août",de:"August"},"month.9":{it:"Settembre",en:"September",fr:"Septembre",de:"September"},"month.10":{it:"Ottobre",en:"October",fr:"Octobre",de:"Oktober"},"month.11":{it:"Novembre",en:"November",fr:"Novembre",de:"November"},"month.12":{it:"Dicembre",en:"December",fr:"Décembre",de:"Dezember"},"editor.dirty.unsaved":{it:"Salva le modifiche",en:"Save changes",fr:"Enregistrer les modifications",de:"Änderungen speichern"},"editor.dirty.saved":{it:"Modifiche salvate",en:"Changes saved",fr:"Modifications enregistrées",de:"Änderungen gespeichert"},"wizard.title":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer une planification",de:"Zeitplan erstellen"},"wizard.subtitle":{it:"Procedura guidata · puoi modificare tutto in seguito",en:"Guided setup · you can edit everything later",fr:"Procédure guidée · tu pourras tout modifier ensuite",de:"Geführte Einrichtung · alles kann später angepasst werden"},"wizard.step.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"wizard.step.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"wizard.step.time":{it:"Fasce orarie",en:"Time blocks",fr:"Créneaux",de:"Zeitblöcke"},"wizard.step.days":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"wizard.step.weather":{it:"Meteo",en:"Weather",fr:"Météo",de:"Wetter"},"wizard.step.review":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.name.heading":{it:"Dai un nome alla schedulazione",en:"Give the schedule a name",fr:"Donne un nom à la planification",de:"Gib dem Zeitplan einen Namen"},"wizard.name.hint":{it:"Sarà visibile nella panoramica e nelle notifiche.",en:"It will appear in the overview and in notifications.",fr:"Il apparaîtra dans l'aperçu et les notifications.",de:"Wird in der Übersicht und in Benachrichtigungen angezeigt."},"wizard.name.suggestions":{it:"Suggerimenti:",en:"Suggestions:",fr:"Suggestions :",de:"Vorschläge:"},"wizard.devices.heading":{it:"Quali dispositivi sono coinvolti?",en:"Which devices are involved?",fr:"Quels appareils sont concernés ?",de:"Welche Geräte sind beteiligt?"},"wizard.devices.hint":{it:"Verranno tutti controllati dalla stessa programmazione.",en:"They will all be controlled by the same schedule.",fr:"Ils seront tous contrôlés par la même planification.",de:"Alle werden vom selben Zeitplan gesteuert."},"wizard.time.heading":{it:"Imposta le fasce orarie",en:"Set up time blocks",fr:"Définis les créneaux horaires",de:"Zeitblöcke festlegen"},"wizard.time.reset_preset":{it:"Reset preset",en:"Reset preset",fr:"Réinitialiser le préréglage",de:"Voreinstellung zurücksetzen"},"wizard.time.selected":{it:"Fascia selezionata",en:"Selected block",fr:"Créneau sélectionné",de:"Ausgewählter Block"},"wizard.days.heading":{it:"Quali giorni della settimana?",en:"Which days of the week?",fr:"Quels jours de la semaine ?",de:"An welchen Wochentagen?"},"wizard.days.hint":{it:"La schedulazione si ripeterà automaticamente ogni settimana.",en:"The schedule will repeat automatically every week.",fr:"La planification se répétera chaque semaine.",de:"Der Zeitplan wiederholt sich jede Woche."},"wizard.weather.heading":{it:"Logica meteo",en:"Weather logic",fr:"Logique météo",de:"Wetterlogik"},"wizard.weather.hint":{it:"Vuoi che il meteo locale modifichi automaticamente questa programmazione?",en:"Should local weather automatically affect this schedule?",fr:"La météo locale doit-elle modifier automatiquement cette planification ?",de:"Soll das lokale Wetter diesen Zeitplan automatisch anpassen?"},"wizard.weather.yes":{it:"Sì, abilita",en:"Yes, enable",fr:"Oui, activer",de:"Ja, aktivieren"},"wizard.weather.yes.desc":{it:"Suggeriremo regole utili in base al tipo di dispositivo",en:"We'll suggest useful rules based on the device type",fr:"Des règles utiles seront suggérées selon le type d'appareil",de:"Nützliche Regeln werden je nach Gerätetyp vorgeschlagen"},"wizard.weather.no":{it:"No, solo orari",en:"No, time-based only",fr:"Non, juste les horaires",de:"Nein, nur zeitbasiert"},"wizard.weather.no.desc":{it:"Esecuzione fissa indipendente dal meteo",en:"Fixed execution regardless of weather",fr:"Exécution fixe indépendante de la météo",de:"Feste Ausführung unabhängig vom Wetter"},"wizard.review.heading":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.review.devices":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"wizard.review.weather_on":{it:"Abilitata",en:"Enabled",fr:"Activée",de:"Aktiviert"},"wizard.review.weather_off":{it:"Disabilitata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"wizard.review.note":{it:"Potrai modificare ogni dettaglio dall'editor dopo la creazione.",en:"You'll be able to edit every detail after creation.",fr:"Tu pourras modifier chaque détail après la création.",de:"Nach der Erstellung kannst du alle Details bearbeiten."},"wizard.create":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer la planification",de:"Zeitplan erstellen"},"devices.subtitle":{it:"Entità di Home Assistant importate · {n} dispositivi controllati",en:"Imported Home Assistant entities · {n} devices controlled",fr:"Entités Home Assistant importées · {n} appareils contrôlés",de:"Importierte Home-Assistant-Entitäten · {n} gesteuerte Geräte"},"devices.add_entity":{it:"Aggiungi entità",en:"Add entity",fr:"Ajouter une entité",de:"Entität hinzufügen"},"devices.empty.title":{it:"Nessun dispositivo importato",en:"No devices imported",fr:"Aucun appareil importé",de:"Keine Geräte importiert"},"devices.empty.hint":{it:"Aggiungi le tue prime entità HA per iniziare.",en:"Add your first HA entities to get started.",fr:"Ajoute tes premières entités HA pour commencer.",de:"Füge deine ersten HA-Entitäten hinzu, um zu starten."},"devices.types_hint":{it:"Tipo e capabilities vengono dedotti automaticamente dal dominio dell'entità HA (es. climate.* → termostato).",en:"Type and capabilities are auto-detected from the HA entity domain (e.g. climate.* → thermostat).",fr:"Le type et les capacités sont déduits automatiquement du domaine de l'entité HA (ex. climate.* → thermostat).",de:"Typ und Fähigkeiten werden automatisch aus der HA-Entitätsdomäne abgeleitet (z. B. climate.* → Thermostat)."},"devices.alias":{it:"Alias",en:"Alias",fr:"Alias",de:"Alias"},"devices.alias.hint":{it:"Soprannome usato solo dentro Chronos: clicca e rinomina, il friendly name in Home Assistant non cambia",en:"Nickname used only inside Chronos: click to rename, the Home Assistant friendly name is untouched",fr:"Surnom utilisé uniquement dans Chronos : cliquez pour renommer, le friendly name de Home Assistant ne change pas",de:"Spitzname nur innerhalb von Chronos: zum Umbenennen klicken, der Friendly Name in Home Assistant bleibt unverändert"},"devices.alias.placeholder":{it:"Alias (opzionale)",en:"Alias (optional)",fr:"Alias (facultatif)",de:"Alias (optional)"},"devices.import":{it:"Importa",en:"Import",fr:"Importer",de:"Importieren"},"devices.unlink":{it:"Sgancia",en:"Unlink",fr:"Détacher",de:"Trennen"},"devices.picker.title":{it:"Aggiungi entità HA",en:"Add HA entity",fr:"Ajouter une entité HA",de:"HA-Entität hinzufügen"},"devices.picker.count":{it:"{n} entità disponibili nel tuo Home Assistant",en:"{n} entities available in your Home Assistant",fr:"{n} entités disponibles dans ton Home Assistant",de:"{n} Entitäten in deinem Home Assistant verfügbar"},"devices.picker.search":{it:"Cerca per nome o entity_id…",en:"Search by name or entity_id…",fr:"Recherche par nom ou entity_id…",de:"Suche nach Name oder entity_id…"},"devices.picker.all_imported":{it:"Tutto importato",en:"All imported",fr:"Tout importé",de:"Alles importiert"},"devices.picker.all_imported.hint":{it:"Tutte le entità disponibili sono già state aggiunte.",en:"All available entities have already been added.",fr:"Toutes les entités disponibles ont déjà été ajoutées.",de:"Alle verfügbaren Entitäten wurden bereits hinzugefügt."},"settings.subtitle":{it:"Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni",en:"Global Chronos integration settings · apply to all schedules",fr:"Paramètres globaux de l'intégration Chronos · valables pour toutes les planifications",de:"Globale Chronos-Einstellungen · gelten für alle Zeitpläne"},"settings.weather.title":{it:"Sorgente meteo",en:"Weather source",fr:"Source météo",de:"Wetterquelle"},"settings.weather.subtitle":{it:"Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)",en:"HA entity used to evaluate weather rules · you can also map specific attributes to point sensors (local weather station, Ecowitt, …)",fr:"Entité HA utilisée pour évaluer les règles météo · tu peux aussi mapper des attributs spécifiques à des capteurs ponctuels (station météo locale, Ecowitt, …)",de:"HA-Entität zur Auswertung der Wetterregeln · einzelne Attribute können auch auf Punktsensoren gemappt werden (lokale Wetterstation, Ecowitt, …)"},"settings.weather.entity":{it:"Entità meteo principale",en:"Main weather entity",fr:"Entité météo principale",de:"Haupt-Wetterentität"},"settings.weather.entity.hint":{it:"Usata per le forecast.* e come fallback se nessun override è impostato qui sotto",en:"Used for forecast.* and as a fallback if no override is set below",fr:"Utilisée pour forecast.* et comme repli si aucun remplacement n'est défini ci-dessous",de:"Wird für forecast.* und als Fallback verwendet, wenn unten keine Überschreibung gesetzt ist"},"settings.weather.overrides.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibung"},"settings.weather.overrides.hint":{it:"Per ogni attributo puoi specificare un'entità sensor.* da cui leggere il valore. Se vuoto, viene letto dall'entità weather principale.",en:"For each attribute you can specify a sensor.* entity to read from. If empty, the value is read from the main weather entity.",fr:"Pour chaque attribut, tu peux spécifier une entité sensor.* à lire. Si vide, la valeur est lue depuis l'entité météo principale.",de:"Für jedes Attribut kannst du eine sensor.*-Entität angeben. Leer = Wert wird aus der Haupt-Wetterentität gelesen."},"settings.weather.overrides.use_main":{it:"— usa entità weather —",en:"— use weather entity —",fr:"— utiliser l'entité météo —",de:"— Wetterentität verwenden —"},"settings.weather.overrides.suggested":{it:"suggeriti",en:"suggested",fr:"suggérés",de:"empfohlen"},"settings.weather.overrides.others":{it:"Altri sensori",en:"Other sensors",fr:"Autres capteurs",de:"Weitere Sensoren"},"settings.weather.overrides.no_sensors":{it:"Nessun sensor.* o binary_sensor.* esposto in questo Home Assistant. Verifica di aver esposto le entità necessarie.",en:"No sensor.* or binary_sensor.* entities exposed in this Home Assistant. Make sure the entities you need are exposed.",fr:"Aucune entité sensor.* ou binary_sensor.* n'est exposée dans ce Home Assistant. Vérifie que les entités nécessaires sont exposées.",de:"Keine sensor.*- oder binary_sensor.*-Entitäten in diesem Home Assistant verfügbar. Stelle sicher, dass die benötigten Entitäten freigegeben sind."},"settings.weather.overrides.warn.unit_mismatch":{it:"Unità non compatibile: questo attributo si aspetta {expected}, il sensore espone {got}. Le regole potrebbero confrontare valori sbagliati.",en:"Unit mismatch: this attribute expects {expected}, the sensor reports {got}. Rules may compare wrong values.",fr:"Unités incompatibles : cet attribut attend {expected}, le capteur renvoie {got}. Les règles risquent de comparer des valeurs erronées.",de:"Einheit passt nicht: dieses Attribut erwartet {expected}, der Sensor liefert {got}. Regeln vergleichen evtl. falsche Werte."},"settings.weather.overrides.warn.class_mismatch":{it:"Tipo sensore diverso da quello atteso: atteso {expected}, ricevuto {got}. Verifica che sia la grandezza corretta.",en:"Sensor type differs from expected: expected {expected}, got {got}. Make sure it's the right quantity.",fr:"Type de capteur différent : attendu {expected}, reçu {got}. Vérifie qu'il s'agit de la bonne grandeur.",de:"Sensortyp weicht ab: erwartet {expected}, erhalten {got}. Prüfe, ob es die richtige Größe ist."},"settings.weather.overrides.warn.not_numeric":{it:'Stato attuale non numerico: "{state}". Questo attributo richiede un sensore numerico.',en:'Current state is not numeric: "{state}". This attribute requires a numeric sensor.',fr:"L'état actuel n'est pas numérique : \"{state}\". Cet attribut nécessite un capteur numérique.",de:'Aktueller Wert ist nicht numerisch: „{state}". Dieses Attribut erfordert einen numerischen Sensor.'},"settings.weather.overrides.warn.numeric_for_condition":{it:'L\'attributo condition richiede un sensore testuale (es. "sunny", "rainy"). Questo sensore espone un numero ("{state}").',en:'The condition attribute needs a text sensor (e.g. "sunny", "rainy"). This sensor reports a number ("{state}").',fr:'L\'attribut condition attend un capteur texte (ex. "sunny", "rainy"). Ce capteur renvoie un nombre ("{state}").',de:'Das Attribut „condition" erwartet einen Textsensor (z. B. „sunny", „rainy"). Dieser Sensor liefert eine Zahl („{state}").'},"settings.behavior.title":{it:"Comportamento esecuzione",en:"Execution behavior",fr:"Comportement d'exécution",de:"Ausführungsverhalten"},"settings.behavior.subtitle":{it:"Frequenza di aggiornamento e granularità",en:"Update frequency and granularity",fr:"Fréquence de mise à jour et granularité",de:"Aktualisierungsfrequenz und Granularität"},"settings.polling":{it:"Polling meteo",en:"Weather polling",fr:"Sondage météo",de:"Wetter-Abfrage"},"settings.polling.hint":{it:"Ogni quanto rivalutare le regole",en:"How often rules are re-evaluated",fr:"Fréquence de réévaluation des règles",de:"Intervall zur Neuberechnung der Regeln"},"settings.snap":{it:"Snap timeline",en:"Timeline snap",fr:"Pas de la timeline",de:"Timeline-Raster"},"settings.snap.hint":{it:"Granularità nel disegnare le fasce",en:"Granularity when drawing blocks",fr:"Granularité lors du tracé des créneaux",de:"Granularität beim Zeichnen der Blöcke"},"settings.notify.title":{it:"Notifiche",en:"Notifications",fr:"Notifications",de:"Benachrichtigungen"},"settings.notify.subtitle":{it:"Eventi che vogliono una notifica HA",en:"Events that want an HA notification",fr:"Événements qui déclenchent une notification HA",de:"Ereignisse, die eine HA-Benachrichtigung auslösen"},"settings.notify.block_executed":{it:"Fascia eseguita",en:"Block executed",fr:"Créneau exécuté",de:"Block ausgeführt"},"settings.notify.block_executed.desc":{it:"Quando il sistema avvia un comando per una fascia oraria",en:"When the system fires a command for a time block",fr:"Quand le système déclenche une commande pour un créneau",de:"Wenn das System einen Befehl für einen Zeitblock auslöst"},"settings.notify.rule_triggered":{it:"Regola meteo attivata",en:"Weather rule triggered",fr:"Règle météo déclenchée",de:"Wetterregel ausgelöst"},"settings.notify.rule_triggered.desc":{it:"Quando una regola override entra in azione",en:"When an override rule kicks in",fr:"Quand une règle de remplacement s'active",de:"Wenn eine Überschreibungsregel greift"},"settings.notify.sched_skipped":{it:"Schedulazione saltata",en:"Schedule skipped",fr:"Planification ignorée",de:"Zeitplan übersprungen"},"settings.notify.sched_skipped.desc":{it:"Quando una fascia viene skippata per condizioni meteo",en:"When a block is skipped due to weather conditions",fr:"Quand un créneau est ignoré pour cause de météo",de:"Wenn ein Block aufgrund von Wetterbedingungen übersprungen wird"},"settings.notify.command_error":{it:"Errore comando",en:"Command error",fr:"Erreur de commande",de:"Befehlsfehler"},"settings.notify.command_error.desc":{it:"Se un dispositivo non risponde",en:"If a device fails to respond",fr:"Si un appareil ne répond pas",de:"Wenn ein Gerät nicht antwortet"},"settings.appearance.title":{it:"Aspetto",en:"Appearance",fr:"Apparence",de:"Erscheinungsbild"},"settings.appearance.subtitle":{it:"Densità di visualizzazione predefinita",en:"Default visual density",fr:"Densité d'affichage par défaut",de:"Standardanzeigedichte"},"settings.appearance.theme_hint":{it:"Il tema (chiaro/scuro) segue automaticamente Home Assistant. Usa l'icona luna/sole nel topbar per cambiarlo a livello HA.",en:"Theme (light/dark) automatically follows Home Assistant. Use the moon/sun icon in the topbar to switch HA-wide.",fr:"Le thème (clair/sombre) suit automatiquement Home Assistant. Utilise l'icône lune/soleil dans la barre supérieure.",de:"Das Theme (hell/dunkel) folgt automatisch Home Assistant. Nutze das Mond/Sonne-Symbol in der Topbar."},"settings.theme":{it:"Tema",en:"Theme",fr:"Thème",de:"Theme"},"settings.theme.light":{it:"Chiaro",en:"Light",fr:"Clair",de:"Hell"},"settings.theme.dark":{it:"Scuro",en:"Dark",fr:"Sombre",de:"Dunkel"},"settings.theme.auto":{it:"Auto",en:"Auto",fr:"Auto",de:"Auto"},"settings.density":{it:"Densità",en:"Density",fr:"Densité",de:"Dichte"},"settings.density.comfortable":{it:"Comoda",en:"Comfortable",fr:"Confortable",de:"Komfortabel"},"settings.density.compact":{it:"Compatta",en:"Compact",fr:"Compact",de:"Kompakt"},"settings.timeline_default.title":{it:"Timeline predefinita",en:"Default timeline",fr:"Timeline par défaut",de:"Standard-Timeline"},"settings.timeline_default.subtitle":{it:"Usata per le schedulazioni senza una vista propria: la scelta fatta nell'editor viene ricordata per singola schedulazione",en:"Used for schedules without their own view: the pick made in the editor is remembered per schedule",fr:"Utilisée pour les plannings sans vue propre : le choix fait dans l'éditeur est mémorisé par planning",de:"Für Zeitpläne ohne eigene Ansicht: die im Editor gewählte Ansicht wird pro Zeitplan gespeichert"},"settings.colors.title":{it:"Colori dispositivi",en:"Device colors",fr:"Couleurs des appareils",de:"Gerätefarben"},"settings.colors.subtitle":{it:"L'accent del dispositivo riflette il suo stato corrente",en:"The device accent reflects its current state",fr:"L'accent de l'appareil reflète son état actuel",de:"Die Akzentfarbe des Geräts spiegelt seinen aktuellen Zustand wider"},"settings.colors.lights.title":{it:"Luci · usa colore reale da Home Assistant",en:"Lights · use real color from Home Assistant",fr:"Lumières · utiliser la couleur réelle de Home Assistant",de:"Lichter · echte Farbe aus Home Assistant verwenden"},"settings.colors.lights.desc":{it:"Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.",en:"When on, the light icon reflects the current RGB color. Otherwise uses soft yellow.",fr:"Si activé, l'icône de la lumière reflète la couleur RGB actuelle. Sinon utilise un jaune doux.",de:"Wenn aktiv, spiegelt das Lichtsymbol die aktuelle RGB-Farbe wider. Sonst weiches Gelb."},"settings.colors.thermostat.title":{it:"Termostati · gradiente temperatura",en:"Thermostats · temperature gradient",fr:"Thermostats · dégradé de température",de:"Thermostate · Temperaturverlauf"},"settings.colors.thermostat.desc":{it:"Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.",en:"Threshold ≤ → color. Values above the last threshold use the last color.",fr:"Seuil ≤ → couleur. Au-delà du dernier seuil, la dernière couleur est utilisée.",de:"Schwelle ≤ → Farbe. Werte über der letzten Schwelle nutzen die letzte Farbe."},"settings.colors.boiler.title":{it:"Boiler · gradiente temperatura",en:"Water heater · temperature gradient",fr:"Chauffe-eau · dégradé de température",de:"Boiler · Temperaturverlauf"},"settings.colors.boiler.desc":{it:"Stessa logica del termostato, range tipico 30-75°C.",en:"Same logic as the thermostat, typical range 30-75°C.",fr:"Même logique que le thermostat, plage typique 30-75°C.",de:"Gleiche Logik wie Thermostat, typischer Bereich 30-75 °C."},"settings.colors.preset.title":{it:"Preset modalità (climate)",en:"Climate preset modes",fr:"Préréglages climate",de:"Climate-Presets"},"settings.colors.preset.desc":{it:"Override del colore quando il termostato è in un preset specifico",en:"Color override when the thermostat is in a specific preset",fr:"Surcharge de couleur quand le thermostat est dans un préréglage spécifique",de:"Farb-Überschreibung, wenn das Thermostat in einem bestimmten Preset ist"},"settings.colors.add_stop":{it:"Stop",en:"Stop",fr:"Palier",de:"Stopp"},"settings.colors.remove_stop":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"settings.colors.kind.title":{it:"Colori timeline (azioni)",en:"Timeline colors (actions)",fr:"Couleurs de la timeline (actions)",de:"Timeline-Farben (Aktionen)"},"settings.colors.kind.desc":{it:"Colore dei blocchi nella timeline in base al tipo di azione (on/off/set/preset/cmd)",en:"Color of timeline blocks by action kind (on/off/set/preset/cmd)",fr:"Couleur des blocs de la timeline par type d'action (on/off/set/preset/cmd)",de:"Farbe der Timeline-Blöcke nach Aktionsart (on/off/set/preset/cmd)"},"settings.colors.simple.title":{it:"Dispositivi a stato semplice",en:"Simple-state devices",fr:"Appareils à état simple",de:"Geräte mit einfachem Zustand"},"settings.colors.simple.desc":{it:"Colore quando il dispositivo è attivo o inattivo, per tipi senza range continuo",en:"Color when the device is active or inactive, for types without a continuous range",fr:"Couleur lorsque l'appareil est actif ou inactif, pour les types sans plage continue",de:"Farbe wenn das Gerät aktiv oder inaktiv ist, für Typen ohne Bereich"},"settings.colors.range.title":{it:"Dispositivi con range",en:"Range devices",fr:"Appareils à plage",de:"Geräte mit Bereich"},"settings.colors.range.desc":{it:"Colore in base al valore (gradiente) per tapparelle (posizione) e ventilatori (velocità)",en:"Color by value (gradient) for blinds (position) and fans (speed)",fr:"Couleur selon la valeur (gradient) pour volets (position) et ventilateurs (vitesse)",de:"Farbe je Wert (Verlauf) für Rollläden (Position) und Ventilatoren (Geschwindigkeit)"},"settings.colors.active":{it:"Attivo",en:"Active",fr:"Actif",de:"Aktiv"},"settings.colors.inactive":{it:"Inattivo",en:"Inactive",fr:"Inactif",de:"Inaktiv"},"settings.colors.start":{it:"Inizio",en:"Start",fr:"Début",de:"Start"},"settings.colors.end":{it:"Fine",en:"End",fr:"Fin",de:"Ende"},"settings.colors.reset_all.title":{it:"Reset tutti i colori",en:"Reset all colors",fr:"Réinitialiser toutes les couleurs",de:"Alle Farben zurücksetzen"},"settings.colors.reset_all.desc":{it:"Ripristina i valori di default per tutte le sezioni colore (azioni, dispositivi, gradienti, preset, stops temperatura, light).",en:"Restore default values for every color section (actions, devices, gradients, presets, temperature stops, light).",fr:"Restaure les valeurs par défaut pour toutes les sections de couleur.",de:"Standardwerte für alle Farbabschnitte wiederherstellen."},"settings.colors.reset_all.button":{it:"Reset",en:"Reset",fr:"Réinitialiser",de:"Zurücksetzen"},"settings.colors.reset_all.confirm":{it:"Vuoi ripristinare tutti i colori ai valori di default? Questa azione sovrascrive ogni personalizzazione.",en:"Reset every color to defaults? This overwrites all your customizations.",fr:"Réinitialiser toutes les couleurs aux valeurs par défaut ? Cette action écrase toutes les personnalisations.",de:"Alle Farben auf Standard zurücksetzen? Dies überschreibt alle Anpassungen."},"settings.language.title":{it:"Lingua",en:"Language",fr:"Langue",de:"Sprache"},"settings.language.subtitle":{it:"Lingua dell'interfaccia Chronos",en:"Chronos UI language",fr:"Langue de l'interface Chronos",de:"Sprache der Chronos-Oberfläche"},"settings.language.auto":{it:"Auto (segui Home Assistant)",en:"Auto (follow Home Assistant)",fr:"Auto (suit Home Assistant)",de:"Auto (Home Assistant folgen)"},"live.weather.title":{it:"Meteo locale",en:"Local weather",fr:"Météo locale",de:"Lokales Wetter"},"live.weather.subtitle":{it:"Sorgente: {entity}",en:"Source: {entity}",fr:"Source : {entity}",de:"Quelle: {entity}"},"live.no_weather":{it:"Nessuna sorgente meteo configurata · vai in Impostazioni",en:"No weather source configured · go to Settings",fr:"Aucune source météo configurée · va dans Réglages",de:"Keine Wetterquelle konfiguriert · siehe Einstellungen"},"live.forecast.title":{it:"Forecast 24h",en:"24h forecast",fr:"Prévisions 24 h",de:"24-h-Vorhersage"},"live.schedules.title":{it:"Schedulazioni · stato live",en:"Schedules · live status",fr:"Planifications · état en direct",de:"Zeitpläne · Live-Status"},"live.devices.title":{it:"Dispositivi · stato live",en:"Devices · live status",fr:"Appareils · état en direct",de:"Geräte · Live-Status"},"live.devices.subtitle":{it:"Valori in tempo reale",en:"Real-time values",fr:"Valeurs en temps réel",de:"Echtzeitwerte"},"live.condition.sunny":{it:"Soleggiato",en:"Sunny",fr:"Ensoleillé",de:"Sonnig"},"live.condition.rainy":{it:"Pioggia",en:"Rainy",fr:"Pluvieux",de:"Regnerisch"},"live.condition.cloudy":{it:"Nuvoloso",en:"Cloudy",fr:"Nuageux",de:"Bewölkt"},"live.condition.partlycloudy":{it:"Parzialmente nuvoloso",en:"Partly cloudy",fr:"Partiellement nuageux",de:"Teilweise bewölkt"},"live.condition.snowy":{it:"Neve",en:"Snowy",fr:"Neige",de:"Schnee"},"live.condition.fog":{it:"Nebbia",en:"Fog",fr:"Brouillard",de:"Nebel"},"live.condition.windy":{it:"Ventoso",en:"Windy",fr:"Venteux",de:"Windig"},"live.not_today":{it:"Non in programma oggi",en:"Not scheduled today",fr:"Pas prévu aujourd'hui",de:"Heute nicht geplant"},"week.subtitle":{it:"Vista a 7 giorni · {n} schedulazioni attive",en:"7-day view · {n} active schedules",fr:"Vue 7 jours · {n} planifications actives",de:"7-Tage-Ansicht · {n} aktive Zeitpläne"},"week.legend":{it:"Legenda",en:"Legend",fr:"Légende",de:"Legende"},"week.today":{it:"Oggi",en:"Today",fr:"Aujourd'hui",de:"Heute"},"week.filter.title":{it:"Filtra schedulazioni",en:"Filter schedules",fr:"Filtrer les planifications",de:"Zeitpläne filtern"},"device.state":{it:"Stato attuale",en:"Current state",fr:"État actuel",de:"Aktueller Zustand"},"device.state.live":{it:"aggiornato live",en:"live updates",fr:"mises à jour en direct",de:"Live-Aktualisierung"},"device.type":{it:"Tipo dispositivo",en:"Device type",fr:"Type d'appareil",de:"Gerätetyp"},"device.linked_schedules":{it:"Schedule collegate",en:"Linked schedules",fr:"Planifications associées",de:"Verknüpfte Zeitpläne"},"device.linked_schedules.active":{it:"{n} attive",en:"{n} active",fr:"{n} actives",de:"{n} aktiv"},"device.capabilities":{it:"Capabilities rilevate",en:"Detected capabilities",fr:"Capacités détectées",de:"Erkannte Fähigkeiten"},"device.capabilities.subtitle":{it:"Servizi HA chiamabili su questo dispositivo",en:"HA services callable on this device",fr:"Services HA disponibles pour cet appareil",de:"Auf diesem Gerät aufrufbare HA-Dienste"},"device.schedules_using.title":{it:"Schedulazioni che usano questo dispositivo",en:"Schedules using this device",fr:"Planifications qui utilisent cet appareil",de:"Zeitpläne, die dieses Gerät verwenden"},"device.schedules_using.subtitle":{it:"{n} programmazioni collegate",en:"{n} linked schedules",fr:"{n} planifications liées",de:"{n} verknüpfte Zeitpläne"},"device.no_schedules":{it:"Nessuna programmazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"device.no_schedules.hint":{it:"Questo dispositivo non è incluso in nessuno schedule.",en:"This device is not included in any schedule.",fr:"Cet appareil n'est inclus dans aucune planification.",de:"Dieses Gerät ist in keinem Zeitplan enthalten."},"device.no_device.title":{it:"Nessun dispositivo",en:"No device",fr:"Aucun appareil",de:"Kein Gerät"},"device.no_device.hint":{it:"Importa prima un'entità HA.",en:"Import an HA entity first.",fr:"Importe d'abord une entité HA.",de:"Importiere zuerst eine HA-Entität."},"device.open_schedule":{it:"Apri",en:"Open",fr:"Ouvrir",de:"Öffnen"},"wrl.filter.all":{it:"Tutte le schedulazioni",en:"All schedules",fr:"Toutes les planifications",de:"Alle Zeitpläne"},"wrl.sort.manual":{it:"Ordine manuale",en:"Manual order",fr:"Ordre manuel",de:"Manuelle Reihenfolge"},"wrl.sort.schedule":{it:"Per schedulazione",en:"By schedule",fr:"Par planification",de:"Nach Zeitplan"},"wrl.sort.alpha":{it:"Alfabetico",en:"Alphabetical",fr:"Alphabétique",de:"Alphabetisch"},"wrl.manual.drag":{it:"Trascina per riordinare",en:"Drag to reorder",fr:"Glisser pour réordonner",de:"Zum Umsortieren ziehen"},"wrl.manual.up":{it:"Sposta su",en:"Move up",fr:"Monter",de:"Nach oben"},"wrl.manual.down":{it:"Sposta giù",en:"Move down",fr:"Descendre",de:"Nach unten"},"wrl.manual.filter_hint":{it:"Rimuovi il filtro per riordinare manualmente le regole",en:"Remove the filter to reorder rules manually",fr:"Retire le filtre pour réordonner les règles manuellement",de:"Filter entfernen, um Regeln manuell zu sortieren"},"wrl.unassigned":{it:"Nessuna schedulazione collegata",en:"No linked schedule",fr:"Aucune planification liée",de:"Kein verknüpfter Zeitplan"},"wrl.delete.shared":{it:"Questa regola è collegata a {n} schedulazioni: verrà eliminata da tutte. Continuare?",en:"This rule is linked to {n} schedules: it will be deleted from all of them. Continue?",fr:"Cette règle est liée à {n} planifications : elle sera supprimée de toutes. Continuer ?",de:"Diese Regel ist mit {n} Zeitplänen verknüpft und wird aus allen gelöscht. Fortfahren?"},"wr.targets.title":{it:"Schedulazioni collegate",en:"Linked schedules",fr:"Planifications liées",de:"Verknüpfte Zeitpläne"},"wr.targets.subtitle":{it:"La regola si applica a ogni schedulazione elencata, sulla fascia indicata",en:"The rule applies to every listed schedule, on the indicated block",fr:"La règle s'applique à chaque planification listée, sur le créneau indiqué",de:"Die Regel gilt für jeden gelisteten Zeitplan, auf dem angegebenen Block"},"wr.targets.add":{it:"Aggiungi schedulazione",en:"Add schedule",fr:"Ajouter une planification",de:"Zeitplan hinzufügen"},"wr.targets.hint":{it:"Una sola regola può pilotare più schedulazioni: la condizione è condivisa, la fascia target è per schedulazione.",en:"A single rule can drive several schedules: the condition is shared, the target block is per schedule.",fr:"Une seule règle peut piloter plusieurs planifications : la condition est partagée, le créneau cible est par planification.",de:"Eine Regel kann mehrere Zeitpläne steuern: Die Bedingung ist geteilt, der Zielblock je Zeitplan."},"wr.targets.incompatible":{it:"Tipo dispositivo diverso",en:"Different device type",fr:"Type d'appareil différent",de:"Anderer Gerätetyp"},"wr.targets.incompatible.alert":{it:"Questo effetto usa azioni specifiche del tipo dispositivo: tutte le schedulazioni collegate devono avere lo stesso tipo della prima.",en:"This effect uses device-type-specific actions: every linked schedule must share the first target's device type.",fr:"Cet effet utilise des actions propres au type d'appareil : toutes les planifications liées doivent partager le type de la première.",de:"Dieser Effekt nutzt gerätetypspezifische Aktionen: Alle verknüpften Zeitpläne müssen den Typ des ersten Ziels teilen."},"rule.shared.tooltip":{it:"Condivisa con: {list}",en:"Shared with: {list}",fr:"Partagée avec : {list}",de:"Geteilt mit: {list}"},"rule.unlink.shared":{it:"Questa regola è collegata a {n} schedulazioni. Verrà solo scollegata da «{name}», le altre la mantengono. Continuare?",en:'This rule is linked to {n} schedules. It will only be detached from "{name}"; the others keep it. Continue?',fr:"Cette règle est liée à {n} planifications. Elle sera seulement détachée de «{name}», les autres la conservent. Continuer ?",de:"Diese Regel ist mit {n} Zeitplänen verknüpft. Sie wird nur von „{name}“ getrennt, die anderen behalten sie. Fortfahren?"},"dup.title":{it:"Duplica schedulazione",en:"Duplicate schedule",fr:"Dupliquer la planification",de:"Zeitplan duplizieren"},"dup.subtitle":{it:"Copia di «{name}»: modifica i campi prima di creare.",en:'Copy of "{name}": adjust the fields before creating.',fr:"Copie de «{name}» : modifie les champs avant de créer.",de:"Kopie von „{name}“: Felder vor dem Erstellen anpassen."},"dup.copy_of":{it:"{name} (copia)",en:"{name} (copy)",fr:"{name} (copie)",de:"{name} (Kopie)"},"dup.include_rules":{it:"Copia anche le {n} regole meteo",en:"Also copy the {n} weather rules",fr:"Copier aussi les {n} règles météo",de:"Auch die {n} Wetterregeln kopieren"},"dup.disabled_note":{it:"La copia viene creata disattivata: controllala e attivala quando è pronta.",en:"The copy is created disabled: review it and enable it when ready.",fr:"La copie est créée désactivée : vérifie-la puis active-la.",de:"Die Kopie wird deaktiviert erstellt: prüfen und dann aktivieren."},"dup.create":{it:"Crea copia",en:"Create copy",fr:"Créer la copie",de:"Kopie erstellen"},"dup.button":{it:"Duplica…",en:"Duplicate…",fr:"Dupliquer…",de:"Duplizieren…"},"editor.export":{it:"Esporta JSON",en:"Export JSON",fr:"Exporter JSON",de:"JSON exportieren"},"wizard.alt.heading":{it:"Oppure parti da una schedulazione esistente",en:"Or start from an existing schedule",fr:"Ou pars d'une planification existante",de:"Oder von einem bestehenden Zeitplan ausgehen"},"wizard.import.heading":{it:"Importa da JSON (esportato da un'altra istanza Chronos)",en:"Import from JSON (exported from another Chronos instance)",fr:"Importer depuis JSON (exporté d'une autre instance Chronos)",de:"Aus JSON importieren (von einer anderen Chronos-Instanz exportiert)"},"wizard.import.file":{it:"Da file…",en:"From file…",fr:"Depuis un fichier…",de:"Aus Datei…"},"wizard.import.button":{it:"Importa",en:"Import",fr:"Importer",de:"Importieren"},"wizard.import.missing":{it:"Dispositivi non trovati su questa istanza: {list}. Importali in Gestione dispositivi e ricollegali alla schedulazione.",en:"Devices not found on this instance: {list}. Import them under Manage devices and re-link them to the schedule.",fr:"Appareils introuvables sur cette instance : {list}. Importe-les dans Gestion des appareils puis relie-les à la planification.",de:"Geräte auf dieser Instanz nicht gefunden: {list}. Unter Geräteverwaltung importieren und neu verknüpfen."},"transfer.err.invalid_json":{it:"JSON non valido",en:"Invalid JSON",fr:"JSON invalide",de:"Ungültiges JSON"},"transfer.err.invalid_schedule":{it:"Il JSON non contiene una schedulazione valida",en:"The JSON does not contain a valid schedule",fr:"Le JSON ne contient pas de planification valide",de:"Das JSON enthält keinen gültigen Zeitplan"},"transfer.err.invalid_device_type":{it:"Tipo dispositivo sconosciuto",en:"Unknown device type",fr:"Type d'appareil inconnu",de:"Unbekannter Gerätetyp"},"wr.heading":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"wr.heading.edit":{it:"Modifica regola meteo",en:"Edit weather rule",fr:"Modifier la règle météo",de:"Wetterregel bearbeiten"},"wr.subtitle":{it:"Costruisci una condizione IF/THEN. Verrà valutata ad ogni transizione di fascia.",en:"Build an IF/THEN condition. It is evaluated on every block transition.",fr:"Construis une condition SI/ALORS. Évaluée à chaque transition de créneau.",de:"Erstelle eine WENN/DANN-Bedingung. Wird bei jedem Blockwechsel ausgewertet."},"wr.if.title":{it:"Condizione · quando",en:"Condition · when",fr:"Condition · quand",de:"Bedingung · wann"},"wr.if.subtitle":{it:"Cosa deve essere vero per attivare la regola",en:"What must be true for the rule to fire",fr:"Ce qui doit être vrai pour déclencher la règle",de:"Was wahr sein muss, damit die Regel auslöst"},"wr.if.subtitle.and":{it:"Tutte le condizioni devono essere vere (AND)",en:"All conditions must be true (AND)",fr:"Toutes les conditions doivent être vraies (AND)",de:"Alle Bedingungen müssen wahr sein (AND)"},"wr.if.first":{it:"SE",en:"IF",fr:"SI",de:"WENN"},"wr.if.and":{it:"E",en:"AND",fr:"ET",de:"UND"},"wr.if.add_and":{it:"Aggiungi condizione (AND)",en:"Add condition (AND)",fr:"Ajouter une condition (AND)",de:"Bedingung hinzufügen (AND)"},"wr.if.sensor.label":{it:"Oppure scegli un sensore di Home Assistant",en:"Or pick a Home Assistant sensor",fr:"Ou choisir un capteur Home Assistant",de:"Oder einen Home-Assistant-Sensor wählen"},"wr.if.sensor.none":{it:"— Usa un attributo meteo qui sopra —",en:"— Use a weather attribute above —",fr:"— Utiliser un attribut météo ci-dessus —",de:"— Wetter-Attribut oben verwenden —"},"wr.if.sensor.hint":{it:"Sensori numerici (con unità di misura o stato numerico). Esempi: SOC batteria, previsione FTV, potenza istantanea.",en:"Numeric sensors (with unit of measurement or numeric state). Examples: battery SOC, PV forecast, instantaneous power.",fr:"Capteurs numériques (avec unité ou état numérique). Exemples : SOC batterie, prévision PV, puissance instantanée.",de:"Numerische Sensoren (mit Maßeinheit oder numerischem Zustand). Beispiele: Batterie-SOC, PV-Prognose, Momentanleistung."},"wr.if.sensor.search":{it:"Filtra sensori…",en:"Filter sensors…",fr:"Filtrer les capteurs…",de:"Sensoren filtern…"},"wr.if.sensor.no_match":{it:"Nessun sensore corrisponde",en:"No matching sensor",fr:"Aucun capteur correspondant",de:"Kein passender Sensor"},"wr.var":{it:"Variabile meteo",en:"Weather variable",fr:"Variable météo",de:"Wettervariable"},"wr.op":{it:"Operatore",en:"Operator",fr:"Opérateur",de:"Operator"},"wr.op.eq":{it:"uguale a",en:"equal to",fr:"égal à",de:"gleich"},"wr.op.neq":{it:"diverso da",en:"different from",fr:"différent de",de:"ungleich"},"wr.threshold":{it:"Soglia",en:"Threshold",fr:"Seuil",de:"Schwelle"},"wr.then.title":{it:"Azione · cosa fare",en:"Action · what to do",fr:"Action · que faire",de:"Aktion · was tun"},"wr.then.subtitle":{it:"L'effetto sulla fascia oraria attiva",en:"Effect on the active time block",fr:"Effet sur le créneau horaire actif",de:"Auswirkung auf den aktiven Zeitblock"},"wr.action.skip":{it:"Salta esecuzione",en:"Skip execution",fr:"Sauter l'exécution",de:"Ausführung überspringen"},"wr.action.skip.desc":{it:"La fascia non viene eseguita",en:"The block is not executed",fr:"Le créneau n'est pas exécuté",de:"Der Block wird nicht ausgeführt"},"wr.action.shift":{it:"Trasla orario",en:"Shift time",fr:"Décaler l'horaire",de:"Zeit verschieben"},"wr.action.shift.desc":{it:"Sposta l'inizio di X ore",en:"Move the start by X hours",fr:"Décale le début de X heures",de:"Verschiebt den Start um X Stunden"},"wr.action.force":{it:"Forza azione",en:"Force action",fr:"Forcer une action",de:"Aktion erzwingen"},"wr.action.force.desc":{it:"Esegue un'azione specifica",en:"Run a specific action",fr:"Exécute une action spécifique",de:"Führt eine bestimmte Aktion aus"},"wr.action.duration":{it:"Cambia durata",en:"Change duration",fr:"Changer la durée",de:"Dauer ändern"},"wr.action.duration.desc":{it:"Estende o accorcia la fascia",en:"Extend or shorten the block",fr:"Allonge ou raccourcit le créneau",de:"Verlängert oder kürzt den Block"},"wr.target.label":{it:"Fascia",en:"Block",fr:"Créneau",de:"Block"},"wr.target.all_blocks":{it:"Tutte le fasce",en:"All blocks",fr:"Tous les créneaux",de:"Alle Blöcke"},"wr.effect.title":{it:"Tipo di effetto",en:"Effect type",fr:"Type d'effet",de:"Effekttyp"},"wr.effect.subtitle":{it:"Cosa fa la regola quando si attiva",en:"What the rule does when it fires",fr:"Ce que fait la règle quand elle se déclenche",de:"Was die Regel beim Auslösen macht"},"wr.effect.skip":{it:"Salta",en:"Skip",fr:"Ignorer",de:"Überspringen"},"wr.effect.skip.desc":{it:"Non eseguire l'azione del blocco",en:"Don't run the block action",fr:"Ne pas exécuter l'action du créneau",de:"Aktion des Blocks nicht ausführen"},"wr.effect.shift":{it:"Trasla orario",en:"Shift time",fr:"Décaler",de:"Verschieben"},"wr.effect.shift.desc":{it:"Sposta il blocco di N minuti",en:"Move the block by N minutes",fr:"Déplacer le créneau de N minutes",de:"Block um N Minuten verschieben"},"wr.effect.extend":{it:"Allunga",en:"Extend",fr:"Allonger",de:"Verlängern"},"wr.effect.extend.desc":{it:"Allunga il blocco; il blocco adiacente si accorcia",en:"Extend the block; the adjacent block shrinks",fr:"Allonge le créneau ; le créneau adjacent rétrécit",de:"Block verlängern; angrenzender Block wird kürzer"},"wr.effect.shrink":{it:"Accorcia",en:"Shrink",fr:"Raccourcir",de:"Verkürzen"},"wr.effect.shrink.desc":{it:"Accorcia il blocco; il blocco adiacente si allunga",en:"Shrink the block; the adjacent block extends",fr:"Raccourcit le créneau ; le créneau adjacent s'allonge",de:"Block verkürzen; angrenzender Block wird länger"},"wr.effect.force_action":{it:"Forza azione",en:"Force action",fr:"Forcer une action",de:"Aktion erzwingen"},"wr.effect.force_action.desc":{it:"Esegue subito un'azione specifica",en:"Run a specific action immediately",fr:"Exécute une action spécifique immédiatement",de:"Sofort eine bestimmte Aktion ausführen"},"wr.effect.replace_value":{it:"Sostituisci valore",en:"Replace value",fr:"Remplacer la valeur",de:"Wert ersetzen"},"wr.effect.replace_value.desc":{it:"Cambia il valore dell'azione del blocco (es. 19°C invece di 21°C)",en:"Change the block action's value (e.g. 19°C instead of 21°C)",fr:"Changer la valeur de l'action (ex. 19°C au lieu de 21°C)",de:"Wert der Blockaktion ändern (z. B. 19 °C statt 21 °C)"},"wr.effect.scale_duration":{it:"Scala durata",en:"Scale duration",fr:"Mettre à l'échelle la durée",de:"Dauer skalieren"},"wr.effect.scale_duration.desc":{it:"Durata proporzionale alla variabile meteo",en:"Duration proportional to a weather variable",fr:"Durée proportionnelle à une variable météo",de:"Dauer proportional zu einer Wettervariable"},"wr.effect.scale_value":{it:"Scala valore",en:"Scale value",fr:"Mettre à l'échelle la valeur",de:"Wert skalieren"},"wr.effect.scale_value.desc":{it:"Valore proporzionale alla variabile meteo",en:"Value proportional to a weather variable",fr:"Valeur proportionnelle à une variable météo",de:"Wert proportional zu einer Wettervariable"},"wr.effect_params.title":{it:"Parametri effetto",en:"Effect parameters",fr:"Paramètres de l'effet",de:"Effekt-Parameter"},"wr.delta":{it:"Variazione",en:"Delta",fr:"Variation",de:"Differenz"},"wr.direction.label":{it:"Direzione",en:"Direction",fr:"Direction",de:"Richtung"},"wr.direction.forward":{it:"Avanti (sposta la fine)",en:"Forward (move end)",fr:"Avant (décaler la fin)",de:"Vorwärts (Ende verschieben)"},"wr.direction.backward":{it:"Indietro (sposta l'inizio)",en:"Backward (move start)",fr:"Arrière (décaler le début)",de:"Rückwärts (Anfang verschieben)"},"wr.direction.hint":{it:"In quale direzione spostare l'edge del blocco target",en:"Which edge of the target block to move",fr:"Quel bord du créneau cible déplacer",de:"Welche Kante des Zielblocks verschoben werden soll"},"wr.scale.input.title":{it:"Variabile di input",en:"Input variable",fr:"Variable d'entrée",de:"Eingangsvariable"},"wr.scale.input.subtitle":{it:"Range della variabile meteo letta in tempo reale",en:"Range of the weather variable read live",fr:"Plage de la variable météo en direct",de:"Bereich der live gelesenen Wettervariable"},"wr.scale.input.hint":{it:"Valori fuori range vengono clampati. Lineare tra min e max.",en:"Values outside the range are clamped. Linear between min and max.",fr:"Les valeurs hors plage sont bridées. Linéaire entre min et max.",de:"Werte außerhalb des Bereichs werden begrenzt. Linear zwischen Min und Max."},"wr.scale.var":{it:"Variabile",en:"Variable",fr:"Variable",de:"Variable"},"wr.scale.var_min":{it:"Variabile MIN",en:"Variable MIN",fr:"Variable MIN",de:"Variable MIN"},"wr.scale.var_max":{it:"Variabile MAX",en:"Variable MAX",fr:"Variable MAX",de:"Variable MAX"},"wr.scale.out_min":{it:"Output MIN",en:"Output MIN",fr:"Sortie MIN",de:"Ausgabe MIN"},"wr.scale.out_max":{it:"Output MAX",en:"Output MAX",fr:"Sortie MAX",de:"Ausgabe MAX"},"wr.replace_value.pick_block":{it:"Seleziona prima una fascia specifica al di sopra",en:"Select a specific block above first",fr:"Sélectionne d'abord un créneau spécifique ci-dessus",de:"Wähle zuerst einen Block oben aus"},"wr.replace_value.no_value":{it:"L'azione di questa fascia non ha un valore parametrabile",en:"This block's action has no parametrisable value",fr:"L'action de ce créneau n'a pas de valeur paramétrable",de:"Aktion dieses Blocks hat keinen einstellbaren Wert"},"wr.conflict.title":{it:"Possibile conflitto",en:"Possible conflict",fr:"Conflit possible",de:"Möglicher Konflikt"},"wr.conflict.body":{it:"Esistono già regole che agiscono sulla stessa fascia o tipo di effetto. Verranno applicate in ordine; in caso di sovrapposizione vince l'ultima attivata.",en:"Other rules already act on this block or effect type. They are applied in order; on overlap the most recent firing wins.",fr:"D'autres règles agissent déjà sur ce créneau ou ce type d'effet. Elles s'appliquent dans l'ordre ; en cas de chevauchement la plus récente l'emporte.",de:"Andere Regeln greifen bereits auf diesen Block oder Effekt-Typ zu. Sie werden der Reihe nach angewendet; bei Überlappung gewinnt die zuletzt aktivierte."},"wr.fire_mode.label":{it:"Frequenza di attivazione",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"wr.fire_mode.hint":{it:"Quanto spesso la regola può attivarsi quando la condizione è vera",en:"How often the rule can fire when the condition is true",fr:"Fréquence de déclenchement quand la condition est vraie",de:"Wie oft die Regel auslösen kann, wenn die Bedingung wahr ist"},"wr.fire_mode.every":{it:"Ogni transizione (sconsigliato per oscillazioni)",en:"Every transition (not recommended for oscillating values)",fr:"À chaque transition (déconseillé pour valeurs oscillantes)",de:"Jede Transition (nicht empfohlen für schwankende Werte)"},"wr.fire_mode.once_per_day":{it:"Una volta al giorno (riarma a mezzanotte)",en:"Once per day (re-arms at midnight)",fr:"Une fois par jour (réarme à minuit)",de:"Einmal pro Tag (bewaffnet sich um Mitternacht neu)"},"wr.fire_mode.once_per_daytime":{it:"Una volta tra alba e tramonto",en:"Once between sunrise and sunset",fr:"Une fois entre lever et coucher du soleil",de:"Einmal zwischen Sonnenaufgang und -untergang"},"wr.fire_mode.once_per_nighttime":{it:"Una volta tra tramonto e alba",en:"Once between sunset and sunrise",fr:"Une fois entre coucher et lever du soleil",de:"Einmal zwischen Sonnenuntergang und -aufgang"},"wr.preview":{it:"Preview",en:"Preview",fr:"Aperçu",de:"Vorschau"},"wr.preview.subtitle":{it:"Come si comporta sulla schedulazione corrente",en:"How it behaves on the current schedule",fr:"Comment elle se comporte sur la planification actuelle",de:"Wie sich die Regel auf den aktuellen Zeitplan auswirkt"},"schedule.active":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"schedule.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"schedule.next_block":{it:"Prossima fascia",en:"Next block",fr:"Prochain créneau",de:"Nächster Block"},"schedule.now_block":{it:"Fascia attuale",en:"Current block",fr:"Créneau actuel",de:"Aktueller Block"},"schedule.no_blocks":{it:"Nessuna fascia",en:"No blocks",fr:"Aucun créneau",de:"Keine Blöcke"},"schedule.every_day":{it:"Ogni giorno",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"days.short.0":{it:"Lun",en:"Mon",fr:"Lun",de:"Mo"},"days.short.1":{it:"Mar",en:"Tue",fr:"Mar",de:"Di"},"days.short.2":{it:"Mer",en:"Wed",fr:"Mer",de:"Mi"},"days.short.3":{it:"Gio",en:"Thu",fr:"Jeu",de:"Do"},"days.short.4":{it:"Ven",en:"Fri",fr:"Ven",de:"Fr"},"days.short.5":{it:"Sab",en:"Sat",fr:"Sam",de:"Sa"},"days.short.6":{it:"Dom",en:"Sun",fr:"Dim",de:"So"},"timeline.linear":{it:"Lineare",en:"Linear",fr:"Linéaire",de:"Linear"},"timeline.radial":{it:"Radiale",en:"Radial",fr:"Radial",de:"Radial"},"timeline.list":{it:"Lista",en:"List",fr:"Liste",de:"Liste"},"help.title":{it:"Guida e ricette",en:"Help and recipes",fr:"Aide et recettes",de:"Hilfe und Rezepte"},"help.subtitle":{it:"Esempi pratici di schedulazioni comuni — clicca per crearle e personalizzarle",en:"Practical examples of common schedules — click to create and customise",fr:"Exemples pratiques de planifications courantes — cliquez pour créer et personnaliser",de:"Praktische Beispiele für häufige Zeitpläne — klicken zum Erstellen und Anpassen"},"help.intro.title":{it:"Come funziona Chronos",en:"How Chronos works",fr:"Comment fonctionne Chronos",de:"Wie Chronos funktioniert"},"help.intro.body":{it:"Crea schedulazioni con fasce orarie giornaliere. Ogni fascia esegue un'azione (es. set_temperature 21°C). Aggiungi regole meteo che possono saltare la fascia, modificarne durata o forzare un'altra azione in base a sensori esterni o condizioni del sole. Le fasce possono essere ancorate ad alba/tramonto per adattarsi alle stagioni automaticamente.",en:"Create schedules with daily time blocks. Each block runs an action (e.g. set_temperature 21°C). Add weather rules that can skip the block, change its duration, or force a different action based on external sensors or sun position. Blocks can be anchored to sunrise/sunset so they follow seasonal change automatically.",fr:"Créez des planifications avec des créneaux horaires quotidiens. Chaque créneau exécute une action (ex. set_temperature 21°C). Ajoutez des règles météo qui peuvent ignorer le créneau, modifier sa durée ou forcer une autre action selon des capteurs externes ou la position du soleil. Les créneaux peuvent être ancrés au lever/coucher du soleil pour suivre les saisons automatiquement.",de:"Erstelle Zeitpläne mit täglichen Zeitblöcken. Jeder Block führt eine Aktion aus (z.B. set_temperature 21°C). Füge Wetterregeln hinzu, die den Block überspringen, seine Dauer ändern oder eine andere Aktion basierend auf externen Sensoren oder dem Sonnenstand erzwingen können. Blöcke können an Sonnenaufgang/-untergang verankert werden, um sich automatisch an die Jahreszeit anzupassen."},"help.create_button":{it:"Crea questa schedulazione",en:"Create this schedule",fr:"Créer cette planification",de:"Diesen Zeitplan erstellen"},"help.tag.anchored":{it:"Ancorata al sole",en:"Sun-anchored",fr:"Ancrée au soleil",de:"Sonnen-verankert"},"help.tag.trigger":{it:"Trigger meteo",en:"Weather trigger",fr:"Déclencheur météo",de:"Wetter-Trigger"},"help.quickstart.title":{it:"Quick start",en:"Quick start",fr:"Démarrage rapide",de:"Schnellstart"},"help.quickstart.subtitle":{it:"Sei passi per creare la tua prima schedulazione. La guida completa con screenshot è su GitHub.",en:"Six steps to set up your first schedule. The full guide with screenshots is on GitHub.",fr:"Six étapes pour configurer ta première planification. Le guide complet avec captures est sur GitHub.",de:"Sechs Schritte zum ersten Zeitplan. Die vollständige Anleitung mit Screenshots liegt auf GitHub."},"help.quickstart.open_full_guide":{it:"Apri la guida completa",en:"Open full guide",fr:"Ouvrir le guide complet",de:"Vollständige Anleitung öffnen"},"help.quickstart.s1.title":{it:"Importa i dispositivi",en:"Import your devices",fr:"Importe tes appareils",de:"Geräte importieren"},"help.quickstart.s1.body":{it:"Vai su Gestisci dispositivi e aggiungi le entità HA che vuoi controllare (luci, termostati, valvole, ecc.).",en:"Go to Manage devices and add the HA entities you want to control (lights, thermostats, valves, etc.).",fr:"Va dans Gérer les appareils et ajoute les entités HA à contrôler (lumières, thermostats, vannes, etc.).",de:"Geh zu Geräte verwalten und füge die HA-Entitäten hinzu, die du steuern willst (Lichter, Thermostate, Ventile usw.)."},"help.quickstart.s2.title":{it:"Crea una schedulazione",en:"Create a schedule",fr:"Crée une planification",de:"Zeitplan erstellen"},"help.quickstart.s2.body":{it:"Dall'Overview clicca + Nuova schedulazione. Il wizard ti chiede nome, dispositivi e fasce iniziali.",en:"From the Overview click + New schedule. The wizard asks for a name, devices and initial blocks.",fr:"Depuis Overview, clique + Nouvelle planification. L'assistant demande un nom, les appareils et les créneaux initiaux.",de:"Über Overview auf + Neuer Zeitplan klicken. Der Wizard fragt nach Name, Geräten und ersten Blöcken."},"help.quickstart.s3.title":{it:"Aggiungi e modifica fasce",en:"Add and edit time blocks",fr:"Ajoute et modifie les créneaux",de:"Zeitblöcke hinzufügen und bearbeiten"},"help.quickstart.s3.body":{it:"Trascina i bordi sulla timeline per cambiare gli orari. Per ogni fascia scegli azione e valore nel pannello di destra. Le fasce possono essere ancorate ad alba/tramonto.",en:"Drag the edges on the timeline to change times. Pick action and value per block in the right panel. Blocks can be anchored to sunrise/sunset.",fr:"Glisse les bords de la timeline pour changer les heures. Choisis action et valeur par créneau à droite. Les créneaux peuvent être ancrés au lever/coucher.",de:"Ränder auf der Timeline ziehen, um Zeiten zu ändern. Pro Block Aktion und Wert rechts wählen. Blöcke können an Sonnenauf-/-untergang verankert werden."},"help.quickstart.s4.title":{it:"Aggiungi regole meteo (opzionale)",en:"Add weather rules (optional)",fr:"Ajoute des règles météo (optionnel)",de:"Wetterregeln hinzufügen (optional)"},"help.quickstart.s4.body":{it:"Una regola IF/THEN che salta o modifica una fascia in base a meteo, sole o un sensore HA qualsiasi (es. SOC batteria off-grid). Le condizioni si combinano con AND.",en:"An IF/THEN rule that skips or modifies a block based on weather, sun position or any HA sensor (e.g. off-grid battery SOC). Conditions combine with AND.",fr:"Une règle SI/ALORS qui ignore ou modifie un créneau selon la météo, le soleil ou n'importe quel capteur HA (ex. SOC batterie off-grid). Les conditions se combinent avec AND.",de:"Eine WENN/DANN-Regel, die einen Block je nach Wetter, Sonnenstand oder einem beliebigen HA-Sensor überspringt oder ändert (z.B. SOC einer Off-grid-Batterie). Bedingungen werden mit AND kombiniert."},"help.quickstart.s5.title":{it:"Verifica con Live status",en:"Verify with Live status",fr:"Vérifie avec Live status",de:"Mit Live-Status prüfen"},"help.quickstart.s5.body":{it:"Mostra in tempo reale quale fascia è attiva e cosa sta facendo Chronos. Utile per debug.",en:"Shows in real time which block is active and what Chronos is doing. Useful for debugging.",fr:"Montre en temps réel quel créneau est actif et ce que fait Chronos. Utile pour le debug.",de:"Zeigt in Echtzeit, welcher Block aktiv ist und was Chronos macht. Nützlich für Debugging."},"help.quickstart.s6.title":{it:"Pianifica la settimana",en:"Plan the week",fr:"Planifie la semaine",de:"Woche planen"},"help.quickstart.s6.body":{it:"La Week view affianca tutte le tue schedulazioni su 7 giorni. Pratica per controllare sovrapposizioni e copertura.",en:"The Week view stacks all your schedules across 7 days. Handy for spotting overlaps and coverage gaps.",fr:"La vue Semaine empile toutes tes planifications sur 7 jours. Pratique pour repérer chevauchements et trous.",de:"Die Wochenansicht stapelt alle Zeitpläne über 7 Tage. Praktisch für Überlappungen und Lücken."},"help.faq.title":{it:"FAQ e troubleshooting",en:"FAQ and troubleshooting",fr:"FAQ et dépannage",de:"FAQ und Fehlerbehebung"},"help.faq.q1":{it:"Ho installato la card ma non si vede in dashboard.",en:"I installed the card but it doesn't show up in my dashboard.",fr:"J'ai installé la carte mais elle n'apparaît pas dans mon dashboard.",de:"Ich habe die Karte installiert, aber sie erscheint nicht im Dashboard."},"help.faq.a1":{it:"Riavvia Home Assistant dopo l'installazione. Se ancora non appare, fai un hard refresh del browser (Ctrl+Shift+R) per bypassare la cache. Su install via HACS la registrazione è automatica; in caso di install manuale aggiungi la resource in Impostazioni → Dashboard → Risorse: url /local/chronos-card.js, type module.",en:"Restart Home Assistant after the install. If it still doesn't show, hard-refresh the browser (Ctrl+Shift+R) to bypass cache. On HACS installs the resource is registered automatically; on manual installs add it under Settings → Dashboards → Resources: url /local/chronos-card.js, type module.",fr:"Redémarre Home Assistant après l'installation. Si elle n'apparaît toujours pas, fais un hard refresh (Ctrl+Shift+R) pour ignorer le cache. Sur installation HACS, la ressource est enregistrée automatiquement ; en installation manuelle, ajoute-la dans Paramètres → Dashboards → Ressources : url /local/chronos-card.js, type module.",de:"Home Assistant nach der Installation neu starten. Erscheint sie immer noch nicht, harten Browser-Refresh (Strg+Umschalt+R). Bei HACS-Installation wird die Ressource automatisch registriert; bei manueller Installation in Einstellungen → Dashboards → Ressourcen hinzufügen: url /local/chronos-card.js, type module."},"help.faq.q2":{it:"Una schedulazione non parte all'orario previsto.",en:"A schedule isn't firing at the expected time.",fr:"Une planification ne se déclenche pas à l'heure prévue.",de:"Ein Zeitplan löst nicht zur erwarteten Zeit aus."},"help.faq.a2":{it:"Verifica nell'ordine: la schedulazione è abilitata (toggle), il giorno corrente è attivo nella maschera giornaliera, la fascia copre l'ora attuale, i dispositivi della schedulazione sono importati. Apri Live status per vedere quale fascia Chronos sta considerando attiva e perché.",en:"Check, in order: the schedule is enabled (toggle), today is selected in the day mask, the block covers the current time, the schedule's devices are imported. Open Live status to see which block Chronos considers active and why.",fr:"Vérifie dans l'ordre : la planification est activée, le jour est sélectionné dans le masque, le créneau couvre l'heure actuelle, les appareils sont importés. Ouvre Live status pour voir quel créneau Chronos considère actif et pourquoi.",de:"Prüfe nacheinander: Zeitplan aktiviert (Toggle), heutiger Tag aktiv in der Tagesmaske, Block deckt die aktuelle Uhrzeit, Geräte sind importiert. Öffne Live-Status, um zu sehen, welcher Block aktiv ist und warum."},"help.faq.q3":{it:"La regola meteo non scatta anche se la condizione è vera.",en:"A weather rule isn't triggering even when the condition is true.",fr:"Une règle météo ne se déclenche pas malgré la condition vraie.",de:"Eine Wetterregel löst nicht aus, obwohl die Bedingung erfüllt ist."},"help.faq.a3":{it:"Apri il Live status: il valore corrente dell'attributo è quello che ti aspetti? Se referenzi un sensor.* assicurati che la entity_id sia esatta e numerica. Per i fire mode una sola attivazione al giorno (once_per_day, once_per_daytime, once_per_nighttime) la regola si arma di nuovo solo nel ciclo successivo.",en:"Open Live status: is the current attribute value what you expect? If you reference a sensor.* make sure the entity_id is exact and numeric. With once_per_day / once_per_daytime / once_per_nighttime fire modes, the rule re-arms only in the next cycle.",fr:"Ouvre Live status : la valeur de l'attribut est-elle celle attendue ? Si tu référencies un sensor.*, vérifie que l'entity_id est exact et numérique. Avec les fire modes once_per_*, la règle se réarme seulement au cycle suivant.",de:"Live-Status öffnen: Stimmt der aktuelle Attributwert? Wenn du auf sensor.* verweist, entity_id genau und numerisch prüfen. Bei once_per_*-Fire-Modes wird die Regel erst im nächsten Zyklus wieder scharfgeschaltet."},"help.faq.q4":{it:"Posso schedulare un blocco che attraversa la mezzanotte (es. tramonto → alba)?",en:"Can I schedule a block that crosses midnight (e.g. sunset → sunrise)?",fr:"Puis-je planifier un créneau qui traverse minuit (ex. coucher → lever) ?",de:"Kann ich einen Block über Mitternacht planen (z.B. Untergang → Aufgang)?"},"help.faq.a4":{it:"No: i blocchi sono limitati al giorno solare. Splitta in due fasce: es. 22:00 → 23:59 e 00:00 → 06:00. L'editor mostra un avviso quando rileva una configurazione che attraversa la mezzanotte.",en:"No: blocks are bound to the calendar day. Split into two: e.g. 22:00 → 23:59 and 00:00 → 06:00. The editor warns you when it detects a midnight-crossing configuration.",fr:"Non : les créneaux sont limités au jour calendaire. Divise en deux : ex. 22:00 → 23:59 et 00:00 → 06:00. L'éditeur t'avertit en cas de config traversant minuit.",de:"Nein: Blöcke sind auf den Kalendertag begrenzt. In zwei aufteilen: z.B. 22:00 → 23:59 und 00:00 → 06:00. Der Editor warnt bei Mitternacht-überspannenden Konfigurationen."},"help.faq.q5":{it:"Posso usare un sensore della mia stazione meteo locale al posto del weather provider?",en:"Can I use a sensor from my local weather station instead of the weather provider?",fr:"Puis-je utiliser un capteur de ma station météo locale à la place du provider ?",de:"Kann ich einen Sensor meiner lokalen Wetterstation statt des Wetter-Providers nutzen?"},"help.faq.a5":{it:"Sì. In Impostazioni → Sorgente meteo → Override per sensore mappa ogni attributo (temperatura, umidità, vento, ecc.) a una sensor.* specifica. Lo accetta sia con device_class atmospheric_pressure che pressure, e lo stesso vale per gli altri attributi standard.",en:"Yes. Under Settings → Weather source → Sensor overrides map each attribute (temperature, humidity, wind, etc.) to a specific sensor.* entity. Accepts both atmospheric_pressure and pressure device_classes, and the equivalent for other standard attributes.",fr:"Oui. Dans Paramètres → Source météo → Surcharges par capteur, mappe chaque attribut à une sensor.* spécifique. Accepte atmospheric_pressure et pressure comme device_class, et l'équivalent pour les autres attributs standards.",de:"Ja. Unter Einstellungen → Wetterquelle → Sensor-Überschreibungen jedes Attribut einer sensor.*-Entität zuordnen. Akzeptiert atmospheric_pressure und pressure als device_class, ebenso für andere Standard-Attribute."},"help.faq.q6":{it:"Ho perso schedulazioni o dispositivi dopo un riavvio.",en:"I lost schedules or devices after a restart.",fr:"J'ai perdu des planifications ou des appareils après un redémarrage.",de:"Ich habe nach einem Neustart Zeitpläne oder Geräte verloren."},"help.faq.a6":{it:"I dati di Chronos sono nel file .storage/chronos.* di Home Assistant: sono inclusi in ogni full backup. Ripristina il backup più recente per recuperarli. Non modificare manualmente quei file con HA in esecuzione.",en:"Chronos data lives in .storage/chronos.* in Home Assistant and is included in every full backup. Restore the most recent backup to recover. Don't edit those files manually while HA is running.",fr:"Les données Chronos sont dans .storage/chronos.* de Home Assistant et incluses dans chaque sauvegarde complète. Restaure la sauvegarde la plus récente. Ne modifie pas ces fichiers manuellement pendant que HA tourne.",de:"Chronos-Daten liegen in .storage/chronos.* von Home Assistant und sind in jedem Full-Backup enthalten. Letztes Backup wiederherstellen. Diese Dateien nicht bei laufendem HA manuell bearbeiten."},"recipe.thermostat_day_night.title":{it:"Riscaldamento giorno/notte",en:"Day/night heating",fr:"Chauffage jour/nuit",de:"Tag/Nacht-Heizung"},"recipe.thermostat_day_night.when":{it:"Termostato che alterna 18°C la notte e 21°C il giorno",en:"Thermostat alternating 18°C at night and 21°C during the day",fr:"Thermostat alternant 18°C la nuit et 21°C le jour",de:"Thermostat: 18°C nachts, 21°C tagsüber"},"recipe.thermostat_day_night.howto":{it:"Tre fasce: 00-07 e 22-24 → 18°C (eco notturno), 07-22 → 21°C (comfort). Regola meteo: se la temperatura esterna supera 22°C la fascia viene saltata (non scalda inutilmente nelle giornate calde).",en:"Three blocks: 00-07 and 22-24 → 18°C (night eco), 07-22 → 21°C (comfort). Weather rule: if outdoor temperature exceeds 22°C the block is skipped (no needless heating on warm days).",fr:"Trois créneaux : 00-07 et 22-24 → 18°C (éco nuit), 07-22 → 21°C (confort). Règle météo : si la température extérieure dépasse 22°C le créneau est ignoré.",de:"Drei Blöcke: 00-07 und 22-24 → 18°C (Nacht-Eco), 07-22 → 21°C (Komfort). Wetterregel: bei Außentemperatur über 22°C wird der Block übersprungen."},"recipe.thermostat_day_night.preset_name":{it:"Riscaldamento casa",en:"Home heating",fr:"Chauffage maison",de:"Hausheizung"},"recipe.lights_at_sunset.title":{it:"Luci al tramonto",en:"Lights at sunset",fr:"Lumières au coucher du soleil",de:"Licht bei Sonnenuntergang"},"recipe.lights_at_sunset.when":{it:"Accensione 30 minuti prima del tramonto, fino alle 23",en:"Turn on 30 minutes before sunset, until 23:00",fr:"Allumage 30 minutes avant le coucher, jusqu'à 23h",de:"Einschalten 30 Min. vor Sonnenuntergang, bis 23 Uhr"},"recipe.lights_at_sunset.howto":{it:"Una fascia ancorata al tramonto con offset -30 minuti, fine fissa alle 23:00. Luce all'80% di luminosità. La fascia si sposta da sola di stagione in stagione (in inverno parte alle 16:30, in estate alle 20:00).",en:"One block anchored to sunset with -30 minute offset, fixed end at 23:00. Light at 80% brightness. The block shifts seasonally on its own (16:30 in winter, 20:00 in summer).",fr:"Un créneau ancré au coucher du soleil avec un décalage de -30 minutes, fin fixe à 23h. Lumière à 80% de luminosité. Le créneau se décale automatiquement selon la saison.",de:"Ein Block, am Sonnenuntergang verankert mit -30 Min. Versatz, festes Ende um 23 Uhr. Licht bei 80% Helligkeit. Der Block verschiebt sich automatisch je nach Jahreszeit."},"recipe.lights_at_sunset.preset_name":{it:"Luci serali",en:"Evening lights",fr:"Lumières du soir",de:"Abendliche Beleuchtung"},"recipe.blinds_wind_safety.title":{it:"Tapparelle automatiche col vento",en:"Wind-safe automatic blinds",fr:"Volets sécurité vent",de:"Windschutz für Rollladen"},"recipe.blinds_wind_safety.when":{it:"Tapparelle aperte di giorno, chiudono se il vento supera 30 km/h",en:"Blinds open during daytime, close if wind exceeds 30 km/h",fr:"Volets ouverts le jour, fermés si le vent dépasse 30 km/h",de:"Rollladen tagsüber offen, schließen bei Wind über 30 km/h"},"recipe.blinds_wind_safety.howto":{it:"Una fascia da alba a tramonto, posizione 100% (aperta). Regola meteo trigger: se vento > 30 km/h forza la chiusura, una sola volta tra alba e tramonto. Senza il rate-limit le tapparelle sbatterebbero ad ogni raffica.",en:"One block from sunrise to sunset, position 100% (open). Trigger weather rule: if wind > 30 km/h force close, at most once between sunrise and sunset. Without rate-limiting the blinds would flap on every gust.",fr:"Un créneau du lever au coucher du soleil, position 100% (ouvert). Règle déclencheur météo : si vent > 30 km/h forcer la fermeture, au plus une fois entre lever et coucher. Sans limitation, les volets battraient à chaque rafale.",de:"Ein Block von Sonnenauf- bis -untergang, Position 100% (offen). Wetter-Trigger: bei Wind > 30 km/h Schließen erzwingen, höchstens einmal zwischen Auf- und Untergang. Ohne Rate-Limiting würden die Rollladen bei jeder Böe schlagen."},"recipe.blinds_wind_safety.preset_name":{it:"Tapparelle giorno",en:"Daytime blinds",fr:"Volets jour",de:"Tagesrollladen"},"recipe.irrigation_skip_rain.title":{it:"Irrigazione mattutina con skip pioggia",en:"Morning irrigation with rain skip",fr:"Irrigation matinale avec saut pluie",de:"Morgendliche Bewässerung mit Regen-Skip"},"recipe.irrigation_skip_rain.when":{it:"30 minuti di irrigazione alle 6, saltati se la previsione indica pioggia",en:"30 minutes of irrigation at 06:00, skipped if forecast says rain",fr:"30 min d'irrigation à 6h, ignoré si pluie prévue",de:"30 Min. Bewässerung um 6 Uhr, übersprungen bei Regenvorhersage"},"recipe.irrigation_skip_rain.howto":{it:"Una fascia 06:00 → 06:30 con turn_on durata 30 minuti. Regola meteo: se la pioggia prevista nelle prossime 6 ore supera 2 mm la fascia viene saltata. Risparmia acqua nei giorni di pioggia.",en:"One block 06:00 → 06:30 with turn_on duration 30 min. Weather rule: if forecast rain in the next 6 hours exceeds 2 mm the block is skipped. Saves water on rainy days.",fr:"Un créneau 06h00 → 06h30, turn_on durée 30 min. Règle météo : si la pluie prévue dans les 6 prochaines heures dépasse 2 mm, le créneau est ignoré. Économise l'eau les jours de pluie.",de:"Ein Block 06:00 → 06:30, turn_on Dauer 30 Min. Wetterregel: bei Regenvorhersage > 2 mm in den nächsten 6 Std. wird der Block übersprungen. Spart Wasser an Regentagen."},"recipe.irrigation_skip_rain.preset_name":{it:"Irrigazione giardino",en:"Garden irrigation",fr:"Irrigation jardin",de:"Gartenbewässerung"},"recipe.boiler_eco_night.title":{it:"Boiler ECO notturno",en:"Night-ECO water heater",fr:"Chauffe-eau ECO nuit",de:"Nacht-ECO-Boiler"},"recipe.boiler_eco_night.when":{it:"Modalità electric durante il giorno, eco di notte per risparmiare",en:"Electric during the day, eco at night to save energy",fr:"Mode electric le jour, eco la nuit pour économiser",de:"Tagsüber electric, nachts eco zum Energie sparen"},"recipe.boiler_eco_night.howto":{it:"Tre fasce: 00-06 ECO, 06-23 electric, 23-24 ECO. Riduce i consumi nelle ore di non utilizzo. Aggiungi una regola meteo per saltare la fascia electric se la temperatura esterna è già alta.",en:"Three blocks: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduces consumption during unused hours. Add a weather rule to skip the electric block when outside temperature is already high.",fr:"Trois créneaux : 00-06 ECO, 06-23 electric, 23-24 ECO. Réduit la consommation aux heures non utilisées. Ajoute une règle météo pour ignorer le créneau electric si la température extérieure est élevée.",de:"Drei Blöcke: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduziert Verbrauch in ungenutzten Zeiten. Füge eine Wetterregel hinzu, um den electric-Block bei hoher Außentemperatur zu überspringen."},"recipe.boiler_eco_night.preset_name":{it:"Boiler casa",en:"Home water heater",fr:"Chauffe-eau maison",de:"Haus-Boiler"},"recipe.scene_routine.title":{it:"Routine giornaliera con scene",en:"Daily routine with scenes",fr:"Routine quotidienne avec scènes",de:"Tagesablauf mit Szenen"},"recipe.scene_routine.when":{it:"Tre fasce: mattina, sera, notte. Ogni fascia attiva una o più scene di Home Assistant.",en:"Three blocks: morning, evening, night. Each block activates one or more HA scenes.",fr:"Trois créneaux : matin, soir, nuit. Chacun déclenche une ou plusieurs scènes HA.",de:"Drei Blöcke: Morgen, Abend, Nacht. Jeder Block aktiviert eine oder mehrere HA-Szenen."},"recipe.scene_routine.howto":{it:"Dopo averla creata, apri ogni fascia e seleziona le scene da attivare nel selettore multi-scena del pannello di destra. Puoi attivarne più di una per fascia (es. ‘luci salotto’ + ‘musica relax’).",en:"After creating it, open each block and pick the scenes to fire from the multi-select picker in the right panel. You can fire multiple scenes per block (e.g. ‘living room lights’ + ‘relax music’).",fr:"Après création, ouvre chaque créneau et choisis les scènes dans le sélecteur multi-scènes à droite. Tu peux en déclencher plusieurs par créneau (ex. ‘lumières salon’ + ‘musique relax’).",de:"Nach Anlage öffne jeden Block und wähle die Szenen im Multi-Select rechts aus. Mehrere Szenen pro Block möglich (z. B. ‚Wohnzimmerlicht‘ + ‚Entspannungsmusik‘)."},"recipe.scene_routine.preset_name":{it:"Routine scene casa",en:"Home scene routine",fr:"Routine scènes maison",de:"Heim-Szenenroutine"},"recipe.alarm_arm_night.title":{it:"Allarme: arma di notte, disinserisci di giorno",en:"Alarm: arm at night, disarm by day",fr:"Alarme : armer la nuit, désarmer le jour",de:"Alarm: nachts scharf, tagsüber unscharf"},"recipe.alarm_arm_night.when":{it:"Inserimento automatico in modalità notte fra le 23:00 e le 07:00, disinserito durante il giorno.",en:"Auto-arms in night mode between 23:00 and 07:00, disarmed during the day.",fr:"Mode nuit automatique entre 23h00 et 07h00, désarmé le jour.",de:"Automatisch nachts (23:00-07:00) im Nachtmodus, tagsüber unscharf."},"recipe.alarm_arm_night.howto":{it:"Dopo averla creata, scegli il pannello d'allarme (alarm_control_panel) di Home Assistant nel selettore dispositivi della schedulazione. Modifica gli orari se necessario.",en:"After creating it, pick your HA alarm_control_panel entity in the schedule's device selector. Adjust the time blocks if needed.",fr:"Après création, sélectionne ton entité alarm_control_panel HA dans le sélecteur d'appareils. Ajuste les horaires si besoin.",de:"Nach Anlage wähle deine HA-alarm_control_panel-Entität im Geräte-Selektor. Bei Bedarf Zeitblöcke anpassen."},"recipe.alarm_arm_night.preset_name":{it:"Allarme casa",en:"Home alarm",fr:"Alarme maison",de:"Hausalarm"},"recipe.boiler_offgrid_soc.title":{it:"Boiler off-grid: scalda solo se SOC alto",en:"Off-grid water heater: heat only when SOC is high",fr:"Chauffe-eau off-grid : chauffe seulement si SOC élevé",de:"Off-grid-Boiler: nur bei hohem SOC heizen"},"recipe.boiler_offgrid_soc.when":{it:"Mantiene una temperatura minima di 35°C e fa il boost a 60°C quando la batteria off-grid è quasi piena E mancano almeno 2h al tramonto.",en:"Holds a 35°C minimum and boosts to 60°C when the off-grid battery is near full AND there are at least 2h to sunset.",fr:"Maintient 35°C min, monte à 60°C quand la batterie off-grid est quasi pleine ET qu'il reste 2h avant le coucher.",de:"Hält 35°C Minimum und steigert auf 60°C, wenn die Off-grid-Batterie fast voll ist UND mind. 2h bis zum Sonnenuntergang."},"recipe.boiler_offgrid_soc.howto":{it:"Dopo averla creata, apri la regola meteo e sostituisci sensor.battery_soc con il sensor del SOC della tua batteria. Il resto della condizione (sun.minutes_until_sunset > 120) funziona ovunque tu sia.",en:"After creating it, open the weather rule and replace sensor.battery_soc with your actual battery SOC sensor. The rest of the expression (sun.minutes_until_sunset > 120) works as-is anywhere.",fr:"Après création, ouvre la règle météo et remplace sensor.battery_soc par ton capteur SOC réel. Le reste (sun.minutes_until_sunset > 120) fonctionne tel quel partout.",de:"Nach Anlage öffne die Wetterregel und ersetze sensor.battery_soc durch deinen echten Batterie-SOC-Sensor. Der Rest (sun.minutes_until_sunset > 120) funktioniert überall unverändert."},"recipe.boiler_offgrid_soc.preset_name":{it:"Boiler off-grid",en:"Off-grid water heater",fr:"Chauffe-eau off-grid",de:"Off-grid-Boiler"},"recipe.fan_heat_scale.title":{it:"Ventilatore proporzionale al caldo",en:"Fan speed scales with heat",fr:"Ventilateur proportionnel à la chaleur",de:"Ventilator skaliert mit der Hitze"},"recipe.fan_heat_scale.when":{it:"Ventilatore acceso 12-20, velocità che sale da 30% a 100% man mano che la temperatura passa da 24°C a 34°C.",en:"Fan on 12:00-20:00, speed rising from 30% to 100% as temperature goes from 24°C to 34°C.",fr:"Ventilateur 12h-20h, vitesse de 30% à 100% quand la température passe de 24°C à 34°C.",de:"Ventilator 12-20 Uhr, Drehzahl steigt von 30% auf 100%, wenn die Temperatur von 24°C auf 34°C klettert."},"recipe.fan_heat_scale.howto":{it:"Mostra l'effetto scale_value: il valore dell'azione viene ricalcolato di continuo interpolando la temperatura sull'intervallo configurato. Adatta i due intervalli (temperatura e velocità) al tuo clima.",en:"Showcases the scale_value effect: the action value is continuously recomputed by interpolating temperature over the configured range. Adjust both ranges (temperature and speed) to your climate.",fr:"Illustre l'effet scale_value : la valeur de l'action est recalculée en continu en interpolant la température sur la plage configurée. Adapte les deux plages (température et vitesse) à ton climat.",de:"Zeigt den scale_value-Effekt: Der Aktionswert wird laufend per Interpolation der Temperatur über den konfigurierten Bereich neu berechnet. Beide Bereiche (Temperatur und Drehzahl) ans Klima anpassen."},"recipe.fan_heat_scale.preset_name":{it:"Ventilatore anti-afa",en:"Heat-scaled fan",fr:"Ventilateur anti-canicule",de:"Hitze-Ventilator"},"recipe.blinds_summer_shade.title":{it:"Tapparelle anti-calore estive",en:"Summer heat-shading blinds",fr:"Volets anti-chaleur d'été",de:"Sommer-Hitzeschutz für Rollläden"},"recipe.blinds_summer_shade.when":{it:"Aperte dall'alba al tramonto, ma scendono al 25% quando il sole è alto E fa più di 28°C. Attiva solo dall'1 giugno al 15 settembre.",en:"Open sunrise to sunset, but drop to 25% when the sun is high AND it is above 28°C. Active June 1 to September 15 only.",fr:"Ouverts du lever au coucher, mais descendent à 25% quand le soleil est haut ET qu'il fait plus de 28°C. Actif du 1er juin au 15 septembre.",de:"Offen von Sonnenauf- bis -untergang, fahren aber auf 25%, wenn die Sonne hoch steht UND es über 28°C hat. Nur vom 1. Juni bis 15. September aktiv."},"recipe.blinds_summer_shade.howto":{it:"Combina una condizione multipla (sun.elevation > 40 AND temperature > 28), un force_action con valore e l'intervallo date ricorrente. La regola scatta al massimo una volta al giorno.",en:"Combines a compound condition (sun.elevation > 40 AND temperature > 28), a force_action with value and the recurring date range. The rule fires at most once per day.",fr:"Combine une condition multiple (sun.elevation > 40 AND temperature > 28), un force_action avec valeur et la plage de dates récurrente. La règle se déclenche au plus une fois par jour.",de:"Kombiniert eine Mehrfach-Bedingung (sun.elevation > 40 AND temperature > 28), ein force_action mit Wert und den wiederkehrenden Datumsbereich. Die Regel feuert höchstens einmal pro Tag."},"recipe.blinds_summer_shade.preset_name":{it:"Ombra estiva",en:"Summer shade",fr:"Ombre d'été",de:"Sommerschatten"},"recipe.pv_surplus_plug.title":{it:"Carico differito su surplus solare",en:"Deferred load on solar surplus",fr:"Charge différée sur surplus solaire",de:"Verschobene Last bei Solarüberschuss"},"recipe.pv_surplus_plug.when":{it:"Una presa (lavatrice, scaldacqua, caricabatterie) si accende 11-14, ma solo se l'irradianza supera 500 W/m². Nei giorni coperti la fascia viene saltata.",en:"A plug (washing machine, water heater, charger) turns on 11:00-14:00, but only if solar irradiance exceeds 500 W/m². On overcast days the block is skipped.",fr:"Une prise (lave-linge, chauffe-eau, chargeur) s'allume 11h-14h, mais seulement si l'irradiance dépasse 500 W/m². Les jours couverts, le créneau est sauté.",de:"Eine Steckdose (Waschmaschine, Boiler, Ladegerät) schaltet 11-14 Uhr ein, aber nur wenn die Einstrahlung 500 W/m² übersteigt. An trüben Tagen wird der Block übersprungen."},"recipe.pv_surplus_plug.howto":{it:"L'attributo solar_radiation richiede una stazione meteo o un override sensore (Impostazioni → Sorgente meteo). In alternativa cambia la condizione su un sensor.* di potenza FV.",en:"The solar_radiation attribute needs a weather station or a sensor override (Settings → Weather source). Alternatively, point the condition at a PV power sensor.* entity.",fr:"L'attribut solar_radiation demande une station météo ou un override capteur (Réglages → Source météo). Sinon, pointe la condition vers un sensor.* de puissance PV.",de:"Das Attribut solar_radiation braucht eine Wetterstation oder einen Sensor-Override (Einstellungen → Wetterquelle). Alternativ die Bedingung auf einen PV-Leistungs-sensor.* richten."},"recipe.pv_surplus_plug.preset_name":{it:"Carico su surplus FV",en:"PV surplus load",fr:"Charge surplus PV",de:"PV-Überschusslast"},"recipe.vacuum_weekday_morning.title":{it:"Robot aspirapolvere nei feriali",en:"Weekday robot vacuum",fr:"Robot aspirateur en semaine",de:"Saugroboter an Werktagen"},"recipe.vacuum_weekday_morning.when":{it:"Pulizia alle 10:00 dal lunedì al venerdì, quando la casa è vuota. Nessuna regola meteo: solo maschera giorni.",en:"Cleaning at 10:00 Monday to Friday, while the house is empty. No weather rules: just the day mask.",fr:"Nettoyage à 10h du lundi au vendredi, quand la maison est vide. Pas de règle météo : juste le masque des jours.",de:"Reinigung um 10:00 Montag bis Freitag, wenn das Haus leer ist. Keine Wetterregeln: nur die Tagesmaske."},"recipe.vacuum_weekday_morning.howto":{it:"Il robot torna in base da solo a fine ciclo. Se vuoi saltare la pulizia quando sei a casa, aggiungi una regola skip su un input_boolean o un sensore di presenza.",en:"The robot docks itself when done. To skip cleaning when you are home, add a skip rule on an input_boolean or a presence sensor.",fr:"Le robot retourne seul à sa base. Pour sauter le nettoyage quand tu es chez toi, ajoute une règle skip sur un input_boolean ou un capteur de présence.",de:"Der Roboter dockt nach dem Zyklus selbst an. Um die Reinigung bei Anwesenheit zu überspringen, eine Skip-Regel auf ein input_boolean oder einen Präsenzsensor legen."},"recipe.vacuum_weekday_morning.preset_name":{it:"Pulizia feriale",en:"Weekday cleaning",fr:"Nettoyage en semaine",de:"Werktagsreinigung"},"recipe.pool_pump_season.title":{it:"Pompa piscina stagionale",en:"Seasonal pool pump",fr:"Pompe de piscine saisonnière",de:"Saisonale Poolpumpe"},"recipe.pool_pump_season.when":{it:"Filtraggio dalle 8, con durata che cresce da 4 a 7 ore man mano che fa più caldo (24-34°C). Attiva solo da giugno a metà settembre.",en:"Filtering from 08:00, with runtime growing from 4 to 7 hours as it gets hotter (24-34°C). Active June to mid-September only.",fr:"Filtration dès 8h, durée de 4 à 7 heures selon la chaleur (24-34°C). Actif de juin à mi-septembre.",de:"Filterung ab 8 Uhr, Laufzeit wächst mit der Hitze von 4 auf 7 Stunden (24-34°C). Nur von Juni bis Mitte September aktiv."},"recipe.pool_pump_season.howto":{it:"Mostra scale_duration su una presa: la fascia ON si allunga in avanti dentro la fascia OFF successiva. I blocchi OFF espliciti garantiscono lo spegnimento a fine filtraggio.",en:"Showcases scale_duration on a plug: the ON block grows forward into the following OFF block. The explicit OFF blocks guarantee the pump stops when filtering ends.",fr:"Illustre scale_duration sur une prise : le créneau ON s'étend dans le créneau OFF suivant. Les blocs OFF explicites garantissent l'arrêt de la pompe en fin de filtration.",de:"Zeigt scale_duration an einer Steckdose: Der ON-Block wächst vorwärts in den folgenden OFF-Block. Die expliziten OFF-Blöcke garantieren das Abschalten am Ende."},"recipe.pool_pump_season.preset_name":{it:"Pompa piscina",en:"Pool pump",fr:"Pompe piscine",de:"Poolpumpe"},"help.glossary.title":{it:"Glossario",en:"Glossary",fr:"Glossaire",de:"Glossar"},"help.glossary.block.title":{it:"Fascia oraria (block)",en:"Time block",fr:"Créneau horaire",de:"Zeitblock"},"help.glossary.block.body":{it:"Intervallo orario quotidiano (start–end) con un'azione associata. Il sistema esegue l'azione quando il tempo corrente entra nell'intervallo.",en:"A daily time interval (start–end) with an attached action. The system runs the action when the current time enters the interval.",fr:"Intervalle horaire quotidien (start–end) avec une action associée. Le système exécute l'action quand l'heure actuelle entre dans l'intervalle.",de:"Tägliches Zeitintervall (start–end) mit einer zugewiesenen Aktion. Das System führt die Aktion aus, wenn die aktuelle Zeit das Intervall erreicht."},"help.glossary.anchor.title":{it:"Ancora alba/tramonto",en:"Sunrise/sunset anchor",fr:"Ancre lever/coucher",de:"Sonnen-Anker"},"help.glossary.anchor.body":{it:"Invece di un orario fisso, una fascia può iniziare/finire ad alba o tramonto, con un offset in minuti. Si adatta automaticamente alle stagioni.",en:"Instead of a fixed clock time, a block can start/end at sunrise or sunset with a minute offset. Adapts automatically to seasons.",fr:"Au lieu d'une heure fixe, un créneau peut commencer/finir au lever ou coucher du soleil avec un décalage en minutes. S'adapte automatiquement aux saisons.",de:"Anstelle einer festen Uhrzeit kann ein Block bei Sonnenauf- oder -untergang mit Minuten-Versatz beginnen/enden. Passt sich automatisch an die Jahreszeiten an."},"help.glossary.rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"help.glossary.rule.body":{it:"Condizione IF/THEN che modifica l'esecuzione di un blocco o agisce come trigger autonomo. Può saltare la fascia, traslarne l'orario, cambiare durata o forzare un'azione diversa.",en:"An IF/THEN condition that modifies a block's execution or acts as a standalone trigger. Can skip, shift, change duration, or force a different action.",fr:"Condition SI/ALORS qui modifie l'exécution d'un créneau ou agit comme déclencheur autonome. Peut ignorer, décaler, changer la durée ou forcer une action différente.",de:"WENN/DANN-Bedingung, die die Block-Ausführung modifiziert oder als eigenständiger Trigger dient. Kann überspringen, verschieben, Dauer ändern oder andere Aktion erzwingen."},"help.glossary.fire_mode.title":{it:"Frequenza di attivazione (fire mode)",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"help.glossary.fire_mode.body":{it:"Per regole trigger: ogni transizione, una volta al giorno, una tra alba/tramonto, o una tra tramonto/alba. Evita che oscillazioni della grandezza monitorata facciano sbattere il dispositivo.",en:"For trigger rules: every transition, once per day, once between sunrise/sunset, or once between sunset/sunrise. Prevents oscillations of the monitored value from making the device flap.",fr:"Pour les règles déclencheur : chaque transition, une fois par jour, une fois entre lever/coucher, ou une fois entre coucher/lever. Empêche les oscillations de la valeur surveillée de faire battre l'appareil.",de:"Für Trigger-Regeln: jede Transition, einmal pro Tag, einmal zwischen Auf-/Untergang oder einmal zwischen Unter-/Aufgang. Verhindert, dass Schwankungen des überwachten Wertes das Gerät zappeln lassen."},"help.glossary.override.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibungen"},"help.glossary.override.body":{it:"Per ogni attributo meteo (temperatura, umidità, vento, …) puoi puntare a una sensor.* specifica. Utile se hai una stazione meteo locale (Ecowitt, WeatherFlow) più affidabile del provider cloud.",en:"For each weather attribute (temperature, humidity, wind, …) you can point at a specific sensor.* entity. Useful if you have a local weather station (Ecowitt, WeatherFlow) more reliable than the cloud provider.",fr:"Pour chaque attribut météo (température, humidité, vent, …) tu peux pointer vers une entité sensor.* spécifique. Utile si tu as une station météo locale plus fiable.",de:"Für jedes Wetter-Attribut (Temperatur, Feuchte, Wind, …) kannst du auf eine spezifische sensor.*-Entität verweisen. Nützlich bei einer lokalen Wetterstation, zuverlässiger als Cloud-Anbieter."},"weather.attr.temperature":{it:"Temperatura attuale",en:"Current temperature",fr:"Température actuelle",de:"Aktuelle Temperatur"},"weather.attr.feels_like":{it:"Temperatura percepita",en:"Apparent temperature",fr:"Température ressentie",de:"Gefühlte Temperatur"},"weather.attr.humidity":{it:"Umidità",en:"Humidity",fr:"Humidité",de:"Luftfeuchtigkeit"},"weather.attr.dew_point":{it:"Punto di rugiada",en:"Dew point",fr:"Point de rosée",de:"Taupunkt"},"weather.attr.wind_speed":{it:"Velocità vento",en:"Wind speed",fr:"Vitesse du vent",de:"Windgeschwindigkeit"},"weather.attr.wind_gust":{it:"Raffica vento",en:"Wind gust",fr:"Rafale de vent",de:"Windböe"},"weather.attr.wind_bearing":{it:"Direzione vento",en:"Wind bearing",fr:"Direction du vent",de:"Windrichtung"},"weather.attr.pressure":{it:"Pressione atmosferica",en:"Atmospheric pressure",fr:"Pression atmosphérique",de:"Luftdruck"},"weather.attr.uv_index":{it:"Indice UV",en:"UV index",fr:"Indice UV",de:"UV-Index"},"weather.attr.solar_radiation":{it:"Irradianza solare",en:"Solar irradiance",fr:"Irradiance solaire",de:"Sonneneinstrahlung"},"weather.attr.rain_rate":{it:"Pioggia istantanea",en:"Instantaneous rain rate",fr:"Pluie instantanée",de:"Aktuelle Regenrate"},"weather.attr.rain_state":{it:"Stato pioggia (sta piovendo)",en:"Rain state (is raining)",fr:"État de pluie (il pleut)",de:"Regenzustand (regnet es)"},"weather.attr.sun.elevation":{it:"Elevazione sole",en:"Sun elevation",fr:"Élévation du soleil",de:"Sonnenstand"},"weather.attr.sun.minutes_until_sunrise":{it:"Minuti all'alba",en:"Minutes until sunrise",fr:"Minutes jusqu'au lever du soleil",de:"Minuten bis Sonnenaufgang"},"weather.attr.sun.minutes_until_sunset":{it:"Minuti al tramonto",en:"Minutes until sunset",fr:"Minutes jusqu'au coucher du soleil",de:"Minuten bis Sonnenuntergang"},"weather.attr.sun.state":{it:"Sole sopra orizzonte",en:"Sun above horizon",fr:"Soleil au-dessus de l'horizon",de:"Sonne über dem Horizont"},"weather.attr.condition":{it:"Condizione attuale",en:"Current condition",fr:"Condition actuelle",de:"Aktuelle Bedingung"},"weather.attr.forecast.temp_max_today":{it:"Temp. max oggi (forecast)",en:"Today max temp (forecast)",fr:"Temp. max aujourd'hui (prévision)",de:"Heute Höchsttemperatur (Vorhersage)"},"weather.attr.forecast.temp_min_today":{it:"Temp. min oggi (forecast)",en:"Today min temp (forecast)",fr:"Temp. min aujourd'hui (prévision)",de:"Heute Tiefsttemperatur (Vorhersage)"},"weather.attr.forecast.rain_6h":{it:"Pioggia prossime 6h",en:"Rain next 6h",fr:"Pluie 6 prochaines h",de:"Regen nächste 6 h"},"weather.attr.forecast.condition_6h":{it:"Condizione +6h",en:"Condition +6h",fr:"Condition +6 h",de:"Bedingung +6 h"},"device_type.thermostat":{it:"Termostato",en:"Thermostat",fr:"Thermostat",de:"Thermostat"},"device_type.boiler":{it:"Boiler",en:"Water heater",fr:"Chauffe-eau",de:"Boiler"},"device_type.light":{it:"Luce",en:"Light",fr:"Lumière",de:"Licht"},"device_type.blind":{it:"Tapparella",en:"Blind",fr:"Volet",de:"Rollladen"},"device_type.irrigation":{it:"Irrigazione",en:"Irrigation",fr:"Irrigation",de:"Bewässerung"},"device_type.plug":{it:"Presa smart",en:"Smart plug",fr:"Prise connectée",de:"Smart-Steckdose"},"device_type.fan":{it:"Ventilatore",en:"Fan",fr:"Ventilateur",de:"Ventilator"},"device_type.mower":{it:"Tosaerba",en:"Lawn mower",fr:"Tondeuse",de:"Rasenmäher"},"device_type.vacuum":{it:"Robot aspirapolvere",en:"Vacuum",fr:"Aspirateur robot",de:"Saugroboter"},"device_type.scene":{it:"Scena",en:"Scene",fr:"Scène",de:"Szene"},"device_type.automation":{it:"Automazione",en:"Automation",fr:"Automatisation",de:"Automation"},"device_type.alarm":{it:"Allarme",en:"Alarm",fr:"Alarme",de:"Alarm"},"action.thermostat.set_temperature":{it:"Imposta temperatura",en:"Set temperature",fr:"Définir la température",de:"Temperatur einstellen"},"action.thermostat.set_preset":{it:"Preset",en:"Preset",fr:"Préréglage",de:"Voreinstellung"},"action.thermostat.set_hvac_mode":{it:"Modalità HVAC",en:"HVAC mode",fr:"Mode CVC",de:"HVAC-Modus"},"action.thermostat.set_hvac_mode.value":{it:"Modalità",en:"Mode",fr:"Mode",de:"Modus"},"action.thermostat.turn_on":{it:"Accendi",en:"Turn on",fr:"Allumer",de:"Einschalten"},"action.thermostat.turn_off":{it:"Spegni",en:"Turn off",fr:"Éteindre",de:"Ausschalten"},"action.thermostat.auto_off":{it:"Spegnimento automatico",en:"Auto-off",fr:"Arrêt automatique",de:"Auto-Abschaltung"},"action.light.auto_off":{it:"Spegnimento automatico",en:"Auto-off",fr:"Arrêt automatique",de:"Auto-Abschaltung"},"action.plug.auto_off":{it:"Spegnimento automatico",en:"Auto-off",fr:"Arrêt automatique",de:"Auto-Abschaltung"},"action.fan.auto_off":{it:"Spegnimento automatico",en:"Auto-off",fr:"Arrêt automatique",de:"Auto-Abschaltung"},"action.boiler.set_temperature":{it:"Imposta temperatura",en:"Set temperature",fr:"Définir la température",de:"Temperatur einstellen"},"action.boiler.set_operation":{it:"Modalità operativa",en:"Operation mode",fr:"Mode opératoire",de:"Betriebsmodus"},"action.boiler.turn_off":{it:"Spegni",en:"Turn off",fr:"Éteindre",de:"Ausschalten"},"action.light.turn_on":{it:"Accendi",en:"Turn on",fr:"Allumer",de:"Einschalten"},"action.light.turn_off":{it:"Spegni",en:"Turn off",fr:"Éteindre",de:"Ausschalten"},"action.scene.activate":{it:"Attiva scena",en:"Activate scene",fr:"Activer la scène",de:"Szene aktivieren"},"action.automation.turn_on":{it:"Attiva automazione",en:"Enable automation",fr:"Activer l'automatisation",de:"Automation aktivieren"},"action.automation.turn_off":{it:"Disattiva automazione",en:"Disable automation",fr:"Désactiver l'automatisation",de:"Automation deaktivieren"},"action.automation.trigger":{it:"Trigger automazione",en:"Trigger automation",fr:"Déclencher l'automatisation",de:"Automation auslösen"},"action.blind.set_position":{it:"Posiziona",en:"Set position",fr:"Positionner",de:"Position einstellen"},"action.blind.open_cover":{it:"Apri",en:"Open",fr:"Ouvrir",de:"Öffnen"},"action.blind.close_cover":{it:"Chiudi",en:"Close",fr:"Fermer",de:"Schließen"},"action.irrigation.turn_on":{it:"Avvia",en:"Start",fr:"Démarrer",de:"Starten"},"action.irrigation.turn_off":{it:"Stop",en:"Stop",fr:"Arrêter",de:"Stoppen"},"action.plug.turn_on":{it:"Accendi",en:"Turn on",fr:"Allumer",de:"Einschalten"},"action.plug.turn_off":{it:"Spegni",en:"Turn off",fr:"Éteindre",de:"Ausschalten"},"action.fan.turn_on":{it:"Accendi",en:"Turn on",fr:"Allumer",de:"Einschalten"},"action.fan.turn_off":{it:"Spegni",en:"Turn off",fr:"Éteindre",de:"Ausschalten"},"action.mower.start_mowing":{it:"Avvia taglio",en:"Start mowing",fr:"Démarrer la tonte",de:"Mähen starten"},"action.mower.pause":{it:"Pausa",en:"Pause",fr:"Pause",de:"Pause"},"action.mower.dock":{it:"Torna in base",en:"Return to dock",fr:"Retour à la station",de:"Zur Station"},"action.vacuum.start":{it:"Avvia pulizia",en:"Start cleaning",fr:"Démarrer le nettoyage",de:"Reinigung starten"},"action.vacuum.pause":{it:"Pausa",en:"Pause",fr:"Pause",de:"Pause"},"action.vacuum.return_to_base":{it:"Torna in base",en:"Return to base",fr:"Retour à la base",de:"Zur Basis"},"action.alarm.arm_home":{it:"Inserisci (home)",en:"Arm (home)",fr:"Armer (maison)",de:"Scharf (zu Hause)"},"action.alarm.arm_away":{it:"Inserisci (away)",en:"Arm (away)",fr:"Armer (absent)",de:"Scharf (abwesend)"},"action.alarm.arm_night":{it:"Inserisci (notte)",en:"Arm (night)",fr:"Armer (nuit)",de:"Scharf (Nacht)"},"action.alarm.arm_vacation":{it:"Inserisci (vacanza)",en:"Arm (vacation)",fr:"Armer (vacances)",de:"Scharf (Urlaub)"},"action.alarm.disarm":{it:"Disinserisci",en:"Disarm",fr:"Désarmer",de:"Unscharf"},"action.alarm.trigger":{it:"Attiva sirena",en:"Trigger alarm",fr:"Déclencher l'alarme",de:"Alarm auslösen"},"action.light.turn_on.value":{it:"Luminosità",en:"Brightness",fr:"Luminosité",de:"Helligkeit"},"action.blind.set_position.value":{it:"Apertura",en:"Open",fr:"Ouverture",de:"Öffnung"},"action.irrigation.turn_on.value":{it:"Durata",en:"Duration",fr:"Durée",de:"Dauer"},"action.fan.turn_on.value":{it:"Velocità",en:"Speed",fr:"Vitesse",de:"Geschwindigkeit"},"action.scene.activate.value":{it:"Scena",en:"Scene",fr:"Scène",de:"Szene"},"action.automation.turn_on.value":{it:"Automazione",en:"Automation",fr:"Automatisation",de:"Automation"},"action.automation.turn_off.value":{it:"Automazione",en:"Automation",fr:"Automatisation",de:"Automation"},"action.automation.trigger.value":{it:"Automazione",en:"Automation",fr:"Automatisation",de:"Automation"},"action.extra.rgb_color":{it:"Colore RGB",en:"RGB color",fr:"Couleur RGB",de:"RGB-Farbe"},"action.extra.color_temp_kelvin":{it:"Temperatura colore",en:"Color temperature",fr:"Température de couleur",de:"Farbtemperatur"},"action.extra.transition":{it:"Transizione",en:"Transition",fr:"Transition",de:"Übergang"},"editor.delete.warn":{it:"Operazione non reversibile. La schedulazione, i blocchi e le regole meteo associate verranno eliminati.",en:"This cannot be undone. The schedule, its blocks and its weather rules will be deleted.",fr:"Action irréversible. La planification, ses créneaux et ses règles météo seront supprimés.",de:"Nicht umkehrbar. Der Zeitplan, seine Blöcke und Wetterregeln werden gelöscht."},"editor.delete.summary":{it:"{blocks} fasce · {devices} dispositivi · {rules} regole meteo",en:"{blocks} blocks · {devices} devices · {rules} weather rules",fr:"{blocks} créneaux · {devices} appareils · {rules} règles météo",de:"{blocks} Blöcke · {devices} Geräte · {rules} Wetterregeln"},"devices.bulk_remove.hint":{it:"Seleziona il dispositivo da scollegare. Verrà rimosso anche dalle schedulazioni che lo usano.",en:"Pick the device to unlink. It will also be removed from the schedules that use it.",fr:"Choisis l'appareil à dissocier. Il sera également retiré des planifications qui l'utilisent.",de:"Wähle das zu trennende Gerät. Es wird auch aus den Zeitplänen entfernt, die es verwenden."},"devices.refresh.title":{it:"Forza l'aggiornamento dal backend",en:"Force refresh from backend",fr:"Forcer le rafraîchissement depuis le backend",de:"Aktualisierung vom Backend erzwingen"},"wr.delta.placeholder":{it:"es. 30 / -30",en:"e.g. 30 / -30",fr:"ex. 30 / -30",de:"z.B. 30 / -30"},"device_type.input_boolean":{it:"Helper booleano",en:"Boolean helper",fr:"Aide booléenne",de:"Boolesche Hilfe"},"device_type.input_number":{it:"Helper numerico",en:"Numeric helper",fr:"Aide numérique",de:"Numerische Hilfe"},"device_type.input_select":{it:"Helper selettore",en:"Select helper",fr:"Aide de sélection",de:"Auswahlhilfe"},"device_type.service":{it:"Servizio HA",en:"HA service",fr:"Service HA",de:"HA-Dienst"},"action.input_boolean.turn_on":{it:"Attiva flag",en:"Turn flag on",fr:"Activer le drapeau",de:"Flag setzen"},"action.input_boolean.turn_off":{it:"Disattiva flag",en:"Turn flag off",fr:"Désactiver le drapeau",de:"Flag entfernen"},"action.input_boolean.toggle":{it:"Inverti flag",en:"Toggle flag",fr:"Inverser le drapeau",de:"Flag umschalten"},"action.input_number.set_value":{it:"Imposta valore",en:"Set value",fr:"Définir la valeur",de:"Wert setzen"},"action.input_number.set_value.value":{it:"Valore",en:"Value",fr:"Valeur",de:"Wert"},"action.input_select.select_option":{it:"Seleziona opzione",en:"Select option",fr:"Choisir une option",de:"Option auswählen"},"action.input_select.select_option.value":{it:"Opzione",en:"Option",fr:"Option",de:"Option"},"action.service.call_service":{it:"Chiama servizio",en:"Call service",fr:"Appeler un service",de:"Dienst aufrufen"},"action.service.call_service.value":{it:"Servizio HA",en:"HA service",fr:"Service HA",de:"HA-Dienst"},"action.extra.service_data":{it:"Dati servizio (JSON)",en:"Service data (JSON)",fr:"Données du service (JSON)",de:"Dienstdaten (JSON)"},"overview.new_service":{it:"Schedula servizi",en:"Schedule services",fr:"Planifier des services",de:"Dienste planen"},"overview.new_service.hint":{it:"Crea una schedulazione che chiama servizi HA arbitrari (mqtt.publish, backup.create, script.run, ...)",en:"Create a schedule that calls arbitrary HA services (mqtt.publish, backup.create, script.run, ...)",fr:"Crée une planification qui appelle des services HA arbitraires",de:"Plan erstellen, der beliebige HA-Dienste aufruft"},"overview.new_service_default_name":{it:"Chiamate servizio",en:"Service calls",fr:"Appels de service",de:"Dienstaufrufe"},"editor.block.extras.json.hint":{it:'JSON inline. I campi vuoti vengono ignorati. Esempio: {\\"topic\\": \\"home/cmd\\", \\"payload\\": \\"on\\"}',en:'Inline JSON. Empty fields are ignored. Example: {\\"topic\\": \\"home/cmd\\", \\"payload\\": \\"on\\"}',fr:"JSON inline. Les champs vides sont ignorés.",de:"Inline-JSON. Leere Felder werden ignoriert."},"common.refresh":{it:"Aggiorna",en:"Refresh",fr:"Actualiser",de:"Aktualisieren"},"history.title":{it:"Storico esecuzioni",en:"Execution history",fr:"Historique des exécutions",de:"Ausführungsverlauf"},"history.subtitle":{it:"Cosa ha eseguito Chronos nel periodo selezionato — utile per debug.",en:"What Chronos has executed in the selected window — useful for debugging.",fr:"Ce que Chronos a exécuté dans la période sélectionnée — utile pour le debug.",de:"Was Chronos im gewählten Zeitraum ausgeführt hat — hilft beim Debuggen."},"history.from":{it:"Da",en:"From",fr:"Du",de:"Von"},"history.to":{it:"A",en:"To",fr:"Au",de:"Bis"},"history.schedule":{it:"Schedulazione",en:"Schedule",fr:"Planification",de:"Zeitplan"},"history.all_schedules":{it:"Tutte",en:"All",fr:"Toutes",de:"Alle"},"history.kind":{it:"Tipo evento",en:"Event type",fr:"Type d'événement",de:"Ereignistyp"},"history.kind.all":{it:"Tutti",en:"All",fr:"Tous",de:"Alle"},"history.kind.block":{it:"Esecuzione fascia",en:"Block fired",fr:"Créneau exécuté",de:"Block ausgeführt"},"history.kind.rule":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"history.outcome":{it:"Esito",en:"Outcome",fr:"Résultat",de:"Ergebnis"},"history.outcome.all":{it:"Qualsiasi",en:"Any",fr:"Tous",de:"Alle"},"history.outcome.ok":{it:"OK",en:"OK",fr:"OK",de:"OK"},"history.outcome.error":{it:"Errore",en:"Error",fr:"Erreur",de:"Fehler"},"history.kpi.total":{it:"Eventi totali",en:"Total events",fr:"Événements totaux",de:"Ereignisse gesamt"},"history.kpi.in_range":{it:"nel periodo",en:"in range",fr:"dans la période",de:"im Zeitraum"},"history.kpi.ok":{it:"Andati a buon fine",en:"Successful",fr:"Réussis",de:"Erfolgreich"},"history.kpi.errors":{it:"Errori",en:"Errors",fr:"Erreurs",de:"Fehler"},"history.events":{it:"Eventi",en:"Events",fr:"Événements",de:"Ereignisse"},"history.events.sub":{it:"{n} totali — più recenti in cima",en:"{n} total — most recent first",fr:"{n} au total — plus récents en haut",de:"{n} insgesamt — neueste zuerst"},"history.empty":{it:"Nessun evento nel periodo selezionato.",en:"No events in the selected window.",fr:"Aucun événement dans la période.",de:"Keine Ereignisse im gewählten Zeitraum."},"history.truncated":{it:"Mostro i primi {n} di {total}. Affina i filtri per vedere il resto.",en:"Showing the first {n} of {total}. Refine the filters to see the rest.",fr:"Affichage des {n} premiers sur {total}. Affine les filtres pour voir le reste.",de:"Erste {n} von {total} angezeigt. Filter verfeinern, um den Rest zu sehen."},"history.chart.title":{it:"Eventi al giorno",en:"Events per day",fr:"Événements par jour",de:"Ereignisse pro Tag"},"history.chart.sub":{it:"Verde: ok · rosso: errori",en:"Green: ok · red: errors",fr:"Vert : ok · rouge : erreurs",de:"Grün: ok · rot: Fehler"},"history.clear":{it:"Cancella storico",en:"Clear history",fr:"Effacer l'historique",de:"Verlauf löschen"},"history.clear.warn":{it:"Cancella tutti gli eventi storici. Operazione non reversibile.",en:"Erases all stored history events. Cannot be undone.",fr:"Efface tout l'historique stocké. Action irréversible.",de:"Löscht den gesamten gespeicherten Verlauf. Nicht umkehrbar."},"history.copy_error":{it:"Copia il messaggio di errore",en:"Copy the error message",fr:"Copier le message d'erreur",de:"Fehlermeldung kopieren"},"history.copy_done":{it:"Copiato",en:"Copied",fr:"Copié",de:"Kopiert"},"history.copy_failed":{it:"Copia fallita",en:"Copy failed",fr:"Copie échouée",de:"Kopieren fehlgeschlagen"}};function je(e,t){const i=`weather.attr.${e}`,a=Ve(i);return a===i?t||e:a}function Ue(e,t,i){const a=`action.${e}.${t}`,s=Ve(a);return s===a?i||t:s}function Ge(e,t,i){const a=`action.${e}.${t}.value`,s=Ve(a);return s===a?i||"":s}function Je(e,t){const i=`action.extra.${e}`,a=Ve(i);return a===i?t||e:a}function Ze(e,t){const i=`device_type.${e}`,a=Ve(i);return a===i?t||e:a}const Ke={on:"var(--mode-comfort)",off:"var(--mode-off)",set:"var(--mode-eco)",preset:"var(--mode-night)",cmd:"var(--mode-boost)"};let Qe=null;function Xe(e){Qe=e;for(const t of["on","off","set","preset","cmd"])Ke[t]=e?Ie(t,e):Ke[t]}const Ye={thermostat:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"climate.set_temperature",value:{type:"number",unit:"°C",min:5,max:35,step:.5,default:21}},{id:"set_preset",label:"Preset",kind:"preset",service:"climate.set_preset_mode",value:{type:"enum",options:["none","eco","comfort","sleep","away","boost","home"],default:"comfort"}},{id:"set_hvac_mode",label:"Modalità HVAC",kind:"preset",service:"climate.set_hvac_mode",value:{type:"enum",options:["heat","cool","heat_cool","dry","fan_only","auto","off"],default:"heat"}},{id:"turn_on",label:"Accendi",kind:"on",service:"climate.turn_on"},{id:"turn_off",label:"Spegni",kind:"off",service:"climate.turn_off"}],boiler:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"water_heater.set_temperature",value:{type:"number",unit:"°C",min:30,max:75,step:1,default:55}},{id:"set_operation",label:"Operation mode",kind:"preset",service:"water_heater.set_operation_mode",value:{type:"enum",options:["off","eco","electric","gas","heat_pump","high_demand","performance"],default:"eco"}},{id:"turn_off",label:"Spegni",kind:"off",service:"water_heater.turn_off"}],light:[{id:"turn_on",label:"Accendi",kind:"on",service:"light.turn_on",value:{type:"number",unit:"%",min:1,max:100,step:1,default:80,label:"Luminosità"},extras:[{key:"rgb_color",type:"color",label:"Colore RGB"},{key:"color_temp_kelvin",type:"number",label:"Temperatura colore",unit:"K",min:2e3,max:6500,step:100},{key:"transition",type:"number",label:"Transizione",unit:"s",min:0,max:60,step:1}]},{id:"turn_off",label:"Spegni",kind:"off",service:"light.turn_off"}],scene:[{id:"activate",label:"Attiva scena",kind:"on",service:"scene.turn_on",value:{type:"entity",domain:"scene",label:"Scena",multi:!0}}],automation:[{id:"turn_on",label:"Attiva automazione",kind:"on",service:"automation.turn_on",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}},{id:"turn_off",label:"Disattiva automazione",kind:"off",service:"automation.turn_off",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}},{id:"trigger",label:"Trigger automazione",kind:"cmd",service:"automation.trigger",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}}],blind:[{id:"set_position",label:"Posiziona",kind:"set",service:"cover.set_cover_position",value:{type:"number",unit:"%",min:0,max:100,step:5,default:100,label:"Apertura"}},{id:"open_cover",label:"Apri",kind:"on",service:"cover.open_cover"},{id:"close_cover",label:"Chiudi",kind:"off",service:"cover.close_cover"}],irrigation:[{id:"turn_on",label:"Avvia",kind:"on",service:"valve.open_valve",value:{type:"number",unit:"min",min:1,max:240,step:1,default:30,label:"Durata"}},{id:"turn_off",label:"Stop",kind:"off",service:"valve.close_valve"}],plug:[{id:"turn_on",label:"Accendi",kind:"on",service:"switch.turn_on"},{id:"turn_off",label:"Spegni",kind:"off",service:"switch.turn_off"}],fan:[{id:"turn_on",label:"Accendi",kind:"on",service:"fan.turn_on",value:{type:"number",unit:"%",min:10,max:100,step:10,default:50,label:"Velocità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"fan.turn_off"}],mower:[{id:"start_mowing",label:"Avvia taglio",kind:"on",service:"lawn_mower.start_mowing"},{id:"pause",label:"Pausa",kind:"cmd",service:"lawn_mower.pause"},{id:"dock",label:"Torna in base",kind:"off",service:"lawn_mower.dock"}],vacuum:[{id:"start",label:"Avvia pulizia",kind:"on",service:"vacuum.start"},{id:"pause",label:"Pausa",kind:"cmd",service:"vacuum.pause"},{id:"return_to_base",label:"Torna in base",kind:"off",service:"vacuum.return_to_base"}],input_boolean:[{id:"turn_on",label:"Attiva flag",kind:"on",service:"input_boolean.turn_on"},{id:"turn_off",label:"Disattiva flag",kind:"off",service:"input_boolean.turn_off"},{id:"toggle",label:"Inverti flag",kind:"cmd",service:"input_boolean.toggle"}],input_number:[{id:"set_value",label:"Imposta valore",kind:"set",service:"input_number.set_value",value:{type:"number",min:-1e6,max:1e6,step:.1,default:0,label:"Valore"}}],input_select:[{id:"select_option",label:"Seleziona opzione",kind:"preset",service:"input_select.select_option",value:{type:"string",label:"Opzione"}}],service:[{id:"call_service",label:"Chiama servizio",kind:"cmd",service:"",value:{type:"string",label:"Servizio HA",placeholder:"es. mqtt.publish, backup.create, script.run"},extras:[{key:"service_data",type:"json",label:"Service data (JSON)"}]}],alarm:[{id:"arm_home",label:"Inserisci (home)",kind:"on",service:"alarm_control_panel.alarm_arm_home",extras:[{key:"code",type:"string",label:"Codice (PIN)",secret:!0}]},{id:"arm_away",label:"Inserisci (away)",kind:"on",service:"alarm_control_panel.alarm_arm_away",extras:[{key:"code",type:"string",label:"Codice (PIN)",secret:!0}]},{id:"arm_night",label:"Inserisci (notte)",kind:"on",service:"alarm_control_panel.alarm_arm_night",extras:[{key:"code",type:"string",label:"Codice (PIN)",secret:!0}]},{id:"arm_vacation",label:"Inserisci (vacanza)",kind:"on",service:"alarm_control_panel.alarm_arm_vacation",extras:[{key:"code",type:"string",label:"Codice (PIN)",secret:!0}]},{id:"disarm",label:"Disinserisci",kind:"off",service:"alarm_control_panel.alarm_disarm",extras:[{key:"code",type:"string",label:"Codice (PIN)",secret:!0}]},{id:"trigger",label:"Attiva sirena",kind:"cmd",service:"alarm_control_panel.alarm_trigger"}]};let et={};function tt(e){const t=et[e],i=Ye[e]||[];return t&&t.length?t.map(e=>{const t=i.find(t=>t.id===e.id);return t?{...t,...e,extras:e.extras||t.extras,value:e.value||t.value}:e}):i}function it(e,t){return tt(e).find(e=>e.id===t)}function at(e,t){if(!t)return"—";const i=it(e,t.id);if(!i)return t.id;const a=Ue(e,t.id,i.label);if(i.value&&void 0!==t.value&&null!==t.value&&""!==t.value){if("entity"===i.value.type){const e=Array.isArray(t.value)?t.value:[String(t.value)];return e.length?1===e.length?`${a}: ${function(e){const t=e.indexOf(".");return t>=0?e.slice(t+1):e}(e[0])}`:`${a} ×${e.length}`:a}return`${t.value}${i.value.unit||""}`}return a}function st(e,t){if(!t)return"var(--mode-off)";const i=it(e,t.id);if("thermostat"===e||"boiler"===e){if("set_preset"===t.id||"set_operation"===t.id){const e=Re(Qe),i=String(t.value??"");if(i&&e[i])return e[i]}if("set_temperature"===t.id){const i="number"==typeof t.value?t.value:parseFloat(String(t.value));if(!isNaN(i)){return function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"var(--mode-comfort)"}(i,Be(Qe,e))}}}return Ke[i?.kind||"on"]||"var(--mode-comfort)"}function rt(e){const t=tt(e)[0];return t?{id:t.id,value:t.value?t.value.default:void 0}:{id:"turn_on"}}const nt="1.20.0";async function ot(e){return e.callWS({type:"chronos/devices/list"})}async function lt(e){return e.callWS({type:"chronos/schedules/list"})}async function dt(e,t){return e.callWS({type:"chronos/schedules/save",schedule:t})}async function ct(e){return e.callWS({type:"chronos/rules/list"})}async function ut(e){return e.callWS({type:"chronos/settings/get"})}async function pt(e){return e.callWS({type:"chronos/entities/available"})}const ht=23+59/60;function vt(e){const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function mt(e,t,i){return Math.max(t,Math.min(i,e))}let ft=15;function gt(e){ft=e&&e>0?e:15}function _t(e,t){const i=60/ft;return Math.round(e*i)/i}let bt=null;function yt(e,t){const i=e[`${t}_anchor`],a=e[`${t}_offset`]??0;if("sunrise"===i||"sunset"===i){const e=bt?.states?.["sun.sun"];if(e){const t="sunrise"===i?"next_rising":"next_setting",s=e.attributes?.[t];if(s){const e=new Date(s);if(!isNaN(e.getTime())){return mt(e.getHours()+e.getMinutes()/60+e.getSeconds()/3600+a/60,0,24)}}}}const s=e[t];return"number"==typeof s?s:parseFloat(String(s??0))||0}function wt(){return[Ve("days.short.0"),Ve("days.short.1"),Ve("days.short.2"),Ve("days.short.3"),Ve("days.short.4"),Ve("days.short.5"),Ve("days.short.6")]}const xt={thermostat:{label:"Termostato",domain:"climate",capabilities:["set_temperature","hvac_mode","preset_mode"]},light:{label:"Luce",domain:"light",capabilities:["turn_on","turn_off","brightness","color_temp"]},blind:{label:"Tapparella",domain:"cover",capabilities:["open","close","set_position","stop"]},irrigation:{label:"Irrigazione",domain:"valve",capabilities:["turn_on","turn_off","duration"]},plug:{label:"Presa smart",domain:"switch",capabilities:["turn_on","turn_off"]},fan:{label:"Ventilatore",domain:"fan",capabilities:["turn_on","turn_off","speed","oscillate"]},boiler:{label:"Boiler",domain:"water_heater",capabilities:["set_temperature","operation_mode"]},mower:{label:"Tosaerba",domain:"lawn_mower",capabilities:["start_mowing","pause","dock"]},vacuum:{label:"Robot aspirapolvere",domain:"vacuum",capabilities:["start","pause","return_to_base","fan_speed"]},scene:{label:"Scena",domain:"scene",capabilities:["turn_on"]},automation:{label:"Automazione",domain:"automation",capabilities:["turn_on","turn_off","trigger"]},alarm:{label:"Allarme",domain:"alarm_control_panel",capabilities:["arm_home","arm_away","arm_night","arm_vacation","disarm","trigger"]},input_boolean:{label:"Helper booleano",domain:"input_boolean",capabilities:["turn_on","turn_off","toggle"]},input_number:{label:"Helper numerico",domain:"input_number",capabilities:["set_value"]},input_select:{label:"Helper selettore",domain:"input_select",capabilities:["select_option"]},service:{label:"Servizio HA",domain:"service",capabilities:["call_service"]}};function kt(e){if(!e||!e.length)return"";if(e.every(Boolean))return Ve("schedule.every_day");const t=wt();return e.map((e,i)=>e?t[i]:null).filter(Boolean).join(" · ")}function $t(e,t){const i=.25,a=yt(t,"start"),s=yt(t,"end"),r=[];for(const n of e){if(n===t){r.push(n);continue}const e=yt(n,"start"),o=yt(n,"end");if(o<=a||e>=s)r.push(n);else if(!(e>=a&&o<=s))if(e<a&&o>s){if(a-e>=i){const e=JSON.parse(JSON.stringify(n));e.end=a,delete e.end_anchor,delete e.end_offset,r.push(e)}if(o-s>=i){const e=JSON.parse(JSON.stringify(n));e.start=s,delete e.start_anchor,delete e.start_offset,r.push(e)}}else if(e<a){if(a-e<i)continue;const t=JSON.parse(JSON.stringify(n));t.end=a,delete t.end_anchor,delete t.end_offset,r.push(t)}else{if(o-s<i)continue;const e=JSON.parse(JSON.stringify(n));e.start=s,delete e.start_anchor,delete e.start_offset,r.push(e)}}return r}let St=class extends ce{constructor(){super(...arguments),this.variant="linear",this.deviceType="thermostat",this.blocks=[],this.selectedIdx=-1,this.now=null,this.interactive=!0,this.height="normal",this.showWeather=!0,this.forecast=[],this.previewRule=null,this._drag=null,this._boundMove=null,this._boundUp=null}render(){return"radial"===this.variant?this._renderRadial():"list"===this.variant?this._renderList():this._renderLinear()}_renderRadialGhost(e,t,i,a){const s=i+14,r=this.previewRule?U`
      <circle cx="${e}" cy="${t}" r="${s}" fill="none"
        stroke="var(--border-soft)" stroke-width="${8}"
        opacity="0.4" pointer-events="none"/>
    `:U``,n=this._computePreviewRange();if(!n)return r;if(n.endH<=n.startH)return r;const o=n.startH/24*Math.PI*2-Math.PI/2,l=n.endH/24*Math.PI*2-Math.PI/2,d=n.endH-n.startH>12?1:0,c=e+s*Math.cos(o),u=t+s*Math.sin(o),p=e+s*Math.cos(l),h=t+s*Math.sin(l),v="end"===n.anchor?o:l,m=e+s*Math.cos(v),f=t+s*Math.sin(v),g="end"===n.anchor?l:o,_=s+14,b=g+.04*("end"===n.anchor?1:-1),y=e+_*Math.cos(b),w=t+_*Math.sin(b);return U`
      ${r}
      <path d="M ${c} ${u} A ${s} ${s} 0 ${d} 1 ${p} ${h}"
        fill="none" stroke="var(--accent)" stroke-width="${8}"
        stroke-linecap="round" stroke-opacity="0.95"
        pointer-events="none"/>
      <circle cx="${m}" cy="${f}" r="5" fill="var(--accent)" stroke="white" stroke-width="2" pointer-events="none"/>
      <line x1="${e+(s+4)*Math.cos(g)}" y1="${t+(s+4)*Math.sin(g)}"
        x2="${y}" y2="${w}"
        stroke="var(--accent)" stroke-width="3" stroke-linecap="round" pointer-events="none"/>
      <circle cx="${y}" cy="${w}" r="4.5" fill="var(--accent)" pointer-events="none"/>
    `}_computePreviewRange(){const e=this.previewRule;if(!e)return null;const t=e.block_index;if(null==t||t<0||t>=this.blocks.length)return null;const i=this.blocks[t],a=yt(i,"start"),s=yt(i,"end"),r=e.direction||"forward",n=(e.delta_minutes||0)/60;if("shift"===e.effect)return{startH:a+n,endH:s+n,targetIdx:t,anchor:n>=0?"end":"start"};if("extend"===e.effect)return"forward"===r?{startH:s,endH:Math.min(24,s+n),targetIdx:t,anchor:"end"}:{startH:Math.max(0,a-n),endH:a,targetIdx:t,anchor:"start"};if("shrink"===e.effect)return"forward"===r?{startH:Math.max(a,s-n),endH:s,targetIdx:t,anchor:"end"}:{startH:a,endH:Math.min(s,a+n),targetIdx:t,anchor:"start"};if("scale_duration"===e.effect){const i=(e.scale_out_min||0)/60,n=(e.scale_out_max||60)/60;return"forward"===r?{startH:a+i,endH:Math.min(24,a+n),targetIdx:t,anchor:"end"}:{startH:Math.max(0,s-n),endH:s-i,targetIdx:t,anchor:"start"}}return null}_renderLinear(){const e=e=>e/24*100,t="compact"===this.height?"timeline timeline--compact":"mini"===this.height?"timeline timeline--mini":"timeline";return j`
      <div class="${t}" @click=${this._onTrackClick}>
        ${this.showWeather&&"mini"!==this.height?this._renderWeatherRibbon():J}
        <div class="timeline__hours">
          ${Array.from({length:24}).map(()=>j`<div></div>`)}
        </div>
        ${"normal"===this.height?j`
          <div class="timeline__labels">
            ${[0,6,12,18,24].map(t=>j`<span style="left:${e(t)}%">${String(t).padStart(2,"0")}:00</span>`)}
          </div>
        `:J}
        ${this.blocks.map((t,i)=>{const a=yt(t,"start"),s=yt(t,"end");return j`
          <div
            class="tl-block"
            data-selected="${this.selectedIdx===i}"
            style="left:${e(a)}%;width:${e(s-a)}%;background:${st(this.deviceType,t.action)}"
            @pointerdown=${e=>this._onBlockDown(e,i,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(i)}}
          >
            ${this.interactive?j`<div class="tl-block__handle tl-block__handle--l" @pointerdown=${e=>this._onBlockDown(e,i,"l")}></div>`:J}
            <span class="truncate">${at(this.deviceType,t.action)}</span>
            ${"mini"!==this.height?j`<span class="mono" style="font-size:10px;opacity:0.85">${vt(a)}</span>`:J}
            ${this.interactive?j`<div class="tl-block__handle tl-block__handle--r" @pointerdown=${e=>this._onBlockDown(e,i,"r")}></div>`:J}
          </div>
          `})}
        ${this._renderLinearGhost(e)}
        ${null!==this.now?j`<div class="tl-now" style="left:${e(this.now)}%"></div>`:J}
      </div>
    `}_renderLinearGhost(e){if(!this.previewRule)return J;const t=this._computePreviewRange();if(!t)return J;const i=e(t.startH),a=e(t.endH)-i;if(a<=0)return J;const s="var(--accent)",r="end"===t.anchor?"left":"right",n="left"===r?"right":"left",o="right"===n?"→":"←",l="left"===r?`left:${i}%`:`left:calc(${e(t.endH)}% - 4px)`,d="right"===n?`left:calc(${e(t.endH)}% + 2px)`:`right:calc(${100-e(t.startH)}% + 2px)`;return j`
      <div style="position:absolute;left:${i}%;width:${a}%;bottom:11px;height:6px;background:${s};opacity:0.85;border-radius:3px;pointer-events:none"></div>
      <div style="position:absolute;${l};bottom:8px;width:4px;height:12px;background:${s};border-radius:1px;pointer-events:none"></div>
      <div style="position:absolute;${d};bottom:8px;color:${s};font-weight:700;font-size:11px;line-height:12px;pointer-events:none">${o}</div>
    `}_renderWeatherRibbon(){if(!this.forecast.length)return J;const e=new Date,t=[];if(this.forecast.forEach((i,a)=>{const s=i?.datetime?new Date(i.datetime):null,r=null!==s&&!isNaN(s.getTime()),n=r?s.getHours():e.getHours()+a;!(r?s.toDateString()===e.toDateString():n<=23)||n>23||t.push({hour:n,cond:String(i.condition||i.state||"")})}),!t.length)return J;return j`
      <div class="tl-weather">
        ${t.map(({hour:e,cond:t})=>{const i=t.includes("rain")?"rain":t.includes("sun")?"sun":t.includes("snow")?"snow":"cloud",a=`${String(e).padStart(2,"0")}:00${t?" · "+(e=>{const t="live.condition."+e,i=Ve(t);return i===t?e:i})(t):""}`;return j`<div class="tl-weather__cell" data-state="${i}"
            style="left:${e/24*100}%;width:${100/24}%" title="${a}"></div>`})}
      </div>
    `}_renderRadial(){const e=420,t=210,i=210,a=170,s=120,r=(e,a,s,r)=>{const n=e/24*Math.PI*2-Math.PI/2,o=a/24*Math.PI*2-Math.PI/2,l=a-e>12?1:0;return`M ${t+s*Math.cos(n)} ${i+s*Math.sin(n)} A ${s} ${s} 0 ${l} 1 ${t+s*Math.cos(o)} ${i+s*Math.sin(o)} L ${t+r*Math.cos(o)} ${i+r*Math.sin(o)} A ${r} ${r} 0 ${l} 0 ${t+r*Math.cos(n)} ${i+r*Math.sin(n)} Z`},n=null!==this.now?this.now/24*Math.PI*2-Math.PI/2:null,o=(e,a,s)=>{const r=e/24*Math.PI*2-Math.PI/2,n=t+145*Math.cos(r),o=i+145*Math.sin(r);return U`
        <g style="cursor:${this.interactive?"ew-resize":"default"}" @pointerdown=${e=>this._onRadialHandleDown(e,a,s)}>
          <circle cx="${n}" cy="${o}" r="9" fill="white" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="${n}" cy="${o}" r="3" fill="var(--accent)"/>
        </g>
      `},l=this.selectedIdx>=0?this.blocks[this.selectedIdx]:null;return U`
      <svg class="radial" viewBox="0 0 ${e} ${e}" style="touch-action:none">
        <circle cx="${t}" cy="${i}" r="${145}" fill="none" stroke="var(--border-soft)" stroke-width="${50}"/>
        ${this.blocks.map((e,t)=>{const i=yt(e,"start"),n=yt(e,"end");return U`
          <path
            d="${r(i,n,a,s)}"
            fill="${st(this.deviceType,e.action)}"
            stroke="${this.selectedIdx===t?"var(--accent)":"var(--block-edge)"}"
            stroke-width="${this.selectedIdx===t?3:1.5}"
            stroke-linejoin="round"
            style="cursor:${this.interactive?"grab":"pointer"}"
            @pointerdown=${e=>this._onRadialHandleDown(e,t,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(t)}}
          />
        `})}
        ${this.blocks.map(e=>{const a=yt(e,"start"),s=yt(e,"end");if(s-a<1.5)return U``;const r=(a+s)/2/24*Math.PI*2-Math.PI/2,n=t+145*Math.cos(r),o=i+145*Math.sin(r),l=it(this.deviceType,e.action.id);let d="";if(l?.value&&void 0!==e.action.value&&null!==e.action.value&&""!==e.action.value)d=`${e.action.value}${l.value.unit||""}`;else if(l?.label){const t=Ue(this.deviceType,e.action.id,l.label);d=t.length>8?t.slice(0,7)+"…":t}return d?U`
            <text x="${n}" y="${o}" text-anchor="middle" dy="4"
              font-size="13" font-weight="700"
              style="fill:#0f172a;stroke:rgba(255,255,255,0.9);stroke-width:2.5;paint-order:stroke fill"
              pointer-events="none">${d}</text>
          `:U``})}
        ${Array.from({length:24}).map((e,a)=>{const s=a/24*Math.PI*2-Math.PI/2,r=a%6==0?156:162;return U`<line x1="${t+168*Math.cos(s)}" y1="${i+168*Math.sin(s)}" x2="${t+r*Math.cos(s)}" y2="${i+r*Math.sin(s)}" stroke="white" stroke-width="${a%6==0?2:1}" opacity="0.7" pointer-events="none"/>`})}
        ${[0,6,12,18].map(e=>{const a=e/24*Math.PI*2-Math.PI/2;return U`<text x="${t+195*Math.cos(a)}" y="${i+195*Math.sin(a)}" text-anchor="middle" dy="4" font-size="11">${String(e).padStart(2,"0")}</text>`})}
        ${this._renderRadialGhost(t,i,a,r)}
        ${this.interactive&&l?U`${o(yt(l,"start"),this.selectedIdx,"l")}${o(yt(l,"end"),this.selectedIdx,"r")}`:J}
        ${null!==n?U`
          <g pointer-events="none">
            <line x1="${t+90*Math.cos(n)}" y1="${i+90*Math.sin(n)}" x2="${t+190*Math.cos(n)}" y2="${i+190*Math.sin(n)}" stroke="var(--danger)" stroke-width="2"/>
            <circle cx="${t+190*Math.cos(n)}" cy="${i+190*Math.sin(n)}" r="5" fill="var(--danger)"/>
          </g>
        `:J}
        <text x="${t}" y="${204}" text-anchor="middle" class="radial__label" font-size="32" font-weight="700" pointer-events="none">${null!==this.now?vt(this.now):"—"}</text>
        <text x="${t}" y="${224}" text-anchor="middle" font-size="11" pointer-events="none">24h · oggi</text>
      </svg>
    `}_renderList(){const e=this._computePreviewRange();return j`
      <div class="tl-list">
        ${this.blocks.map((t,i)=>{const a=e&&e.targetIdx===i?this._listPreviewLabel(e):"";return j`
          <div
            class="tl-list__row"
            data-selected="${this.selectedIdx===i}"
            @click=${()=>this._fireSelect(i)}
          >
            <div class="tl-list__time">${vt(yt(t,"start"))} → ${vt(yt(t,"end"))}</div>
            <div class="tl-list__mode">
              <span class="tl-list__mode-dot" style="background:${st(this.deviceType,t.action)}"></span>
              <strong>${at(this.deviceType,t.action)}</strong>
            </div>
            ${a?j`
              <span class="chip" style="background:var(--accent-soft);color:var(--accent-ink);font-weight:600">
                ${a}
              </span>
            `:J}
            <span class="mono text-xs text-mute">${Math.round(60*(yt(t,"end")-yt(t,"start")))} min</span>
          </div>
          `})}
      </div>
    `}_listPreviewLabel(e){const t=this.previewRule;if(!t)return"";const i=Math.round(60*(e.endH-e.startH)),a="end"===e.anchor?"→":"←";if("shift"===t.effect)return`${a} shift ${i}m`;if("extend"===t.effect)return`${a} +${i} min`;if("shrink"===t.effect)return`${a} −${i} min`;if("scale_duration"===t.effect){return`${a} ${t.scale_out_min??0}–${t.scale_out_max??60} min`}return""}_onBlockDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const a=this.blocks[t];this._drag={idx:t,snapshot:this.blocks.map(e=>JSON.parse(JSON.stringify(e))),handle:i,startX:e.clientX,origStart:yt(a,"start"),origEnd:yt(a,"end")},this._boundMove=e=>this._onDragMove(e),this._boundUp=()=>this._onDragUp(),window.addEventListener("pointermove",this._boundMove),window.addEventListener("pointerup",this._boundUp),window.addEventListener("pointercancel",this._boundUp)}_onDragMove(e){if(!this._drag)return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),a=_t(mt((e.clientX-i.left)/i.width*24,0,24)),s=this._drag.snapshot.map(e=>JSON.parse(JSON.stringify(e))),r=s[this._drag.idx];if("l"===this._drag.handle){const e=mt(a,0,yt(r,"end")-.25);r.start=e,delete r.start_anchor,delete r.start_offset}else if("r"===this._drag.handle){const e=mt(a,yt(r,"start")+.25,ht);r.end=e,delete r.end_anchor,delete r.end_offset}else{const t=(e.clientX-this._drag.startX)/i.width*24,a=this._drag.origEnd-this._drag.origStart;let s=mt(this._drag.origStart+t,0,ht-a);s=_t(s),r.start=s,r.end=s+a,delete r.start_anchor,delete r.start_offset,delete r.end_anchor,delete r.end_offset}this._fireBlocksChanged($t(s,r))}_onDragUp(){this._drag=null,this._boundMove&&(window.removeEventListener("pointermove",this._boundMove),window.removeEventListener("mousemove",this._boundMove)),this._boundUp&&(window.removeEventListener("pointerup",this._boundUp),window.removeEventListener("pointercancel",this._boundUp),window.removeEventListener("mouseup",this._boundUp)),this._boundMove=null,this._boundUp=null}_onRadialHandleDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const a=this.blocks[t],s=this.shadowRoot?.querySelector(".radial");if(!s)return;const r=e=>{const t=s.getBoundingClientRect(),i=420,a=(e.clientX-t.left)/t.width*i,r=(e.clientY-t.top)/t.height*i;let n=Math.atan2(r-210,a-210)+Math.PI/2;return n<0&&(n+=2*Math.PI),n/(2*Math.PI)*24},n=r(e),o=yt(a,"start"),l=yt(a,"end"),d=this.blocks.map(e=>JSON.parse(JSON.stringify(e))),c=t,u=e=>{const t=r(e),a=_t(t),s=d.map(e=>JSON.parse(JSON.stringify(e))),u=s[c];if("l"===i)u.start=mt(a,0,yt(u,"end")-.25),delete u.start_anchor,delete u.start_offset;else if("r"===i)u.end=mt(a,yt(u,"start")+.25,ht),delete u.end_anchor,delete u.end_offset;else{const e=l-o;let i=o+(t-n);i=_t(i),i=mt(i,0,ht-e),u.start=i,u.end=i+e,delete u.start_anchor,delete u.start_offset,delete u.end_anchor,delete u.end_offset}this._fireBlocksChanged($t(s,u))},p=()=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",p),window.removeEventListener("pointercancel",p)};window.addEventListener("pointermove",u),window.addEventListener("pointerup",p),window.addEventListener("pointercancel",p)}_onTrackClick(e){if(!this.interactive)return;if(e.target.closest(".tl-block"))return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),a=mt((e.clientX-i.left)/i.width*24,0,ht),s=Math.max(0,_t(a)-.5),r=Math.min(ht,s+1),n=this.blocks.some(e=>{const t=yt(e,"start"),i=yt(e,"end");return!(r<=t||s>=i)});if(n)return;const o=[...this.blocks,{start:s,end:r,action:rt(this.deviceType)}];this._fireBlocksChanged(o)}_fireSelect(e){this.dispatchEvent(new CustomEvent("block-select",{detail:{index:e}}))}_fireBlocksChanged(e){this.dispatchEvent(new CustomEvent("blocks-changed",{detail:{blocks:e}}))}};St.styles=_e,e([me({type:String})],St.prototype,"variant",void 0),e([me({type:String})],St.prototype,"deviceType",void 0),e([me({type:Array})],St.prototype,"blocks",void 0),e([me({type:Number})],St.prototype,"selectedIdx",void 0),e([me({type:Number})],St.prototype,"now",void 0),e([me({type:Boolean})],St.prototype,"interactive",void 0),e([me({type:String})],St.prototype,"height",void 0),e([me({type:Boolean})],St.prototype,"showWeather",void 0),e([me({type:Array})],St.prototype,"forecast",void 0),e([me({attribute:!1})],St.prototype,"previewRule",void 0),e([fe()],St.prototype,"_drag",void 0),St=e([pe("chronos-timeline")],St);let At=class extends ce{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t}=this.card,i=e.length,a=e.filter(e=>e.enabled).length,s=this.card._rules.filter(e=>e.active).length;return j`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${Ve("screen.overview.title")}</h1>
          <p class="page-sub">${Ve("overview.subtitle",{n:a,tot:i})}</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.active")}</div>
            <div class="kpi__value">${a}<span class="text-mute" style="font-size:16px;margin-left:6px">/${i}</span></div>
            <div class="kpi__delta">${t.length} ${Ve("overview.kpi.devices").toLowerCase()}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.weather_rules")}</div>
            <div class="kpi__value">${s}</div>
            <div class="kpi__delta">${Ve("device.state.live")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.now")}</div>
            <div class="kpi__value">${vt(this.nowHour)}</div>
            <div class="kpi__delta">${Ve("device.state.live")}</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">${Ve("nav.overview")}</h2>
            <span class="tag mono">${i}</span>
          </div>
          <div class="row" style="flex-wrap:wrap;gap:8px">
            <button class="btn" @click=${()=>this.card.navigate("week")}>${be("calendar",14)} ${Ve("nav.week")}</button>
            <button class="btn" @click=${()=>this.card.createSceneSchedule()} title="${Ve("overview.new_scene.hint")}">
              ${be("sun",14)} ${Ve("overview.new_scene")}
            </button>
            <button class="btn" @click=${()=>this.card.createAutomationSchedule()} title="${Ve("overview.new_automation.hint")}">
              ${be("wand",14)} ${Ve("overview.new_automation")}
            </button>
            <button class="btn" @click=${()=>this.card.createServiceSchedule()} title="${Ve("overview.new_service.hint")}">
              ${be("terminal",14)} ${Ve("overview.new_service")}
            </button>
            <button class="btn btn--primary" @click=${()=>this.card.navigate("wizard")}>${be("plus",14)} ${Ve("nav.new_schedule")}</button>
          </div>
        </div>

        <div class="grid-auto">
          ${e.map(e=>{const i=(e.device_ids||[]).map(e=>t.find(t=>t.id===e)).filter(Boolean),a=this.card.rulesForSchedule(e.id).filter(e=>e.active).length;return j`
              <div class="sched-card" data-selected="${e.id===this.card._selectedId}"
                @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                <div class="sched-card__header">
                  <div style="flex:1;min-width:0">
                    <h3 class="sched-card__title">${e.name}</h3>
                    <div class="sched-card__sub">${kt(e.days)} · ${e.blocks.length}</div>
                  </div>
                  <label class="switch" @click=${e=>e.stopPropagation()}>
                    <input type="checkbox" .checked=${e.enabled} @change=${t=>{this.card.doToggleSchedule(e.id,t.target.checked)}}/>
                    <span class="switch__track"></span>
                    <span class="switch__thumb"></span>
                  </label>
                </div>

                <chronos-timeline
                  variant="linear"
                  .deviceType=${e.device_type}
                  .blocks=${e.blocks}
                  .now=${e.enabled?this.nowHour:null}
                  .interactive=${!1}
                  height="compact"
                  .showWeather=${!1}
                ></chronos-timeline>

                <div class="sched-card__footer">
                  <div class="sched-card__devices">
                    ${0!==i.length||["scene","automation","service"].includes(e.device_type)?j`${i.slice(0,5).map(e=>{const t=qe(e,this.card.hass?.states?.[e.entity_id],this.card._settings);return j`<div class="device-icon-pill" title="${e.alias}" style="background:${t.soft};color:${t.accent}">${we(e.type,14)}</div>`})}
                        ${i.length>5?j`<div class="device-icon-pill mono" style="font-size:10px">+${i.length-5}</div>`:J}`:j`<span class="chip" style="background:color-mix(in srgb, var(--danger) 15%, transparent);color:var(--danger);border-color:color-mix(in srgb, var(--danger) 35%, transparent)" title="${Ve("overview.no_devices.tooltip")}">
                          ${be("info",11)} ${Ve("overview.no_devices")}
                        </span>`}
                  </div>
                  <div style="flex:1"></div>
                  ${a>0?j`<span class="chip chip--weather">${be("cloud",11)} ${Ve("overview.rules_count",{n:a})}</span>`:J}
                  <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?Ve("schedule.active"):Ve("schedule.disabled")}</span>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}};At.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],At.prototype,"card",void 0),e([me({type:Number})],At.prototype,"nowHour",void 0),At=e([pe("chronos-overview")],At);function zt(e,t){const i=JSON.parse(JSON.stringify(e)),a="number"==typeof i.block_index?i.block_index:null;return delete i.id,delete i.block_index,i.targets=[{schedule_id:t,block_index:a}],i}const Ct=["light","plug","fan","thermostat"];let Mt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._selectedBlockIdx=0,this._selectedRuleIdx=-1,this._confirmDelete=!1,this._idCopied=!1,this._entitySearch=""}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return j`<div class="text-mute" style="padding:40px;text-align:center">${Ve("overview.no_schedules")}</div>`;const t=e.blocks[this._selectedBlockIdx],i=(e.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean),a=e.device_type,s=xt[a]||{label:a},r=tt(a),n=t?.action?it(a,t.action.id):null,o=this.card.isDirty,l=this.card.rulesForSchedule(e.id),d=e.timeline_variant??this.card._settings?.default_timeline_variant??"linear";return j`
      <div class="col" style="gap:18px">
        <div class="sp-between" style="align-items:flex-start;flex-wrap:wrap;row-gap:10px">
          <div style="min-width:0;flex:1 1 280px">
            <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")} style="margin-bottom:6px">
              ${be("chevron-left",14)} ${Ve("nav.overview")}
            </button>
            <input class="input" .value=${e.name}
              @input=${t=>this.card.updateScheduleLocal(e.id,{name:t.target.value})}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:100%;max-width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?Ve("schedule.active"):Ve("schedule.disabled")}</span>
              <span class="chip">${be("repeat",11)} ${kt(e.days)}</span>
              <span class="chip chip--accent">${we(a,11)} ${s.label}</span>
              ${["scene","automation","service"].includes(a)?J:0===i.length?j`<span class="chip" style="background:color-mix(in srgb, var(--danger) 15%, transparent);color:var(--danger);border-color:color-mix(in srgb, var(--danger) 35%, transparent)" title="${Ve("editor.no_devices.tooltip")}">
                        ${be("info",11)} ${Ve("editor.no_devices")}
                      </span>`:j`<span class="chip">${be("device",11)} ${i.length}</span>`}
              ${l.filter(e=>e.active).length>0?j`<span class="chip chip--weather">${be("cloud",11)} ${Ve("overview.rules_count",{n:l.filter(e=>e.active).length})}</span>`:J}
              <span class="chip mono" style="cursor:pointer" title="${Ve("editor.id_chip.title")}"
                @click=${()=>this._copyScheduleId(e.id)}>
                ${be(this._idCopied?"check":"copy",11)} ${e.id}
              </span>
            </div>
          </div>
          <div class="row" style="gap:10px;flex-shrink:0;flex-wrap:wrap">
            <label class="switch">
              <input type="checkbox" .checked=${e.enabled} @change=${t=>this.card.doToggleSchedule(e.id,t.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" @click=${()=>this.card.openDuplicateModal(e.id)} title="${Ve("dup.title")}">${be("copy",14)}</button>
            <button class="btn" @click=${()=>this._exportSchedule(e)} title="${Ve("editor.export")}">${be("download",14)}</button>
            <button class="btn" style="color:var(--danger)" @click=${()=>{this._confirmDelete=!0}} title="${Ve("common.delete")}">${be("trash",14)}</button>
            <button class="btn"
              style="background:${o?"var(--warn)":"var(--ok)"};color:white;border-color:transparent;cursor:${o?"pointer":"default"};font-weight:600;white-space:nowrap"
              @click=${()=>{o&&this.card.saveCurrentSchedule()}}>
              ${be("check",14)} ${Ve(o?"editor.dirty.unsaved":"editor.dirty.saved")}
            </button>
          </div>
        </div>

        <div class="editor-cols">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">${Ve("wizard.step.time")}</h3>
                  <p class="card__sub">${Ve("editor.add_block_hint")}</p>
                </div>
                <div class="segmented">
                  ${["linear","radial","list"].map(t=>j`
                    <button data-active="${d===t}" @click=${()=>this.card.setTimelineVariant(e.id,t)}>
                      ${Ve("timeline."+t)}
                    </button>
                  `)}
                </div>
              </div>
              <chronos-timeline
                .variant=${d}
                .deviceType=${a}
                .blocks=${e.blocks}
                .selectedIdx=${this._selectedBlockIdx}
                .now=${e.enabled?this.nowHour:null}
                .interactive=${!0}
                .forecast=${this.card._forecast}
                .previewRule=${this._selectedRuleIdx>=0&&l[this._selectedRuleIdx]||null}
                @block-select=${e=>{this._selectedBlockIdx=e.detail.index}}
                @blocks-changed=${t=>{this.card.updateBlocksLocal(e.id,t.detail.blocks)}}
              ></chronos-timeline>
              <div class="row" style="margin-top:14px;justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div class="row" style="gap:14px;flex-wrap:wrap">
                  ${r.map(e=>j`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${Ke[e.kind]};display:inline-block"></span>
                      <span class="text-xs">${Ue(a,e.id,e.label)}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${()=>{const t=[...e.blocks,{start:12,end:13,action:rt(a)}];this.card.updateBlocksLocal(e.id,t)}}>
                  ${be("plus",12)} ${Ve("common.add")}
                </button>
              </div>
            </div>

            <!-- Days -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("editor.days.repeat")}</h3><p class="card__sub">${Ve("wizard.days.hint")}</p></div>
              </div>
              <div class="row" style="gap:16px;flex-wrap:wrap">
                <div class="row" style="gap:4px">
                  ${wt().map((t,i)=>{const a=e.days[i];return j`
                      <button class="mono" @click=${()=>{const t=[...e.days];t[i]=t[i]?0:1,this.card.updateScheduleLocal(e.id,{days:t})}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;letter-spacing:0.02em;background:${a?"var(--accent)":"var(--bg-sunken)"};color:${a?"white":"var(--text-muted)"};border:1px solid ${a?"transparent":"var(--border-soft)"};cursor:pointer">
                        ${t}
                      </button>
                    `})}
                </div>
                <div class="row" style="gap:6px">
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,1,1]})}>${Ve("editor.days.all")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,0,0]})}>${Ve("editor.days.weekdays")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[0,0,0,0,0,1,1]})}>${Ve("editor.days.weekend")}</button>
                </div>
              </div>
              ${this._renderDateRange(e)}
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("editor.weather_rules.title")}</h3><p class="card__sub">${Ve("nav.weather_rules")}</p></div>
                <button class="btn btn--sm" @click=${()=>this.card.navigate("weatherRule")}>${be("plus",12)} ${Ve("editor.weather_rules.add")}</button>
              </div>
              ${l.length?j`<div class="col" style="gap:8px">
                    ${l.map((t,i)=>{const a=null===t.block_index||void 0===t.block_index?Ve("wr.target.all_blocks"):(()=>{const i=e.blocks[t.block_index];return i?`#${t.block_index+1} ${vt(yt(i,"start"))}-${vt(yt(i,"end"))}`:`#${t.block_index+1}`})(),s=this._selectedRuleIdx===i,r=t.targets?.length||1,n=(t.targets||[]).filter(t=>t.schedule_id!==e.id).map(e=>this.card._schedules.find(t=>t.id===e.schedule_id)?.name||e.schedule_id);return j`
                      <div class="rule-block" data-selected="${s}"
                        style="cursor:pointer;${s?"border:2px solid var(--accent);background:var(--accent-soft)":""}"
                        @click=${()=>{this._selectedRuleIdx=s?-1:i}}>
                        <span class="chip chip--accent" style="flex:0 0 auto" title="${Ve("wr.target.label")}">
                          ${be("clock",11)} ${a}
                        </span>
                        ${r>1?j`
                          <span class="chip" style="flex:0 0 auto" title="${Ve("rule.shared.tooltip",{list:n.join(", ")})}">
                            ${be("repeat",10)} ${r}
                          </span>
                        `:J}
                        ${t.if?j`
                          <span class="rule-block__label rule-block__label--if">IF</span>
                          <span class="rule-token rule-token--weather">${t.if}</span>
                        `:J}
                        <span class="rule-block__label rule-block__label--then">${Ve("wr.effect."+(t.effect||"skip"))}</span>
                        <span class="rule-token rule-token--accent">${t.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch" @click=${e=>e.stopPropagation()}>
                          <input type="checkbox" .checked=${t.active} @change=${e=>{this.card.toggleRuleActive(t.id,e.target.checked)}}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                        <button class="btn btn--icon btn--ghost btn--sm"
                          @click=${i=>{i.stopPropagation(),this.card.editWeatherRule(t.id,e.id)}}
                          title="${Ve("common.edit")}">
                          ${be("edit",12)}
                        </button>
                        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                          @click=${a=>{a.stopPropagation();const s=r>1?Ve("rule.unlink.shared",{n:r,name:e.name}):`${Ve("common.remove")}: ${t.if||""} → ${t.then}?`;confirm(s)&&(this.card.unlinkRuleFromSchedule(t.id,e.id),this._selectedRuleIdx===i&&(this._selectedRuleIdx=-1))}}
                          title="${Ve("common.remove")}">
                          ${be("trash",12)}
                        </button>
                      </div>
                      `})}
                  </div>`:j`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${be("cloud",22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("editor.weather_rules.empty")}</div>
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("wizard.time.selected")}</h3><p class="card__sub">${t?`${vt(t.start)} → ${vt(t.end)}`:""}</p></div>
              </div>
              ${t?j`
                <div class="col" style="gap:12px">
                  ${this._renderTimeEdge(e.id,t,"start")}
                  ${this._renderTimeEdge(e.id,t,"end")}
                  ${this._renderWrapWarning(t)}
                  <div class="field">
                    <label class="field__label">${Ve("editor.block.action")}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${r.map(i=>{const s=t.action?.id===i.id;return j`<button class="btn btn--sm" @click=${()=>this._setBlockAction(e.id,i.id,i.value?.default)}
                          style="background:${s?Ke[i.kind]:"var(--surface)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border)"}">
                          ${Ue(a,i.id,i.label)}</button>`})}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${n?.service||""}</span>
                  </div>
                  ${"irrigation"===a&&"turn_on"===t.action?.id?this._renderIrrigationMode(e,t):J}
                  ${!n?.value||"irrigation"===a&&"sequential"===t.action?.mode?J:j`
                    <div class="field">
                      <label class="field__label">${Ge(a,t.action.id,n.value.label)||Ve("common.value")} ${n.value.unit?j`<span class="text-mute">(${n.value.unit})</span>`:J}</label>
                      ${"number"===n.value.type?j`
                        <div class="row" style="gap:10px;align-items:center">
                          <input type="range" min="${n.value.min}" max="${n.value.max}" step="${n.value.step}"
                            .value=${String(t.action?.value??n.value.default)}
                            @input=${t=>this._setBlockValue(e.id,parseFloat(t.target.value))}
                            style="flex:1"/>
                          <input type="number" class="input mono"
                            min="${n.value.min}" max="${n.value.max}" step="${n.value.step}"
                            .value=${String(t.action?.value??n.value.default)}
                            @input=${t=>{const i=parseFloat(t.target.value);isNaN(i)||this._setBlockValue(e.id,i)}}
                            style="width:90px;text-align:right;font-weight:600"/>
                          <span class="mono text-mute" style="min-width:30px">${n.value.unit||""}</span>
                        </div>
                      `:"enum"===n.value.type?j`
                        <select class="input"
                          @change=${t=>this._setBlockValue(e.id,t.target.value)}>
                          ${(n.value.options||[]).map(e=>{const i=String(t.action?.value??n.value.default);return j`<option value="${e}" ?selected=${i===e}>${e}</option>`})}
                        </select>
                      `:"entity"===n.value.type?this._renderEntityPicker(e.id,t,n.value):"string"===n.value.type?j`
                        <input class="input mono" type="text"
                          .value=${String(t.action?.value??"")}
                          placeholder="${n.value.placeholder||""}"
                          @input=${t=>this._setBlockValue(e.id,t.target.value)}
                          style="width:100%;font-weight:500"/>
                      `:J}
                    </div>
                  `}
                  ${Ct.includes(a)&&"turn_on"===t.action?.id?j`
                    <div class="field">
                      <label class="field__label">${Ve("editor.auto_off.label")} <span class="text-mute">(min)</span></label>
                      <div class="row" style="gap:10px;align-items:center">
                        <input class="input" type="number" min="0" max="1440" step="1" style="width:110px"
                          .value=${String(t.action?.auto_off_min??"")}
                          placeholder="—"
                          @change=${t=>{const i=parseFloat(t.target.value);this._setBlockAutoOff(e.id,!isNaN(i)&&i>0?Math.min(i,1440):null)}}/>
                        <span class="field__hint" style="margin:0">${Ve("editor.auto_off.hint")}</span>
                      </div>
                    </div>
                  `:J}
                  ${n?.extras?.length?this._renderExtras(e.id,t,n):J}
                  ${this._renderBlockDeviceSubset(e,t)}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${()=>this._removeBlock(e.id)}>
                    ${be("trash",14)} ${Ve("editor.block.delete")}
                  </button>
                </div>
              `:J}
            </div>

            ${"scene"===a||"automation"===a?j`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1">
                    <h3 class="card__title">${Ve("automation"===a?"editor.automation.section":"editor.scene.section")}</h3>
                    <p class="card__sub">${Ve("automation"===a?"editor.automation.section.hint":"editor.scene.section.hint")}</p>
                  </div>
                </div>
                <p class="text-xs text-mute" style="margin:0">${Ve("automation"===a?"editor.automation.no_devices":"editor.scene.no_devices")}</p>
              </div>
            `:j`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1"><h3 class="card__title">${Ve("editor.devices_section")}</h3><p class="card__sub">${Ve("editor.devices_count",{n:i.length})}</p></div>
                </div>
                ${this._renderDevicePicker(e,a)}
                <div class="col" style="gap:2px;margin-top:10px">
                  ${i.map(t=>j`
                    <div class="device-row">
                      <div class="device-row__icon">${we(t.type,17)}</div>
                      <div class="device-row__main">
                        <div class="device-row__name">${t.alias}</div>
                        <div class="device-row__meta">${t.area} · ${t.entity_id}</div>
                      </div>
                      <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                        @click=${()=>this._removeDeviceFromSchedule(e.id,t.id)}
                        title="${Ve("common.remove")}">
                        ${be("trash",12)}
                      </button>
                    </div>
                  `)}
                  ${i.length?J:j`
                    <p class="text-xs text-mute" style="text-align:center;padding:14px 0;font-style:italic">${Ve("editor.devices_empty")}</p>
                  `}
                </div>
              </div>
            `}
          </div>
        </div>
        ${this._confirmDelete?this._renderDeleteModal(e):J}
      </div>
    `}_renderTimeEdge(e,t,i){const a=t[`${i}_anchor`],s=t[`${i}_offset`]??0,r=a??"fixed",n=yt(t,i),o=Ve("start"===i?"editor.block.from":"editor.block.to");return j`
      <div class="field">
        <label class="field__label">${o}</label>
        <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
          <select class="select mono" style="width:130px"
            @change=${t=>this._setEdgeMode(e,i,t.target.value)}>
            <option value="fixed" ?selected=${"fixed"===r}>${Ve("editor.block.fixed")}</option>
            <option value="sunrise" ?selected=${"sunrise"===r}>${Ve("editor.block.sunrise")}</option>
            <option value="sunset" ?selected=${"sunset"===r}>${Ve("editor.block.sunset")}</option>
          </select>
          ${"fixed"===r?j`
            <input type="time" class="input mono" style="width:120px"
              .value=${this._toHHMM(n)}
              @change=${t=>this._setEdgeFixed(e,i,t.target.value)}/>
          `:j`
            <input type="number" class="input mono" style="width:90px" step="5" min="-180" max="180"
              .value=${String(s)}
              @change=${t=>this._setEdgeOffset(e,i,parseInt(t.target.value,10))}/>
            <span class="text-xs text-mute">min</span>
            <span class="text-xs text-mute" style="font-style:italic">→ ${Ve("editor.block.today")} ${vt(n)}</span>
          `}
        </div>
      </div>
    `}_toHHMM(e){if(!Number.isFinite(e))return"00:00";const t=Math.max(0,Math.min(23+59/60,e)),i=Math.floor(t);let a=Math.round(60*(t-i));return a>=60&&(a=59),`${String(i).padStart(2,"0")}:${String(a).padStart(2,"0")}`}_commitBlocks(e,t,i){this.card.updateBlocksLocal(e,t);const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=a.blocks.indexOf(i);s>=0&&(this._selectedBlockIdx=s)}_blockWrapsMidnight(e){const t=e.start_anchor,i=e.end_anchor;if("sunset"===t&&"sunrise"===i)return!0;const a=yt(e,"start");return yt(e,"end")<=a}_renderWrapWarning(e){return this._blockWrapsMidnight(e)?j`
      <div style="border:1px solid var(--warn);background:var(--warn-soft,#fff7ed);color:#92400e;padding:10px 12px;border-radius:8px;font-size:12.5px;line-height:1.4">
        <strong>${Ve("editor.block.wrap_warn.title")}</strong>
        <div style="margin-top:4px">${Ve("editor.block.wrap_warn.body")}</div>
      </div>
    `:J}_setEdgeMode(e,t,i){const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=[...a.blocks],r={...s[this._selectedBlockIdx]};if("fixed"===i){const e=yt(r,t);r[t]=e,delete r[`${t}_anchor`],delete r[`${t}_offset`]}else r[`${t}_anchor`]=i,void 0===r[`${t}_offset`]&&(r[`${t}_offset`]=0);s[this._selectedBlockIdx]=r,this._commitBlocks(e,s,r)}_setEdgeFixed(e,t,i){if(!i)return;const[a,s]=i.split(":").map(e=>parseInt(e,10));if(isNaN(a)||isNaN(s))return;const r=this.card._schedules.find(t=>t.id===e);if(!r)return;const n=[...r.blocks],o={...n[this._selectedBlockIdx]};o[t]=a+s/60,delete o[`${t}_anchor`],delete o[`${t}_offset`],n[this._selectedBlockIdx]=o,this._commitBlocks(e,n,o)}_setEdgeOffset(e,t,i){if(isNaN(i))return;const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=[...a.blocks],r={...s[this._selectedBlockIdx]};r[`${t}_offset`]=i,s[this._selectedBlockIdx]=r,this._commitBlocks(e,s,r)}_renderBlockDeviceSubset(e,t){if("scene"===e.device_type||"automation"===e.device_type)return J;const i=e.device_ids||[];if(i.length<2)return J;const a=t.device_ids||[],s=0===a.length||a.length===i.length,r=new Set(s?i:a),n=i.map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean);return j`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${Ve("editor.block.targets")}</label>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <button class="btn btn--sm" @click=${()=>this._setBlockDeviceSubset(e.id,[])}
            style="background:${s?"var(--accent)":"var(--bg-sunken)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border-soft)"}">
            ${s?be("check",11):J} ${Ve("editor.block.targets.all")}
          </button>
          ${n.map(t=>{const i=!s&&r.has(t.id);return j`
              <button class="btn btn--sm" @click=${()=>this._toggleBlockDeviceTarget(e.id,t.id)}
                style="background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text)"};border-color:${i?"transparent":"var(--border-soft)"}">
                ${i?be("check",11):J} ${we(t.type,11)} ${t.alias}
              </button>
            `})}
        </div>
        <span class="field__hint" style="margin-top:4px">${Ve("editor.block.targets.hint")}</span>
      </div>
    `}_setBlockDeviceSubset(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=[...i.blocks],s={...a[this._selectedBlockIdx]};t.length?s.device_ids=t:delete s.device_ids,a[this._selectedBlockIdx]=s,this._commitBlocks(e,a,s)}_toggleBlockDeviceTarget(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=i.blocks[this._selectedBlockIdx];if(!a)return;const s=i.device_ids||[],r=a.device_ids||[];let n;n=r.length?r.includes(t)?r.filter(e=>e!==t):[...r,t]:s.filter(e=>e!==t),n.length===s.length&&(n=[]),this._setBlockDeviceSubset(e,n)}_renderIrrigationMode(e,t){const i="sequential"===t.action?.mode?"sequential":"global",a=(e.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(e=>!!e&&"irrigation"===e.type),s=t.action?.sequence||[],r=new Map(s.map(e=>[e.entity_id,e.minutes])),n=a.reduce((e,t)=>e+(r.get(t.entity_id)??0),0);return j`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${Ve("editor.irrigation.mode")}</label>
        <div class="segmented" style="margin-bottom:8px">
          <button data-active="${"global"===i}" @click=${()=>this._setIrrigationMode(e.id,"global")}>
            ${Ve("editor.irrigation.mode.global")}
          </button>
          <button data-active="${"sequential"===i}" @click=${()=>this._setIrrigationMode(e.id,"sequential")}>
            ${Ve("editor.irrigation.mode.sequential")}
          </button>
        </div>
        ${"sequential"===i?j`
          <span class="field__hint" style="display:block;margin-bottom:8px">${Ve("editor.irrigation.seq.hint")}</span>
          ${a.length?j`<div class="col" style="gap:6px">
                ${a.map((t,i)=>j`
                  <div class="row" style="gap:8px;align-items:center;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md)">
                    <span class="mono text-xs text-mute" style="width:18px;text-align:right">${i+1}</span>
                    <div style="flex:1;min-width:0">
                      <div class="text-sm fw-600 truncate">${t.alias}</div>
                      <div class="text-xs text-mute mono truncate">${t.entity_id}</div>
                    </div>
                    <input type="number" class="input mono" min="1" max="240" step="1"
                      .value=${String(r.get(t.entity_id)??"")}
                      placeholder="min"
                      @input=${i=>{const a=parseInt(i.target.value,10);this._setSeqMinutes(e.id,t.entity_id,isNaN(a)?0:a)}}
                      style="width:80px;text-align:right;font-weight:600"/>
                    <span class="mono text-mute text-xs" style="width:24px">min</span>
                  </div>
                `)}
                <div class="row" style="justify-content:flex-end;gap:6px;margin-top:4px">
                  <span class="text-xs text-mute">${Ve("editor.irrigation.seq.total")}</span>
                  <span class="mono fw-600">${n} min</span>
                </div>
              </div>`:j`<span class="text-xs" style="color:var(--warn)">${Ve("editor.irrigation.seq.no_valves")}</span>`}
        `:J}
      </div>
    `}_setIrrigationMode(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=[...i.blocks],s={...a[this._selectedBlockIdx]},r={...s.action||{id:"turn_on"}};if("global"===t)r.mode="global",delete r.sequence;else{r.mode="sequential";const e=(i.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(e=>!!e&&"irrigation"===e.type).map(e=>({entity_id:e.entity_id,minutes:(r.sequence||[]).find(t=>t.entity_id===e.entity_id)?.minutes??("number"==typeof r.value?r.value:10)}));r.sequence=e}s.action=r,a[this._selectedBlockIdx]=s,this._commitBlocks(e,a,s)}_setSeqMinutes(e,t,i){const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=[...a.blocks],r={...s[this._selectedBlockIdx]},n={...r.action||{id:"turn_on"}},o=[...n.sequence||[]],l=o.findIndex(e=>e.entity_id===t);l>=0?o[l]={...o[l],minutes:i}:o.push({entity_id:t,minutes:i}),n.sequence=o,n.mode="sequential",r.action=n,s[this._selectedBlockIdx]=r,this._commitBlocks(e,s,r)}_renderEntityPicker(e,t,i){const a="automation"===i.domain?this.card._automationEntities:this.card._sceneEntities,s=t.action?.value,r=Array.isArray(s)?s:"string"==typeof s&&s?[s]:[],n="automation"===i.domain?Ve("editor.automation.pick_placeholder"):Ve("editor.scene.pick_placeholder"),o="automation"===i.domain?Ve("editor.automation.pick_warn"):Ve("editor.scene.pick_warn");if(!i.multi)return j`
        <select class="input"
          @change=${t=>this._setBlockValue(e,t.target.value)}>
          <option value="" ?selected=${!s}>${n}</option>
          ${a.map(e=>j`
            <option value="${e.entity_id}" ?selected=${s===e.entity_id}>
              ${e.friendly_name||e.entity_id}
            </option>
          `)}
        </select>
        ${s?J:j`<span class="field__hint" style="color:var(--warn);margin-top:4px">${o}</span>`}
      `;const l=this._entitySearch.trim().toLowerCase(),d=l?a.filter(e=>{if(r.includes(e.entity_id))return!0;return`${e.friendly_name||""} ${e.entity_id||""}`.toLowerCase().includes(l)}):a;return j`
      <div class="col" style="gap:8px">
        ${a.length>6?j`
          <input class="input" type="search" .value=${this._entitySearch}
            placeholder="${Ve("editor.entity.search")}"
            @input=${e=>{this._entitySearch=e.target.value}}/>
        `:J}
        <div class="row" style="gap:6px;flex-wrap:wrap">
          ${d.length?d.map(t=>{const i=t.entity_id,a=r.includes(i);return j`
              <button class="btn btn--sm"
                @click=${()=>this._toggleEntitySelection(e,i)}
                style="background:${a?"var(--accent)":"var(--bg-sunken)"};color:${a?"white":"var(--text)"};border-color:${a?"transparent":"var(--border-soft)"}">
                ${a?be("check",11):J} ${t.friendly_name||i}
              </button>
            `}):j`<span class="text-xs text-mute">${a.length?Ve("editor.entity.no_match"):Ve("editor.entity.empty")}</span>`}
        </div>
        ${0===r.length?j`<span class="field__hint" style="color:var(--warn)">${o}</span>`:j`<span class="field__hint">${Ve("editor.entity.count",{n:r.length})}</span>`}
      </div>
    `}_toggleEntitySelection(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=i.blocks[this._selectedBlockIdx];if(!a)return;const s=a.action?.value,r=Array.isArray(s)?[...s]:"string"==typeof s&&s?[s]:[],n=r.indexOf(t);n>=0?r.splice(n,1):r.push(t),this._setBlockValue(e,r)}_renderExtras(e,t,i){const a=t.action?.extras||{};return j`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${Ve("editor.block.extras")}</label>
        <div class="col" style="gap:8px">
          ${(i.extras||[]).map(t=>{const i=a[t.key];if("json"===t.type){const a="string"==typeof i?i:i?JSON.stringify(i,null,2):"";return j`
                <div class="col" style="gap:4px">
                  <span class="text-xs text-mute">${Je(t.key,t.label)}</span>
                  <textarea class="input mono"
                    .value=${a}
                    placeholder="${t.placeholder||'{"key": "value"}'}"
                    @input=${i=>this._setBlockExtra(e,t.key,i.target.value)}
                    style="width:100%;min-height:90px;font-size:12px;font-family:var(--font-mono);resize:vertical"></textarea>
                  <span class="text-xs text-mute">${Ve("editor.block.extras.json.hint")}</span>
                </div>
              `}return j`
              <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
                <span class="text-xs text-mute" style="min-width:130px">${Je(t.key,t.label)}${t.unit?` (${t.unit})`:""}</span>
                ${"color"===t.type?j`
                  <input type="color"
                    .value=${this._rgbToHex(i)}
                    @input=${i=>this._setBlockExtra(e,t.key,this._hexToRgb(i.target.value))}
                    style="width:48px;height:32px;padding:0;border:1px solid var(--border-soft);border-radius:6px;cursor:pointer"/>
                `:"number"===t.type?j`
                  <input type="number" class="input mono"
                    min="${t.min}" max="${t.max}" step="${t.step}"
                    .value=${null!=i?String(i):""}
                    @input=${i=>{const a=i.target.value,s=""===a?void 0:parseFloat(a);this._setBlockExtra(e,t.key,isNaN(s)?void 0:s)}}
                    placeholder="—"
                    style="flex:1;min-width:100px"/>
                `:"string"===t.type?j`
                  <input type="${t.secret?"password":"text"}" class="input mono"
                    autocomplete="off"
                    .value=${null!=i?String(i):""}
                    placeholder="${t.placeholder||""}"
                    @input=${i=>this._setBlockExtra(e,t.key,i.target.value)}
                    style="flex:1;min-width:100px"/>
                `:J}
                ${null!=i&&""!==i?j`
                  <button class="btn btn--icon btn--ghost btn--sm" title="${Ve("common.remove")}"
                    @click=${()=>this._setBlockExtra(e,t.key,void 0)}>
                    ${be("close",12)}
                  </button>
                `:J}
              </div>
            `})}
        </div>
        <span class="field__hint">${Ve("editor.block.extras.hint")}</span>
      </div>
    `}_setBlockExtra(e,t,i){const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=[...a.blocks],r=s[this._selectedBlockIdx];if(!r)return;const n={...r.action||{id:""}},o={...n.extras||{}};void 0===i?delete o[t]:o[t]=i,n.extras=Object.keys(o).length?o:void 0,s[this._selectedBlockIdx]={...r,action:n},this.card.updateBlocksLocal(e,s)}_rgbToHex(e){if(!Array.isArray(e)||e.length<3)return"#ffffff";const[t,i,a]=e;return"#"+[t,i,a].map(e=>Math.max(0,Math.min(255,0|e)).toString(16).padStart(2,"0")).join("")}_hexToRgb(e){const t=e.replace("#","");return[parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16),parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16),parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)]}_renderDateRange(e){const t=e.date_range,i=!!t,a=Array.from({length:12},(e,t)=>t+1),s=Array.from({length:31},(e,t)=>t+1);return j`
      <div style="margin-top:14px;border-top:1px dashed var(--border-soft);padding-top:14px">
        <div class="row" style="gap:12px;align-items:center">
          <label class="switch">
            <input type="checkbox" .checked=${i}
              @change=${t=>{const i=t.target.checked?{start_month:1,start_day:1,end_month:12,end_day:31}:null;this.card.updateScheduleLocal(e.id,{date_range:i})}}/>
            <span class="switch__track"></span>
            <span class="switch__thumb"></span>
          </label>
          <span class="text-sm fw-600">${Ve("editor.date_range.toggle")}</span>
        </div>
        <span class="field__hint" style="display:block;margin-top:4px">${Ve("editor.date_range.hint")}</span>
        ${i?j`
          <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center">
            <span class="text-xs text-mute" style="min-width:30px">${Ve("editor.date_range.from")}</span>
            <select class="select mono" style="width:140px"
              @change=${t=>this._updateDateRange(e.id,"start_month",parseInt(t.target.value,10))}>
              ${a.map(e=>j`<option value="${e}" ?selected=${t.start_month===e}>${this._monthLabel(e)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${t=>this._updateDateRange(e.id,"start_day",parseInt(t.target.value,10))}>
              ${s.map(e=>j`<option value="${e}" ?selected=${t.start_day===e}>${e}</option>`)}
            </select>
            <span class="text-xs text-mute" style="min-width:30px">${Ve("editor.date_range.to")}</span>
            <select class="select mono" style="width:140px"
              @change=${t=>this._updateDateRange(e.id,"end_month",parseInt(t.target.value,10))}>
              ${a.map(e=>j`<option value="${e}" ?selected=${t.end_month===e}>${this._monthLabel(e)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${t=>this._updateDateRange(e.id,"end_day",parseInt(t.target.value,10))}>
              ${s.map(e=>j`<option value="${e}" ?selected=${t.end_day===e}>${e}</option>`)}
            </select>
          </div>
          ${100*t.start_month+t.start_day>100*t.end_month+t.end_day?j`
            <span class="field__hint" style="display:block;margin-top:6px;color:var(--warn)">${Ve("editor.date_range.wraps")}</span>
          `:J}
        `:J}
      </div>
    `}_updateDateRange(e,t,i){if(isNaN(i))return;const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=a.date_range||{start_month:1,start_day:1,end_month:12,end_day:31};this.card.updateScheduleLocal(e,{date_range:{...s,[t]:i}})}_monthLabel(e){const t=`month.${e}`,i=Ve(t);return i===t?String(e):i}_renderDevicePicker(e,t){const i=new Set(e.device_ids||[]),a=this.card._devices.filter(e=>e.type===t&&!i.has(e.id));return a.length?j`
      <div class="row" style="gap:8px;align-items:center">
        <select class="select mono" style="flex:1" id="add-device-${e.id}">
          ${a.map(e=>j`<option value="${e.id}">${e.alias} · ${e.entity_id}</option>`)}
        </select>
        <button class="btn btn--sm btn--primary"
          @click=${t=>{const i=t.target.closest(".row")?.querySelector("select");i?.value&&this._addDeviceToSchedule(e.id,i.value)}}>
          ${be("plus",12)} ${Ve("common.add")}
        </button>
      </div>
    `:j`<p class="text-xs text-mute" style="margin:0">${Ve("editor.devices_no_more",{type:t})}</p>`}_addDeviceToSchedule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=i.device_ids||[];a.includes(t)||this.card.updateScheduleLocal(e,{device_ids:[...a,t]})}_removeDeviceFromSchedule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=(i.device_ids||[]).filter(e=>e!==t);this.card.updateScheduleLocal(e,{device_ids:a})}_setBlockAction(e,t,i){const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const s=[...a.blocks];s[this._selectedBlockIdx]={...s[this._selectedBlockIdx],action:{id:t,value:i}},this.card.updateBlocksLocal(e,s)}_setBlockValue(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=[...i.blocks],s=a[this._selectedBlockIdx];a[this._selectedBlockIdx]={...s,action:{...s.action,value:t}},this.card.updateBlocksLocal(e,a)}_setBlockAutoOff(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const a=[...i.blocks],s=a[this._selectedBlockIdx],r={...s.action};t&&t>0?r.auto_off_min=t:delete r.auto_off_min,a[this._selectedBlockIdx]={...s,action:r},this.card.updateBlocksLocal(e,a)}_renderDeleteModal(e){return j`
      <div class="modal-overlay" @click=${()=>{this._confirmDelete=!1}}>
        <div class="card" style="width:min(440px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${Ve("common.delete")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${e.name}</strong>
            <span class="text-xs text-mute" style="display:block;margin-top:4px">
              ${Ve("editor.delete.summary",{blocks:e.blocks.length,devices:(e.device_ids||[]).length,rules:this.card.rulesForSchedule(e.id).length})}
            </span>
          </p>
          <p class="text-xs text-mute" style="margin:0 0 16px">
            ${Ve("editor.delete.warn")}
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmDelete=!1}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              @click=${async()=>{this._confirmDelete=!1,await this.card.doRemoveSchedule(e.id)}}>
              ${be("trash",12)} ${Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_removeBlock(e){const t=this.card._schedules.find(t=>t.id===e);if(!t||t.blocks.length<=1)return;const i=t.blocks.filter((e,t)=>t!==this._selectedBlockIdx);this._selectedBlockIdx=Math.max(0,this._selectedBlockIdx-1),this.card.updateBlocksLocal(e,i)}_copyScheduleId(e){navigator.clipboard?.writeText(e).then(()=>{this._idCopied=!0,setTimeout(()=>{this._idCopied=!1},1200)}).catch(()=>{})}_exportSchedule(e){const t=function(e,t,i,a=[]){const s=new Map(t.map(e=>[e.id,e])),r=(e.device_ids||[]).map(e=>s.get(e)).filter(e=>!!e).map(e=>({entity_id:e.entity_id,alias:e.alias,type:e.type})),n=JSON.parse(JSON.stringify(e));delete n.id,n.device_ids=[],n.weather_rules=a.map(e=>{const t=JSON.parse(JSON.stringify(e));return delete t.id,delete t.targets,t});for(const e of n.blocks||[]){if(Array.isArray(e.device_ids)&&e.device_ids.length){const t=e.device_ids.map(e=>s.get(e)?.entity_id).filter(Boolean);t.length&&(e.device_entity_ids=t)}delete e.device_ids}const o={chronos_export:1,card_version:i,schedule:n,devices:r};return JSON.stringify(o,null,2)}(e,this.card._devices,nt,this.card.rulesForSchedule(e.id)),i=(e.name||"schedule").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"schedule",a=new Blob([t],{type:"application/json"}),s=URL.createObjectURL(a),r=document.createElement("a");r.href=s,r.download=`chronos-${i}.json`,r.click(),URL.revokeObjectURL(s)}};Mt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Mt.prototype,"card",void 0),e([me({type:Number})],Mt.prototype,"nowHour",void 0),e([fe()],Mt.prototype,"_selectedBlockIdx",void 0),e([fe()],Mt.prototype,"_selectedRuleIdx",void 0),e([fe()],Mt.prototype,"_confirmDelete",void 0),e([fe()],Mt.prototype,"_idCopied",void 0),e([fe()],Mt.prototype,"_entitySearch",void 0),Mt=e([pe("chronos-editor")],Mt);const Et=[{key:"skip",needsIf:!0,needsBlock:!0},{key:"shift",needsIf:!0,needsBlock:!0},{key:"extend",needsIf:!0,needsBlock:!0},{key:"shrink",needsIf:!0,needsBlock:!0},{key:"force_action",needsIf:!0,needsBlock:!0},{key:"replace_value",needsIf:!0,needsBlock:!0},{key:"scale_duration",needsIf:!1,needsBlock:!0},{key:"scale_value",needsIf:!1,needsBlock:!0}],It=["force_action","replace_value","scale_value"];let Dt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._hydratedFor="",this._targets=[],this._effect="skip",this._sensorSearch="",this._clauses=[{variable:"temperature",op:">",value:"22"}],this._deltaMin=30,this._direction="forward",this._actionId="",this._actionValue=null,this._fireMode="once_per_daytime",this._scaleVar="temperature",this._scaleVarMin=25,this._scaleVarMax=35,this._scaleOutMin=30,this._scaleOutMax=120}render(){this._hydrate();const e=this._contextSchedule();if(!e)return j`
      <div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">
        <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("overview.no_schedules")}</div>
        <div style="font-size:12.5px;margin-top:4px">${Ve("overview.no_schedules.cta")}</div>
        <button class="btn btn--primary" style="margin-top:16px" @click=${()=>this.card.navigate("wizard")}>
          ${be("plus",14)} ${Ve("nav.new_schedule")}
        </button>
      </div>
    `;const t=tt(e.device_type),i=this.card._weatherAttributes,a=Et.find(e=>e.key===this._effect),s=this._findConflicts(e);return j`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("weatherRulesList")}>
            ${be("chevron-left",14)} ${Ve("nav.weather_rules")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${this.card._editingRuleId?Ve("wr.heading.edit"):Ve("wr.heading")}</h1>
          <p class="page-sub">${Ve("wr.subtitle")}</p>
        </div>

        ${this._renderTargetsCard(e)}

        ${this._renderPreviewBanner(e)}

        ${s.length?j`
          <div class="card" style="background:#fef3c7;border-left:4px solid #f59e0b;color:#78350f">
            <div class="fw-600" style="margin-bottom:6px">${be("info",12)} ${Ve("wr.conflict.title")}</div>
            <div class="text-sm" style="line-height:1.5">${Ve("wr.conflict.body")}</div>
            <ul style="margin:8px 0 0;padding-left:18px;font-size:12.5px;font-family:var(--font-mono)">
              ${s.map(e=>j`<li>${e}</li>`)}
            </ul>
          </div>
        `:J}

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${Ve("wr.effect.title")}</h3>
              <p class="card__sub">${Ve("wr.effect.subtitle")}</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px">
            ${Et.map(e=>j`
              <button class="tile-pick" data-selected="${this._effect===e.key}"
                @click=${()=>{this._effect=e.key,this._initEffectDefaults(t)}}>
                <div class="tile-pick__name">${Ve("wr.effect."+e.key)}</div>
                <div class="tile-pick__desc">${Ve("wr.effect."+e.key+".desc")}</div>
              </button>
            `)}
          </div>
        </div>

        ${a.needsIf?this._renderIfSection(i):this._renderScaleVarSection(i)}

        <div class="builder-actions">
          <span class="text-xs text-mute" style="margin-right:auto">${this.card._editingRuleId?Ve("wr.heading.edit"):Ve("wr.heading")}</span>
          <button class="btn" @click=${()=>this.card.navigate("weatherRulesList")}>${Ve("common.cancel")}</button>
          <button class="btn btn--primary" @click=${()=>this._saveRule(e,t)}>
            ${be("check",14)} ${Ve("common.save")}
          </button>
        </div>
      </div>
    `}_scheduleFor(e){return this.card._schedules.find(t=>t.id===e)}_contextSchedule(){for(const e of this._targets){const t=this._scheduleFor(e.schedule_id);if(t)return t}return this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0]}_isValueEffect(){return It.includes(this._effect)}_renderTargetsCard(e){const t=this._isValueEffect(),i=e.device_type;return j`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${Ve("wr.targets.title")}</h3>
            <p class="card__sub">${Ve("wr.targets.subtitle")}</p>
          </div>
        </div>
        <div class="col" style="gap:8px">
          ${this._targets.map((e,a)=>{const s=this._scheduleFor(e.schedule_id),r=!(!t||!s||s.device_type===i);return j`
              <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center;padding:10px 12px;background:var(--bg-sunken);border-radius:var(--r-md);${r?"outline:1px solid var(--danger)":""}">
                <select class="select mono" style="flex:1;min-width:180px"
                  @change=${e=>this._patchTarget(a,{schedule_id:e.target.value,block_index:null})}>
                  ${this.card._schedules.map(s=>j`
                    <option value="${s.id}" ?selected=${e.schedule_id===s.id}
                      ?disabled=${t&&a>0&&s.device_type!==i}>
                      ${s.name}
                    </option>
                  `)}
                </select>
                <select class="select mono" style="flex:1;min-width:170px"
                  @change=${e=>{const t=e.target.value;this._patchTarget(a,{block_index:""===t?null:parseInt(t,10)})}}>
                  <option value="" ?selected=${null===e.block_index||void 0===e.block_index}>${Ve("wr.target.all_blocks")}</option>
                  ${(s?.blocks||[]).map((t,i)=>j`
                    <option value="${i}" ?selected=${e.block_index===i}>
                      #${i+1} · ${vt(yt(t,"start"))} → ${vt(yt(t,"end"))} · ${t.action?.id||"—"}
                    </option>
                  `)}
                </select>
                ${r?j`<span class="text-xs" style="color:var(--danger)">${Ve("wr.targets.incompatible")}</span>`:J}
                ${this._targets.length>1?j`
                  <button class="btn btn--icon btn--ghost btn--sm" title="${Ve("common.remove")}"
                    @click=${()=>{this._targets=this._targets.filter((e,t)=>t!==a)}}>
                    ${be("close",12)}
                  </button>
                `:J}
              </div>
            `})}
          <button class="btn btn--sm" style="align-self:flex-start" @click=${()=>this._addTarget(e)}>
            ${be("plus",12)} ${Ve("wr.targets.add")}
          </button>
          <span class="field__hint">${Ve("wr.targets.hint")}</span>
        </div>
      </div>
    `}_patchTarget(e,t){this._targets=this._targets.map((i,a)=>a===e?{...i,...t}:i)}_addTarget(e){const t=this._isValueEffect(),i=new Set(this._targets.map(e=>e.schedule_id)),a=this.card._schedules.filter(i=>!t||i.device_type===e.device_type),s=a.find(e=>!i.has(e.id))||a[0];s&&(this._targets=[...this._targets,{schedule_id:s.id,block_index:null}])}_renderPreviewBanner(e){const t=this._buildThenText(),i=this._targets[0],a=i&&null!==i.block_index&&void 0!==i.block_index?` #${i.block_index+1}`:"",s=this._targets.length>1?" +"+(this._targets.length-1):"",r=`${e.name}${a}${s}`;return j`
      <div class="card" style="padding:14px 18px;background:var(--bg-sunken)">
        <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border);flex-wrap:wrap">
          <span class="rule-block__label rule-block__label--if">${r}</span>
          ${Et.find(e=>e.key===this._effect)?.needsIf?j`
            <span class="rule-token mono text-xs">if</span>
            ${this._clauses.map((e,t)=>j`
              ${t>0?j`<span class="rule-token mono text-xs" style="opacity:0.6">AND</span>`:J}
              <span class="rule-token rule-token--weather">${this._clauseLabel(e)}</span>
            `)}
          `:J}
          <span class="rule-block__label rule-block__label--then">${Ve("wr.effect."+this._effect)}</span>
          <span class="rule-token rule-token--accent">${t}</span>
        </div>
      </div>
    `}_clauseLabel(e){const t=this.card._weatherAttributes.find(t=>t.key===e.variable),i=t?je(e.variable):this._sensorFriendlyName(e.variable),a=t?.unit||"";return`${i} ${e.op} ${e.value}${a}`}_sensorFriendlyName(e){const t=this.card._sensorEntities?.find(t=>t.entity_id===e);return t?.friendly_name||e}_numericSensors(){return(this.card._sensorEntities||[]).filter(e=>{if(e.unit_of_measurement)return!0;const t=parseFloat(e.state);return Number.isFinite(t)})}_renderIfSection(e){return j`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.if.title")}</h3><p class="card__sub">${Ve("wr.if.subtitle.and")}</p></div></div>
          <div class="col" style="gap:14px">
            ${this._clauses.map((t,i)=>this._renderClause(t,i,e))}
            <button class="btn btn--sm" style="align-self:flex-start"
              @click=${()=>{this._clauses=[...this._clauses,{variable:"temperature",op:">",value:"22"}]}}>
              ${be("plus",12)} ${Ve("wr.if.add_and")}
            </button>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `}_renderClause(e,t,i){const a=i.find(t=>t.key===e.variable),s=this._numericSensors(),r=!a&&/^[\w]+\./.test(e.variable);return j`
      <div class="card card--ghost" style="padding:12px 14px">
        <div class="sp-between" style="margin-bottom:10px">
          <span class="text-xs text-mute mono">${Ve(0===t?"wr.if.first":"wr.if.and")}</span>
          ${this._clauses.length>1?j`
            <button class="btn btn--icon btn--ghost btn--sm" title="${Ve("common.remove")}"
              @click=${()=>{this._clauses=this._clauses.filter((e,i)=>i!==t)}}>
              ${be("close",12)}
            </button>
          `:J}
        </div>
        <div class="col" style="gap:10px">
          <div class="grid-2 wr-vars">
            ${i.map(i=>j`
              <button class="tile-pick" data-selected="${e.variable===i.key}"
                @click=${()=>this._setClauseVariable(t,i.key)} style="padding:10px">
                <div class="row" style="gap:8px">
                  <div class="tile-pick__icon" style="width:28px;height:28px">${be(i.icon,14)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name" style="font-size:12.5px">${je(i.key,i.label)}</div>
                    <div class="tile-pick__desc mono" style="font-size:10.5px">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                  </div>
                </div>
              </button>
            `)}
          </div>
          ${this._renderSensorSelect(e,t,s,r)}
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${Ve("wr.op")}</label>
              <select class="select mono" @change=${e=>this._patchClause(t,{op:e.target.value})}>
                ${"enum"===a?.type?j`
                      <option value="==" ?selected=${"=="===e.op}>${Ve("wr.op.eq")} (==)</option>
                      <option value="!=" ?selected=${"!="===e.op}>${Ve("wr.op.neq")} (!=)</option>`:j`
                      <option value=">" ?selected=${">"===e.op}>&gt;</option>
                      <option value=">=" ?selected=${">="===e.op}>&ge;</option>
                      <option value="<" ?selected=${"<"===e.op}>&lt;</option>
                      <option value="<=" ?selected=${"<="===e.op}>&le;</option>
                      <option value="==" ?selected=${"=="===e.op}>=</option>
                      <option value="!=" ?selected=${"!="===e.op}>≠</option>`}
              </select>
            </div>
            <div class="field">
              <label class="field__label">${Ve("wr.threshold")}</label>
              ${"enum"===a?.type?j`<select class="select" @change=${e=>this._patchClause(t,{value:e.target.value})}>
                    ${(a.options||[]).map(t=>j`<option value="${t}" ?selected=${e.value===t}>${t}</option>`)}
                  </select>`:j`<input class="input mono" .value=${e.value}
                    @input=${e=>this._patchClause(t,{value:e.target.value})}/>`}
            </div>
          </div>
        </div>
      </div>
    `}_renderSensorSelect(e,t,i,a){const s=this._sensorSearch.trim().toLowerCase(),r=s?i.filter(t=>{if(t.entity_id===e.variable)return!0;return`${t.friendly_name||""} ${t.entity_id||""} ${t.unit_of_measurement||""}`.toLowerCase().includes(s)}):i;return j`
      <div class="field">
        <label class="field__label">${Ve("wr.if.sensor.label")}</label>
        <div class="row" style="gap:6px;align-items:center">
          <input class="input" type="search" .value=${this._sensorSearch}
            placeholder="${Ve("wr.if.sensor.search")}"
            @input=${e=>{this._sensorSearch=e.target.value}}
            style="flex:1"/>
          ${this._sensorSearch?j`
            <button class="btn btn--icon btn--ghost btn--sm" title="${Ve("common.remove")}"
              @click=${()=>{this._sensorSearch=""}}>
              ${be("close",12)}
            </button>
          `:J}
        </div>
        <select class="select mono" style="margin-top:6px"
          @change=${e=>{const i=e.target.value;i&&this._setClauseVariable(t,i)}}>
          <option value="" ?selected=${!a}>${Ve("wr.if.sensor.none")}</option>
          ${r.map(t=>j`
            <option value="${t.entity_id}" ?selected=${e.variable===t.entity_id}>
              ${t.friendly_name||t.entity_id}${t.unit_of_measurement?` (${t.unit_of_measurement})`:""} — ${t.entity_id}
            </option>
          `)}
          ${s&&!r.length?j`<option disabled>${Ve("wr.if.sensor.no_match")}</option>`:J}
        </select>
        <span class="field__hint">${Ve("wr.if.sensor.hint")}</span>
      </div>
    `}_setClauseVariable(e,t){this._patchClause(e,{variable:t});const i=this.card._weatherAttributes.find(e=>e.key===t);if("enum"===i?.type){const t=this._clauses[e];"=="!==t.op&&"!="!==t.op&&this._patchClause(e,{op:"=="})}}_patchClause(e,t){this._clauses=this._clauses.map((i,a)=>a===e?{...i,...t}:i)}_renderScaleVarSection(e){const t=e.find(e=>e.key===this._scaleVar);return j`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.scale.input.title")}</h3><p class="card__sub">${Ve("wr.scale.input.subtitle")}</p></div></div>
          <div class="col" style="gap:12px">
            <div class="field">
              <label class="field__label">${Ve("wr.scale.var")}</label>
              <select class="select mono" @change=${e=>{this._scaleVar=e.target.value}}>
                ${e.filter(e=>"number"===e.type).map(e=>j`
                  <option value="${e.key}" ?selected=${this._scaleVar===e.key}>${je(e.key,e.label)}${e.unit?` (${e.unit})`:""}</option>
                `)}
              </select>
            </div>
            <div class="grid-2">
              <div class="field">
                <label class="field__label">${Ve("wr.scale.var_min")} ${t?.unit?j`<span class="text-mute">(${t.unit})</span>`:J}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMin)}
                  @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleVarMin=t)}}/>
              </div>
              <div class="field">
                <label class="field__label">${Ve("wr.scale.var_max")} ${t?.unit?j`<span class="text-mute">(${t.unit})</span>`:J}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMax)}
                  @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleVarMax=t)}}/>
              </div>
            </div>
            <span class="field__hint">${Ve("wr.scale.input.hint")}</span>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `}_renderEffectCard(){return j`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.effect_params.title")}</h3><p class="card__sub">${Ve("wr.effect."+this._effect+".desc")}</p></div></div>
        ${this._renderEffectParams(tt(this._contextSchedule()?.device_type||"thermostat"))}
      </div>
    `}_firstTargetBlock(){const e=this._targets[0],t=e?this._scheduleFor(e.schedule_id):void 0;return{sched:t,block:t&&e&&null!==e.block_index&&void 0!==e.block_index&&t.blocks[e.block_index]||null}}_renderEffectParams(e){const t=this._effect;if("skip"===t)return j`<p class="text-sm text-mute" style="margin:0">${Ve("wr.effect.skip.desc")}</p>`;if("shift"===t)return j`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${Ve("wr.delta")} (${Ve("common.min")})</label>
            <input type="number" class="input mono" step="5" .value=${String(this._deltaMin)}
              @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._deltaMin=t)}}
              placeholder="${Ve("wr.delta.placeholder")}"/>
          </div>
          ${this._renderFireMode()}
        </div>
      `;if("extend"===t||"shrink"===t)return j`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${Ve("wr.delta")} (${Ve("common.min")})</label>
            <input type="number" class="input mono" step="5" min="1" .value=${String(this._deltaMin)}
              @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._deltaMin=t)}}/>
          </div>
          ${this._renderDirection()}
          ${this._renderFireMode()}
        </div>
      `;if("force_action"===t){const t=e.find(e=>e.id===this._actionId);return j`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${Ve("wr.action.force")}</label>
            <select class="select" @change=${t=>this._setForceAction(t.target.value,e)}>
              <option value="" ?selected=${!this._actionId}>—</option>
              ${e.map(e=>{const t=this._contextSchedule()?.device_type||"thermostat";return j`<option value="${e.id}" ?selected=${this._actionId===e.id}>${Ue(t,e.id,e.label)}</option>`})}
            </select>
          </div>
          ${t?.value?this._renderValueField(t,this._actionValue,e=>{this._actionValue=e}):J}
          ${this._renderFireMode()}
        </div>
      `}if("replace_value"===t){const{block:t}=this._firstTargetBlock();if(!t)return j`<p class="text-sm text-mute" style="margin:0">${Ve("wr.replace_value.pick_block")}</p>`;const i=e.find(e=>e.id===t.action?.id);return i?.value?j`
        <div class="col" style="gap:10px">
          ${this._renderValueField(i,this._actionValue,e=>{this._actionValue=e})}
          ${this._renderFireMode()}
        </div>
      `:j`<p class="text-sm text-mute" style="margin:0">${Ve("wr.replace_value.no_value")}</p>`}if("scale_duration"===t)return j`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${Ve("wr.scale.out_min")} (${Ve("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMin)}
                @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._scaleOutMin=t)}}/>
            </div>
            <div class="field">
              <label class="field__label">${Ve("wr.scale.out_max")} (${Ve("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMax)}
                @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._scaleOutMax=t)}}/>
            </div>
          </div>
          ${this._renderDirection()}
        </div>
      `;if("scale_value"===t){const{block:t}=this._firstTargetBlock(),i=t?e.find(e=>e.id===t.action?.id):null,a=i?.value?.unit||"";return j`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${Ve("wr.scale.out_min")} ${a?j`<span class="text-mute">(${a})</span>`:J}</label>
              <input type="number" class="input mono" step="${i?.value?.step||1}" .value=${String(this._scaleOutMin)}
                @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleOutMin=t)}}/>
            </div>
            <div class="field">
              <label class="field__label">${Ve("wr.scale.out_max")} ${a?j`<span class="text-mute">(${a})</span>`:J}</label>
              <input type="number" class="input mono" step="${i?.value?.step||1}" .value=${String(this._scaleOutMax)}
                @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleOutMax=t)}}/>
            </div>
          </div>
        </div>
      `}return J}_renderDirection(){return j`
      <div class="field">
        <label class="field__label">${Ve("wr.direction.label")}</label>
        <div class="segmented">
          <button data-active="${"forward"===this._direction}" @click=${()=>{this._direction="forward"}}>${Ve("wr.direction.forward")}</button>
          <button data-active="${"backward"===this._direction}" @click=${()=>{this._direction="backward"}}>${Ve("wr.direction.backward")}</button>
        </div>
        <span class="field__hint">${Ve("wr.direction.hint")}</span>
      </div>
    `}_renderFireMode(){return j`
      <div class="field">
        <label class="field__label">${Ve("wr.fire_mode.label")}</label>
        <select class="select" @change=${e=>{this._fireMode=e.target.value}}>
          <option value="every" ?selected=${"every"===this._fireMode}>${Ve("wr.fire_mode.every")}</option>
          <option value="once_per_day" ?selected=${"once_per_day"===this._fireMode}>${Ve("wr.fire_mode.once_per_day")}</option>
          <option value="once_per_daytime" ?selected=${"once_per_daytime"===this._fireMode}>${Ve("wr.fire_mode.once_per_daytime")}</option>
          <option value="once_per_nighttime" ?selected=${"once_per_nighttime"===this._fireMode}>${Ve("wr.fire_mode.once_per_nighttime")}</option>
        </select>
      </div>
    `}_renderValueField(e,t,i){const a=e.value,s=t??a.default;return j`
      <div class="field">
        <label class="field__label">${a.label||Ve("common.value")} ${a.unit?j`<span class="text-mute">(${a.unit})</span>`:J}</label>
        ${"number"===a.type?j`
          <div class="row" style="gap:10px;align-items:center">
            <input type="range" min="${a.min}" max="${a.max}" step="${a.step}" .value=${String(s)}
              @input=${e=>i(parseFloat(e.target.value))}
              style="flex:1"/>
            <input type="number" class="input mono" min="${a.min}" max="${a.max}" step="${a.step}" .value=${String(s)}
              @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||i(t)}}
              style="width:90px;text-align:right;font-weight:600"/>
            <span class="mono text-mute" style="min-width:30px">${a.unit||""}</span>
          </div>
        `:"enum"===a.type?j`
          <select class="select" @change=${e=>i(e.target.value)}>
            ${(a.options||[]).map(e=>j`<option value="${e}" ?selected=${String(s)===e}>${e}</option>`)}
          </select>
        `:J}
      </div>
    `}_setForceAction(e,t){this._actionId=e;const i=t.find(t=>t.id===e);this._actionValue=i?.value?i.value.default??null:null}_initEffectDefaults(e){"force_action"===this._effect&&!this._actionId&&e.length&&this._setForceAction(e[0].id,e)}_findConflicts(e){const t=this._targets[0];if(!t||null===t.block_index||void 0===t.block_index)return[];const i=t.block_index,a=[];for(const t of this.card.rulesForSchedule(e.id))if(t.active&&!(t.id&&t.id===this.card._editingRuleId||t.block_index!==i&&null!==t.block_index&&void 0!==t.block_index)){const e=e=>e.startsWith("scale_")||"extend"===e||"shrink"===e;(t.effect===this._effect||t.effect&&e(t.effect)&&e(this._effect))&&a.push(`${t.if||"(no condition)"} → ${Ve("wr.effect."+(t.effect||"skip"))}`)}return a}_buildThenText(){const e=this._effect;return"skip"===e?Ve("wr.action.skip"):"shift"===e?`${this._deltaMin>0?"+":""}${this._deltaMin} ${Ve("common.min")}`:"extend"===e?`+${this._deltaMin} ${Ve("common.min")} ${Ve("wr.direction."+this._direction).toLowerCase()}`:"shrink"===e?`-${this._deltaMin} ${Ve("common.min")} ${Ve("wr.direction."+this._direction).toLowerCase()}`:"force_action"===e?`${Ve("wr.action.force")}: ${this._actionId}${null!==this._actionValue?` = ${this._actionValue}`:""}`:"replace_value"===e?`${Ve("wr.effect.replace_value")} = ${this._actionValue}`:"scale_duration"===e?`${this._scaleOutMin}-${this._scaleOutMax} ${Ve("common.min")} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`:"scale_value"===e?`${this._scaleOutMin}-${this._scaleOutMax} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`:""}async _saveRule(e,t){if(this._isValueEffect()){const t=e.device_type;if(this._targets.some(e=>this._scheduleFor(e.schedule_id)?.device_type!==t))return void alert(Ve("wr.targets.incompatible.alert"))}if(!this._targets.length)return;const i=this._buildIfText(),a=this._buildThenText(),s=this.card._editingRuleId,r=s?this.card._rules.find(e=>e.id===s):void 0,n={...s?{id:s}:{},active:r?.active??!0,if:i,then:a,effect:this._effect,targets:this._targets.map(e=>({schedule_id:e.schedule_id,block_index:e.block_index??null}))};"shift"!==this._effect&&"extend"!==this._effect&&"shrink"!==this._effect||(n.delta_minutes=Math.abs(this._deltaMin),n.direction=this._direction),"force_action"===this._effect&&(n.action_id=this._actionId,null!==this._actionValue&&(n.action_value=this._actionValue),n.fire_mode=this._fireMode),"replace_value"===this._effect&&(null!==this._actionValue&&(n.action_value=this._actionValue),n.fire_mode=this._fireMode),"scale_duration"!==this._effect&&"scale_value"!==this._effect||(n.scale_var=this._scaleVar,n.scale_var_min=this._scaleVarMin,n.scale_var_max=this._scaleVarMax,n.scale_out_min=this._scaleOutMin,n.scale_out_max=this._scaleOutMax,"scale_duration"===this._effect&&(n.direction=this._direction)),await this.card.doSaveRule(n),this.card.navigate("weatherRulesList")}_hydrate(){const e=this.card._editingRuleId,t=e||`new:${this.card._selectedId}`;if(this._hydratedFor===t)return;if(this._hydratedFor=t,!e){const e=this.card._selectedId||this.card._schedules[0]?.id||"";return this._targets=e?[{schedule_id:e,block_index:null}]:[],this._effect="skip",this._clauses=[{variable:"temperature",op:">",value:"22"}],this._deltaMin=30,this._direction="forward",this._actionId="",this._actionValue=null,this._fireMode="once_per_daytime",this._scaleVar="temperature",this._scaleVarMin=25,this._scaleVarMax=35,this._scaleOutMin=30,void(this._scaleOutMax=120)}const i=this.card._rules.find(t=>t.id===e);if(i){if(this._effect=i.effect||"skip",this._targets=(i.targets||[]).map(e=>({schedule_id:e.schedule_id,block_index:e.block_index??null})),!this._targets.length){const e=this.card._selectedId||this.card._schedules[0]?.id||"";this._targets=e?[{schedule_id:e,block_index:null}]:[]}if(i.if){const e=this._parseIfExpression(String(i.if));e.length&&(this._clauses=e)}void 0!==i.delta_minutes&&(this._deltaMin=i.delta_minutes),i.direction&&(this._direction=i.direction),i.action_id&&(this._actionId=i.action_id),this._actionValue=void 0!==i.action_value?i.action_value:null,i.fire_mode&&(this._fireMode=i.fire_mode),i.scale_var&&(this._scaleVar=i.scale_var),void 0!==i.scale_var_min&&(this._scaleVarMin=i.scale_var_min),void 0!==i.scale_var_max&&(this._scaleVarMax=i.scale_var_max),void 0!==i.scale_out_min&&(this._scaleOutMin=i.scale_out_min),void 0!==i.scale_out_max&&(this._scaleOutMax=i.scale_out_max)}}_parseIfExpression(e){const t=[],i=e.split(/\s+AND\s+/i);for(const e of i){const i=e.trim().match(/^([\w.]+)\s*(>=|<=|!=|==|>|<)\s*(.*?)$/);if(!i)continue;const a=i[3].replace(/[^0-9.\-+a-zA-Z_]/g,"");t.push({variable:i[1],op:i[2],value:a})}return t}_buildIfText(){return Et.find(e=>e.key===this._effect)?.needsIf?this._clauses.filter(e=>e.variable&&e.op&&""!==e.value).map(e=>{const t=this.card._weatherAttributes.find(t=>t.key===e.variable),i=t?.unit||"";return`${e.variable} ${e.op} ${e.value}${i}`}).join(" AND "):""}};Dt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Dt.prototype,"card",void 0),e([me({type:Number})],Dt.prototype,"nowHour",void 0),e([fe()],Dt.prototype,"_targets",void 0),e([fe()],Dt.prototype,"_effect",void 0),e([fe()],Dt.prototype,"_sensorSearch",void 0),e([fe()],Dt.prototype,"_clauses",void 0),e([fe()],Dt.prototype,"_deltaMin",void 0),e([fe()],Dt.prototype,"_direction",void 0),e([fe()],Dt.prototype,"_actionId",void 0),e([fe()],Dt.prototype,"_actionValue",void 0),e([fe()],Dt.prototype,"_fireMode",void 0),e([fe()],Dt.prototype,"_scaleVar",void 0),e([fe()],Dt.prototype,"_scaleVarMin",void 0),e([fe()],Dt.prototype,"_scaleVarMax",void 0),e([fe()],Dt.prototype,"_scaleOutMin",void 0),e([fe()],Dt.prototype,"_scaleOutMax",void 0),Dt=e([pe("chronos-weather-rule")],Dt);let Nt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._filterSchedId="",this._sortMode="manual",this._dragFrom=-1,this._dragOver=-1}render(){const e=this.card._rules,t=e.filter(e=>e.active).length,i=this.card._schedules.filter(t=>e.some(e=>(e.targets||[]).some(e=>e.schedule_id===t.id))),a=this._filterSchedId&&i.some(e=>e.id===this._filterSchedId);let s=a?e.filter(e=>(e.targets||[]).some(e=>e.schedule_id===this._filterSchedId)):[...e];"schedule"===this._sortMode?s.sort((e,t)=>this._schedKey(e).localeCompare(this._schedKey(t))||this._alphaKey(e).localeCompare(this._alphaKey(t))):"alpha"===this._sortMode&&s.sort((e,t)=>this._alphaKey(e).localeCompare(this._alphaKey(t)));const r="manual"===this._sortMode&&!a;return j`
      <div class="col" style="gap:22px">
        <div class="sp-between" style="flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${Ve("nav.weather_rules")}</h1>
            <p class="page-sub">${e.length} · ${t} ${Ve("schedule.active").toLowerCase()}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <label class="row" style="gap:6px;align-items:center">
              <span class="text-mute" style="display:inline-flex">${be("sort",14)}</span>
              <select class="select" @change=${e=>{this._sortMode=e.target.value}}>
                <option value="manual" ?selected=${"manual"===this._sortMode}>${Ve("wrl.sort.manual")}</option>
                <option value="schedule" ?selected=${"schedule"===this._sortMode}>${Ve("wrl.sort.schedule")}</option>
                <option value="alpha" ?selected=${"alpha"===this._sortMode}>${Ve("wrl.sort.alpha")}</option>
              </select>
            </label>
            ${i.length>1?j`
              <select class="select" style="max-width:220px"
                @change=${e=>{this._filterSchedId=e.target.value}}>
                <option value="" ?selected=${!a}>${Ve("wrl.filter.all")}</option>
                ${i.map(e=>j`
                  <option value="${e.id}" ?selected=${this._filterSchedId===e.id}>${e.name}</option>
                `)}
              </select>
            `:J}
            <button class="btn btn--primary" @click=${()=>this.card.navigate("weatherRule")}>
              ${be("plus",14)} ${Ve("editor.weather_rules.add")}
            </button>
          </div>
        </div>

        ${"manual"===this._sortMode&&a?j`
          <div class="text-xs text-mute" style="margin:-8px 0 0">${be("info",11)} ${Ve("wrl.manual.filter_hint")}</div>
        `:J}

        ${e.length?j`
          <div class="card">
            <div class="col" style="gap:0">
              ${s.map((e,t)=>this._renderRule(e,t,s.length,r))}
            </div>
          </div>
        `:j`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${be("cloud",22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("editor.weather_rules.empty")}</div>
          </div>
        `}
      </div>
    `}_schedKey(e){const t=(e.targets||[])[0];if(!t)return"￿";const i=this.card._schedules.find(e=>e.id===t.schedule_id);return(i?.name||t.schedule_id).toLowerCase()}_alphaKey(e){return(e.then||e.if||"").toLowerCase()}_renderRule(e,t,i,a){const s=e.targets||[],r=this._dragFrom===t,n=this._dragOver===t&&this._dragFrom!==t;return j`
      <div class="rule-block ${n?"rule-block--dragover":""}"
        style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:12px 10px;cursor:pointer;${r?"opacity:0.4":""}"
        draggable=${a?"true":"false"}
        @dragstart=${a?e=>this._onDragStart(e,t):null}
        @dragover=${a?e=>this._onDragOver(e,t):null}
        @drop=${a?e=>this._onDrop(e,t):null}
        @dragend=${a?()=>{this._dragFrom=-1,this._dragOver=-1}:null}
        @click=${()=>this.card.editWeatherRule(e.id)}>
        ${a?j`
          <span class="rule-grip" title="${Ve("wrl.manual.drag")}" @click=${e=>e.stopPropagation()}
            style="cursor:grab;color:var(--text-muted);display:inline-flex;align-items:center">${be("grip",14)}</span>
          <div class="col" style="gap:0" @click=${e=>e.stopPropagation()}>
            <button class="btn btn--icon btn--ghost" style="height:16px;padding:0" title="${Ve("wrl.manual.up")}"
              ?disabled=${0===t} @click=${()=>this._move(t,-1)}>${be("chevron-up",12)}</button>
            <button class="btn btn--icon btn--ghost" style="height:16px;padding:0" title="${Ve("wrl.manual.down")}"
              ?disabled=${t===i-1} @click=${()=>this._move(t,1)}>${be("chevron-down",12)}</button>
          </div>
        `:J}
        ${s.length?s.map(e=>{const t=this.card._schedules.find(t=>t.id===e.schedule_id),i=null!==e.block_index&&void 0!==e.block_index?` · #${e.block_index+1}`:"";return j`
            <span class="chip chip--accent" style="flex:0 0 auto;max-width:200px" title="${t?.name||e.schedule_id}${i}">
              ${t?we(t.device_type,11):J}
              <span class="truncate" style="max-width:150px;display:inline-block;vertical-align:middle">${t?.name||e.schedule_id}</span>${i}
            </span>
          `}):j`
          <span class="chip" style="flex:0 0 auto;background:color-mix(in srgb, var(--warn) 16%, transparent);color:var(--warn);border-color:color-mix(in srgb, var(--warn) 35%, transparent)">
            ${be("info",11)} ${Ve("wrl.unassigned")}
          </span>
        `}
        ${e.if?j`
          <span class="rule-block__label rule-block__label--if">IF</span>
          <span class="rule-token rule-token--weather">${e.if}</span>
        `:J}
        <span class="rule-block__label rule-block__label--then">${Ve("wr.effect."+(e.effect||"skip"))}</span>
        <span class="rule-token rule-token--accent">${e.then}</span>
        <div style="flex:1"></div>
        <label class="switch" @click=${e=>e.stopPropagation()}>
          <input type="checkbox" .checked=${e.active}
            @change=${t=>this.card.toggleRuleActive(e.id,t.target.checked)}/>
          <span class="switch__track"></span>
          <span class="switch__thumb"></span>
        </label>
        <button class="btn btn--sm" @click=${t=>{t.stopPropagation(),this.card.editWeatherRule(e.id)}}
          title="${Ve("common.edit")}">
          ${be("edit",12)} ${Ve("common.edit")}
        </button>
        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
          @click=${t=>{t.stopPropagation(),this._deleteRule(e)}}
          title="${Ve("common.remove")}">
          ${be("trash",12)}
        </button>
      </div>
    `}_onDragStart(e,t){this._dragFrom=t,e.dataTransfer&&(e.dataTransfer.effectAllowed="move")}_onDragOver(e,t){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._dragOver!==t&&(this._dragOver=t)}_onDrop(e,t){e.preventDefault();const i=this._dragFrom;this._dragFrom=-1,this._dragOver=-1,i<0||i===t||this._reorder(i,t)}_move(e,t){const i=e+t;i<0||i>=this.card._rules.length||this._reorder(e,i)}_reorder(e,t){const i=this.card._rules.map(e=>e.id),[a]=i.splice(e,1);i.splice(t,0,a),this.card.reorderRules(i)}async _deleteRule(e){const t=(e.targets||[]).length,i=t>1?Ve("wrl.delete.shared",{n:t}):`${Ve("common.remove")}: ${e.if||""} → ${e.then}?`;confirm(i)&&await this.card.doRemoveRule(e.id)}};Nt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Nt.prototype,"card",void 0),e([me({type:Number})],Nt.prototype,"nowHour",void 0),e([fe()],Nt.prototype,"_filterSchedId",void 0),e([fe()],Nt.prototype,"_sortMode",void 0),e([fe()],Nt.prototype,"_dragFrom",void 0),e([fe()],Nt.prototype,"_dragOver",void 0),Nt=e([pe("chronos-weather-rules-list")],Nt);let Bt=class extends ce{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._devices.find(e=>e.id===this.card._deviceDetailId)||this.card._devices[0];if(!e)return j`<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-weight:600;font-size:14px">${Ve("device.no_device.title")}</div>
      <div style="font-size:12.5px;margin-top:4px">${Ve("device.no_device.hint")}</div>
    </div>`;const t=xt[e.type]||{label:e.type,domain:"",capabilities:[]},i=this.card._schedules.filter(t=>t.device_ids.includes(e.id)),a=this.card.hass?.states?.[e.entity_id],s=a?.state||"—";return j`
      <div class="col" style="gap:18px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${be("chevron-left",14)} ${Ve("common.back")}
          </button>
        </div>

        <div class="row" style="gap:16px">
          <div style="width:60px;height:60px;border-radius:16px;background:${qe(e,a,this.card._settings).soft};color:${qe(e,a,this.card._settings).accent};display:grid;place-items:center">
            ${we(e.type,28)}
          </div>
          <div style="flex:1">
            <h1 class="page-title" style="margin-bottom:2px">${e.alias}</h1>
            <p class="page-sub mono" style="margin-bottom:0">${e.entity_id} · ${e.area}</p>
          </div>
          <select class="select" style="width:240px"
            @change=${e=>this.card.selectDevice(e.target.value)}>
            ${this.card._devices.map(t=>j`<option value="${t.id}" ?selected=${t.id===e.id}>${t.alias}</option>`)}
          </select>
        </div>

        <div class="grid-3">
          <div class="kpi"><div class="kpi__label">${Ve("device.state")}</div><div class="kpi__value">${s}</div><div class="kpi__delta">${Ve("device.state.live")}</div></div>
          <div class="kpi"><div class="kpi__label">${Ve("device.type")}</div><div class="kpi__value" style="font-size:20px">${Ze(e.type,t.label)}</div><div class="kpi__delta mono">${t.domain}</div></div>
          <div class="kpi"><div class="kpi__label">${Ve("device.linked_schedules")}</div><div class="kpi__value">${i.length}</div><div class="kpi__delta">${Ve("device.linked_schedules.active",{n:i.filter(e=>e.enabled).length})}</div></div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("device.capabilities")}</h3><p class="card__sub">${Ve("device.capabilities.subtitle")}</p></div></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${(t.capabilities||[]).map(e=>j`<span class="rule-token mono">${t.domain}.${e}</span>`)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("device.schedules_using.title")}</h3><p class="card__sub">${Ve("device.schedules_using.subtitle",{n:i.length})}</p></div></div>
          ${i.length?j`<div class="col" style="gap:10px">
                ${i.map(e=>{const t=this.card.rulesForSchedule(e.id).filter(e=>e.active);return j`
                  <div class="card card--ghost" style="padding:14px">
                    <div class="sp-between" style="margin-bottom:8px">
                      <div>
                        <div class="fw-600">${e.name}</div>
                        <div class="text-xs text-mute mono">${kt(e.days)}</div>
                      </div>
                      <div class="row" style="gap:8px">
                        ${t.length?j`<span class="chip chip--weather">${be("cloud",11)} ${Ve("overview.rules_count",{n:t.length})}</span>`:J}
                        <button class="btn btn--sm" @click=${()=>this.card.selectSchedule(e.id,"editor")}>${Ve("device.open_schedule")} ${be("chevron-right",12)}</button>
                      </div>
                    </div>
                    <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${e.enabled?this.nowHour:null}></chronos-timeline>
                    ${t.length?j`
                      <div class="col" style="gap:6px;margin-top:10px;border-top:1px dashed var(--border-soft);padding-top:10px">
                        ${t.map(e=>j`
                          <div class="row" style="gap:6px;flex-wrap:wrap">
                            <span style="color:var(--text-muted);display:inline-flex">${be("cloud",11)}</span>
                            ${e.if?j`<span class="rule-token rule-token--weather">${e.if}</span>`:J}
                            <span class="rule-token rule-token--accent">${e.then}</span>
                          </div>
                        `)}
                      </div>
                    `:J}
                  </div>
                `})}
              </div>`:j`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("device.no_schedules")}</div>
                <div style="font-size:12.5px;margin-top:4px">${Ve("device.no_schedules.hint")}</div>
              </div>`}
        </div>
      </div>
    `}};Bt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Bt.prototype,"card",void 0),e([me({type:Number})],Bt.prototype,"nowHour",void 0),Bt=e([pe("chronos-device-screen")],Bt);let Rt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._filter=null}render(){const{_schedules:e}=this.card,t=e.filter(e=>e.enabled),i=t.length,a=this._filter,s=a?t.filter(e=>a.has(e.id)):t,r=(new Date).getDay(),n=0===r?6:r-1,o=wt();return j`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${Ve("screen.week.title")}</h1>
          <p class="page-sub">${Ve("week.subtitle",{n:i})}</p>
        </div>

        ${t.length?j`
          <div class="card" style="padding:14px">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div class="fw-600 text-sm">${Ve("week.filter.title")}</div>
              <div class="row" style="gap:6px">
                <button class="btn btn--sm" @click=${()=>{this._filter=null}}>
                  ${Ve("editor.days.all")}
                </button>
                <button class="btn btn--sm" @click=${()=>{this._filter=new Set}}>
                  ${Ve("common.none")}
                </button>
              </div>
            </div>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              ${t.map(e=>{const t=!a||a.has(e.id);return j`
                  <button class="chip"
                    style="cursor:pointer;background:${t?"var(--accent-soft)":"var(--bg-sunken)"};color:${t?"var(--accent-ink)":"var(--text-muted)"};border:1px solid ${t?"transparent":"var(--border-soft)"}"
                    @click=${()=>this._toggleFilter(e.id)}>
                    ${t?be("check",11):J} ${e.name}
                  </button>
                `})}
            </div>
          </div>
        `:J}

        <div class="card">
          <div class="weekgrid">
            <div class="weekgrid__row" style="margin-bottom:6px">
              <div></div>
              <div style="position:relative;height:18px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
                ${[0,4,8,12,16,20,24].map(e=>j`
                  <span style="position:absolute;left:${e/24*100}%;transform:translateX(-50%)">${String(e).padStart(2,"0")}</span>
                `)}
              </div>
            </div>
            ${o.map((e,t)=>{const i=s.filter(e=>e.days[t]);return j`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${t===n?"var(--accent)":""}">
                  ${e}${t===n?j`<span style="display:block;font-size:9px;margin-top:2px">${Ve("week.today").toUpperCase()}</span>`:J}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${i.map(e=>j`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500;cursor:pointer" class="truncate"
                          @click=${()=>this.card.selectSchedule(e.id,"editor")}>${e.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="mini" .showWeather=${!1}
                            .now=${t===n?this.nowHour:null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${i.length?J:j`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">—</div>`}
                  </div>
                </div>
              </div>
            `})}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(Ke).map(([e,t])=>{const i={on:Ve("schedule.active"),off:Ve("schedule.disabled"),set:Ve("common.value"),preset:"Preset",cmd:Ve("editor.block.action")};return j`
              <div class="row" style="gap:6px">
                <span style="width:12px;height:8px;border-radius:2px;background:${t}"></span>
                <span class="text-xs">${i[e]}</span>
              </div>
            `})}
        </div>
      </div>
    `}_toggleFilter(e){const t=this._filter??new Set(this.card._schedules.filter(e=>e.enabled).map(e=>e.id)),i=new Set(t);i.has(e)?i.delete(e):i.add(e);const a=this.card._schedules.filter(e=>e.enabled);this._filter=i.size===a.length?null:i}};Rt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Rt.prototype,"card",void 0),e([me({type:Number})],Rt.prototype,"nowHour",void 0),e([fe()],Rt.prototype,"_filter",void 0),Rt=e([pe("chronos-week")],Rt);const Tt={sunny:0,"clear-night":0,partlycloudy:0,cloudy:1,fog:1,windy:1,"windy-variant":1,rainy:2,pouring:2,lightning:3,"lightning-rainy":3,hail:3,snowy:3,"snowy-rainy":3,exceptional:3},Ot=["var(--ok)","var(--warn)","#f97316","var(--danger)"];function qt(e,t){return"m/s"===t?3.6*e:"mph"===t?1.609*e:"kn"===t?1.852*e:e}function Ht(e,t){let i=Tt[e]??1;return null!==t&&(t>=70?i=Math.max(i,3):t>=50?i=Math.max(i,2):t>=30&&(i=Math.max(i,1))),i}let Pt=class extends ce{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t,_forecast:i,_settings:a}=this.card,s=a?.weather_entity||"",r=s?this.card.hass?.states?.[s]:null,n=r?.attributes?.temperature??"—",o=r?.attributes?.temperature_unit||"°C",l=r?.state||"cloud",d=r?.attributes?.humidity??"—",c=r?.attributes?.wind_speed??"—",u=r?.attributes?.wind_speed_unit||"km/h",p=Ot[Ht(l,"number"==typeof c?qt(c,u):null)],h=((new Date).getDay()+6)%7,v=e.filter(e=>e.enabled).map(e=>{const t=!!(e.days?.[h]??1)&&this._inDateRange(e),i=t?e.blocks.find(e=>{const t=yt(e,"start"),i=yt(e,"end");return this.nowHour>=t&&this.nowHour<i}):void 0;return{schedule:e,active:i,today:t}});return j`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${Ve("screen.live.title")}</h1>
            <p class="page-sub">${s?Ve("live.weather.subtitle",{entity:s}):Ve("live.no_weather")}</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>${Ve("schedule.active")}</span>
          </div>
        </div>

        <!-- Weather hero -->
        <div class="grid-2">
          <div class="weather-hero">
            <div class="weather-hero__icon" style="color:${p};background:color-mix(in srgb, ${p} 16%, var(--surface))">${ke(l,32)}</div>
            <div>
              <div class="weather-hero__temp">${n}<span style="font-size:16px;color:var(--text-muted)">${o}</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(l)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${be("droplet",11)} ${d}%</span>
              <span class="chip">${be("wind",11)} ${c} ${u}</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.forecast.title")}</h3><p class="card__sub">${Ve("live.forecast.title")}</p></div></div>
            <div class="forecast-row">
              ${i.filter((e,t)=>t%2==0).slice(0,12).map(e=>{const t=new Date(e.datetime||"").getHours?.()??0,i=e.condition||"cloud",a="number"==typeof e.wind_speed?e.wind_speed:null,s=Ht(i,null!==a?qt(a,u):null),r=Ot[s];return j`
                  <div class="forecast-cell"
                    style="background:color-mix(in srgb, ${r} 10%, var(--bg-sunken));border-color:color-mix(in srgb, ${r} 30%, transparent)"
                    title="${this._conditionLabel(i)}${null!==a?` · ${Math.round(a)} ${u}`:""}">
                    <div class="forecast-cell__hour">${String(t).padStart(2,"0")}</div>
                    <div class="forecast-cell__icon" style="color:${r}">${ke(i,20)}</div>
                    <div class="forecast-cell__temp">${e.temperature??"—"}°</div>
                    ${null!==a?j`<div class="forecast-cell__wind">${be("wind",9)} ${Math.round(a)}</div>`:J}
                  </div>
                `})}
            </div>
          </div>
        </div>

        <!-- Live schedules -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.schedules.title")}</h3><p class="card__sub">${v.filter(e=>e.active).length}</p></div></div>
          <div class="col" style="gap:12px">
            ${v.map(({schedule:e,active:t,today:i})=>j`
              <div class="card card--ghost" style="padding:14px;opacity:${i?1:.65}">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${t?"var(--ok)":"var(--text-muted)"};box-shadow:${t?"0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)":"none"}"></span>
                    <strong>${e.name}</strong>
                    ${t?j`<span class="chip chip--accent">${at(e.device_type,t.action)}</span>`:j`<span class="chip">${Ve(i?"schedule.next_block":"live.not_today")}</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                    ${Ve("device.open_schedule")} ${be("chevron-right",12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${i?this.nowHour:null}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.devices.title")}</h3><p class="card__sub">${Ve("live.devices.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${t.map(e=>{const t=this.card.hass?.states?.[e.entity_id],i=qe(e,t,this.card._settings),a=this._computeBarPercent(e,t);return j`
                <div class="live-device">
                  <div class="device-row__icon" style="width:36px;height:36px;background:${i.soft};color:${i.accent}">${we(e.type,17)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.alias}</div>
                    <div class="device-row__meta">${e.area}</div>
                  </div>
                  <div class="live-device__bar"><div style="width:${a}%;background:${i.accent}"></div></div>
                  <span class="mono text-sm" style="width:64px;text-align:right;color:${i.live?i.accent:"var(--text-muted)"};font-weight:600">${this._formatState(e,t)}</span>
                </div>
              `})}
          </div>
        </div>
      </div>
    `}_inDateRange(e){const t=e.date_range;if(!t)return!0;const i=t.start_month,a=t.start_day,s=t.end_month,r=t.end_day;if(!(i&&a&&s&&r))return!0;const n=new Date,o=100*(n.getMonth()+1)+n.getDate(),l=100*i+a,d=100*s+r;return l<=d?l<=o&&o<=d:o>=l||o<=d}_computeBarPercent(e,t){if(!t)return 0;const i=t.attributes||{};if("light"===e.type){const e=i.brightness;return"number"==typeof e?Math.round(e/255*100):"on"===t.state?100:0}if("fan"===e.type)return"number"==typeof i.percentage?i.percentage:0;if("blind"===e.type)return"number"==typeof i.current_position?i.current_position:0;if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return Math.min(100,Math.max(0,(e-5)/30*100))}return"on"===t.state||"open"===t.state?100:0}_formatState(e,t){if(!t)return"—";const i=t.attributes||{};if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return`${e.toFixed(1)}°`}return"fan"===e.type&&"number"==typeof i.percentage?`${i.percentage}%`:"blind"===e.type&&"number"==typeof i.current_position?`${i.current_position}%`:"light"===e.type&&"on"===t.state&&"number"==typeof i.brightness?`${Math.round(i.brightness/255*100)}%`:t.state}_conditionLabel(e){const t=`live.condition.${e}`,i=Ve(t);return i===t?e:i}};Pt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Pt.prototype,"card",void 0),e([me({type:Number})],Pt.prototype,"nowHour",void 0),Pt=e([pe("chronos-live")],Pt);let Lt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._step=0,this._name="",this._pickedDevices=[],this._specialMode="",this._days=[1,1,1,1,1,1,1],this._weatherEnabled=!0,this._blocks=[],this._blocksDeviceType="",this._selectedBlockIdx=-1,this._variant=null,this._dupPick="",this._importText="",this._importError=""}get _steps(){return[{key:"name",label:Ve("wizard.step.name")},{key:"device",label:Ve("wizard.step.devices")},{key:"time",label:Ve("wizard.step.time")},{key:"days",label:Ve("wizard.step.days")},{key:"weather",label:Ve("wizard.step.weather")},{key:"review",label:Ve("wizard.step.review")}]}render(){return j`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${be("chevron-left",14)} ${Ve("common.cancel")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${Ve("wizard.title")}</h1>
          <p class="page-sub">${Ve("wizard.subtitle")}</p>
        </div>

        <div class="wizard-stepper">
          ${this._steps.map((e,t)=>j`
            <div class="wizard-step" data-state="${t===this._step?"active":t<this._step?"done":"idle"}">
              <span class="wizard-step__num">${t<this._step?"✓":t+1}</span>
              <span>${e.label}</span>
            </div>
          `)}
        </div>

        <div class="card card--pad-lg">
          ${this._renderStepContent()}
        </div>

        <div class="row" style="justify-content:space-between">
          <button class="btn" ?disabled=${0===this._step} @click=${()=>{this._step=Math.max(0,this._step-1)}}
            style="opacity:${0===this._step?.4:1}">
            ${be("chevron-left",14)} ${Ve("common.back")}
          </button>
          ${this._step<this._steps.length-1?j`<button class="btn btn--primary" @click=${()=>{this._step++}}>
                ${Ve("common.next")} ${be("chevron-right",14)}
              </button>`:j`<button class="btn btn--primary" @click=${()=>this._finish()}>
                ${be("check",14)} ${Ve("wizard.create")}
              </button>`}
        </div>
      </div>
    `}_renderStepContent(){switch(this._step){case 0:return j`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.name.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.name.hint")}</p>
            <input class="input" .value=${this._name} @input=${e=>{this._name=e.target.value}}
              placeholder="${Ve("nav.new_schedule")}"
              style="font-size:18px;padding:12px 14px"/>

            ${this.card._schedules.length?j`
              <div style="border-top:1px dashed var(--border-soft);padding-top:14px">
                <div class="text-xs text-mute" style="margin-bottom:8px">${Ve("wizard.alt.heading")}</div>
                <div class="row" style="gap:8px;flex-wrap:wrap">
                  <select class="select" style="flex:1;min-width:200px"
                    @change=${e=>{this._dupPick=e.target.value}}>
                    ${this.card._schedules.map(e=>j`
                      <option value="${e.id}" ?selected=${this._dupPick===e.id}>${e.name}</option>
                    `)}
                  </select>
                  <button class="btn" @click=${()=>this.card.openDuplicateModal(this._dupPick||this.card._schedules[0].id)}>
                    ${be("copy",13)} ${Ve("dup.button")}
                  </button>
                </div>
              </div>
            `:J}

            <div style="border-top:1px dashed var(--border-soft);padding-top:14px">
              <div class="text-xs text-mute" style="margin-bottom:8px">${Ve("wizard.import.heading")}</div>
              <textarea class="input mono" .value=${this._importText}
                placeholder='{"chronos_export": 1, …}'
                @input=${e=>{this._importText=e.target.value,this._importError=""}}
                style="width:100%;min-height:72px;font-size:11.5px;font-family:var(--font-mono);resize:vertical"></textarea>
              <div class="row" style="gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
                <label class="btn btn--sm" style="cursor:pointer">
                  ${be("upload",12)} ${Ve("wizard.import.file")}
                  <input type="file" accept=".json,application/json" style="display:none"
                    @change=${e=>this._onImportFile(e)}/>
                </label>
                <button class="btn btn--sm btn--primary" ?disabled=${!this._importText.trim()}
                  @click=${()=>this._doImport()}>
                  ${be("check",12)} ${Ve("wizard.import.button")}
                </button>
                ${this._importError?j`<span class="text-xs" style="color:var(--danger)">${this._importError}</span>`:J}
              </div>
            </div>
          </div>
        `;case 1:{const e=this.card._devices.filter(e=>"scene"!==e.type&&"automation"!==e.type);return j`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.devices.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.devices.hint")}</p>
            <div class="grid-auto" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
              <button class="tile-pick" data-selected="${"scene"===this._specialMode}"
                @click=${()=>this._toggleSpecialMode("scene")}>
                <div class="row" style="gap:10px">
                  <div class="tile-pick__icon">${be("sun",16)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name truncate">${Ve("wizard.devices.scene_tile")}</div>
                    <div class="tile-pick__desc">${Ve("wizard.devices.scene_tile.desc")}</div>
                  </div>
                  ${"scene"===this._specialMode?be("check",16):J}
                </div>
              </button>
              <button class="tile-pick" data-selected="${"automation"===this._specialMode}"
                @click=${()=>this._toggleSpecialMode("automation")}>
                <div class="row" style="gap:10px">
                  <div class="tile-pick__icon">${be("wand",16)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name truncate">${Ve("wizard.devices.automation_tile")}</div>
                    <div class="tile-pick__desc">${Ve("wizard.devices.automation_tile.desc")}</div>
                  </div>
                  ${"automation"===this._specialMode?be("check",16):J}
                </div>
              </button>
              ${this._specialMode?J:e.map(e=>j`
                <button class="tile-pick" data-selected="${this._pickedDevices.includes(e.id)}"
                  title="${e.entity_id}"
                  @click=${()=>this._togglePick(e.id)}>
                  <div class="row" style="gap:10px">
                    <div class="tile-pick__icon">${we(e.type,16)}</div>
                    <div style="min-width:0;flex:1">
                      <div class="tile-pick__name truncate">${e.alias}</div>
                      <div class="tile-pick__desc">${e.area?j`${e.area} · `:J}${xt[e.type]?.label||e.type}</div>
                    </div>
                    ${this._pickedDevices.includes(e.id)?be("check",16):J}
                  </div>
                </button>
              `)}
            </div>
          </div>
        `}case 2:{const e=this._inferDeviceType();this._ensureBlocksFor(e);const t=this._selectedBlockIdx>=0?this._blocks[this._selectedBlockIdx]:void 0,i=t?.action?it(e,t.action.id):void 0,a=tt(e);return j`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.time.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("editor.add_block_hint")}</p>

            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
              <span class="text-xs text-mute">${Ve("editor.timeline_variant")}:</span>
              <div class="segmented">
                ${["linear","radial","list"].map(e=>j`
                  <button data-active="${this._effectiveVariant()===e}" @click=${()=>{this._variant=e}}>
                    ${Ve("timeline."+e)}
                  </button>
                `)}
              </div>
              <div style="flex:1"></div>
              <button class="btn btn--sm" @click=${()=>this._addBlock(e)}>
                ${be("plus",12)} ${Ve("common.add")}
              </button>
              <button class="btn btn--sm" @click=${()=>this._resetBlocks(e)}>
                ${be("repeat",12)} ${Ve("wizard.time.reset_preset")}
              </button>
            </div>

            <chronos-timeline
              variant="${this._effectiveVariant()}"
              .deviceType=${e}
              .interactive=${!0}
              .blocks=${this._blocks}
              .selectedIdx=${this._selectedBlockIdx}
              @blocks-changed=${e=>{this._blocks=e.detail.blocks}}
              @block-select=${e=>{this._selectedBlockIdx=e.detail.index}}
            ></chronos-timeline>

            ${t?j`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div>
                    <div class="text-xs text-mute mono">${Ve("wizard.time.selected")}</div>
                    <div class="fw-600 mono">${this._fmtBlockRange(t)}</div>
                  </div>
                  <button class="btn btn--sm" style="color:var(--danger)" @click=${()=>this._removeSelected()}>
                    ${be("trash",12)} ${Ve("editor.block.delete")}
                  </button>
                </div>
                <div class="field">
                  <label class="field__label">${Ve("editor.block.action")}</label>
                  <div class="row" style="gap:6px;flex-wrap:wrap">
                    ${a.map(i=>j`
                      <button class="chip" data-active="${t.action?.id===i.id}"
                        style="background:${t.action?.id===i.id?st(e,{id:i.id}):"var(--bg-sunken)"};color:${t.action?.id===i.id?"white":"var(--text-soft)"};border:1px solid ${t.action?.id===i.id?"transparent":"var(--border-soft)"};cursor:pointer"
                        @click=${()=>this._setAction(i.id)}>${Ue(e,i.id,i.label)}</button>
                    `)}
                  </div>
                </div>
                ${i?.value?j`
                  <div class="field" style="margin-top:10px">
                    <label class="field__label">${Ge(e,t.action.id,i.value.label)||Ve("common.value")} ${i.value.unit?j`<span class="text-mute">(${i.value.unit})</span>`:J}</label>
                    ${"number"===i.value.type?j`
                      <div class="row" style="gap:10px;align-items:center">
                        <input type="range" min="${i.value.min}" max="${i.value.max}" step="${i.value.step}"
                          .value=${String(t.action?.value??i.value.default)}
                          @input=${e=>this._setActionValue(parseFloat(e.target.value))}
                          style="flex:1"/>
                        <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${t.action?.value??i.value.default}${i.value.unit||""}</span>
                      </div>
                    `:"enum"===i.value.type?j`
                      <select class="input" @change=${e=>this._setActionValue(e.target.value)}>
                        ${(i.value.options||[]).map(e=>{const a=String(t.action?.value??i.value.default);return j`<option value="${e}" ?selected=${a===e}>${e}</option>`})}
                      </select>
                    `:"entity"===i.value.type?this._renderEntityPicker(i.value,t.action?.value):"string"===i.value.type?j`
                      <input type="text" class="input mono"
                        .value=${String(t.action?.value??"")}
                        placeholder="${i.value.placeholder||""}"
                        @input=${e=>this._setActionValue(e.target.value)}
                        style="width:100%"/>
                    `:J}
                  </div>
                `:J}
              </div>
            `:j`
              <p class="text-xs text-mute" style="margin:0">${Ve("editor.block.no_selection")}</p>
            `}

            <p class="text-xs text-mute" style="margin:0">${Ve("editor.coverage",{n:this._blocks.length,h:this._totalCoverage()})}</p>
          </div>
        `}case 3:return j`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.days.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.days.hint")}</p>
            <div class="row" style="gap:4px">
              ${wt().map((e,t)=>{const i=this._days[t];return j`
                  <button class="mono" @click=${()=>{const e=[...this._days];e[t]=e[t]?0:1,this._days=e}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text-muted)"};border:1px solid ${i?"transparent":"var(--border-soft)"};cursor:pointer">
                    ${e}
                  </button>
                `})}
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,1,1]}}>${Ve("editor.days.all")}</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,0,0]}}>${Ve("editor.days.weekdays")}</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[0,0,0,0,0,1,1]}}>${Ve("editor.days.weekend")}</button>
            </div>
          </div>
        `;case 4:return j`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.weather.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.weather.hint")}</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!0}}>
                <div class="tile-pick__icon">${be("cloud",16)}</div>
                <div class="tile-pick__name">${Ve("wizard.weather.yes")}</div>
                <div class="tile-pick__desc">${Ve("wizard.weather.yes.desc")}</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!1}}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${be("close",16)}</div>
                <div class="tile-pick__name">${Ve("wizard.weather.no")}</div>
                <div class="tile-pick__desc">${Ve("wizard.weather.no.desc")}</div>
              </button>
            </div>
          </div>
        `;case 5:return j`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">${Ve("wizard.review.heading")}</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">${Ve("editor.field.name")}</span><strong>${this._name||Ve("nav.new_schedule")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("nav.devices")}</span><strong>${"scene"===this._specialMode?Ve("wizard.review.scene_mode"):"automation"===this._specialMode?Ve("wizard.review.automation_mode"):Ve("wizard.review.devices",{n:this._pickedDevices.length})}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("editor.days.repeat")}</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("wizard.weather.heading")}</span><strong>${this._weatherEnabled?Ve("wizard.review.weather_on"):Ve("wizard.review.weather_off")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("wizard.step.time")}</span><strong>${this._blocks.length}</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">${Ve("wizard.review.note")}</p>
          </div>
        `;default:return J}}_onImportFile(e){const t=e.target,i=t.files?.[0];if(!i)return;const a=new FileReader;a.onload=()=>{this._importText=String(a.result||""),this._importError=""},a.readAsText(i),t.value=""}async _doImport(){this._importError="";try{const{schedule:e,rules:t,missing:i}=function(e,t){let i;try{i=JSON.parse(e)}catch{throw new Error("invalid_json")}const a=i&&"object"==typeof i&&i.chronos_export?i.schedule:i;if(!a||"object"!=typeof a||!Array.isArray(a.blocks))throw new Error("invalid_schedule");if(!xt[a.device_type])throw new Error("invalid_device_type");const s=a.blocks.filter(e=>e&&"object"==typeof e&&e.action&&"string"==typeof e.action.id);if(!s.length)throw new Error("invalid_schedule");const r=new Map(t.map(e=>[e.entity_id,e])),n=[],o=[],l=Array.isArray(i?.devices)?i.devices:[];for(const e of l){const t=e?.entity_id;if(!t)continue;const i=r.get(t);i?o.push(i.id):n.push(t)}const d={id:"",name:String(a.name||"Imported schedule"),device_type:a.device_type,device_ids:o,days:Array.isArray(a.days)&&7===a.days.length?a.days.map(e=>e?1:0):[1,1,1,1,1,1,1],enabled:!1,blocks:s.map(e=>{const t=JSON.parse(JSON.stringify(e));if(Array.isArray(t.device_entity_ids)){const e=t.device_entity_ids.map(e=>r.get(e)?.id).filter(Boolean);e.length&&(t.device_ids=e),delete t.device_entity_ids}return t}),date_range:a.date_range??null,...["linear","radial","list"].includes(a.timeline_variant)?{timeline_variant:a.timeline_variant}:{}},c=Array.isArray(a.weather_rules)?a.weather_rules.filter(e=>e&&"object"==typeof e&&e.effect):[];return{schedule:d,rules:c,missing:n}}(this._importText,this.card._devices),a=await this.card.doAddSchedule(e);if(a)for(const e of t)await this.card.doSaveRule(zt(e,a.id));i.length&&alert(Ve("wizard.import.missing",{list:i.join(", ")}))}catch(e){const t=`transfer.err.${e?.message||"invalid_json"}`,i=Ve(t);this._importError=i===t?Ve("transfer.err.invalid_json"):i}}_togglePick(e){this._specialMode||(this._pickedDevices.includes(e)?this._pickedDevices=this._pickedDevices.filter(t=>t!==e):this._pickedDevices=[...this._pickedDevices,e])}_toggleSpecialMode(e){this._specialMode=this._specialMode===e?"":e,this._specialMode&&(this._pickedDevices=[])}_inferDeviceType(){if(this._specialMode)return this._specialMode;if(!this._pickedDevices.length)return"thermostat";const e=this.card._devices.find(e=>e.id===this._pickedDevices[0]);return e?.type||"thermostat"}_defaultBlocks(e){const t=rt(e);return"scene"===e||"automation"===e?[{start:8,end:9,action:{...t}}]:[{start:0,end:7,action:{...t}},{start:7,end:22,action:{...t}},{start:22,end:ht,action:{...t}}]}_ensureBlocksFor(e){this._blocksDeviceType!==e&&(this._blocks=this._defaultBlocks(e),this._blocksDeviceType=e,this._selectedBlockIdx=-1)}_resetBlocks(e){this._blocks=this._defaultBlocks(e),this._selectedBlockIdx=-1}_addBlock(e){const t=[...this._blocks].sort((e,t)=>e.start-t.start);let i=0,a=24;for(let e=0;e<=t.length;e++){const s=0===e?0:t[e-1].end,r=e===t.length?24:t[e].start;if(r-s>=1){i=s,a=Math.min(s+2,r);break}}a-i<.25&&(i=12,a=13);const s=[...this._blocks,{start:i,end:a,action:rt(e)}];this._blocks=s.sort((e,t)=>e.start-t.start),this._selectedBlockIdx=this._blocks.findIndex(e=>e.start===i&&e.end===a)}_removeSelected(){this._selectedBlockIdx<0||(this._blocks=this._blocks.filter((e,t)=>t!==this._selectedBlockIdx),this._selectedBlockIdx=-1)}_setAction(e){if(this._selectedBlockIdx<0)return;const t=it(this._inferDeviceType(),e),i=[...this._blocks];i[this._selectedBlockIdx]={...i[this._selectedBlockIdx],action:{id:e,value:t?.value?t.value.default:void 0}},this._blocks=i}_setActionValue(e){if(this._selectedBlockIdx<0)return;const t=[...this._blocks],i=t[this._selectedBlockIdx];t[this._selectedBlockIdx]={...i,action:{...i.action||{id:""},value:e}},this._blocks=t}_renderEntityPicker(e,t){const i="automation"===e.domain?this.card._automationEntities:this.card._sceneEntities,a=Array.isArray(t)?t:"string"==typeof t&&t?[t]:[];return e.multi?j`
      <div class="row" style="gap:6px;flex-wrap:wrap">
        ${i.length?i.map(e=>{const t=e.entity_id,i=a.includes(t);return j`
            <button class="btn btn--sm"
              @click=${()=>{const e=i?a.filter(e=>e!==t):[...a,t];this._setActionValue(e)}}
              style="background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text)"};border-color:${i?"transparent":"var(--border-soft)"}">
              ${i?be("check",11):J} ${e.friendly_name||t}
            </button>
          `}):j`<span class="text-xs text-mute">${Ve("editor.entity.empty")}</span>`}
      </div>
      <span class="field__hint" style="margin-top:4px">${0===a.length?Ve("editor.scene.pick_warn"):Ve("editor.entity.count",{n:a.length})}</span>
    `:j`
        <select class="input"
          @change=${e=>this._setActionValue(e.target.value)}>
          <option value="" ?selected=${!t}>${Ve("editor.scene.pick_placeholder")}</option>
          ${i.map(e=>j`
            <option value="${e.entity_id}" ?selected=${t===e.entity_id}>
              ${e.friendly_name||e.entity_id}
            </option>
          `)}
        </select>
      `}_fmtBlockRange(e){const t=e=>{const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`};return`${t(e.start)} → ${t(e.end)}`}_totalCoverage(){const e=this._blocks.reduce((e,t)=>e+(t.end-t.start),0);return e.toFixed(1).replace(/\.0$/,"")}_effectiveVariant(){return this._variant??this.card._settings?.default_timeline_variant??"linear"}async _finish(){const e=this._inferDeviceType();this._ensureBlocksFor(e);const t={id:"",name:this._name,device_type:e,device_ids:this._specialMode?[]:this._pickedDevices,days:this._days,enabled:!0,blocks:[...this._blocks].sort((e,t)=>e.start-t.start),...this._variant?{timeline_variant:this._variant}:{}};await this.card.doAddSchedule(t),this._weatherEnabled&&this.card.navigate("weatherRule")}};Lt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Lt.prototype,"card",void 0),e([me({type:Number})],Lt.prototype,"nowHour",void 0),e([fe()],Lt.prototype,"_step",void 0),e([fe()],Lt.prototype,"_name",void 0),e([fe()],Lt.prototype,"_pickedDevices",void 0),e([fe()],Lt.prototype,"_specialMode",void 0),e([fe()],Lt.prototype,"_days",void 0),e([fe()],Lt.prototype,"_weatherEnabled",void 0),e([fe()],Lt.prototype,"_blocks",void 0),e([fe()],Lt.prototype,"_blocksDeviceType",void 0),e([fe()],Lt.prototype,"_selectedBlockIdx",void 0),e([fe()],Lt.prototype,"_variant",void 0),e([fe()],Lt.prototype,"_dupPick",void 0),e([fe()],Lt.prototype,"_importText",void 0),e([fe()],Lt.prototype,"_importError",void 0),Lt=e([pe("chronos-wizard")],Lt);let Wt=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._pickerOpen=!1,this._search="",this._pickedAlias={},this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected="",this._busy=!1,this._lastError=""}_askRemove(e){this._confirmRemoveId=e}async _doRemove(e){if(!this._busy){this._busy=!0,this._lastError="";try{await this.card.doRemoveDevice(e)}catch(e){this._lastError=e?.message||String(e)}finally{this._busy=!1,this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected=""}}}render(){const{_devices:e,_availableEntities:t}=this.card;return j`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${Ve("screen.devices.title")}</h1>
            <p class="page-sub">${Ve("devices.subtitle",{n:e.length})}</p>
          </div>
          <div class="row" style="gap:8px">
            <button class="btn" title="${Ve("devices.refresh.title")}"
              @click=${async()=>{try{await this.card.reloadAll()}catch(e){this._lastError=e?.message||String(e)}}}>
              ${be("repeat",14)}
            </button>
            ${e.length?j`
              <button class="btn" @click=${()=>{this._bulkOpen=!0,this._bulkSelected=e[0]?.id||""}}>
                ${be("trash",14)} ${Ve("devices.unlink")}…
              </button>
            `:J}
            <button class="btn btn--primary" @click=${()=>{this._pickerOpen=!0}}>
              ${be("plus",14)} ${Ve("devices.add_entity")}
            </button>
          </div>
        </div>

        ${this._lastError?j`
          <div style="padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:6px;font-size:12.5px;font-family:ui-monospace,monospace">
            ${this._lastError}
          </div>
        `:J}

        <div class="card">
          <div class="col" style="gap:0">
            ${e.map(e=>{const t=xt[e.type]||{label:e.type},i=this.card.hass?.states?.[e.entity_id],a=i?.state||"—",s=qe(e,i,this.card._settings);return j`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center;position:relative">
                  <div class="device-row__icon" style="background:${s.soft};color:${s.accent};flex:0 0 auto;border:1px solid ${s.soft}">
                    ${we(e.type,17)}
                  </div>
                  <div class="device-row__main" style="min-width:0">
                    <div class="row" style="gap:2px;align-items:center">
                      <input class="input input--ghost" .value=${e.alias}
                        @change=${t=>this.card.doUpdateDevice(e.id,{alias:t.target.value})}
                        style="padding:4px 6px;font-weight:500;font-size:14px;margin-left:-6px;width:100%;max-width:240px"
                        title="${Ve("devices.alias.hint")}"
                        placeholder="${Ve("devices.alias")}…"/>
                      <span class="edit-hint" title="${Ve("devices.alias.hint")}"
                        @click=${e=>{const t=e.currentTarget.parentElement?.querySelector("input");t?.focus(),t?.select()}}>${be("edit",12)}</span>
                    </div>
                    <div class="device-row__meta" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--text-muted)">${e.entity_id}</span>
                      ${e.area?j` · ${e.area}`:J}
                    </div>
                  </div>
                  <span class="chip chip--accent" style="flex:0 0 auto">${Ze(e.type,t.label)}</span>
                  <span class="mono text-xs text-mute" style="flex:0 0 auto;min-width:60px;text-align:right">${a}</span>
                  <button
                    type="button"
                    class="btn btn--sm"
                    style="flex:0 0 auto;background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-weight:600;z-index:5;position:relative"
                    @click=${t=>{t.preventDefault(),t.stopPropagation(),this._askRemove(e.id)}}
                    title="${Ve("devices.unlink")}: ${e.alias}">
                    ${be("trash",12)} ${Ve("common.remove")}
                  </button>
                </div>
              `})}
            ${e.length?J:j`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${be("device",22)}</div>
              <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("devices.empty.title")}</div>
              <div style="font-size:12.5px;margin-top:4px">${Ve("devices.empty.hint")}</div>
            </div>`}
          </div>
        </div>

        <p class="text-xs text-mute" style="margin:0">${Ve("devices.types_hint")}</p>

        ${this._pickerOpen?this._renderPicker(t):J}
        ${this._confirmRemoveId?this._renderConfirm():J}
        ${this._bulkOpen?this._renderBulkRemove():J}
      </div>
    `}_renderConfirm(){const e=this.card._devices.find(e=>e.id===this._confirmRemoveId);return e?j`
      <div class="modal-overlay" @click=${()=>{this._confirmRemoveId=""}}>
        <div class="card" style="width:min(420px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${Ve("devices.unlink")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${e.alias}</strong>
            <span class="mono text-xs" style="display:block;color:var(--text-muted);margin-top:4px">${e.entity_id}</span>
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmRemoveId=""}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444" ?disabled=${this._busy}
              @click=${()=>this._doRemove(e.id)}>
              ${be("trash",12)} ${this._busy?"…":Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `:J}_renderBulkRemove(){const e=this.card._devices,t=e.find(e=>e.id===this._bulkSelected);return j`
      <div class="modal-overlay" @click=${()=>{this._bulkOpen=!1}}>
        <div class="card" style="width:min(520px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${Ve("devices.unlink")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 14px">${Ve("devices.bulk_remove.hint")}</p>
          <select class="select mono" style="margin-bottom:12px"
            @change=${e=>{this._bulkSelected=e.target.value}}>
            ${e.map(e=>j`
              <option value="${e.id}" ?selected=${e.id===this._bulkSelected}>${e.alias} — ${e.entity_id}</option>
            `)}
          </select>
          ${t?j`
            <div class="card card--ghost" style="padding:12px;margin-bottom:14px">
              <div class="row" style="gap:10px;align-items:center">
                <div class="device-row__icon">${we(t.type,16)}</div>
                <div>
                  <div class="fw-600">${t.alias}</div>
                  <div class="text-xs text-mute mono">${t.entity_id}</div>
                </div>
              </div>
            </div>
          `:J}
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._bulkOpen=!1}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              ?disabled=${this._busy||!this._bulkSelected}
              @click=${()=>this._doRemove(this._bulkSelected)}>
              ${be("trash",12)} ${this._busy?"…":Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_renderPicker(e){const t=e.filter(e=>!this._search||(e.entity_id+e.friendly_name).toLowerCase().includes(this._search.toLowerCase()));return j`
      <div class="modal-overlay" @click=${()=>{this._pickerOpen=!1}}>
        <div class="card" style="width:min(640px,100%);max-height:80vh;display:flex;flex-direction:column" @click=${e=>e.stopPropagation()}>
          <div class="sp-between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0">${Ve("devices.picker.title")}</h3>
              <p class="text-mute text-sm" style="margin:2px 0 0">${Ve("devices.picker.count",{n:e.length})}</p>
            </div>
            <button class="btn btn--icon btn--ghost" @click=${()=>{this._pickerOpen=!1}}>${be("close",16)}</button>
          </div>
          <input class="input" placeholder="${Ve("devices.picker.search")}" .value=${this._search}
            @input=${e=>{this._search=e.target.value}}
            style="margin-bottom:12px"/>
          <div style="overflow:auto;flex:1;display:flex;flex-direction:column;gap:4px">
            ${t.map(e=>{const t=e.type||"plug",i=xt[t]||{label:t};return j`
                <div class="device-row" style="background:var(--bg-sunken);padding:10px 12px;flex-wrap:wrap;row-gap:8px">
                  <div class="device-row__icon">${we(t,16)}</div>
                  <div class="device-row__main" style="min-width:160px;flex:1 1 200px">
                    <div class="device-row__name">${e.friendly_name}</div>
                    <div class="device-row__meta"><span class="mono">${e.entity_id}</span> · ${e.area||""}</div>
                  </div>
                  <input class="input" placeholder="${Ve("devices.alias.placeholder")}"
                    .value=${this._pickedAlias[e.entity_id]||""}
                    @input=${t=>{this._pickedAlias={...this._pickedAlias,[e.entity_id]:t.target.value}}}
                    style="flex:1 1 140px;min-width:120px;max-width:200px;font-size:12px"/>
                  <span class="chip chip--accent" style="flex-shrink:0">${Ze(t,i.label)}</span>
                  <button class="btn btn--sm btn--primary" style="flex-shrink:0" @click=${async()=>{await this.card.doAddDevice(e.entity_id,this._pickedAlias[e.entity_id]||void 0),this._pickedAlias={...this._pickedAlias,[e.entity_id]:""}}}>${be("plus",12)} ${Ve("devices.import")}</button>
                </div>
              `})}
            ${e.length?J:j`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("devices.picker.all_imported")}</div>
              <div style="font-size:12.5px;margin-top:4px">${Ve("devices.picker.all_imported.hint")}</div>
            </div>`}
          </div>
        </div>
      </div>
    `}};Wt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Wt.prototype,"card",void 0),e([me({type:Number})],Wt.prototype,"nowHour",void 0),e([fe()],Wt.prototype,"_pickerOpen",void 0),e([fe()],Wt.prototype,"_search",void 0),e([fe()],Wt.prototype,"_pickedAlias",void 0),e([fe()],Wt.prototype,"_confirmRemoveId",void 0),e([fe()],Wt.prototype,"_bulkOpen",void 0),e([fe()],Wt.prototype,"_bulkSelected",void 0),e([fe()],Wt.prototype,"_busy",void 0),e([fe()],Wt.prototype,"_lastError",void 0),Wt=e([pe("chronos-devices-screen")],Wt);let Vt=class extends ce{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._settings;return e?j`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">${Ve("screen.settings.title")}</h1>
          <p class="page-sub">${Ve("settings.subtitle")}</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.language.title")}</h3><p class="card__sub">${Ve("settings.language.subtitle")}</p></div></div>
          <div class="segmented">
            ${["auto","it","en","fr","de"].map(t=>j`
              <button data-active="${(e.language||"auto")===t}" @click=${()=>this._updateSetting("language",t)}>
                ${"auto"===t?Ve("settings.language.auto"):t.toUpperCase()}
              </button>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.weather.title")}</h3><p class="card__sub">${Ve("settings.weather.subtitle")}</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">${Ve("settings.weather.entity")}</label>
              <select class="select mono"
                @change=${e=>this._updateSetting("weather_entity",e.target.value)}>
                <option value="" ?selected=${!e.weather_entity}>${Ve("common.none")}</option>
                ${this.card._weatherEntities.map(t=>j`
                  <option value="${t.entity_id}" ?selected=${e.weather_entity===t.entity_id}>${t.entity_id} — ${t.friendly_name}</option>
                `)}
              </select>
              <span class="field__hint">${Ve("settings.weather.entity.hint")}</span>
            </div>

            ${this._renderSensorOverrides()}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.behavior.title")}</h3><p class="card__sub">${Ve("settings.behavior.subtitle")}</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${Ve("settings.polling")}</label>
              <div class="segmented">
                ${[1,5,15].map(t=>j`
                  <button data-active="${e.polling_minutes===t}" @click=${()=>this._updateSetting("polling_minutes",t)}>${t} ${Ve("common.min")}</button>
                `)}
              </div>
              <span class="field__hint">${Ve("settings.polling.hint")}</span>
            </div>
            <div class="field">
              <label class="field__label">${Ve("settings.snap")}</label>
              <div class="segmented">
                ${[5,15,30,60].map(t=>j`
                  <button data-active="${e.snap_minutes===t}" @click=${()=>this._updateSetting("snap_minutes",t)}>${60===t?`1 ${Ve("common.hour_short")}`:`${t} ${Ve("common.min")}`}</button>
                `)}
              </div>
              <span class="field__hint">${Ve("settings.snap.hint")}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.notify.title")}</h3><p class="card__sub">${Ve("settings.notify.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${[["notify_block_executed",Ve("settings.notify.block_executed"),Ve("settings.notify.block_executed.desc")],["notify_rule_triggered",Ve("settings.notify.rule_triggered"),Ve("settings.notify.rule_triggered.desc")],["notify_sched_skipped",Ve("settings.notify.sched_skipped"),Ve("settings.notify.sched_skipped.desc")],["notify_command_error",Ve("settings.notify.command_error"),Ve("settings.notify.command_error.desc")]].map(([t,i,a])=>j`
              <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0">
                <div class="device-row__main">
                  <div class="device-row__name">${i}</div>
                  <div class="device-row__meta" style="font-family:var(--font-sans)">${a}</div>
                </div>
                <label class="switch">
                  <input type="checkbox" .checked=${!!e[t]}
                    @change=${e=>this._updateSetting(t,e.target.checked)}/>
                  <span class="switch__track"></span>
                  <span class="switch__thumb"></span>
                </label>
              </div>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.appearance.title")}</h3><p class="card__sub">${Ve("settings.appearance.subtitle")}</p></div></div>
          <div class="field">
            <label class="field__label">${Ve("settings.density")}</label>
            <div class="segmented">
              ${["comfortable","compact"].map(t=>j`
                <button data-active="${e.density===t}" @click=${()=>this._updateSetting("density",t)}>
                  ${Ve("settings.density."+t)}
                </button>
              `)}
            </div>
            <span class="field__hint">${Ve("settings.appearance.theme_hint")}</span>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.timeline_default.title")}</h3><p class="card__sub">${Ve("settings.timeline_default.subtitle")}</p></div></div>
          <div class="segmented">
            ${["linear","radial","list"].map(t=>j`
              <button data-active="${e.default_timeline_variant===t}" @click=${()=>this._updateSetting("default_timeline_variant",t)}>
                ${Ve("timeline."+t)}
              </button>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.irrigation.title")}</h3></div></div>
          <div class="device-row" style="border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">${Ve("settings.irrigation.conflict_block.title")}</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">${Ve("settings.irrigation.conflict_block.desc")}</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${!!e.irrigation_conflict_block}
                @change=${e=>this._updateSetting("irrigation_conflict_block",e.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>
        </div>

        ${this._renderColorsSection()}
      </div>
    `:j`<div class="text-mute">${Ve("common.loading")}</div>`}_renderColorsSection(){const e=this.card._settings,t=Be(e,"thermostat"),i=Be(e,"boiler"),a=Re(e),s=Te(e);return j`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.colors.title")}</h3><p class="card__sub">${Ve("settings.colors.subtitle")}</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">${Ve("settings.colors.lights.title")}</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">${Ve("settings.colors.lights.desc")}</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${s}
                @change=${e=>this._updateSetting("color_light_use_state",e.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops(Ve("settings.colors.thermostat.title"),Ve("settings.colors.thermostat.desc"),t,"color_stops_climate",$e)}

          ${this._renderTempStops(Ve("settings.colors.boiler.title"),Ve("settings.colors.boiler.desc"),i,"color_stops_boiler",Se)}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">${Ve("settings.colors.preset.title")}</div>
                <div class="text-xs text-mute">${Ve("settings.colors.preset.desc")}</div>
              </div>
              <button class="btn btn--sm" @click=${()=>this._updateSetting("color_presets",{...Ae})}>
                ${be("repeat",12)} ${Ve("common.default")}
              </button>
            </div>
            <div class="grid-2" style="gap:8px">
              ${Object.entries(a).map(([e,t])=>j`
                <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                  <div style="width:14px;height:14px;border-radius:50%;background:${t};border:1px solid var(--border)"></div>
                  <span class="mono text-sm" style="flex:1">${e}</span>
                  <input type="color" .value=${t}
                    @change=${t=>this._updatePresetColor(e,t.target.value)}
                    style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>

      ${this._renderKindColorsSection()}
      ${this._renderSimpleColorsSection()}
      ${this._renderRangeColorsSection()}
      ${this._renderResetAllColors()}
    `}_renderKindColorsSection(){const e=this.card._settings;return j`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${Ve("settings.colors.kind.title")}</h3>
            <p class="card__sub">${Ve("settings.colors.kind.desc")}</p>
          </div>
          <button class="btn btn--sm" @click=${()=>this._updateSetting("color_kind",{...ze})}>
            ${be("repeat",12)} ${Ve("common.default")}
          </button>
        </div>
        <div class="grid-2" style="gap:8px">
          ${["on","off","set","preset","cmd"].map(t=>{const i=Ie(t,e),a=i.startsWith("#")?i:ze[t]||"#10b981";return j`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <div style="width:14px;height:14px;border-radius:50%;background:${i};border:1px solid var(--border)"></div>
                <span class="mono text-sm" style="flex:1">${t}</span>
                <input type="color" .value=${a}
                  @change=${e=>this._updateKindColor(t,e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
              </div>
            `})}
        </div>
      </div>
    `}_renderSimpleColorsSection(){const e=this.card._settings,t=Object.keys(Ce);return j`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${Ve("settings.colors.simple.title")}</h3>
            <p class="card__sub">${Ve("settings.colors.simple.desc")}</p>
          </div>
          <button class="btn btn--sm" @click=${()=>this._updateSetting("color_simple",JSON.parse(JSON.stringify(Ce)))}>
            ${be("repeat",12)} ${Ve("common.default")}
          </button>
        </div>
        <div class="col" style="gap:6px">
          ${t.map(t=>{const i=De(t,e);return j`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center;flex-wrap:wrap">
                <span class="mono text-sm" style="flex:1;min-width:140px">${Ve(`device_type.${t}`)}</span>
                <span class="text-xs text-mute">${Ve("settings.colors.active")}</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${i.active};border:1px solid var(--border)"></div>
                <input type="color" .value=${i.active}
                  @change=${e=>this._updateSimpleColor(t,"active",e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                <span class="text-xs text-mute" style="margin-left:8px">${Ve("settings.colors.inactive")}</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${i.inactive};border:1px solid var(--border)"></div>
                <input type="color" .value=${i.inactive}
                  @change=${e=>this._updateSimpleColor(t,"inactive",e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
              </div>
            `})}
        </div>
      </div>
    `}_renderRangeColorsSection(){const e=this.card._settings,t=Object.keys(Me);return j`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${Ve("settings.colors.range.title")}</h3>
            <p class="card__sub">${Ve("settings.colors.range.desc")}</p>
          </div>
          <button class="btn btn--sm" @click=${()=>this._updateSetting("color_range",JSON.parse(JSON.stringify(Me)))}>
            ${be("repeat",12)} ${Ve("common.default")}
          </button>
        </div>
        <div class="col" style="gap:6px">
          ${t.map(t=>{const i=Ne(t,e);return j`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center;flex-wrap:wrap">
                <span class="mono text-sm" style="flex:1;min-width:140px">${Ve(`device_type.${t}`)}</span>
                <span class="text-xs text-mute">${Ve("settings.colors.start")}</span>
                <input type="color" .value=${i.start}
                  @change=${e=>this._updateRangeColor(t,"start",e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                <div style="flex:0 0 80px;height:14px;border-radius:7px;background:linear-gradient(to right, ${i.start}, ${i.end});border:1px solid var(--border)"></div>
                <input type="color" .value=${i.end}
                  @change=${e=>this._updateRangeColor(t,"end",e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                <span class="text-xs text-mute">${Ve("settings.colors.end")}</span>
              </div>
            `})}
        </div>
      </div>
    `}_renderResetAllColors(){return j`
      <div class="card" style="background:var(--bg-sunken)">
        <div class="row" style="gap:12px;align-items:center;flex-wrap:wrap">
          <div style="flex:1;min-width:200px">
            <div class="fw-600" style="font-size:13.5px">${Ve("settings.colors.reset_all.title")}</div>
            <div class="text-xs text-mute">${Ve("settings.colors.reset_all.desc")}</div>
          </div>
          <button class="btn" style="color:var(--danger)" @click=${()=>this._resetAllColors()}>
            ${be("repeat",13)} ${Ve("settings.colors.reset_all.button")}
          </button>
        </div>
      </div>
    `}_resetAllColors(){confirm(Ve("settings.colors.reset_all.confirm"))&&this.card.doUpdateSettings({color_stops_climate:$e.map(e=>({...e})),color_stops_boiler:Se.map(e=>({...e})),color_presets:{...Ae},color_kind:{...ze},color_simple:JSON.parse(JSON.stringify(Ce)),color_range:JSON.parse(JSON.stringify(Me)),color_light_use_state:!0})}_updateKindColor(e,t){const i={...this.card._settings?.color_kind||{}};i[e]=t,this._updateSetting("color_kind",i)}_updateSimpleColor(e,t,i){const a={...this.card._settings?.color_simple||{}};a[e]={...a[e]||Ce[e]||{active:"#10b981",inactive:"#9ca3af"}},a[e][t]=i,this._updateSetting("color_simple",a)}_updateRangeColor(e,t,i){const a={...this.card._settings?.color_range||{}};a[e]={...a[e]||Me[e]||{start:"#3c5078",end:"#c8b4ff"}},a[e][t]=i,this._updateSetting("color_range",a)}_renderTempStops(e,t,i,a,s){return j`
      <div>
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
          <div>
            <div class="fw-600" style="font-size:13.5px">${e}</div>
            <div class="text-xs text-mute">${t}</div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn btn--sm" @click=${()=>this._addStop(i,a)}>
              ${be("plus",12)} ${Ve("settings.colors.add_stop")}
            </button>
            <button class="btn btn--sm" @click=${()=>this._updateSetting(a,s.map(e=>({...e})))}>
              ${be("repeat",12)} ${Ve("common.default")}
            </button>
          </div>
        </div>
        <div class="col" style="gap:6px">
          ${i.map((e,t)=>{const s=t===i.length-1;return j`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <span class="text-sm text-mute" style="width:18px">${s?">":"≤"}</span>
                ${s?j`<span class="mono text-sm" style="width:80px">${i[t-1]?.max??0}°+</span>`:j`<input type="number" class="input mono" step="0.5" .value=${String(e.max)}
                      @change=${e=>this._updateStopMax(i,a,t,parseFloat(e.target.value))}
                      style="width:80px;font-size:13px"/>`}
                <span class="text-sm text-mute">°C</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${e.color};border:1px solid var(--border)"></div>
                <span class="mono text-xs" style="flex:1;color:var(--text-muted)">${e.color}</span>
                <input type="color" .value=${e.color}
                  @change=${e=>this._updateStopColor(i,a,t,e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                ${i.length>1?j`
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._removeStop(i,a,t)} title="${Ve("common.remove")}">
                    ${be("trash",12)}
                  </button>
                `:J}
              </div>
            `})}
        </div>
      </div>
    `}_addStop(e,t){const i=e.filter(e=>e.max<900),a={max:(i.length?i[i.length-1].max:20)+5,color:"#9ca3af"},s=e.find(e=>e.max>=900),r=[...i,a];s&&r.push(s),this._updateSetting(t,r)}_removeStop(e,t,i){const a=e.filter((e,t)=>t!==i);this._updateSetting(t,a)}_updateStopMax(e,t,i,a){if(isNaN(a))return;const s=e.map((e,t)=>t===i?{...e,max:a}:e);this._updateSetting(t,s)}_updateStopColor(e,t,i,a){const s=e.map((e,t)=>t===i?{...e,color:a}:e);this._updateSetting(t,s)}_updatePresetColor(e,t){const i=Re(this.card._settings);this._updateSetting("color_presets",{...i,[e]:t})}_renderSensorOverrides(){const e=this.card._settings.weather_sensor_map||{},t=this.card._sensorEntities||[],i=(this.card._weatherAttributes||[]).filter(e=>!e.key.startsWith("forecast."));if(!i.length)return J;const a=this._groupSensorsByDeviceClass(t);return j`
      <div class="field" style="margin-top:8px">
        <label class="field__label">${Ve("settings.weather.overrides.title")}</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          ${Ve("settings.weather.overrides.hint")}
        </span>
        ${t.length?J:j`
          <div style="padding:10px 12px;background:#fef3c7;color:#92400e;border-radius:var(--r-md);font-size:12.5px">
            ${Ve("settings.weather.overrides.no_sensors")}
          </div>
        `}
        <div class="col" style="gap:6px">
          ${i.map(i=>{const s=e[i.key]||"",r=t.find(e=>e.entity_id===s),n=r?`${r.state}${r.unit_of_measurement?" "+r.unit_of_measurement:""}`:"",o=s&&r?this._compatWarning(i,r):"";return j`
              <div class="col" style="gap:4px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md)">
                <div class="row" style="gap:10px;align-items:center;flex-wrap:wrap">
                  <div style="min-width:160px">
                    <div class="fw-600 text-sm">${je(i.key,i.label)}</div>
                    <div class="text-xs text-mute mono">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                  </div>
                  <select class="select mono" style="flex:1;min-width:240px"
                    @change=${e=>this._updateSensorOverride(i.key,e.target.value)}>
                    <option value="" ?selected=${!s}>${Ve("settings.weather.overrides.use_main")}</option>
                    ${this._renderSensorOptions(a,i,s)}
                  </select>
                  ${s?j`
                    <span class="mono text-xs" style="color:${o?"#b45309":"var(--text-muted)"};min-width:90px;text-align:right;font-weight:${o?600:400}">${n}</span>
                    <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._updateSensorOverride(i.key,"")} title="${Ve("common.remove")}">
                      ${be("close",12)}
                    </button>
                  `:J}
                </div>
                ${o?j`
                  <div class="text-xs" style="color:#b45309;padding:6px 8px;background:#fef3c7;border-radius:6px;margin-top:2px">
                    ${be("info",11)} ${o}
                  </div>
                `:J}
              </div>
            `})}
        </div>
      </div>
    `}_compatWarning(e,t){const i=(e.unit||"").trim(),a=(t.unit_of_measurement||"").trim(),s=this._matchingDeviceClasses(e.key),r=t.device_class||"";if("enum"===e.type){const e=String(t.state||"");return e&&!isNaN(parseFloat(e))?Ve("settings.weather.overrides.warn.numeric_for_condition",{state:e}):""}const n=t.state;return null!=n&&""!==n&&isNaN(parseFloat(n))?Ve("settings.weather.overrides.warn.not_numeric",{state:String(n)}):i&&a&&i!==a?Ve("settings.weather.overrides.warn.unit_mismatch",{expected:i,got:a}):s.length&&r&&!s.includes(r)?Ve("settings.weather.overrides.warn.class_mismatch",{expected:s.join(" / "),got:r}):""}_groupSensorsByDeviceClass(e){const t={};for(const i of e){const e=i.device_class||"other";(t[e]=t[e]||[]).push(i)}return t}_renderSensorOptions(e,t,i){const a=this._matchingDeviceClasses(t.key),s=a.filter(t=>e[t]),r=Object.keys(e).filter(e=>!s.includes(e)).sort();return[...s,...r].map(t=>j`
      <optgroup label="${"other"===t?Ve("settings.weather.overrides.others"):t}${a.includes(t)?" · "+Ve("settings.weather.overrides.suggested"):""}">
        ${e[t].map(e=>j`
          <option value="${e.entity_id}" ?selected=${i===e.entity_id}>
            ${e.entity_id}${e.unit_of_measurement?` (${e.unit_of_measurement})`:""} — ${e.friendly_name}
          </option>
        `)}
      </optgroup>
    `)}_matchingDeviceClasses(e){return{temperature:["temperature"],feels_like:["temperature"],dew_point:["temperature"],humidity:["humidity"],wind_speed:["wind_speed"],wind_gust:["wind_speed"],wind_bearing:["wind_direction"],pressure:["atmospheric_pressure","pressure"],uv_index:["uv_index"],solar_radiation:["irradiance"],rain_rate:["precipitation_intensity"]}[e]||[]}_updateSensorOverride(e,t){const i={...this.card._settings?.weather_sensor_map||{}};t?i[e]=t:delete i[e],this._updateSetting("weather_sensor_map",i)}_updateSetting(e,t){this.card.doUpdateSettings({[e]:t})}};Vt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Vt.prototype,"card",void 0),e([me({type:Number})],Vt.prototype,"nowHour",void 0),Vt=e([pe("chronos-settings-screen")],Vt);const Ft=[{id:"thermostat_day_night",device_type:"thermostat",default_name_key:"recipe.thermostat_day_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:7,action:{id:"set_temperature",value:18}},{start:7,end:22,action:{id:"set_temperature",value:21}},{start:22,end:ht,action:{id:"set_temperature",value:18}}],weather_rules:[{if:"temperature > 22",then:"Skip",active:!0,effect:"skip",block_index:null}]},{id:"lights_at_sunset",device_type:"light",default_name_key:"recipe.lights_at_sunset.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:18,end:23,start_anchor:"sunset",start_offset:-30,action:{id:"turn_on",value:80}}],weather_rules:[]},{id:"blinds_wind_safety",device_type:"blind",default_name_key:"recipe.blinds_wind_safety.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:7,end:19,start_anchor:"sunrise",start_offset:0,end_anchor:"sunset",end_offset:0,action:{id:"set_position",value:100}}],weather_rules:[{if:"wind_speed > 30",then:"Force close",active:!0,effect:"force_action",block_index:0,action_id:"close_cover",fire_mode:"once_per_daytime"}]},{id:"irrigation_skip_rain",device_type:"irrigation",default_name_key:"recipe.irrigation_skip_rain.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:6,end:6.5,action:{id:"turn_on",value:30}}],weather_rules:[{if:"forecast.rain_6h > 2",then:"Skip",active:!0,effect:"skip",block_index:0}]},{id:"boiler_eco_night",device_type:"boiler",default_name_key:"recipe.boiler_eco_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:6,action:{id:"set_operation",value:"eco"}},{start:6,end:23,action:{id:"set_operation",value:"electric"}},{start:23,end:ht,action:{id:"set_operation",value:"eco"}}],weather_rules:[]},{id:"scene_routine",device_type:"scene",default_name_key:"recipe.scene_routine.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:7,end:8,action:{id:"activate"}},{start:19,end:20,action:{id:"activate"}},{start:22,end:23,action:{id:"activate"}}],weather_rules:[]},{id:"alarm_arm_night",device_type:"alarm",default_name_key:"recipe.alarm_arm_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:7,action:{id:"arm_night"}},{start:7,end:23,action:{id:"disarm"}},{start:23,end:ht,action:{id:"arm_night"}}],weather_rules:[]},{id:"boiler_offgrid_soc",device_type:"boiler",default_name_key:"recipe.boiler_offgrid_soc.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:ht,action:{id:"set_temperature",value:35}}],weather_rules:[{if:"sensor.battery_soc > 96 AND sun.minutes_until_sunset > 120",then:"Boost",active:!0,effect:"force_action",block_index:null,action_id:"set_temperature",action_value:60,fire_mode:"once_per_daytime"}]},{id:"fan_heat_scale",device_type:"fan",default_name_key:"recipe.fan_heat_scale.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:12,end:20,action:{id:"turn_on",value:50}}],weather_rules:[{then:"Scale speed",active:!0,effect:"scale_value",block_index:0,scale_var:"temperature",scale_var_min:24,scale_var_max:34,scale_out_min:30,scale_out_max:100}]},{id:"blinds_summer_shade",device_type:"blind",default_name_key:"recipe.blinds_summer_shade.preset_name",days:[1,1,1,1,1,1,1],date_range:{start_month:6,start_day:1,end_month:9,end_day:15},blocks:[{start:7,end:19,start_anchor:"sunrise",start_offset:0,end_anchor:"sunset",end_offset:0,action:{id:"set_position",value:100}}],weather_rules:[{if:"sun.elevation > 40 AND temperature > 28",then:"Shade 25%",active:!0,effect:"force_action",block_index:0,action_id:"set_position",action_value:25,fire_mode:"once_per_day"}]},{id:"pv_surplus_plug",device_type:"plug",default_name_key:"recipe.pv_surplus_plug.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:11,action:{id:"turn_off"}},{start:11,end:14,action:{id:"turn_on"}},{start:14,end:ht,action:{id:"turn_off"}}],weather_rules:[{if:"solar_radiation < 500",then:"Skip",active:!0,effect:"skip",block_index:1}]},{id:"vacuum_weekday_morning",device_type:"vacuum",default_name_key:"recipe.vacuum_weekday_morning.preset_name",days:[1,1,1,1,1,0,0],blocks:[{start:10,end:10.5,action:{id:"start"}}],weather_rules:[]},{id:"pool_pump_season",device_type:"plug",default_name_key:"recipe.pool_pump_season.preset_name",days:[1,1,1,1,1,1,1],date_range:{start_month:6,start_day:1,end_month:9,end_day:15},blocks:[{start:0,end:8,action:{id:"turn_off"}},{start:8,end:13,action:{id:"turn_on"}},{start:13,end:ht,action:{id:"turn_off"}}],weather_rules:[{then:"Scale filtering time",active:!0,effect:"scale_duration",block_index:1,direction:"forward",scale_var:"temperature",scale_var_min:24,scale_var_max:34,scale_out_min:240,scale_out_max:420}]}];let jt=class extends ce{constructor(){super(...arguments),this.nowHour=0}render(){return j`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <h1 class="page-title">${Ve("help.title")}</h1>
          <p class="page-sub">${Ve("help.subtitle")}</p>
        </div>

        <div class="card">
          <h3 class="card__title" style="margin:0 0 6px">${Ve("help.intro.title")}</h3>
          <p class="text-sm" style="margin:0;color:var(--text-soft);line-height:1.55">
            ${Ve("help.intro.body")}
          </p>
        </div>

        ${this._renderQuickStart()}

        <div class="grid-auto" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
          ${Ft.map(e=>this._renderRecipe(e))}
        </div>

        ${this._renderFaq()}

        <div class="card">
          <h3 class="card__title" style="margin:0 0 10px">${Ve("help.glossary.title")}</h3>
          <div class="col" style="gap:10px">
            ${[["help.glossary.block.title","help.glossary.block.body"],["help.glossary.anchor.title","help.glossary.anchor.body"],["help.glossary.rule.title","help.glossary.rule.body"],["help.glossary.fire_mode.title","help.glossary.fire_mode.body"],["help.glossary.override.title","help.glossary.override.body"]].map(([e,t])=>j`
              <div>
                <div class="fw-600 text-sm">${Ve(e)}</div>
                <div class="text-sm" style="color:var(--text-soft);line-height:1.5">${Ve(t)}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderQuickStart(){return j`
      <div class="card">
        <div class="sp-between" style="align-items:flex-start;margin-bottom:10px">
          <div>
            <h3 class="card__title" style="margin:0">${Ve("help.quickstart.title")}</h3>
            <p class="text-sm" style="margin:4px 0 0;color:var(--text-soft)">${Ve("help.quickstart.subtitle")}</p>
          </div>
          <a class="btn btn--primary" href="https://github.com/Pricesswg/Chronos-Scheduler/blob/main/docs/USER_GUIDE.md"
            target="_blank" rel="noopener noreferrer"
            style="text-decoration:none;white-space:nowrap">
            ${be("info",13)} ${Ve("help.quickstart.open_full_guide")}
          </a>
        </div>
        <ol style="margin:0;padding-left:22px;color:var(--text);font-size:13.5px;line-height:1.55">
          ${[["help.quickstart.s1.title","help.quickstart.s1.body"],["help.quickstart.s2.title","help.quickstart.s2.body"],["help.quickstart.s3.title","help.quickstart.s3.body"],["help.quickstart.s4.title","help.quickstart.s4.body"],["help.quickstart.s5.title","help.quickstart.s5.body"],["help.quickstart.s6.title","help.quickstart.s6.body"]].map(([e,t])=>j`
            <li style="margin-bottom:8px">
              <span class="fw-600">${Ve(e)}</span>
              <span style="color:var(--text-soft)"> · ${Ve(t)}</span>
            </li>
          `)}
        </ol>
      </div>
    `}_renderFaq(){return j`
      <div class="card">
        <h3 class="card__title" style="margin:0 0 10px">${Ve("help.faq.title")}</h3>
        <div class="col" style="gap:14px">
          ${[["help.faq.q1","help.faq.a1"],["help.faq.q2","help.faq.a2"],["help.faq.q3","help.faq.a3"],["help.faq.q4","help.faq.a4"],["help.faq.q5","help.faq.a5"],["help.faq.q6","help.faq.a6"]].map(([e,t])=>j`
            <div>
              <div class="fw-600 text-sm">${Ve(e)}</div>
              <div class="text-sm" style="color:var(--text-soft);line-height:1.55;margin-top:2px">${Ve(t)}</div>
            </div>
          `)}
        </div>
      </div>
    `}_renderRecipe(e){e.blocks.reduce((e,t)=>e+(t.end-t.start),0);const t=e.blocks.some(e=>e.start_anchor||e.end_anchor),i=e.weather_rules.some(e=>"force_action"===e.effect||"scale_duration"===e.effect||"scale_value"===e.effect);return j`
      <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
        <div class="row" style="gap:10px;align-items:flex-start">
          <div class="device-row__icon" style="background:var(--accent-soft);color:var(--accent-ink)">
            ${we(e.device_type,18)}
          </div>
          <div style="flex:1;min-width:0">
            <div class="fw-600">${Ve(`recipe.${e.id}.title`)}</div>
            <div class="text-xs text-mute" style="margin-top:2px">${Ve(`recipe.${e.id}.when`)}</div>
          </div>
        </div>

        ${this._renderTimelinePreview(e)}

        <div class="text-sm" style="color:var(--text-soft);line-height:1.5">
          ${Ve(`recipe.${e.id}.howto`)}
        </div>

        <div class="row" style="gap:6px;flex-wrap:wrap">
          <span class="chip">${e.blocks.length} ${Ve("wizard.step.time").toLowerCase()}</span>
          ${t?j`<span class="chip chip--weather">${be("sun",11)} ${Ve("help.tag.anchored")}</span>`:J}
          ${e.weather_rules.length?j`<span class="chip chip--accent">${be("cloud",11)} ${e.weather_rules.length} ${Ve("nav.weather_rules").toLowerCase()}</span>`:J}
          ${i?j`<span class="chip" style="background:#fef3c7;color:#92400e">${be("bolt",11)} ${Ve("help.tag.trigger")}</span>`:J}
        </div>

        <button class="btn btn--primary" @click=${()=>this._createFromRecipe(e)}>
          ${be("plus",13)} ${Ve("help.create_button")}
        </button>
      </div>
    `}_renderTimelinePreview(e){return j`
      <svg viewBox="0 0 ${280} ${18}" preserveAspectRatio="none"
        style="width:100%;height:18px;border-radius:4px;background:var(--bg-sunken);display:block">
        ${e.blocks.map(t=>{const i=t.start/24*280,a=(t.end-t.start)/24*280;return U`<rect x="${i}" y="0" width="${Math.max(2,a)}" height="${18}" fill="${st(e.device_type,t.action)}" rx="2"/>`})}
      </svg>
    `}async _createFromRecipe(e){const t={id:"",name:Ve(e.default_name_key),device_type:e.device_type,device_ids:[],days:e.days,enabled:!1,blocks:e.blocks.map(e=>({...e,action:{...e.action}})),date_range:e.date_range?{...e.date_range}:null},i=await this.card.doAddSchedule(t);if(i)for(const t of e.weather_rules)await this.card.doSaveRule(zt(t,i.id))}};jt.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],jt.prototype,"card",void 0),e([me({type:Number})],jt.prototype,"nowHour",void 0),jt=e([pe("chronos-help-screen")],jt);let Ut=class extends ce{constructor(){super(...arguments),this.nowHour=0,this._entries=[],this._loading=!1,this._from=this._defaultFromIso(),this._to=this._defaultToIso(),this._scheduleId="",this._outcome="",this._kind="",this._confirmClear=!1}_defaultFromIso(){const e=new Date;return e.setDate(e.getDate()-7),e.toISOString().slice(0,16)}_defaultToIso(){return(new Date).toISOString().slice(0,16)}connectedCallback(){super.connectedCallback(),this._reload()}async _reload(){if(this.card?.hass){this._loading=!0;try{const e={};this._from&&(e.from_ts=new Date(this._from).toISOString()),this._to&&(e.to_ts=new Date(this._to).toISOString()),this._scheduleId&&(e.schedule_id=this._scheduleId),this._outcome&&(e.outcome=this._outcome),this._kind&&(e.kind=this._kind),this._entries=await async function(e,t={}){return e.callWS({type:"chronos/history/list",...t})}(this.card.hass,e)}catch(e){console.error("Chronos: history fetch failed",e),this._entries=[]}finally{this._loading=!1}}}render(){const e=this.card._schedules,t=this._entries.length,i=this._entries.filter(e=>"error"===e.outcome).length,a=t-i;return j`
      <div class="col" style="gap:18px;max-width:1200px">
        <div class="sp-between" style="align-items:flex-start;flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${Ve("history.title")}</h1>
            <p class="page-sub">${Ve("history.subtitle")}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <button class="btn" @click=${()=>this._reload()}>${be("repeat",13)} ${Ve("common.refresh")}</button>
            <button class="btn" style="color:var(--danger)" @click=${()=>{this._confirmClear=!0}}>
              ${be("trash",13)} ${Ve("history.clear")}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="grid-auto" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
            <div class="field">
              <label class="field__label">${Ve("history.from")}</label>
              <input type="datetime-local" class="input mono" .value=${this._from}
                @change=${e=>{this._from=e.target.value,this._reload()}}/>
            </div>
            <div class="field">
              <label class="field__label">${Ve("history.to")}</label>
              <input type="datetime-local" class="input mono" .value=${this._to}
                @change=${e=>{this._to=e.target.value,this._reload()}}/>
            </div>
            <div class="field">
              <label class="field__label">${Ve("history.schedule")}</label>
              <select class="select mono"
                @change=${e=>{this._scheduleId=e.target.value,this._reload()}}>
                <option value="" ?selected=${""===this._scheduleId}>${Ve("history.all_schedules")}</option>
                ${e.map(e=>j`<option value="${e.id}" ?selected=${this._scheduleId===e.id}>${e.name}</option>`)}
              </select>
            </div>
            <div class="field">
              <label class="field__label">${Ve("history.kind")}</label>
              <select class="select mono"
                @change=${e=>{this._kind=e.target.value,this._reload()}}>
                <option value="" ?selected=${""===this._kind}>${Ve("history.kind.all")}</option>
                <option value="block" ?selected=${"block"===this._kind}>${Ve("history.kind.block")}</option>
                <option value="rule" ?selected=${"rule"===this._kind}>${Ve("history.kind.rule")}</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label">${Ve("history.outcome")}</label>
              <select class="select mono"
                @change=${e=>{this._outcome=e.target.value,this._reload()}}>
                <option value="" ?selected=${""===this._outcome}>${Ve("history.outcome.all")}</option>
                <option value="ok" ?selected=${"ok"===this._outcome}>${Ve("history.outcome.ok")}</option>
                <option value="error" ?selected=${"error"===this._outcome}>${Ve("history.outcome.error")}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${Ve("history.kpi.total")}</div>
            <div class="kpi__value">${t}</div>
            <div class="kpi__delta">${Ve("history.kpi.in_range")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("history.kpi.ok")}</div>
            <div class="kpi__value" style="color:var(--ok)">${a}</div>
            <div class="kpi__delta">${t?Math.round(a/t*100):0}%</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("history.kpi.errors")}</div>
            <div class="kpi__value" style="color:${i>0?"var(--danger)":"var(--text-muted)"}">${i}</div>
            <div class="kpi__delta">${t?Math.round(i/t*100):0}%</div>
          </div>
        </div>

        ${this._renderChart()}

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${Ve("history.events")}</h3>
              <p class="card__sub">${Ve("history.events.sub",{n:t})}</p>
            </div>
          </div>
          ${this._loading?j`<div class="text-mute" style="padding:30px;text-align:center">${Ve("common.loading")}</div>`:t?j`<div class="col" style="gap:4px">
                  ${this._entries.slice(0,200).map(e=>this._renderRow(e))}
                  ${this._entries.length>200?j`<div class="text-xs text-mute" style="padding:8px;text-align:center">${Ve("history.truncated",{n:200,total:t})}</div>`:J}
                </div>`:j`<div class="text-mute" style="padding:30px;text-align:center">${Ve("history.empty")}</div>`}
        </div>

        ${this._confirmClear?this._renderClearModal():J}
      </div>
    `}_renderChart(){if(!this._entries.length)return J;const e={};for(const t of this._entries){const i=(t.ts||"").slice(0,10);if(!i)continue;const a=e[i]||{ok:0,err:0};"error"===t.outcome?a.err++:a.ok++,e[i]=a}const t=Object.keys(e).sort();if(!t.length)return J;const i=Math.max(...t.map(t=>e[t].ok+e[t].err)),a=540/Math.max(1,t.length);return j`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("history.chart.title")}</h3><p class="card__sub">${Ve("history.chart.sub")}</p></div></div>
        <svg viewBox="0 0 ${600} ${138}" style="width:100%;height:auto;display:block">
          ${t.map((t,s)=>{const r=e[t],n=r.ok+r.err,o=i>0?100*n/i:0,l=i>0?100*r.err/i:0,d=30+s*a+2,c=110-o,u=110-l,p=Math.max(2,a-4);return U`
              <g>
                <rect x="${d}" y="${c}" width="${p}" height="${o-l}" fill="var(--ok)" rx="2"/>
                <rect x="${d}" y="${u}" width="${p}" height="${l}" fill="var(--danger)" rx="2"/>
                <text x="${d+p/2}" y="${132}" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="var(--font-mono)">${t.slice(5)}</text>
              </g>
            `})}
        </svg>
      </div>
    `}_renderRow(e){const t=new Date(e.ts),i=isNaN(t.getTime())?e.ts:t.toLocaleString(),a="error"===e.outcome,s=Ue(e.device_type,e.action_id,e.action_id),r=void 0===e.value||null===e.value||""===e.value?"":"object"==typeof e.value?JSON.stringify(e.value):String(e.value);return j`
      <div class="col" style="gap:0;padding:8px 12px;border-radius:6px;background:${a?"color-mix(in srgb, var(--danger) 8%, transparent)":"var(--bg-sunken)"};border:1px solid ${a?"color-mix(in srgb, var(--danger) 30%, transparent)":"var(--border-soft)"};user-select:text">
        <div class="row" style="gap:10px">
          <span class="mono text-xs text-mute" style="min-width:140px;flex-shrink:0">${i}</span>
          <span class="chip" style="flex-shrink:0;background:${"rule"===e.kind?"color-mix(in srgb, var(--accent) 12%, transparent)":"system"===e.kind?"color-mix(in srgb, var(--warn) 14%, transparent)":"var(--bg)"};color:${"rule"===e.kind?"var(--accent-ink)":"system"===e.kind?"var(--warn)":"var(--text)"}">
            ${"rule"===e.kind?be("cloud",11):"system"===e.kind?be("repeat",11):be("clock",11)} ${Ve("history.kind."+e.kind)}
          </span>
          <span class="text-sm fw-600" style="min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.schedule_name}">${e.schedule_name||e.schedule_id}</span>
          <span class="text-xs text-mute mono" style="min-width:0;flex:2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.entity_id||""}">
            ${"system"===e.kind?Ve("history.system."+e.action_id)||e.action_id:j`${s}${r?` · ${r}`:""}${e.entity_id?` → ${e.entity_id}`:""}`}
          </span>
          <span class="chip" style="flex-shrink:0;background:${a?"var(--danger)":"var(--ok)"};color:white;border-color:transparent">
            ${Ve(a?"history.outcome.error":"history.outcome.ok")}
          </span>
        </div>
        ${e.error?j`
          <div class="row" style="gap:8px;margin-top:8px;padding:6px 8px;background:color-mix(in srgb, var(--danger) 6%, var(--bg));border-radius:4px;align-items:flex-start">
            <span class="text-xs mono" style="color:var(--danger);flex:1;white-space:pre-wrap;word-break:break-word;user-select:text;-webkit-user-select:text">${e.error}</span>
            <button class="btn btn--icon btn--ghost btn--sm" title="${Ve("history.copy_error")}"
              @click=${t=>this._copyError(t,e.error||"")}>
              ${be("info",12)}
            </button>
          </div>
        `:J}
      </div>
    `}async _copyError(e,t){if(!t)return;const i=e.currentTarget,a=await this._writeClipboard(t);if(i){const e=i.title;i.title=Ve(a?"history.copy_done":"history.copy_failed"),setTimeout(()=>{i.title=e},1500)}}async _writeClipboard(e){try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select();const i=document.execCommand("copy");return document.body.removeChild(t),i}catch{return!1}}_renderClearModal(){return j`
      <div class="modal-overlay" @click=${()=>{this._confirmClear=!1}}>
        <div class="card" style="width:min(420px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${Ve("history.clear")}?</h3>
          <p class="text-sm text-mute" style="margin:0 0 16px">${Ve("history.clear.warn")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmClear=!1}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:var(--danger)"
              @click=${async()=>{if(this._confirmClear=!1,this.card?.hass){try{await async function(e){await e.callWS({type:"chronos/history/clear"})}(this.card.hass)}catch(e){console.error(e)}await this._reload()}}}>${be("trash",12)} ${Ve("common.confirm")}</button>
          </div>
        </div>
      </div>
    `}};Ut.styles=_e,e([me({attribute:!1,hasChanged:()=>!0})],Ut.prototype,"card",void 0),e([me({type:Number})],Ut.prototype,"nowHour",void 0),e([fe()],Ut.prototype,"_entries",void 0),e([fe()],Ut.prototype,"_loading",void 0),e([fe()],Ut.prototype,"_from",void 0),e([fe()],Ut.prototype,"_to",void 0),e([fe()],Ut.prototype,"_scheduleId",void 0),e([fe()],Ut.prototype,"_outcome",void 0),e([fe()],Ut.prototype,"_kind",void 0),e([fe()],Ut.prototype,"_confirmClear",void 0),Ut=e([pe("chronos-history-screen")],Ut);const Gt=[{value:"overview",label:"Overview"},{value:"editor",label:"Schedule editor"},{value:"week",label:"Week view"},{value:"weatherRulesList",label:"Weather rules"},{value:"device",label:"Devices"},{value:"live",label:"Live status"},{value:"wizard",label:"New schedule wizard"},{value:"devices",label:"Manage devices"},{value:"settings",label:"Settings"},{value:"help",label:"Help"}];let Jt=class extends ce{constructor(){super(...arguments),this._config={type:"custom:chronos-card"}}setConfig(e){this._config={...e}}_emit(e){this._config={...this._config,...e},Object.keys(this._config).forEach(e=>{const t=this._config[e];""!==t&&null!=t||delete this._config[e]}),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){const e=this._config;return j`
      <div class="row">
        <label for="title">Card title</label>
        <input id="title" type="text" .value=${e.title||""}
          placeholder="(optional)"
          @input=${e=>this._emit({title:e.target.value})}/>
      </div>
      <div class="row">
        <label for="default_screen">Default screen</label>
        <select id="default_screen"
          @change=${e=>this._emit({default_screen:e.target.value||void 0})}>
          <option value="">Overview (default)</option>
          ${Gt.map(t=>j`
            <option value=${t.value} ?selected=${e.default_screen===t.value}>${t.label}</option>
          `)}
        </select>
      </div>
      <div class="row">
        <label for="collapse_sidebar">Collapsed sidebar</label>
        <input id="collapse_sidebar" type="checkbox" .checked=${!!e.collapse_sidebar}
          @change=${e=>this._emit({collapse_sidebar:e.target.checked})}/>
        <span style="font-size:12.5px;color:var(--secondary-text-color)">Start the card with the sidebar in mini mode (desktop only).</span>
      </div>
      <div class="row">
        <label for="mobile_threshold">Mobile breakpoint (px)</label>
        <input id="mobile_threshold" type="number" min="0" step="10"
          .value=${void 0!==e.mobile_threshold?String(e.mobile_threshold):""}
          placeholder="700"
          @input=${e=>{const t=e.target.value;this._emit({mobile_threshold:""===t?void 0:parseInt(t,10)})}}/>
      </div>
      <div class="info">
        <strong>Chronos has no entity bindings to configure here.</strong>
        Schedules, devices and weather rules are managed inside the card itself
        (the ⚙ Settings screen and the wizard). All of Chronos' state is stored
        by the integration via WebSocket — the card config only controls
        presentation.
        <br><br>
        Minimum YAML: <code>type: custom:chronos-card</code>
      </div>
    `}};Jt.styles=o`
    :host { display: block; padding: 8px 4px; font-family: var(--paper-font-body1_-_font-family, system-ui); }
    .row { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
    label { min-width: 140px; font-size: 13px; color: var(--secondary-text-color, #6b7280); }
    input[type=text], input[type=number], select {
      flex: 1; padding: 8px 10px; border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px; font-size: 14px; background: var(--card-background-color, white);
      color: var(--primary-text-color, #111);
    }
    input[type=checkbox] { width: 18px; height: 18px; }
    .info { background: var(--secondary-background-color, #f9fafb); border-radius: 8px; padding: 12px 14px; font-size: 12.5px; color: var(--secondary-text-color, #6b7280); margin-top: 10px; line-height: 1.45; }
    .info strong { color: var(--primary-text-color, #111); }
    code { background: var(--code-editor-background-color, #f3f4f6); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
  `,e([me({attribute:!1})],Jt.prototype,"hass",void 0),e([fe()],Jt.prototype,"_config",void 0),Jt=e([pe("chronos-card-editor")],Jt);let Zt=class extends ce{constructor(){super(...arguments),this.sourceId="",this._name="",this._deviceIds=[],this._days=[1,1,1,1,1,1,1],this._includeRules=!0,this._hydratedFor=""}render(){const e=this.card._schedules.find(e=>e.id===this.sourceId);if(!e)return J;this._hydrate(e);const t=["scene","automation","service"].includes(e.device_type),i=this.card._devices.filter(t=>t.type===e.device_type),a=this.card.rulesForSchedule(e.id).length;return j`
      <div class="modal-overlay" @click=${()=>this.card.closeDuplicateModal()}>
        <div class="card" style="width:min(560px,100%);max-height:85vh;overflow:auto;padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${be("copy",15)} ${Ve("dup.title")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 16px">${Ve("dup.subtitle",{name:e.name})}</p>

          <div class="field" style="margin-bottom:14px">
            <label class="field__label">${Ve("editor.field.name")}</label>
            <input class="input" .value=${this._name}
              @input=${e=>{this._name=e.target.value}}/>
          </div>

          ${t?J:j`
            <div class="field" style="margin-bottom:14px">
              <label class="field__label">${Ve("nav.devices")}</label>
              <div class="row" style="gap:6px;flex-wrap:wrap">
                ${i.map(e=>{const t=this._deviceIds.includes(e.id);return j`
                    <button class="btn btn--sm" @click=${()=>this._toggleDevice(e.id)}
                      style="background:${t?"var(--accent)":"var(--bg-sunken)"};color:${t?"white":"var(--text)"};border-color:${t?"transparent":"var(--border-soft)"}">
                      ${t?be("check",11):J} ${we(e.type,11)} ${e.alias}
                    </button>
                  `})}
                ${i.length?J:j`<span class="text-xs text-mute">${Ve("editor.devices_empty")}</span>`}
              </div>
            </div>
          `}

          <div class="field" style="margin-bottom:14px">
            <label class="field__label">${Ve("editor.days.repeat")}</label>
            <div class="row" style="gap:4px">
              ${wt().map((e,t)=>{const i=this._days[t];return j`
                  <button class="mono" @click=${()=>{const e=[...this._days];e[t]=e[t]?0:1,this._days=e}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text-muted)"};border:1px solid ${i?"transparent":"var(--border-soft)"};cursor:pointer">
                    ${e}
                  </button>
                `})}
            </div>
          </div>

          ${a?j`
            <label class="row" style="gap:8px;cursor:pointer;margin-bottom:14px">
              <input type="checkbox" .checked=${this._includeRules}
                @change=${e=>{this._includeRules=e.target.checked}}/>
              <span class="text-sm">${Ve("dup.include_rules",{n:a})}</span>
            </label>
          `:J}

          <p class="text-xs text-mute" style="margin:0 0 16px">${Ve("dup.disabled_note")}</p>

          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>this.card.closeDuplicateModal()}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" ?disabled=${!this._name.trim()} @click=${()=>this._confirm(e)}>
              ${be("check",13)} ${Ve("dup.create")}
            </button>
          </div>
        </div>
      </div>
    `}_hydrate(e){this._hydratedFor!==e.id&&(this._hydratedFor=e.id,this._name=Ve("dup.copy_of",{name:e.name}),this._deviceIds=[...e.device_ids||[]],this._days=[...e.days||[1,1,1,1,1,1,1]],this._includeRules=!0)}_toggleDevice(e){this._deviceIds=this._deviceIds.includes(e)?this._deviceIds.filter(t=>t!==e):[...this._deviceIds,e]}async _confirm(e){const t=function(e,t){const i=JSON.parse(JSON.stringify(e));i.id="",i.name=t.name,i.device_ids=[...t.device_ids],i.days=[...t.days],i.enabled=!1,delete i.weather_rules;const a=new Set(i.device_ids);for(const e of i.blocks||[])if(Array.isArray(e.device_ids)){const t=e.device_ids.filter(e=>a.has(e));t.length?e.device_ids=t:delete e.device_ids}return i}(e,{name:this._name.trim(),device_ids:this._deviceIds,days:this._days});this.card.closeDuplicateModal();const i=await this.card.doAddSchedule(t);if(i&&this._includeRules)for(const t of this.card.rulesForSchedule(e.id))await this.card.doSaveRule(zt(t,i.id))}};var Kt;Zt.styles=_e,e([me({attribute:!1})],Zt.prototype,"card",void 0),e([me()],Zt.prototype,"sourceId",void 0),e([fe()],Zt.prototype,"_name",void 0),e([fe()],Zt.prototype,"_deviceIds",void 0),e([fe()],Zt.prototype,"_days",void 0),e([fe()],Zt.prototype,"_includeRules",void 0),Zt=e([pe("chronos-duplicate-modal")],Zt);const Qt={overview:["screen.overview.title","chronos / overview"],editor:["screen.editor.title","chronos / schedule / edit"],weatherRule:["screen.weather_rule.title","chronos / schedule / weather"],weatherRulesList:["nav.weather_rules","chronos / weather"],device:["screen.device.title","chronos / device"],week:["screen.week.title","chronos / week"],live:["screen.live.title","chronos / live"],wizard:["screen.wizard.title","chronos / wizard"],devices:["screen.devices.title","chronos / devices"],settings:["screen.settings.title","chronos / settings"],help:["nav.help","chronos / help"],history:["screen.history.title","chronos / history"]};let Xt=Kt=class extends ce{constructor(){super(...arguments),this._screen="overview",this._selectedId="",this._deviceDetailId="",this._schedules=[],this._savedSchedules=[],this._rules=[],this._devices=[],this._settings=null,this._pendingNav=null,this._loading=!0,this._loadError=null,this._actionsMap={},this._weatherAttributes=[],this._forecast=[],this._availableEntities=[],this._weatherEntities=[],this._sensorEntities=[],this._sceneEntities=[],this._automationEntities=[],this._mobile=!1,this._drawerOpen=!1,this._desktopCollapsed=!1,this._editingRuleId="",this._duplicateSourceId="",this._screenInitialised=!1,this._windowResizeBound=()=>this._checkPanelMode(),this._appliedLang="",this._retryCount=0,this._retryTimer=null}setConfig(e){this.config=e||{},e?.default_screen&&!this._screenInitialised&&(this._screen=e.default_screen,this._screenInitialised=!0),void 0!==e?.collapse_sidebar&&(this._desktopCollapsed=!!e.collapse_sidebar),this.isConnected&&this._checkPanelMode()}static getStubConfig(){return{type:"custom:chronos-card"}}static getConfigElement(){return document.createElement("chronos-card-editor")}_checkPanelMode(){if(!this.isConnected)return;const e=this.config?.panel_mode;let t;if(!0===e)t=!0;else if(!1===e)t=!1;else{const e=this.getBoundingClientRect();t=e.top<30&&e.height>200}this.hasAttribute("panel-mode")!==t&&this.toggleAttribute("panel-mode",t);const i=this.config?.panel_offset;"number"==typeof i&&i>=0?this.style.setProperty("--chronos-panel-offset",`${i}px`):this.style.removeProperty("--chronos-panel-offset")}connectedCallback(){super.connectedCallback(),this.hass&&this._applyLanguage(),this._checkPanelMode(),setTimeout(()=>this._checkPanelMode(),50),setTimeout(()=>this._checkPanelMode(),250),window.addEventListener("resize",this._windowResizeBound,{passive:!0}),this._resizeObserver=new ResizeObserver(e=>{this._checkPanelMode();for(const t of e){const e=this.config?.mobile_threshold,i="number"==typeof e?e:700;this._mobile=i>0&&t.contentRect.width<i}}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect(),window.removeEventListener("resize",this._windowResizeBound),this._retryTimer&&(clearTimeout(this._retryTimer),this._retryTimer=null)}async firstUpdated(){this._checkPanelMode(),await this._loadAll()}updated(e){e.has("hass")&&this.hass&&(!function(e){bt=e}(this.hass),this._applyLanguage()),e.has("_settings")&&this._settings&&(this._settings.density&&this.setAttribute("density",this._settings.density),this._applyLanguage())}_applyLanguage(){const e=this._settings?.language,t=function(e){const t=(e||"").toLowerCase().split("-")[0];return We=Le.includes(t)?t:"it",We}(e&&"auto"!==e?e:this.hass?.language);this._appliedLang!==t&&(this._appliedLang=t,this.requestUpdate())}async _loadAll(){if(!this.hass)return;this._retryTimer&&(clearTimeout(this._retryTimer),this._retryTimer=null),this._loading=!0,this._loadError=null;const e=async(e,t,i)=>{try{return await e()}catch(e){console.error(`Chronos: ${i} failed`,e);const a=e?.message||String(e);return this._loadError=(this._loadError?this._loadError+" · ":"")+`${i}: ${a}`,t}};try{const[t,i,a,s,r,n,o,l,d,c,u,p]=await Promise.all([e(()=>ot(this.hass),[],"devices/list"),e(()=>lt(this.hass),[],"schedules/list"),e(()=>ct(this.hass),[],"rules/list"),e(()=>ut(this.hass),null,"settings/get"),e(()=>async function(e){return e.callWS({type:"chronos/actions"})}(this.hass),{},"actions"),e(()=>async function(e){return e.callWS({type:"chronos/weather/attributes"})}(this.hass),[],"weather/attributes"),e(()=>async function(e){return e.callWS({type:"chronos/preview/forecast"})}(this.hass),[],"preview/forecast"),e(()=>pt(this.hass),[],"entities/available"),e(()=>async function(e){return e.callWS({type:"chronos/weather/entities"})}(this.hass),[],"weather/entities"),e(()=>async function(e){return e.callWS({type:"chronos/sensor/entities"})}(this.hass),[],"sensor/entities"),e(()=>async function(e){return e.callWS({type:"chronos/scene/entities"})}(this.hass),[],"scene/entities"),e(()=>async function(e){return e.callWS({type:"chronos/automation/entities"})}(this.hass),[],"automation/entities")]);this._devices=t,this._schedules=i,this._rules=a,this._savedSchedules=JSON.parse(JSON.stringify(i)),this._settings=s,this._actionsMap=r,this._weatherAttributes=n,this._forecast=o,this._availableEntities=l,this._weatherEntities=d,this._sensorEntities=c,this._sceneEntities=u,this._automationEntities=p,et=r,Xe(s),s?.snap_minutes&&gt(s.snap_minutes),i.length&&!this._selectedId&&(this._selectedId=i[0].id),t.length&&!this._deviceDetailId&&(this._deviceDetailId=t[0].id)}catch(e){console.error("Chronos: failed to load data",e)}if(this._loading=!1,this._loadError&&this._retryCount<Kt._RETRY_DELAYS_MS.length){const e=Kt._RETRY_DELAYS_MS[this._retryCount++];console.info(`Chronos: load failed, retrying in ${e/1e3}s (attempt ${this._retryCount})`),this._retryTimer=setTimeout(()=>{this._retryTimer=null,this._loadAll()},e)}else this._loadError||(this._retryCount=0)}navigate(e){JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)&&"editor"===this._screen&&"editor"!==e?this._pendingNav=e:this._screen=e,"weatherRule"!==this._screen&&(this._editingRuleId=""),this._drawerOpen=!1}editWeatherRule(e,t){t&&(this._selectedId=t),this._editingRuleId=e,this._screen="weatherRule"}rulesForSchedule(e){const t=[];for(const i of this._rules)for(const a of i.targets||[])a.schedule_id===e&&t.push({...i,block_index:a.block_index??null});return t}async doSaveRule(e){try{const t=await async function(e,t){return e.callWS({type:"chronos/rules/save",rule:t})}(this.hass,e);return this._rules=await ct(this.hass),t}catch(e){return console.error("Chronos: saveRule failed",e),null}}async doRemoveRule(e){try{await async function(e,t){await e.callWS({type:"chronos/rules/remove",rule_id:String(t)})}(this.hass,e)}catch(e){console.error("Chronos: removeRule failed",e)}this._rules=await ct(this.hass)}async reorderRules(e){const t=new Map(this._rules.map(e=>[e.id,e])),i=e.map(e=>t.get(e)).filter(Boolean);for(const t of this._rules)e.includes(t.id)||i.push(t);this._rules=i;try{this._rules=await async function(e,t){return e.callWS({type:"chronos/rules/reorder",order:t})}(this.hass,e)}catch(e){console.error("Chronos: reorderRules failed",e),this._rules=await ct(this.hass)}}async toggleRuleActive(e,t){const i=this._rules.find(t=>t.id===e);i&&await this.doSaveRule({...i,active:t})}async unlinkRuleFromSchedule(e,t){const i=this._rules.find(t=>t.id===e);if(!i)return;const a=(i.targets||[]).filter(e=>e.schedule_id!==t);a.length?await this.doSaveRule({...i,targets:a}):await this.doRemoveRule(e)}async openDuplicateModal(e){this.isDirty&&await this.saveCurrentSchedule(),this._duplicateSourceId=e}closeDuplicateModal(){this._duplicateSourceId=""}selectSchedule(e,t){this._selectedId=e,t&&(this._screen=t)}selectDevice(e){this._deviceDetailId=e}get isDirty(){return JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)}async saveCurrentSchedule(){await this.saveScheduleById(this._selectedId)}async saveScheduleById(e){const t=this._schedules.find(t=>t.id===e);if(!t)return;const i=this._findIrrigationConflict(t);if(i){if(!!this._settings?.irrigation_conflict_block)return void alert(Ve("editor.irrigation.conflict.blocked"));if(!confirm(Ve("editor.irrigation.conflict.warn",{valve:i})+"\n\n"+Ve("common.confirm")+"?"))return}const a=await dt(this.hass,t),s=this._schedules.findIndex(e=>e.id===a.id);s>=0&&(this._schedules=[...this._schedules.slice(0,s),a,...this._schedules.slice(s+1)]),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}_findIrrigationConflict(e){if("irrigation"!==e.device_type)return null;const t=new Set;for(const i of e.blocks||[])if("sequential"===i.action?.mode)for(const e of i.action.sequence||[])t.add(e.entity_id);if(!t.size)return null;const i=(e,t)=>e.some((e,i)=>e&&t[i]);for(const a of this._schedules)if(a.id!==e.id&&"irrigation"===a.device_type&&a.enabled&&e.enabled&&i(e.days||[],a.days||[]))for(const e of a.blocks||[])if("sequential"===e.action?.mode)for(const i of e.action.sequence||[])if(t.has(i.entity_id))return i.entity_id;return null}updateScheduleLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,...t}:i)}updateBlocksLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,blocks:[...t].sort((e,t)=>e.start-t.start)}:i)}async doToggleSchedule(e,t){try{await async function(e,t,i){await e.callWS({type:"chronos/schedules/toggle",schedule_id:String(t),enabled:i})}(this.hass,e,t),this._schedules=this._schedules.map(i=>i.id===e?{...i,enabled:t}:i),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: toggleSchedule failed",e),await this._reloadAfterError()}}async doAddDevice(e,t){try{await async function(e,t,i,a){return e.callWS({type:"chronos/devices/add",entity_id:t,alias:i,area:a})}(this.hass,e,t)}catch(e){console.error("Chronos: addDevice failed",e)}this._devices=await ot(this.hass),this._availableEntities=await pt(this.hass)}async doUpdateDevice(e,t){try{await async function(e,t,i){return e.callWS({type:"chronos/devices/update",device_id:String(t),patch:i})}(this.hass,e,t)}catch(e){console.error("Chronos: updateDevice failed",e)}this._devices=await ot(this.hass)}async doRemoveDevice(e){try{await async function(e,t){await e.callWS({type:"chronos/devices/remove",device_id:String(t)})}(this.hass,e)}catch(e){throw console.error("Chronos: removeDevice WS failed",e),e}try{this._devices=await ot(this.hass)}catch(e){console.error("Chronos: fetchDevices after remove failed",e)}try{this._schedules=await lt(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: fetchSchedules after remove failed",e)}try{this._availableEntities=await pt(this.hass)}catch(e){console.error("Chronos: fetchAvailableEntities after remove failed",e)}}async doRemoveSchedule(e){try{await async function(e,t){await e.callWS({type:"chronos/schedules/remove",schedule_id:String(t)})}(this.hass,e)}catch(e){console.error("Chronos: removeSchedule failed",e)}this._schedules=await lt(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId===e&&this._schedules.length?this._selectedId=this._schedules[0].id:this._schedules.length||(this._selectedId="")}async createSceneSchedule(){const e={id:"",name:Ve("overview.new_scene_default_name"),device_type:"scene",device_ids:[],days:[1,1,1,1,1,1,1],enabled:!0,blocks:[{start:8,end:9,action:{id:"activate"}}]};await this.doAddSchedule(e)}async createAutomationSchedule(){const e={id:"",name:Ve("overview.new_automation_default_name"),device_type:"automation",device_ids:[],days:[1,1,1,1,1,1,1],enabled:!0,blocks:[{start:8,end:9,action:{id:"turn_on"}}]};await this.doAddSchedule(e)}async createServiceSchedule(){const e={id:"",name:Ve("overview.new_service_default_name"),device_type:"service",device_ids:[],days:[1,1,1,1,1,1,1],enabled:!0,blocks:[{start:8,end:9,action:{id:"call_service",value:""}}]};await this.doAddSchedule(e)}async doAddSchedule(e){try{const t=await dt(this.hass,e);return this._schedules=await lt(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId=t.id,this._screen="editor",t}catch(e){return console.error("Chronos: addSchedule failed",e),null}}async doUpdateSettings(e){try{const t=await async function(e,t){return e.callWS({type:"chronos/settings/update",patch:t})}(this.hass,e);this._settings=t}catch(e){console.error("Chronos: updateSettings failed",e),this._settings=await ut(this.hass)}Xe(this._settings),this._settings?.snap_minutes&&gt(this._settings.snap_minutes)}async reloadAll(){await this._loadAll()}async _reloadAfterError(){try{this._devices=await ot(this.hass),this._schedules=await lt(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._settings=await ut(this.hass)}catch{}}async setTimelineVariant(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,timeline_variant:t}:i);const i=this._savedSchedules.find(t=>t.id===e);if(i){i.timeline_variant=t;try{await dt(this.hass,i)}catch(e){console.error("Chronos: failed to persist timeline variant",e)}}}render(){if(this._loading)return j`<div style="padding:40px;text-align:center;color:var(--text-muted)">${Ve("common.loading")}</div>`;const e=this._loadError?j`<div style="margin:10px;padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:4px;font-size:12.5px;font-family:ui-monospace,monospace">
          Chronos load errors: ${this._loadError}
          ${this._retryTimer?j`<div style="margin-top:6px;font-weight:600">${Ve("load.retry.hint")}</div>`:J}
        </div>`:J,[t,i]=Qt[this._screen]||Qt.overview,a=Ve(t),s=new Date,r=s.getHours()+s.getMinutes()/60,n=this._mobile&&this._drawerOpen;let o;o=this._mobile?n?"drawer":"mini":this._desktopCollapsed?"mini":"full";const l=this.config?.title;return j`
      ${e}
      ${l?j`<div class="card-header" style="padding:14px 18px 6px;font-size:18px;font-weight:600;letter-spacing:-0.01em">${l}</div>`:J}
      <div class="app" data-mobile="${this._mobile}" data-drawer="${n}">
        ${this._renderSidebar(o)}
        ${n?j`<div class="sidebar-backdrop" @click=${()=>{this._drawerOpen=!1}}></div>`:J}
        <main class="content">
          ${this._renderTopbar(a,i,r)}
          <div class="content__inner">
            ${this._renderScreen(r)}
          </div>
        </main>
        ${this._pendingNav?this._renderDirtyModal():J}
        ${this._duplicateSourceId?j`<chronos-duplicate-modal .card=${this} .sourceId=${this._duplicateSourceId}></chronos-duplicate-modal>`:J}
      </div>
    `}_renderSidebar(e){const t=[{key:"overview",label:Ve("nav.overview"),iconName:"dashboard"},{key:"editor",label:Ve("nav.editor"),iconName:"clock"},{key:"week",label:Ve("nav.week"),iconName:"calendar"},{key:"weatherRulesList",label:Ve("nav.weather_rules"),iconName:"cloud"},{key:"device",label:Ve("nav.devices"),iconName:"device"},{key:"live",label:Ve("nav.live"),iconName:"live"},{key:"history",label:Ve("nav.history"),iconName:"history"}],i=[{key:"wizard",label:Ve("nav.new_schedule"),iconName:"wand"},{key:"devices",label:Ve("nav.manage_devices"),iconName:"device"},{key:"help",label:Ve("nav.help"),iconName:"info"}],a="mini"===e;return j`
      <aside class="sidebar" data-mode="${e}">
        ${j`
              <button class="sidebar__hamburger" title="${Ve(a?"nav.menu_open":"nav.menu_close")}"
                @click=${()=>{this._mobile?this._drawerOpen=!this._drawerOpen:this._desktopCollapsed=!this._desktopCollapsed}}>
                ${be(a?"menu":"close",18)}
              </button>
            `}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark" style="background:transparent;box-shadow:none;padding:0;overflow:hidden">
            <img src="/local/chronos-icon.png?v=${nt}" alt="Chronos"
              style="width:100%;height:100%;object-fit:contain;display:block"
              @error=${e=>{e.target.style.display="none",e.target.parentElement.textContent="C",e.target.parentElement.style.background="linear-gradient(135deg, var(--accent), var(--weather))",e.target.parentElement.style.color="white"}}/>
          </div>
          ${a?J:j`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v${nt} · HACS</div>
              </div>`}
        </div>
        ${a?J:j`<div class="nav-section">${Ve("nav.section.main")}</div>`}
        ${t.map(e=>j`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${a?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${be(e.iconName,16)} ${a?J:j`<span>${e.label}</span>`}
            </button>
          `)}
        ${a?J:j`<div class="nav-section">${Ve("nav.section.actions")}</div>`}
        ${i.map(e=>j`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${a?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${be(e.iconName,16)} ${a?J:j`<span>${e.label}</span>`}
            </button>
          `)}
        <div class="sidebar__footer">
          <button class="nav-item" data-active="${"settings"===this._screen}"
            title="${a?Ve("nav.settings"):""}" @click=${()=>this.navigate("settings")}>
            ${be("settings",16)} ${a?J:j`<span>${Ve("nav.settings")}</span>`}
          </button>
        </div>
      </aside>
    `}_renderTopbar(e,t,i){return j`
      <div class="topbar">
        <div>
          <div class="topbar__title">${e}</div>
          <div class="topbar__crumbs">${t}</div>
        </div>
        <div class="topbar__spacer"></div>
        <div class="topbar__time">
          <span class="time-dot"></span>
          <span>${vt(i)}</span>
        </div>
      </div>
    `}_renderScreen(e){switch(this._screen){case"overview":default:return j`<chronos-overview .card=${this} .nowHour=${e}></chronos-overview>`;case"editor":return j`<chronos-editor .card=${this} .nowHour=${e}></chronos-editor>`;case"weatherRule":return j`<chronos-weather-rule .card=${this} .nowHour=${e}></chronos-weather-rule>`;case"weatherRulesList":return j`<chronos-weather-rules-list .card=${this} .nowHour=${e}></chronos-weather-rules-list>`;case"device":return j`<chronos-device-screen .card=${this} .nowHour=${e}></chronos-device-screen>`;case"week":return j`<chronos-week .card=${this} .nowHour=${e}></chronos-week>`;case"live":return j`<chronos-live .card=${this} .nowHour=${e}></chronos-live>`;case"wizard":return j`<chronos-wizard .card=${this} .nowHour=${e}></chronos-wizard>`;case"devices":return j`<chronos-devices-screen .card=${this} .nowHour=${e}></chronos-devices-screen>`;case"settings":return j`<chronos-settings-screen .card=${this} .nowHour=${e}></chronos-settings-screen>`;case"help":return j`<chronos-help-screen .card=${this} .nowHour=${e}></chronos-help-screen>`;case"history":return j`<chronos-history-screen .card=${this} .nowHour=${e}></chronos-history-screen>`}}_renderDirtyModal(){return j`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">${Ve("modal.unsaved.title")}</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">${Ve("modal.unsaved.body")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${()=>{this._pendingNav=null}}>${Ve("modal.unsaved.stay")}</button>
            <button class="btn" @click=${()=>{this._schedules=JSON.parse(JSON.stringify(this._savedSchedules)),this._screen=this._pendingNav,this._pendingNav=null}}>${Ve("modal.unsaved.discard")}</button>
            <button class="btn btn--primary" @click=${async()=>{await this.saveCurrentSchedule(),this._screen=this._pendingNav,this._pendingNav=null}}>${be("check",14)} ${Ve("modal.unsaved.save")}</button>
          </div>
        </div>
      </div>
    `}};Xt.styles=[ge,_e],Xt._RETRY_DELAYS_MS=[2e3,5e3,1e4,2e4],e([me({attribute:!1})],Xt.prototype,"hass",void 0),e([me({attribute:!1})],Xt.prototype,"config",void 0),e([fe()],Xt.prototype,"_screen",void 0),e([fe()],Xt.prototype,"_selectedId",void 0),e([fe()],Xt.prototype,"_deviceDetailId",void 0),e([fe()],Xt.prototype,"_schedules",void 0),e([fe()],Xt.prototype,"_savedSchedules",void 0),e([fe()],Xt.prototype,"_rules",void 0),e([fe()],Xt.prototype,"_devices",void 0),e([fe()],Xt.prototype,"_settings",void 0),e([fe()],Xt.prototype,"_pendingNav",void 0),e([fe()],Xt.prototype,"_loading",void 0),e([fe()],Xt.prototype,"_loadError",void 0),e([fe()],Xt.prototype,"_actionsMap",void 0),e([fe()],Xt.prototype,"_weatherAttributes",void 0),e([fe()],Xt.prototype,"_forecast",void 0),e([fe()],Xt.prototype,"_availableEntities",void 0),e([fe()],Xt.prototype,"_weatherEntities",void 0),e([fe()],Xt.prototype,"_sensorEntities",void 0),e([fe()],Xt.prototype,"_sceneEntities",void 0),e([fe()],Xt.prototype,"_automationEntities",void 0),e([fe()],Xt.prototype,"_mobile",void 0),e([fe()],Xt.prototype,"_drawerOpen",void 0),e([fe()],Xt.prototype,"_desktopCollapsed",void 0),e([fe()],Xt.prototype,"_editingRuleId",void 0),e([fe()],Xt.prototype,"_duplicateSourceId",void 0),Xt=Kt=e([pe("chronos-card")],Xt),window.customCards=window.customCards||[],window.customCards.push({type:"chronos-card",name:"Chronos Scheduler",description:"Advanced scheduler for Home Assistant with weather-based rules",preview:!1,documentationURL:"https://github.com/Pricesswg/Chronos-Scheduler"});try{console.info(`%c[Chronos] card v${nt} loaded · custom element registered`,"color:#10b981;font-weight:600")}catch{}export{Xt as ChronosCard};
