function e(e,t,i,s){var a,n=arguments.length,r=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var o=e.length-1;o>=0;o--)(a=e[o])&&(r=(n<3?a(r):n>3?a(t,i,r):a(t,i))||r);return n>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),a=new WeakMap;let n=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new n(i,e,s)},o=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new n("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:u,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,v=globalThis,m=v.trustedTypes,f=m?m.emptyScript:"",g=v.reactiveElementPolyfillSupport,_=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);a?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...u(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const n=a.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i,s=!1,a){if(void 0!==e){const n=this.constructor;if(!1===s&&(a=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??x)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:a},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==a||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[_("elementProperties")]=new Map,$[_("finalized")]=new Map,g?.({ReactiveElement:$}),(v.reactiveElementVersions??=[]).push("2.1.2");const y=globalThis,k=e=>e,S=y.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+M,E=`<${C}>`,B=document,I=()=>B.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,D="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,O=/>/g,L=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,W=/"/g,V=/^(?:script|style|textarea|title)$/i,j=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),q=j(1),F=j(2),U=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,J=B.createTreeWalker(B,129);function K(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const X=(e,t)=>{const i=e.length-1,s=[];let a,n=2===t?"<svg>":3===t?"<math>":"",r=T;for(let t=0;t<i;t++){const i=e[t];let o,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===T?"!--"===l[1]?r=H:void 0!==l[1]?r=O:void 0!==l[2]?(V.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=L):void 0!==l[3]&&(r=L):r===L?">"===l[0]?(r=a??T,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,o=l[1],r=void 0===l[3]?L:'"'===l[3]?W:P):r===W||r===P?r=L:r===H||r===O?r=T:(r=L,a=void 0);const u=r===L&&e[t+1].startsWith("/>")?" ":"";n+=r===T?i+E:d>=0?(s.push(o),i.slice(0,d)+z+i.slice(d)+M+u):i+M+(-2===d?t:u)}return[K(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Q{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let a=0,n=0;const r=e.length-1,o=this.parts,[l,d]=X(e,t);if(this.el=Q.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&o.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(z)){const t=d[n++],i=s.getAttribute(e).split(M),r=/([.?@])?(.*)/.exec(t);o.push({type:1,index:a,name:r[2],strings:i,ctor:"."===r[1]?se:"?"===r[1]?ae:"@"===r[1]?ne:ie}),s.removeAttribute(e)}else e.startsWith(M)&&(o.push({type:6,index:a}),s.removeAttribute(e));if(V.test(s.tagName)){const e=s.textContent.split(M),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],I()),J.nextNode(),o.push({type:2,index:++a});s.append(e[t],I())}}}else if(8===s.nodeType)if(s.data===C)o.push({type:2,index:a});else{let e=-1;for(;-1!==(e=s.data.indexOf(M,e+1));)o.push({type:7,index:a}),e+=M.length-1}a++}}static createElement(e,t){const i=B.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,s){if(t===U)return t;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const n=N(t)?void 0:t._$litDirective$;return a?.constructor!==n&&(a?._$AO?.(!1),void 0===n?a=void 0:(a=new n(e),a._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(t=Y(e,a._$AS(e,t.values),a,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??B).importNode(t,!0);J.currentNode=s;let a=J.nextNode(),n=0,r=0,o=i[0];for(;void 0!==o;){if(n===o.index){let t;2===o.type?t=new te(a,a.nextSibling,this,e):1===o.type?t=new o.ctor(a,o.name,o.strings,this,e):6===o.type&&(t=new re(a,this,e)),this._$AV.push(t),o=i[++r]}n!==o?.index&&(a=J.nextNode(),n++)}return J.currentNode=B,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),N(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>R(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new Q(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const a of e)s===t.length?t.push(i=new te(this.O(I()),this.O(I()),this,this.options)):i=t[s],i._$AI(a),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,a){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,s){const a=this.strings;let n=!1;if(void 0===a)e=Y(this,e,t,0),n=!N(e)||e!==this._$AH&&e!==U,n&&(this._$AH=e);else{const s=e;let r,o;for(e=a[0],r=0;r<a.length-1;r++)o=Y(this,s[i+r],t,r),o===U&&(o=this._$AH[r]),n||=!N(o)||o!==this._$AH[r],o===G?e=G:e!==G&&(e+=(o??"")+a[r+1]),this._$AH[r]=o}n&&!s&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class ae extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ne extends ie{constructor(e,t,i,s,a){super(e,t,i,s,a),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??G)===U)return;const i=this._$AH,s=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const oe=y.litHtmlPolyfillSupport;oe?.(Q,te),(y.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;class de extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let a=s._$litPart$;if(void 0===a){const e=i?.renderBefore??null;s._$litPart$=a=new te(t.insertBefore(I(),e),e,void 0,i??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}}de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");const ue=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x},pe=(e=he,t,i)=>{const{kind:s,metadata:a}=i;let n=globalThis.litPropertyMetadata.get(a);if(void 0===n&&globalThis.litPropertyMetadata.set(a,n=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const a=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,a,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const a=this[s];t.call(this,i),this.requestUpdate(s,a,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ve(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function me(e){return ve({...e,state:!0,attribute:!1})}const fe=r`
  :host {
    display: block;
    height: 100%;
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
`,ge=r`
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
  }

  .sidebar {
    width: 244px;
    background: var(--bg-soft);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 18px 14px;
    gap: 4px;
    min-height: 0;
    overflow-y: auto;
    position: relative;
    z-index: 30;
    transition: width 180ms ease;
  }
  .sidebar[data-mode="mini"] {
    width: 64px;
    padding: 10px 8px;
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

  .tl-weather { position: absolute; top: 0; left: 0; right: 0; height: 6px; display: flex; }
  .tl-weather__cell { flex: 1; }
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

  .forecast-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
  .forecast-cell {
    flex: 1; min-width: 58px; text-align: center; padding: 10px 6px;
    border-radius: var(--r-md); background: var(--bg-sunken); border: 1px solid var(--border-soft);
  }
  .forecast-cell__hour { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }
  .forecast-cell__icon { color: var(--weather-ink); margin: 6px 0 4px; }
  .forecast-cell__icon svg { width: 20px; height: 20px; }
  .forecast-cell__temp { font-size: 13px; font-weight: 600; font-family: var(--font-mono); }

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
  .wizard-stepper { display: flex; gap: 6px; margin-bottom: 24px; }
  .wizard-step {
    flex: 1; display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; border-radius: var(--r-md);
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    font-size: 12.5px; color: var(--text-muted); font-weight: 500;
  }
  .wizard-step[data-state="active"] { background: var(--accent-soft); color: var(--accent-ink); border-color: transparent; }
  .wizard-step[data-state="done"] { background: color-mix(in srgb, var(--ok) 12%, transparent); color: var(--ok); border-color: transparent; }
  .wizard-step__num {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--surface); border: 1px solid var(--border);
    display: grid; place-items: center; font-size: 11px; font-weight: 600;
    font-family: var(--font-mono);
  }
  .wizard-step[data-state="done"] .wizard-step__num { background: var(--ok); color: white; border-color: transparent; }
  .wizard-step[data-state="active"] .wizard-step__num { background: var(--accent); color: white; border-color: transparent; }

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
    .wr-vars { max-height: 260px; }
    .segmented button { padding: 5px 8px; font-size: 11.5px; }
    .btn { padding: 7px 10px; font-size: 12.5px; }
  }
`;function _e(e,t=16,i=1.6){const s=t,a=i;switch(e){case"dashboard":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`;case"calendar":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;case"clock":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;case"cloud":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 10a3.5 3.5 0 0 1-.5 7H7z"/></svg>`;case"sun":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>`;case"rain":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 8a3.5 3.5 0 0 1-.5 7"/><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"/></svg>`;case"snow":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7l14 10M19 7 5 17"/></svg>`;case"device":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/></svg>`;case"live":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"/></svg>`;case"settings":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;case"wand":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4"/><path d="m3 21 9-9"/><path d="M12.5 11.5 14 10l2 2-1.5 1.5z"/></svg>`;case"plus":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;case"chevron-right":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`;case"chevron-left":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>`;case"play":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></svg>`;case"pause":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>`;case"thermostat":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="12" rx="2"/><circle cx="12" cy="17" r="3.5"/><path d="M12 8v7"/></svg>`;case"light":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3V17h6v-1.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3z"/></svg>`;case"blind":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M4 4v14h16V4M4 8h16M4 12h16M4 16h16M11 20v2M13 20v2"/></svg>`;case"irrigation":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z"/></svg>`;case"plug":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5"/></svg>`;case"fan":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10V5a4 4 0 0 1 4 4M14 12h5a4 4 0 0 1-4 4M12 14v5a4 4 0 0 1-4-4M10 12H5a4 4 0 0 1 4-4"/></svg>`;case"boiler":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M9 16h6"/></svg>`;case"mower":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-1 3a2 2 0 0 1-2 1.5H6A2 2 0 0 1 4 18zM7 15v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M10 7V4M14 7V4"/></svg>`;case"vacuum":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2"/></svg>`;case"repeat":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 12v-2a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 0 1-4 4H3"/></svg>`;case"bolt":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>`;case"check":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`;case"close":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`;case"menu":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;case"info":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>`;case"edit":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/></svg>`;case"trash":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`;case"temp":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0z"/></svg>`;case"droplet":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/></svg>`;case"wind":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h9"/></svg>`;case"power":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9M6 6a8 8 0 1 0 12 0"/></svg>`;case"moon":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>`;case"shield":return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8.6 8 9 4.6-.4 8-4.5 8-9V6z"/></svg>`;default:return F`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`}}const be={thermostat:"thermostat",light:"light",blind:"blind",irrigation:"irrigation",plug:"plug",fan:"fan",boiler:"boiler",mower:"mower",vacuum:"vacuum",scene:"wand",automation:"wand",alarm:"shield"};function xe(e,t=16){return _e(be[e]||"device",t)}const we={sun:"sun",sunny:"sun",rain:"rain",rainy:"rain",cloud:"cloud",cloudy:"cloud",partlycloudy:"cloud",snow:"snow",snowy:"snow",fog:"cloud",windy:"wind"};function $e(e,t=16){return _e(we[e]||"cloud",t)}const ye=[{max:10,color:"#3b82f6"},{max:15,color:"#06b6d4"},{max:19,color:"#fbbf24"},{max:23,color:"#10b981"},{max:25,color:"#fbbf24"},{max:999,color:"#ef4444"}],ke=[{max:35,color:"#3b82f6"},{max:50,color:"#10b981"},{max:60,color:"#fbbf24"},{max:999,color:"#ef4444"}],Se={eco:"#10b981",comfort:"#3b82f6",sleep:"#6366f1",away:"#9ca3af",boost:"#ef4444",home:"#06b6d4",none:"#9ca3af"};function Ae(e,t){if(!e)return"boiler"===t?ke:ye;const i=e["boiler"===t?"color_stops_boiler":"color_stops_climate"];return i&&i.length?[...i].sort((e,t)=>e.max-t.max):"boiler"===t?ke:ye}function ze(e){const t=e?.color_presets;return{...Se,...t||{}}}function Me(e){const t=e?.color_light_use_state;return void 0===t||!!t}const Ce={accent:"var(--accent)",soft:"var(--accent-soft)",live:!1};function Ee(e,t,i){if(!t)return Ce;const s=t.state||"",a=t.attributes||{};if("light"===e.type){if("off"===s||"unavailable"===s)return{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1};if(Me(i)){const e=a.rgb_color;if(Array.isArray(e)&&3===e.length){return{accent:`rgb(${e[0]}, ${e[1]}, ${e[2]})`,soft:`rgba(${e[0]}, ${e[1]}, ${e[2]}, 0.18)`,live:!0}}}return{accent:"#fbbf24",soft:"rgba(251, 191, 36, 0.18)",live:!0}}if("thermostat"===e.type||"boiler"===e.type){const t=ze(i),n=a.preset_mode;if(n&&t[n]&&"off"!==s){const e=t[n];return{accent:e,soft:Be(e),live:!0}}const r=function(e){const t=[e.current_temperature,e.temperature];for(const e of t){if("number"==typeof e)return e;const t=parseFloat(e);if(!isNaN(t))return t}return}(a);if("number"==typeof r){const t=function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"#9ca3af"}(r,Ae(i,e.type));return{accent:t,soft:Be(t),live:!0}}return Ce}if("blind"===e.type){const e=a.current_position;if("number"==typeof e){const t=e/100,i=Math.round(60+140*t),s=Math.round(80+100*t),a=Math.round(120+135*t);return{accent:`rgb(${i}, ${s}, ${a})`,soft:`rgba(${i}, ${s}, ${a}, 0.18)`,live:!0}}}if("fan"===e.type){const e=a.percentage;if("number"==typeof e&&"on"===s){const t=function(e,t,i){const s=e.replace("#",""),a=t.replace("#",""),n=parseInt(s.slice(0,2),16),r=parseInt(s.slice(2,4),16),o=parseInt(s.slice(4,6),16),l=parseInt(a.slice(0,2),16),d=parseInt(a.slice(2,4),16),c=parseInt(a.slice(4,6),16),u=Math.round(n+(l-n)*i),h=Math.round(r+(d-r)*i),p=Math.round(o+(c-o)*i);return`rgb(${u}, ${h}, ${p})`}("#06b6d4","#3b82f6",e/100);return{accent:t,soft:Be(t),live:!0}}}return"on"===s||"open"===s||"cleaning"===s||"mowing"===s?{accent:"#10b981",soft:"rgba(16, 185, 129, 0.18)",live:!0}:"off"===s||"closed"===s||"docked"===s||"unavailable"===s?{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1}:Ce}function Be(e){if(!e.startsWith("#"))return"var(--bg-sunken)";const t=e.replace("#","");return`rgba(${parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16)}, ${parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16)}, ${parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)}, 0.18)`}const Ie={on:"var(--mode-comfort)",off:"var(--mode-off)",set:"var(--mode-eco)",preset:"var(--mode-night)",cmd:"var(--mode-boost)"};let Ne=null;function Re(e){Ne=e}const De={thermostat:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"climate.set_temperature",value:{type:"number",unit:"°C",min:5,max:35,step:.5,default:21}},{id:"set_preset",label:"Preset",kind:"preset",service:"climate.set_preset_mode",value:{type:"enum",options:["none","eco","comfort","sleep","away","boost","home"],default:"comfort"}},{id:"turn_off",label:"Spegni",kind:"off",service:"climate.turn_off"}],boiler:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"water_heater.set_temperature",value:{type:"number",unit:"°C",min:30,max:75,step:1,default:55}},{id:"set_operation",label:"Operation mode",kind:"preset",service:"water_heater.set_operation_mode",value:{type:"enum",options:["off","eco","electric","gas","heat_pump","high_demand","performance"],default:"eco"}},{id:"turn_off",label:"Spegni",kind:"off",service:"water_heater.turn_off"}],light:[{id:"turn_on",label:"Accendi",kind:"on",service:"light.turn_on",value:{type:"number",unit:"%",min:1,max:100,step:1,default:80,label:"Luminosità"},extras:[{key:"rgb_color",type:"color",label:"Colore RGB"},{key:"color_temp_kelvin",type:"number",label:"Temperatura colore",unit:"K",min:2e3,max:6500,step:100},{key:"transition",type:"number",label:"Transizione",unit:"s",min:0,max:60,step:1}]},{id:"turn_off",label:"Spegni",kind:"off",service:"light.turn_off"}],scene:[{id:"activate",label:"Attiva scena",kind:"on",service:"scene.turn_on",value:{type:"entity",domain:"scene",label:"Scena",multi:!0}}],automation:[{id:"turn_on",label:"Attiva automazione",kind:"on",service:"automation.turn_on",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}},{id:"turn_off",label:"Disattiva automazione",kind:"off",service:"automation.turn_off",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}},{id:"trigger",label:"Trigger automazione",kind:"cmd",service:"automation.trigger",value:{type:"entity",domain:"automation",label:"Automazione",multi:!0}}],blind:[{id:"set_position",label:"Posiziona",kind:"set",service:"cover.set_cover_position",value:{type:"number",unit:"%",min:0,max:100,step:5,default:100,label:"Apertura"}},{id:"open_cover",label:"Apri",kind:"on",service:"cover.open_cover"},{id:"close_cover",label:"Chiudi",kind:"off",service:"cover.close_cover"}],irrigation:[{id:"turn_on",label:"Avvia",kind:"on",service:"valve.open_valve",value:{type:"number",unit:"min",min:1,max:240,step:1,default:30,label:"Durata"}},{id:"turn_off",label:"Stop",kind:"off",service:"valve.close_valve"}],plug:[{id:"turn_on",label:"Accendi",kind:"on",service:"switch.turn_on"},{id:"turn_off",label:"Spegni",kind:"off",service:"switch.turn_off"}],fan:[{id:"turn_on",label:"Accendi",kind:"on",service:"fan.turn_on",value:{type:"number",unit:"%",min:10,max:100,step:10,default:50,label:"Velocità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"fan.turn_off"}],mower:[{id:"start_mowing",label:"Avvia taglio",kind:"on",service:"lawn_mower.start_mowing"},{id:"pause",label:"Pausa",kind:"cmd",service:"lawn_mower.pause"},{id:"dock",label:"Torna in base",kind:"off",service:"lawn_mower.dock"}],vacuum:[{id:"start",label:"Avvia pulizia",kind:"on",service:"vacuum.start"},{id:"pause",label:"Pausa",kind:"cmd",service:"vacuum.pause"},{id:"return_to_base",label:"Torna in base",kind:"off",service:"vacuum.return_to_base"}],alarm:[{id:"arm_home",label:"Inserisci (home)",kind:"on",service:"alarm_control_panel.alarm_arm_home"},{id:"arm_away",label:"Inserisci (away)",kind:"on",service:"alarm_control_panel.alarm_arm_away"},{id:"arm_night",label:"Inserisci (notte)",kind:"on",service:"alarm_control_panel.alarm_arm_night"},{id:"arm_vacation",label:"Inserisci (vacanza)",kind:"on",service:"alarm_control_panel.alarm_arm_vacation"},{id:"disarm",label:"Disinserisci",kind:"off",service:"alarm_control_panel.alarm_disarm"},{id:"trigger",label:"Attiva sirena",kind:"cmd",service:"alarm_control_panel.alarm_trigger"}]};let Te={};function He(e){const t=Te[e],i=De[e]||[];return t&&t.length?t.map(e=>{const t=i.find(t=>t.id===e.id);return t?{...t,...e,extras:e.extras||t.extras,value:e.value||t.value}:e}):i}function Oe(e,t){return He(e).find(e=>e.id===t)}function Le(e,t){if(!t)return"—";const i=Oe(e,t.id);if(!i)return t.id;if(i.value&&void 0!==t.value&&null!==t.value&&""!==t.value){if("entity"===i.value.type){const e=Array.isArray(t.value)?t.value:[String(t.value)];return e.length?1===e.length?`${i.label}: ${function(e){const t=e.indexOf(".");return t>=0?e.slice(t+1):e}(e[0])}`:`${i.label} ×${e.length}`:i.label}return`${t.value}${i.value.unit||""}`}return i.label}function Pe(e,t){if(!t)return"var(--mode-off)";const i=Oe(e,t.id);if("thermostat"===e||"boiler"===e){if("set_preset"===t.id||"set_operation"===t.id){const e=ze(Ne),i=String(t.value??"");if(i&&e[i])return e[i]}if("set_temperature"===t.id){const i="number"==typeof t.value?t.value:parseFloat(String(t.value));if(!isNaN(i)){return function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"var(--mode-comfort)"}(i,Ae(Ne,e))}}}return Ie[i?.kind||"on"]||"var(--mode-comfort)"}function We(e){const t=He(e)[0];return t?{id:t.id,value:t.value?t.value.default:void 0}:{id:"turn_on"}}const Ve=["it","en","fr","de"];let je="it";function qe(e,t){const i=Fe[e];let s=i?.[je]||i?.it||e;if(t)for(const e of Object.keys(t))s=s.replace(new RegExp(`\\{${e}\\}`,"g"),String(t[e]));return s}const Fe={"common.cancel":{it:"Annulla",en:"Cancel",fr:"Annuler",de:"Abbrechen"},"common.save":{it:"Salva",en:"Save",fr:"Enregistrer",de:"Speichern"},"common.delete":{it:"Elimina",en:"Delete",fr:"Supprimer",de:"Löschen"},"common.edit":{it:"Modifica",en:"Edit",fr:"Modifier",de:"Bearbeiten"},"common.remove":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"common.add":{it:"Aggiungi",en:"Add",fr:"Ajouter",de:"Hinzufügen"},"common.back":{it:"Indietro",en:"Back",fr:"Retour",de:"Zurück"},"common.next":{it:"Avanti",en:"Next",fr:"Suivant",de:"Weiter"},"common.confirm":{it:"Conferma",en:"Confirm",fr:"Confirmer",de:"Bestätigen"},"common.close":{it:"Chiudi",en:"Close",fr:"Fermer",de:"Schließen"},"common.reset":{it:"Reset",en:"Reset",fr:"Réinitialiser",de:"Zurücksetzen"},"common.default":{it:"Default",en:"Default",fr:"Défaut",de:"Standard"},"common.none":{it:"Nessuna",en:"None",fr:"Aucune",de:"Keine"},"common.search":{it:"Cerca",en:"Search",fr:"Rechercher",de:"Suchen"},"common.yes":{it:"Sì",en:"Yes",fr:"Oui",de:"Ja"},"common.no":{it:"No",en:"No",fr:"Non",de:"Nein"},"common.enabled":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"common.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"common.loading":{it:"Caricamento…",en:"Loading…",fr:"Chargement…",de:"Lädt…"},"common.optional":{it:"opzionale",en:"optional",fr:"facultatif",de:"optional"},"common.value":{it:"Valore",en:"Value",fr:"Valeur",de:"Wert"},"common.min":{it:"min",en:"min",fr:"min",de:"Min."},"common.hour_short":{it:"h",en:"h",fr:"h",de:"Std."},"nav.section.main":{it:"Principale",en:"Main",fr:"Principal",de:"Hauptmenü"},"nav.section.actions":{it:"Azioni",en:"Actions",fr:"Actions",de:"Aktionen"},"nav.overview":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"nav.editor":{it:"Editor",en:"Editor",fr:"Éditeur",de:"Editor"},"nav.week":{it:"Settimana",en:"Week",fr:"Semaine",de:"Woche"},"nav.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"nav.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"nav.live":{it:"Stato live",en:"Live",fr:"Direct",de:"Live"},"nav.new_schedule":{it:"Nuova schedulazione",en:"New schedule",fr:"Nouvelle planification",de:"Neuer Zeitplan"},"nav.manage_devices":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"nav.settings":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"nav.help":{it:"Aiuto",en:"Help",fr:"Aide",de:"Hilfe"},"nav.menu_open":{it:"Apri menu",en:"Open menu",fr:"Ouvrir le menu",de:"Menü öffnen"},"nav.menu_close":{it:"Chiudi menu",en:"Close menu",fr:"Fermer le menu",de:"Menü schließen"},"screen.overview.title":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"screen.editor.title":{it:"Editor schedulazione",en:"Schedule editor",fr:"Éditeur de planification",de:"Zeitplan-Editor"},"screen.weather_rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"screen.device.title":{it:"Dispositivo",en:"Device",fr:"Appareil",de:"Gerät"},"screen.week.title":{it:"Vista settimanale",en:"Week view",fr:"Vue semaine",de:"Wochenansicht"},"screen.live.title":{it:"Stato live",en:"Live status",fr:"État en direct",de:"Live-Status"},"screen.wizard.title":{it:"Wizard",en:"Wizard",fr:"Assistant",de:"Assistent"},"screen.devices.title":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"screen.settings.title":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"modal.unsaved.title":{it:"Modifiche non salvate",en:"Unsaved changes",fr:"Modifications non enregistrées",de:"Nicht gespeicherte Änderungen"},"modal.unsaved.body":{it:"Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?",en:"You have pending changes on this schedule. Leave and discard them?",fr:"Des modifications sont en attente sur cette planification. Quitter et les perdre ?",de:"Du hast noch offene Änderungen an diesem Zeitplan. Wirklich verlassen und verwerfen?"},"modal.unsaved.stay":{it:"Resta qui",en:"Stay",fr:"Rester",de:"Bleiben"},"modal.unsaved.discard":{it:"Scarta modifiche",en:"Discard changes",fr:"Ignorer",de:"Verwerfen"},"modal.unsaved.save":{it:"Salva ed esci",en:"Save and exit",fr:"Enregistrer et quitter",de:"Speichern und verlassen"},"overview.subtitle":{it:"Schedulazioni configurate · {n} attive su {tot}",en:"Configured schedules · {n} active of {tot}",fr:"Planifications configurées · {n} actives sur {tot}",de:"Konfigurierte Zeitpläne · {n} aktiv von {tot}"},"overview.kpi.active":{it:"Attive",en:"Active",fr:"Actives",de:"Aktiv"},"overview.kpi.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"overview.kpi.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"overview.kpi.now":{it:"Ora corrente",en:"Now",fr:"Maintenant",de:"Jetzt"},"overview.no_schedules":{it:"Nessuna schedulazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"overview.no_schedules.cta":{it:"Avvia il wizard per crearne una",en:"Start the wizard to create one",fr:"Lance l'assistant pour en créer une",de:"Starte den Assistenten, um einen zu erstellen"},"overview.rules_count":{it:"{n} regole",en:"{n} rules",fr:"{n} règles",de:"{n} Regeln"},"editor.field.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"editor.timeline_variant":{it:"Visualizzazione",en:"View",fr:"Affichage",de:"Ansicht"},"editor.add_block_hint":{it:"Clicca su una zona vuota della barra per aggiungere una fascia. Trascina i bordi per modificare durata e posizione.",en:"Click on an empty area of the bar to add a block. Drag the edges to adjust duration and position.",fr:"Clique sur une zone vide de la barre pour ajouter un créneau. Fais glisser les bords pour ajuster la durée et la position.",de:"Klicke auf einen freien Bereich der Leiste, um einen Block hinzuzufügen. Ziehe die Ränder, um Dauer und Position anzupassen."},"editor.block.from":{it:"Da",en:"From",fr:"De",de:"Von"},"editor.block.to":{it:"A",en:"To",fr:"À",de:"Bis"},"editor.block.fixed":{it:"Ora fissa",en:"Fixed time",fr:"Heure fixe",de:"Feste Zeit"},"editor.block.sunrise":{it:"Alba",en:"Sunrise",fr:"Lever du soleil",de:"Sonnenaufgang"},"editor.block.sunset":{it:"Tramonto",en:"Sunset",fr:"Coucher du soleil",de:"Sonnenuntergang"},"editor.block.today":{it:"oggi:",en:"today:",fr:"aujourd'hui :",de:"heute:"},"editor.block.action":{it:"Azione",en:"Action",fr:"Action",de:"Aktion"},"editor.block.delete":{it:"Elimina fascia",en:"Delete block",fr:"Supprimer le créneau",de:"Block löschen"},"editor.block.no_selection":{it:"Nessuna fascia selezionata. Clicca su una fascia esistente per modificarla, oppure su una zona libera per aggiungerne una nuova.",en:"No block selected. Click an existing block to edit it, or an empty area to add a new one.",fr:"Aucun créneau sélectionné. Clique sur un créneau existant pour le modifier, ou sur une zone libre pour en ajouter un.",de:"Kein Block ausgewählt. Klicke auf einen vorhandenen Block, um ihn zu bearbeiten, oder in einen freien Bereich, um einen neuen hinzuzufügen."},"editor.coverage":{it:"{n} fasce · totale coperto {h}h / 24h",en:"{n} blocks · total coverage {h}h / 24h",fr:"{n} créneaux · couverture totale {h}h / 24h",de:"{n} Blöcke · Abdeckung gesamt {h}h / 24h"},"editor.days.repeat":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"editor.days.all":{it:"Tutti i giorni",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"editor.days.weekdays":{it:"Lavorativi",en:"Weekdays",fr:"Jours ouvrés",de:"Wochentags"},"editor.days.weekend":{it:"Weekend",en:"Weekend",fr:"Week-end",de:"Wochenende"},"editor.weather_rules.title":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"editor.weather_rules.add":{it:"Aggiungi regola",en:"Add rule",fr:"Ajouter une règle",de:"Regel hinzufügen"},"editor.weather_rules.empty":{it:"Nessuna regola meteo · esecuzione fissa indipendente dal meteo",en:"No weather rules · fixed execution regardless of weather",fr:"Aucune règle météo · exécution fixe indépendamment de la météo",de:"Keine Wetterregeln · feste Ausführung unabhängig vom Wetter"},"editor.devices_section":{it:"Dispositivi influenzati",en:"Affected devices",fr:"Appareils concernés",de:"Betroffene Geräte"},"editor.devices_count":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"editor.devices_empty":{it:"Nessun dispositivo collegato a questa schedulazione.",en:"No devices linked to this schedule.",fr:"Aucun appareil lié à cette planification.",de:"Keine Geräte mit diesem Zeitplan verknüpft."},"editor.devices_no_more":{it:"Tutti i dispositivi compatibili ({type}) sono già stati aggiunti.",en:"All compatible devices ({type}) are already added.",fr:"Tous les appareils compatibles ({type}) sont déjà ajoutés.",de:"Alle kompatiblen Geräte ({type}) sind bereits hinzugefügt."},"editor.block.targets":{it:"Dispositivi attivi in questa fascia",en:"Devices active for this block",fr:"Appareils actifs sur ce créneau",de:"Geräte aktiv in diesem Block"},"editor.block.targets.all":{it:"Tutti",en:"All",fr:"Tous",de:"Alle"},"editor.block.targets.hint":{it:'Tocca un dispositivo per escluderlo da questa fascia. "Tutti" ripristina il default.',en:'Tap a device to exclude it from this block. "All" restores the default.',fr:"Touche un appareil pour l'exclure de ce créneau. « Tous » remet le défaut.",de:'Tippe auf ein Gerät, um es aus diesem Block auszuschließen. „Alle" stellt den Standard wieder her.'},"editor.entity.empty":{it:"Nessuna entità disponibile",en:"No entities available",fr:"Aucune entité disponible",de:"Keine Entitäten verfügbar"},"editor.entity.count":{it:"{n} selezionate",en:"{n} selected",fr:"{n} sélectionnées",de:"{n} ausgewählt"},"editor.entity.search":{it:"Cerca per nome o entity_id…",en:"Search by name or entity_id…",fr:"Rechercher par nom ou entity_id…",de:"Nach Name oder Entity-ID suchen…"},"editor.entity.no_match":{it:"Nessun risultato per la ricerca",en:"No matches for the search",fr:"Aucun résultat pour la recherche",de:"Keine Treffer für die Suche"},"editor.automation.section":{it:"Schedulazione automazioni",en:"Automation-based schedule",fr:"Planification d'automatisations",de:"Automatisierungsplan"},"editor.automation.section.hint":{it:"Le schedulazioni di tipo automazione attivano, disattivano o triggerano automazioni di Home Assistant per fascia oraria.",en:"Automation schedules turn on/off or trigger HA automations per time block.",fr:"Les planifications d'automatisations activent/désactivent ou déclenchent des automatisations par créneau.",de:"Automatisierungspläne aktivieren/deaktivieren oder triggern HA-Automatisierungen pro Zeitblock."},"editor.automation.no_devices":{it:"Le automazioni non richiedono dispositivi: ogni fascia oraria seleziona quali automazioni attivare nel pannello di destra.",en:"Automations don't need devices: each time block picks which automations to act on in the right panel.",fr:"Les automatisations ne nécessitent pas d'appareils : chaque créneau choisit lesquelles activer.",de:"Automatisierungen brauchen keine Geräte: jeder Zeitblock wählt rechts die Ziel-Automatisierungen."},"editor.automation.pick_placeholder":{it:"— Seleziona un'automazione —",en:"— Pick an automation —",fr:"— Choisir une automatisation —",de:"— Automatisierung auswählen —"},"editor.automation.pick_warn":{it:"Seleziona almeno un'automazione, altrimenti questa fascia non farà nulla.",en:"Pick at least one automation, otherwise this block will do nothing.",fr:"Sélectionne au moins une automatisation.",de:"Wähle mindestens eine Automatisierung aus."},"wizard.devices.automation_tile":{it:"Attiva automazioni (generica)",en:"Activate automations (generic)",fr:"Activer des automatisations (générique)",de:"Automatisierungen aktivieren (generisch)"},"wizard.devices.automation_tile.desc":{it:"Una sola schedulazione, più automazioni accese/spente per fascia",en:"One schedule, multiple automations toggled per block",fr:"Une seule planification, plusieurs automatisations basculées par créneau",de:"Ein Plan, mehrere Automatisierungen pro Block ein-/ausschalten"},"wizard.review.automation_mode":{it:"Modalità automazioni (nessun dispositivo)",en:"Automation mode (no devices)",fr:"Mode automatisations (aucun appareil)",de:"Automatisierungsmodus (keine Geräte)"},"overview.new_automation":{it:"Schedula automazioni",en:"Schedule automations",fr:"Planifier des automatisations",de:"Automatisierungen planen"},"overview.new_automation.hint":{it:"Crea una schedulazione che attiva o disattiva automazioni a orari diversi",en:"Create a schedule that turns automations on/off at different times",fr:"Créer une planification qui active/désactive des automatisations à différents horaires",de:"Plan erstellen, der zu unterschiedlichen Zeiten Automatisierungen ein-/ausschaltet"},"overview.new_automation_default_name":{it:"Nuova schedulazione automazioni",en:"New automation schedule",fr:"Nouvelle planification d'automatisations",de:"Neuer Automatisierungsplan"},"editor.block.wrap_warn.title":{it:"Attenzione: blocco oltre la mezzanotte",en:"Warning: block crosses midnight",fr:"Attention : bloc au-delà de minuit",de:"Achtung: Block überschreitet Mitternacht"},"editor.block.wrap_warn.body":{it:"Non puoi schedulare orari che attraversano la mezzanotte. Dividi il blocco in due parti (es. 22:00-23:59 e 00:00-06:00) altrimenti questa fascia non verrà mai eseguita.",en:"You can't schedule a block that crosses midnight. Split it into two parts (e.g. 22:00-23:59 and 00:00-06:00) otherwise this block will never fire.",fr:"Tu ne peux pas planifier un bloc qui traverse minuit. Divise-le en deux parties (ex. 22:00-23:59 et 00:00-06:00) sinon ce bloc ne s'exécutera jamais.",de:"Ein Block über Mitternacht ist nicht möglich. Teile ihn in zwei Blöcke (z. B. 22:00-23:59 und 00:00-06:00), sonst wird er nie ausgeführt."},"wizard.devices.scene_tile":{it:"Attivazione scena (generica)",en:"Activate scene (generic)",fr:"Activer une scène (générique)",de:"Szene aktivieren (generisch)"},"wizard.devices.scene_tile.desc":{it:"Una sola schedulazione, una scena diversa per ogni fascia oraria",en:"One schedule, a different scene per time block",fr:"Une seule planification, une scène différente par créneau",de:"Ein Plan, pro Zeitblock eine andere Szene"},"wizard.review.scene_mode":{it:"Modalità scene (nessun dispositivo)",en:"Scene mode (no devices)",fr:"Mode scènes (aucun appareil)",de:"Szenenmodus (keine Geräte)"},"editor.scene.section":{it:"Scena della schedulazione",en:"Scene-based schedule",fr:"Planification de scènes",de:"Szenenplan"},"editor.scene.section.hint":{it:"Le schedulazioni di tipo scena attivano una scena diversa per ogni fascia oraria.",en:"Scene schedules fire a different scene for each time block.",fr:"Les planifications de scènes déclenchent une scène différente pour chaque créneau.",de:"Szenenpläne lösen pro Zeitblock eine andere Szene aus."},"editor.scene.no_devices":{it:"Le scene non richiedono dispositivi: ogni fascia oraria seleziona quale scena attivare nel pannello di destra.",en:"Scenes don't need devices: each time block picks which scene to activate in the right panel.",fr:"Les scènes ne nécessitent pas d'appareils : chaque créneau choisit la scène à activer.",de:"Szenen brauchen keine Geräte: jeder Zeitblock wählt die zu aktivierende Szene."},"editor.scene.pick_placeholder":{it:"— Seleziona una scena —",en:"— Pick a scene —",fr:"— Choisir une scène —",de:"— Szene auswählen —"},"editor.scene.pick_warn":{it:"Seleziona una scena, altrimenti questa fascia non farà nulla.",en:"Pick a scene, otherwise this block will do nothing.",fr:"Choisis une scène, sinon ce créneau ne fera rien.",de:"Wähle eine Szene aus, sonst tut dieser Block nichts."},"overview.new_scene":{it:"Schedula scene",en:"Schedule scenes",fr:"Planifier des scènes",de:"Szenen planen"},"overview.new_scene.hint":{it:"Crea una schedulazione che attiva scene diverse a orari diversi",en:"Create a schedule that activates different scenes at different times",fr:"Créer une planification qui active différentes scènes à différents horaires",de:"Plan erstellen, der zu unterschiedlichen Zeiten verschiedene Szenen auslöst"},"overview.new_scene_default_name":{it:"Nuova schedulazione scene",en:"New scene schedule",fr:"Nouvelle planification de scènes",de:"Neuer Szenenplan"},"editor.block.extras":{it:"Parametri avanzati",en:"Advanced parameters",fr:"Paramètres avancés",de:"Erweiterte Parameter"},"editor.block.extras.hint":{it:"Lascia vuoto per usare il default. I valori vengono passati direttamente al servizio HA al momento dell'esecuzione.",en:"Leave empty to use defaults. Values are passed directly to the HA service when fired.",fr:"Laisse vide pour le défaut. Les valeurs sont passées directement au service HA.",de:"Leer lassen für Standardwerte. Werte werden direkt an den HA-Dienst übergeben."},"editor.date_range.toggle":{it:"Periodo dell'anno specifico (ricorrente)",en:"Specific date range (yearly recurring)",fr:"Plage de dates spécifique (annuelle)",de:"Bestimmter Zeitraum (jährlich wiederkehrend)"},"editor.date_range.hint":{it:"Limita la schedulazione a un intervallo di date dell'anno. Si ripete ogni anno.",en:"Limit the schedule to a date range. Repeats every year.",fr:"Limite la planification à une plage de dates. Se répète chaque année.",de:"Begrenzt den Zeitplan auf einen Datumsbereich. Wiederholt sich jährlich."},"editor.date_range.from":{it:"Da",en:"From",fr:"Du",de:"Von"},"editor.date_range.to":{it:"A",en:"To",fr:"Au",de:"Bis"},"editor.date_range.wraps":{it:"Il periodo attraversa il fine anno (la schedulazione resta attiva da inizio anno fino alla data di fine).",en:"The range wraps across year-end (schedule remains active until the end date in the new year).",fr:"La plage traverse la fin d'année.",de:"Der Bereich überspannt den Jahreswechsel."},"month.1":{it:"Gennaio",en:"January",fr:"Janvier",de:"Januar"},"month.2":{it:"Febbraio",en:"February",fr:"Février",de:"Februar"},"month.3":{it:"Marzo",en:"March",fr:"Mars",de:"März"},"month.4":{it:"Aprile",en:"April",fr:"Avril",de:"April"},"month.5":{it:"Maggio",en:"May",fr:"Mai",de:"Mai"},"month.6":{it:"Giugno",en:"June",fr:"Juin",de:"Juni"},"month.7":{it:"Luglio",en:"July",fr:"Juillet",de:"Juli"},"month.8":{it:"Agosto",en:"August",fr:"Août",de:"August"},"month.9":{it:"Settembre",en:"September",fr:"Septembre",de:"September"},"month.10":{it:"Ottobre",en:"October",fr:"Octobre",de:"Oktober"},"month.11":{it:"Novembre",en:"November",fr:"Novembre",de:"November"},"month.12":{it:"Dicembre",en:"December",fr:"Décembre",de:"Dezember"},"editor.dirty.unsaved":{it:"Salva le modifiche",en:"Save changes",fr:"Enregistrer les modifications",de:"Änderungen speichern"},"editor.dirty.saved":{it:"Modifiche salvate",en:"Changes saved",fr:"Modifications enregistrées",de:"Änderungen gespeichert"},"wizard.title":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer une planification",de:"Zeitplan erstellen"},"wizard.subtitle":{it:"Procedura guidata · puoi modificare tutto in seguito",en:"Guided setup · you can edit everything later",fr:"Procédure guidée · tu pourras tout modifier ensuite",de:"Geführte Einrichtung · alles kann später angepasst werden"},"wizard.step.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"wizard.step.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"wizard.step.time":{it:"Fasce orarie",en:"Time blocks",fr:"Créneaux",de:"Zeitblöcke"},"wizard.step.days":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"wizard.step.weather":{it:"Meteo",en:"Weather",fr:"Météo",de:"Wetter"},"wizard.step.review":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.name.heading":{it:"Dai un nome alla schedulazione",en:"Give the schedule a name",fr:"Donne un nom à la planification",de:"Gib dem Zeitplan einen Namen"},"wizard.name.hint":{it:"Sarà visibile nella panoramica e nelle notifiche.",en:"It will appear in the overview and in notifications.",fr:"Il apparaîtra dans l'aperçu et les notifications.",de:"Wird in der Übersicht und in Benachrichtigungen angezeigt."},"wizard.name.suggestions":{it:"Suggerimenti:",en:"Suggestions:",fr:"Suggestions :",de:"Vorschläge:"},"wizard.devices.heading":{it:"Quali dispositivi sono coinvolti?",en:"Which devices are involved?",fr:"Quels appareils sont concernés ?",de:"Welche Geräte sind beteiligt?"},"wizard.devices.hint":{it:"Verranno tutti controllati dalla stessa programmazione.",en:"They will all be controlled by the same schedule.",fr:"Ils seront tous contrôlés par la même planification.",de:"Alle werden vom selben Zeitplan gesteuert."},"wizard.time.heading":{it:"Imposta le fasce orarie",en:"Set up time blocks",fr:"Définis les créneaux horaires",de:"Zeitblöcke festlegen"},"wizard.time.reset_preset":{it:"Reset preset",en:"Reset preset",fr:"Réinitialiser le préréglage",de:"Voreinstellung zurücksetzen"},"wizard.time.selected":{it:"Fascia selezionata",en:"Selected block",fr:"Créneau sélectionné",de:"Ausgewählter Block"},"wizard.days.heading":{it:"Quali giorni della settimana?",en:"Which days of the week?",fr:"Quels jours de la semaine ?",de:"An welchen Wochentagen?"},"wizard.days.hint":{it:"La schedulazione si ripeterà automaticamente ogni settimana.",en:"The schedule will repeat automatically every week.",fr:"La planification se répétera chaque semaine.",de:"Der Zeitplan wiederholt sich jede Woche."},"wizard.weather.heading":{it:"Logica meteo",en:"Weather logic",fr:"Logique météo",de:"Wetterlogik"},"wizard.weather.hint":{it:"Vuoi che il meteo locale modifichi automaticamente questa programmazione?",en:"Should local weather automatically affect this schedule?",fr:"La météo locale doit-elle modifier automatiquement cette planification ?",de:"Soll das lokale Wetter diesen Zeitplan automatisch anpassen?"},"wizard.weather.yes":{it:"Sì, abilita",en:"Yes, enable",fr:"Oui, activer",de:"Ja, aktivieren"},"wizard.weather.yes.desc":{it:"Suggeriremo regole utili in base al tipo di dispositivo",en:"We'll suggest useful rules based on the device type",fr:"Des règles utiles seront suggérées selon le type d'appareil",de:"Nützliche Regeln werden je nach Gerätetyp vorgeschlagen"},"wizard.weather.no":{it:"No, solo orari",en:"No, time-based only",fr:"Non, juste les horaires",de:"Nein, nur zeitbasiert"},"wizard.weather.no.desc":{it:"Esecuzione fissa indipendente dal meteo",en:"Fixed execution regardless of weather",fr:"Exécution fixe indépendante de la météo",de:"Feste Ausführung unabhängig vom Wetter"},"wizard.review.heading":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.review.devices":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"wizard.review.weather_on":{it:"Abilitata",en:"Enabled",fr:"Activée",de:"Aktiviert"},"wizard.review.weather_off":{it:"Disabilitata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"wizard.review.note":{it:"Potrai modificare ogni dettaglio dall'editor dopo la creazione.",en:"You'll be able to edit every detail after creation.",fr:"Tu pourras modifier chaque détail après la création.",de:"Nach der Erstellung kannst du alle Details bearbeiten."},"wizard.create":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer la planification",de:"Zeitplan erstellen"},"devices.subtitle":{it:"Entità di Home Assistant importate · {n} dispositivi controllati",en:"Imported Home Assistant entities · {n} devices controlled",fr:"Entités Home Assistant importées · {n} appareils contrôlés",de:"Importierte Home-Assistant-Entitäten · {n} gesteuerte Geräte"},"devices.add_entity":{it:"Aggiungi entità",en:"Add entity",fr:"Ajouter une entité",de:"Entität hinzufügen"},"devices.empty.title":{it:"Nessun dispositivo importato",en:"No devices imported",fr:"Aucun appareil importé",de:"Keine Geräte importiert"},"devices.empty.hint":{it:"Aggiungi le tue prime entità HA per iniziare.",en:"Add your first HA entities to get started.",fr:"Ajoute tes premières entités HA pour commencer.",de:"Füge deine ersten HA-Entitäten hinzu, um zu starten."},"devices.types_hint":{it:"Tipo e capabilities vengono dedotti automaticamente dal dominio dell'entità HA (es. climate.* → termostato).",en:"Type and capabilities are auto-detected from the HA entity domain (e.g. climate.* → thermostat).",fr:"Le type et les capacités sont déduits automatiquement du domaine de l'entité HA (ex. climate.* → thermostat).",de:"Typ und Fähigkeiten werden automatisch aus der HA-Entitätsdomäne abgeleitet (z. B. climate.* → Thermostat)."},"devices.alias":{it:"Alias",en:"Alias",fr:"Alias",de:"Alias"},"devices.alias.placeholder":{it:"Alias (opzionale)",en:"Alias (optional)",fr:"Alias (facultatif)",de:"Alias (optional)"},"devices.import":{it:"Importa",en:"Import",fr:"Importer",de:"Importieren"},"devices.unlink":{it:"Sgancia",en:"Unlink",fr:"Détacher",de:"Trennen"},"devices.picker.title":{it:"Aggiungi entità HA",en:"Add HA entity",fr:"Ajouter une entité HA",de:"HA-Entität hinzufügen"},"devices.picker.count":{it:"{n} entità disponibili nel tuo Home Assistant",en:"{n} entities available in your Home Assistant",fr:"{n} entités disponibles dans ton Home Assistant",de:"{n} Entitäten in deinem Home Assistant verfügbar"},"devices.picker.search":{it:"Cerca per nome o entity_id…",en:"Search by name or entity_id…",fr:"Recherche par nom ou entity_id…",de:"Suche nach Name oder entity_id…"},"devices.picker.all_imported":{it:"Tutto importato",en:"All imported",fr:"Tout importé",de:"Alles importiert"},"devices.picker.all_imported.hint":{it:"Tutte le entità disponibili sono già state aggiunte.",en:"All available entities have already been added.",fr:"Toutes les entités disponibles ont déjà été ajoutées.",de:"Alle verfügbaren Entitäten wurden bereits hinzugefügt."},"settings.subtitle":{it:"Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni",en:"Global Chronos integration settings · apply to all schedules",fr:"Paramètres globaux de l'intégration Chronos · valables pour toutes les planifications",de:"Globale Chronos-Einstellungen · gelten für alle Zeitpläne"},"settings.weather.title":{it:"Sorgente meteo",en:"Weather source",fr:"Source météo",de:"Wetterquelle"},"settings.weather.subtitle":{it:"Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)",en:"HA entity used to evaluate weather rules · you can also map specific attributes to point sensors (local weather station, Ecowitt, …)",fr:"Entité HA utilisée pour évaluer les règles météo · tu peux aussi mapper des attributs spécifiques à des capteurs ponctuels (station météo locale, Ecowitt, …)",de:"HA-Entität zur Auswertung der Wetterregeln · einzelne Attribute können auch auf Punktsensoren gemappt werden (lokale Wetterstation, Ecowitt, …)"},"settings.weather.entity":{it:"Entità meteo principale",en:"Main weather entity",fr:"Entité météo principale",de:"Haupt-Wetterentität"},"settings.weather.entity.hint":{it:"Usata per le forecast.* e come fallback se nessun override è impostato qui sotto",en:"Used for forecast.* and as a fallback if no override is set below",fr:"Utilisée pour forecast.* et comme repli si aucun remplacement n'est défini ci-dessous",de:"Wird für forecast.* und als Fallback verwendet, wenn unten keine Überschreibung gesetzt ist"},"settings.weather.overrides.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibung"},"settings.weather.overrides.hint":{it:"Per ogni attributo puoi specificare un'entità sensor.* da cui leggere il valore. Se vuoto, viene letto dall'entità weather principale.",en:"For each attribute you can specify a sensor.* entity to read from. If empty, the value is read from the main weather entity.",fr:"Pour chaque attribut, tu peux spécifier une entité sensor.* à lire. Si vide, la valeur est lue depuis l'entité météo principale.",de:"Für jedes Attribut kannst du eine sensor.*-Entität angeben. Leer = Wert wird aus der Haupt-Wetterentität gelesen."},"settings.weather.overrides.use_main":{it:"— usa entità weather —",en:"— use weather entity —",fr:"— utiliser l'entité météo —",de:"— Wetterentität verwenden —"},"settings.weather.overrides.suggested":{it:"suggeriti",en:"suggested",fr:"suggérés",de:"empfohlen"},"settings.weather.overrides.others":{it:"Altri sensori",en:"Other sensors",fr:"Autres capteurs",de:"Weitere Sensoren"},"settings.weather.overrides.no_sensors":{it:"Nessun sensor.* o binary_sensor.* esposto in questo Home Assistant. Verifica di aver esposto le entità necessarie.",en:"No sensor.* or binary_sensor.* entities exposed in this Home Assistant. Make sure the entities you need are exposed.",fr:"Aucune entité sensor.* ou binary_sensor.* n'est exposée dans ce Home Assistant. Vérifie que les entités nécessaires sont exposées.",de:"Keine sensor.*- oder binary_sensor.*-Entitäten in diesem Home Assistant verfügbar. Stelle sicher, dass die benötigten Entitäten freigegeben sind."},"settings.weather.overrides.warn.unit_mismatch":{it:"Unità non compatibile: questo attributo si aspetta {expected}, il sensore espone {got}. Le regole potrebbero confrontare valori sbagliati.",en:"Unit mismatch: this attribute expects {expected}, the sensor reports {got}. Rules may compare wrong values.",fr:"Unités incompatibles : cet attribut attend {expected}, le capteur renvoie {got}. Les règles risquent de comparer des valeurs erronées.",de:"Einheit passt nicht: dieses Attribut erwartet {expected}, der Sensor liefert {got}. Regeln vergleichen evtl. falsche Werte."},"settings.weather.overrides.warn.class_mismatch":{it:"Tipo sensore diverso da quello atteso: atteso {expected}, ricevuto {got}. Verifica che sia la grandezza corretta.",en:"Sensor type differs from expected: expected {expected}, got {got}. Make sure it's the right quantity.",fr:"Type de capteur différent : attendu {expected}, reçu {got}. Vérifie qu'il s'agit de la bonne grandeur.",de:"Sensortyp weicht ab: erwartet {expected}, erhalten {got}. Prüfe, ob es die richtige Größe ist."},"settings.weather.overrides.warn.not_numeric":{it:'Stato attuale non numerico: "{state}". Questo attributo richiede un sensore numerico.',en:'Current state is not numeric: "{state}". This attribute requires a numeric sensor.',fr:"L'état actuel n'est pas numérique : \"{state}\". Cet attribut nécessite un capteur numérique.",de:'Aktueller Wert ist nicht numerisch: „{state}". Dieses Attribut erfordert einen numerischen Sensor.'},"settings.weather.overrides.warn.numeric_for_condition":{it:'L\'attributo condition richiede un sensore testuale (es. "sunny", "rainy"). Questo sensore espone un numero ("{state}").',en:'The condition attribute needs a text sensor (e.g. "sunny", "rainy"). This sensor reports a number ("{state}").',fr:'L\'attribut condition attend un capteur texte (ex. "sunny", "rainy"). Ce capteur renvoie un nombre ("{state}").',de:'Das Attribut „condition" erwartet einen Textsensor (z. B. „sunny", „rainy"). Dieser Sensor liefert eine Zahl („{state}").'},"settings.behavior.title":{it:"Comportamento esecuzione",en:"Execution behavior",fr:"Comportement d'exécution",de:"Ausführungsverhalten"},"settings.behavior.subtitle":{it:"Frequenza di aggiornamento e granularità",en:"Update frequency and granularity",fr:"Fréquence de mise à jour et granularité",de:"Aktualisierungsfrequenz und Granularität"},"settings.polling":{it:"Polling meteo",en:"Weather polling",fr:"Sondage météo",de:"Wetter-Abfrage"},"settings.polling.hint":{it:"Ogni quanto rivalutare le regole",en:"How often rules are re-evaluated",fr:"Fréquence de réévaluation des règles",de:"Intervall zur Neuberechnung der Regeln"},"settings.snap":{it:"Snap timeline",en:"Timeline snap",fr:"Pas de la timeline",de:"Timeline-Raster"},"settings.snap.hint":{it:"Granularità nel disegnare le fasce",en:"Granularity when drawing blocks",fr:"Granularité lors du tracé des créneaux",de:"Granularität beim Zeichnen der Blöcke"},"settings.notify.title":{it:"Notifiche",en:"Notifications",fr:"Notifications",de:"Benachrichtigungen"},"settings.notify.subtitle":{it:"Eventi che vogliono una notifica HA",en:"Events that want an HA notification",fr:"Événements qui déclenchent une notification HA",de:"Ereignisse, die eine HA-Benachrichtigung auslösen"},"settings.notify.block_executed":{it:"Fascia eseguita",en:"Block executed",fr:"Créneau exécuté",de:"Block ausgeführt"},"settings.notify.block_executed.desc":{it:"Quando il sistema avvia un comando per una fascia oraria",en:"When the system fires a command for a time block",fr:"Quand le système déclenche une commande pour un créneau",de:"Wenn das System einen Befehl für einen Zeitblock auslöst"},"settings.notify.rule_triggered":{it:"Regola meteo attivata",en:"Weather rule triggered",fr:"Règle météo déclenchée",de:"Wetterregel ausgelöst"},"settings.notify.rule_triggered.desc":{it:"Quando una regola override entra in azione",en:"When an override rule kicks in",fr:"Quand une règle de remplacement s'active",de:"Wenn eine Überschreibungsregel greift"},"settings.notify.sched_skipped":{it:"Schedulazione saltata",en:"Schedule skipped",fr:"Planification ignorée",de:"Zeitplan übersprungen"},"settings.notify.sched_skipped.desc":{it:"Quando una fascia viene skippata per condizioni meteo",en:"When a block is skipped due to weather conditions",fr:"Quand un créneau est ignoré pour cause de météo",de:"Wenn ein Block aufgrund von Wetterbedingungen übersprungen wird"},"settings.notify.command_error":{it:"Errore comando",en:"Command error",fr:"Erreur de commande",de:"Befehlsfehler"},"settings.notify.command_error.desc":{it:"Se un dispositivo non risponde",en:"If a device fails to respond",fr:"Si un appareil ne répond pas",de:"Wenn ein Gerät nicht antwortet"},"settings.appearance.title":{it:"Aspetto",en:"Appearance",fr:"Apparence",de:"Erscheinungsbild"},"settings.appearance.subtitle":{it:"Densità di visualizzazione predefinita",en:"Default visual density",fr:"Densité d'affichage par défaut",de:"Standardanzeigedichte"},"settings.appearance.theme_hint":{it:"Il tema (chiaro/scuro) segue automaticamente Home Assistant. Usa l'icona luna/sole nel topbar per cambiarlo a livello HA.",en:"Theme (light/dark) automatically follows Home Assistant. Use the moon/sun icon in the topbar to switch HA-wide.",fr:"Le thème (clair/sombre) suit automatiquement Home Assistant. Utilise l'icône lune/soleil dans la barre supérieure.",de:"Das Theme (hell/dunkel) folgt automatisch Home Assistant. Nutze das Mond/Sonne-Symbol in der Topbar."},"settings.theme":{it:"Tema",en:"Theme",fr:"Thème",de:"Theme"},"settings.theme.light":{it:"Chiaro",en:"Light",fr:"Clair",de:"Hell"},"settings.theme.dark":{it:"Scuro",en:"Dark",fr:"Sombre",de:"Dunkel"},"settings.theme.auto":{it:"Auto",en:"Auto",fr:"Auto",de:"Auto"},"settings.density":{it:"Densità",en:"Density",fr:"Densité",de:"Dichte"},"settings.density.comfortable":{it:"Comoda",en:"Comfortable",fr:"Confortable",de:"Komfortabel"},"settings.density.compact":{it:"Compatta",en:"Compact",fr:"Compact",de:"Kompakt"},"settings.timeline_default.title":{it:"Timeline predefinita",en:"Default timeline",fr:"Timeline par défaut",de:"Standard-Timeline"},"settings.timeline_default.subtitle":{it:"Quale variante mostrare di default nell'editor",en:"Which variant to show by default in the editor",fr:"Quelle variante afficher par défaut dans l'éditeur",de:"Welche Variante im Editor standardmäßig angezeigt wird"},"settings.colors.title":{it:"Colori dispositivi",en:"Device colors",fr:"Couleurs des appareils",de:"Gerätefarben"},"settings.colors.subtitle":{it:"L'accent del dispositivo riflette il suo stato corrente",en:"The device accent reflects its current state",fr:"L'accent de l'appareil reflète son état actuel",de:"Die Akzentfarbe des Geräts spiegelt seinen aktuellen Zustand wider"},"settings.colors.lights.title":{it:"Luci · usa colore reale da Home Assistant",en:"Lights · use real color from Home Assistant",fr:"Lumières · utiliser la couleur réelle de Home Assistant",de:"Lichter · echte Farbe aus Home Assistant verwenden"},"settings.colors.lights.desc":{it:"Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.",en:"When on, the light icon reflects the current RGB color. Otherwise uses soft yellow.",fr:"Si activé, l'icône de la lumière reflète la couleur RGB actuelle. Sinon utilise un jaune doux.",de:"Wenn aktiv, spiegelt das Lichtsymbol die aktuelle RGB-Farbe wider. Sonst weiches Gelb."},"settings.colors.thermostat.title":{it:"Termostati · gradiente temperatura",en:"Thermostats · temperature gradient",fr:"Thermostats · dégradé de température",de:"Thermostate · Temperaturverlauf"},"settings.colors.thermostat.desc":{it:"Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.",en:"Threshold ≤ → color. Values above the last threshold use the last color.",fr:"Seuil ≤ → couleur. Au-delà du dernier seuil, la dernière couleur est utilisée.",de:"Schwelle ≤ → Farbe. Werte über der letzten Schwelle nutzen die letzte Farbe."},"settings.colors.boiler.title":{it:"Boiler · gradiente temperatura",en:"Water heater · temperature gradient",fr:"Chauffe-eau · dégradé de température",de:"Boiler · Temperaturverlauf"},"settings.colors.boiler.desc":{it:"Stessa logica del termostato, range tipico 30-75°C.",en:"Same logic as the thermostat, typical range 30-75°C.",fr:"Même logique que le thermostat, plage typique 30-75°C.",de:"Gleiche Logik wie Thermostat, typischer Bereich 30-75 °C."},"settings.colors.preset.title":{it:"Preset modalità (climate)",en:"Climate preset modes",fr:"Préréglages climate",de:"Climate-Presets"},"settings.colors.preset.desc":{it:"Override del colore quando il termostato è in un preset specifico",en:"Color override when the thermostat is in a specific preset",fr:"Surcharge de couleur quand le thermostat est dans un préréglage spécifique",de:"Farb-Überschreibung, wenn das Thermostat in einem bestimmten Preset ist"},"settings.colors.add_stop":{it:"Stop",en:"Stop",fr:"Palier",de:"Stopp"},"settings.colors.remove_stop":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"settings.language.title":{it:"Lingua",en:"Language",fr:"Langue",de:"Sprache"},"settings.language.subtitle":{it:"Lingua dell'interfaccia Chronos",en:"Chronos UI language",fr:"Langue de l'interface Chronos",de:"Sprache der Chronos-Oberfläche"},"settings.language.auto":{it:"Auto (segui Home Assistant)",en:"Auto (follow Home Assistant)",fr:"Auto (suit Home Assistant)",de:"Auto (Home Assistant folgen)"},"live.weather.title":{it:"Meteo locale",en:"Local weather",fr:"Météo locale",de:"Lokales Wetter"},"live.weather.subtitle":{it:"Sorgente: {entity}",en:"Source: {entity}",fr:"Source : {entity}",de:"Quelle: {entity}"},"live.no_weather":{it:"Nessuna sorgente meteo configurata · vai in Impostazioni",en:"No weather source configured · go to Settings",fr:"Aucune source météo configurée · va dans Réglages",de:"Keine Wetterquelle konfiguriert · siehe Einstellungen"},"live.forecast.title":{it:"Forecast 24h",en:"24h forecast",fr:"Prévisions 24 h",de:"24-h-Vorhersage"},"live.schedules.title":{it:"Schedulazioni · stato live",en:"Schedules · live status",fr:"Planifications · état en direct",de:"Zeitpläne · Live-Status"},"live.devices.title":{it:"Dispositivi · stato live",en:"Devices · live status",fr:"Appareils · état en direct",de:"Geräte · Live-Status"},"live.devices.subtitle":{it:"Valori in tempo reale",en:"Real-time values",fr:"Valeurs en temps réel",de:"Echtzeitwerte"},"live.condition.sunny":{it:"Soleggiato",en:"Sunny",fr:"Ensoleillé",de:"Sonnig"},"live.condition.rainy":{it:"Pioggia",en:"Rainy",fr:"Pluvieux",de:"Regnerisch"},"live.condition.cloudy":{it:"Nuvoloso",en:"Cloudy",fr:"Nuageux",de:"Bewölkt"},"live.condition.partlycloudy":{it:"Parzialmente nuvoloso",en:"Partly cloudy",fr:"Partiellement nuageux",de:"Teilweise bewölkt"},"live.condition.snowy":{it:"Neve",en:"Snowy",fr:"Neige",de:"Schnee"},"live.condition.fog":{it:"Nebbia",en:"Fog",fr:"Brouillard",de:"Nebel"},"live.condition.windy":{it:"Ventoso",en:"Windy",fr:"Venteux",de:"Windig"},"week.subtitle":{it:"Vista a 7 giorni · {n} schedulazioni attive",en:"7-day view · {n} active schedules",fr:"Vue 7 jours · {n} planifications actives",de:"7-Tage-Ansicht · {n} aktive Zeitpläne"},"week.legend":{it:"Legenda",en:"Legend",fr:"Légende",de:"Legende"},"week.today":{it:"Oggi",en:"Today",fr:"Aujourd'hui",de:"Heute"},"device.state":{it:"Stato attuale",en:"Current state",fr:"État actuel",de:"Aktueller Zustand"},"device.state.live":{it:"aggiornato live",en:"live updates",fr:"mises à jour en direct",de:"Live-Aktualisierung"},"device.type":{it:"Tipo dispositivo",en:"Device type",fr:"Type d'appareil",de:"Gerätetyp"},"device.linked_schedules":{it:"Schedule collegate",en:"Linked schedules",fr:"Planifications associées",de:"Verknüpfte Zeitpläne"},"device.linked_schedules.active":{it:"{n} attive",en:"{n} active",fr:"{n} actives",de:"{n} aktiv"},"device.capabilities":{it:"Capabilities rilevate",en:"Detected capabilities",fr:"Capacités détectées",de:"Erkannte Fähigkeiten"},"device.capabilities.subtitle":{it:"Servizi HA chiamabili su questo dispositivo",en:"HA services callable on this device",fr:"Services HA disponibles pour cet appareil",de:"Auf diesem Gerät aufrufbare HA-Dienste"},"device.schedules_using.title":{it:"Schedulazioni che usano questo dispositivo",en:"Schedules using this device",fr:"Planifications qui utilisent cet appareil",de:"Zeitpläne, die dieses Gerät verwenden"},"device.schedules_using.subtitle":{it:"{n} programmazioni collegate",en:"{n} linked schedules",fr:"{n} planifications liées",de:"{n} verknüpfte Zeitpläne"},"device.no_schedules":{it:"Nessuna programmazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"device.no_schedules.hint":{it:"Questo dispositivo non è incluso in nessuno schedule.",en:"This device is not included in any schedule.",fr:"Cet appareil n'est inclus dans aucune planification.",de:"Dieses Gerät ist in keinem Zeitplan enthalten."},"device.no_device.title":{it:"Nessun dispositivo",en:"No device",fr:"Aucun appareil",de:"Kein Gerät"},"device.no_device.hint":{it:"Importa prima un'entità HA.",en:"Import an HA entity first.",fr:"Importe d'abord une entité HA.",de:"Importiere zuerst eine HA-Entität."},"device.open_schedule":{it:"Apri",en:"Open",fr:"Ouvrir",de:"Öffnen"},"wr.heading":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"wr.heading.edit":{it:"Modifica regola meteo",en:"Edit weather rule",fr:"Modifier la règle météo",de:"Wetterregel bearbeiten"},"wr.subtitle":{it:"Costruisci una condizione IF/THEN. Verrà valutata ad ogni transizione di fascia.",en:"Build an IF/THEN condition. It is evaluated on every block transition.",fr:"Construis une condition SI/ALORS. Évaluée à chaque transition de créneau.",de:"Erstelle eine WENN/DANN-Bedingung. Wird bei jedem Blockwechsel ausgewertet."},"wr.if.title":{it:"Condizione · quando",en:"Condition · when",fr:"Condition · quand",de:"Bedingung · wann"},"wr.if.subtitle":{it:"Cosa deve essere vero per attivare la regola",en:"What must be true for the rule to fire",fr:"Ce qui doit être vrai pour déclencher la règle",de:"Was wahr sein muss, damit die Regel auslöst"},"wr.if.subtitle.and":{it:"Tutte le condizioni devono essere vere (AND)",en:"All conditions must be true (AND)",fr:"Toutes les conditions doivent être vraies (AND)",de:"Alle Bedingungen müssen wahr sein (AND)"},"wr.if.first":{it:"SE",en:"IF",fr:"SI",de:"WENN"},"wr.if.and":{it:"E",en:"AND",fr:"ET",de:"UND"},"wr.if.add_and":{it:"Aggiungi condizione (AND)",en:"Add condition (AND)",fr:"Ajouter une condition (AND)",de:"Bedingung hinzufügen (AND)"},"wr.if.sensor.label":{it:"Oppure scegli un sensore di Home Assistant",en:"Or pick a Home Assistant sensor",fr:"Ou choisir un capteur Home Assistant",de:"Oder einen Home-Assistant-Sensor wählen"},"wr.if.sensor.none":{it:"— Usa un attributo meteo qui sopra —",en:"— Use a weather attribute above —",fr:"— Utiliser un attribut météo ci-dessus —",de:"— Wetter-Attribut oben verwenden —"},"wr.if.sensor.hint":{it:"Sensori numerici (con unità di misura o stato numerico). Esempi: SOC batteria, previsione FTV, potenza istantanea.",en:"Numeric sensors (with unit of measurement or numeric state). Examples: battery SOC, PV forecast, instantaneous power.",fr:"Capteurs numériques (avec unité ou état numérique). Exemples : SOC batterie, prévision PV, puissance instantanée.",de:"Numerische Sensoren (mit Maßeinheit oder numerischem Zustand). Beispiele: Batterie-SOC, PV-Prognose, Momentanleistung."},"wr.if.sensor.search":{it:"Filtra sensori…",en:"Filter sensors…",fr:"Filtrer les capteurs…",de:"Sensoren filtern…"},"wr.if.sensor.no_match":{it:"Nessun sensore corrisponde",en:"No matching sensor",fr:"Aucun capteur correspondant",de:"Kein passender Sensor"},"wr.var":{it:"Variabile meteo",en:"Weather variable",fr:"Variable météo",de:"Wettervariable"},"wr.op":{it:"Operatore",en:"Operator",fr:"Opérateur",de:"Operator"},"wr.threshold":{it:"Soglia",en:"Threshold",fr:"Seuil",de:"Schwelle"},"wr.then.title":{it:"Azione · cosa fare",en:"Action · what to do",fr:"Action · que faire",de:"Aktion · was tun"},"wr.then.subtitle":{it:"L'effetto sulla fascia oraria attiva",en:"Effect on the active time block",fr:"Effet sur le créneau horaire actif",de:"Auswirkung auf den aktiven Zeitblock"},"wr.action.skip":{it:"Salta esecuzione",en:"Skip execution",fr:"Sauter l'exécution",de:"Ausführung überspringen"},"wr.action.skip.desc":{it:"La fascia non viene eseguita",en:"The block is not executed",fr:"Le créneau n'est pas exécuté",de:"Der Block wird nicht ausgeführt"},"wr.action.shift":{it:"Trasla orario",en:"Shift time",fr:"Décaler l'horaire",de:"Zeit verschieben"},"wr.action.shift.desc":{it:"Sposta l'inizio di X ore",en:"Move the start by X hours",fr:"Décale le début de X heures",de:"Verschiebt den Start um X Stunden"},"wr.action.force":{it:"Forza azione",en:"Force action",fr:"Forcer une action",de:"Aktion erzwingen"},"wr.action.force.desc":{it:"Esegue un'azione specifica",en:"Run a specific action",fr:"Exécute une action spécifique",de:"Führt eine bestimmte Aktion aus"},"wr.action.duration":{it:"Cambia durata",en:"Change duration",fr:"Changer la durée",de:"Dauer ändern"},"wr.action.duration.desc":{it:"Estende o accorcia la fascia",en:"Extend or shorten the block",fr:"Allonge ou raccourcit le créneau",de:"Verlängert oder kürzt den Block"},"wr.schedule_picker.label":{it:"Schedulazione",en:"Schedule",fr:"Planification",de:"Zeitplan"},"wr.schedule_picker.hint":{it:"A quale schedulazione viene aggiunta la regola",en:"Which schedule the rule will be added to",fr:"À quelle planification la règle est ajoutée",de:"Zu welchem Zeitplan die Regel hinzugefügt wird"},"wr.target.title":{it:"A quale fascia si applica",en:"Which block this rule targets",fr:"Quel créneau cette règle cible",de:"Auf welchen Block die Regel angewendet wird"},"wr.target.subtitle":{it:"Limita l'effetto a una sola fascia o lascia globale",en:"Limit the effect to a single block or keep it global",fr:"Limite l'effet à un seul créneau ou laisse global",de:"Effekt auf einen einzelnen Block beschränken oder global lassen"},"wr.target.label":{it:"Fascia",en:"Block",fr:"Créneau",de:"Block"},"wr.target.all_blocks":{it:"Tutte le fasce",en:"All blocks",fr:"Tous les créneaux",de:"Alle Blöcke"},"wr.effect.title":{it:"Tipo di effetto",en:"Effect type",fr:"Type d'effet",de:"Effekttyp"},"wr.effect.subtitle":{it:"Cosa fa la regola quando si attiva",en:"What the rule does when it fires",fr:"Ce que fait la règle quand elle se déclenche",de:"Was die Regel beim Auslösen macht"},"wr.effect.skip":{it:"Salta",en:"Skip",fr:"Ignorer",de:"Überspringen"},"wr.effect.skip.desc":{it:"Non eseguire l'azione del blocco",en:"Don't run the block action",fr:"Ne pas exécuter l'action du créneau",de:"Aktion des Blocks nicht ausführen"},"wr.effect.shift":{it:"Trasla orario",en:"Shift time",fr:"Décaler",de:"Verschieben"},"wr.effect.shift.desc":{it:"Sposta il blocco di N minuti",en:"Move the block by N minutes",fr:"Déplacer le créneau de N minutes",de:"Block um N Minuten verschieben"},"wr.effect.extend":{it:"Allunga",en:"Extend",fr:"Allonger",de:"Verlängern"},"wr.effect.extend.desc":{it:"Allunga il blocco; il blocco adiacente si accorcia",en:"Extend the block; the adjacent block shrinks",fr:"Allonge le créneau ; le créneau adjacent rétrécit",de:"Block verlängern; angrenzender Block wird kürzer"},"wr.effect.shrink":{it:"Accorcia",en:"Shrink",fr:"Raccourcir",de:"Verkürzen"},"wr.effect.shrink.desc":{it:"Accorcia il blocco; il blocco adiacente si allunga",en:"Shrink the block; the adjacent block extends",fr:"Raccourcit le créneau ; le créneau adjacent s'allonge",de:"Block verkürzen; angrenzender Block wird länger"},"wr.effect.force_action":{it:"Forza azione",en:"Force action",fr:"Forcer une action",de:"Aktion erzwingen"},"wr.effect.force_action.desc":{it:"Esegue subito un'azione specifica",en:"Run a specific action immediately",fr:"Exécute une action spécifique immédiatement",de:"Sofort eine bestimmte Aktion ausführen"},"wr.effect.replace_value":{it:"Sostituisci valore",en:"Replace value",fr:"Remplacer la valeur",de:"Wert ersetzen"},"wr.effect.replace_value.desc":{it:"Cambia il valore dell'azione del blocco (es. 19°C invece di 21°C)",en:"Change the block action's value (e.g. 19°C instead of 21°C)",fr:"Changer la valeur de l'action (ex. 19°C au lieu de 21°C)",de:"Wert der Blockaktion ändern (z. B. 19 °C statt 21 °C)"},"wr.effect.scale_duration":{it:"Scala durata",en:"Scale duration",fr:"Mettre à l'échelle la durée",de:"Dauer skalieren"},"wr.effect.scale_duration.desc":{it:"Durata proporzionale alla variabile meteo",en:"Duration proportional to a weather variable",fr:"Durée proportionnelle à une variable météo",de:"Dauer proportional zu einer Wettervariable"},"wr.effect.scale_value":{it:"Scala valore",en:"Scale value",fr:"Mettre à l'échelle la valeur",de:"Wert skalieren"},"wr.effect.scale_value.desc":{it:"Valore proporzionale alla variabile meteo",en:"Value proportional to a weather variable",fr:"Valeur proportionnelle à une variable météo",de:"Wert proportional zu einer Wettervariable"},"wr.effect_params.title":{it:"Parametri effetto",en:"Effect parameters",fr:"Paramètres de l'effet",de:"Effekt-Parameter"},"wr.delta":{it:"Variazione",en:"Delta",fr:"Variation",de:"Differenz"},"wr.direction.label":{it:"Direzione",en:"Direction",fr:"Direction",de:"Richtung"},"wr.direction.forward":{it:"Avanti (sposta la fine)",en:"Forward (move end)",fr:"Avant (décaler la fin)",de:"Vorwärts (Ende verschieben)"},"wr.direction.backward":{it:"Indietro (sposta l'inizio)",en:"Backward (move start)",fr:"Arrière (décaler le début)",de:"Rückwärts (Anfang verschieben)"},"wr.direction.hint":{it:"In quale direzione spostare l'edge del blocco target",en:"Which edge of the target block to move",fr:"Quel bord du créneau cible déplacer",de:"Welche Kante des Zielblocks verschoben werden soll"},"wr.scale.input.title":{it:"Variabile di input",en:"Input variable",fr:"Variable d'entrée",de:"Eingangsvariable"},"wr.scale.input.subtitle":{it:"Range della variabile meteo letta in tempo reale",en:"Range of the weather variable read live",fr:"Plage de la variable météo en direct",de:"Bereich der live gelesenen Wettervariable"},"wr.scale.input.hint":{it:"Valori fuori range vengono clampati. Lineare tra min e max.",en:"Values outside the range are clamped. Linear between min and max.",fr:"Les valeurs hors plage sont bridées. Linéaire entre min et max.",de:"Werte außerhalb des Bereichs werden begrenzt. Linear zwischen Min und Max."},"wr.scale.var":{it:"Variabile",en:"Variable",fr:"Variable",de:"Variable"},"wr.scale.var_min":{it:"Variabile MIN",en:"Variable MIN",fr:"Variable MIN",de:"Variable MIN"},"wr.scale.var_max":{it:"Variabile MAX",en:"Variable MAX",fr:"Variable MAX",de:"Variable MAX"},"wr.scale.out_min":{it:"Output MIN",en:"Output MIN",fr:"Sortie MIN",de:"Ausgabe MIN"},"wr.scale.out_max":{it:"Output MAX",en:"Output MAX",fr:"Sortie MAX",de:"Ausgabe MAX"},"wr.replace_value.pick_block":{it:"Seleziona prima una fascia specifica al di sopra",en:"Select a specific block above first",fr:"Sélectionne d'abord un créneau spécifique ci-dessus",de:"Wähle zuerst einen Block oben aus"},"wr.replace_value.no_value":{it:"L'azione di questa fascia non ha un valore parametrabile",en:"This block's action has no parametrisable value",fr:"L'action de ce créneau n'a pas de valeur paramétrable",de:"Aktion dieses Blocks hat keinen einstellbaren Wert"},"wr.conflict.title":{it:"Possibile conflitto",en:"Possible conflict",fr:"Conflit possible",de:"Möglicher Konflikt"},"wr.conflict.body":{it:"Esistono già regole che agiscono sulla stessa fascia o tipo di effetto. Verranno applicate in ordine; in caso di sovrapposizione vince l'ultima attivata.",en:"Other rules already act on this block or effect type. They are applied in order; on overlap the most recent firing wins.",fr:"D'autres règles agissent déjà sur ce créneau ou ce type d'effet. Elles s'appliquent dans l'ordre ; en cas de chevauchement la plus récente l'emporte.",de:"Andere Regeln greifen bereits auf diesen Block oder Effekt-Typ zu. Sie werden der Reihe nach angewendet; bei Überlappung gewinnt die zuletzt aktivierte."},"wr.fire_mode.label":{it:"Frequenza di attivazione",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"wr.fire_mode.hint":{it:"Quanto spesso la regola può attivarsi quando la condizione è vera",en:"How often the rule can fire when the condition is true",fr:"Fréquence de déclenchement quand la condition est vraie",de:"Wie oft die Regel auslösen kann, wenn die Bedingung wahr ist"},"wr.fire_mode.every":{it:"Ogni transizione (sconsigliato per oscillazioni)",en:"Every transition (not recommended for oscillating values)",fr:"À chaque transition (déconseillé pour valeurs oscillantes)",de:"Jede Transition (nicht empfohlen für schwankende Werte)"},"wr.fire_mode.once_per_day":{it:"Una volta al giorno (riarma a mezzanotte)",en:"Once per day (re-arms at midnight)",fr:"Une fois par jour (réarme à minuit)",de:"Einmal pro Tag (bewaffnet sich um Mitternacht neu)"},"wr.fire_mode.once_per_daytime":{it:"Una volta tra alba e tramonto",en:"Once between sunrise and sunset",fr:"Une fois entre lever et coucher du soleil",de:"Einmal zwischen Sonnenaufgang und -untergang"},"wr.fire_mode.once_per_nighttime":{it:"Una volta tra tramonto e alba",en:"Once between sunset and sunrise",fr:"Une fois entre coucher et lever du soleil",de:"Einmal zwischen Sonnenuntergang und -aufgang"},"wr.preview":{it:"Preview",en:"Preview",fr:"Aperçu",de:"Vorschau"},"wr.preview.subtitle":{it:"Come si comporta sulla schedulazione corrente",en:"How it behaves on the current schedule",fr:"Comment elle se comporte sur la planification actuelle",de:"Wie sich die Regel auf den aktuellen Zeitplan auswirkt"},"schedule.active":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"schedule.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"schedule.next_block":{it:"Prossima fascia",en:"Next block",fr:"Prochain créneau",de:"Nächster Block"},"schedule.now_block":{it:"Fascia attuale",en:"Current block",fr:"Créneau actuel",de:"Aktueller Block"},"schedule.no_blocks":{it:"Nessuna fascia",en:"No blocks",fr:"Aucun créneau",de:"Keine Blöcke"},"schedule.every_day":{it:"Ogni giorno",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"days.short.0":{it:"Lun",en:"Mon",fr:"Lun",de:"Mo"},"days.short.1":{it:"Mar",en:"Tue",fr:"Mar",de:"Di"},"days.short.2":{it:"Mer",en:"Wed",fr:"Mer",de:"Mi"},"days.short.3":{it:"Gio",en:"Thu",fr:"Jeu",de:"Do"},"days.short.4":{it:"Ven",en:"Fri",fr:"Ven",de:"Fr"},"days.short.5":{it:"Sab",en:"Sat",fr:"Sam",de:"Sa"},"days.short.6":{it:"Dom",en:"Sun",fr:"Dim",de:"So"},"timeline.linear":{it:"Lineare",en:"Linear",fr:"Linéaire",de:"Linear"},"timeline.radial":{it:"Radiale",en:"Radial",fr:"Radial",de:"Radial"},"timeline.list":{it:"Lista",en:"List",fr:"Liste",de:"Liste"},"help.title":{it:"Guida e ricette",en:"Help and recipes",fr:"Aide et recettes",de:"Hilfe und Rezepte"},"help.subtitle":{it:"Esempi pratici di schedulazioni comuni — clicca per crearle e personalizzarle",en:"Practical examples of common schedules — click to create and customise",fr:"Exemples pratiques de planifications courantes — cliquez pour créer et personnaliser",de:"Praktische Beispiele für häufige Zeitpläne — klicken zum Erstellen und Anpassen"},"help.intro.title":{it:"Come funziona Chronos",en:"How Chronos works",fr:"Comment fonctionne Chronos",de:"Wie Chronos funktioniert"},"help.intro.body":{it:"Crea schedulazioni con fasce orarie giornaliere. Ogni fascia esegue un'azione (es. set_temperature 21°C). Aggiungi regole meteo che possono saltare la fascia, modificarne durata o forzare un'altra azione in base a sensori esterni o condizioni del sole. Le fasce possono essere ancorate ad alba/tramonto per adattarsi alle stagioni automaticamente.",en:"Create schedules with daily time blocks. Each block runs an action (e.g. set_temperature 21°C). Add weather rules that can skip the block, change its duration, or force a different action based on external sensors or sun position. Blocks can be anchored to sunrise/sunset so they follow seasonal change automatically.",fr:"Créez des planifications avec des créneaux horaires quotidiens. Chaque créneau exécute une action (ex. set_temperature 21°C). Ajoutez des règles météo qui peuvent ignorer le créneau, modifier sa durée ou forcer une autre action selon des capteurs externes ou la position du soleil. Les créneaux peuvent être ancrés au lever/coucher du soleil pour suivre les saisons automatiquement.",de:"Erstelle Zeitpläne mit täglichen Zeitblöcken. Jeder Block führt eine Aktion aus (z.B. set_temperature 21°C). Füge Wetterregeln hinzu, die den Block überspringen, seine Dauer ändern oder eine andere Aktion basierend auf externen Sensoren oder dem Sonnenstand erzwingen können. Blöcke können an Sonnenaufgang/-untergang verankert werden, um sich automatisch an die Jahreszeit anzupassen."},"help.create_button":{it:"Crea questa schedulazione",en:"Create this schedule",fr:"Créer cette planification",de:"Diesen Zeitplan erstellen"},"help.tag.anchored":{it:"Ancorata al sole",en:"Sun-anchored",fr:"Ancrée au soleil",de:"Sonnen-verankert"},"help.tag.trigger":{it:"Trigger meteo",en:"Weather trigger",fr:"Déclencheur météo",de:"Wetter-Trigger"},"recipe.thermostat_day_night.title":{it:"Riscaldamento giorno/notte",en:"Day/night heating",fr:"Chauffage jour/nuit",de:"Tag/Nacht-Heizung"},"recipe.thermostat_day_night.when":{it:"Termostato che alterna 18°C la notte e 21°C il giorno",en:"Thermostat alternating 18°C at night and 21°C during the day",fr:"Thermostat alternant 18°C la nuit et 21°C le jour",de:"Thermostat: 18°C nachts, 21°C tagsüber"},"recipe.thermostat_day_night.howto":{it:"Tre fasce: 00-07 e 22-24 → 18°C (eco notturno), 07-22 → 21°C (comfort). Regola meteo: se la temperatura esterna supera 22°C la fascia viene saltata (non scalda inutilmente nelle giornate calde).",en:"Three blocks: 00-07 and 22-24 → 18°C (night eco), 07-22 → 21°C (comfort). Weather rule: if outdoor temperature exceeds 22°C the block is skipped (no needless heating on warm days).",fr:"Trois créneaux : 00-07 et 22-24 → 18°C (éco nuit), 07-22 → 21°C (confort). Règle météo : si la température extérieure dépasse 22°C le créneau est ignoré.",de:"Drei Blöcke: 00-07 und 22-24 → 18°C (Nacht-Eco), 07-22 → 21°C (Komfort). Wetterregel: bei Außentemperatur über 22°C wird der Block übersprungen."},"recipe.thermostat_day_night.preset_name":{it:"Riscaldamento casa",en:"Home heating",fr:"Chauffage maison",de:"Hausheizung"},"recipe.lights_at_sunset.title":{it:"Luci al tramonto",en:"Lights at sunset",fr:"Lumières au coucher du soleil",de:"Licht bei Sonnenuntergang"},"recipe.lights_at_sunset.when":{it:"Accensione 30 minuti prima del tramonto, fino alle 23",en:"Turn on 30 minutes before sunset, until 23:00",fr:"Allumage 30 minutes avant le coucher, jusqu'à 23h",de:"Einschalten 30 Min. vor Sonnenuntergang, bis 23 Uhr"},"recipe.lights_at_sunset.howto":{it:"Una fascia ancorata al tramonto con offset -30 minuti, fine fissa alle 23:00. Luce all'80% di luminosità. La fascia si sposta da sola di stagione in stagione (in inverno parte alle 16:30, in estate alle 20:00).",en:"One block anchored to sunset with -30 minute offset, fixed end at 23:00. Light at 80% brightness. The block shifts seasonally on its own (16:30 in winter, 20:00 in summer).",fr:"Un créneau ancré au coucher du soleil avec un décalage de -30 minutes, fin fixe à 23h. Lumière à 80% de luminosité. Le créneau se décale automatiquement selon la saison.",de:"Ein Block, am Sonnenuntergang verankert mit -30 Min. Versatz, festes Ende um 23 Uhr. Licht bei 80% Helligkeit. Der Block verschiebt sich automatisch je nach Jahreszeit."},"recipe.lights_at_sunset.preset_name":{it:"Luci serali",en:"Evening lights",fr:"Lumières du soir",de:"Abendliche Beleuchtung"},"recipe.blinds_wind_safety.title":{it:"Tapparelle automatiche col vento",en:"Wind-safe automatic blinds",fr:"Volets sécurité vent",de:"Windschutz für Rollladen"},"recipe.blinds_wind_safety.when":{it:"Tapparelle aperte di giorno, chiudono se il vento supera 30 km/h",en:"Blinds open during daytime, close if wind exceeds 30 km/h",fr:"Volets ouverts le jour, fermés si le vent dépasse 30 km/h",de:"Rollladen tagsüber offen, schließen bei Wind über 30 km/h"},"recipe.blinds_wind_safety.howto":{it:"Una fascia da alba a tramonto, posizione 100% (aperta). Regola meteo trigger: se vento > 30 km/h forza la chiusura, una sola volta tra alba e tramonto. Senza il rate-limit le tapparelle sbatterebbero ad ogni raffica.",en:"One block from sunrise to sunset, position 100% (open). Trigger weather rule: if wind > 30 km/h force close, at most once between sunrise and sunset. Without rate-limiting the blinds would flap on every gust.",fr:"Un créneau du lever au coucher du soleil, position 100% (ouvert). Règle déclencheur météo : si vent > 30 km/h forcer la fermeture, au plus une fois entre lever et coucher. Sans limitation, les volets battraient à chaque rafale.",de:"Ein Block von Sonnenauf- bis -untergang, Position 100% (offen). Wetter-Trigger: bei Wind > 30 km/h Schließen erzwingen, höchstens einmal zwischen Auf- und Untergang. Ohne Rate-Limiting würden die Rollladen bei jeder Böe schlagen."},"recipe.blinds_wind_safety.preset_name":{it:"Tapparelle giorno",en:"Daytime blinds",fr:"Volets jour",de:"Tagesrollladen"},"recipe.irrigation_skip_rain.title":{it:"Irrigazione mattutina con skip pioggia",en:"Morning irrigation with rain skip",fr:"Irrigation matinale avec saut pluie",de:"Morgendliche Bewässerung mit Regen-Skip"},"recipe.irrigation_skip_rain.when":{it:"30 minuti di irrigazione alle 6, saltati se la previsione indica pioggia",en:"30 minutes of irrigation at 06:00, skipped if forecast says rain",fr:"30 min d'irrigation à 6h, ignoré si pluie prévue",de:"30 Min. Bewässerung um 6 Uhr, übersprungen bei Regenvorhersage"},"recipe.irrigation_skip_rain.howto":{it:"Una fascia 06:00 → 06:30 con turn_on durata 30 minuti. Regola meteo: se la pioggia prevista nelle prossime 6 ore supera 2 mm la fascia viene saltata. Risparmia acqua nei giorni di pioggia.",en:"One block 06:00 → 06:30 with turn_on duration 30 min. Weather rule: if forecast rain in the next 6 hours exceeds 2 mm the block is skipped. Saves water on rainy days.",fr:"Un créneau 06h00 → 06h30, turn_on durée 30 min. Règle météo : si la pluie prévue dans les 6 prochaines heures dépasse 2 mm, le créneau est ignoré. Économise l'eau les jours de pluie.",de:"Ein Block 06:00 → 06:30, turn_on Dauer 30 Min. Wetterregel: bei Regenvorhersage > 2 mm in den nächsten 6 Std. wird der Block übersprungen. Spart Wasser an Regentagen."},"recipe.irrigation_skip_rain.preset_name":{it:"Irrigazione giardino",en:"Garden irrigation",fr:"Irrigation jardin",de:"Gartenbewässerung"},"recipe.boiler_eco_night.title":{it:"Boiler ECO notturno",en:"Night-ECO water heater",fr:"Chauffe-eau ECO nuit",de:"Nacht-ECO-Boiler"},"recipe.boiler_eco_night.when":{it:"Modalità electric durante il giorno, eco di notte per risparmiare",en:"Electric during the day, eco at night to save energy",fr:"Mode electric le jour, eco la nuit pour économiser",de:"Tagsüber electric, nachts eco zum Energie sparen"},"recipe.boiler_eco_night.howto":{it:"Tre fasce: 00-06 ECO, 06-23 electric, 23-24 ECO. Riduce i consumi nelle ore di non utilizzo. Aggiungi una regola meteo per saltare la fascia electric se la temperatura esterna è già alta.",en:"Three blocks: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduces consumption during unused hours. Add a weather rule to skip the electric block when outside temperature is already high.",fr:"Trois créneaux : 00-06 ECO, 06-23 electric, 23-24 ECO. Réduit la consommation aux heures non utilisées. Ajoute une règle météo pour ignorer le créneau electric si la température extérieure est élevée.",de:"Drei Blöcke: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduziert Verbrauch in ungenutzten Zeiten. Füge eine Wetterregel hinzu, um den electric-Block bei hoher Außentemperatur zu überspringen."},"recipe.boiler_eco_night.preset_name":{it:"Boiler casa",en:"Home water heater",fr:"Chauffe-eau maison",de:"Haus-Boiler"},"recipe.scene_routine.title":{it:"Routine giornaliera con scene",en:"Daily routine with scenes",fr:"Routine quotidienne avec scènes",de:"Tagesablauf mit Szenen"},"recipe.scene_routine.when":{it:"Tre fasce: mattina, sera, notte. Ogni fascia attiva una o più scene di Home Assistant.",en:"Three blocks: morning, evening, night. Each block activates one or more HA scenes.",fr:"Trois créneaux : matin, soir, nuit. Chacun déclenche une ou plusieurs scènes HA.",de:"Drei Blöcke: Morgen, Abend, Nacht. Jeder Block aktiviert eine oder mehrere HA-Szenen."},"recipe.scene_routine.howto":{it:"Dopo averla creata, apri ogni fascia e seleziona le scene da attivare nel selettore multi-scena del pannello di destra. Puoi attivarne più di una per fascia (es. ‘luci salotto’ + ‘musica relax’).",en:"After creating it, open each block and pick the scenes to fire from the multi-select picker in the right panel. You can fire multiple scenes per block (e.g. ‘living room lights’ + ‘relax music’).",fr:"Après création, ouvre chaque créneau et choisis les scènes dans le sélecteur multi-scènes à droite. Tu peux en déclencher plusieurs par créneau (ex. ‘lumières salon’ + ‘musique relax’).",de:"Nach Anlage öffne jeden Block und wähle die Szenen im Multi-Select rechts aus. Mehrere Szenen pro Block möglich (z. B. ‚Wohnzimmerlicht‘ + ‚Entspannungsmusik‘)."},"recipe.scene_routine.preset_name":{it:"Routine scene casa",en:"Home scene routine",fr:"Routine scènes maison",de:"Heim-Szenenroutine"},"recipe.alarm_arm_night.title":{it:"Allarme: arma di notte, disinserisci di giorno",en:"Alarm: arm at night, disarm by day",fr:"Alarme : armer la nuit, désarmer le jour",de:"Alarm: nachts scharf, tagsüber unscharf"},"recipe.alarm_arm_night.when":{it:"Inserimento automatico in modalità notte fra le 23:00 e le 07:00, disinserito durante il giorno.",en:"Auto-arms in night mode between 23:00 and 07:00, disarmed during the day.",fr:"Mode nuit automatique entre 23h00 et 07h00, désarmé le jour.",de:"Automatisch nachts (23:00-07:00) im Nachtmodus, tagsüber unscharf."},"recipe.alarm_arm_night.howto":{it:"Dopo averla creata, scegli il pannello d'allarme (alarm_control_panel) di Home Assistant nel selettore dispositivi della schedulazione. Modifica gli orari se necessario.",en:"After creating it, pick your HA alarm_control_panel entity in the schedule's device selector. Adjust the time blocks if needed.",fr:"Après création, sélectionne ton entité alarm_control_panel HA dans le sélecteur d'appareils. Ajuste les horaires si besoin.",de:"Nach Anlage wähle deine HA-alarm_control_panel-Entität im Geräte-Selektor. Bei Bedarf Zeitblöcke anpassen."},"recipe.alarm_arm_night.preset_name":{it:"Allarme casa",en:"Home alarm",fr:"Alarme maison",de:"Hausalarm"},"recipe.boiler_offgrid_soc.title":{it:"Boiler off-grid: scalda solo se SOC alto",en:"Off-grid water heater: heat only when SOC is high",fr:"Chauffe-eau off-grid : chauffe seulement si SOC élevé",de:"Off-grid-Boiler: nur bei hohem SOC heizen"},"recipe.boiler_offgrid_soc.when":{it:"Mantiene una temperatura minima di 35°C e fa il boost a 60°C quando la batteria off-grid è quasi piena E mancano almeno 2h al tramonto.",en:"Holds a 35°C minimum and boosts to 60°C when the off-grid battery is near full AND there are at least 2h to sunset.",fr:"Maintient 35°C min, monte à 60°C quand la batterie off-grid est quasi pleine ET qu'il reste 2h avant le coucher.",de:"Hält 35°C Minimum und steigert auf 60°C, wenn die Off-grid-Batterie fast voll ist UND mind. 2h bis zum Sonnenuntergang."},"recipe.boiler_offgrid_soc.howto":{it:"Dopo averla creata, apri la regola meteo e sostituisci sensor.battery_soc con il sensor del SOC della tua batteria. Il resto della condizione (sun.minutes_until_sunset > 120) funziona ovunque tu sia.",en:"After creating it, open the weather rule and replace sensor.battery_soc with your actual battery SOC sensor. The rest of the expression (sun.minutes_until_sunset > 120) works as-is anywhere.",fr:"Après création, ouvre la règle météo et remplace sensor.battery_soc par ton capteur SOC réel. Le reste (sun.minutes_until_sunset > 120) fonctionne tel quel partout.",de:"Nach Anlage öffne die Wetterregel und ersetze sensor.battery_soc durch deinen echten Batterie-SOC-Sensor. Der Rest (sun.minutes_until_sunset > 120) funktioniert überall unverändert."},"recipe.boiler_offgrid_soc.preset_name":{it:"Boiler off-grid",en:"Off-grid water heater",fr:"Chauffe-eau off-grid",de:"Off-grid-Boiler"},"help.glossary.title":{it:"Glossario",en:"Glossary",fr:"Glossaire",de:"Glossar"},"help.glossary.block.title":{it:"Fascia oraria (block)",en:"Time block",fr:"Créneau horaire",de:"Zeitblock"},"help.glossary.block.body":{it:"Intervallo orario quotidiano (start–end) con un'azione associata. Il sistema esegue l'azione quando il tempo corrente entra nell'intervallo.",en:"A daily time interval (start–end) with an attached action. The system runs the action when the current time enters the interval.",fr:"Intervalle horaire quotidien (start–end) avec une action associée. Le système exécute l'action quand l'heure actuelle entre dans l'intervalle.",de:"Tägliches Zeitintervall (start–end) mit einer zugewiesenen Aktion. Das System führt die Aktion aus, wenn die aktuelle Zeit das Intervall erreicht."},"help.glossary.anchor.title":{it:"Ancora alba/tramonto",en:"Sunrise/sunset anchor",fr:"Ancre lever/coucher",de:"Sonnen-Anker"},"help.glossary.anchor.body":{it:"Invece di un orario fisso, una fascia può iniziare/finire ad alba o tramonto, con un offset in minuti. Si adatta automaticamente alle stagioni.",en:"Instead of a fixed clock time, a block can start/end at sunrise or sunset with a minute offset. Adapts automatically to seasons.",fr:"Au lieu d'une heure fixe, un créneau peut commencer/finir au lever ou coucher du soleil avec un décalage en minutes. S'adapte automatiquement aux saisons.",de:"Anstelle einer festen Uhrzeit kann ein Block bei Sonnenauf- oder -untergang mit Minuten-Versatz beginnen/enden. Passt sich automatisch an die Jahreszeiten an."},"help.glossary.rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"help.glossary.rule.body":{it:"Condizione IF/THEN che modifica l'esecuzione di un blocco o agisce come trigger autonomo. Può saltare la fascia, traslarne l'orario, cambiare durata o forzare un'azione diversa.",en:"An IF/THEN condition that modifies a block's execution or acts as a standalone trigger. Can skip, shift, change duration, or force a different action.",fr:"Condition SI/ALORS qui modifie l'exécution d'un créneau ou agit comme déclencheur autonome. Peut ignorer, décaler, changer la durée ou forcer une action différente.",de:"WENN/DANN-Bedingung, die die Block-Ausführung modifiziert oder als eigenständiger Trigger dient. Kann überspringen, verschieben, Dauer ändern oder andere Aktion erzwingen."},"help.glossary.fire_mode.title":{it:"Frequenza di attivazione (fire mode)",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"help.glossary.fire_mode.body":{it:"Per regole trigger: ogni transizione, una volta al giorno, una tra alba/tramonto, o una tra tramonto/alba. Evita che oscillazioni della grandezza monitorata facciano sbattere il dispositivo.",en:"For trigger rules: every transition, once per day, once between sunrise/sunset, or once between sunset/sunrise. Prevents oscillations of the monitored value from making the device flap.",fr:"Pour les règles déclencheur : chaque transition, une fois par jour, une fois entre lever/coucher, ou une fois entre coucher/lever. Empêche les oscillations de la valeur surveillée de faire battre l'appareil.",de:"Für Trigger-Regeln: jede Transition, einmal pro Tag, einmal zwischen Auf-/Untergang oder einmal zwischen Unter-/Aufgang. Verhindert, dass Schwankungen des überwachten Wertes das Gerät zappeln lassen."},"help.glossary.override.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibungen"},"help.glossary.override.body":{it:"Per ogni attributo meteo (temperatura, umidità, vento, …) puoi puntare a una sensor.* specifica. Utile se hai una stazione meteo locale (Ecowitt, WeatherFlow) più affidabile del provider cloud.",en:"For each weather attribute (temperature, humidity, wind, …) you can point at a specific sensor.* entity. Useful if you have a local weather station (Ecowitt, WeatherFlow) more reliable than the cloud provider.",fr:"Pour chaque attribut météo (température, humidité, vent, …) tu peux pointer vers une entité sensor.* spécifique. Utile si tu as une station météo locale plus fiable.",de:"Für jedes Wetter-Attribut (Temperatur, Feuchte, Wind, …) kannst du auf eine spezifische sensor.*-Entität verweisen. Nützlich bei einer lokalen Wetterstation, zuverlässiger als Cloud-Anbieter."},"weather.attr.temperature":{it:"Temperatura attuale",en:"Current temperature",fr:"Température actuelle",de:"Aktuelle Temperatur"},"weather.attr.feels_like":{it:"Temperatura percepita",en:"Apparent temperature",fr:"Température ressentie",de:"Gefühlte Temperatur"},"weather.attr.humidity":{it:"Umidità",en:"Humidity",fr:"Humidité",de:"Luftfeuchtigkeit"},"weather.attr.dew_point":{it:"Punto di rugiada",en:"Dew point",fr:"Point de rosée",de:"Taupunkt"},"weather.attr.wind_speed":{it:"Velocità vento",en:"Wind speed",fr:"Vitesse du vent",de:"Windgeschwindigkeit"},"weather.attr.wind_gust":{it:"Raffica vento",en:"Wind gust",fr:"Rafale de vent",de:"Windböe"},"weather.attr.wind_bearing":{it:"Direzione vento",en:"Wind bearing",fr:"Direction du vent",de:"Windrichtung"},"weather.attr.pressure":{it:"Pressione atmosferica",en:"Atmospheric pressure",fr:"Pression atmosphérique",de:"Luftdruck"},"weather.attr.uv_index":{it:"Indice UV",en:"UV index",fr:"Indice UV",de:"UV-Index"},"weather.attr.solar_radiation":{it:"Irradianza solare",en:"Solar irradiance",fr:"Irradiance solaire",de:"Sonneneinstrahlung"},"weather.attr.rain_rate":{it:"Pioggia istantanea",en:"Instantaneous rain rate",fr:"Pluie instantanée",de:"Aktuelle Regenrate"},"weather.attr.rain_state":{it:"Stato pioggia (sta piovendo)",en:"Rain state (is raining)",fr:"État de pluie (il pleut)",de:"Regenzustand (regnet es)"},"weather.attr.sun.elevation":{it:"Elevazione sole",en:"Sun elevation",fr:"Élévation du soleil",de:"Sonnenstand"},"weather.attr.sun.minutes_until_sunrise":{it:"Minuti all'alba",en:"Minutes until sunrise",fr:"Minutes jusqu'au lever du soleil",de:"Minuten bis Sonnenaufgang"},"weather.attr.sun.minutes_until_sunset":{it:"Minuti al tramonto",en:"Minutes until sunset",fr:"Minutes jusqu'au coucher du soleil",de:"Minuten bis Sonnenuntergang"},"weather.attr.sun.state":{it:"Sole sopra orizzonte",en:"Sun above horizon",fr:"Soleil au-dessus de l'horizon",de:"Sonne über dem Horizont"},"weather.attr.condition":{it:"Condizione attuale",en:"Current condition",fr:"Condition actuelle",de:"Aktuelle Bedingung"},"weather.attr.forecast.temp_max_today":{it:"Temp. max oggi (forecast)",en:"Today max temp (forecast)",fr:"Temp. max aujourd'hui (prévision)",de:"Heute Höchsttemperatur (Vorhersage)"},"weather.attr.forecast.temp_min_today":{it:"Temp. min oggi (forecast)",en:"Today min temp (forecast)",fr:"Temp. min aujourd'hui (prévision)",de:"Heute Tiefsttemperatur (Vorhersage)"},"weather.attr.forecast.rain_6h":{it:"Pioggia prossime 6h",en:"Rain next 6h",fr:"Pluie 6 prochaines h",de:"Regen nächste 6 h"},"weather.attr.forecast.condition_6h":{it:"Condizione +6h",en:"Condition +6h",fr:"Condition +6 h",de:"Bedingung +6 h"}};function Ue(e,t){const i=`weather.attr.${e}`,s=qe(i);return s===i?t||e:s}const Ge="1.10.3";async function Ze(e){return e.callWS({type:"chronos/devices/list"})}async function Je(e){return e.callWS({type:"chronos/schedules/list"})}async function Ke(e,t){return e.callWS({type:"chronos/schedules/save",schedule:t})}async function Xe(e){return e.callWS({type:"chronos/settings/get"})}async function Qe(e){return e.callWS({type:"chronos/entities/available"})}function Ye(e){const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function et(e,t,i){return Math.max(t,Math.min(i,e))}let tt=15;function it(e){tt=e&&e>0?e:15}function st(e,t){const i=60/tt;return Math.round(e*i)/i}let at=null;function nt(e,t){const i=e[`${t}_anchor`],s=e[`${t}_offset`]??0;if("sunrise"===i||"sunset"===i){const e=at?.states?.["sun.sun"];if(e){const t="sunrise"===i?"next_rising":"next_setting",a=e.attributes?.[t];if(a){const e=new Date(a);if(!isNaN(e.getTime())){return et(e.getHours()+e.getMinutes()/60+e.getSeconds()/3600+s/60,0,24)}}}}const a=e[t];return"number"==typeof a?a:parseFloat(String(a??0))||0}function rt(){return[qe("days.short.0"),qe("days.short.1"),qe("days.short.2"),qe("days.short.3"),qe("days.short.4"),qe("days.short.5"),qe("days.short.6")]}const ot={thermostat:{label:"Termostato",domain:"climate",capabilities:["set_temperature","hvac_mode","preset_mode"]},light:{label:"Luce",domain:"light",capabilities:["turn_on","turn_off","brightness","color_temp"]},blind:{label:"Tapparella",domain:"cover",capabilities:["open","close","set_position","stop"]},irrigation:{label:"Irrigazione",domain:"valve",capabilities:["turn_on","turn_off","duration"]},plug:{label:"Presa smart",domain:"switch",capabilities:["turn_on","turn_off"]},fan:{label:"Ventilatore",domain:"fan",capabilities:["turn_on","turn_off","speed","oscillate"]},boiler:{label:"Boiler",domain:"water_heater",capabilities:["set_temperature","operation_mode"]},mower:{label:"Tosaerba",domain:"lawn_mower",capabilities:["start_mowing","pause","dock"]},vacuum:{label:"Robot aspirapolvere",domain:"vacuum",capabilities:["start","pause","return_to_base","fan_speed"]},scene:{label:"Scena",domain:"scene",capabilities:["turn_on"]},automation:{label:"Automazione",domain:"automation",capabilities:["turn_on","turn_off","trigger"]},alarm:{label:"Allarme",domain:"alarm_control_panel",capabilities:["arm_home","arm_away","arm_night","arm_vacation","disarm","trigger"]}};function lt(e){if(!e||!e.length)return"";if(e.every(Boolean))return qe("schedule.every_day");const t=rt();return e.map((e,i)=>e?t[i]:null).filter(Boolean).join(" · ")}let dt=class extends de{constructor(){super(...arguments),this.variant="linear",this.deviceType="thermostat",this.blocks=[],this.selectedIdx=-1,this.now=null,this.interactive=!0,this.height="normal",this.showWeather=!0,this.forecast=[],this.previewRule=null,this._drag=null,this._boundMove=null,this._boundUp=null}render(){return"radial"===this.variant?this._renderRadial():"list"===this.variant?this._renderList():this._renderLinear()}_renderRadialGhost(e,t,i,s){const a=i+14,n=this.previewRule?F`
      <circle cx="${e}" cy="${t}" r="${a}" fill="none"
        stroke="var(--border-soft)" stroke-width="${8}"
        opacity="0.4" pointer-events="none"/>
    `:F``,r=this._computePreviewRange();if(!r)return n;if(r.endH<=r.startH)return n;const o=r.startH/24*Math.PI*2-Math.PI/2,l=r.endH/24*Math.PI*2-Math.PI/2,d=r.endH-r.startH>12?1:0,c=e+a*Math.cos(o),u=t+a*Math.sin(o),h=e+a*Math.cos(l),p=t+a*Math.sin(l),v="end"===r.anchor?o:l,m=e+a*Math.cos(v),f=t+a*Math.sin(v),g="end"===r.anchor?l:o,_=a+14,b=g+.04*("end"===r.anchor?1:-1),x=e+_*Math.cos(b),w=t+_*Math.sin(b);return F`
      ${n}
      <path d="M ${c} ${u} A ${a} ${a} 0 ${d} 1 ${h} ${p}"
        fill="none" stroke="var(--accent)" stroke-width="${8}"
        stroke-linecap="round" stroke-opacity="0.95"
        pointer-events="none"/>
      <circle cx="${m}" cy="${f}" r="5" fill="var(--accent)" stroke="white" stroke-width="2" pointer-events="none"/>
      <line x1="${e+(a+4)*Math.cos(g)}" y1="${t+(a+4)*Math.sin(g)}"
        x2="${x}" y2="${w}"
        stroke="var(--accent)" stroke-width="3" stroke-linecap="round" pointer-events="none"/>
      <circle cx="${x}" cy="${w}" r="4.5" fill="var(--accent)" pointer-events="none"/>
    `}_computePreviewRange(){const e=this.previewRule;if(!e)return null;const t=e.block_index;if(null==t||t<0||t>=this.blocks.length)return null;const i=this.blocks[t],s=nt(i,"start"),a=nt(i,"end"),n=e.direction||"forward",r=(e.delta_minutes||0)/60;if("shift"===e.effect)return{startH:s+r,endH:a+r,targetIdx:t,anchor:r>=0?"end":"start"};if("extend"===e.effect)return"forward"===n?{startH:a,endH:Math.min(24,a+r),targetIdx:t,anchor:"end"}:{startH:Math.max(0,s-r),endH:s,targetIdx:t,anchor:"start"};if("shrink"===e.effect)return"forward"===n?{startH:Math.max(s,a-r),endH:a,targetIdx:t,anchor:"end"}:{startH:s,endH:Math.min(a,s+r),targetIdx:t,anchor:"start"};if("scale_duration"===e.effect){const i=(e.scale_out_min||0)/60,r=(e.scale_out_max||60)/60;return"forward"===n?{startH:s+i,endH:Math.min(24,s+r),targetIdx:t,anchor:"end"}:{startH:Math.max(0,a-r),endH:a-i,targetIdx:t,anchor:"start"}}return null}_renderLinear(){const e=e=>e/24*100,t="compact"===this.height?"timeline timeline--compact":"mini"===this.height?"timeline timeline--mini":"timeline";return q`
      <div class="${t}" @click=${this._onTrackClick}>
        ${this.showWeather&&"mini"!==this.height?this._renderWeatherRibbon():G}
        <div class="timeline__hours">
          ${Array.from({length:24}).map(()=>q`<div></div>`)}
        </div>
        ${"normal"===this.height?q`
          <div class="timeline__labels">
            ${[0,6,12,18,24].map(t=>q`<span style="left:${e(t)}%">${String(t).padStart(2,"0")}:00</span>`)}
          </div>
        `:G}
        ${this.blocks.map((t,i)=>{const s=nt(t,"start"),a=nt(t,"end");return q`
          <div
            class="tl-block"
            data-selected="${this.selectedIdx===i}"
            style="left:${e(s)}%;width:${e(a-s)}%;background:${Pe(this.deviceType,t.action)}"
            @mousedown=${e=>this._onBlockDown(e,i,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(i)}}
          >
            ${this.interactive?q`<div class="tl-block__handle tl-block__handle--l" @mousedown=${e=>this._onBlockDown(e,i,"l")}></div>`:G}
            <span class="truncate">${Le(this.deviceType,t.action)}</span>
            ${"mini"!==this.height?q`<span class="mono" style="font-size:10px;opacity:0.85">${Ye(s)}</span>`:G}
            ${this.interactive?q`<div class="tl-block__handle tl-block__handle--r" @mousedown=${e=>this._onBlockDown(e,i,"r")}></div>`:G}
          </div>
          `})}
        ${this._renderLinearGhost(e)}
        ${null!==this.now?q`<div class="tl-now" style="left:${e(this.now)}%"></div>`:G}
      </div>
    `}_renderLinearGhost(e){if(!this.previewRule)return G;const t=this._computePreviewRange();if(!t)return G;const i=e(t.startH),s=e(t.endH)-i;if(s<=0)return G;const a="var(--accent)",n="end"===t.anchor?"left":"right",r="left"===n?"right":"left",o="right"===r?"→":"←",l="left"===n?`left:${i}%`:`left:calc(${e(t.endH)}% - 4px)`,d="right"===r?`left:calc(${e(t.endH)}% + 2px)`:`right:calc(${100-e(t.startH)}% + 2px)`;return q`
      <div style="position:absolute;left:${i}%;width:${s}%;bottom:11px;height:6px;background:${a};opacity:0.85;border-radius:3px;pointer-events:none"></div>
      <div style="position:absolute;${l};bottom:8px;width:4px;height:12px;background:${a};border-radius:1px;pointer-events:none"></div>
      <div style="position:absolute;${d};bottom:8px;color:${a};font-weight:700;font-size:11px;line-height:12px;pointer-events:none">${o}</div>
    `}_renderWeatherRibbon(){return this.forecast.length?q`
      <div class="tl-weather">
        ${this.forecast.map(e=>{const t=e.condition||e.state||"cloud",i=t.includes("rain")?"rain":t.includes("sun")?"sun":t.includes("snow")?"snow":"cloud";return q`<div class="tl-weather__cell" data-state="${i}"></div>`})}
      </div>
    `:G}_renderRadial(){const e=420,t=210,i=210,s=170,a=120,n=(e,s,a,n)=>{const r=e/24*Math.PI*2-Math.PI/2,o=s/24*Math.PI*2-Math.PI/2,l=s-e>12?1:0;return`M ${t+a*Math.cos(r)} ${i+a*Math.sin(r)} A ${a} ${a} 0 ${l} 1 ${t+a*Math.cos(o)} ${i+a*Math.sin(o)} L ${t+n*Math.cos(o)} ${i+n*Math.sin(o)} A ${n} ${n} 0 ${l} 0 ${t+n*Math.cos(r)} ${i+n*Math.sin(r)} Z`},r=null!==this.now?this.now/24*Math.PI*2-Math.PI/2:null,o=(e,s,a)=>{const n=e/24*Math.PI*2-Math.PI/2,r=t+145*Math.cos(n),o=i+145*Math.sin(n);return F`
        <g style="cursor:${this.interactive?"ew-resize":"default"}" @mousedown=${e=>this._onRadialHandleDown(e,s,a)}>
          <circle cx="${r}" cy="${o}" r="9" fill="white" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="${r}" cy="${o}" r="3" fill="var(--accent)"/>
        </g>
      `},l=this.selectedIdx>=0?this.blocks[this.selectedIdx]:null;return F`
      <svg class="radial" viewBox="0 0 ${e} ${e}" style="touch-action:none">
        <circle cx="${t}" cy="${i}" r="${145}" fill="none" stroke="var(--border-soft)" stroke-width="${50}"/>
        ${this.blocks.map((e,t)=>{const i=nt(e,"start"),r=nt(e,"end");return F`
          <path
            d="${n(i,r,s,a)}"
            fill="${Pe(this.deviceType,e.action)}"
            stroke="${this.selectedIdx===t?"var(--accent)":"var(--block-edge)"}"
            stroke-width="${this.selectedIdx===t?3:1.5}"
            stroke-linejoin="round"
            style="cursor:${this.interactive?"grab":"pointer"}"
            @mousedown=${e=>this._onRadialHandleDown(e,t,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(t)}}
          />
        `})}
        ${this.blocks.map(e=>{const s=nt(e,"start"),a=nt(e,"end");if(a-s<1.5)return F``;const n=(s+a)/2/24*Math.PI*2-Math.PI/2,r=t+145*Math.cos(n),o=i+145*Math.sin(n),l=Oe(this.deviceType,e.action.id);let d="";return l?.value&&void 0!==e.action.value&&null!==e.action.value&&""!==e.action.value?d=`${e.action.value}${l.value.unit||""}`:l?.label&&(d=l.label.length>8?l.label.slice(0,7)+"…":l.label),d?F`
            <text x="${r}" y="${o}" text-anchor="middle" dy="4"
              font-size="13" font-weight="700"
              style="fill:#0f172a;stroke:rgba(255,255,255,0.9);stroke-width:2.5;paint-order:stroke fill"
              pointer-events="none">${d}</text>
          `:F``})}
        ${Array.from({length:24}).map((e,s)=>{const a=s/24*Math.PI*2-Math.PI/2,n=s%6==0?156:162;return F`<line x1="${t+168*Math.cos(a)}" y1="${i+168*Math.sin(a)}" x2="${t+n*Math.cos(a)}" y2="${i+n*Math.sin(a)}" stroke="white" stroke-width="${s%6==0?2:1}" opacity="0.7" pointer-events="none"/>`})}
        ${[0,6,12,18].map(e=>{const s=e/24*Math.PI*2-Math.PI/2;return F`<text x="${t+195*Math.cos(s)}" y="${i+195*Math.sin(s)}" text-anchor="middle" dy="4" font-size="11">${String(e).padStart(2,"0")}</text>`})}
        ${this._renderRadialGhost(t,i,s,n)}
        ${this.interactive&&l?F`${o(nt(l,"start"),this.selectedIdx,"l")}${o(nt(l,"end"),this.selectedIdx,"r")}`:G}
        ${null!==r?F`
          <g pointer-events="none">
            <line x1="${t+90*Math.cos(r)}" y1="${i+90*Math.sin(r)}" x2="${t+190*Math.cos(r)}" y2="${i+190*Math.sin(r)}" stroke="var(--danger)" stroke-width="2"/>
            <circle cx="${t+190*Math.cos(r)}" cy="${i+190*Math.sin(r)}" r="5" fill="var(--danger)"/>
          </g>
        `:G}
        <text x="${t}" y="${204}" text-anchor="middle" class="radial__label" font-size="32" font-weight="700" pointer-events="none">${null!==this.now?Ye(this.now):"—"}</text>
        <text x="${t}" y="${224}" text-anchor="middle" font-size="11" pointer-events="none">24h · oggi</text>
      </svg>
    `}_renderList(){const e=this._computePreviewRange();return q`
      <div class="tl-list">
        ${this.blocks.map((t,i)=>{const s=e&&e.targetIdx===i?this._listPreviewLabel(e):"";return q`
          <div
            class="tl-list__row"
            style="border-color:${this.selectedIdx===i?"var(--accent)":"var(--border-soft)"};background:${this.selectedIdx===i?"var(--accent-soft)":"var(--bg-sunken)"}"
            @click=${()=>this._fireSelect(i)}
          >
            <div class="tl-list__time">${Ye(nt(t,"start"))} → ${Ye(nt(t,"end"))}</div>
            <div class="tl-list__mode">
              <span class="tl-list__mode-dot" style="background:${Pe(this.deviceType,t.action)}"></span>
              <strong>${Le(this.deviceType,t.action)}</strong>
            </div>
            ${s?q`
              <span class="chip" style="background:var(--accent-soft);color:var(--accent-ink);font-weight:600">
                ${s}
              </span>
            `:G}
            <span class="mono text-xs text-mute">${Math.round(60*(nt(t,"end")-nt(t,"start")))} min</span>
          </div>
          `})}
      </div>
    `}_listPreviewLabel(e){const t=this.previewRule;if(!t)return"";const i=Math.round(60*(e.endH-e.startH)),s="end"===e.anchor?"→":"←";if("shift"===t.effect)return`${s} shift ${i}m`;if("extend"===t.effect)return`${s} +${i} min`;if("shrink"===t.effect)return`${s} −${i} min`;if("scale_duration"===t.effect){return`${s} ${t.scale_out_min??0}–${t.scale_out_max??60} min`}return""}_onBlockDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t];this._drag={idx:t,ref:s,handle:i,startX:e.clientX,origStart:nt(s,"start"),origEnd:nt(s,"end")},this._boundMove=e=>this._onDragMove(e),this._boundUp=()=>this._onDragUp(),window.addEventListener("mousemove",this._boundMove),window.addEventListener("mouseup",this._boundUp)}_onDragMove(e){if(!this._drag)return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=st(et((e.clientX-i.left)/i.width*24,0,24)),a=this.blocks.indexOf(this._drag.ref);if(a<0)return;const n=[...this.blocks],r={...n[a]};if("l"===this._drag.handle){const e=et(s,0,nt(r,"end")-.25);r.start=e,delete r.start_anchor,delete r.start_offset}else if("r"===this._drag.handle){const e=et(s,nt(r,"start")+.25,24);r.end=e,delete r.end_anchor,delete r.end_offset}else{const t=(e.clientX-this._drag.startX)/i.width*24,s=this._drag.origEnd-this._drag.origStart;let a=et(this._drag.origStart+t,0,24-s);a=st(a),r.start=a,r.end=a+s,delete r.start_anchor,delete r.start_offset,delete r.end_anchor,delete r.end_offset}n[a]=r,this._drag.ref=r,this._fireBlocksChanged(n)}_onDragUp(){this._drag=null,this._boundMove&&window.removeEventListener("mousemove",this._boundMove),this._boundUp&&window.removeEventListener("mouseup",this._boundUp),this._boundMove=null,this._boundUp=null}_onRadialHandleDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t],a=this.shadowRoot?.querySelector(".radial");if(!a)return;const n=e=>{const t=a.getBoundingClientRect(),i=420,s=(e.clientX-t.left)/t.width*i,n=(e.clientY-t.top)/t.height*i;let r=Math.atan2(n-210,s-210)+Math.PI/2;return r<0&&(r+=2*Math.PI),r/(2*Math.PI)*24},r=n(e),o=nt(s,"start"),l=nt(s,"end");let d=s;const c=e=>{const t=n(e),s=st(t),a=this.blocks.indexOf(d);if(a<0)return;const c=[...this.blocks],u={...c[a]};if("l"===i)u.start=et(s,0,nt(u,"end")-.25),delete u.start_anchor,delete u.start_offset;else if("r"===i)u.end=et(s,nt(u,"start")+.25,24),delete u.end_anchor,delete u.end_offset;else{const e=l-o;let i=o+(t-r);i=st(i),i=et(i,0,24-e),u.start=i,u.end=i+e,delete u.start_anchor,delete u.start_offset,delete u.end_anchor,delete u.end_offset}c[a]=u,d=u,this._fireBlocksChanged(c)},u=()=>{window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",u)};window.addEventListener("mousemove",c),window.addEventListener("mouseup",u)}_onTrackClick(e){if(!this.interactive)return;if(e.target.closest(".tl-block"))return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=et((e.clientX-i.left)/i.width*24,0,24),a=Math.max(0,st(s)-.5),n=Math.min(24,a+1),r=this.blocks.some(e=>{const t=nt(e,"start"),i=nt(e,"end");return!(n<=t||a>=i)});if(r)return;const o=[...this.blocks,{start:a,end:n,action:We(this.deviceType)}];this._fireBlocksChanged(o)}_fireSelect(e){this.dispatchEvent(new CustomEvent("block-select",{detail:{index:e}}))}_fireBlocksChanged(e){this.dispatchEvent(new CustomEvent("blocks-changed",{detail:{blocks:e}}))}};dt.styles=ge,e([ve({type:String})],dt.prototype,"variant",void 0),e([ve({type:String})],dt.prototype,"deviceType",void 0),e([ve({type:Array})],dt.prototype,"blocks",void 0),e([ve({type:Number})],dt.prototype,"selectedIdx",void 0),e([ve({type:Number})],dt.prototype,"now",void 0),e([ve({type:Boolean})],dt.prototype,"interactive",void 0),e([ve({type:String})],dt.prototype,"height",void 0),e([ve({type:Boolean})],dt.prototype,"showWeather",void 0),e([ve({type:Array})],dt.prototype,"forecast",void 0),e([ve({attribute:!1})],dt.prototype,"previewRule",void 0),e([me()],dt.prototype,"_drag",void 0),dt=e([ue("chronos-timeline")],dt);let ct=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t}=this.card,i=e.length,s=e.filter(e=>e.enabled).length,a=e.reduce((e,t)=>e+(t.weather_rules||[]).filter(e=>e.active).length,0);return q`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${qe("screen.overview.title")}</h1>
          <p class="page-sub">${qe("overview.subtitle",{n:s,tot:i})}</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${qe("overview.kpi.active")}</div>
            <div class="kpi__value">${s}<span class="text-mute" style="font-size:16px;margin-left:6px">/${i}</span></div>
            <div class="kpi__delta">${t.length} ${qe("overview.kpi.devices").toLowerCase()}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${qe("overview.kpi.weather_rules")}</div>
            <div class="kpi__value">${a}</div>
            <div class="kpi__delta">${qe("device.state.live")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${qe("overview.kpi.now")}</div>
            <div class="kpi__value">${Ye(this.nowHour)}</div>
            <div class="kpi__delta">${qe("device.state.live")}</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">${qe("nav.overview")}</h2>
            <span class="tag mono">${i}</span>
          </div>
          <div class="row" style="flex-wrap:wrap;gap:8px">
            <button class="btn" @click=${()=>this.card.navigate("week")}>${_e("calendar",14)} ${qe("nav.week")}</button>
            <button class="btn" @click=${()=>this.card.createSceneSchedule()} title="${qe("overview.new_scene.hint")}">
              ${_e("sun",14)} ${qe("overview.new_scene")}
            </button>
            <button class="btn" @click=${()=>this.card.createAutomationSchedule()} title="${qe("overview.new_automation.hint")}">
              ${_e("wand",14)} ${qe("overview.new_automation")}
            </button>
            <button class="btn btn--primary" @click=${()=>this.card.navigate("wizard")}>${_e("plus",14)} ${qe("nav.new_schedule")}</button>
          </div>
        </div>

        <div class="grid-auto">
          ${e.map(e=>{const i=(e.device_ids||[]).map(e=>t.find(t=>t.id===e)).filter(Boolean),s=(e.weather_rules||[]).filter(e=>e.active).length;return q`
              <div class="sched-card" data-selected="${e.id===this.card._selectedId}"
                @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                <div class="sched-card__header">
                  <div style="flex:1;min-width:0">
                    <h3 class="sched-card__title">${e.name}</h3>
                    <div class="sched-card__sub">${lt(e.days)} · ${e.blocks.length}</div>
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
                    ${i.slice(0,5).map(e=>{const t=Ee(e,this.card.hass?.states?.[e.entity_id],this.card._settings);return q`<div class="device-icon-pill" title="${e.alias}" style="background:${t.soft};color:${t.accent}">${xe(e.type,14)}</div>`})}
                    ${i.length>5?q`<div class="device-icon-pill mono" style="font-size:10px">+${i.length-5}</div>`:G}
                  </div>
                  <div style="flex:1"></div>
                  ${s>0?q`<span class="chip chip--weather">${_e("cloud",11)} ${qe("overview.rules_count",{n:s})}</span>`:G}
                  <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?qe("schedule.active"):qe("schedule.disabled")}</span>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}};ct.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],ct.prototype,"card",void 0),e([ve({type:Number})],ct.prototype,"nowHour",void 0),ct=e([ue("chronos-overview")],ct);let ut=class extends de{constructor(){super(...arguments),this.nowHour=0,this._selectedBlockIdx=0,this._selectedRuleIdx=-1,this._confirmDelete=!1,this._entitySearch=""}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return q`<div class="text-mute" style="padding:40px;text-align:center">${qe("overview.no_schedules")}</div>`;const t=e.blocks[this._selectedBlockIdx],i=(e.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean),s=e.device_type,a=ot[s]||{label:s},n=He(s),r=t?.action?Oe(s,t.action.id):null,o=this.card.isDirty;return q`
      <div class="col" style="gap:18px">
        <div class="sp-between">
          <div>
            <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")} style="margin-bottom:6px">
              ${_e("chevron-left",14)} ${qe("nav.overview")}
            </button>
            <input class="input" .value=${e.name}
              @input=${t=>this.card.updateScheduleLocal(e.id,{name:t.target.value})}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?qe("schedule.active"):qe("schedule.disabled")}</span>
              <span class="chip">${_e("repeat",11)} ${lt(e.days)}</span>
              <span class="chip chip--accent">${xe(s,11)} ${a.label}</span>
              ${"scene"!==s&&"automation"!==s?q`<span class="chip">${_e("device",11)} ${i.length}</span>`:G}
              ${(e.weather_rules||[]).filter(e=>e.active).length>0?q`<span class="chip chip--weather">${_e("cloud",11)} ${qe("overview.rules_count",{n:(e.weather_rules||[]).filter(e=>e.active).length})}</span>`:G}
            </div>
          </div>
          <div class="row" style="gap:10px">
            <label class="switch">
              <input type="checkbox" .checked=${e.enabled} @change=${t=>this.card.doToggleSchedule(e.id,t.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" style="color:var(--danger)" @click=${()=>{this._confirmDelete=!0}} title="${qe("common.delete")}">${_e("trash",14)}</button>
            <button class="btn"
              style="background:${o?"var(--warn)":"var(--ok)"};color:white;border-color:transparent;cursor:${o?"pointer":"default"};font-weight:600"
              @click=${()=>{o&&this.card.saveCurrentSchedule()}}>
              ${_e("check",14)} ${qe(o?"editor.dirty.unsaved":"editor.dirty.saved")}
            </button>
          </div>
        </div>

        <div class="editor-cols">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">${qe("wizard.step.time")}</h3>
                  <p class="card__sub">${qe("editor.add_block_hint")}</p>
                </div>
                <div class="segmented">
                  ${["linear","radial","list"].map(e=>q`
                    <button data-active="${this.card._timelineVariant===e}" @click=${()=>this.card.setTimelineVariant(e)}>
                      ${qe("timeline."+e)}
                    </button>
                  `)}
                </div>
              </div>
              <chronos-timeline
                .variant=${this.card._timelineVariant}
                .deviceType=${s}
                .blocks=${e.blocks}
                .selectedIdx=${this._selectedBlockIdx}
                .now=${e.enabled?this.nowHour:null}
                .interactive=${!0}
                .forecast=${this.card._forecast}
                .previewRule=${this._selectedRuleIdx>=0?e.weather_rules?.[this._selectedRuleIdx]:null}
                @block-select=${e=>{this._selectedBlockIdx=e.detail.index}}
                @blocks-changed=${t=>{this.card.updateBlocksLocal(e.id,t.detail.blocks)}}
              ></chronos-timeline>
              <div class="row" style="margin-top:14px;justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div class="row" style="gap:14px;flex-wrap:wrap">
                  ${n.map(e=>q`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${Ie[e.kind]};display:inline-block"></span>
                      <span class="text-xs">${e.label}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${()=>{const t=[...e.blocks,{start:12,end:13,action:We(s)}];this.card.updateBlocksLocal(e.id,t)}}>
                  ${_e("plus",12)} ${qe("common.add")}
                </button>
              </div>
            </div>

            <!-- Days -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${qe("editor.days.repeat")}</h3><p class="card__sub">${qe("wizard.days.hint")}</p></div>
              </div>
              <div class="row" style="gap:16px;flex-wrap:wrap">
                <div class="row" style="gap:4px">
                  ${rt().map((t,i)=>{const s=e.days[i];return q`
                      <button class="mono" @click=${()=>{const t=[...e.days];t[i]=t[i]?0:1,this.card.updateScheduleLocal(e.id,{days:t})}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;letter-spacing:0.02em;background:${s?"var(--accent)":"var(--bg-sunken)"};color:${s?"white":"var(--text-muted)"};border:1px solid ${s?"transparent":"var(--border-soft)"};cursor:pointer">
                        ${t}
                      </button>
                    `})}
                </div>
                <div class="row" style="gap:6px">
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,1,1]})}>${qe("editor.days.all")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,0,0]})}>${qe("editor.days.weekdays")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[0,0,0,0,0,1,1]})}>${qe("editor.days.weekend")}</button>
                </div>
              </div>
              ${this._renderDateRange(e)}
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${qe("editor.weather_rules.title")}</h3><p class="card__sub">${qe("nav.weather_rules")}</p></div>
                <button class="btn btn--sm" @click=${()=>this.card.navigate("weatherRule")}>${_e("plus",12)} ${qe("editor.weather_rules.add")}</button>
              </div>
              ${(e.weather_rules||[]).length?q`<div class="col" style="gap:8px">
                    ${(e.weather_rules||[]).map((t,i)=>{const s=null===t.block_index||void 0===t.block_index?qe("wr.target.all_blocks"):(()=>{const i=e.blocks[t.block_index];return i?`#${t.block_index+1} ${Ye(nt(i,"start"))}-${Ye(nt(i,"end"))}`:`#${t.block_index+1}`})(),a=this._selectedRuleIdx===i;return q`
                      <div class="rule-block" data-selected="${a}"
                        style="cursor:pointer;${a?"border:2px solid var(--accent);background:var(--accent-soft)":""}"
                        @click=${()=>{this._selectedRuleIdx=a?-1:i}}>
                        <span class="chip chip--accent" style="flex:0 0 auto" title="${qe("wr.target.label")}">
                          ${_e("clock",11)} ${s}
                        </span>
                        ${t.if?q`
                          <span class="rule-block__label rule-block__label--if">IF</span>
                          <span class="rule-token rule-token--weather">${t.if}</span>
                        `:G}
                        <span class="rule-block__label rule-block__label--then">${qe("wr.effect."+(t.effect||"skip"))}</span>
                        <span class="rule-token rule-token--accent">${t.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch" @click=${e=>e.stopPropagation()}>
                          <input type="checkbox" .checked=${t.active} @change=${t=>{const s=[...e.weather_rules||[]];s[i]={...s[i],active:t.target.checked},this.card.updateScheduleLocal(e.id,{weather_rules:s})}}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                        <button class="btn btn--icon btn--ghost btn--sm"
                          @click=${t=>{t.stopPropagation(),this.card.editWeatherRule(e.id,i)}}
                          title="${"common.edit"!==qe("common.edit")?qe("common.edit"):"Modifica"}">
                          ${_e("edit",12)}
                        </button>
                        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                          @click=${s=>{if(s.stopPropagation(),!confirm(`${qe("common.remove")}: ${t.if||""} → ${t.then}?`))return;const a=(e.weather_rules||[]).filter((e,t)=>t!==i);this.card.updateScheduleLocal(e.id,{weather_rules:a}),this._selectedRuleIdx===i&&(this._selectedRuleIdx=-1)}}
                          title="${qe("common.remove")}">
                          ${_e("trash",12)}
                        </button>
                      </div>
                      `})}
                  </div>`:q`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("cloud",22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">${qe("editor.weather_rules.empty")}</div>
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${qe("wizard.time.selected")}</h3><p class="card__sub">${t?`${Ye(t.start)} → ${Ye(t.end)}`:""}</p></div>
              </div>
              ${t?q`
                <div class="col" style="gap:12px">
                  ${this._renderTimeEdge(e.id,t,"start")}
                  ${this._renderTimeEdge(e.id,t,"end")}
                  ${this._renderWrapWarning(t)}
                  <div class="field">
                    <label class="field__label">${qe("editor.block.action")}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${n.map(i=>{const s=t.action?.id===i.id;return q`<button class="btn btn--sm" @click=${()=>this._setBlockAction(e.id,i.id,i.value?.default)}
                          style="background:${s?Ie[i.kind]:"var(--surface)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border)"}">
                          ${i.label}</button>`})}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${r?.service||""}</span>
                  </div>
                  ${r?.value?q`
                    <div class="field">
                      <label class="field__label">${r.value.label||qe("common.value")} ${r.value.unit?q`<span class="text-mute">(${r.value.unit})</span>`:G}</label>
                      ${"number"===r.value.type?q`
                        <div class="row" style="gap:10px;align-items:center">
                          <input type="range" min="${r.value.min}" max="${r.value.max}" step="${r.value.step}"
                            .value=${String(t.action?.value??r.value.default)}
                            @input=${t=>this._setBlockValue(e.id,parseFloat(t.target.value))}
                            style="flex:1"/>
                          <input type="number" class="input mono"
                            min="${r.value.min}" max="${r.value.max}" step="${r.value.step}"
                            .value=${String(t.action?.value??r.value.default)}
                            @input=${t=>{const i=parseFloat(t.target.value);isNaN(i)||this._setBlockValue(e.id,i)}}
                            style="width:90px;text-align:right;font-weight:600"/>
                          <span class="mono text-mute" style="min-width:30px">${r.value.unit||""}</span>
                        </div>
                      `:"enum"===r.value.type?q`
                        <select class="input"
                          @change=${t=>this._setBlockValue(e.id,t.target.value)}>
                          ${(r.value.options||[]).map(e=>{const i=String(t.action?.value??r.value.default);return q`<option value="${e}" ?selected=${i===e}>${e}</option>`})}
                        </select>
                      `:"entity"===r.value.type?this._renderEntityPicker(e.id,t,r.value):G}
                    </div>
                  `:G}
                  ${r?.extras?.length?this._renderExtras(e.id,t,r):G}
                  ${this._renderBlockDeviceSubset(e,t)}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${()=>this._removeBlock(e.id)}>
                    ${_e("trash",14)} ${qe("editor.block.delete")}
                  </button>
                </div>
              `:G}
            </div>

            ${"scene"===s||"automation"===s?q`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1">
                    <h3 class="card__title">${qe("automation"===s?"editor.automation.section":"editor.scene.section")}</h3>
                    <p class="card__sub">${qe("automation"===s?"editor.automation.section.hint":"editor.scene.section.hint")}</p>
                  </div>
                </div>
                <p class="text-xs text-mute" style="margin:0">${qe("automation"===s?"editor.automation.no_devices":"editor.scene.no_devices")}</p>
              </div>
            `:q`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1"><h3 class="card__title">${qe("editor.devices_section")}</h3><p class="card__sub">${qe("editor.devices_count",{n:i.length})}</p></div>
                </div>
                ${this._renderDevicePicker(e,s)}
                <div class="col" style="gap:2px;margin-top:10px">
                  ${i.map(t=>q`
                    <div class="device-row">
                      <div class="device-row__icon">${xe(t.type,17)}</div>
                      <div class="device-row__main">
                        <div class="device-row__name">${t.alias}</div>
                        <div class="device-row__meta">${t.area} · ${t.entity_id}</div>
                      </div>
                      <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                        @click=${()=>this._removeDeviceFromSchedule(e.id,t.id)}
                        title="${qe("common.remove")}">
                        ${_e("trash",12)}
                      </button>
                    </div>
                  `)}
                  ${i.length?G:q`
                    <p class="text-xs text-mute" style="text-align:center;padding:14px 0;font-style:italic">${qe("editor.devices_empty")}</p>
                  `}
                </div>
              </div>
            `}
          </div>
        </div>
        ${this._confirmDelete?this._renderDeleteModal(e):G}
      </div>
    `}_renderTimeEdge(e,t,i){const s=t[`${i}_anchor`],a=t[`${i}_offset`]??0,n=s??"fixed",r=nt(t,i),o=qe("start"===i?"editor.block.from":"editor.block.to");return q`
      <div class="field">
        <label class="field__label">${o}</label>
        <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
          <select class="select mono" style="width:130px"
            @change=${t=>this._setEdgeMode(e,i,t.target.value)}>
            <option value="fixed" ?selected=${"fixed"===n}>${qe("editor.block.fixed")}</option>
            <option value="sunrise" ?selected=${"sunrise"===n}>${qe("editor.block.sunrise")}</option>
            <option value="sunset" ?selected=${"sunset"===n}>${qe("editor.block.sunset")}</option>
          </select>
          ${"fixed"===n?q`
            <input type="time" class="input mono" style="width:120px"
              .value=${this._toHHMM(r)}
              @change=${t=>this._setEdgeFixed(e,i,t.target.value)}/>
          `:q`
            <input type="number" class="input mono" style="width:90px" step="5" min="-180" max="180"
              .value=${String(a)}
              @change=${t=>this._setEdgeOffset(e,i,parseInt(t.target.value,10))}/>
            <span class="text-xs text-mute">min</span>
            <span class="text-xs text-mute" style="font-style:italic">→ ${qe("editor.block.today")} ${Ye(r)}</span>
          `}
        </div>
      </div>
    `}_toHHMM(e){const t=Number.isFinite(e)?Math.max(0,Math.min(23.999,e)):0;let i=Math.floor(t),s=Math.round(60*(t-i));return s>=60&&(s=0,i=Math.min(23,i+1)),`${String(i).padStart(2,"0")}:${String(s).padStart(2,"0")}`}_commitBlocks(e,t,i){this.card.updateBlocksLocal(e,t);const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=s.blocks.indexOf(i);a>=0&&(this._selectedBlockIdx=a)}_blockWrapsMidnight(e){const t=e.start_anchor,i=e.end_anchor;if("sunset"===t&&"sunrise"===i)return!0;const s=nt(e,"start");return nt(e,"end")<=s}_renderWrapWarning(e){return this._blockWrapsMidnight(e)?q`
      <div style="border:1px solid var(--warn);background:var(--warn-soft,#fff7ed);color:#92400e;padding:10px 12px;border-radius:8px;font-size:12.5px;line-height:1.4">
        <strong>${qe("editor.block.wrap_warn.title")}</strong>
        <div style="margin-top:4px">${qe("editor.block.wrap_warn.body")}</div>
      </div>
    `:G}_setEdgeMode(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.blocks],n={...a[this._selectedBlockIdx]};if("fixed"===i){const e=nt(n,t);n[t]=e,delete n[`${t}_anchor`],delete n[`${t}_offset`]}else n[`${t}_anchor`]=i,void 0===n[`${t}_offset`]&&(n[`${t}_offset`]=0);a[this._selectedBlockIdx]=n,this._commitBlocks(e,a,n)}_setEdgeFixed(e,t,i){if(!i)return;const[s,a]=i.split(":").map(e=>parseInt(e,10));if(isNaN(s)||isNaN(a))return;const n=this.card._schedules.find(t=>t.id===e);if(!n)return;const r=[...n.blocks],o={...r[this._selectedBlockIdx]};o[t]=s+a/60,delete o[`${t}_anchor`],delete o[`${t}_offset`],r[this._selectedBlockIdx]=o,this._commitBlocks(e,r,o)}_setEdgeOffset(e,t,i){if(isNaN(i))return;const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.blocks],n={...a[this._selectedBlockIdx]};n[`${t}_offset`]=i,a[this._selectedBlockIdx]=n,this._commitBlocks(e,a,n)}_renderBlockDeviceSubset(e,t){if("scene"===e.device_type||"automation"===e.device_type)return G;const i=e.device_ids||[];if(i.length<2)return G;const s=t.device_ids||[],a=0===s.length||s.length===i.length,n=new Set(a?i:s),r=i.map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean);return q`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${qe("editor.block.targets")}</label>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <button class="btn btn--sm" @click=${()=>this._setBlockDeviceSubset(e.id,[])}
            style="background:${a?"var(--accent)":"var(--bg-sunken)"};color:${a?"white":"var(--text)"};border-color:${a?"transparent":"var(--border-soft)"}">
            ${a?_e("check",11):G} ${qe("editor.block.targets.all")}
          </button>
          ${r.map(t=>{const i=!a&&n.has(t.id);return q`
              <button class="btn btn--sm" @click=${()=>this._toggleBlockDeviceTarget(e.id,t.id)}
                style="background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text)"};border-color:${i?"transparent":"var(--border-soft)"}">
                ${i?_e("check",11):G} ${xe(t.type,11)} ${t.alias}
              </button>
            `})}
        </div>
        <span class="field__hint" style="margin-top:4px">${qe("editor.block.targets.hint")}</span>
      </div>
    `}_setBlockDeviceSubset(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=[...i.blocks],a={...s[this._selectedBlockIdx]};t.length?a.device_ids=t:delete a.device_ids,s[this._selectedBlockIdx]=a,this._commitBlocks(e,s,a)}_toggleBlockDeviceTarget(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=i.blocks[this._selectedBlockIdx];if(!s)return;const a=i.device_ids||[],n=s.device_ids||[];let r;r=n.length?n.includes(t)?n.filter(e=>e!==t):[...n,t]:a.filter(e=>e!==t),r.length===a.length&&(r=[]),this._setBlockDeviceSubset(e,r)}_renderEntityPicker(e,t,i){const s="automation"===i.domain?this.card._automationEntities:this.card._sceneEntities,a=t.action?.value,n=Array.isArray(a)?a:"string"==typeof a&&a?[a]:[],r="automation"===i.domain?qe("editor.automation.pick_placeholder"):qe("editor.scene.pick_placeholder"),o="automation"===i.domain?qe("editor.automation.pick_warn"):qe("editor.scene.pick_warn");if(!i.multi)return q`
        <select class="input"
          @change=${t=>this._setBlockValue(e,t.target.value)}>
          <option value="" ?selected=${!a}>${r}</option>
          ${s.map(e=>q`
            <option value="${e.entity_id}" ?selected=${a===e.entity_id}>
              ${e.friendly_name||e.entity_id}
            </option>
          `)}
        </select>
        ${a?G:q`<span class="field__hint" style="color:var(--warn);margin-top:4px">${o}</span>`}
      `;const l=this._entitySearch.trim().toLowerCase(),d=l?s.filter(e=>{if(n.includes(e.entity_id))return!0;return`${e.friendly_name||""} ${e.entity_id||""}`.toLowerCase().includes(l)}):s;return q`
      <div class="col" style="gap:8px">
        ${s.length>6?q`
          <input class="input" type="search" .value=${this._entitySearch}
            placeholder="${qe("editor.entity.search")}"
            @input=${e=>{this._entitySearch=e.target.value}}/>
        `:G}
        <div class="row" style="gap:6px;flex-wrap:wrap">
          ${d.length?d.map(t=>{const i=t.entity_id,s=n.includes(i);return q`
              <button class="btn btn--sm"
                @click=${()=>this._toggleEntitySelection(e,i)}
                style="background:${s?"var(--accent)":"var(--bg-sunken)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border-soft)"}">
                ${s?_e("check",11):G} ${t.friendly_name||i}
              </button>
            `}):q`<span class="text-xs text-mute">${s.length?qe("editor.entity.no_match"):qe("editor.entity.empty")}</span>`}
        </div>
        ${0===n.length?q`<span class="field__hint" style="color:var(--warn)">${o}</span>`:q`<span class="field__hint">${qe("editor.entity.count",{n:n.length})}</span>`}
      </div>
    `}_toggleEntitySelection(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=i.blocks[this._selectedBlockIdx];if(!s)return;const a=s.action?.value,n=Array.isArray(a)?[...a]:"string"==typeof a&&a?[a]:[],r=n.indexOf(t);r>=0?n.splice(r,1):n.push(t),this._setBlockValue(e,n)}_renderExtras(e,t,i){const s=t.action?.extras||{};return q`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${qe("editor.block.extras")}</label>
        <div class="col" style="gap:8px">
          ${(i.extras||[]).map(t=>{const i=s[t.key];return q`
              <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
                <span class="text-xs text-mute" style="min-width:130px">${t.label||t.key}${t.unit?` (${t.unit})`:""}</span>
                ${"color"===t.type?q`
                  <input type="color"
                    .value=${this._rgbToHex(i)}
                    @input=${i=>this._setBlockExtra(e,t.key,this._hexToRgb(i.target.value))}
                    style="width:48px;height:32px;padding:0;border:1px solid var(--border-soft);border-radius:6px;cursor:pointer"/>
                `:"number"===t.type?q`
                  <input type="number" class="input mono"
                    min="${t.min}" max="${t.max}" step="${t.step}"
                    .value=${null!=i?String(i):""}
                    @input=${i=>{const s=i.target.value,a=""===s?void 0:parseFloat(s);this._setBlockExtra(e,t.key,isNaN(a)?void 0:a)}}
                    placeholder="—"
                    style="flex:1;min-width:100px"/>
                `:G}
                ${null!=i&&""!==i?q`
                  <button class="btn btn--icon btn--ghost btn--sm" title="${qe("common.remove")}"
                    @click=${()=>this._setBlockExtra(e,t.key,void 0)}>
                    ${_e("close",12)}
                  </button>
                `:G}
              </div>
            `})}
        </div>
        <span class="field__hint">${qe("editor.block.extras.hint")}</span>
      </div>
    `}_setBlockExtra(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.blocks],n=a[this._selectedBlockIdx];if(!n)return;const r={...n.action||{id:""}},o={...r.extras||{}};void 0===i?delete o[t]:o[t]=i,r.extras=Object.keys(o).length?o:void 0,a[this._selectedBlockIdx]={...n,action:r},this.card.updateBlocksLocal(e,a)}_rgbToHex(e){if(!Array.isArray(e)||e.length<3)return"#ffffff";const[t,i,s]=e;return"#"+[t,i,s].map(e=>Math.max(0,Math.min(255,0|e)).toString(16).padStart(2,"0")).join("")}_hexToRgb(e){const t=e.replace("#","");return[parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16),parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16),parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)]}_renderDateRange(e){const t=e.date_range,i=!!t,s=Array.from({length:12},(e,t)=>t+1),a=Array.from({length:31},(e,t)=>t+1);return q`
      <div style="margin-top:14px;border-top:1px dashed var(--border-soft);padding-top:14px">
        <div class="row" style="gap:12px;align-items:center">
          <label class="switch">
            <input type="checkbox" .checked=${i}
              @change=${t=>{const i=t.target.checked?{start_month:1,start_day:1,end_month:12,end_day:31}:null;this.card.updateScheduleLocal(e.id,{date_range:i})}}/>
            <span class="switch__track"></span>
            <span class="switch__thumb"></span>
          </label>
          <span class="text-sm fw-600">${qe("editor.date_range.toggle")}</span>
        </div>
        <span class="field__hint" style="display:block;margin-top:4px">${qe("editor.date_range.hint")}</span>
        ${i?q`
          <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center">
            <span class="text-xs text-mute" style="min-width:30px">${qe("editor.date_range.from")}</span>
            <select class="select mono" style="width:140px"
              @change=${t=>this._updateDateRange(e.id,"start_month",parseInt(t.target.value,10))}>
              ${s.map(e=>q`<option value="${e}" ?selected=${t.start_month===e}>${this._monthLabel(e)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${t=>this._updateDateRange(e.id,"start_day",parseInt(t.target.value,10))}>
              ${a.map(e=>q`<option value="${e}" ?selected=${t.start_day===e}>${e}</option>`)}
            </select>
            <span class="text-xs text-mute" style="min-width:30px">${qe("editor.date_range.to")}</span>
            <select class="select mono" style="width:140px"
              @change=${t=>this._updateDateRange(e.id,"end_month",parseInt(t.target.value,10))}>
              ${s.map(e=>q`<option value="${e}" ?selected=${t.end_month===e}>${this._monthLabel(e)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${t=>this._updateDateRange(e.id,"end_day",parseInt(t.target.value,10))}>
              ${a.map(e=>q`<option value="${e}" ?selected=${t.end_day===e}>${e}</option>`)}
            </select>
          </div>
          ${100*t.start_month+t.start_day>100*t.end_month+t.end_day?q`
            <span class="field__hint" style="display:block;margin-top:6px;color:var(--warn)">${qe("editor.date_range.wraps")}</span>
          `:G}
        `:G}
      </div>
    `}_updateDateRange(e,t,i){if(isNaN(i))return;const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=s.date_range||{start_month:1,start_day:1,end_month:12,end_day:31};this.card.updateScheduleLocal(e,{date_range:{...a,[t]:i}})}_monthLabel(e){const t=`month.${e}`,i=qe(t);return i===t?String(e):i}_renderDevicePicker(e,t){const i=new Set(e.device_ids||[]),s=this.card._devices.filter(e=>e.type===t&&!i.has(e.id));return s.length?q`
      <div class="row" style="gap:8px;align-items:center">
        <select class="select mono" style="flex:1" id="add-device-${e.id}">
          ${s.map(e=>q`<option value="${e.id}">${e.alias} · ${e.entity_id}</option>`)}
        </select>
        <button class="btn btn--sm btn--primary"
          @click=${t=>{const i=t.target.closest(".row")?.querySelector("select");i?.value&&this._addDeviceToSchedule(e.id,i.value)}}>
          ${_e("plus",12)} ${qe("common.add")}
        </button>
      </div>
    `:q`<p class="text-xs text-mute" style="margin:0">${qe("editor.devices_no_more",{type:t})}</p>`}_addDeviceToSchedule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=i.device_ids||[];s.includes(t)||this.card.updateScheduleLocal(e,{device_ids:[...s,t]})}_removeDeviceFromSchedule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=(i.device_ids||[]).filter(e=>e!==t);this.card.updateScheduleLocal(e,{device_ids:s})}_setBlockAction(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.blocks];a[this._selectedBlockIdx]={...a[this._selectedBlockIdx],action:{id:t,value:i}},this.card.updateBlocksLocal(e,a)}_setBlockValue(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=[...i.blocks],a=s[this._selectedBlockIdx];s[this._selectedBlockIdx]={...a,action:{...a.action,value:t}},this.card.updateBlocksLocal(e,s)}_renderDeleteModal(e){return q`
      <div class="modal-overlay" @click=${()=>{this._confirmDelete=!1}}>
        <div class="card" style="width:min(440px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${qe("common.delete")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${e.name}</strong>
            <span class="text-xs text-mute" style="display:block;margin-top:4px">
              ${e.blocks.length} fasce · ${(e.device_ids||[]).length} dispositivi · ${(e.weather_rules||[]).length} regole meteo
            </span>
          </p>
          <p class="text-xs text-mute" style="margin:0 0 16px">
            ${"editor.delete.warn"!==qe("editor.delete.warn")?qe("editor.delete.warn"):"Operazione non reversibile. La schedulazione, i blocchi e le regole meteo associate verranno eliminati."}
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmDelete=!1}}>${qe("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              @click=${async()=>{this._confirmDelete=!1,await this.card.doRemoveSchedule(e.id)}}>
              ${_e("trash",12)} ${qe("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_removeBlock(e){const t=this.card._schedules.find(t=>t.id===e);if(!t||t.blocks.length<=1)return;const i=t.blocks.filter((e,t)=>t!==this._selectedBlockIdx);this._selectedBlockIdx=Math.max(0,this._selectedBlockIdx-1),this.card.updateBlocksLocal(e,i)}};ut.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],ut.prototype,"card",void 0),e([ve({type:Number})],ut.prototype,"nowHour",void 0),e([me()],ut.prototype,"_selectedBlockIdx",void 0),e([me()],ut.prototype,"_selectedRuleIdx",void 0),e([me()],ut.prototype,"_confirmDelete",void 0),e([me()],ut.prototype,"_entitySearch",void 0),ut=e([ue("chronos-editor")],ut);const ht=[{key:"skip",needsIf:!0,needsBlock:!0},{key:"shift",needsIf:!0,needsBlock:!0},{key:"extend",needsIf:!0,needsBlock:!0},{key:"shrink",needsIf:!0,needsBlock:!0},{key:"force_action",needsIf:!0,needsBlock:!0},{key:"replace_value",needsIf:!0,needsBlock:!0},{key:"scale_duration",needsIf:!1,needsBlock:!0},{key:"scale_value",needsIf:!1,needsBlock:!0}];let pt=class extends de{constructor(){super(...arguments),this.nowHour=0,this._hydratedFor="",this._blockIndex=null,this._effect="skip",this._sensorSearch="",this._clauses=[{variable:"temperature",op:">",value:"22"}],this._deltaMin=30,this._direction="forward",this._actionId="",this._actionValue=null,this._fireMode="once_per_daytime",this._scaleVar="temperature",this._scaleVarMin=25,this._scaleVarMax=35,this._scaleOutMin=30,this._scaleOutMax=120}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(e&&this._hydrateFromExisting(e),!e)return q`
      <div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">
        <div style="font-weight:600;color:var(--text);font-size:14px">${qe("overview.no_schedules")}</div>
        <div style="font-size:12.5px;margin-top:4px">${qe("overview.no_schedules.cta")}</div>
        <button class="btn btn--primary" style="margin-top:16px" @click=${()=>this.card.navigate("wizard")}>
          ${_e("plus",14)} ${qe("nav.new_schedule")}
        </button>
      </div>
    `;const t=He(e.device_type),i=this.card._weatherAttributes,s=ht.find(e=>e.key===this._effect);null!==this._blockIndex&&this._blockIndex>=0&&this._blockIndex<e.blocks.length&&e.blocks[this._blockIndex];const a=this._findConflicts(e);return q`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("weatherRulesList")}>
            ${_e("chevron-left",14)} ${qe("nav.weather_rules")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${this.card._editingRuleIdx>=0?qe("wr.heading.edit"):qe("wr.heading")}</h1>
          <p class="page-sub">${qe("wr.subtitle")}</p>
        </div>

        <div class="card">
          <div class="field">
            <label class="field__label">${qe("wr.schedule_picker.label")}</label>
            <select class="select mono" @change=${e=>{const t=e.target.value;this.card.selectSchedule(t),this._blockIndex=null}}>
              ${this.card._schedules.map(t=>q`
                <option value="${t.id}" ?selected=${t.id===e.id}>${t.name}</option>
              `)}
            </select>
            <span class="field__hint">${qe("wr.schedule_picker.hint")}</span>
          </div>
        </div>

        ${this._renderPreviewBanner(e)}

        ${a.length?q`
          <div class="card" style="background:#fef3c7;border-left:4px solid #f59e0b;color:#78350f">
            <div class="fw-600" style="margin-bottom:6px">${_e("info",12)} ${qe("wr.conflict.title")}</div>
            <div class="text-sm" style="line-height:1.5">${qe("wr.conflict.body")}</div>
            <ul style="margin:8px 0 0;padding-left:18px;font-size:12.5px;font-family:var(--font-mono)">
              ${a.map(e=>q`<li>${e}</li>`)}
            </ul>
          </div>
        `:G}

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${qe("wr.target.title")}</h3>
              <p class="card__sub">${qe("wr.target.subtitle")}</p>
            </div>
          </div>
          <div class="field">
            <label class="field__label">${qe("wr.target.label")}</label>
            <select class="select mono" @change=${e=>{const t=e.target.value;this._blockIndex=""===t?null:parseInt(t,10)}}>
              <option value="" ?selected=${null===this._blockIndex}>${qe("wr.target.all_blocks")}</option>
              ${e.blocks.map((e,t)=>q`
                <option value="${t}" ?selected=${this._blockIndex===t}>
                  #${t+1} · ${Ye(nt(e,"start"))} → ${Ye(nt(e,"end"))} · ${e.action?.id||"—"}
                </option>
              `)}
            </select>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${qe("wr.effect.title")}</h3>
              <p class="card__sub">${qe("wr.effect.subtitle")}</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px">
            ${ht.map(e=>q`
              <button class="tile-pick" data-selected="${this._effect===e.key}"
                @click=${()=>{this._effect=e.key,this._initEffectDefaults(t)}}>
                <div class="tile-pick__name">${qe("wr.effect."+e.key)}</div>
                <div class="tile-pick__desc">${qe("wr.effect."+e.key+".desc")}</div>
              </button>
            `)}
          </div>
        </div>

        ${s.needsIf?this._renderIfSection(i):this._renderScaleVarSection(i)}

        <div class="row" style="justify-content:flex-end;gap:8px">
          <button class="btn" @click=${()=>this.card.navigate("editor")}>${qe("common.cancel")}</button>
          <button class="btn btn--primary" @click=${()=>this._saveRule(e,t)}>
            ${_e("check",14)} ${qe("common.save")}
          </button>
        </div>
      </div>
    `}_renderPreviewBanner(e){const t=this._buildThenText(),i=null!==this._blockIndex?`${qe("wr.target.label")} #${this._blockIndex+1}`:qe("wr.target.all_blocks");return q`
      <div class="card" style="padding:14px 18px;background:var(--bg-sunken)">
        <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border);flex-wrap:wrap">
          <span class="rule-block__label rule-block__label--if">${i}</span>
          ${ht.find(e=>e.key===this._effect)?.needsIf?q`
            <span class="rule-token mono text-xs">if</span>
            ${this._clauses.map((e,t)=>q`
              ${t>0?q`<span class="rule-token mono text-xs" style="opacity:0.6">AND</span>`:G}
              <span class="rule-token rule-token--weather">${this._clauseLabel(e)}</span>
            `)}
          `:G}
          <span class="rule-block__label rule-block__label--then">${qe("wr.effect."+this._effect)}</span>
          <span class="rule-token rule-token--accent">${t}</span>
        </div>
      </div>
    `}_clauseLabel(e){const t=this.card._weatherAttributes.find(t=>t.key===e.variable),i=t?Ue(e.variable):this._sensorFriendlyName(e.variable),s=t?.unit||"";return`${i} ${e.op} ${e.value}${s}`}_sensorFriendlyName(e){const t=this.card._sensorEntities?.find(t=>t.entity_id===e);return t?.friendly_name||e}_numericSensors(){return(this.card._sensorEntities||[]).filter(e=>{if(e.unit_of_measurement)return!0;const t=parseFloat(e.state);return Number.isFinite(t)})}_renderIfSection(e){return q`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("wr.if.title")}</h3><p class="card__sub">${qe("wr.if.subtitle.and")}</p></div></div>
          <div class="col" style="gap:14px">
            ${this._clauses.map((t,i)=>this._renderClause(t,i,e))}
            <button class="btn btn--sm" style="align-self:flex-start"
              @click=${()=>{this._clauses=[...this._clauses,{variable:"temperature",op:">",value:"22"}]}}>
              ${_e("plus",12)} ${qe("wr.if.add_and")}
            </button>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `}_renderClause(e,t,i){const s=i.find(t=>t.key===e.variable),a=this._numericSensors(),n=!s&&/^[\w]+\./.test(e.variable);return q`
      <div class="card card--ghost" style="padding:12px 14px">
        <div class="sp-between" style="margin-bottom:10px">
          <span class="text-xs text-mute mono">${qe(0===t?"wr.if.first":"wr.if.and")}</span>
          ${this._clauses.length>1?q`
            <button class="btn btn--icon btn--ghost btn--sm" title="${qe("common.remove")}"
              @click=${()=>{this._clauses=this._clauses.filter((e,i)=>i!==t)}}>
              ${_e("close",12)}
            </button>
          `:G}
        </div>
        <div class="col" style="gap:10px">
          <div class="grid-2 wr-vars">
            ${i.map(i=>q`
              <button class="tile-pick" data-selected="${e.variable===i.key}"
                @click=${()=>this._setClauseVariable(t,i.key)} style="padding:10px">
                <div class="row" style="gap:8px">
                  <div class="tile-pick__icon" style="width:28px;height:28px">${_e(i.icon,14)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name" style="font-size:12.5px">${Ue(i.key,i.label)}</div>
                    <div class="tile-pick__desc mono" style="font-size:10.5px">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                  </div>
                </div>
              </button>
            `)}
          </div>
          ${this._renderSensorSelect(e,t,a,n)}
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${qe("wr.op")}</label>
              <select class="select mono" @change=${e=>this._patchClause(t,{op:e.target.value})}>
                ${"enum"===s?.type?q`
                      <option value="==" ?selected=${"=="===e.op}>uguale a (==)</option>
                      <option value="!=" ?selected=${"!="===e.op}>diverso da (!=)</option>`:q`
                      <option value=">" ?selected=${">"===e.op}>&gt;</option>
                      <option value=">=" ?selected=${">="===e.op}>&ge;</option>
                      <option value="<" ?selected=${"<"===e.op}>&lt;</option>
                      <option value="<=" ?selected=${"<="===e.op}>&le;</option>
                      <option value="==" ?selected=${"=="===e.op}>=</option>
                      <option value="!=" ?selected=${"!="===e.op}>≠</option>`}
              </select>
            </div>
            <div class="field">
              <label class="field__label">${qe("wr.threshold")}</label>
              ${"enum"===s?.type?q`<select class="select" @change=${e=>this._patchClause(t,{value:e.target.value})}>
                    ${(s.options||[]).map(t=>q`<option value="${t}" ?selected=${e.value===t}>${t}</option>`)}
                  </select>`:q`<input class="input mono" .value=${e.value}
                    @input=${e=>this._patchClause(t,{value:e.target.value})}/>`}
            </div>
          </div>
        </div>
      </div>
    `}_renderSensorSelect(e,t,i,s){const a=this._sensorSearch.trim().toLowerCase(),n=a?i.filter(t=>{if(t.entity_id===e.variable)return!0;return`${t.friendly_name||""} ${t.entity_id||""} ${t.unit_of_measurement||""}`.toLowerCase().includes(a)}):i;return q`
      <div class="field">
        <label class="field__label">${qe("wr.if.sensor.label")}</label>
        <div class="row" style="gap:6px;align-items:center">
          <input class="input" type="search" .value=${this._sensorSearch}
            placeholder="${qe("wr.if.sensor.search")}"
            @input=${e=>{this._sensorSearch=e.target.value}}
            style="flex:1"/>
          ${this._sensorSearch?q`
            <button class="btn btn--icon btn--ghost btn--sm" title="${qe("common.remove")}"
              @click=${()=>{this._sensorSearch=""}}>
              ${_e("close",12)}
            </button>
          `:G}
        </div>
        <select class="select mono" style="margin-top:6px"
          @change=${e=>{const i=e.target.value;i&&this._setClauseVariable(t,i)}}>
          <option value="" ?selected=${!s}>${qe("wr.if.sensor.none")}</option>
          ${n.map(t=>q`
            <option value="${t.entity_id}" ?selected=${e.variable===t.entity_id}>
              ${t.friendly_name||t.entity_id}${t.unit_of_measurement?` (${t.unit_of_measurement})`:""} — ${t.entity_id}
            </option>
          `)}
          ${a&&!n.length?q`<option disabled>${qe("wr.if.sensor.no_match")}</option>`:G}
        </select>
        <span class="field__hint">${qe("wr.if.sensor.hint")}</span>
      </div>
    `}_setClauseVariable(e,t){this._patchClause(e,{variable:t});const i=this.card._weatherAttributes.find(e=>e.key===t);if("enum"===i?.type){const t=this._clauses[e];"=="!==t.op&&"!="!==t.op&&this._patchClause(e,{op:"=="})}}_patchClause(e,t){this._clauses=this._clauses.map((i,s)=>s===e?{...i,...t}:i)}_renderScaleVarSection(e){const t=e.find(e=>e.key===this._scaleVar);return q`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("wr.scale.input.title")}</h3><p class="card__sub">${qe("wr.scale.input.subtitle")}</p></div></div>
          <div class="col" style="gap:12px">
            <div class="field">
              <label class="field__label">${qe("wr.scale.var")}</label>
              <select class="select mono" @change=${e=>{this._scaleVar=e.target.value}}>
                ${e.filter(e=>"number"===e.type).map(e=>q`
                  <option value="${e.key}" ?selected=${this._scaleVar===e.key}>${Ue(e.key,e.label)}${e.unit?` (${e.unit})`:""}</option>
                `)}
              </select>
            </div>
            <div class="grid-2">
              <div class="field">
                <label class="field__label">${qe("wr.scale.var_min")} ${t?.unit?q`<span class="text-mute">(${t.unit})</span>`:G}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMin)}
                  @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleVarMin=t)}}/>
              </div>
              <div class="field">
                <label class="field__label">${qe("wr.scale.var_max")} ${t?.unit?q`<span class="text-mute">(${t.unit})</span>`:G}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMax)}
                  @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleVarMax=t)}}/>
              </div>
            </div>
            <span class="field__hint">${qe("wr.scale.input.hint")}</span>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `}_renderEffectCard(){return q`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("wr.effect_params.title")}</h3><p class="card__sub">${qe("wr.effect."+this._effect+".desc")}</p></div></div>
        ${this._renderEffectParams(He(this.card._schedules.find(e=>e.id===this.card._selectedId)?.device_type||"thermostat"))}
      </div>
    `}_renderEffectParams(e){const t=this._effect;if("skip"===t)return q`<p class="text-sm text-mute" style="margin:0">${qe("wr.effect.skip.desc")}</p>`;if("shift"===t)return q`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${qe("wr.delta")} (${qe("common.min")})</label>
            <input type="number" class="input mono" step="5" .value=${String(this._deltaMin)}
              @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._deltaMin=t)}}
              placeholder="es. 30 / -30"/>
          </div>
          ${this._renderFireMode()}
        </div>
      `;if("extend"===t||"shrink"===t)return q`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${qe("wr.delta")} (${qe("common.min")})</label>
            <input type="number" class="input mono" step="5" min="1" .value=${String(this._deltaMin)}
              @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._deltaMin=t)}}/>
          </div>
          ${this._renderDirection()}
          ${this._renderFireMode()}
        </div>
      `;if("force_action"===t){const t=e.find(e=>e.id===this._actionId);return q`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${qe("wr.action.force")}</label>
            <select class="select" @change=${t=>this._setForceAction(t.target.value,e)}>
              <option value="" ?selected=${!this._actionId}>—</option>
              ${e.map(e=>q`<option value="${e.id}" ?selected=${this._actionId===e.id}>${e.label}</option>`)}
            </select>
          </div>
          ${t?.value?this._renderValueField(t,this._actionValue,e=>{this._actionValue=e}):G}
          ${this._renderFireMode()}
        </div>
      `}if("replace_value"===t){const t=this.card._schedules.find(e=>e.id===this.card._selectedId),i=t&&null!==this._blockIndex?t.blocks[this._blockIndex]:null;if(!i)return q`<p class="text-sm text-mute" style="margin:0">${qe("wr.replace_value.pick_block")}</p>`;const s=e.find(e=>e.id===i.action?.id);return s?.value?q`
        <div class="col" style="gap:10px">
          ${this._renderValueField(s,this._actionValue,e=>{this._actionValue=e})}
          ${this._renderFireMode()}
        </div>
      `:q`<p class="text-sm text-mute" style="margin:0">${qe("wr.replace_value.no_value")}</p>`}if("scale_duration"===t)return q`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${qe("wr.scale.out_min")} (${qe("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMin)}
                @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._scaleOutMin=t)}}/>
            </div>
            <div class="field">
              <label class="field__label">${qe("wr.scale.out_max")} (${qe("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMax)}
                @input=${e=>{const t=parseInt(e.target.value,10);isNaN(t)||(this._scaleOutMax=t)}}/>
            </div>
          </div>
          ${this._renderDirection()}
        </div>
      `;if("scale_value"===t){const t=this.card._schedules.find(e=>e.id===this.card._selectedId),i=t&&null!==this._blockIndex?t.blocks[this._blockIndex]:null,s=i?e.find(e=>e.id===i.action?.id):null,a=s?.value?.unit||"";return q`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${qe("wr.scale.out_min")} ${a?q`<span class="text-mute">(${a})</span>`:G}</label>
              <input type="number" class="input mono" step="${s?.value?.step||1}" .value=${String(this._scaleOutMin)}
                @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleOutMin=t)}}/>
            </div>
            <div class="field">
              <label class="field__label">${qe("wr.scale.out_max")} ${a?q`<span class="text-mute">(${a})</span>`:G}</label>
              <input type="number" class="input mono" step="${s?.value?.step||1}" .value=${String(this._scaleOutMax)}
                @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||(this._scaleOutMax=t)}}/>
            </div>
          </div>
        </div>
      `}return G}_renderDirection(){return q`
      <div class="field">
        <label class="field__label">${qe("wr.direction.label")}</label>
        <div class="segmented">
          <button data-active="${"forward"===this._direction}" @click=${()=>{this._direction="forward"}}>${qe("wr.direction.forward")}</button>
          <button data-active="${"backward"===this._direction}" @click=${()=>{this._direction="backward"}}>${qe("wr.direction.backward")}</button>
        </div>
        <span class="field__hint">${qe("wr.direction.hint")}</span>
      </div>
    `}_renderFireMode(){return q`
      <div class="field">
        <label class="field__label">${qe("wr.fire_mode.label")}</label>
        <select class="select" @change=${e=>{this._fireMode=e.target.value}}>
          <option value="every" ?selected=${"every"===this._fireMode}>${qe("wr.fire_mode.every")}</option>
          <option value="once_per_day" ?selected=${"once_per_day"===this._fireMode}>${qe("wr.fire_mode.once_per_day")}</option>
          <option value="once_per_daytime" ?selected=${"once_per_daytime"===this._fireMode}>${qe("wr.fire_mode.once_per_daytime")}</option>
          <option value="once_per_nighttime" ?selected=${"once_per_nighttime"===this._fireMode}>${qe("wr.fire_mode.once_per_nighttime")}</option>
        </select>
      </div>
    `}_renderValueField(e,t,i){const s=e.value,a=t??s.default;return q`
      <div class="field">
        <label class="field__label">${s.label||qe("common.value")} ${s.unit?q`<span class="text-mute">(${s.unit})</span>`:G}</label>
        ${"number"===s.type?q`
          <div class="row" style="gap:10px;align-items:center">
            <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" .value=${String(a)}
              @input=${e=>i(parseFloat(e.target.value))}
              style="flex:1"/>
            <input type="number" class="input mono" min="${s.min}" max="${s.max}" step="${s.step}" .value=${String(a)}
              @input=${e=>{const t=parseFloat(e.target.value);isNaN(t)||i(t)}}
              style="width:90px;text-align:right;font-weight:600"/>
            <span class="mono text-mute" style="min-width:30px">${s.unit||""}</span>
          </div>
        `:"enum"===s.type?q`
          <select class="select" @change=${e=>i(e.target.value)}>
            ${(s.options||[]).map(e=>q`<option value="${e}" ?selected=${String(a)===e}>${e}</option>`)}
          </select>
        `:G}
      </div>
    `}_setForceAction(e,t){this._actionId=e;const i=t.find(t=>t.id===e);this._actionValue=i?.value?i.value.default??null:null}_initEffectDefaults(e){"force_action"===this._effect&&!this._actionId&&e.length&&this._setForceAction(e[0].id,e)}_findConflicts(e){if(null===this._blockIndex)return[];const t=this._blockIndex,i=[];for(const s of e.weather_rules||[])s.active&&(s.block_index!==t&&null!==s.block_index&&void 0!==s.block_index||(s.effect===this._effect||s.effect&&(s.effect.startsWith("scale_")||s.effect.startsWith("duration")||["extend","shrink"].includes(s.effect))&&(this._effect.startsWith("scale_")||["extend","shrink"].includes(this._effect)))&&i.push(`${s.if||"(no condition)"} → ${qe("wr.effect."+(s.effect||"skip"))}`));return i}_buildThenText(){const e=this._effect;return"skip"===e?qe("wr.action.skip"):"shift"===e?`${this._deltaMin>0?"+":""}${this._deltaMin} ${qe("common.min")}`:"extend"===e?`+${this._deltaMin} ${qe("common.min")} ${qe("wr.direction."+this._direction).toLowerCase()}`:"shrink"===e?`-${this._deltaMin} ${qe("common.min")} ${qe("wr.direction."+this._direction).toLowerCase()}`:"force_action"===e?`${qe("wr.action.force")}: ${this._actionId}${null!==this._actionValue?` = ${this._actionValue}`:""}`:"replace_value"===e?`${qe("wr.effect.replace_value")} = ${this._actionValue}`:"scale_duration"===e?`${this._scaleOutMin}-${this._scaleOutMax} ${qe("common.min")} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`:"scale_value"===e?`${this._scaleOutMin}-${this._scaleOutMax} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`:""}async _saveRule(e,t){const i=this._buildIfText(),s=this._buildThenText(),a=this.card._editingRuleIdx,n={active:!(a>=0)||(e.weather_rules?.[a]?.active??!0),if:i,then:s,effect:this._effect,block_index:this._blockIndex};let r;"shift"!==this._effect&&"extend"!==this._effect&&"shrink"!==this._effect||(n.delta_minutes=Math.abs(this._deltaMin),n.direction=this._direction),"force_action"===this._effect&&(n.action_id=this._actionId,null!==this._actionValue&&(n.action_value=this._actionValue),n.fire_mode=this._fireMode),"replace_value"===this._effect&&(null!==this._actionValue&&(n.action_value=this._actionValue),n.fire_mode=this._fireMode),"scale_duration"!==this._effect&&"scale_value"!==this._effect||(n.scale_var=this._scaleVar,n.scale_var_min=this._scaleVarMin,n.scale_var_max=this._scaleVarMax,n.scale_out_min=this._scaleOutMin,n.scale_out_max=this._scaleOutMax,"scale_duration"===this._effect&&(n.direction=this._direction)),a>=0?(r=[...e.weather_rules||[]],r[a]=n):r=[...e.weather_rules||[],n],this.card.updateScheduleLocal(e.id,{weather_rules:r}),this.card.navigate("editor")}_hydrateFromExisting(e){const t=this.card._editingRuleIdx,i=`${e.id}::${t}`;if(this._hydratedFor===i)return;if(this._hydratedFor=i,t<0)return this._blockIndex=null,this._effect="skip",this._clauses=[{variable:"temperature",op:">",value:"22"}],this._deltaMin=30,this._direction="forward",this._actionId="",this._actionValue=null,this._fireMode="once_per_daytime",this._scaleVar="temperature",this._scaleVarMin=25,this._scaleVarMax=35,this._scaleOutMin=30,void(this._scaleOutMax=120);const s=e.weather_rules?.[t];if(s){if(this._effect=s.effect||"skip",this._blockIndex=void 0===s.block_index?null:s.block_index,s.if){const e=this._parseIfExpression(String(s.if));e.length&&(this._clauses=e)}void 0!==s.delta_minutes&&(this._deltaMin=s.delta_minutes),s.direction&&(this._direction=s.direction),s.action_id&&(this._actionId=s.action_id),this._actionValue=void 0!==s.action_value?s.action_value:null,s.fire_mode&&(this._fireMode=s.fire_mode),s.scale_var&&(this._scaleVar=s.scale_var),void 0!==s.scale_var_min&&(this._scaleVarMin=s.scale_var_min),void 0!==s.scale_var_max&&(this._scaleVarMax=s.scale_var_max),void 0!==s.scale_out_min&&(this._scaleOutMin=s.scale_out_min),void 0!==s.scale_out_max&&(this._scaleOutMax=s.scale_out_max)}}_parseIfExpression(e){const t=[],i=e.split(/\s+AND\s+/i);for(const e of i){const i=e.trim().match(/^([\w.]+)\s*(>=|<=|!=|==|>|<)\s*(.*?)$/);if(!i)continue;const s=i[3].replace(/[^0-9.\-+a-zA-Z_]/g,"");t.push({variable:i[1],op:i[2],value:s})}return t}_buildIfText(){return ht.find(e=>e.key===this._effect)?.needsIf?this._clauses.filter(e=>e.variable&&e.op&&""!==e.value).map(e=>{const t=this.card._weatherAttributes.find(t=>t.key===e.variable),i=t?.unit||"";return`${e.variable} ${e.op} ${e.value}${i}`}).join(" AND "):""}};pt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],pt.prototype,"card",void 0),e([ve({type:Number})],pt.prototype,"nowHour",void 0),e([me()],pt.prototype,"_blockIndex",void 0),e([me()],pt.prototype,"_effect",void 0),e([me()],pt.prototype,"_sensorSearch",void 0),e([me()],pt.prototype,"_clauses",void 0),e([me()],pt.prototype,"_deltaMin",void 0),e([me()],pt.prototype,"_direction",void 0),e([me()],pt.prototype,"_actionId",void 0),e([me()],pt.prototype,"_actionValue",void 0),e([me()],pt.prototype,"_fireMode",void 0),e([me()],pt.prototype,"_scaleVar",void 0),e([me()],pt.prototype,"_scaleVarMin",void 0),e([me()],pt.prototype,"_scaleVarMax",void 0),e([me()],pt.prototype,"_scaleOutMin",void 0),e([me()],pt.prototype,"_scaleOutMax",void 0),pt=e([ue("chronos-weather-rule")],pt);let vt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._schedules,t=[];e.forEach(e=>{(e.weather_rules||[]).forEach((i,s)=>{t.push({schedId:e.id,schedName:e.name,idx:s,ifText:i.if||"—",thenText:i.then,active:i.active})})});const i=t.filter(e=>e.active).length;return q`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${qe("nav.weather_rules")}</h1>
            <p class="page-sub">${t.length} · ${i} ${qe("schedule.active").toLowerCase()}</p>
          </div>
          <button class="btn btn--primary" @click=${()=>this.card.navigate("weatherRule")}>
            ${_e("plus",14)} ${qe("editor.weather_rules.add")}
          </button>
        </div>

        ${t.length?q`
          <div class="card">
            <div class="col" style="gap:0">
              ${t.map(e=>q`
                <div class="rule-block" style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:14px 12px;cursor:pointer"
                  @click=${()=>this.card.selectSchedule(e.schedId,"editor")}>
                  <span class="chip chip--accent" style="flex:0 0 auto;max-width:180px" title="${e.schedName}">
                    <span class="truncate" style="max-width:160px;display:inline-block;vertical-align:middle">${e.schedName}</span>
                  </span>
                  <span class="rule-block__label rule-block__label--if">IF</span>
                  <span class="rule-token rule-token--weather">${e.ifText}</span>
                  <span class="rule-block__label rule-block__label--then">THEN</span>
                  <span class="rule-token rule-token--accent">${e.thenText}</span>
                  <div style="flex:1"></div>
                  <label class="switch" @click=${e=>e.stopPropagation()}>
                    <input type="checkbox" .checked=${e.active} @change=${t=>this._toggleRule(e.schedId,e.idx,t.target.checked)}/>
                    <span class="switch__track"></span>
                    <span class="switch__thumb"></span>
                  </label>
                  <button class="btn btn--sm" @click=${t=>{t.stopPropagation(),this.card.editWeatherRule(e.schedId,e.idx)}}
                    title="${qe("common.edit")}">
                    ${_e("edit",12)} ${qe("common.edit")}
                  </button>
                  <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                    @click=${t=>{t.stopPropagation(),this._deleteRule(e.schedId,e.idx)}}
                    title="${qe("common.remove")}">
                    ${_e("trash",12)}
                  </button>
                </div>
              `)}
            </div>
          </div>
        `:q`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("cloud",22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${qe("editor.weather_rules.empty")}</div>
          </div>
        `}
      </div>
    `}async _toggleRule(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.weather_rules||[]];a[t]={...a[t],active:i},this.card.updateScheduleLocal(e,{weather_rules:a}),this.card._selectedId=e,await this.card.saveCurrentSchedule()}async _deleteRule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=i.weather_rules?.[t];if(!s)return;if(!confirm(`${qe("common.remove")}: ${s.if} → ${s.then}?`))return;const a=(i.weather_rules||[]).filter((e,i)=>i!==t);this.card.updateScheduleLocal(e,{weather_rules:a}),this.card._selectedId=e,await this.card.saveCurrentSchedule()}};vt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],vt.prototype,"card",void 0),e([ve({type:Number})],vt.prototype,"nowHour",void 0),vt=e([ue("chronos-weather-rules-list")],vt);let mt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._devices.find(e=>e.id===this.card._deviceDetailId)||this.card._devices[0];if(!e)return q`<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-weight:600;font-size:14px">${qe("device.no_device.title")}</div>
      <div style="font-size:12.5px;margin-top:4px">${qe("device.no_device.hint")}</div>
    </div>`;const t=ot[e.type]||{label:e.type,domain:"",capabilities:[]},i=this.card._schedules.filter(t=>t.device_ids.includes(e.id)),s=this.card.hass?.states?.[e.entity_id],a=s?.state||"—";return q`
      <div class="col" style="gap:18px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${_e("chevron-left",14)} ${qe("common.back")}
          </button>
        </div>

        <div class="row" style="gap:16px">
          <div style="width:60px;height:60px;border-radius:16px;background:${Ee(e,s,this.card._settings).soft};color:${Ee(e,s,this.card._settings).accent};display:grid;place-items:center">
            ${xe(e.type,28)}
          </div>
          <div style="flex:1">
            <h1 class="page-title" style="margin-bottom:2px">${e.alias}</h1>
            <p class="page-sub mono" style="margin-bottom:0">${e.entity_id} · ${e.area}</p>
          </div>
          <select class="select" style="width:240px"
            @change=${e=>this.card.selectDevice(e.target.value)}>
            ${this.card._devices.map(t=>q`<option value="${t.id}" ?selected=${t.id===e.id}>${t.alias}</option>`)}
          </select>
        </div>

        <div class="grid-3">
          <div class="kpi"><div class="kpi__label">${qe("device.state")}</div><div class="kpi__value">${a}</div><div class="kpi__delta">${qe("device.state.live")}</div></div>
          <div class="kpi"><div class="kpi__label">${qe("device.type")}</div><div class="kpi__value" style="font-size:20px">${t.label}</div><div class="kpi__delta mono">${t.domain}</div></div>
          <div class="kpi"><div class="kpi__label">${qe("device.linked_schedules")}</div><div class="kpi__value">${i.length}</div><div class="kpi__delta">${qe("device.linked_schedules.active",{n:i.filter(e=>e.enabled).length})}</div></div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("device.capabilities")}</h3><p class="card__sub">${qe("device.capabilities.subtitle")}</p></div></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${(t.capabilities||[]).map(e=>q`<span class="rule-token mono">${t.domain}.${e}</span>`)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("device.schedules_using.title")}</h3><p class="card__sub">${qe("device.schedules_using.subtitle",{n:i.length})}</p></div></div>
          ${i.length?q`<div class="col" style="gap:10px">
                ${i.map(e=>q`
                  <div class="card card--ghost" style="padding:14px">
                    <div class="sp-between" style="margin-bottom:8px">
                      <div>
                        <div class="fw-600">${e.name}</div>
                        <div class="text-xs text-mute mono">${lt(e.days)}</div>
                      </div>
                      <button class="btn btn--sm" @click=${()=>this.card.selectSchedule(e.id,"editor")}>${qe("device.open_schedule")} ${_e("chevron-right",12)}</button>
                    </div>
                    <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${e.enabled?this.nowHour:null}></chronos-timeline>
                  </div>
                `)}
              </div>`:q`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                <div style="font-weight:600;color:var(--text);font-size:14px">${qe("device.no_schedules")}</div>
                <div style="font-size:12.5px;margin-top:4px">${qe("device.no_schedules.hint")}</div>
              </div>`}
        </div>
      </div>
    `}};mt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],mt.prototype,"card",void 0),e([ve({type:Number})],mt.prototype,"nowHour",void 0),mt=e([ue("chronos-device-screen")],mt);let ft=class extends de{constructor(){super(...arguments),this.nowHour=0,this._filter=null}render(){const{_schedules:e}=this.card,t=e.filter(e=>e.enabled),i=t.length,s=this._filter,a=s?t.filter(e=>s.has(e.id)):t,n=(new Date).getDay(),r=0===n?6:n-1,o=rt();return q`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${qe("screen.week.title")}</h1>
          <p class="page-sub">${qe("week.subtitle",{n:i})}</p>
        </div>

        ${t.length?q`
          <div class="card" style="padding:14px">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div class="fw-600 text-sm">${"Filtra"===qe("common.search")?"Filtra":"Filtra schedulazioni"}</div>
              <div class="row" style="gap:6px">
                <button class="btn btn--sm" @click=${()=>{this._filter=null}}>
                  ${qe("editor.days.all")}
                </button>
                <button class="btn btn--sm" @click=${()=>{this._filter=new Set}}>
                  ${qe("common.none")}
                </button>
              </div>
            </div>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              ${t.map(e=>{const t=!s||s.has(e.id);return q`
                  <button class="chip"
                    style="cursor:pointer;background:${t?"var(--accent-soft)":"var(--bg-sunken)"};color:${t?"var(--accent-ink)":"var(--text-muted)"};border:1px solid ${t?"transparent":"var(--border-soft)"}"
                    @click=${()=>this._toggleFilter(e.id)}>
                    ${t?_e("check",11):G} ${e.name}
                  </button>
                `})}
            </div>
          </div>
        `:G}

        <div class="card">
          <div class="weekgrid">
            <div class="weekgrid__row" style="margin-bottom:6px">
              <div></div>
              <div style="position:relative;height:18px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
                ${[0,4,8,12,16,20,24].map(e=>q`
                  <span style="position:absolute;left:${e/24*100}%;transform:translateX(-50%)">${String(e).padStart(2,"0")}</span>
                `)}
              </div>
            </div>
            ${o.map((e,t)=>{const i=a.filter(e=>e.days[t]);return q`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${t===r?"var(--accent)":""}">
                  ${e}${t===r?q`<span style="display:block;font-size:9px;margin-top:2px">${qe("week.today").toUpperCase()}</span>`:G}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${i.map(e=>q`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500;cursor:pointer" class="truncate"
                          @click=${()=>this.card.selectSchedule(e.id,"editor")}>${e.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="mini" .showWeather=${!1}
                            .now=${t===r?this.nowHour:null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${i.length?G:q`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">—</div>`}
                  </div>
                </div>
              </div>
            `})}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(Ie).map(([e,t])=>{const i={on:qe("schedule.active"),off:qe("schedule.disabled"),set:qe("common.value"),preset:"Preset",cmd:qe("editor.block.action")};return q`
              <div class="row" style="gap:6px">
                <span style="width:12px;height:8px;border-radius:2px;background:${t}"></span>
                <span class="text-xs">${i[e]}</span>
              </div>
            `})}
        </div>
      </div>
    `}_toggleFilter(e){const t=this._filter??new Set(this.card._schedules.filter(e=>e.enabled).map(e=>e.id)),i=new Set(t);i.has(e)?i.delete(e):i.add(e);const s=this.card._schedules.filter(e=>e.enabled);this._filter=i.size===s.length?null:i}};ft.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],ft.prototype,"card",void 0),e([ve({type:Number})],ft.prototype,"nowHour",void 0),e([me()],ft.prototype,"_filter",void 0),ft=e([ue("chronos-week")],ft);let gt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t,_forecast:i,_settings:s}=this.card,a=s?.weather_entity||"",n=a?this.card.hass?.states?.[a]:null,r=n?.attributes?.temperature??"—",o=n?.state||"cloud",l=n?.attributes?.humidity??"—",d=n?.attributes?.wind_speed??"—",c=e.filter(e=>e.enabled).map(e=>{const t=e.blocks.find(e=>this.nowHour>=e.start&&this.nowHour<e.end);return{schedule:e,active:t}});return q`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${qe("screen.live.title")}</h1>
            <p class="page-sub">${a?qe("live.weather.subtitle",{entity:a}):qe("live.no_weather")}</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>${qe("schedule.active")}</span>
          </div>
        </div>

        <!-- Weather hero -->
        <div class="grid-2">
          <div class="weather-hero">
            <div class="weather-hero__icon">${$e(o,32)}</div>
            <div>
              <div class="weather-hero__temp">${r}°<span style="font-size:16px;color:var(--text-muted)">C</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(o)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${_e("droplet",11)} ${l}%</span>
              <span class="chip">${_e("wind",11)} ${d} km/h</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("live.forecast.title")}</h3><p class="card__sub">${qe("live.forecast.title")}</p></div></div>
            <div class="forecast-row">
              ${i.filter((e,t)=>t%2==0).slice(0,12).map(e=>{const t=new Date(e.datetime||"").getHours?.()??0,i=e.condition||"cloud";return q`
                  <div class="forecast-cell">
                    <div class="forecast-cell__hour">${String(t).padStart(2,"0")}</div>
                    <div class="forecast-cell__icon">${$e(i,20)}</div>
                    <div class="forecast-cell__temp">${e.temperature??"—"}°</div>
                  </div>
                `})}
            </div>
          </div>
        </div>

        <!-- Live schedules -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("live.schedules.title")}</h3><p class="card__sub">${c.filter(e=>e.active).length}</p></div></div>
          <div class="col" style="gap:12px">
            ${c.map(({schedule:e,active:t})=>q`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${t?"var(--ok)":"var(--text-muted)"};box-shadow:${t?"0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)":"none"}"></span>
                    <strong>${e.name}</strong>
                    ${t?q`<span class="chip chip--accent">${Le(e.device_type,t.action)}</span>`:q`<span class="chip">${qe("schedule.next_block")}</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                    ${qe("device.open_schedule")} ${_e("chevron-right",12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${this.nowHour}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("live.devices.title")}</h3><p class="card__sub">${qe("live.devices.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${t.map(e=>{const t=this.card.hass?.states?.[e.entity_id],i=Ee(e,t,this.card._settings),s=this._computeBarPercent(e,t);return q`
                <div class="live-device">
                  <div class="device-row__icon" style="width:36px;height:36px;background:${i.soft};color:${i.accent}">${xe(e.type,17)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.alias}</div>
                    <div class="device-row__meta">${e.area}</div>
                  </div>
                  <div class="live-device__bar"><div style="width:${s}%;background:${i.accent}"></div></div>
                  <span class="mono text-sm" style="width:64px;text-align:right;color:${i.live?i.accent:"var(--text-muted)"};font-weight:600">${this._formatState(e,t)}</span>
                </div>
              `})}
          </div>
        </div>
      </div>
    `}_computeBarPercent(e,t){if(!t)return 0;const i=t.attributes||{};if("light"===e.type){const e=i.brightness;return"number"==typeof e?Math.round(e/255*100):"on"===t.state?100:0}if("fan"===e.type)return"number"==typeof i.percentage?i.percentage:0;if("blind"===e.type)return"number"==typeof i.current_position?i.current_position:0;if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return Math.min(100,Math.max(0,(e-5)/30*100))}return"on"===t.state||"open"===t.state?100:0}_formatState(e,t){if(!t)return"—";const i=t.attributes||{};if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return`${e.toFixed(1)}°`}return"fan"===e.type&&"number"==typeof i.percentage?`${i.percentage}%`:"blind"===e.type&&"number"==typeof i.current_position?`${i.current_position}%`:"light"===e.type&&"on"===t.state&&"number"==typeof i.brightness?`${Math.round(i.brightness/255*100)}%`:t.state}_conditionLabel(e){const t=`live.condition.${e}`,i=qe(t);return i===t?e:i}};gt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],gt.prototype,"card",void 0),e([ve({type:Number})],gt.prototype,"nowHour",void 0),gt=e([ue("chronos-live")],gt);let _t=class extends de{constructor(){super(...arguments),this.nowHour=0,this._step=0,this._name="",this._pickedDevices=[],this._specialMode="",this._days=[1,1,1,1,1,1,1],this._weatherEnabled=!0,this._blocks=[],this._blocksDeviceType="",this._selectedBlockIdx=-1,this._variant="linear"}get _steps(){return[{key:"name",label:qe("wizard.step.name")},{key:"device",label:qe("wizard.step.devices")},{key:"time",label:qe("wizard.step.time")},{key:"days",label:qe("wizard.step.days")},{key:"weather",label:qe("wizard.step.weather")},{key:"review",label:qe("wizard.step.review")}]}render(){return q`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${_e("chevron-left",14)} ${qe("common.cancel")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${qe("wizard.title")}</h1>
          <p class="page-sub">${qe("wizard.subtitle")}</p>
        </div>

        <div class="wizard-stepper">
          ${this._steps.map((e,t)=>q`
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
            ${_e("chevron-left",14)} ${qe("common.back")}
          </button>
          ${this._step<this._steps.length-1?q`<button class="btn btn--primary" @click=${()=>{this._step++}}>
                ${qe("common.next")} ${_e("chevron-right",14)}
              </button>`:q`<button class="btn btn--primary" @click=${()=>this._finish()}>
                ${_e("check",14)} ${qe("wizard.create")}
              </button>`}
        </div>
      </div>
    `}_renderStepContent(){switch(this._step){case 0:return q`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${qe("wizard.name.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${qe("wizard.name.hint")}</p>
            <input class="input" .value=${this._name} @input=${e=>{this._name=e.target.value}}
              placeholder="${qe("nav.new_schedule")}"
              style="font-size:18px;padding:12px 14px"/>
          </div>
        `;case 1:{const e=this.card._devices.filter(e=>"scene"!==e.type&&"automation"!==e.type);return q`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${qe("wizard.devices.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${qe("wizard.devices.hint")}</p>
            <div class="grid-auto" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px">
              <button class="tile-pick" data-selected="${"scene"===this._specialMode}"
                @click=${()=>this._toggleSpecialMode("scene")}>
                <div class="row" style="gap:10px">
                  <div class="tile-pick__icon">${_e("sun",16)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name truncate">${qe("wizard.devices.scene_tile")}</div>
                    <div class="tile-pick__desc">${qe("wizard.devices.scene_tile.desc")}</div>
                  </div>
                  ${"scene"===this._specialMode?_e("check",16):G}
                </div>
              </button>
              <button class="tile-pick" data-selected="${"automation"===this._specialMode}"
                @click=${()=>this._toggleSpecialMode("automation")}>
                <div class="row" style="gap:10px">
                  <div class="tile-pick__icon">${_e("wand",16)}</div>
                  <div style="min-width:0;flex:1">
                    <div class="tile-pick__name truncate">${qe("wizard.devices.automation_tile")}</div>
                    <div class="tile-pick__desc">${qe("wizard.devices.automation_tile.desc")}</div>
                  </div>
                  ${"automation"===this._specialMode?_e("check",16):G}
                </div>
              </button>
              ${this._specialMode?G:e.map(e=>q`
                <button class="tile-pick" data-selected="${this._pickedDevices.includes(e.id)}"
                  @click=${()=>this._togglePick(e.id)}>
                  <div class="row" style="gap:10px">
                    <div class="tile-pick__icon">${xe(e.type,16)}</div>
                    <div style="min-width:0;flex:1">
                      <div class="tile-pick__name truncate">${e.alias}</div>
                      <div class="tile-pick__desc">${e.area} · ${ot[e.type]?.label||e.type}</div>
                    </div>
                    ${this._pickedDevices.includes(e.id)?_e("check",16):G}
                  </div>
                </button>
              `)}
            </div>
          </div>
        `}case 2:{const e=this._inferDeviceType();this._ensureBlocksFor(e);const t=this._selectedBlockIdx>=0?this._blocks[this._selectedBlockIdx]:void 0,i=t?.action?Oe(e,t.action.id):void 0,s=He(e);return q`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${qe("wizard.time.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${qe("editor.add_block_hint")}</p>

            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
              <span class="text-xs text-mute">${qe("editor.timeline_variant")}:</span>
              <div class="segmented">
                ${["linear","radial","list"].map(e=>q`
                  <button data-active="${this._variant===e}" @click=${()=>{this._variant=e}}>
                    ${qe("timeline."+e)}
                  </button>
                `)}
              </div>
              <div style="flex:1"></div>
              <button class="btn btn--sm" @click=${()=>this._addBlock(e)}>
                ${_e("plus",12)} ${qe("common.add")}
              </button>
              <button class="btn btn--sm" @click=${()=>this._resetBlocks(e)}>
                ${_e("repeat",12)} ${qe("wizard.time.reset_preset")}
              </button>
            </div>

            <chronos-timeline
              variant="${this._variant}"
              .deviceType=${e}
              .interactive=${!0}
              .blocks=${this._blocks}
              .selectedIdx=${this._selectedBlockIdx}
              @blocks-changed=${e=>{this._blocks=e.detail.blocks}}
              @block-select=${e=>{this._selectedBlockIdx=e.detail.index}}
            ></chronos-timeline>

            ${t?q`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div>
                    <div class="text-xs text-mute mono">${qe("wizard.time.selected")}</div>
                    <div class="fw-600 mono">${this._fmtBlockRange(t)}</div>
                  </div>
                  <button class="btn btn--sm" style="color:var(--danger)" @click=${()=>this._removeSelected()}>
                    ${_e("trash",12)} ${qe("editor.block.delete")}
                  </button>
                </div>
                <div class="field">
                  <label class="field__label">${qe("editor.block.action")}</label>
                  <div class="row" style="gap:6px;flex-wrap:wrap">
                    ${s.map(i=>q`
                      <button class="chip" data-active="${t.action?.id===i.id}"
                        style="background:${t.action?.id===i.id?Pe(e,{id:i.id}):"var(--bg-sunken)"};color:${t.action?.id===i.id?"white":"var(--text-soft)"};border:1px solid ${t.action?.id===i.id?"transparent":"var(--border-soft)"};cursor:pointer"
                        @click=${()=>this._setAction(i.id)}>${i.label}</button>
                    `)}
                  </div>
                </div>
                ${i?.value?q`
                  <div class="field" style="margin-top:10px">
                    <label class="field__label">${i.value.label||qe("common.value")} ${i.value.unit?q`<span class="text-mute">(${i.value.unit})</span>`:G}</label>
                    ${"number"===i.value.type?q`
                      <div class="row" style="gap:10px;align-items:center">
                        <input type="range" min="${i.value.min}" max="${i.value.max}" step="${i.value.step}"
                          .value=${String(t.action?.value??i.value.default)}
                          @input=${e=>this._setActionValue(parseFloat(e.target.value))}
                          style="flex:1"/>
                        <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${t.action?.value??i.value.default}${i.value.unit||""}</span>
                      </div>
                    `:"enum"===i.value.type?q`
                      <select class="input" @change=${e=>this._setActionValue(e.target.value)}>
                        ${(i.value.options||[]).map(e=>{const s=String(t.action?.value??i.value.default);return q`<option value="${e}" ?selected=${s===e}>${e}</option>`})}
                      </select>
                    `:G}
                  </div>
                `:G}
              </div>
            `:q`
              <p class="text-xs text-mute" style="margin:0">${qe("editor.block.no_selection")}</p>
            `}

            <p class="text-xs text-mute" style="margin:0">${qe("editor.coverage",{n:this._blocks.length,h:this._totalCoverage()})}</p>
          </div>
        `}case 3:return q`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${qe("wizard.days.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${qe("wizard.days.hint")}</p>
            <div class="row" style="gap:4px">
              ${rt().map((e,t)=>{const i=this._days[t];return q`
                  <button class="mono" @click=${()=>{const e=[...this._days];e[t]=e[t]?0:1,this._days=e}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text-muted)"};border:1px solid ${i?"transparent":"var(--border-soft)"};cursor:pointer">
                    ${e}
                  </button>
                `})}
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,1,1]}}>${qe("editor.days.all")}</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,0,0]}}>${qe("editor.days.weekdays")}</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[0,0,0,0,0,1,1]}}>${qe("editor.days.weekend")}</button>
            </div>
          </div>
        `;case 4:return q`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${qe("wizard.weather.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${qe("wizard.weather.hint")}</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!0}}>
                <div class="tile-pick__icon">${_e("cloud",16)}</div>
                <div class="tile-pick__name">${qe("wizard.weather.yes")}</div>
                <div class="tile-pick__desc">${qe("wizard.weather.yes.desc")}</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!1}}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${_e("close",16)}</div>
                <div class="tile-pick__name">${qe("wizard.weather.no")}</div>
                <div class="tile-pick__desc">${qe("wizard.weather.no.desc")}</div>
              </button>
            </div>
          </div>
        `;case 5:return q`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">${qe("wizard.review.heading")}</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">${qe("editor.field.name")}</span><strong>${this._name||qe("nav.new_schedule")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${qe("nav.devices")}</span><strong>${"scene"===this._specialMode?qe("wizard.review.scene_mode"):"automation"===this._specialMode?qe("wizard.review.automation_mode"):qe("wizard.review.devices",{n:this._pickedDevices.length})}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${qe("editor.days.repeat")}</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${qe("wizard.weather.heading")}</span><strong>${this._weatherEnabled?qe("wizard.review.weather_on"):qe("wizard.review.weather_off")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${qe("wizard.step.time")}</span><strong>${this._blocks.length}</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">${qe("wizard.review.note")}</p>
          </div>
        `;default:return G}}_togglePick(e){this._specialMode||(this._pickedDevices.includes(e)?this._pickedDevices=this._pickedDevices.filter(t=>t!==e):this._pickedDevices=[...this._pickedDevices,e])}_toggleSpecialMode(e){this._specialMode=this._specialMode===e?"":e,this._specialMode&&(this._pickedDevices=[])}_inferDeviceType(){if(this._specialMode)return this._specialMode;if(!this._pickedDevices.length)return"thermostat";const e=this.card._devices.find(e=>e.id===this._pickedDevices[0]);return e?.type||"thermostat"}_defaultBlocks(e){const t=We(e);return"scene"===e||"automation"===e?[{start:8,end:9,action:{...t}}]:[{start:0,end:7,action:{...t}},{start:7,end:22,action:{...t}},{start:22,end:24,action:{...t}}]}_ensureBlocksFor(e){this._blocksDeviceType!==e&&(this._blocks=this._defaultBlocks(e),this._blocksDeviceType=e,this._selectedBlockIdx=-1)}_resetBlocks(e){this._blocks=this._defaultBlocks(e),this._selectedBlockIdx=-1}_addBlock(e){const t=[...this._blocks].sort((e,t)=>e.start-t.start);let i=0,s=24;for(let e=0;e<=t.length;e++){const a=0===e?0:t[e-1].end,n=e===t.length?24:t[e].start;if(n-a>=1){i=a,s=Math.min(a+2,n);break}}s-i<.25&&(i=12,s=13);const a=[...this._blocks,{start:i,end:s,action:We(e)}];this._blocks=a.sort((e,t)=>e.start-t.start),this._selectedBlockIdx=this._blocks.findIndex(e=>e.start===i&&e.end===s)}_removeSelected(){this._selectedBlockIdx<0||(this._blocks=this._blocks.filter((e,t)=>t!==this._selectedBlockIdx),this._selectedBlockIdx=-1)}_setAction(e){if(this._selectedBlockIdx<0)return;const t=Oe(this._inferDeviceType(),e),i=[...this._blocks];i[this._selectedBlockIdx]={...i[this._selectedBlockIdx],action:{id:e,value:t?.value?t.value.default:void 0}},this._blocks=i}_setActionValue(e){if(this._selectedBlockIdx<0)return;const t=[...this._blocks],i=t[this._selectedBlockIdx];t[this._selectedBlockIdx]={...i,action:{...i.action||{id:""},value:e}},this._blocks=t}_fmtBlockRange(e){const t=e=>{const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`};return`${t(e.start)} → ${t(e.end)}`}_totalCoverage(){const e=this._blocks.reduce((e,t)=>e+(t.end-t.start),0);return e.toFixed(1).replace(/\.0$/,"")}async _finish(){const e=this._inferDeviceType();this._ensureBlocksFor(e);const t={id:"",name:this._name,device_type:e,device_ids:this._specialMode?[]:this._pickedDevices,days:this._days,enabled:!0,blocks:[...this._blocks].sort((e,t)=>e.start-t.start),weather_rules:[]};await this.card.doAddSchedule(t),this._weatherEnabled&&this.card.navigate("weatherRule")}};_t.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],_t.prototype,"card",void 0),e([ve({type:Number})],_t.prototype,"nowHour",void 0),e([me()],_t.prototype,"_step",void 0),e([me()],_t.prototype,"_name",void 0),e([me()],_t.prototype,"_pickedDevices",void 0),e([me()],_t.prototype,"_specialMode",void 0),e([me()],_t.prototype,"_days",void 0),e([me()],_t.prototype,"_weatherEnabled",void 0),e([me()],_t.prototype,"_blocks",void 0),e([me()],_t.prototype,"_blocksDeviceType",void 0),e([me()],_t.prototype,"_selectedBlockIdx",void 0),e([me()],_t.prototype,"_variant",void 0),_t=e([ue("chronos-wizard")],_t);let bt=class extends de{constructor(){super(...arguments),this.nowHour=0,this._pickerOpen=!1,this._search="",this._pickedAlias={},this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected="",this._busy=!1,this._lastError="",this._debugLog=[]}_log(e){const t=`${(new Date).toLocaleTimeString()} · ${e}`;console.log("[Chronos]",t),this._debugLog=[...this._debugLog.slice(-9),t]}_askRemove(e){this._log(`click TRASH id="${e}" (type=${typeof e})`),this._confirmRemoveId=e}async _doRemove(e){if(this._log(`click CONFIRM id="${e}" busy=${this._busy}`),this._busy)return void this._log("ABORT: busy=true");this._busy=!0,this._lastError="";const t=this.card._devices.length;this._log(`devices BEFORE remove: ${t}`);try{this._log(`calling doRemoveDevice("${e}")…`),await this.card.doRemoveDevice(e);const i=this.card._devices.length;this._log(`OK · devices AFTER: ${i} (delta=${i-t})`),i===t&&this._log("WARN: device count NON cambiato → backend non ha rimosso")}catch(e){const t=e?.message||String(e);this._lastError=t,this._log(`ERROR: ${t}`)}finally{this._busy=!1,this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected="",this.requestUpdate()}}render(){const{_devices:e,_availableEntities:t}=this.card;return q`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${qe("screen.devices.title")}</h1>
            <p class="page-sub">${qe("devices.subtitle",{n:e.length})}</p>
          </div>
          <div class="row" style="gap:8px">
            <button class="btn" title="Force refresh from backend"
              @click=${async()=>{this._log("force REFRESH dal backend…");try{await this.card._reloadAllDebug(),this._log(`refresh OK · devices=${this.card._devices.length}`)}catch(e){this._log(`refresh ERROR: ${e?.message||e}`)}}}>
              ${_e("repeat",14)}
            </button>
            ${e.length?q`
              <button class="btn" @click=${()=>{this._bulkOpen=!0,this._bulkSelected=e[0]?.id||""}}>
                ${_e("trash",14)} ${qe("devices.unlink")}…
              </button>
            `:G}
            <button class="btn btn--primary" @click=${()=>{this._pickerOpen=!0}}>
              ${_e("plus",14)} ${qe("devices.add_entity")}
            </button>
          </div>
        </div>

        ${this._lastError?q`
          <div style="padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:6px;font-size:12.5px;font-family:ui-monospace,monospace">
            ${this._lastError}
          </div>
        `:G}

        <div class="card">
          <div class="col" style="gap:0">
            ${e.map(e=>{const t=ot[e.type]||{label:e.type},i=this.card.hass?.states?.[e.entity_id],s=i?.state||"—",a=Ee(e,i,this.card._settings);return q`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center;position:relative">
                  <div class="device-row__icon" style="background:${a.soft};color:${a.accent};flex:0 0 auto;border:1px solid ${a.soft}">
                    ${xe(e.type,17)}
                  </div>
                  <div class="device-row__main" style="min-width:0">
                    <input class="input" .value=${e.alias}
                      @change=${t=>this.card.doUpdateDevice(e.id,{alias:t.target.value})}
                      style="border:1px solid transparent;background:transparent;padding:4px 6px;font-weight:500;font-size:14px;margin-left:-6px;width:100%;max-width:240px"
                      placeholder="${qe("devices.alias")}…"/>
                    <div class="device-row__meta" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--text-muted)">${e.entity_id}</span>
                      ${e.area?q` · ${e.area}`:G}
                      <span style="color:var(--text-muted);opacity:0.6"> · id:${e.id}(${typeof e.id})</span>
                    </div>
                  </div>
                  <span class="chip chip--accent" style="flex:0 0 auto">${t.label}</span>
                  <span class="mono text-xs text-mute" style="flex:0 0 auto;min-width:60px;text-align:right">${s}</span>
                  <button
                    type="button"
                    class="btn btn--sm"
                    style="flex:0 0 auto;background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-weight:600;z-index:5;position:relative"
                    @click=${t=>{t.preventDefault(),t.stopPropagation(),this._askRemove(e.id)}}
                    title="${qe("devices.unlink")}: ${e.alias}">
                    ${_e("trash",12)} ${qe("common.remove")}
                  </button>
                </div>
              `})}
            ${e.length?G:q`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("device",22)}</div>
              <div style="font-weight:600;color:var(--text);font-size:14px">${qe("devices.empty.title")}</div>
              <div style="font-size:12.5px;margin-top:4px">${qe("devices.empty.hint")}</div>
            </div>`}
          </div>
        </div>

        <p class="text-xs text-mute" style="margin:0">${qe("devices.types_hint")}</p>

        ${this._debugLog.length?q`
          <details style="font-size:11px;font-family:ui-monospace,monospace;background:var(--bg-sunken);border-radius:8px;padding:8px 12px;color:var(--text-soft)">
            <summary style="cursor:pointer;font-weight:600">Debug log (${this._debugLog.length})</summary>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:2px">
              ${this._debugLog.map(e=>q`<div>${e}</div>`)}
            </div>
            <button class="btn btn--sm" style="margin-top:8px" @click=${()=>{this._debugLog=[]}}>Clear log</button>
          </details>
        `:G}

        ${this._pickerOpen?this._renderPicker(t):G}
        ${this._confirmRemoveId?this._renderConfirm():G}
        ${this._bulkOpen?this._renderBulkRemove():G}
      </div>
    `}_renderConfirm(){const e=this.card._devices.find(e=>e.id===this._confirmRemoveId);return e?q`
      <div class="modal-overlay" @click=${()=>{this._confirmRemoveId=""}}>
        <div class="card" style="width:min(420px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${qe("devices.unlink")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${e.alias}</strong>
            <span class="mono text-xs" style="display:block;color:var(--text-muted);margin-top:4px">${e.entity_id}</span>
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmRemoveId=""}}>${qe("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444" ?disabled=${this._busy}
              @click=${()=>this._doRemove(e.id)}>
              ${_e("trash",12)} ${this._busy?"…":qe("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `:G}_renderBulkRemove(){const e=this.card._devices,t=e.find(e=>e.id===this._bulkSelected);return q`
      <div class="modal-overlay" @click=${()=>{this._bulkOpen=!1}}>
        <div class="card" style="width:min(520px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${qe("devices.unlink")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 14px">
            ${"devices.bulk_remove.hint"!==qe("devices.bulk_remove.hint")?qe("devices.bulk_remove.hint"):"Seleziona il dispositivo da scollegare. Verrà rimosso anche dalle schedulazioni che lo usano."}
          </p>
          <select class="select mono" style="margin-bottom:12px"
            @change=${e=>{this._bulkSelected=e.target.value}}>
            ${e.map(e=>q`
              <option value="${e.id}" ?selected=${e.id===this._bulkSelected}>${e.alias} — ${e.entity_id}</option>
            `)}
          </select>
          ${t?q`
            <div class="card card--ghost" style="padding:12px;margin-bottom:14px">
              <div class="row" style="gap:10px;align-items:center">
                <div class="device-row__icon">${xe(t.type,16)}</div>
                <div>
                  <div class="fw-600">${t.alias}</div>
                  <div class="text-xs text-mute mono">${t.entity_id}</div>
                </div>
              </div>
            </div>
          `:G}
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._bulkOpen=!1}}>${qe("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              ?disabled=${this._busy||!this._bulkSelected}
              @click=${()=>this._doRemove(this._bulkSelected)}>
              ${_e("trash",12)} ${this._busy?"…":qe("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_renderPicker(e){const t=e.filter(e=>!this._search||(e.entity_id+e.friendly_name).toLowerCase().includes(this._search.toLowerCase()));return q`
      <div class="modal-overlay" @click=${()=>{this._pickerOpen=!1}}>
        <div class="card" style="width:min(640px,100%);max-height:80vh;display:flex;flex-direction:column" @click=${e=>e.stopPropagation()}>
          <div class="sp-between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0">${qe("devices.picker.title")}</h3>
              <p class="text-mute text-sm" style="margin:2px 0 0">${qe("devices.picker.count",{n:e.length})}</p>
            </div>
            <button class="btn btn--icon btn--ghost" @click=${()=>{this._pickerOpen=!1}}>${_e("close",16)}</button>
          </div>
          <input class="input" placeholder="${qe("devices.picker.search")}" .value=${this._search}
            @input=${e=>{this._search=e.target.value}}
            style="margin-bottom:12px"/>
          <div style="overflow:auto;flex:1;display:flex;flex-direction:column;gap:4px">
            ${t.map(e=>{const t=e.type||"plug",i=ot[t]||{label:t};return q`
                <div class="device-row" style="background:var(--bg-sunken);padding:10px 12px">
                  <div class="device-row__icon">${xe(t,16)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.friendly_name}</div>
                    <div class="device-row__meta"><span class="mono">${e.entity_id}</span> · ${e.area||""}</div>
                  </div>
                  <input class="input" placeholder="${qe("devices.alias.placeholder")}"
                    .value=${this._pickedAlias[e.entity_id]||""}
                    @input=${t=>{this._pickedAlias={...this._pickedAlias,[e.entity_id]:t.target.value}}}
                    style="width:160px;font-size:12px"/>
                  <span class="chip chip--accent">${i.label}</span>
                  <button class="btn btn--sm btn--primary" @click=${async()=>{await this.card.doAddDevice(e.entity_id,this._pickedAlias[e.entity_id]||void 0),this._pickedAlias={...this._pickedAlias,[e.entity_id]:""}}}>${_e("plus",12)} ${qe("devices.import")}</button>
                </div>
              `})}
            ${e.length?G:q`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text);font-size:14px">${qe("devices.picker.all_imported")}</div>
              <div style="font-size:12.5px;margin-top:4px">${qe("devices.picker.all_imported.hint")}</div>
            </div>`}
          </div>
        </div>
      </div>
    `}};bt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],bt.prototype,"card",void 0),e([ve({type:Number})],bt.prototype,"nowHour",void 0),e([me()],bt.prototype,"_pickerOpen",void 0),e([me()],bt.prototype,"_search",void 0),e([me()],bt.prototype,"_pickedAlias",void 0),e([me()],bt.prototype,"_confirmRemoveId",void 0),e([me()],bt.prototype,"_bulkOpen",void 0),e([me()],bt.prototype,"_bulkSelected",void 0),e([me()],bt.prototype,"_busy",void 0),e([me()],bt.prototype,"_lastError",void 0),e([me()],bt.prototype,"_debugLog",void 0),bt=e([ue("chronos-devices-screen")],bt);let xt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._settings;return e?q`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">${qe("screen.settings.title")}</h1>
          <p class="page-sub">${qe("settings.subtitle")}</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.language.title")}</h3><p class="card__sub">${qe("settings.language.subtitle")}</p></div></div>
          <div class="segmented">
            ${["auto","it","en","fr","de"].map(t=>q`
              <button data-active="${(e.language||"auto")===t}" @click=${()=>this._updateSetting("language",t)}>
                ${"auto"===t?qe("settings.language.auto"):t.toUpperCase()}
              </button>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.weather.title")}</h3><p class="card__sub">${qe("settings.weather.subtitle")}</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">${qe("settings.weather.entity")}</label>
              <select class="select mono"
                @change=${e=>this._updateSetting("weather_entity",e.target.value)}>
                <option value="" ?selected=${!e.weather_entity}>${qe("common.none")}</option>
                ${this.card._weatherEntities.map(t=>q`
                  <option value="${t.entity_id}" ?selected=${e.weather_entity===t.entity_id}>${t.entity_id} — ${t.friendly_name}</option>
                `)}
              </select>
              <span class="field__hint">${qe("settings.weather.entity.hint")}</span>
            </div>

            ${this._renderSensorOverrides()}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.behavior.title")}</h3><p class="card__sub">${qe("settings.behavior.subtitle")}</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${qe("settings.polling")}</label>
              <div class="segmented">
                ${[1,5,15].map(t=>q`
                  <button data-active="${e.polling_minutes===t}" @click=${()=>this._updateSetting("polling_minutes",t)}>${t} ${qe("common.min")}</button>
                `)}
              </div>
              <span class="field__hint">${qe("settings.polling.hint")}</span>
            </div>
            <div class="field">
              <label class="field__label">${qe("settings.snap")}</label>
              <div class="segmented">
                ${[5,15,30,60].map(t=>q`
                  <button data-active="${e.snap_minutes===t}" @click=${()=>this._updateSetting("snap_minutes",t)}>${60===t?`1 ${qe("common.hour_short")}`:`${t} ${qe("common.min")}`}</button>
                `)}
              </div>
              <span class="field__hint">${qe("settings.snap.hint")}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.notify.title")}</h3><p class="card__sub">${qe("settings.notify.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${[["notify_block_executed",qe("settings.notify.block_executed"),qe("settings.notify.block_executed.desc")],["notify_rule_triggered",qe("settings.notify.rule_triggered"),qe("settings.notify.rule_triggered.desc")],["notify_sched_skipped",qe("settings.notify.sched_skipped"),qe("settings.notify.sched_skipped.desc")],["notify_command_error",qe("settings.notify.command_error"),qe("settings.notify.command_error.desc")]].map(([t,i,s])=>q`
              <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0">
                <div class="device-row__main">
                  <div class="device-row__name">${i}</div>
                  <div class="device-row__meta" style="font-family:var(--font-sans)">${s}</div>
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.appearance.title")}</h3><p class="card__sub">${qe("settings.appearance.subtitle")}</p></div></div>
          <div class="field">
            <label class="field__label">${qe("settings.density")}</label>
            <div class="segmented">
              ${["comfortable","compact"].map(t=>q`
                <button data-active="${e.density===t}" @click=${()=>this._updateSetting("density",t)}>
                  ${qe("settings.density."+t)}
                </button>
              `)}
            </div>
            <span class="field__hint">${qe("settings.appearance.theme_hint")}</span>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.timeline_default.title")}</h3><p class="card__sub">${qe("settings.timeline_default.subtitle")}</p></div></div>
          <div class="segmented">
            ${["linear","radial","list"].map(t=>q`
              <button data-active="${e.default_timeline_variant===t}" @click=${()=>this._updateSetting("default_timeline_variant",t)}>
                ${qe("timeline."+t)}
              </button>
            `)}
          </div>
        </div>

        ${this._renderColorsSection()}
      </div>
    `:q`<div class="text-mute">${qe("common.loading")}</div>`}_renderColorsSection(){const e=this.card._settings,t=Ae(e,"thermostat"),i=Ae(e,"boiler"),s=ze(e),a=Me(e);return q`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${qe("settings.colors.title")}</h3><p class="card__sub">${qe("settings.colors.subtitle")}</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">${qe("settings.colors.lights.title")}</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">${qe("settings.colors.lights.desc")}</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${a}
                @change=${e=>this._updateSetting("color_light_use_state",e.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops(qe("settings.colors.thermostat.title"),qe("settings.colors.thermostat.desc"),t,"color_stops_climate",ye)}

          ${this._renderTempStops(qe("settings.colors.boiler.title"),qe("settings.colors.boiler.desc"),i,"color_stops_boiler",ke)}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">${qe("settings.colors.preset.title")}</div>
                <div class="text-xs text-mute">${qe("settings.colors.preset.desc")}</div>
              </div>
              <button class="btn btn--sm" @click=${()=>this._updateSetting("color_presets",{...Se})}>
                ${_e("repeat",12)} ${qe("common.default")}
              </button>
            </div>
            <div class="grid-2" style="gap:8px">
              ${Object.entries(s).map(([e,t])=>q`
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
    `}_renderTempStops(e,t,i,s,a){return q`
      <div>
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
          <div>
            <div class="fw-600" style="font-size:13.5px">${e}</div>
            <div class="text-xs text-mute">${t}</div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn btn--sm" @click=${()=>this._addStop(i,s)}>
              ${_e("plus",12)} ${qe("settings.colors.add_stop")}
            </button>
            <button class="btn btn--sm" @click=${()=>this._updateSetting(s,a.map(e=>({...e})))}>
              ${_e("repeat",12)} ${qe("common.default")}
            </button>
          </div>
        </div>
        <div class="col" style="gap:6px">
          ${i.map((e,t)=>{const a=t===i.length-1;return q`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <span class="text-sm text-mute" style="width:18px">${a?">":"≤"}</span>
                ${a?q`<span class="mono text-sm" style="width:80px">${i[t-1]?.max??0}°+</span>`:q`<input type="number" class="input mono" step="0.5" .value=${String(e.max)}
                      @change=${e=>this._updateStopMax(i,s,t,parseFloat(e.target.value))}
                      style="width:80px;font-size:13px"/>`}
                <span class="text-sm text-mute">°C</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${e.color};border:1px solid var(--border)"></div>
                <span class="mono text-xs" style="flex:1;color:var(--text-muted)">${e.color}</span>
                <input type="color" .value=${e.color}
                  @change=${e=>this._updateStopColor(i,s,t,e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                ${i.length>1?q`
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._removeStop(i,s,t)} title="${qe("common.remove")}">
                    ${_e("trash",12)}
                  </button>
                `:G}
              </div>
            `})}
        </div>
      </div>
    `}_addStop(e,t){const i=e.filter(e=>e.max<900),s={max:(i.length?i[i.length-1].max:20)+5,color:"#9ca3af"},a=e.find(e=>e.max>=900),n=[...i,s];a&&n.push(a),this._updateSetting(t,n)}_removeStop(e,t,i){const s=e.filter((e,t)=>t!==i);this._updateSetting(t,s)}_updateStopMax(e,t,i,s){if(isNaN(s))return;const a=e.map((e,t)=>t===i?{...e,max:s}:e);this._updateSetting(t,a)}_updateStopColor(e,t,i,s){const a=e.map((e,t)=>t===i?{...e,color:s}:e);this._updateSetting(t,a)}_updatePresetColor(e,t){const i=ze(this.card._settings);this._updateSetting("color_presets",{...i,[e]:t})}_renderSensorOverrides(){const e=this.card._settings.weather_sensor_map||{},t=this.card._sensorEntities||[],i=(this.card._weatherAttributes||[]).filter(e=>!e.key.startsWith("forecast."));if(!i.length)return G;const s=this._groupSensorsByDeviceClass(t);return q`
      <div class="field" style="margin-top:8px">
        <label class="field__label">${qe("settings.weather.overrides.title")}</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          ${qe("settings.weather.overrides.hint")}
        </span>
        ${t.length?G:q`
          <div style="padding:10px 12px;background:#fef3c7;color:#92400e;border-radius:var(--r-md);font-size:12.5px">
            ${qe("settings.weather.overrides.no_sensors")}
          </div>
        `}
        <div class="col" style="gap:6px">
          ${i.map(i=>{const a=e[i.key]||"",n=t.find(e=>e.entity_id===a),r=n?`${n.state}${n.unit_of_measurement?" "+n.unit_of_measurement:""}`:"",o=a&&n?this._compatWarning(i,n):"";return q`
              <div class="col" style="gap:4px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md)">
                <div class="row" style="gap:10px;align-items:center;flex-wrap:wrap">
                  <div style="min-width:160px">
                    <div class="fw-600 text-sm">${Ue(i.key,i.label)}</div>
                    <div class="text-xs text-mute mono">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                  </div>
                  <select class="select mono" style="flex:1;min-width:240px"
                    @change=${e=>this._updateSensorOverride(i.key,e.target.value)}>
                    <option value="" ?selected=${!a}>${qe("settings.weather.overrides.use_main")}</option>
                    ${this._renderSensorOptions(s,i,a)}
                  </select>
                  ${a?q`
                    <span class="mono text-xs" style="color:${o?"#b45309":"var(--text-muted)"};min-width:90px;text-align:right;font-weight:${o?600:400}">${r}</span>
                    <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._updateSensorOverride(i.key,"")} title="${qe("common.remove")}">
                      ${_e("close",12)}
                    </button>
                  `:G}
                </div>
                ${o?q`
                  <div class="text-xs" style="color:#b45309;padding:6px 8px;background:#fef3c7;border-radius:6px;margin-top:2px">
                    ${_e("info",11)} ${o}
                  </div>
                `:G}
              </div>
            `})}
        </div>
      </div>
    `}_compatWarning(e,t){const i=(e.unit||"").trim(),s=(t.unit_of_measurement||"").trim(),a=this._matchingDeviceClasses(e.key),n=t.device_class||"";if("enum"===e.type){const e=String(t.state||"");return e&&!isNaN(parseFloat(e))?qe("settings.weather.overrides.warn.numeric_for_condition",{state:e}):""}const r=t.state;return null!=r&&""!==r&&isNaN(parseFloat(r))?qe("settings.weather.overrides.warn.not_numeric",{state:String(r)}):i&&s&&i!==s?qe("settings.weather.overrides.warn.unit_mismatch",{expected:i,got:s}):a.length&&n&&!a.includes(n)?qe("settings.weather.overrides.warn.class_mismatch",{expected:a.join(" / "),got:n}):""}_groupSensorsByDeviceClass(e){const t={};for(const i of e){const e=i.device_class||"other";(t[e]=t[e]||[]).push(i)}return t}_renderSensorOptions(e,t,i){const s=this._matchingDeviceClasses(t.key),a=s.filter(t=>e[t]),n=Object.keys(e).filter(e=>!a.includes(e)).sort();return[...a,...n].map(t=>q`
      <optgroup label="${"other"===t?qe("settings.weather.overrides.others"):t}${s.includes(t)?" · "+qe("settings.weather.overrides.suggested"):""}">
        ${e[t].map(e=>q`
          <option value="${e.entity_id}" ?selected=${i===e.entity_id}>
            ${e.entity_id}${e.unit_of_measurement?` (${e.unit_of_measurement})`:""} — ${e.friendly_name}
          </option>
        `)}
      </optgroup>
    `)}_matchingDeviceClasses(e){return{temperature:["temperature"],feels_like:["temperature"],dew_point:["temperature"],humidity:["humidity"],wind_speed:["wind_speed"],wind_gust:["wind_speed"],wind_bearing:["wind_direction"],pressure:["atmospheric_pressure","pressure"],uv_index:["uv_index"],solar_radiation:["irradiance"],rain_rate:["precipitation_intensity"]}[e]||[]}_updateSensorOverride(e,t){const i={...this.card._settings?.weather_sensor_map||{}};t?i[e]=t:delete i[e],this._updateSetting("weather_sensor_map",i)}_updateSetting(e,t){this.card.doUpdateSettings({[e]:t})}};xt.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],xt.prototype,"card",void 0),e([ve({type:Number})],xt.prototype,"nowHour",void 0),xt=e([ue("chronos-settings-screen")],xt);const wt=[{id:"thermostat_day_night",device_type:"thermostat",default_name_key:"recipe.thermostat_day_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:7,action:{id:"set_temperature",value:18}},{start:7,end:22,action:{id:"set_temperature",value:21}},{start:22,end:24,action:{id:"set_temperature",value:18}}],weather_rules:[{if:"temperature > 22",then:"Skip",active:!0,effect:"skip",block_index:null}]},{id:"lights_at_sunset",device_type:"light",default_name_key:"recipe.lights_at_sunset.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:18,end:23,start_anchor:"sunset",start_offset:-30,action:{id:"turn_on",value:80}}],weather_rules:[]},{id:"blinds_wind_safety",device_type:"blind",default_name_key:"recipe.blinds_wind_safety.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:7,end:19,start_anchor:"sunrise",start_offset:0,end_anchor:"sunset",end_offset:0,action:{id:"set_position",value:100}}],weather_rules:[{if:"wind_speed > 30",then:"Force close",active:!0,effect:"force_action",block_index:0,action_id:"close_cover",fire_mode:"once_per_daytime"}]},{id:"irrigation_skip_rain",device_type:"irrigation",default_name_key:"recipe.irrigation_skip_rain.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:6,end:6.5,action:{id:"turn_on",value:30}}],weather_rules:[{if:"forecast.rain_6h > 2",then:"Skip",active:!0,effect:"skip",block_index:0}]},{id:"boiler_eco_night",device_type:"boiler",default_name_key:"recipe.boiler_eco_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:6,action:{id:"set_operation",value:"eco"}},{start:6,end:23,action:{id:"set_operation",value:"electric"}},{start:23,end:24,action:{id:"set_operation",value:"eco"}}],weather_rules:[]},{id:"scene_routine",device_type:"scene",default_name_key:"recipe.scene_routine.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:7,end:8,action:{id:"activate"}},{start:19,end:20,action:{id:"activate"}},{start:22,end:23,action:{id:"activate"}}],weather_rules:[]},{id:"alarm_arm_night",device_type:"alarm",default_name_key:"recipe.alarm_arm_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:7,action:{id:"arm_night"}},{start:7,end:23,action:{id:"disarm"}},{start:23,end:24,action:{id:"arm_night"}}],weather_rules:[]},{id:"boiler_offgrid_soc",device_type:"boiler",default_name_key:"recipe.boiler_offgrid_soc.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:24,action:{id:"set_temperature",value:35}}],weather_rules:[{if:"sensor.battery_soc > 96 AND sun.minutes_until_sunset > 120",then:"Boost",active:!0,effect:"force_action",block_index:null,action_id:"set_temperature",action_value:60,fire_mode:"once_per_daytime"}]}];let $t=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){return q`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <h1 class="page-title">${qe("help.title")}</h1>
          <p class="page-sub">${qe("help.subtitle")}</p>
        </div>

        <div class="card">
          <h3 class="card__title" style="margin:0 0 6px">${qe("help.intro.title")}</h3>
          <p class="text-sm" style="margin:0;color:var(--text-soft);line-height:1.55">
            ${qe("help.intro.body")}
          </p>
        </div>

        <div class="grid-auto" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
          ${wt.map(e=>this._renderRecipe(e))}
        </div>

        <div class="card">
          <h3 class="card__title" style="margin:0 0 10px">${qe("help.glossary.title")}</h3>
          <div class="col" style="gap:10px">
            ${[["help.glossary.block.title","help.glossary.block.body"],["help.glossary.anchor.title","help.glossary.anchor.body"],["help.glossary.rule.title","help.glossary.rule.body"],["help.glossary.fire_mode.title","help.glossary.fire_mode.body"],["help.glossary.override.title","help.glossary.override.body"]].map(([e,t])=>q`
              <div>
                <div class="fw-600 text-sm">${qe(e)}</div>
                <div class="text-sm" style="color:var(--text-soft);line-height:1.5">${qe(t)}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderRecipe(e){e.blocks.reduce((e,t)=>e+(t.end-t.start),0);const t=e.blocks.some(e=>e.start_anchor||e.end_anchor),i=e.weather_rules.some(e=>"force_action"===e.effect||"scale_duration"===e.effect||"scale_value"===e.effect);return q`
      <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
        <div class="row" style="gap:10px;align-items:flex-start">
          <div class="device-row__icon" style="background:var(--accent-soft);color:var(--accent-ink)">
            ${xe(e.device_type,18)}
          </div>
          <div style="flex:1;min-width:0">
            <div class="fw-600">${qe(`recipe.${e.id}.title`)}</div>
            <div class="text-xs text-mute" style="margin-top:2px">${qe(`recipe.${e.id}.when`)}</div>
          </div>
        </div>

        ${this._renderTimelinePreview(e)}

        <div class="text-sm" style="color:var(--text-soft);line-height:1.5">
          ${qe(`recipe.${e.id}.howto`)}
        </div>

        <div class="row" style="gap:6px;flex-wrap:wrap">
          <span class="chip">${e.blocks.length} ${qe("wizard.step.time").toLowerCase()}</span>
          ${t?q`<span class="chip chip--weather">${_e("sun",11)} ${qe("help.tag.anchored")}</span>`:G}
          ${e.weather_rules.length?q`<span class="chip chip--accent">${_e("cloud",11)} ${e.weather_rules.length} ${qe("nav.weather_rules").toLowerCase()}</span>`:G}
          ${i?q`<span class="chip" style="background:#fef3c7;color:#92400e">${_e("bolt",11)} ${qe("help.tag.trigger")}</span>`:G}
        </div>

        <button class="btn btn--primary" @click=${()=>this._createFromRecipe(e)}>
          ${_e("plus",13)} ${qe("help.create_button")}
        </button>
      </div>
    `}_renderTimelinePreview(e){return q`
      <svg viewBox="0 0 ${280} ${18}" preserveAspectRatio="none"
        style="width:100%;height:18px;border-radius:4px;background:var(--bg-sunken);display:block">
        ${e.blocks.map(t=>{const i=t.start/24*280,s=(t.end-t.start)/24*280;return F`<rect x="${i}" y="0" width="${Math.max(2,s)}" height="${18}" fill="${Pe(e.device_type,t.action)}" rx="2"/>`})}
      </svg>
    `}async _createFromRecipe(e){const t={id:"",name:qe(e.default_name_key),device_type:e.device_type,device_ids:[],days:e.days,enabled:!1,blocks:e.blocks.map(e=>({...e,action:{...e.action}})),weather_rules:e.weather_rules.map(e=>({...e}))};await this.card.doAddSchedule(t)}};$t.styles=ge,e([ve({attribute:!1,hasChanged:()=>!0})],$t.prototype,"card",void 0),e([ve({type:Number})],$t.prototype,"nowHour",void 0),$t=e([ue("chronos-help-screen")],$t);const yt=[{value:"overview",label:"Overview"},{value:"editor",label:"Schedule editor"},{value:"week",label:"Week view"},{value:"weatherRulesList",label:"Weather rules"},{value:"device",label:"Devices"},{value:"live",label:"Live status"},{value:"wizard",label:"New schedule wizard"},{value:"devices",label:"Manage devices"},{value:"settings",label:"Settings"},{value:"help",label:"Help"}];let kt=class extends de{constructor(){super(...arguments),this._config={type:"custom:chronos-card"}}setConfig(e){this._config={...e}}_emit(e){this._config={...this._config,...e},Object.keys(this._config).forEach(e=>{const t=this._config[e];""!==t&&null!=t||delete this._config[e]}),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}render(){const e=this._config;return q`
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
          ${yt.map(t=>q`
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
    `}};kt.styles=r`
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
  `,e([ve({attribute:!1})],kt.prototype,"hass",void 0),e([me()],kt.prototype,"_config",void 0),kt=e([ue("chronos-card-editor")],kt);const St={overview:["screen.overview.title","chronos / overview"],editor:["screen.editor.title","chronos / schedule / edit"],weatherRule:["screen.weather_rule.title","chronos / schedule / weather"],weatherRulesList:["nav.weather_rules","chronos / weather"],device:["screen.device.title","chronos / device"],week:["screen.week.title","chronos / week"],live:["screen.live.title","chronos / live"],wizard:["screen.wizard.title","chronos / wizard"],devices:["screen.devices.title","chronos / devices"],settings:["screen.settings.title","chronos / settings"],help:["nav.help","chronos / help"]};let At=class extends de{constructor(){super(...arguments),this._screen="overview",this._selectedId="",this._deviceDetailId="",this._schedules=[],this._savedSchedules=[],this._devices=[],this._settings=null,this._timelineVariant="linear",this._pendingNav=null,this._loading=!0,this._loadError=null,this._actionsMap={},this._weatherAttributes=[],this._forecast=[],this._availableEntities=[],this._weatherEntities=[],this._sensorEntities=[],this._sceneEntities=[],this._automationEntities=[],this._mobile=!1,this._drawerOpen=!1,this._desktopCollapsed=!1,this._editingRuleIdx=-1,this._screenInitialised=!1,this._appliedLang=""}setConfig(e){this.config=e||{},e?.default_screen&&!this._screenInitialised&&(this._screen=e.default_screen,this._screenInitialised=!0),void 0!==e?.collapse_sidebar&&(this._desktopCollapsed=!!e.collapse_sidebar)}static getStubConfig(){return{type:"custom:chronos-card"}}static getConfigElement(){return document.createElement("chronos-card-editor")}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{for(const t of e){const e=this.config?.mobile_threshold,i="number"==typeof e?e:700;this._mobile=i>0&&t.contentRect.width<i}}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}async firstUpdated(){await this._loadAll()}updated(e){e.has("hass")&&this.hass&&function(e){at=e}(this.hass),e.has("_settings")&&this._settings&&(this._settings.density&&this.setAttribute("density",this._settings.density),this._applyLanguage())}_applyLanguage(){const e=this._settings?.language,t=function(e){const t=(e||"").toLowerCase().split("-")[0];return je=Ve.includes(t)?t:"it",je}(e&&"auto"!==e?e:this.hass?.language);this._appliedLang!==t&&(this._appliedLang=t,this.requestUpdate())}async _loadAll(){if(!this.hass)return;this._loading=!0,this._loadError=null;const e=async(e,t,i)=>{try{return await e()}catch(e){console.error(`Chronos: ${i} failed`,e);const s=e?.message||String(e);return this._loadError=(this._loadError?this._loadError+" · ":"")+`${i}: ${s}`,t}};try{const[t,i,s,a,n,r,o,l,d,c,u]=await Promise.all([e(()=>Ze(this.hass),[],"devices/list"),e(()=>Je(this.hass),[],"schedules/list"),e(()=>Xe(this.hass),null,"settings/get"),e(()=>async function(e){return e.callWS({type:"chronos/actions"})}(this.hass),{},"actions"),e(()=>async function(e){return e.callWS({type:"chronos/weather/attributes"})}(this.hass),[],"weather/attributes"),e(()=>async function(e){return e.callWS({type:"chronos/preview/forecast"})}(this.hass),[],"preview/forecast"),e(()=>Qe(this.hass),[],"entities/available"),e(()=>async function(e){return e.callWS({type:"chronos/weather/entities"})}(this.hass),[],"weather/entities"),e(()=>async function(e){return e.callWS({type:"chronos/sensor/entities"})}(this.hass),[],"sensor/entities"),e(()=>async function(e){return e.callWS({type:"chronos/scene/entities"})}(this.hass),[],"scene/entities"),e(()=>async function(e){return e.callWS({type:"chronos/automation/entities"})}(this.hass),[],"automation/entities")]);this._devices=t,this._schedules=i,this._savedSchedules=JSON.parse(JSON.stringify(i)),this._settings=s,this._actionsMap=a,this._weatherAttributes=n,this._forecast=r,this._availableEntities=o,this._weatherEntities=l,this._sensorEntities=d,this._sceneEntities=c,this._automationEntities=u,Te=a,Re(s),s?.snap_minutes&&it(s.snap_minutes),s?.default_timeline_variant&&(this._timelineVariant=s.default_timeline_variant),i.length&&!this._selectedId&&(this._selectedId=i[0].id),t.length&&!this._deviceDetailId&&(this._deviceDetailId=t[0].id)}catch(e){console.error("Chronos: failed to load data",e)}this._loading=!1}navigate(e){JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)&&"editor"===this._screen&&"editor"!==e?this._pendingNav=e:this._screen=e,"weatherRule"!==this._screen&&(this._editingRuleIdx=-1),this._drawerOpen=!1}editWeatherRule(e,t){this.selectSchedule(e),this._editingRuleIdx=t,this._screen="weatherRule"}selectSchedule(e,t){this._selectedId=e,t&&(this._screen=t)}selectDevice(e){this._deviceDetailId=e}get isDirty(){return JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)}async saveCurrentSchedule(){const e=this._schedules.find(e=>e.id===this._selectedId);if(!e)return;const t=await Ke(this.hass,e),i=this._schedules.findIndex(e=>e.id===t.id);i>=0&&(this._schedules=[...this._schedules.slice(0,i),t,...this._schedules.slice(i+1)]),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}updateScheduleLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,...t}:i)}updateBlocksLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,blocks:[...t].sort((e,t)=>e.start-t.start)}:i)}async doToggleSchedule(e,t){try{await async function(e,t,i){await e.callWS({type:"chronos/schedules/toggle",schedule_id:String(t),enabled:i})}(this.hass,e,t),this._schedules=this._schedules.map(i=>i.id===e?{...i,enabled:t}:i),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: toggleSchedule failed",e),await this._reloadAfterError()}}async doAddDevice(e,t){try{await async function(e,t,i,s){return e.callWS({type:"chronos/devices/add",entity_id:t,alias:i,area:s})}(this.hass,e,t)}catch(e){console.error("Chronos: addDevice failed",e)}this._devices=await Ze(this.hass),this._availableEntities=await Qe(this.hass)}async doUpdateDevice(e,t){try{await async function(e,t,i){return e.callWS({type:"chronos/devices/update",device_id:String(t),patch:i})}(this.hass,e,t)}catch(e){console.error("Chronos: updateDevice failed",e)}this._devices=await Ze(this.hass)}async doRemoveDevice(e){try{await async function(e,t){await e.callWS({type:"chronos/devices/remove",device_id:String(t)})}(this.hass,e)}catch(e){throw console.error("Chronos: removeDevice WS failed",e),e}try{this._devices=await Ze(this.hass)}catch(e){console.error("Chronos: fetchDevices after remove failed",e)}try{this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: fetchSchedules after remove failed",e)}try{this._availableEntities=await Qe(this.hass)}catch(e){console.error("Chronos: fetchAvailableEntities after remove failed",e)}}async doRemoveSchedule(e){try{await async function(e,t){await e.callWS({type:"chronos/schedules/remove",schedule_id:String(t)})}(this.hass,e)}catch(e){console.error("Chronos: removeSchedule failed",e)}this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId===e&&this._schedules.length?this._selectedId=this._schedules[0].id:this._schedules.length||(this._selectedId="")}async createSceneSchedule(){const e={id:"",name:qe("overview.new_scene_default_name"),device_type:"scene",device_ids:[],days:[1,1,1,1,1,1,1],enabled:!0,blocks:[{start:8,end:9,action:{id:"activate"}}],weather_rules:[]};await this.doAddSchedule(e)}async createAutomationSchedule(){const e={id:"",name:qe("overview.new_automation_default_name"),device_type:"automation",device_ids:[],days:[1,1,1,1,1,1,1],enabled:!0,blocks:[{start:8,end:9,action:{id:"turn_on"}}],weather_rules:[]};await this.doAddSchedule(e)}async doAddSchedule(e){try{const t=await Ke(this.hass,e);this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId=t.id,this._screen="editor"}catch(e){console.error("Chronos: addSchedule failed",e)}}async doUpdateSettings(e){try{const t=await async function(e,t){return e.callWS({type:"chronos/settings/update",patch:t})}(this.hass,e);this._settings=t}catch(e){console.error("Chronos: updateSettings failed",e),this._settings=await Xe(this.hass)}Re(this._settings),this._settings?.snap_minutes&&it(this._settings.snap_minutes)}async _reloadAllDebug(){await this._loadAll()}async _reloadAfterError(){try{this._devices=await Ze(this.hass),this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._settings=await Xe(this.hass)}catch{}}setTimelineVariant(e){this._timelineVariant=e}render(){if(this._loading)return q`<div style="padding:40px;text-align:center;color:var(--text-muted)">${qe("common.loading")}</div>`;const e=this._loadError?q`<div style="margin:10px;padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:4px;font-size:12.5px;font-family:ui-monospace,monospace">
          Chronos load errors: ${this._loadError}
        </div>`:G,[t,i]=St[this._screen]||St.overview,s=qe(t),a=new Date,n=a.getHours()+a.getMinutes()/60,r=this._mobile&&this._drawerOpen;let o;o=this._mobile?r?"drawer":"mini":this._desktopCollapsed?"mini":"full";const l=this.config?.title;return q`
      ${e}
      ${l?q`<div class="card-header" style="padding:14px 18px 6px;font-size:18px;font-weight:600;letter-spacing:-0.01em">${l}</div>`:G}
      <div class="app" data-mobile="${this._mobile}" data-drawer="${r}">
        ${this._renderSidebar(o)}
        ${r?q`<div class="sidebar-backdrop" @click=${()=>{this._drawerOpen=!1}}></div>`:G}
        <main class="content">
          ${this._renderTopbar(s,i,n)}
          <div class="content__inner">
            ${this._renderScreen(n)}
          </div>
        </main>
        ${this._pendingNav?this._renderDirtyModal():G}
      </div>
    `}_renderSidebar(e){const t=[{key:"overview",label:qe("nav.overview"),iconName:"dashboard"},{key:"editor",label:qe("nav.editor"),iconName:"clock"},{key:"week",label:qe("nav.week"),iconName:"calendar"},{key:"weatherRulesList",label:qe("nav.weather_rules"),iconName:"cloud"},{key:"device",label:qe("nav.devices"),iconName:"device"},{key:"live",label:qe("nav.live"),iconName:"live"}],i=[{key:"wizard",label:qe("nav.new_schedule"),iconName:"wand"},{key:"devices",label:qe("nav.manage_devices"),iconName:"device"},{key:"help",label:qe("nav.help"),iconName:"info"}],s="mini"===e;return q`
      <aside class="sidebar" data-mode="${e}">
        ${q`
              <button class="sidebar__hamburger" title="${qe(s?"nav.menu_open":"nav.menu_close")}"
                @click=${()=>{this._mobile?this._drawerOpen=!this._drawerOpen:this._desktopCollapsed=!this._desktopCollapsed}}>
                ${_e(s?"menu":"close",18)}
              </button>
            `}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark" style="background:transparent;box-shadow:none;padding:0;overflow:hidden">
            <img src="/local/chronos-icon.png?v=${Ge}" alt="Chronos"
              style="width:100%;height:100%;object-fit:contain;display:block"
              @error=${e=>{e.target.style.display="none",e.target.parentElement.textContent="C",e.target.parentElement.style.background="linear-gradient(135deg, var(--accent), var(--weather))",e.target.parentElement.style.color="white"}}/>
          </div>
          ${s?G:q`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v${Ge} · HACS</div>
              </div>`}
        </div>
        ${s?G:q`<div class="nav-section">${qe("nav.section.main")}</div>`}
        ${t.map(e=>q`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${s?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${_e(e.iconName,16)} ${s?G:q`<span>${e.label}</span>`}
            </button>
          `)}
        ${s?G:q`<div class="nav-section">${qe("nav.section.actions")}</div>`}
        ${i.map(e=>q`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${s?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${_e(e.iconName,16)} ${s?G:q`<span>${e.label}</span>`}
            </button>
          `)}
        <div class="sidebar__footer">
          <button class="nav-item" data-active="${"settings"===this._screen}"
            title="${s?qe("nav.settings"):""}" @click=${()=>this.navigate("settings")}>
            ${_e("settings",16)} ${s?G:q`<span>${qe("nav.settings")}</span>`}
          </button>
        </div>
      </aside>
    `}_renderTopbar(e,t,i){return q`
      <div class="topbar">
        <div>
          <div class="topbar__title">${e}</div>
          <div class="topbar__crumbs">${t}</div>
        </div>
        <div class="topbar__spacer"></div>
        <div class="topbar__time">
          <span class="time-dot"></span>
          <span>${Ye(i)}</span>
        </div>
      </div>
    `}_renderScreen(e){switch(this._screen){case"overview":default:return q`<chronos-overview .card=${this} .nowHour=${e}></chronos-overview>`;case"editor":return q`<chronos-editor .card=${this} .nowHour=${e}></chronos-editor>`;case"weatherRule":return q`<chronos-weather-rule .card=${this} .nowHour=${e}></chronos-weather-rule>`;case"weatherRulesList":return q`<chronos-weather-rules-list .card=${this} .nowHour=${e}></chronos-weather-rules-list>`;case"device":return q`<chronos-device-screen .card=${this} .nowHour=${e}></chronos-device-screen>`;case"week":return q`<chronos-week .card=${this} .nowHour=${e}></chronos-week>`;case"live":return q`<chronos-live .card=${this} .nowHour=${e}></chronos-live>`;case"wizard":return q`<chronos-wizard .card=${this} .nowHour=${e}></chronos-wizard>`;case"devices":return q`<chronos-devices-screen .card=${this} .nowHour=${e}></chronos-devices-screen>`;case"settings":return q`<chronos-settings-screen .card=${this} .nowHour=${e}></chronos-settings-screen>`;case"help":return q`<chronos-help-screen .card=${this} .nowHour=${e}></chronos-help-screen>`}}_renderDirtyModal(){return q`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">${qe("modal.unsaved.title")}</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">${qe("modal.unsaved.body")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${()=>{this._pendingNav=null}}>${qe("modal.unsaved.stay")}</button>
            <button class="btn" @click=${()=>{this._schedules=JSON.parse(JSON.stringify(this._savedSchedules)),this._screen=this._pendingNav,this._pendingNav=null}}>${qe("modal.unsaved.discard")}</button>
            <button class="btn btn--primary" @click=${async()=>{await this.saveCurrentSchedule(),this._screen=this._pendingNav,this._pendingNav=null}}>${_e("check",14)} ${qe("modal.unsaved.save")}</button>
          </div>
        </div>
      </div>
    `}};At.styles=[fe,ge],e([ve({attribute:!1})],At.prototype,"hass",void 0),e([ve({attribute:!1})],At.prototype,"config",void 0),e([me()],At.prototype,"_screen",void 0),e([me()],At.prototype,"_selectedId",void 0),e([me()],At.prototype,"_deviceDetailId",void 0),e([me()],At.prototype,"_schedules",void 0),e([me()],At.prototype,"_savedSchedules",void 0),e([me()],At.prototype,"_devices",void 0),e([me()],At.prototype,"_settings",void 0),e([me()],At.prototype,"_timelineVariant",void 0),e([me()],At.prototype,"_pendingNav",void 0),e([me()],At.prototype,"_loading",void 0),e([me()],At.prototype,"_loadError",void 0),e([me()],At.prototype,"_actionsMap",void 0),e([me()],At.prototype,"_weatherAttributes",void 0),e([me()],At.prototype,"_forecast",void 0),e([me()],At.prototype,"_availableEntities",void 0),e([me()],At.prototype,"_weatherEntities",void 0),e([me()],At.prototype,"_sensorEntities",void 0),e([me()],At.prototype,"_sceneEntities",void 0),e([me()],At.prototype,"_automationEntities",void 0),e([me()],At.prototype,"_mobile",void 0),e([me()],At.prototype,"_drawerOpen",void 0),e([me()],At.prototype,"_desktopCollapsed",void 0),e([me()],At.prototype,"_editingRuleIdx",void 0),At=e([ue("chronos-card")],At),window.customCards=window.customCards||[],window.customCards.push({type:"chronos-card",name:"Chronos Scheduler",description:"Advanced scheduler for Home Assistant with weather-based rules",preview:!1,documentationURL:"https://github.com/Pricesswg/Chronos-Scheduler"});export{At as ChronosCard};
