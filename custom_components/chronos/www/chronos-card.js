function e(e,t,i,s){var r,a=arguments.length,n=a<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var o=e.length-1;o>=0;o--)(r=e[o])&&(n=(a<3?r(n):a>3?r(t,i,n):r(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let a=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new a(i,e,s)},o=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,v=globalThis,g=v.trustedTypes,m=g?g.emptyScript:"",f=v.reactiveElementPolyfillSupport,_=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!l(e,t),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const a=s?.call(this);r?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...h(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const a=r.fromAttribute(t,e.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const a=this.constructor;if(!1===s&&(r=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??w)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,f?.({ReactiveElement:y}),(v.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=e=>e,S=$.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+C,E=`<${M}>`,B=document,T=()=>B.createComment(""),R=e=>null===e||"object"!=typeof e&&"function"!=typeof e,D=Array.isArray,H="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,L=/>/g,W=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,P=/"/g,j=/^(?:script|style|textarea|title)$/i,U=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=U(1),q=U(2),F=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),Z=new WeakMap,J=B.createTreeWalker(B,129);function K(e,t){if(!D(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const Q=(e,t)=>{const i=e.length-1,s=[];let r,a=2===t?"<svg>":3===t?"<math>":"",n=N;for(let t=0;t<i;t++){const i=e[t];let o,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===N?"!--"===l[1]?n=I:void 0!==l[1]?n=L:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=W):void 0!==l[3]&&(n=W):n===W?">"===l[0]?(n=r??N,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,o=l[1],n=void 0===l[3]?W:'"'===l[3]?P:O):n===P||n===O?n=W:n===I||n===L?n=N:(n=W,r=void 0);const h=n===W&&e[t+1].startsWith("/>")?" ":"";a+=n===N?i+E:d>=0?(s.push(o),i.slice(0,d)+z+i.slice(d)+C+h):i+C+(-2===d?t:h)}return[K(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class X{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,a=0;const n=e.length-1,o=this.parts,[l,d]=Q(e,t);if(this.el=X.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&o.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(z)){const t=d[a++],i=s.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);o.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?re:"@"===n[1]?ae:ie}),s.removeAttribute(e)}else e.startsWith(C)&&(o.push({type:6,index:r}),s.removeAttribute(e));if(j.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],T()),J.nextNode(),o.push({type:2,index:++r});s.append(e[t],T())}}}else if(8===s.nodeType)if(s.data===M)o.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)o.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const i=B.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,s){if(t===F)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=R(t)?void 0:t._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=Y(e,r._$AS(e,t.values),r,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??B).importNode(t,!0);J.currentNode=s;let r=J.nextNode(),a=0,n=0,o=i[0];for(;void 0!==o;){if(a===o.index){let t;2===o.type?t=new te(r,r.nextSibling,this,e):1===o.type?t=new o.ctor(r,o.name,o.strings,this,e):6===o.type&&(t=new ne(r,this,e)),this._$AV.push(t),o=i[++n]}a!==o?.index&&(r=J.nextNode(),a++)}return J.currentNode=B,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),R(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==F&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>D(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&R(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new X(e)),t}k(e){D(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new te(this.O(T()),this.O(T()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,s){const r=this.strings;let a=!1;if(void 0===r)e=Y(this,e,t,0),a=!R(e)||e!==this._$AH&&e!==F,a&&(this._$AH=e);else{const s=e;let n,o;for(e=r[0],n=0;n<r.length-1;n++)o=Y(this,s[i+n],t,n),o===F&&(o=this._$AH[n]),a||=!R(o)||o!==this._$AH[n],o===G?e=G:e!==G&&(e+=(o??"")+r[n+1]),this._$AH[n]=o}a&&!s&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class re extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ae extends ie{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??G)===F)return;const i=this._$AH,s=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==G&&(i===G||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const oe=$.litHtmlPolyfillSupport;oe?.(X,te),($.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;class de extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new te(t.insertBefore(T(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");const he=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ue={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:w},pe=(e=ue,t,i)=>{const{kind:s,metadata:r}=i;let a=globalThis.litPropertyMetadata.get(r);if(void 0===a&&globalThis.litPropertyMetadata.set(r,a=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ve(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return ve({...e,state:!0,attribute:!1})}const me=n`
  :host {
    display: block;
    height: 100%;
    --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

    /* Chrome — follow HA theme. Fallback to our oklch when not set. */
    --bg: var(--primary-background-color, oklch(0.985 0.004 85));
    --bg-soft: var(--secondary-background-color, oklch(0.965 0.005 85));
    --bg-sunken: var(--ha-card-background, var(--secondary-background-color, oklch(0.945 0.006 85)));
    --surface: var(--card-background-color, #ffffff);
    --border: var(--divider-color, oklch(0.90 0.006 85));
    --border-soft: var(--divider-color, oklch(0.93 0.005 85));
    --text: var(--primary-text-color, oklch(0.22 0.012 85));
    --text-soft: var(--secondary-text-color, oklch(0.42 0.012 85));
    --text-muted: var(--disabled-text-color, oklch(0.60 0.010 85));

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
`,fe=n`
  :host { display: block; }

  * { box-sizing: border-box; }
  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; padding: 0; }
  input, textarea, select { outline: none; }

  .mono { font-family: var(--font-mono); font-feature-settings: "tnum" 1; }

  /* App shell */
  .app {
    display: grid;
    grid-template-columns: 244px 1fr;
    min-height: 600px;
    height: 100%;
    background: var(--bg);
    border-radius: var(--r-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    position: relative;
  }
  .app[data-mobile="true"] { grid-template-columns: 64px 1fr; }

  .sidebar {
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
  }
  .sidebar[data-mode="mini"] {
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

  @media (max-width: 900px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .content__inner { padding: 18px 16px 40px; }
    .topbar { padding: 12px 16px; }
  }
`;function _e(e,t=16,i=1.6){const s=t,r=i;switch(e){case"dashboard":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`;case"calendar":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;case"clock":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;case"cloud":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 10a3.5 3.5 0 0 1-.5 7H7z"/></svg>`;case"sun":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>`;case"rain":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 8a3.5 3.5 0 0 1-.5 7"/><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"/></svg>`;case"snow":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7l14 10M19 7 5 17"/></svg>`;case"device":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/></svg>`;case"live":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"/></svg>`;case"settings":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;case"wand":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4"/><path d="m3 21 9-9"/><path d="M12.5 11.5 14 10l2 2-1.5 1.5z"/></svg>`;case"plus":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;case"chevron-right":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`;case"chevron-left":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>`;case"play":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></svg>`;case"pause":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>`;case"thermostat":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="12" rx="2"/><circle cx="12" cy="17" r="3.5"/><path d="M12 8v7"/></svg>`;case"light":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3V17h6v-1.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3z"/></svg>`;case"blind":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M4 4v14h16V4M4 8h16M4 12h16M4 16h16M11 20v2M13 20v2"/></svg>`;case"irrigation":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z"/></svg>`;case"plug":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5"/></svg>`;case"fan":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10V5a4 4 0 0 1 4 4M14 12h5a4 4 0 0 1-4 4M12 14v5a4 4 0 0 1-4-4M10 12H5a4 4 0 0 1 4-4"/></svg>`;case"boiler":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M9 16h6"/></svg>`;case"mower":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-1 3a2 2 0 0 1-2 1.5H6A2 2 0 0 1 4 18zM7 15v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M10 7V4M14 7V4"/></svg>`;case"vacuum":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2"/></svg>`;case"repeat":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 12v-2a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 0 1-4 4H3"/></svg>`;case"bolt":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>`;case"check":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`;case"close":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`;case"menu":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;case"info":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></svg>`;case"edit":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/></svg>`;case"trash":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`;case"temp":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0z"/></svg>`;case"droplet":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/></svg>`;case"wind":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h9"/></svg>`;case"power":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9M6 6a8 8 0 1 0 12 0"/></svg>`;case"moon":return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>`;default:return q`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${r}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`}}const be={thermostat:"thermostat",light:"light",blind:"blind",irrigation:"irrigation",plug:"plug",fan:"fan",boiler:"boiler",mower:"mower",vacuum:"vacuum"};function we(e,t=16){return _e(be[e]||"device",t)}const xe={sun:"sun",sunny:"sun",rain:"rain",rainy:"rain",cloud:"cloud",cloudy:"cloud",partlycloudy:"cloud",snow:"snow",snowy:"snow",fog:"cloud",windy:"wind"};function ye(e,t=16){return _e(xe[e]||"cloud",t)}const $e=[{max:10,color:"#3b82f6"},{max:15,color:"#06b6d4"},{max:19,color:"#fbbf24"},{max:23,color:"#10b981"},{max:25,color:"#fbbf24"},{max:999,color:"#ef4444"}],ke=[{max:35,color:"#3b82f6"},{max:50,color:"#10b981"},{max:60,color:"#fbbf24"},{max:999,color:"#ef4444"}],Se={eco:"#10b981",comfort:"#3b82f6",sleep:"#6366f1",away:"#9ca3af",boost:"#ef4444",home:"#06b6d4",none:"#9ca3af"};function Ae(e,t){if(!e)return"boiler"===t?ke:$e;const i=e["boiler"===t?"color_stops_boiler":"color_stops_climate"];return i&&i.length?[...i].sort((e,t)=>e.max-t.max):"boiler"===t?ke:$e}function ze(e){const t=e?.color_presets;return{...Se,...t||{}}}function Ce(e){const t=e?.color_light_use_state;return void 0===t||!!t}const Me={accent:"var(--accent)",soft:"var(--accent-soft)",live:!1};function Ee(e,t,i){if(!t)return Me;const s=t.state||"",r=t.attributes||{};if("light"===e.type){if("off"===s||"unavailable"===s)return{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1};if(Ce(i)){const e=r.rgb_color;if(Array.isArray(e)&&3===e.length){return{accent:`rgb(${e[0]}, ${e[1]}, ${e[2]})`,soft:`rgba(${e[0]}, ${e[1]}, ${e[2]}, 0.18)`,live:!0}}}return{accent:"#fbbf24",soft:"rgba(251, 191, 36, 0.18)",live:!0}}if("thermostat"===e.type||"boiler"===e.type){const t=ze(i),a=r.preset_mode;if(a&&t[a]&&"off"!==s){const e=t[a];return{accent:e,soft:Be(e),live:!0}}const n=function(e){const t=[e.current_temperature,e.temperature];for(const e of t){if("number"==typeof e)return e;const t=parseFloat(e);if(!isNaN(t))return t}return}(r);if("number"==typeof n){const t=function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"#9ca3af"}(n,Ae(i,e.type));return{accent:t,soft:Be(t),live:!0}}return Me}if("blind"===e.type){const e=r.current_position;if("number"==typeof e){const t=e/100,i=Math.round(60+140*t),s=Math.round(80+100*t),r=Math.round(120+135*t);return{accent:`rgb(${i}, ${s}, ${r})`,soft:`rgba(${i}, ${s}, ${r}, 0.18)`,live:!0}}}if("fan"===e.type){const e=r.percentage;if("number"==typeof e&&"on"===s){const t=function(e,t,i){const s=e.replace("#",""),r=t.replace("#",""),a=parseInt(s.slice(0,2),16),n=parseInt(s.slice(2,4),16),o=parseInt(s.slice(4,6),16),l=parseInt(r.slice(0,2),16),d=parseInt(r.slice(2,4),16),c=parseInt(r.slice(4,6),16),h=Math.round(a+(l-a)*i),u=Math.round(n+(d-n)*i),p=Math.round(o+(c-o)*i);return`rgb(${h}, ${u}, ${p})`}("#06b6d4","#3b82f6",e/100);return{accent:t,soft:Be(t),live:!0}}}return"on"===s||"open"===s||"cleaning"===s||"mowing"===s?{accent:"#10b981",soft:"rgba(16, 185, 129, 0.18)",live:!0}:"off"===s||"closed"===s||"docked"===s||"unavailable"===s?{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1}:Me}function Be(e){if(!e.startsWith("#"))return"var(--bg-sunken)";const t=e.replace("#","");return`rgba(${parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16)}, ${parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16)}, ${parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)}, 0.18)`}const Te={on:"var(--mode-comfort)",off:"var(--mode-off)",set:"var(--mode-eco)",preset:"var(--mode-night)",cmd:"var(--mode-boost)"};let Re=null;function De(e){Re=e}const He={thermostat:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"climate.set_temperature",value:{type:"number",unit:"°C",min:5,max:35,step:.5,default:21}},{id:"set_preset",label:"Preset",kind:"preset",service:"climate.set_preset_mode",value:{type:"enum",options:["none","eco","comfort","sleep","away","boost","home"],default:"comfort"}},{id:"turn_off",label:"Spegni",kind:"off",service:"climate.turn_off"}],boiler:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"water_heater.set_temperature",value:{type:"number",unit:"°C",min:30,max:75,step:1,default:55}},{id:"set_operation",label:"Operation mode",kind:"preset",service:"water_heater.set_operation_mode",value:{type:"enum",options:["off","eco","electric","gas","heat_pump","high_demand","performance"],default:"eco"}},{id:"turn_off",label:"Spegni",kind:"off",service:"water_heater.turn_off"}],light:[{id:"turn_on",label:"Accendi",kind:"on",service:"light.turn_on",value:{type:"number",unit:"%",min:1,max:100,step:1,default:80,label:"Luminosità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"light.turn_off"}],blind:[{id:"set_position",label:"Posiziona",kind:"set",service:"cover.set_cover_position",value:{type:"number",unit:"%",min:0,max:100,step:5,default:100,label:"Apertura"}},{id:"open_cover",label:"Apri",kind:"on",service:"cover.open_cover"},{id:"close_cover",label:"Chiudi",kind:"off",service:"cover.close_cover"}],irrigation:[{id:"turn_on",label:"Avvia",kind:"on",service:"valve.open_valve",value:{type:"number",unit:"min",min:1,max:240,step:1,default:30,label:"Durata"}},{id:"turn_off",label:"Stop",kind:"off",service:"valve.close_valve"}],plug:[{id:"turn_on",label:"Accendi",kind:"on",service:"switch.turn_on"},{id:"turn_off",label:"Spegni",kind:"off",service:"switch.turn_off"}],fan:[{id:"turn_on",label:"Accendi",kind:"on",service:"fan.turn_on",value:{type:"number",unit:"%",min:10,max:100,step:10,default:50,label:"Velocità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"fan.turn_off"}],mower:[{id:"start_mowing",label:"Avvia taglio",kind:"on",service:"lawn_mower.start_mowing"},{id:"pause",label:"Pausa",kind:"cmd",service:"lawn_mower.pause"},{id:"dock",label:"Torna in base",kind:"off",service:"lawn_mower.dock"}],vacuum:[{id:"start",label:"Avvia pulizia",kind:"on",service:"vacuum.start"},{id:"pause",label:"Pausa",kind:"cmd",service:"vacuum.pause"},{id:"return_to_base",label:"Torna in base",kind:"off",service:"vacuum.return_to_base"}]};let Ne={};function Ie(e){return Ne[e]||He[e]||[]}function Le(e,t){return Ie(e).find(e=>e.id===t)}function We(e,t){if(!t)return"—";const i=Le(e,t.id);return i?i.value&&void 0!==t.value&&null!==t.value&&""!==t.value?`${t.value}${i.value.unit||""}`:i.label:t.id}function Oe(e,t){if(!t)return"var(--mode-off)";const i=Le(e,t.id);if("thermostat"===e||"boiler"===e){if("set_preset"===t.id||"set_operation"===t.id){const e=ze(Re),i=String(t.value??"");if(i&&e[i])return e[i]}if("set_temperature"===t.id){const i="number"==typeof t.value?t.value:parseFloat(String(t.value));if(!isNaN(i)){return function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"var(--mode-comfort)"}(i,Ae(Re,e))}}}return Te[i?.kind||"on"]||"var(--mode-comfort)"}function Pe(e){const t=Ie(e)[0];return t?{id:t.id,value:t.value?t.value.default:void 0}:{id:"turn_on"}}const je=["it","en","fr","de"];let Ue="it";function Ve(e,t){const i=qe[e];let s=i?.[Ue]||i?.it||e;if(t)for(const e of Object.keys(t))s=s.replace(new RegExp(`\\{${e}\\}`,"g"),String(t[e]));return s}const qe={"common.cancel":{it:"Annulla",en:"Cancel",fr:"Annuler",de:"Abbrechen"},"common.save":{it:"Salva",en:"Save",fr:"Enregistrer",de:"Speichern"},"common.delete":{it:"Elimina",en:"Delete",fr:"Supprimer",de:"Löschen"},"common.remove":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"common.add":{it:"Aggiungi",en:"Add",fr:"Ajouter",de:"Hinzufügen"},"common.back":{it:"Indietro",en:"Back",fr:"Retour",de:"Zurück"},"common.next":{it:"Avanti",en:"Next",fr:"Suivant",de:"Weiter"},"common.confirm":{it:"Conferma",en:"Confirm",fr:"Confirmer",de:"Bestätigen"},"common.close":{it:"Chiudi",en:"Close",fr:"Fermer",de:"Schließen"},"common.reset":{it:"Reset",en:"Reset",fr:"Réinitialiser",de:"Zurücksetzen"},"common.default":{it:"Default",en:"Default",fr:"Défaut",de:"Standard"},"common.none":{it:"Nessuna",en:"None",fr:"Aucune",de:"Keine"},"common.search":{it:"Cerca",en:"Search",fr:"Rechercher",de:"Suchen"},"common.yes":{it:"Sì",en:"Yes",fr:"Oui",de:"Ja"},"common.no":{it:"No",en:"No",fr:"Non",de:"Nein"},"common.enabled":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"common.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"common.loading":{it:"Caricamento…",en:"Loading…",fr:"Chargement…",de:"Lädt…"},"common.optional":{it:"opzionale",en:"optional",fr:"facultatif",de:"optional"},"common.value":{it:"Valore",en:"Value",fr:"Valeur",de:"Wert"},"common.min":{it:"min",en:"min",fr:"min",de:"Min."},"common.hour_short":{it:"h",en:"h",fr:"h",de:"Std."},"nav.section.main":{it:"Principale",en:"Main",fr:"Principal",de:"Hauptmenü"},"nav.section.actions":{it:"Azioni",en:"Actions",fr:"Actions",de:"Aktionen"},"nav.overview":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"nav.editor":{it:"Editor",en:"Editor",fr:"Éditeur",de:"Editor"},"nav.week":{it:"Settimana",en:"Week",fr:"Semaine",de:"Woche"},"nav.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"nav.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"nav.live":{it:"Stato live",en:"Live",fr:"Direct",de:"Live"},"nav.new_schedule":{it:"Nuova schedulazione",en:"New schedule",fr:"Nouvelle planification",de:"Neuer Zeitplan"},"nav.manage_devices":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"nav.settings":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"nav.help":{it:"Aiuto",en:"Help",fr:"Aide",de:"Hilfe"},"nav.menu_open":{it:"Apri menu",en:"Open menu",fr:"Ouvrir le menu",de:"Menü öffnen"},"nav.menu_close":{it:"Chiudi menu",en:"Close menu",fr:"Fermer le menu",de:"Menü schließen"},"screen.overview.title":{it:"Panoramica",en:"Overview",fr:"Aperçu",de:"Übersicht"},"screen.editor.title":{it:"Editor schedulazione",en:"Schedule editor",fr:"Éditeur de planification",de:"Zeitplan-Editor"},"screen.weather_rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"screen.device.title":{it:"Dispositivo",en:"Device",fr:"Appareil",de:"Gerät"},"screen.week.title":{it:"Vista settimanale",en:"Week view",fr:"Vue semaine",de:"Wochenansicht"},"screen.live.title":{it:"Stato live",en:"Live status",fr:"État en direct",de:"Live-Status"},"screen.wizard.title":{it:"Wizard",en:"Wizard",fr:"Assistant",de:"Assistent"},"screen.devices.title":{it:"Gestisci dispositivi",en:"Manage devices",fr:"Gérer les appareils",de:"Geräte verwalten"},"screen.settings.title":{it:"Impostazioni",en:"Settings",fr:"Réglages",de:"Einstellungen"},"modal.unsaved.title":{it:"Modifiche non salvate",en:"Unsaved changes",fr:"Modifications non enregistrées",de:"Nicht gespeicherte Änderungen"},"modal.unsaved.body":{it:"Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?",en:"You have pending changes on this schedule. Leave and discard them?",fr:"Des modifications sont en attente sur cette planification. Quitter et les perdre ?",de:"Du hast noch offene Änderungen an diesem Zeitplan. Wirklich verlassen und verwerfen?"},"modal.unsaved.stay":{it:"Resta qui",en:"Stay",fr:"Rester",de:"Bleiben"},"modal.unsaved.discard":{it:"Scarta modifiche",en:"Discard changes",fr:"Ignorer",de:"Verwerfen"},"modal.unsaved.save":{it:"Salva ed esci",en:"Save and exit",fr:"Enregistrer et quitter",de:"Speichern und verlassen"},"overview.subtitle":{it:"Schedulazioni configurate · {n} attive su {tot}",en:"Configured schedules · {n} active of {tot}",fr:"Planifications configurées · {n} actives sur {tot}",de:"Konfigurierte Zeitpläne · {n} aktiv von {tot}"},"overview.kpi.active":{it:"Attive",en:"Active",fr:"Actives",de:"Aktiv"},"overview.kpi.weather_rules":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"overview.kpi.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"overview.kpi.now":{it:"Ora corrente",en:"Now",fr:"Maintenant",de:"Jetzt"},"overview.no_schedules":{it:"Nessuna schedulazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"overview.no_schedules.cta":{it:"Avvia il wizard per crearne una",en:"Start the wizard to create one",fr:"Lance l'assistant pour en créer une",de:"Starte den Assistenten, um einen zu erstellen"},"overview.rules_count":{it:"{n} regole",en:"{n} rules",fr:"{n} règles",de:"{n} Regeln"},"editor.field.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"editor.timeline_variant":{it:"Visualizzazione",en:"View",fr:"Affichage",de:"Ansicht"},"editor.add_block_hint":{it:"Clicca su una zona vuota della barra per aggiungere una fascia. Trascina i bordi per modificare durata e posizione.",en:"Click on an empty area of the bar to add a block. Drag the edges to adjust duration and position.",fr:"Clique sur une zone vide de la barre pour ajouter un créneau. Fais glisser les bords pour ajuster la durée et la position.",de:"Klicke auf einen freien Bereich der Leiste, um einen Block hinzuzufügen. Ziehe die Ränder, um Dauer und Position anzupassen."},"editor.block.from":{it:"Da",en:"From",fr:"De",de:"Von"},"editor.block.to":{it:"A",en:"To",fr:"À",de:"Bis"},"editor.block.fixed":{it:"Ora fissa",en:"Fixed time",fr:"Heure fixe",de:"Feste Zeit"},"editor.block.sunrise":{it:"Alba",en:"Sunrise",fr:"Lever du soleil",de:"Sonnenaufgang"},"editor.block.sunset":{it:"Tramonto",en:"Sunset",fr:"Coucher du soleil",de:"Sonnenuntergang"},"editor.block.today":{it:"oggi:",en:"today:",fr:"aujourd'hui :",de:"heute:"},"editor.block.action":{it:"Azione",en:"Action",fr:"Action",de:"Aktion"},"editor.block.delete":{it:"Elimina fascia",en:"Delete block",fr:"Supprimer le créneau",de:"Block löschen"},"editor.block.no_selection":{it:"Nessuna fascia selezionata. Clicca su una fascia esistente per modificarla, oppure su una zona libera per aggiungerne una nuova.",en:"No block selected. Click an existing block to edit it, or an empty area to add a new one.",fr:"Aucun créneau sélectionné. Clique sur un créneau existant pour le modifier, ou sur une zone libre pour en ajouter un.",de:"Kein Block ausgewählt. Klicke auf einen vorhandenen Block, um ihn zu bearbeiten, oder in einen freien Bereich, um einen neuen hinzuzufügen."},"editor.coverage":{it:"{n} fasce · totale coperto {h}h / 24h",en:"{n} blocks · total coverage {h}h / 24h",fr:"{n} créneaux · couverture totale {h}h / 24h",de:"{n} Blöcke · Abdeckung gesamt {h}h / 24h"},"editor.days.repeat":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"editor.days.all":{it:"Tutti i giorni",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"editor.days.weekdays":{it:"Lavorativi",en:"Weekdays",fr:"Jours ouvrés",de:"Wochentags"},"editor.days.weekend":{it:"Weekend",en:"Weekend",fr:"Week-end",de:"Wochenende"},"editor.weather_rules.title":{it:"Regole meteo",en:"Weather rules",fr:"Règles météo",de:"Wetterregeln"},"editor.weather_rules.add":{it:"Aggiungi regola",en:"Add rule",fr:"Ajouter une règle",de:"Regel hinzufügen"},"editor.weather_rules.empty":{it:"Nessuna regola meteo · esecuzione fissa indipendente dal meteo",en:"No weather rules · fixed execution regardless of weather",fr:"Aucune règle météo · exécution fixe indépendamment de la météo",de:"Keine Wetterregeln · feste Ausführung unabhängig vom Wetter"},"editor.devices_section":{it:"Dispositivi influenzati",en:"Affected devices",fr:"Appareils concernés",de:"Betroffene Geräte"},"editor.devices_count":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"editor.dirty.unsaved":{it:"Modifiche non salvate",en:"Unsaved changes",fr:"Modifications non enregistrées",de:"Ungespeicherte Änderungen"},"editor.dirty.saved":{it:"Tutto salvato",en:"All saved",fr:"Tout enregistré",de:"Alles gespeichert"},"wizard.title":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer une planification",de:"Zeitplan erstellen"},"wizard.subtitle":{it:"Procedura guidata · puoi modificare tutto in seguito",en:"Guided setup · you can edit everything later",fr:"Procédure guidée · tu pourras tout modifier ensuite",de:"Geführte Einrichtung · alles kann später angepasst werden"},"wizard.step.name":{it:"Nome",en:"Name",fr:"Nom",de:"Name"},"wizard.step.devices":{it:"Dispositivi",en:"Devices",fr:"Appareils",de:"Geräte"},"wizard.step.time":{it:"Fasce orarie",en:"Time blocks",fr:"Créneaux",de:"Zeitblöcke"},"wizard.step.days":{it:"Ripetizione",en:"Repeat",fr:"Répétition",de:"Wiederholung"},"wizard.step.weather":{it:"Meteo",en:"Weather",fr:"Météo",de:"Wetter"},"wizard.step.review":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.name.heading":{it:"Dai un nome alla schedulazione",en:"Give the schedule a name",fr:"Donne un nom à la planification",de:"Gib dem Zeitplan einen Namen"},"wizard.name.hint":{it:"Sarà visibile nella panoramica e nelle notifiche.",en:"It will appear in the overview and in notifications.",fr:"Il apparaîtra dans l'aperçu et les notifications.",de:"Wird in der Übersicht und in Benachrichtigungen angezeigt."},"wizard.name.suggestions":{it:"Suggerimenti:",en:"Suggestions:",fr:"Suggestions :",de:"Vorschläge:"},"wizard.devices.heading":{it:"Quali dispositivi sono coinvolti?",en:"Which devices are involved?",fr:"Quels appareils sont concernés ?",de:"Welche Geräte sind beteiligt?"},"wizard.devices.hint":{it:"Verranno tutti controllati dalla stessa programmazione.",en:"They will all be controlled by the same schedule.",fr:"Ils seront tous contrôlés par la même planification.",de:"Alle werden vom selben Zeitplan gesteuert."},"wizard.time.heading":{it:"Imposta le fasce orarie",en:"Set up time blocks",fr:"Définis les créneaux horaires",de:"Zeitblöcke festlegen"},"wizard.time.reset_preset":{it:"Reset preset",en:"Reset preset",fr:"Réinitialiser le préréglage",de:"Voreinstellung zurücksetzen"},"wizard.time.selected":{it:"Fascia selezionata",en:"Selected block",fr:"Créneau sélectionné",de:"Ausgewählter Block"},"wizard.days.heading":{it:"Quali giorni della settimana?",en:"Which days of the week?",fr:"Quels jours de la semaine ?",de:"An welchen Wochentagen?"},"wizard.days.hint":{it:"La schedulazione si ripeterà automaticamente ogni settimana.",en:"The schedule will repeat automatically every week.",fr:"La planification se répétera chaque semaine.",de:"Der Zeitplan wiederholt sich jede Woche."},"wizard.weather.heading":{it:"Logica meteo",en:"Weather logic",fr:"Logique météo",de:"Wetterlogik"},"wizard.weather.hint":{it:"Vuoi che il meteo locale modifichi automaticamente questa programmazione?",en:"Should local weather automatically affect this schedule?",fr:"La météo locale doit-elle modifier automatiquement cette planification ?",de:"Soll das lokale Wetter diesen Zeitplan automatisch anpassen?"},"wizard.weather.yes":{it:"Sì, abilita",en:"Yes, enable",fr:"Oui, activer",de:"Ja, aktivieren"},"wizard.weather.yes.desc":{it:"Suggeriremo regole utili in base al tipo di dispositivo",en:"We'll suggest useful rules based on the device type",fr:"Des règles utiles seront suggérées selon le type d'appareil",de:"Nützliche Regeln werden je nach Gerätetyp vorgeschlagen"},"wizard.weather.no":{it:"No, solo orari",en:"No, time-based only",fr:"Non, juste les horaires",de:"Nein, nur zeitbasiert"},"wizard.weather.no.desc":{it:"Esecuzione fissa indipendente dal meteo",en:"Fixed execution regardless of weather",fr:"Exécution fixe indépendante de la météo",de:"Feste Ausführung unabhängig vom Wetter"},"wizard.review.heading":{it:"Riepilogo",en:"Review",fr:"Résumé",de:"Zusammenfassung"},"wizard.review.devices":{it:"{n} selezionati",en:"{n} selected",fr:"{n} sélectionnés",de:"{n} ausgewählt"},"wizard.review.weather_on":{it:"Abilitata",en:"Enabled",fr:"Activée",de:"Aktiviert"},"wizard.review.weather_off":{it:"Disabilitata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"wizard.review.note":{it:"Potrai modificare ogni dettaglio dall'editor dopo la creazione.",en:"You'll be able to edit every detail after creation.",fr:"Tu pourras modifier chaque détail après la création.",de:"Nach der Erstellung kannst du alle Details bearbeiten."},"wizard.create":{it:"Crea schedulazione",en:"Create schedule",fr:"Créer la planification",de:"Zeitplan erstellen"},"devices.subtitle":{it:"Entità di Home Assistant importate · {n} dispositivi controllati",en:"Imported Home Assistant entities · {n} devices controlled",fr:"Entités Home Assistant importées · {n} appareils contrôlés",de:"Importierte Home-Assistant-Entitäten · {n} gesteuerte Geräte"},"devices.add_entity":{it:"Aggiungi entità",en:"Add entity",fr:"Ajouter une entité",de:"Entität hinzufügen"},"devices.empty.title":{it:"Nessun dispositivo importato",en:"No devices imported",fr:"Aucun appareil importé",de:"Keine Geräte importiert"},"devices.empty.hint":{it:"Aggiungi le tue prime entità HA per iniziare.",en:"Add your first HA entities to get started.",fr:"Ajoute tes premières entités HA pour commencer.",de:"Füge deine ersten HA-Entitäten hinzu, um zu starten."},"devices.types_hint":{it:"Tipo e capabilities vengono dedotti automaticamente dal dominio dell'entità HA (es. climate.* → termostato).",en:"Type and capabilities are auto-detected from the HA entity domain (e.g. climate.* → thermostat).",fr:"Le type et les capacités sont déduits automatiquement du domaine de l'entité HA (ex. climate.* → thermostat).",de:"Typ und Fähigkeiten werden automatisch aus der HA-Entitätsdomäne abgeleitet (z. B. climate.* → Thermostat)."},"devices.alias":{it:"Alias",en:"Alias",fr:"Alias",de:"Alias"},"devices.alias.placeholder":{it:"Alias (opzionale)",en:"Alias (optional)",fr:"Alias (facultatif)",de:"Alias (optional)"},"devices.import":{it:"Importa",en:"Import",fr:"Importer",de:"Importieren"},"devices.unlink":{it:"Sgancia",en:"Unlink",fr:"Détacher",de:"Trennen"},"devices.picker.title":{it:"Aggiungi entità HA",en:"Add HA entity",fr:"Ajouter une entité HA",de:"HA-Entität hinzufügen"},"devices.picker.count":{it:"{n} entità disponibili nel tuo Home Assistant",en:"{n} entities available in your Home Assistant",fr:"{n} entités disponibles dans ton Home Assistant",de:"{n} Entitäten in deinem Home Assistant verfügbar"},"devices.picker.search":{it:"Cerca per nome o entity_id…",en:"Search by name or entity_id…",fr:"Recherche par nom ou entity_id…",de:"Suche nach Name oder entity_id…"},"devices.picker.all_imported":{it:"Tutto importato",en:"All imported",fr:"Tout importé",de:"Alles importiert"},"devices.picker.all_imported.hint":{it:"Tutte le entità disponibili sono già state aggiunte.",en:"All available entities have already been added.",fr:"Toutes les entités disponibles ont déjà été ajoutées.",de:"Alle verfügbaren Entitäten wurden bereits hinzugefügt."},"settings.subtitle":{it:"Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni",en:"Global Chronos integration settings · apply to all schedules",fr:"Paramètres globaux de l'intégration Chronos · valables pour toutes les planifications",de:"Globale Chronos-Einstellungen · gelten für alle Zeitpläne"},"settings.weather.title":{it:"Sorgente meteo",en:"Weather source",fr:"Source météo",de:"Wetterquelle"},"settings.weather.subtitle":{it:"Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)",en:"HA entity used to evaluate weather rules · you can also map specific attributes to point sensors (local weather station, Ecowitt, …)",fr:"Entité HA utilisée pour évaluer les règles météo · tu peux aussi mapper des attributs spécifiques à des capteurs ponctuels (station météo locale, Ecowitt, …)",de:"HA-Entität zur Auswertung der Wetterregeln · einzelne Attribute können auch auf Punktsensoren gemappt werden (lokale Wetterstation, Ecowitt, …)"},"settings.weather.entity":{it:"Entità meteo principale",en:"Main weather entity",fr:"Entité météo principale",de:"Haupt-Wetterentität"},"settings.weather.entity.hint":{it:"Usata per le forecast.* e come fallback se nessun override è impostato qui sotto",en:"Used for forecast.* and as a fallback if no override is set below",fr:"Utilisée pour forecast.* et comme repli si aucun remplacement n'est défini ci-dessous",de:"Wird für forecast.* und als Fallback verwendet, wenn unten keine Überschreibung gesetzt ist"},"settings.weather.overrides.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibung"},"settings.weather.overrides.hint":{it:"Per ogni attributo puoi specificare un'entità sensor.* da cui leggere il valore. Se vuoto, viene letto dall'entità weather principale.",en:"For each attribute you can specify a sensor.* entity to read from. If empty, the value is read from the main weather entity.",fr:"Pour chaque attribut, tu peux spécifier une entité sensor.* à lire. Si vide, la valeur est lue depuis l'entité météo principale.",de:"Für jedes Attribut kannst du eine sensor.*-Entität angeben. Leer = Wert wird aus der Haupt-Wetterentität gelesen."},"settings.weather.overrides.use_main":{it:"— usa entità weather —",en:"— use weather entity —",fr:"— utiliser l'entité météo —",de:"— Wetterentität verwenden —"},"settings.weather.overrides.suggested":{it:"suggeriti",en:"suggested",fr:"suggérés",de:"empfohlen"},"settings.weather.overrides.others":{it:"Altri sensori",en:"Other sensors",fr:"Autres capteurs",de:"Weitere Sensoren"},"settings.weather.overrides.no_sensors":{it:"Nessun sensor.* o binary_sensor.* esposto in questo Home Assistant. Verifica di aver esposto le entità necessarie.",en:"No sensor.* or binary_sensor.* entities exposed in this Home Assistant. Make sure the entities you need are exposed.",fr:"Aucune entité sensor.* ou binary_sensor.* n'est exposée dans ce Home Assistant. Vérifie que les entités nécessaires sont exposées.",de:"Keine sensor.*- oder binary_sensor.*-Entitäten in diesem Home Assistant verfügbar. Stelle sicher, dass die benötigten Entitäten freigegeben sind."},"settings.weather.overrides.warn.unit_mismatch":{it:"Unità non compatibile: questo attributo si aspetta {expected}, il sensore espone {got}. Le regole potrebbero confrontare valori sbagliati.",en:"Unit mismatch: this attribute expects {expected}, the sensor reports {got}. Rules may compare wrong values.",fr:"Unités incompatibles : cet attribut attend {expected}, le capteur renvoie {got}. Les règles risquent de comparer des valeurs erronées.",de:"Einheit passt nicht: dieses Attribut erwartet {expected}, der Sensor liefert {got}. Regeln vergleichen evtl. falsche Werte."},"settings.weather.overrides.warn.class_mismatch":{it:"Tipo sensore diverso da quello atteso: atteso {expected}, ricevuto {got}. Verifica che sia la grandezza corretta.",en:"Sensor type differs from expected: expected {expected}, got {got}. Make sure it's the right quantity.",fr:"Type de capteur différent : attendu {expected}, reçu {got}. Vérifie qu'il s'agit de la bonne grandeur.",de:"Sensortyp weicht ab: erwartet {expected}, erhalten {got}. Prüfe, ob es die richtige Größe ist."},"settings.weather.overrides.warn.not_numeric":{it:'Stato attuale non numerico: "{state}". Questo attributo richiede un sensore numerico.',en:'Current state is not numeric: "{state}". This attribute requires a numeric sensor.',fr:"L'état actuel n'est pas numérique : \"{state}\". Cet attribut nécessite un capteur numérique.",de:'Aktueller Wert ist nicht numerisch: „{state}". Dieses Attribut erfordert einen numerischen Sensor.'},"settings.weather.overrides.warn.numeric_for_condition":{it:'L\'attributo condition richiede un sensore testuale (es. "sunny", "rainy"). Questo sensore espone un numero ("{state}").',en:'The condition attribute needs a text sensor (e.g. "sunny", "rainy"). This sensor reports a number ("{state}").',fr:'L\'attribut condition attend un capteur texte (ex. "sunny", "rainy"). Ce capteur renvoie un nombre ("{state}").',de:'Das Attribut „condition" erwartet einen Textsensor (z. B. „sunny", „rainy"). Dieser Sensor liefert eine Zahl („{state}").'},"settings.behavior.title":{it:"Comportamento esecuzione",en:"Execution behavior",fr:"Comportement d'exécution",de:"Ausführungsverhalten"},"settings.behavior.subtitle":{it:"Frequenza di aggiornamento e granularità",en:"Update frequency and granularity",fr:"Fréquence de mise à jour et granularité",de:"Aktualisierungsfrequenz und Granularität"},"settings.polling":{it:"Polling meteo",en:"Weather polling",fr:"Sondage météo",de:"Wetter-Abfrage"},"settings.polling.hint":{it:"Ogni quanto rivalutare le regole",en:"How often rules are re-evaluated",fr:"Fréquence de réévaluation des règles",de:"Intervall zur Neuberechnung der Regeln"},"settings.snap":{it:"Snap timeline",en:"Timeline snap",fr:"Pas de la timeline",de:"Timeline-Raster"},"settings.snap.hint":{it:"Granularità nel disegnare le fasce",en:"Granularity when drawing blocks",fr:"Granularité lors du tracé des créneaux",de:"Granularität beim Zeichnen der Blöcke"},"settings.notify.title":{it:"Notifiche",en:"Notifications",fr:"Notifications",de:"Benachrichtigungen"},"settings.notify.subtitle":{it:"Eventi che vogliono una notifica HA",en:"Events that want an HA notification",fr:"Événements qui déclenchent une notification HA",de:"Ereignisse, die eine HA-Benachrichtigung auslösen"},"settings.notify.block_executed":{it:"Fascia eseguita",en:"Block executed",fr:"Créneau exécuté",de:"Block ausgeführt"},"settings.notify.block_executed.desc":{it:"Quando il sistema avvia un comando per una fascia oraria",en:"When the system fires a command for a time block",fr:"Quand le système déclenche une commande pour un créneau",de:"Wenn das System einen Befehl für einen Zeitblock auslöst"},"settings.notify.rule_triggered":{it:"Regola meteo attivata",en:"Weather rule triggered",fr:"Règle météo déclenchée",de:"Wetterregel ausgelöst"},"settings.notify.rule_triggered.desc":{it:"Quando una regola override entra in azione",en:"When an override rule kicks in",fr:"Quand une règle de remplacement s'active",de:"Wenn eine Überschreibungsregel greift"},"settings.notify.sched_skipped":{it:"Schedulazione saltata",en:"Schedule skipped",fr:"Planification ignorée",de:"Zeitplan übersprungen"},"settings.notify.sched_skipped.desc":{it:"Quando una fascia viene skippata per condizioni meteo",en:"When a block is skipped due to weather conditions",fr:"Quand un créneau est ignoré pour cause de météo",de:"Wenn ein Block aufgrund von Wetterbedingungen übersprungen wird"},"settings.notify.command_error":{it:"Errore comando",en:"Command error",fr:"Erreur de commande",de:"Befehlsfehler"},"settings.notify.command_error.desc":{it:"Se un dispositivo non risponde",en:"If a device fails to respond",fr:"Si un appareil ne répond pas",de:"Wenn ein Gerät nicht antwortet"},"settings.appearance.title":{it:"Aspetto",en:"Appearance",fr:"Apparence",de:"Erscheinungsbild"},"settings.appearance.subtitle":{it:"Densità di visualizzazione predefinita",en:"Default visual density",fr:"Densité d'affichage par défaut",de:"Standardanzeigedichte"},"settings.appearance.theme_hint":{it:"Il tema (chiaro/scuro) segue automaticamente Home Assistant. Usa l'icona luna/sole nel topbar per cambiarlo a livello HA.",en:"Theme (light/dark) automatically follows Home Assistant. Use the moon/sun icon in the topbar to switch HA-wide.",fr:"Le thème (clair/sombre) suit automatiquement Home Assistant. Utilise l'icône lune/soleil dans la barre supérieure.",de:"Das Theme (hell/dunkel) folgt automatisch Home Assistant. Nutze das Mond/Sonne-Symbol in der Topbar."},"settings.theme":{it:"Tema",en:"Theme",fr:"Thème",de:"Theme"},"settings.theme.light":{it:"Chiaro",en:"Light",fr:"Clair",de:"Hell"},"settings.theme.dark":{it:"Scuro",en:"Dark",fr:"Sombre",de:"Dunkel"},"settings.theme.auto":{it:"Auto",en:"Auto",fr:"Auto",de:"Auto"},"settings.density":{it:"Densità",en:"Density",fr:"Densité",de:"Dichte"},"settings.density.comfortable":{it:"Comoda",en:"Comfortable",fr:"Confortable",de:"Komfortabel"},"settings.density.compact":{it:"Compatta",en:"Compact",fr:"Compact",de:"Kompakt"},"settings.timeline_default.title":{it:"Timeline predefinita",en:"Default timeline",fr:"Timeline par défaut",de:"Standard-Timeline"},"settings.timeline_default.subtitle":{it:"Quale variante mostrare di default nell'editor",en:"Which variant to show by default in the editor",fr:"Quelle variante afficher par défaut dans l'éditeur",de:"Welche Variante im Editor standardmäßig angezeigt wird"},"settings.colors.title":{it:"Colori dispositivi",en:"Device colors",fr:"Couleurs des appareils",de:"Gerätefarben"},"settings.colors.subtitle":{it:"L'accent del dispositivo riflette il suo stato corrente",en:"The device accent reflects its current state",fr:"L'accent de l'appareil reflète son état actuel",de:"Die Akzentfarbe des Geräts spiegelt seinen aktuellen Zustand wider"},"settings.colors.lights.title":{it:"Luci · usa colore reale da Home Assistant",en:"Lights · use real color from Home Assistant",fr:"Lumières · utiliser la couleur réelle de Home Assistant",de:"Lichter · echte Farbe aus Home Assistant verwenden"},"settings.colors.lights.desc":{it:"Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.",en:"When on, the light icon reflects the current RGB color. Otherwise uses soft yellow.",fr:"Si activé, l'icône de la lumière reflète la couleur RGB actuelle. Sinon utilise un jaune doux.",de:"Wenn aktiv, spiegelt das Lichtsymbol die aktuelle RGB-Farbe wider. Sonst weiches Gelb."},"settings.colors.thermostat.title":{it:"Termostati · gradiente temperatura",en:"Thermostats · temperature gradient",fr:"Thermostats · dégradé de température",de:"Thermostate · Temperaturverlauf"},"settings.colors.thermostat.desc":{it:"Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.",en:"Threshold ≤ → color. Values above the last threshold use the last color.",fr:"Seuil ≤ → couleur. Au-delà du dernier seuil, la dernière couleur est utilisée.",de:"Schwelle ≤ → Farbe. Werte über der letzten Schwelle nutzen die letzte Farbe."},"settings.colors.boiler.title":{it:"Boiler · gradiente temperatura",en:"Water heater · temperature gradient",fr:"Chauffe-eau · dégradé de température",de:"Boiler · Temperaturverlauf"},"settings.colors.boiler.desc":{it:"Stessa logica del termostato, range tipico 30-75°C.",en:"Same logic as the thermostat, typical range 30-75°C.",fr:"Même logique que le thermostat, plage typique 30-75°C.",de:"Gleiche Logik wie Thermostat, typischer Bereich 30-75 °C."},"settings.colors.preset.title":{it:"Preset modalità (climate)",en:"Climate preset modes",fr:"Préréglages climate",de:"Climate-Presets"},"settings.colors.preset.desc":{it:"Override del colore quando il termostato è in un preset specifico",en:"Color override when the thermostat is in a specific preset",fr:"Surcharge de couleur quand le thermostat est dans un préréglage spécifique",de:"Farb-Überschreibung, wenn das Thermostat in einem bestimmten Preset ist"},"settings.colors.add_stop":{it:"Stop",en:"Stop",fr:"Palier",de:"Stopp"},"settings.colors.remove_stop":{it:"Rimuovi",en:"Remove",fr:"Retirer",de:"Entfernen"},"settings.language.title":{it:"Lingua",en:"Language",fr:"Langue",de:"Sprache"},"settings.language.subtitle":{it:"Lingua dell'interfaccia Chronos",en:"Chronos UI language",fr:"Langue de l'interface Chronos",de:"Sprache der Chronos-Oberfläche"},"settings.language.auto":{it:"Auto (segui Home Assistant)",en:"Auto (follow Home Assistant)",fr:"Auto (suit Home Assistant)",de:"Auto (Home Assistant folgen)"},"live.weather.title":{it:"Meteo locale",en:"Local weather",fr:"Météo locale",de:"Lokales Wetter"},"live.weather.subtitle":{it:"Sorgente: {entity}",en:"Source: {entity}",fr:"Source : {entity}",de:"Quelle: {entity}"},"live.no_weather":{it:"Nessuna sorgente meteo configurata · vai in Impostazioni",en:"No weather source configured · go to Settings",fr:"Aucune source météo configurée · va dans Réglages",de:"Keine Wetterquelle konfiguriert · siehe Einstellungen"},"live.forecast.title":{it:"Forecast 24h",en:"24h forecast",fr:"Prévisions 24 h",de:"24-h-Vorhersage"},"live.schedules.title":{it:"Schedulazioni · stato live",en:"Schedules · live status",fr:"Planifications · état en direct",de:"Zeitpläne · Live-Status"},"live.devices.title":{it:"Dispositivi · stato live",en:"Devices · live status",fr:"Appareils · état en direct",de:"Geräte · Live-Status"},"live.devices.subtitle":{it:"Valori in tempo reale",en:"Real-time values",fr:"Valeurs en temps réel",de:"Echtzeitwerte"},"live.condition.sunny":{it:"Soleggiato",en:"Sunny",fr:"Ensoleillé",de:"Sonnig"},"live.condition.rainy":{it:"Pioggia",en:"Rainy",fr:"Pluvieux",de:"Regnerisch"},"live.condition.cloudy":{it:"Nuvoloso",en:"Cloudy",fr:"Nuageux",de:"Bewölkt"},"live.condition.partlycloudy":{it:"Parzialmente nuvoloso",en:"Partly cloudy",fr:"Partiellement nuageux",de:"Teilweise bewölkt"},"live.condition.snowy":{it:"Neve",en:"Snowy",fr:"Neige",de:"Schnee"},"live.condition.fog":{it:"Nebbia",en:"Fog",fr:"Brouillard",de:"Nebel"},"live.condition.windy":{it:"Ventoso",en:"Windy",fr:"Venteux",de:"Windig"},"week.subtitle":{it:"Vista a 7 giorni · {n} schedulazioni attive",en:"7-day view · {n} active schedules",fr:"Vue 7 jours · {n} planifications actives",de:"7-Tage-Ansicht · {n} aktive Zeitpläne"},"week.legend":{it:"Legenda",en:"Legend",fr:"Légende",de:"Legende"},"week.today":{it:"Oggi",en:"Today",fr:"Aujourd'hui",de:"Heute"},"device.state":{it:"Stato attuale",en:"Current state",fr:"État actuel",de:"Aktueller Zustand"},"device.state.live":{it:"aggiornato live",en:"live updates",fr:"mises à jour en direct",de:"Live-Aktualisierung"},"device.type":{it:"Tipo dispositivo",en:"Device type",fr:"Type d'appareil",de:"Gerätetyp"},"device.linked_schedules":{it:"Schedule collegate",en:"Linked schedules",fr:"Planifications associées",de:"Verknüpfte Zeitpläne"},"device.linked_schedules.active":{it:"{n} attive",en:"{n} active",fr:"{n} actives",de:"{n} aktiv"},"device.capabilities":{it:"Capabilities rilevate",en:"Detected capabilities",fr:"Capacités détectées",de:"Erkannte Fähigkeiten"},"device.capabilities.subtitle":{it:"Servizi HA chiamabili su questo dispositivo",en:"HA services callable on this device",fr:"Services HA disponibles pour cet appareil",de:"Auf diesem Gerät aufrufbare HA-Dienste"},"device.schedules_using.title":{it:"Schedulazioni che usano questo dispositivo",en:"Schedules using this device",fr:"Planifications qui utilisent cet appareil",de:"Zeitpläne, die dieses Gerät verwenden"},"device.schedules_using.subtitle":{it:"{n} programmazioni collegate",en:"{n} linked schedules",fr:"{n} planifications liées",de:"{n} verknüpfte Zeitpläne"},"device.no_schedules":{it:"Nessuna programmazione",en:"No schedules",fr:"Aucune planification",de:"Keine Zeitpläne"},"device.no_schedules.hint":{it:"Questo dispositivo non è incluso in nessuno schedule.",en:"This device is not included in any schedule.",fr:"Cet appareil n'est inclus dans aucune planification.",de:"Dieses Gerät ist in keinem Zeitplan enthalten."},"device.no_device.title":{it:"Nessun dispositivo",en:"No device",fr:"Aucun appareil",de:"Kein Gerät"},"device.no_device.hint":{it:"Importa prima un'entità HA.",en:"Import an HA entity first.",fr:"Importe d'abord une entité HA.",de:"Importiere zuerst eine HA-Entität."},"device.open_schedule":{it:"Apri",en:"Open",fr:"Ouvrir",de:"Öffnen"},"wr.heading":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"wr.subtitle":{it:"Costruisci una condizione IF/THEN. Verrà valutata ad ogni transizione di fascia.",en:"Build an IF/THEN condition. It is evaluated on every block transition.",fr:"Construis une condition SI/ALORS. Évaluée à chaque transition de créneau.",de:"Erstelle eine WENN/DANN-Bedingung. Wird bei jedem Blockwechsel ausgewertet."},"wr.if.title":{it:"Condizione · quando",en:"Condition · when",fr:"Condition · quand",de:"Bedingung · wann"},"wr.if.subtitle":{it:"Cosa deve essere vero per attivare la regola",en:"What must be true for the rule to fire",fr:"Ce qui doit être vrai pour déclencher la règle",de:"Was wahr sein muss, damit die Regel auslöst"},"wr.var":{it:"Variabile meteo",en:"Weather variable",fr:"Variable météo",de:"Wettervariable"},"wr.op":{it:"Operatore",en:"Operator",fr:"Opérateur",de:"Operator"},"wr.threshold":{it:"Soglia",en:"Threshold",fr:"Seuil",de:"Schwelle"},"wr.then.title":{it:"Azione · cosa fare",en:"Action · what to do",fr:"Action · que faire",de:"Aktion · was tun"},"wr.then.subtitle":{it:"L'effetto sulla fascia oraria attiva",en:"Effect on the active time block",fr:"Effet sur le créneau horaire actif",de:"Auswirkung auf den aktiven Zeitblock"},"wr.action.skip":{it:"Salta esecuzione",en:"Skip execution",fr:"Sauter l'exécution",de:"Ausführung überspringen"},"wr.action.skip.desc":{it:"La fascia non viene eseguita",en:"The block is not executed",fr:"Le créneau n'est pas exécuté",de:"Der Block wird nicht ausgeführt"},"wr.action.shift":{it:"Trasla orario",en:"Shift time",fr:"Décaler l'horaire",de:"Zeit verschieben"},"wr.action.shift.desc":{it:"Sposta l'inizio di X ore",en:"Move the start by X hours",fr:"Décale le début de X heures",de:"Verschiebt den Start um X Stunden"},"wr.action.force":{it:"Forza azione",en:"Force action",fr:"Forcer une action",de:"Aktion erzwingen"},"wr.action.force.desc":{it:"Esegue un'azione specifica",en:"Run a specific action",fr:"Exécute une action spécifique",de:"Führt eine bestimmte Aktion aus"},"wr.action.duration":{it:"Cambia durata",en:"Change duration",fr:"Changer la durée",de:"Dauer ändern"},"wr.action.duration.desc":{it:"Estende o accorcia la fascia",en:"Extend or shorten the block",fr:"Allonge ou raccourcit le créneau",de:"Verlängert oder kürzt den Block"},"wr.fire_mode.label":{it:"Frequenza di attivazione",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"wr.fire_mode.hint":{it:"Quanto spesso la regola può attivarsi quando la condizione è vera",en:"How often the rule can fire when the condition is true",fr:"Fréquence de déclenchement quand la condition est vraie",de:"Wie oft die Regel auslösen kann, wenn die Bedingung wahr ist"},"wr.fire_mode.every":{it:"Ogni transizione (sconsigliato per oscillazioni)",en:"Every transition (not recommended for oscillating values)",fr:"À chaque transition (déconseillé pour valeurs oscillantes)",de:"Jede Transition (nicht empfohlen für schwankende Werte)"},"wr.fire_mode.once_per_day":{it:"Una volta al giorno (riarma a mezzanotte)",en:"Once per day (re-arms at midnight)",fr:"Une fois par jour (réarme à minuit)",de:"Einmal pro Tag (bewaffnet sich um Mitternacht neu)"},"wr.fire_mode.once_per_daytime":{it:"Una volta tra alba e tramonto",en:"Once between sunrise and sunset",fr:"Une fois entre lever et coucher du soleil",de:"Einmal zwischen Sonnenaufgang und -untergang"},"wr.fire_mode.once_per_nighttime":{it:"Una volta tra tramonto e alba",en:"Once between sunset and sunrise",fr:"Une fois entre coucher et lever du soleil",de:"Einmal zwischen Sonnenuntergang und -aufgang"},"wr.preview":{it:"Preview",en:"Preview",fr:"Aperçu",de:"Vorschau"},"wr.preview.subtitle":{it:"Come si comporta sulla schedulazione corrente",en:"How it behaves on the current schedule",fr:"Comment elle se comporte sur la planification actuelle",de:"Wie sich die Regel auf den aktuellen Zeitplan auswirkt"},"schedule.active":{it:"Attiva",en:"Active",fr:"Active",de:"Aktiv"},"schedule.disabled":{it:"Disattivata",en:"Disabled",fr:"Désactivée",de:"Deaktiviert"},"schedule.next_block":{it:"Prossima fascia",en:"Next block",fr:"Prochain créneau",de:"Nächster Block"},"schedule.now_block":{it:"Fascia attuale",en:"Current block",fr:"Créneau actuel",de:"Aktueller Block"},"schedule.no_blocks":{it:"Nessuna fascia",en:"No blocks",fr:"Aucun créneau",de:"Keine Blöcke"},"schedule.every_day":{it:"Ogni giorno",en:"Every day",fr:"Tous les jours",de:"Jeden Tag"},"days.short.0":{it:"Lun",en:"Mon",fr:"Lun",de:"Mo"},"days.short.1":{it:"Mar",en:"Tue",fr:"Mar",de:"Di"},"days.short.2":{it:"Mer",en:"Wed",fr:"Mer",de:"Mi"},"days.short.3":{it:"Gio",en:"Thu",fr:"Jeu",de:"Do"},"days.short.4":{it:"Ven",en:"Fri",fr:"Ven",de:"Fr"},"days.short.5":{it:"Sab",en:"Sat",fr:"Sam",de:"Sa"},"days.short.6":{it:"Dom",en:"Sun",fr:"Dim",de:"So"},"timeline.linear":{it:"Lineare",en:"Linear",fr:"Linéaire",de:"Linear"},"timeline.radial":{it:"Radiale",en:"Radial",fr:"Radial",de:"Radial"},"timeline.list":{it:"Lista",en:"List",fr:"Liste",de:"Liste"},"help.title":{it:"Guida e ricette",en:"Help and recipes",fr:"Aide et recettes",de:"Hilfe und Rezepte"},"help.subtitle":{it:"Esempi pratici di schedulazioni comuni — clicca per crearle e personalizzarle",en:"Practical examples of common schedules — click to create and customise",fr:"Exemples pratiques de planifications courantes — cliquez pour créer et personnaliser",de:"Praktische Beispiele für häufige Zeitpläne — klicken zum Erstellen und Anpassen"},"help.intro.title":{it:"Come funziona Chronos",en:"How Chronos works",fr:"Comment fonctionne Chronos",de:"Wie Chronos funktioniert"},"help.intro.body":{it:"Crea schedulazioni con fasce orarie giornaliere. Ogni fascia esegue un'azione (es. set_temperature 21°C). Aggiungi regole meteo che possono saltare la fascia, modificarne durata o forzare un'altra azione in base a sensori esterni o condizioni del sole. Le fasce possono essere ancorate ad alba/tramonto per adattarsi alle stagioni automaticamente.",en:"Create schedules with daily time blocks. Each block runs an action (e.g. set_temperature 21°C). Add weather rules that can skip the block, change its duration, or force a different action based on external sensors or sun position. Blocks can be anchored to sunrise/sunset so they follow seasonal change automatically.",fr:"Créez des planifications avec des créneaux horaires quotidiens. Chaque créneau exécute une action (ex. set_temperature 21°C). Ajoutez des règles météo qui peuvent ignorer le créneau, modifier sa durée ou forcer une autre action selon des capteurs externes ou la position du soleil. Les créneaux peuvent être ancrés au lever/coucher du soleil pour suivre les saisons automatiquement.",de:"Erstelle Zeitpläne mit täglichen Zeitblöcken. Jeder Block führt eine Aktion aus (z.B. set_temperature 21°C). Füge Wetterregeln hinzu, die den Block überspringen, seine Dauer ändern oder eine andere Aktion basierend auf externen Sensoren oder dem Sonnenstand erzwingen können. Blöcke können an Sonnenaufgang/-untergang verankert werden, um sich automatisch an die Jahreszeit anzupassen."},"help.create_button":{it:"Crea questa schedulazione",en:"Create this schedule",fr:"Créer cette planification",de:"Diesen Zeitplan erstellen"},"help.tag.anchored":{it:"Ancorata al sole",en:"Sun-anchored",fr:"Ancrée au soleil",de:"Sonnen-verankert"},"help.tag.trigger":{it:"Trigger meteo",en:"Weather trigger",fr:"Déclencheur météo",de:"Wetter-Trigger"},"recipe.thermostat_day_night.title":{it:"Riscaldamento giorno/notte",en:"Day/night heating",fr:"Chauffage jour/nuit",de:"Tag/Nacht-Heizung"},"recipe.thermostat_day_night.when":{it:"Termostato che alterna 18°C la notte e 21°C il giorno",en:"Thermostat alternating 18°C at night and 21°C during the day",fr:"Thermostat alternant 18°C la nuit et 21°C le jour",de:"Thermostat: 18°C nachts, 21°C tagsüber"},"recipe.thermostat_day_night.howto":{it:"Tre fasce: 00-07 e 22-24 → 18°C (eco notturno), 07-22 → 21°C (comfort). Regola meteo: se la temperatura esterna supera 22°C la fascia viene saltata (non scalda inutilmente nelle giornate calde).",en:"Three blocks: 00-07 and 22-24 → 18°C (night eco), 07-22 → 21°C (comfort). Weather rule: if outdoor temperature exceeds 22°C the block is skipped (no needless heating on warm days).",fr:"Trois créneaux : 00-07 et 22-24 → 18°C (éco nuit), 07-22 → 21°C (confort). Règle météo : si la température extérieure dépasse 22°C le créneau est ignoré.",de:"Drei Blöcke: 00-07 und 22-24 → 18°C (Nacht-Eco), 07-22 → 21°C (Komfort). Wetterregel: bei Außentemperatur über 22°C wird der Block übersprungen."},"recipe.thermostat_day_night.preset_name":{it:"Riscaldamento casa",en:"Home heating",fr:"Chauffage maison",de:"Hausheizung"},"recipe.lights_at_sunset.title":{it:"Luci al tramonto",en:"Lights at sunset",fr:"Lumières au coucher du soleil",de:"Licht bei Sonnenuntergang"},"recipe.lights_at_sunset.when":{it:"Accensione 30 minuti prima del tramonto, fino alle 23",en:"Turn on 30 minutes before sunset, until 23:00",fr:"Allumage 30 minutes avant le coucher, jusqu'à 23h",de:"Einschalten 30 Min. vor Sonnenuntergang, bis 23 Uhr"},"recipe.lights_at_sunset.howto":{it:"Una fascia ancorata al tramonto con offset -30 minuti, fine fissa alle 23:00. Luce all'80% di luminosità. La fascia si sposta da sola di stagione in stagione (in inverno parte alle 16:30, in estate alle 20:00).",en:"One block anchored to sunset with -30 minute offset, fixed end at 23:00. Light at 80% brightness. The block shifts seasonally on its own (16:30 in winter, 20:00 in summer).",fr:"Un créneau ancré au coucher du soleil avec un décalage de -30 minutes, fin fixe à 23h. Lumière à 80% de luminosité. Le créneau se décale automatiquement selon la saison.",de:"Ein Block, am Sonnenuntergang verankert mit -30 Min. Versatz, festes Ende um 23 Uhr. Licht bei 80% Helligkeit. Der Block verschiebt sich automatisch je nach Jahreszeit."},"recipe.lights_at_sunset.preset_name":{it:"Luci serali",en:"Evening lights",fr:"Lumières du soir",de:"Abendliche Beleuchtung"},"recipe.blinds_wind_safety.title":{it:"Tapparelle automatiche col vento",en:"Wind-safe automatic blinds",fr:"Volets sécurité vent",de:"Windschutz für Rollladen"},"recipe.blinds_wind_safety.when":{it:"Tapparelle aperte di giorno, chiudono se il vento supera 30 km/h",en:"Blinds open during daytime, close if wind exceeds 30 km/h",fr:"Volets ouverts le jour, fermés si le vent dépasse 30 km/h",de:"Rollladen tagsüber offen, schließen bei Wind über 30 km/h"},"recipe.blinds_wind_safety.howto":{it:"Una fascia da alba a tramonto, posizione 100% (aperta). Regola meteo trigger: se vento > 30 km/h forza la chiusura, una sola volta tra alba e tramonto. Senza il rate-limit le tapparelle sbatterebbero ad ogni raffica.",en:"One block from sunrise to sunset, position 100% (open). Trigger weather rule: if wind > 30 km/h force close, at most once between sunrise and sunset. Without rate-limiting the blinds would flap on every gust.",fr:"Un créneau du lever au coucher du soleil, position 100% (ouvert). Règle déclencheur météo : si vent > 30 km/h forcer la fermeture, au plus une fois entre lever et coucher. Sans limitation, les volets battraient à chaque rafale.",de:"Ein Block von Sonnenauf- bis -untergang, Position 100% (offen). Wetter-Trigger: bei Wind > 30 km/h Schließen erzwingen, höchstens einmal zwischen Auf- und Untergang. Ohne Rate-Limiting würden die Rollladen bei jeder Böe schlagen."},"recipe.blinds_wind_safety.preset_name":{it:"Tapparelle giorno",en:"Daytime blinds",fr:"Volets jour",de:"Tagesrollladen"},"recipe.irrigation_skip_rain.title":{it:"Irrigazione mattutina con skip pioggia",en:"Morning irrigation with rain skip",fr:"Irrigation matinale avec saut pluie",de:"Morgendliche Bewässerung mit Regen-Skip"},"recipe.irrigation_skip_rain.when":{it:"30 minuti di irrigazione alle 6, saltati se la previsione indica pioggia",en:"30 minutes of irrigation at 06:00, skipped if forecast says rain",fr:"30 min d'irrigation à 6h, ignoré si pluie prévue",de:"30 Min. Bewässerung um 6 Uhr, übersprungen bei Regenvorhersage"},"recipe.irrigation_skip_rain.howto":{it:"Una fascia 06:00 → 06:30 con turn_on durata 30 minuti. Regola meteo: se la pioggia prevista nelle prossime 6 ore supera 2 mm la fascia viene saltata. Risparmia acqua nei giorni di pioggia.",en:"One block 06:00 → 06:30 with turn_on duration 30 min. Weather rule: if forecast rain in the next 6 hours exceeds 2 mm the block is skipped. Saves water on rainy days.",fr:"Un créneau 06h00 → 06h30, turn_on durée 30 min. Règle météo : si la pluie prévue dans les 6 prochaines heures dépasse 2 mm, le créneau est ignoré. Économise l'eau les jours de pluie.",de:"Ein Block 06:00 → 06:30, turn_on Dauer 30 Min. Wetterregel: bei Regenvorhersage > 2 mm in den nächsten 6 Std. wird der Block übersprungen. Spart Wasser an Regentagen."},"recipe.irrigation_skip_rain.preset_name":{it:"Irrigazione giardino",en:"Garden irrigation",fr:"Irrigation jardin",de:"Gartenbewässerung"},"recipe.boiler_eco_night.title":{it:"Boiler ECO notturno",en:"Night-ECO water heater",fr:"Chauffe-eau ECO nuit",de:"Nacht-ECO-Boiler"},"recipe.boiler_eco_night.when":{it:"Modalità electric durante il giorno, eco di notte per risparmiare",en:"Electric during the day, eco at night to save energy",fr:"Mode electric le jour, eco la nuit pour économiser",de:"Tagsüber electric, nachts eco zum Energie sparen"},"recipe.boiler_eco_night.howto":{it:"Tre fasce: 00-06 ECO, 06-23 electric, 23-24 ECO. Riduce i consumi nelle ore di non utilizzo. Aggiungi una regola meteo per saltare la fascia electric se la temperatura esterna è già alta.",en:"Three blocks: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduces consumption during unused hours. Add a weather rule to skip the electric block when outside temperature is already high.",fr:"Trois créneaux : 00-06 ECO, 06-23 electric, 23-24 ECO. Réduit la consommation aux heures non utilisées. Ajoute une règle météo pour ignorer le créneau electric si la température extérieure est élevée.",de:"Drei Blöcke: 00-06 ECO, 06-23 electric, 23-24 ECO. Reduziert Verbrauch in ungenutzten Zeiten. Füge eine Wetterregel hinzu, um den electric-Block bei hoher Außentemperatur zu überspringen."},"recipe.boiler_eco_night.preset_name":{it:"Boiler casa",en:"Home water heater",fr:"Chauffe-eau maison",de:"Haus-Boiler"},"help.glossary.title":{it:"Glossario",en:"Glossary",fr:"Glossaire",de:"Glossar"},"help.glossary.block.title":{it:"Fascia oraria (block)",en:"Time block",fr:"Créneau horaire",de:"Zeitblock"},"help.glossary.block.body":{it:"Intervallo orario quotidiano (start–end) con un'azione associata. Il sistema esegue l'azione quando il tempo corrente entra nell'intervallo.",en:"A daily time interval (start–end) with an attached action. The system runs the action when the current time enters the interval.",fr:"Intervalle horaire quotidien (start–end) avec une action associée. Le système exécute l'action quand l'heure actuelle entre dans l'intervalle.",de:"Tägliches Zeitintervall (start–end) mit einer zugewiesenen Aktion. Das System führt die Aktion aus, wenn die aktuelle Zeit das Intervall erreicht."},"help.glossary.anchor.title":{it:"Ancora alba/tramonto",en:"Sunrise/sunset anchor",fr:"Ancre lever/coucher",de:"Sonnen-Anker"},"help.glossary.anchor.body":{it:"Invece di un orario fisso, una fascia può iniziare/finire ad alba o tramonto, con un offset in minuti. Si adatta automaticamente alle stagioni.",en:"Instead of a fixed clock time, a block can start/end at sunrise or sunset with a minute offset. Adapts automatically to seasons.",fr:"Au lieu d'une heure fixe, un créneau peut commencer/finir au lever ou coucher du soleil avec un décalage en minutes. S'adapte automatiquement aux saisons.",de:"Anstelle einer festen Uhrzeit kann ein Block bei Sonnenauf- oder -untergang mit Minuten-Versatz beginnen/enden. Passt sich automatisch an die Jahreszeiten an."},"help.glossary.rule.title":{it:"Regola meteo",en:"Weather rule",fr:"Règle météo",de:"Wetterregel"},"help.glossary.rule.body":{it:"Condizione IF/THEN che modifica l'esecuzione di un blocco o agisce come trigger autonomo. Può saltare la fascia, traslarne l'orario, cambiare durata o forzare un'azione diversa.",en:"An IF/THEN condition that modifies a block's execution or acts as a standalone trigger. Can skip, shift, change duration, or force a different action.",fr:"Condition SI/ALORS qui modifie l'exécution d'un créneau ou agit comme déclencheur autonome. Peut ignorer, décaler, changer la durée ou forcer une action différente.",de:"WENN/DANN-Bedingung, die die Block-Ausführung modifiziert oder als eigenständiger Trigger dient. Kann überspringen, verschieben, Dauer ändern oder andere Aktion erzwingen."},"help.glossary.fire_mode.title":{it:"Frequenza di attivazione (fire mode)",en:"Fire mode",fr:"Mode de déclenchement",de:"Auslöse-Modus"},"help.glossary.fire_mode.body":{it:"Per regole trigger: ogni transizione, una volta al giorno, una tra alba/tramonto, o una tra tramonto/alba. Evita che oscillazioni della grandezza monitorata facciano sbattere il dispositivo.",en:"For trigger rules: every transition, once per day, once between sunrise/sunset, or once between sunset/sunrise. Prevents oscillations of the monitored value from making the device flap.",fr:"Pour les règles déclencheur : chaque transition, une fois par jour, une fois entre lever/coucher, ou une fois entre coucher/lever. Empêche les oscillations de la valeur surveillée de faire battre l'appareil.",de:"Für Trigger-Regeln: jede Transition, einmal pro Tag, einmal zwischen Auf-/Untergang oder einmal zwischen Unter-/Aufgang. Verhindert, dass Schwankungen des überwachten Wertes das Gerät zappeln lassen."},"help.glossary.override.title":{it:"Override su sensori puntuali",en:"Point-sensor overrides",fr:"Surcharges par capteurs",de:"Punktsensor-Überschreibungen"},"help.glossary.override.body":{it:"Per ogni attributo meteo (temperatura, umidità, vento, …) puoi puntare a una sensor.* specifica. Utile se hai una stazione meteo locale (Ecowitt, WeatherFlow) più affidabile del provider cloud.",en:"For each weather attribute (temperature, humidity, wind, …) you can point at a specific sensor.* entity. Useful if you have a local weather station (Ecowitt, WeatherFlow) more reliable than the cloud provider.",fr:"Pour chaque attribut météo (température, humidité, vent, …) tu peux pointer vers une entité sensor.* spécifique. Utile si tu as une station météo locale plus fiable.",de:"Für jedes Wetter-Attribut (Temperatur, Feuchte, Wind, …) kannst du auf eine spezifische sensor.*-Entität verweisen. Nützlich bei einer lokalen Wetterstation, zuverlässiger als Cloud-Anbieter."},"weather.attr.temperature":{it:"Temperatura attuale",en:"Current temperature",fr:"Température actuelle",de:"Aktuelle Temperatur"},"weather.attr.humidity":{it:"Umidità",en:"Humidity",fr:"Humidité",de:"Luftfeuchtigkeit"},"weather.attr.wind_speed":{it:"Velocità vento",en:"Wind speed",fr:"Vitesse du vent",de:"Windgeschwindigkeit"},"weather.attr.wind_bearing":{it:"Direzione vento",en:"Wind bearing",fr:"Direction du vent",de:"Windrichtung"},"weather.attr.pressure":{it:"Pressione atmosferica",en:"Atmospheric pressure",fr:"Pression atmosphérique",de:"Luftdruck"},"weather.attr.uv_index":{it:"Indice UV",en:"UV index",fr:"Indice UV",de:"UV-Index"},"weather.attr.condition":{it:"Condizione attuale",en:"Current condition",fr:"Condition actuelle",de:"Aktuelle Bedingung"},"weather.attr.forecast.temp_max_today":{it:"Temp. max oggi (forecast)",en:"Today max temp (forecast)",fr:"Temp. max aujourd'hui (prévision)",de:"Heute Höchsttemperatur (Vorhersage)"},"weather.attr.forecast.temp_min_today":{it:"Temp. min oggi (forecast)",en:"Today min temp (forecast)",fr:"Temp. min aujourd'hui (prévision)",de:"Heute Tiefsttemperatur (Vorhersage)"},"weather.attr.forecast.rain_6h":{it:"Pioggia prossime 6h",en:"Rain next 6h",fr:"Pluie 6 prochaines h",de:"Regen nächste 6 h"},"weather.attr.forecast.condition_6h":{it:"Condizione +6h",en:"Condition +6h",fr:"Condition +6 h",de:"Bedingung +6 h"}};function Fe(e,t){const i=`weather.attr.${e}`,s=Ve(i);return s===i?t||e:s}const Ge="1.6.1";async function Ze(e){return e.callWS({type:"chronos/devices/list"})}async function Je(e){return e.callWS({type:"chronos/schedules/list"})}async function Ke(e,t){return e.callWS({type:"chronos/schedules/save",schedule:t})}async function Qe(e){return e.callWS({type:"chronos/settings/get"})}async function Xe(e){return e.callWS({type:"chronos/entities/available"})}function Ye(e){const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function et(e,t,i){return Math.max(t,Math.min(i,e))}let tt=15;function it(e){tt=e&&e>0?e:15}function st(e,t){const i=60/tt;return Math.round(e*i)/i}let rt=null;function at(e,t){const i=e[`${t}_anchor`],s=e[`${t}_offset`]??0;if("sunrise"===i||"sunset"===i){const e=rt?.states?.["sun.sun"];if(e){const t="sunrise"===i?"next_rising":"next_setting",r=e.attributes?.[t];if(r){const e=new Date(r);if(!isNaN(e.getTime())){return et(e.getHours()+e.getMinutes()/60+e.getSeconds()/3600+s/60,0,24)}}}}const r=e[t];return"number"==typeof r?r:parseFloat(String(r??0))||0}function nt(){return[Ve("days.short.0"),Ve("days.short.1"),Ve("days.short.2"),Ve("days.short.3"),Ve("days.short.4"),Ve("days.short.5"),Ve("days.short.6")]}const ot={thermostat:{label:"Termostato",domain:"climate",capabilities:["set_temperature","hvac_mode","preset_mode"]},light:{label:"Luce",domain:"light",capabilities:["turn_on","turn_off","brightness","color_temp"]},blind:{label:"Tapparella",domain:"cover",capabilities:["open","close","set_position","stop"]},irrigation:{label:"Irrigazione",domain:"valve",capabilities:["turn_on","turn_off","duration"]},plug:{label:"Presa smart",domain:"switch",capabilities:["turn_on","turn_off"]},fan:{label:"Ventilatore",domain:"fan",capabilities:["turn_on","turn_off","speed","oscillate"]},boiler:{label:"Boiler",domain:"water_heater",capabilities:["set_temperature","operation_mode"]},mower:{label:"Tosaerba",domain:"lawn_mower",capabilities:["start_mowing","pause","dock"]},vacuum:{label:"Robot aspirapolvere",domain:"vacuum",capabilities:["start","pause","return_to_base","fan_speed"]}};function lt(e){if(!e||!e.length)return"";if(e.every(Boolean))return Ve("schedule.every_day");const t=nt();return e.map((e,i)=>e?t[i]:null).filter(Boolean).join(" · ")}let dt=class extends de{constructor(){super(...arguments),this.variant="linear",this.deviceType="thermostat",this.blocks=[],this.selectedIdx=-1,this.now=null,this.interactive=!0,this.height="normal",this.showWeather=!0,this.forecast=[],this._drag=null,this._boundMove=null,this._boundUp=null}render(){return"radial"===this.variant?this._renderRadial():"list"===this.variant?this._renderList():this._renderLinear()}_renderLinear(){const e=e=>e/24*100,t="compact"===this.height?"timeline timeline--compact":"mini"===this.height?"timeline timeline--mini":"timeline";return V`
      <div class="${t}" @click=${this._onTrackClick}>
        ${this.showWeather&&"mini"!==this.height?this._renderWeatherRibbon():G}
        <div class="timeline__hours">
          ${Array.from({length:24}).map(()=>V`<div></div>`)}
        </div>
        ${"normal"===this.height?V`
          <div class="timeline__labels">
            ${[0,6,12,18,24].map(t=>V`<span style="left:${e(t)}%">${String(t).padStart(2,"0")}:00</span>`)}
          </div>
        `:G}
        ${this.blocks.map((t,i)=>{const s=at(t,"start"),r=at(t,"end");return V`
          <div
            class="tl-block"
            data-selected="${this.selectedIdx===i}"
            style="left:${e(s)}%;width:${e(r-s)}%;background:${Oe(this.deviceType,t.action)}"
            @mousedown=${e=>this._onBlockDown(e,i,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(i)}}
          >
            ${this.interactive?V`<div class="tl-block__handle tl-block__handle--l" @mousedown=${e=>this._onBlockDown(e,i,"l")}></div>`:G}
            <span class="truncate">${We(this.deviceType,t.action)}</span>
            ${"mini"!==this.height?V`<span class="mono" style="font-size:10px;opacity:0.85">${Ye(s)}</span>`:G}
            ${this.interactive?V`<div class="tl-block__handle tl-block__handle--r" @mousedown=${e=>this._onBlockDown(e,i,"r")}></div>`:G}
          </div>
          `})}
        ${null!==this.now?V`<div class="tl-now" style="left:${e(this.now)}%"></div>`:G}
      </div>
    `}_renderWeatherRibbon(){return this.forecast.length?V`
      <div class="tl-weather">
        ${this.forecast.map(e=>{const t=e.condition||e.state||"cloud",i=t.includes("rain")?"rain":t.includes("sun")?"sun":t.includes("snow")?"snow":"cloud";return V`<div class="tl-weather__cell" data-state="${i}"></div>`})}
      </div>
    `:G}_renderRadial(){const e=420,t=210,i=210,s=170,r=120,a=null!==this.now?this.now/24*Math.PI*2-Math.PI/2:null,n=(e,s,r)=>{const a=e/24*Math.PI*2-Math.PI/2,n=t+145*Math.cos(a),o=i+145*Math.sin(a);return q`
        <g style="cursor:${this.interactive?"ew-resize":"default"}" @mousedown=${e=>this._onRadialHandleDown(e,s,r)}>
          <circle cx="${n}" cy="${o}" r="9" fill="white" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="${n}" cy="${o}" r="3" fill="var(--accent)"/>
        </g>
      `},o=this.selectedIdx>=0?this.blocks[this.selectedIdx]:null;return q`
      <svg class="radial" viewBox="0 0 ${e} ${e}" style="touch-action:none">
        <circle cx="${t}" cy="${i}" r="${145}" fill="none" stroke="var(--border-soft)" stroke-width="${50}"/>
        ${this.blocks.map((e,a)=>{const n=at(e,"start"),o=at(e,"end");return q`
          <path
            d="${((e,s,r,a)=>{const n=e/24*Math.PI*2-Math.PI/2,o=s/24*Math.PI*2-Math.PI/2,l=s-e>12?1:0;return`M ${t+r*Math.cos(n)} ${i+r*Math.sin(n)} A ${r} ${r} 0 ${l} 1 ${t+r*Math.cos(o)} ${i+r*Math.sin(o)} L ${t+a*Math.cos(o)} ${i+a*Math.sin(o)} A ${a} ${a} 0 ${l} 0 ${t+a*Math.cos(n)} ${i+a*Math.sin(n)} Z`})(n,o,s,r)}"
            fill="${Oe(this.deviceType,e.action)}"
            stroke="${this.selectedIdx===a?"var(--accent)":"var(--block-edge)"}"
            stroke-width="${this.selectedIdx===a?3:1.5}"
            stroke-linejoin="round"
            style="cursor:${this.interactive?"grab":"pointer"}"
            @mousedown=${e=>this._onRadialHandleDown(e,a,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(a)}}
          />
        `})}
        ${this.blocks.map(e=>{const s=at(e,"start"),r=at(e,"end");if(r-s<1.5)return q``;const a=(s+r)/2/24*Math.PI*2-Math.PI/2,n=t+145*Math.cos(a),o=i+145*Math.sin(a),l=Le(this.deviceType,e.action.id);let d="";return l?.value&&void 0!==e.action.value&&null!==e.action.value&&""!==e.action.value?d=`${e.action.value}${l.value.unit||""}`:l?.label&&(d=l.label.length>8?l.label.slice(0,7)+"…":l.label),d?q`
            <text x="${n}" y="${o}" text-anchor="middle" dy="4"
              font-size="13" font-weight="700" fill="#0f172a"
              stroke="rgba(255,255,255,0.85)" stroke-width="2.5" paint-order="stroke fill"
              pointer-events="none">${d}</text>
          `:q``})}
        ${Array.from({length:24}).map((e,s)=>{const r=s/24*Math.PI*2-Math.PI/2,a=s%6==0?156:162;return q`<line x1="${t+168*Math.cos(r)}" y1="${i+168*Math.sin(r)}" x2="${t+a*Math.cos(r)}" y2="${i+a*Math.sin(r)}" stroke="white" stroke-width="${s%6==0?2:1}" opacity="0.7" pointer-events="none"/>`})}
        ${[0,6,12,18].map(e=>{const s=e/24*Math.PI*2-Math.PI/2;return q`<text x="${t+195*Math.cos(s)}" y="${i+195*Math.sin(s)}" text-anchor="middle" dy="4" font-size="11">${String(e).padStart(2,"0")}</text>`})}
        ${this.interactive&&o?q`${n(at(o,"start"),this.selectedIdx,"l")}${n(at(o,"end"),this.selectedIdx,"r")}`:G}
        ${null!==a?q`
          <g pointer-events="none">
            <line x1="${t+90*Math.cos(a)}" y1="${i+90*Math.sin(a)}" x2="${t+190*Math.cos(a)}" y2="${i+190*Math.sin(a)}" stroke="var(--danger)" stroke-width="2"/>
            <circle cx="${t+190*Math.cos(a)}" cy="${i+190*Math.sin(a)}" r="5" fill="var(--danger)"/>
          </g>
        `:G}
        <text x="${t}" y="${204}" text-anchor="middle" class="radial__label" font-size="32" font-weight="700" pointer-events="none">${null!==this.now?Ye(this.now):"—"}</text>
        <text x="${t}" y="${224}" text-anchor="middle" font-size="11" pointer-events="none">24h · oggi</text>
      </svg>
    `}_renderList(){return V`
      <div class="tl-list">
        ${this.blocks.map((e,t)=>V`
          <div
            class="tl-list__row"
            style="border-color:${this.selectedIdx===t?"var(--accent)":"var(--border-soft)"};background:${this.selectedIdx===t?"var(--accent-soft)":"var(--bg-sunken)"}"
            @click=${()=>this._fireSelect(t)}
          >
            <div class="tl-list__time">${Ye(at(e,"start"))} → ${Ye(at(e,"end"))}</div>
            <div class="tl-list__mode">
              <span class="tl-list__mode-dot" style="background:${Oe(this.deviceType,e.action)}"></span>
              <strong>${We(this.deviceType,e.action)}</strong>
            </div>
            <span class="mono text-xs text-mute">${Math.round(60*(at(e,"end")-at(e,"start")))} min</span>
          </div>
        `)}
      </div>
    `}_onBlockDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t];this._drag={idx:t,handle:i,startX:e.clientX,origStart:at(s,"start"),origEnd:at(s,"end")},this._boundMove=e=>this._onDragMove(e),this._boundUp=()=>this._onDragUp(),window.addEventListener("mousemove",this._boundMove),window.addEventListener("mouseup",this._boundUp)}_onDragMove(e){if(!this._drag)return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=st(et((e.clientX-i.left)/i.width*24,0,24)),r=[...this.blocks],a={...r[this._drag.idx]};if("l"===this._drag.handle){const e=et(s,0,at(a,"end")-.25);a.start=e,delete a.start_anchor,delete a.start_offset}else if("r"===this._drag.handle){const e=et(s,at(a,"start")+.25,24);a.end=e,delete a.end_anchor,delete a.end_offset}else{const t=(e.clientX-this._drag.startX)/i.width*24,s=this._drag.origEnd-this._drag.origStart;let r=et(this._drag.origStart+t,0,24-s);r=st(r),a.start=r,a.end=r+s,delete a.start_anchor,delete a.start_offset,delete a.end_anchor,delete a.end_offset}r[this._drag.idx]=a,this._fireBlocksChanged(r)}_onDragUp(){this._drag=null,this._boundMove&&window.removeEventListener("mousemove",this._boundMove),this._boundUp&&window.removeEventListener("mouseup",this._boundUp),this._boundMove=null,this._boundUp=null}_onRadialHandleDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t],r=this.shadowRoot?.querySelector(".radial");if(!r)return;const a=e=>{const t=r.getBoundingClientRect(),i=420,s=(e.clientX-t.left)/t.width*i,a=(e.clientY-t.top)/t.height*i;let n=Math.atan2(a-210,s-210)+Math.PI/2;return n<0&&(n+=2*Math.PI),n/(2*Math.PI)*24},n=a(e),o=at(s,"start"),l=at(s,"end"),d=e=>{const s=a(e),r=st(s),d=[...this.blocks],c={...d[t]};if("l"===i)c.start=et(r,0,at(c,"end")-.25),delete c.start_anchor,delete c.start_offset;else if("r"===i)c.end=et(r,at(c,"start")+.25,24),delete c.end_anchor,delete c.end_offset;else{const e=l-o;let t=o+(s-n);t=st(t),t=et(t,0,24-e),c.start=t,c.end=t+e,delete c.start_anchor,delete c.start_offset,delete c.end_anchor,delete c.end_offset}d[t]=c,this._fireBlocksChanged(d)},c=()=>{window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",c)};window.addEventListener("mousemove",d),window.addEventListener("mouseup",c)}_onTrackClick(e){if(!this.interactive)return;if(e.target.closest(".tl-block"))return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=et((e.clientX-i.left)/i.width*24,0,24),r=Math.max(0,st(s)-.5),a=Math.min(24,r+1),n=this.blocks.some(e=>{const t=at(e,"start"),i=at(e,"end");return!(a<=t||r>=i)});if(n)return;const o=[...this.blocks,{start:r,end:a,action:Pe(this.deviceType)}];this._fireBlocksChanged(o)}_fireSelect(e){this.dispatchEvent(new CustomEvent("block-select",{detail:{index:e}}))}_fireBlocksChanged(e){this.dispatchEvent(new CustomEvent("blocks-changed",{detail:{blocks:e}}))}};dt.styles=fe,e([ve({type:String})],dt.prototype,"variant",void 0),e([ve({type:String})],dt.prototype,"deviceType",void 0),e([ve({type:Array})],dt.prototype,"blocks",void 0),e([ve({type:Number})],dt.prototype,"selectedIdx",void 0),e([ve({type:Number})],dt.prototype,"now",void 0),e([ve({type:Boolean})],dt.prototype,"interactive",void 0),e([ve({type:String})],dt.prototype,"height",void 0),e([ve({type:Boolean})],dt.prototype,"showWeather",void 0),e([ve({type:Array})],dt.prototype,"forecast",void 0),e([ge()],dt.prototype,"_drag",void 0),dt=e([he("chronos-timeline")],dt);let ct=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t}=this.card,i=e.length,s=e.filter(e=>e.enabled).length,r=e.reduce((e,t)=>e+(t.weather_rules||[]).filter(e=>e.active).length,0);return V`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${Ve("screen.overview.title")}</h1>
          <p class="page-sub">${Ve("overview.subtitle",{n:s,tot:i})}</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.active")}</div>
            <div class="kpi__value">${s}<span class="text-mute" style="font-size:16px;margin-left:6px">/${i}</span></div>
            <div class="kpi__delta">${t.length} ${Ve("overview.kpi.devices").toLowerCase()}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.weather_rules")}</div>
            <div class="kpi__value">${r}</div>
            <div class="kpi__delta">${Ve("device.state.live")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${Ve("overview.kpi.now")}</div>
            <div class="kpi__value">${Ye(this.nowHour)}</div>
            <div class="kpi__delta">${Ve("device.state.live")}</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">${Ve("nav.overview")}</h2>
            <span class="tag mono">${i}</span>
          </div>
          <div class="row">
            <button class="btn" @click=${()=>this.card.navigate("week")}>${_e("calendar",14)} ${Ve("nav.week")}</button>
            <button class="btn btn--primary" @click=${()=>this.card.navigate("wizard")}>${_e("plus",14)} ${Ve("nav.new_schedule")}</button>
          </div>
        </div>

        <div class="grid-auto">
          ${e.map(e=>{const i=(e.device_ids||[]).map(e=>t.find(t=>t.id===e)).filter(Boolean),s=(e.weather_rules||[]).filter(e=>e.active).length;return V`
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
                    ${i.slice(0,5).map(e=>{const t=Ee(e,this.card.hass?.states?.[e.entity_id],this.card._settings);return V`<div class="device-icon-pill" title="${e.alias}" style="background:${t.soft};color:${t.accent}">${we(e.type,14)}</div>`})}
                    ${i.length>5?V`<div class="device-icon-pill mono" style="font-size:10px">+${i.length-5}</div>`:G}
                  </div>
                  <div style="flex:1"></div>
                  ${s>0?V`<span class="chip chip--weather">${_e("cloud",11)} ${Ve("overview.rules_count",{n:s})}</span>`:G}
                  <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?Ve("schedule.active"):Ve("schedule.disabled")}</span>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}};ct.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],ct.prototype,"card",void 0),e([ve({type:Number})],ct.prototype,"nowHour",void 0),ct=e([he("chronos-overview")],ct);let ht=class extends de{constructor(){super(...arguments),this.nowHour=0,this._selectedBlockIdx=0,this._confirmDelete=!1}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return V`<div class="text-mute" style="padding:40px;text-align:center">${Ve("overview.no_schedules")}</div>`;const t=e.blocks[this._selectedBlockIdx],i=(e.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean),s=e.device_type,r=ot[s]||{label:s},a=Ie(s),n=t?.action?Le(s,t.action.id):null,o=this.card.isDirty;return V`
      <div class="col" style="gap:18px">
        <div class="sp-between">
          <div>
            <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")} style="margin-bottom:6px">
              ${_e("chevron-left",14)} ${Ve("nav.overview")}
            </button>
            <input class="input" .value=${e.name}
              @input=${t=>this.card.updateScheduleLocal(e.id,{name:t.target.value})}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?Ve("schedule.active"):Ve("schedule.disabled")}</span>
              <span class="chip">${_e("repeat",11)} ${lt(e.days)}</span>
              <span class="chip chip--accent">${we(s,11)} ${r.label}</span>
              <span class="chip">${_e("device",11)} ${i.length}</span>
              ${(e.weather_rules||[]).filter(e=>e.active).length>0?V`<span class="chip chip--weather">${_e("cloud",11)} ${Ve("overview.rules_count",{n:(e.weather_rules||[]).filter(e=>e.active).length})}</span>`:G}
            </div>
          </div>
          <div class="row" style="gap:10px">
            <label class="switch">
              <input type="checkbox" .checked=${e.enabled} @change=${t=>this.card.doToggleSchedule(e.id,t.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" style="color:var(--danger)" @click=${()=>{this._confirmDelete=!0}} title="${Ve("common.delete")}">${_e("trash",14)}</button>
            <button class="btn btn--primary" ?disabled=${!o}
              style="opacity:${o?1:.5};cursor:${o?"pointer":"not-allowed"}"
              @click=${()=>this.card.saveCurrentSchedule()}>
              ${_e("check",14)} ${Ve(o?"editor.dirty.unsaved":"editor.dirty.saved")}
            </button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 340px;gap:18px">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">${Ve("wizard.step.time")}</h3>
                  <p class="card__sub">${Ve("editor.add_block_hint")}</p>
                </div>
                <div class="segmented">
                  ${["linear","radial","list"].map(e=>V`
                    <button data-active="${this.card._timelineVariant===e}" @click=${()=>this.card.setTimelineVariant(e)}>
                      ${Ve("timeline."+e)}
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
                @block-select=${e=>{this._selectedBlockIdx=e.detail.index}}
                @blocks-changed=${t=>{this.card.updateBlocksLocal(e.id,t.detail.blocks)}}
              ></chronos-timeline>
              <div class="row" style="margin-top:14px;justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div class="row" style="gap:14px;flex-wrap:wrap">
                  ${a.map(e=>V`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${Te[e.kind]};display:inline-block"></span>
                      <span class="text-xs">${e.label}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${()=>{const t=[...e.blocks,{start:12,end:13,action:Pe(s)}];this.card.updateBlocksLocal(e.id,t)}}>
                  ${_e("plus",12)} ${Ve("common.add")}
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
                  ${nt().map((t,i)=>{const s=e.days[i];return V`
                      <button class="mono" @click=${()=>{const t=[...e.days];t[i]=t[i]?0:1,this.card.updateScheduleLocal(e.id,{days:t})}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;letter-spacing:0.02em;background:${s?"var(--accent)":"var(--bg-sunken)"};color:${s?"white":"var(--text-muted)"};border:1px solid ${s?"transparent":"var(--border-soft)"};cursor:pointer">
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
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("editor.weather_rules.title")}</h3><p class="card__sub">${Ve("nav.weather_rules")}</p></div>
                <button class="btn btn--sm" @click=${()=>this.card.navigate("weatherRule")}>${_e("plus",12)} ${Ve("editor.weather_rules.add")}</button>
              </div>
              ${(e.weather_rules||[]).length?V`<div class="col" style="gap:8px">
                    ${(e.weather_rules||[]).map((t,i)=>V`
                      <div class="rule-block">
                        <span class="rule-block__label rule-block__label--if">IF</span>
                        <span class="rule-token rule-token--weather">${t.if}</span>
                        <span class="rule-block__label rule-block__label--then">THEN</span>
                        <span class="rule-token rule-token--accent">${t.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch">
                          <input type="checkbox" .checked=${t.active} @change=${t=>{const s=[...e.weather_rules||[]];s[i]={...s[i],active:t.target.checked},this.card.updateScheduleLocal(e.id,{weather_rules:s})}}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                          @click=${()=>{if(!confirm(`${Ve("common.remove")}: ${t.if} → ${t.then}?`))return;const s=(e.weather_rules||[]).filter((e,t)=>t!==i);this.card.updateScheduleLocal(e.id,{weather_rules:s})}}
                          title="${Ve("common.remove")}">
                          ${_e("trash",12)}
                        </button>
                      </div>
                    `)}
                  </div>`:V`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("cloud",22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("editor.weather_rules.empty")}</div>
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("wizard.time.selected")}</h3><p class="card__sub">${t?`${Ye(t.start)} → ${Ye(t.end)}`:""}</p></div>
              </div>
              ${t?V`
                <div class="col" style="gap:12px">
                  ${this._renderTimeEdge(e.id,t,"start")}
                  ${this._renderTimeEdge(e.id,t,"end")}
                  <div class="field">
                    <label class="field__label">${Ve("editor.block.action")}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${a.map(i=>{const s=t.action?.id===i.id;return V`<button class="btn btn--sm" @click=${()=>this._setBlockAction(e.id,i.id,i.value?.default)}
                          style="background:${s?Te[i.kind]:"var(--surface)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border)"}">
                          ${i.label}</button>`})}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${n?.service||""}</span>
                  </div>
                  ${n?.value?V`
                    <div class="field">
                      <label class="field__label">${n.value.label||Ve("common.value")} ${n.value.unit?V`<span class="text-mute">(${n.value.unit})</span>`:G}</label>
                      ${"number"===n.value.type?V`
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
                      `:"enum"===n.value.type?V`
                        <select class="input"
                          @change=${t=>this._setBlockValue(e.id,t.target.value)}>
                          ${(n.value.options||[]).map(e=>{const i=String(t.action?.value??n.value.default);return V`<option value="${e}" ?selected=${i===e}>${e}</option>`})}
                        </select>
                      `:G}
                    </div>
                  `:G}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${()=>this._removeBlock(e.id)}>
                    ${_e("trash",14)} ${Ve("editor.block.delete")}
                  </button>
                </div>
              `:G}
            </div>

            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${Ve("editor.devices_section")}</h3><p class="card__sub">${Ve("editor.devices_count",{n:i.length})}</p></div>
              </div>
              <div class="col" style="gap:2px">
                ${i.map(e=>V`
                  <div class="device-row">
                    <div class="device-row__icon">${we(e.type,17)}</div>
                    <div class="device-row__main">
                      <div class="device-row__name">${e.alias}</div>
                      <div class="device-row__meta">${e.area} · ${e.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          </div>
        </div>
        ${this._confirmDelete?this._renderDeleteModal(e):G}
      </div>
    `}_renderTimeEdge(e,t,i){const s=t[`${i}_anchor`],r=t[`${i}_offset`]??0,a=s??"fixed",n=at(t,i),o=Ve("start"===i?"editor.block.from":"editor.block.to");return V`
      <div class="field">
        <label class="field__label">${o}</label>
        <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
          <select class="select mono" style="width:130px"
            @change=${t=>this._setEdgeMode(e,i,t.target.value)}>
            <option value="fixed" ?selected=${"fixed"===a}>${Ve("editor.block.fixed")}</option>
            <option value="sunrise" ?selected=${"sunrise"===a}>${Ve("editor.block.sunrise")}</option>
            <option value="sunset" ?selected=${"sunset"===a}>${Ve("editor.block.sunset")}</option>
          </select>
          ${"fixed"===a?V`
            <input type="time" class="input mono" style="width:120px"
              .value=${this._toHHMM(n)}
              @change=${t=>this._setEdgeFixed(e,i,t.target.value)}/>
          `:V`
            <input type="number" class="input mono" style="width:90px" step="5" min="-180" max="180"
              .value=${String(r)}
              @change=${t=>this._setEdgeOffset(e,i,parseInt(t.target.value,10))}/>
            <span class="text-xs text-mute">min</span>
            <span class="text-xs text-mute" style="font-style:italic">→ ${Ve("editor.block.today")} ${Ye(n)}</span>
          `}
        </div>
      </div>
    `}_toHHMM(e){const t=Math.max(0,Math.min(23,Math.floor(e))),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}_setEdgeMode(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const r=[...s.blocks],a={...r[this._selectedBlockIdx]};if("fixed"===i){const e=at(a,t);a[t]=e,delete a[`${t}_anchor`],delete a[`${t}_offset`]}else a[`${t}_anchor`]=i,void 0===a[`${t}_offset`]&&(a[`${t}_offset`]=0);r[this._selectedBlockIdx]=a,this.card.updateBlocksLocal(e,r)}_setEdgeFixed(e,t,i){if(!i)return;const[s,r]=i.split(":").map(e=>parseInt(e,10));if(isNaN(s)||isNaN(r))return;const a=this.card._schedules.find(t=>t.id===e);if(!a)return;const n=[...a.blocks],o={...n[this._selectedBlockIdx]};o[t]=s+r/60,delete o[`${t}_anchor`],delete o[`${t}_offset`],n[this._selectedBlockIdx]=o,this.card.updateBlocksLocal(e,n)}_setEdgeOffset(e,t,i){if(isNaN(i))return;const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const r=[...s.blocks],a={...r[this._selectedBlockIdx]};a[`${t}_offset`]=i,r[this._selectedBlockIdx]=a,this.card.updateBlocksLocal(e,r)}_setBlockAction(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const r=[...s.blocks];r[this._selectedBlockIdx]={...r[this._selectedBlockIdx],action:{id:t,value:i}},this.card.updateBlocksLocal(e,r)}_setBlockValue(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=[...i.blocks],r=s[this._selectedBlockIdx];s[this._selectedBlockIdx]={...r,action:{...r.action,value:t}},this.card.updateBlocksLocal(e,s)}_renderDeleteModal(e){return V`
      <div class="modal-overlay" @click=${()=>{this._confirmDelete=!1}}>
        <div class="card" style="width:min(440px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${Ve("common.delete")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${e.name}</strong>
            <span class="text-xs text-mute" style="display:block;margin-top:4px">
              ${e.blocks.length} fasce · ${(e.device_ids||[]).length} dispositivi · ${(e.weather_rules||[]).length} regole meteo
            </span>
          </p>
          <p class="text-xs text-mute" style="margin:0 0 16px">
            ${"editor.delete.warn"!==Ve("editor.delete.warn")?Ve("editor.delete.warn"):"Operazione non reversibile. La schedulazione, i blocchi e le regole meteo associate verranno eliminati."}
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._confirmDelete=!1}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              @click=${async()=>{this._confirmDelete=!1,await this.card.doRemoveSchedule(e.id)}}>
              ${_e("trash",12)} ${Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_removeBlock(e){const t=this.card._schedules.find(t=>t.id===e);if(!t||t.blocks.length<=1)return;const i=t.blocks.filter((e,t)=>t!==this._selectedBlockIdx);this._selectedBlockIdx=Math.max(0,this._selectedBlockIdx-1),this.card.updateBlocksLocal(e,i)}};ht.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],ht.prototype,"card",void 0),e([ve({type:Number})],ht.prototype,"nowHour",void 0),e([ge()],ht.prototype,"_selectedBlockIdx",void 0),e([ge()],ht.prototype,"_confirmDelete",void 0),ht=e([he("chronos-editor")],ht);let ut=class extends de{constructor(){super(...arguments),this.nowHour=0,this._variable="temperature",this._op=">",this._value="22",this._action="skip",this._actionValue="",this._fireMode="once_per_daytime"}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return G;const t=Ie(e.device_type),i=this.card._weatherAttributes,s=i.find(e=>e.key===this._variable)||i[0],r=this.card._settings?.weather_entity||"",a=`${this._variable} ${this._op} ${this._value}${s?.unit||""}`,n=t.find(e=>e.id===this._actionValue),o="skip"===this._action?Ve("wr.action.skip"):"shift"===this._action?`${Ve("wr.action.shift")} ${this._actionValue||"+1"} ${Ve("common.hour_short")}`:"force"===this._action?`${Ve("wr.action.force")}: ${n?.label||"—"}`:`${Ve("wr.action.duration")} ${this._actionValue||"+30"} ${Ve("common.min")}`;return V`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("editor")}>
            ${_e("chevron-left",14)} ${Ve("nav.editor")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${Ve("wr.heading")}</h1>
          <p class="page-sub">${Ve("wr.subtitle")} · <strong>${e.name}</strong></p>
        </div>

        <div class="card" style="padding:22px">
          <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border)">
            <span class="rule-block__label rule-block__label--if">IF</span>
            <span class="rule-token mono text-xs">${r||"—"}.</span>
            <span class="rule-token rule-token--weather">${_e(s?.icon||"cloud",11)} ${Fe(this._variable,s?.label)}</span>
            <span class="rule-token mono">${this._op}</span>
            <span class="rule-token rule-token--weather mono">${this._value}${s?.unit||""}</span>
            <span class="rule-block__label rule-block__label--then">THEN</span>
            <span class="rule-token rule-token--accent">${o}</span>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.if.title")}</h3><p class="card__sub">${Ve("wr.if.subtitle")}</p></div></div>
            <div class="col" style="gap:12px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:380px;overflow-y:auto;padding-right:4px">
                ${i.map(e=>V`
                  <button class="tile-pick" data-selected="${this._variable===e.key}" @click=${()=>{this._variable=e.key}} style="padding:10px">
                    <div class="row" style="gap:8px">
                      <div class="tile-pick__icon" style="width:28px;height:28px">${_e(e.icon,14)}</div>
                      <div style="min-width:0;flex:1">
                        <div class="tile-pick__name" style="font-size:12.5px">${Fe(e.key,e.label)}</div>
                        <div class="tile-pick__desc mono" style="font-size:10.5px">${e.key}${e.unit?` · ${e.unit}`:""}</div>
                      </div>
                    </div>
                  </button>
                `)}
              </div>
              <div class="grid-2">
                <div class="field">
                  <label class="field__label">${Ve("wr.op")}</label>
                  <select class="select mono" @change=${e=>{this._op=e.target.value}}>
                    ${"enum"===s?.type?V`
                          <option value="==" ?selected=${"=="===this._op}>uguale a (==)</option>
                          <option value="!=" ?selected=${"!="===this._op}>diverso da (!=)</option>`:V`
                          <option value=">" ?selected=${">"===this._op}>maggiore di (&gt;)</option>
                          <option value=">=" ?selected=${">="===this._op}>maggiore o uguale</option>
                          <option value="<" ?selected=${"<"===this._op}>minore di (&lt;)</option>
                          <option value="<=" ?selected=${"<="===this._op}>minore o uguale</option>
                          <option value="==" ?selected=${"=="===this._op}>uguale a (==)</option>
                          <option value="!=" ?selected=${"!="===this._op}>diverso da (!=)</option>`}
                  </select>
                </div>
                <div class="field">
                  <label class="field__label">${Ve("wr.threshold")}</label>
                  ${"enum"===s?.type?V`<select class="select" @change=${e=>{this._value=e.target.value}}>
                        ${(s.options||[]).map(e=>V`<option value="${e}" ?selected=${this._value===e}>${e}</option>`)}
                      </select>`:V`<input class="input mono" .value=${this._value} @input=${e=>{this._value=e.target.value}}/>`}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.then.title")}</h3><p class="card__sub">${Ve("wr.then.subtitle")}</p></div></div>
            <div class="col" style="gap:12px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
                ${[{key:"skip",label:Ve("wr.action.skip"),desc:Ve("wr.action.skip.desc")},{key:"shift",label:Ve("wr.action.shift"),desc:Ve("wr.action.shift.desc")},{key:"force",label:Ve("wr.action.force"),desc:Ve("wr.action.force.desc")},{key:"duration",label:Ve("wr.action.duration"),desc:Ve("wr.action.duration.desc")}].map(e=>V`
                  <button class="tile-pick" data-selected="${this._action===e.key}" @click=${()=>{this._action=e.key}}>
                    <div class="tile-pick__name">${e.label}</div>
                    <div class="tile-pick__desc">${e.desc}</div>
                  </button>
                `)}
              </div>
              ${"skip"!==this._action?V`
                <div class="field">
                  <label class="field__label">${"force"===this._action?Ve("wr.action.force"):"shift"===this._action?`${Ve("wr.action.shift")} (${Ve("common.hour_short")})`:`${Ve("wr.action.duration")} (${Ve("common.min")})`}</label>
                  ${"force"===this._action?V`<select class="select" @change=${e=>{this._actionValue=e.target.value}}>
                        ${t.map(e=>V`<option value="${e.id}" ?selected=${this._actionValue===e.id}>${e.label}</option>`)}
                      </select>`:V`<input class="input mono" .value=${this._actionValue} @input=${e=>{this._actionValue=e.target.value}}
                        placeholder="${"shift"===this._action?"-1, +2 ore":"+30, -15 min"}"/>`}
                </div>
              `:G}
              ${"force"===this._action?V`
                <div class="field">
                  <label class="field__label">${Ve("wr.fire_mode.label")}</label>
                  <select class="select" @change=${e=>{this._fireMode=e.target.value}}>
                    <option value="every" ?selected=${"every"===this._fireMode}>${Ve("wr.fire_mode.every")}</option>
                    <option value="once_per_day" ?selected=${"once_per_day"===this._fireMode}>${Ve("wr.fire_mode.once_per_day")}</option>
                    <option value="once_per_daytime" ?selected=${"once_per_daytime"===this._fireMode}>${Ve("wr.fire_mode.once_per_daytime")}</option>
                    <option value="once_per_nighttime" ?selected=${"once_per_nighttime"===this._fireMode}>${Ve("wr.fire_mode.once_per_nighttime")}</option>
                  </select>
                  <span class="field__hint">${Ve("wr.fire_mode.hint")}</span>
                </div>
              `:G}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("wr.preview")}</h3><p class="card__sub">${Ve("wr.preview.subtitle")}</p></div></div>
          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} .now=${this.nowHour} .forecast=${this.card._forecast}></chronos-timeline>
        </div>

        <div class="row" style="justify-content:flex-end;gap:8px">
          <button class="btn" @click=${()=>this.card.navigate("editor")}>${Ve("common.cancel")}</button>
          <button class="btn btn--primary" @click=${()=>{const e=this.card._schedules.find(e=>e.id===this.card._selectedId);if(!e)return;const t={if:a,then:o,active:!0};"force"===this._action&&this._actionValue&&(t.trigger_action={action_id:this._actionValue},t.fire_mode=this._fireMode);const i=[...e.weather_rules||[],t];this.card.updateScheduleLocal(e.id,{weather_rules:i}),this.card.navigate("editor")}}>${_e("check",14)} ${Ve("common.save")}</button>
        </div>
      </div>
    `}};ut.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],ut.prototype,"card",void 0),e([ve({type:Number})],ut.prototype,"nowHour",void 0),e([ge()],ut.prototype,"_variable",void 0),e([ge()],ut.prototype,"_op",void 0),e([ge()],ut.prototype,"_value",void 0),e([ge()],ut.prototype,"_action",void 0),e([ge()],ut.prototype,"_actionValue",void 0),e([ge()],ut.prototype,"_fireMode",void 0),ut=e([he("chronos-weather-rule")],ut);let pt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._schedules,t=[];e.forEach(e=>{(e.weather_rules||[]).forEach((i,s)=>{t.push({schedId:e.id,schedName:e.name,idx:s,ifText:i.if,thenText:i.then,active:i.active})})});const i=t.filter(e=>e.active).length;return V`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${Ve("nav.weather_rules")}</h1>
            <p class="page-sub">${t.length} · ${i} ${Ve("schedule.active").toLowerCase()}</p>
          </div>
          <button class="btn btn--primary" @click=${()=>this.card.navigate("weatherRule")}>
            ${_e("plus",14)} ${Ve("editor.weather_rules.add")}
          </button>
        </div>

        ${t.length?V`
          <div class="card">
            <div class="col" style="gap:0">
              ${t.map(e=>V`
                <div class="rule-block" style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:14px 12px">
                  <div style="flex:0 0 200px;min-width:0">
                    <button class="btn btn--ghost btn--sm" style="padding:2px 8px;display:inline-flex"
                      @click=${()=>this.card.selectSchedule(e.schedId,"editor")}>
                      <span class="truncate" style="max-width:180px">${e.schedName}</span>
                      ${_e("chevron-right",11)}
                    </button>
                  </div>
                  <span class="rule-block__label rule-block__label--if">IF</span>
                  <span class="rule-token rule-token--weather">${e.ifText}</span>
                  <span class="rule-block__label rule-block__label--then">THEN</span>
                  <span class="rule-token rule-token--accent">${e.thenText}</span>
                  <div style="flex:1"></div>
                  <label class="switch">
                    <input type="checkbox" .checked=${e.active} @change=${t=>this._toggleRule(e.schedId,e.idx,t.target.checked)}/>
                    <span class="switch__track"></span>
                    <span class="switch__thumb"></span>
                  </label>
                  <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                    @click=${()=>this._deleteRule(e.schedId,e.idx)}
                    title="${Ve("common.remove")}">
                    ${_e("trash",12)}
                  </button>
                </div>
              `)}
            </div>
          </div>
        `:V`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("cloud",22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("editor.weather_rules.empty")}</div>
          </div>
        `}
      </div>
    `}async _toggleRule(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const r=[...s.weather_rules||[]];r[t]={...r[t],active:i},this.card.updateScheduleLocal(e,{weather_rules:r}),this.card._selectedId=e,await this.card.saveCurrentSchedule()}async _deleteRule(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=i.weather_rules?.[t];if(!s)return;if(!confirm(`${Ve("common.remove")}: ${s.if} → ${s.then}?`))return;const r=(i.weather_rules||[]).filter((e,i)=>i!==t);this.card.updateScheduleLocal(e,{weather_rules:r}),this.card._selectedId=e,await this.card.saveCurrentSchedule()}};pt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],pt.prototype,"card",void 0),e([ve({type:Number})],pt.prototype,"nowHour",void 0),pt=e([he("chronos-weather-rules-list")],pt);let vt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._devices.find(e=>e.id===this.card._deviceDetailId)||this.card._devices[0];if(!e)return V`<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-weight:600;font-size:14px">${Ve("device.no_device.title")}</div>
      <div style="font-size:12.5px;margin-top:4px">${Ve("device.no_device.hint")}</div>
    </div>`;const t=ot[e.type]||{label:e.type,domain:"",capabilities:[]},i=this.card._schedules.filter(t=>t.device_ids.includes(e.id)),s=this.card.hass?.states?.[e.entity_id],r=s?.state||"—";return V`
      <div class="col" style="gap:18px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${_e("chevron-left",14)} ${Ve("common.back")}
          </button>
        </div>

        <div class="row" style="gap:16px">
          <div style="width:60px;height:60px;border-radius:16px;background:${Ee(e,s,this.card._settings).soft};color:${Ee(e,s,this.card._settings).accent};display:grid;place-items:center">
            ${we(e.type,28)}
          </div>
          <div style="flex:1">
            <h1 class="page-title" style="margin-bottom:2px">${e.alias}</h1>
            <p class="page-sub mono" style="margin-bottom:0">${e.entity_id} · ${e.area}</p>
          </div>
          <select class="select" style="width:240px"
            @change=${e=>this.card.selectDevice(e.target.value)}>
            ${this.card._devices.map(t=>V`<option value="${t.id}" ?selected=${t.id===e.id}>${t.alias}</option>`)}
          </select>
        </div>

        <div class="grid-3">
          <div class="kpi"><div class="kpi__label">${Ve("device.state")}</div><div class="kpi__value">${r}</div><div class="kpi__delta">${Ve("device.state.live")}</div></div>
          <div class="kpi"><div class="kpi__label">${Ve("device.type")}</div><div class="kpi__value" style="font-size:20px">${t.label}</div><div class="kpi__delta mono">${t.domain}</div></div>
          <div class="kpi"><div class="kpi__label">${Ve("device.linked_schedules")}</div><div class="kpi__value">${i.length}</div><div class="kpi__delta">${Ve("device.linked_schedules.active",{n:i.filter(e=>e.enabled).length})}</div></div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("device.capabilities")}</h3><p class="card__sub">${Ve("device.capabilities.subtitle")}</p></div></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${(t.capabilities||[]).map(e=>V`<span class="rule-token mono">${t.domain}.${e}</span>`)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("device.schedules_using.title")}</h3><p class="card__sub">${Ve("device.schedules_using.subtitle",{n:i.length})}</p></div></div>
          ${i.length?V`<div class="col" style="gap:10px">
                ${i.map(e=>V`
                  <div class="card card--ghost" style="padding:14px">
                    <div class="sp-between" style="margin-bottom:8px">
                      <div>
                        <div class="fw-600">${e.name}</div>
                        <div class="text-xs text-mute mono">${lt(e.days)}</div>
                      </div>
                      <button class="btn btn--sm" @click=${()=>this.card.selectSchedule(e.id,"editor")}>${Ve("device.open_schedule")} ${_e("chevron-right",12)}</button>
                    </div>
                    <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${e.enabled?this.nowHour:null}></chronos-timeline>
                  </div>
                `)}
              </div>`:V`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("device.no_schedules")}</div>
                <div style="font-size:12.5px;margin-top:4px">${Ve("device.no_schedules.hint")}</div>
              </div>`}
        </div>
      </div>
    `}};vt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],vt.prototype,"card",void 0),e([ve({type:Number})],vt.prototype,"nowHour",void 0),vt=e([he("chronos-device-screen")],vt);let gt=class extends de{constructor(){super(...arguments),this.nowHour=0,this._filter=null}render(){const{_schedules:e}=this.card,t=e.filter(e=>e.enabled),i=t.length,s=this._filter,r=s?t.filter(e=>s.has(e.id)):t,a=(new Date).getDay(),n=0===a?6:a-1,o=nt();return V`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${Ve("screen.week.title")}</h1>
          <p class="page-sub">${Ve("week.subtitle",{n:i})}</p>
        </div>

        ${t.length?V`
          <div class="card" style="padding:14px">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div class="fw-600 text-sm">${"Filtra"===Ve("common.search")?"Filtra":"Filtra schedulazioni"}</div>
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
              ${t.map(e=>{const t=!s||s.has(e.id);return V`
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
                ${[0,4,8,12,16,20,24].map(e=>V`
                  <span style="position:absolute;left:${e/24*100}%;transform:translateX(-50%)">${String(e).padStart(2,"0")}</span>
                `)}
              </div>
            </div>
            ${o.map((e,t)=>{const i=r.filter(e=>e.days[t]);return V`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${t===n?"var(--accent)":""}">
                  ${e}${t===n?V`<span style="display:block;font-size:9px;margin-top:2px">${Ve("week.today").toUpperCase()}</span>`:G}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${i.map(e=>V`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500;cursor:pointer" class="truncate"
                          @click=${()=>this.card.selectSchedule(e.id,"editor")}>${e.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="mini" .showWeather=${!1}
                            .now=${t===n?this.nowHour:null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${i.length?G:V`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">—</div>`}
                  </div>
                </div>
              </div>
            `})}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(Te).map(([e,t])=>{const i={on:Ve("schedule.active"),off:Ve("schedule.disabled"),set:Ve("common.value"),preset:"Preset",cmd:Ve("editor.block.action")};return V`
              <div class="row" style="gap:6px">
                <span style="width:12px;height:8px;border-radius:2px;background:${t}"></span>
                <span class="text-xs">${i[e]}</span>
              </div>
            `})}
        </div>
      </div>
    `}_toggleFilter(e){const t=this._filter??new Set(this.card._schedules.filter(e=>e.enabled).map(e=>e.id)),i=new Set(t);i.has(e)?i.delete(e):i.add(e);const s=this.card._schedules.filter(e=>e.enabled);this._filter=i.size===s.length?null:i}};gt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],gt.prototype,"card",void 0),e([ve({type:Number})],gt.prototype,"nowHour",void 0),e([ge()],gt.prototype,"_filter",void 0),gt=e([he("chronos-week")],gt);let mt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t,_forecast:i,_settings:s}=this.card,r=s?.weather_entity||"",a=r?this.card.hass?.states?.[r]:null,n=a?.attributes?.temperature??"—",o=a?.state||"cloud",l=a?.attributes?.humidity??"—",d=a?.attributes?.wind_speed??"—",c=e.filter(e=>e.enabled).map(e=>{const t=e.blocks.find(e=>this.nowHour>=e.start&&this.nowHour<e.end);return{schedule:e,active:t}});return V`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${Ve("screen.live.title")}</h1>
            <p class="page-sub">${r?Ve("live.weather.subtitle",{entity:r}):Ve("live.no_weather")}</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>${Ve("schedule.active")}</span>
          </div>
        </div>

        <!-- Weather hero -->
        <div class="grid-2">
          <div class="weather-hero">
            <div class="weather-hero__icon">${ye(o,32)}</div>
            <div>
              <div class="weather-hero__temp">${n}°<span style="font-size:16px;color:var(--text-muted)">C</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(o)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${_e("droplet",11)} ${l}%</span>
              <span class="chip">${_e("wind",11)} ${d} km/h</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.forecast.title")}</h3><p class="card__sub">${Ve("live.forecast.title")}</p></div></div>
            <div class="forecast-row">
              ${i.filter((e,t)=>t%2==0).slice(0,12).map(e=>{const t=new Date(e.datetime||"").getHours?.()??0,i=e.condition||"cloud";return V`
                  <div class="forecast-cell">
                    <div class="forecast-cell__hour">${String(t).padStart(2,"0")}</div>
                    <div class="forecast-cell__icon">${ye(i,20)}</div>
                    <div class="forecast-cell__temp">${e.temperature??"—"}°</div>
                  </div>
                `})}
            </div>
          </div>
        </div>

        <!-- Live schedules -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.schedules.title")}</h3><p class="card__sub">${c.filter(e=>e.active).length}</p></div></div>
          <div class="col" style="gap:12px">
            ${c.map(({schedule:e,active:t})=>V`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${t?"var(--ok)":"var(--text-muted)"};box-shadow:${t?"0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)":"none"}"></span>
                    <strong>${e.name}</strong>
                    ${t?V`<span class="chip chip--accent">${We(e.device_type,t.action)}</span>`:V`<span class="chip">${Ve("schedule.next_block")}</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                    ${Ve("device.open_schedule")} ${_e("chevron-right",12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${this.nowHour}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("live.devices.title")}</h3><p class="card__sub">${Ve("live.devices.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${t.map(e=>{const t=this.card.hass?.states?.[e.entity_id],i=Ee(e,t,this.card._settings),s=this._computeBarPercent(e,t);return V`
                <div class="live-device">
                  <div class="device-row__icon" style="width:36px;height:36px;background:${i.soft};color:${i.accent}">${we(e.type,17)}</div>
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
    `}_computeBarPercent(e,t){if(!t)return 0;const i=t.attributes||{};if("light"===e.type){const e=i.brightness;return"number"==typeof e?Math.round(e/255*100):"on"===t.state?100:0}if("fan"===e.type)return"number"==typeof i.percentage?i.percentage:0;if("blind"===e.type)return"number"==typeof i.current_position?i.current_position:0;if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return Math.min(100,Math.max(0,(e-5)/30*100))}return"on"===t.state||"open"===t.state?100:0}_formatState(e,t){if(!t)return"—";const i=t.attributes||{};if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return`${e.toFixed(1)}°`}return"fan"===e.type&&"number"==typeof i.percentage?`${i.percentage}%`:"blind"===e.type&&"number"==typeof i.current_position?`${i.current_position}%`:"light"===e.type&&"on"===t.state&&"number"==typeof i.brightness?`${Math.round(i.brightness/255*100)}%`:t.state}_conditionLabel(e){const t=`live.condition.${e}`,i=Ve(t);return i===t?e:i}};mt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],mt.prototype,"card",void 0),e([ve({type:Number})],mt.prototype,"nowHour",void 0),mt=e([he("chronos-live")],mt);let ft=class extends de{constructor(){super(...arguments),this.nowHour=0,this._step=0,this._name="",this._pickedDevices=[],this._days=[1,1,1,1,1,1,1],this._weatherEnabled=!0,this._blocks=[],this._blocksDeviceType="",this._selectedBlockIdx=-1,this._variant="linear"}get _steps(){return[{key:"name",label:Ve("wizard.step.name")},{key:"device",label:Ve("wizard.step.devices")},{key:"time",label:Ve("wizard.step.time")},{key:"days",label:Ve("wizard.step.days")},{key:"weather",label:Ve("wizard.step.weather")},{key:"review",label:Ve("wizard.step.review")}]}render(){return V`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${_e("chevron-left",14)} ${Ve("common.cancel")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${Ve("wizard.title")}</h1>
          <p class="page-sub">${Ve("wizard.subtitle")}</p>
        </div>

        <div class="wizard-stepper">
          ${this._steps.map((e,t)=>V`
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
            ${_e("chevron-left",14)} ${Ve("common.back")}
          </button>
          ${this._step<this._steps.length-1?V`<button class="btn btn--primary" @click=${()=>{this._step++}}>
                ${Ve("common.next")} ${_e("chevron-right",14)}
              </button>`:V`<button class="btn btn--primary" @click=${()=>this._finish()}>
                ${_e("check",14)} ${Ve("wizard.create")}
              </button>`}
        </div>
      </div>
    `}_renderStepContent(){switch(this._step){case 0:return V`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.name.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.name.hint")}</p>
            <input class="input" .value=${this._name} @input=${e=>{this._name=e.target.value}}
              placeholder="${Ve("nav.new_schedule")}"
              style="font-size:18px;padding:12px 14px"/>
          </div>
        `;case 1:return V`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.devices.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.devices.hint")}</p>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
              ${this.card._devices.map(e=>V`
                <button class="tile-pick" data-selected="${this._pickedDevices.includes(e.id)}"
                  @click=${()=>this._togglePick(e.id)}>
                  <div class="row" style="gap:10px">
                    <div class="tile-pick__icon">${we(e.type,16)}</div>
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
        `;case 2:{const e=this._inferDeviceType();this._ensureBlocksFor(e);const t=this._selectedBlockIdx>=0?this._blocks[this._selectedBlockIdx]:void 0,i=t?.action?Le(e,t.action.id):void 0,s=Ie(e);return V`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.time.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("editor.add_block_hint")}</p>

            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
              <span class="text-xs text-mute">${Ve("editor.timeline_variant")}:</span>
              <div class="segmented">
                ${["linear","radial","list"].map(e=>V`
                  <button data-active="${this._variant===e}" @click=${()=>{this._variant=e}}>
                    ${Ve("timeline."+e)}
                  </button>
                `)}
              </div>
              <div style="flex:1"></div>
              <button class="btn btn--sm" @click=${()=>this._addBlock(e)}>
                ${_e("plus",12)} ${Ve("common.add")}
              </button>
              <button class="btn btn--sm" @click=${()=>this._resetBlocks(e)}>
                ${_e("repeat",12)} ${Ve("wizard.time.reset_preset")}
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

            ${t?V`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div>
                    <div class="text-xs text-mute mono">${Ve("wizard.time.selected")}</div>
                    <div class="fw-600 mono">${this._fmtBlockRange(t)}</div>
                  </div>
                  <button class="btn btn--sm" style="color:var(--danger)" @click=${()=>this._removeSelected()}>
                    ${_e("trash",12)} ${Ve("editor.block.delete")}
                  </button>
                </div>
                <div class="field">
                  <label class="field__label">${Ve("editor.block.action")}</label>
                  <div class="row" style="gap:6px;flex-wrap:wrap">
                    ${s.map(i=>V`
                      <button class="chip" data-active="${t.action?.id===i.id}"
                        style="background:${t.action?.id===i.id?Oe(e,{id:i.id}):"var(--bg-sunken)"};color:${t.action?.id===i.id?"white":"var(--text-soft)"};border:1px solid ${t.action?.id===i.id?"transparent":"var(--border-soft)"};cursor:pointer"
                        @click=${()=>this._setAction(i.id)}>${i.label}</button>
                    `)}
                  </div>
                </div>
                ${i?.value?V`
                  <div class="field" style="margin-top:10px">
                    <label class="field__label">${i.value.label||Ve("common.value")} ${i.value.unit?V`<span class="text-mute">(${i.value.unit})</span>`:G}</label>
                    ${"number"===i.value.type?V`
                      <div class="row" style="gap:10px;align-items:center">
                        <input type="range" min="${i.value.min}" max="${i.value.max}" step="${i.value.step}"
                          .value=${String(t.action?.value??i.value.default)}
                          @input=${e=>this._setActionValue(parseFloat(e.target.value))}
                          style="flex:1"/>
                        <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${t.action?.value??i.value.default}${i.value.unit||""}</span>
                      </div>
                    `:"enum"===i.value.type?V`
                      <select class="input" @change=${e=>this._setActionValue(e.target.value)}>
                        ${(i.value.options||[]).map(e=>{const s=String(t.action?.value??i.value.default);return V`<option value="${e}" ?selected=${s===e}>${e}</option>`})}
                      </select>
                    `:G}
                  </div>
                `:G}
              </div>
            `:V`
              <p class="text-xs text-mute" style="margin:0">${Ve("editor.block.no_selection")}</p>
            `}

            <p class="text-xs text-mute" style="margin:0">${Ve("editor.coverage",{n:this._blocks.length,h:this._totalCoverage()})}</p>
          </div>
        `}case 3:return V`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.days.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.days.hint")}</p>
            <div class="row" style="gap:4px">
              ${nt().map((e,t)=>{const i=this._days[t];return V`
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
        `;case 4:return V`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${Ve("wizard.weather.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${Ve("wizard.weather.hint")}</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!0}}>
                <div class="tile-pick__icon">${_e("cloud",16)}</div>
                <div class="tile-pick__name">${Ve("wizard.weather.yes")}</div>
                <div class="tile-pick__desc">${Ve("wizard.weather.yes.desc")}</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!1}}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${_e("close",16)}</div>
                <div class="tile-pick__name">${Ve("wizard.weather.no")}</div>
                <div class="tile-pick__desc">${Ve("wizard.weather.no.desc")}</div>
              </button>
            </div>
          </div>
        `;case 5:return V`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">${Ve("wizard.review.heading")}</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">${Ve("editor.field.name")}</span><strong>${this._name||Ve("nav.new_schedule")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("nav.devices")}</span><strong>${Ve("wizard.review.devices",{n:this._pickedDevices.length})}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("editor.days.repeat")}</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("wizard.weather.heading")}</span><strong>${this._weatherEnabled?Ve("wizard.review.weather_on"):Ve("wizard.review.weather_off")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${Ve("wizard.step.time")}</span><strong>${this._blocks.length}</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">${Ve("wizard.review.note")}</p>
          </div>
        `;default:return G}}_togglePick(e){this._pickedDevices.includes(e)?this._pickedDevices=this._pickedDevices.filter(t=>t!==e):this._pickedDevices=[...this._pickedDevices,e]}_inferDeviceType(){if(!this._pickedDevices.length)return"thermostat";const e=this.card._devices.find(e=>e.id===this._pickedDevices[0]);return e?.type||"thermostat"}_defaultBlocks(e){const t=Pe(e);return[{start:0,end:7,action:{...t}},{start:7,end:22,action:{...t}},{start:22,end:24,action:{...t}}]}_ensureBlocksFor(e){this._blocksDeviceType!==e&&(this._blocks=this._defaultBlocks(e),this._blocksDeviceType=e,this._selectedBlockIdx=-1)}_resetBlocks(e){this._blocks=this._defaultBlocks(e),this._selectedBlockIdx=-1}_addBlock(e){const t=[...this._blocks].sort((e,t)=>e.start-t.start);let i=0,s=24;for(let e=0;e<=t.length;e++){const r=0===e?0:t[e-1].end,a=e===t.length?24:t[e].start;if(a-r>=1){i=r,s=Math.min(r+2,a);break}}s-i<.25&&(i=12,s=13);const r=[...this._blocks,{start:i,end:s,action:Pe(e)}];this._blocks=r.sort((e,t)=>e.start-t.start),this._selectedBlockIdx=this._blocks.findIndex(e=>e.start===i&&e.end===s)}_removeSelected(){this._selectedBlockIdx<0||(this._blocks=this._blocks.filter((e,t)=>t!==this._selectedBlockIdx),this._selectedBlockIdx=-1)}_setAction(e){if(this._selectedBlockIdx<0)return;const t=Le(this._inferDeviceType(),e),i=[...this._blocks];i[this._selectedBlockIdx]={...i[this._selectedBlockIdx],action:{id:e,value:t?.value?t.value.default:void 0}},this._blocks=i}_setActionValue(e){if(this._selectedBlockIdx<0)return;const t=[...this._blocks],i=t[this._selectedBlockIdx];t[this._selectedBlockIdx]={...i,action:{...i.action||{id:""},value:e}},this._blocks=t}_fmtBlockRange(e){const t=e=>{const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`};return`${t(e.start)} → ${t(e.end)}`}_totalCoverage(){const e=this._blocks.reduce((e,t)=>e+(t.end-t.start),0);return e.toFixed(1).replace(/\.0$/,"")}async _finish(){const e=this._inferDeviceType();this._ensureBlocksFor(e);const t={id:"",name:this._name,device_type:e,device_ids:this._pickedDevices,days:this._days,enabled:!0,blocks:[...this._blocks].sort((e,t)=>e.start-t.start),weather_rules:this._weatherEnabled?[{if:"temperature > 22°C",then:"Salta esecuzione",active:!0}]:[]};await this.card.doAddSchedule(t)}};ft.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],ft.prototype,"card",void 0),e([ve({type:Number})],ft.prototype,"nowHour",void 0),e([ge()],ft.prototype,"_step",void 0),e([ge()],ft.prototype,"_name",void 0),e([ge()],ft.prototype,"_pickedDevices",void 0),e([ge()],ft.prototype,"_days",void 0),e([ge()],ft.prototype,"_weatherEnabled",void 0),e([ge()],ft.prototype,"_blocks",void 0),e([ge()],ft.prototype,"_blocksDeviceType",void 0),e([ge()],ft.prototype,"_selectedBlockIdx",void 0),e([ge()],ft.prototype,"_variant",void 0),ft=e([he("chronos-wizard")],ft);let _t=class extends de{constructor(){super(...arguments),this.nowHour=0,this._pickerOpen=!1,this._search="",this._pickedAlias={},this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected="",this._busy=!1,this._lastError="",this._debugLog=[]}_log(e){const t=`${(new Date).toLocaleTimeString()} · ${e}`;console.log("[Chronos]",t),this._debugLog=[...this._debugLog.slice(-9),t]}_askRemove(e){this._log(`click TRASH id="${e}" (type=${typeof e})`),this._confirmRemoveId=e}async _doRemove(e){if(this._log(`click CONFIRM id="${e}" busy=${this._busy}`),this._busy)return void this._log("ABORT: busy=true");this._busy=!0,this._lastError="";const t=this.card._devices.length;this._log(`devices BEFORE remove: ${t}`);try{this._log(`calling doRemoveDevice("${e}")…`),await this.card.doRemoveDevice(e);const i=this.card._devices.length;this._log(`OK · devices AFTER: ${i} (delta=${i-t})`),i===t&&this._log("WARN: device count NON cambiato → backend non ha rimosso")}catch(e){const t=e?.message||String(e);this._lastError=t,this._log(`ERROR: ${t}`)}finally{this._busy=!1,this._confirmRemoveId="",this._bulkOpen=!1,this._bulkSelected="",this.requestUpdate()}}render(){const{_devices:e,_availableEntities:t}=this.card;return V`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${Ve("screen.devices.title")}</h1>
            <p class="page-sub">${Ve("devices.subtitle",{n:e.length})}</p>
          </div>
          <div class="row" style="gap:8px">
            <button class="btn" title="Force refresh from backend"
              @click=${async()=>{this._log("force REFRESH dal backend…");try{await this.card._reloadAllDebug(),this._log(`refresh OK · devices=${this.card._devices.length}`)}catch(e){this._log(`refresh ERROR: ${e?.message||e}`)}}}>
              ${_e("repeat",14)}
            </button>
            ${e.length?V`
              <button class="btn" @click=${()=>{this._bulkOpen=!0,this._bulkSelected=e[0]?.id||""}}>
                ${_e("trash",14)} ${Ve("devices.unlink")}…
              </button>
            `:G}
            <button class="btn btn--primary" @click=${()=>{this._pickerOpen=!0}}>
              ${_e("plus",14)} ${Ve("devices.add_entity")}
            </button>
          </div>
        </div>

        ${this._lastError?V`
          <div style="padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:6px;font-size:12.5px;font-family:ui-monospace,monospace">
            ${this._lastError}
          </div>
        `:G}

        <div class="card">
          <div class="col" style="gap:0">
            ${e.map(e=>{const t=ot[e.type]||{label:e.type},i=this.card.hass?.states?.[e.entity_id],s=i?.state||"—",r=Ee(e,i,this.card._settings);return V`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center;position:relative">
                  <div class="device-row__icon" style="background:${r.soft};color:${r.accent};flex:0 0 auto;border:1px solid ${r.soft}">
                    ${we(e.type,17)}
                  </div>
                  <div class="device-row__main" style="min-width:0">
                    <input class="input" .value=${e.alias}
                      @change=${t=>this.card.doUpdateDevice(e.id,{alias:t.target.value})}
                      style="border:1px solid transparent;background:transparent;padding:4px 6px;font-weight:500;font-size:14px;margin-left:-6px;width:100%;max-width:240px"
                      placeholder="${Ve("devices.alias")}…"/>
                    <div class="device-row__meta" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--text-muted)">${e.entity_id}</span>
                      ${e.area?V` · ${e.area}`:G}
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
                    title="${Ve("devices.unlink")}: ${e.alias}">
                    ${_e("trash",12)} ${Ve("common.remove")}
                  </button>
                </div>
              `})}
            ${e.length?G:V`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${_e("device",22)}</div>
              <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("devices.empty.title")}</div>
              <div style="font-size:12.5px;margin-top:4px">${Ve("devices.empty.hint")}</div>
            </div>`}
          </div>
        </div>

        <p class="text-xs text-mute" style="margin:0">${Ve("devices.types_hint")}</p>

        ${this._debugLog.length?V`
          <details style="font-size:11px;font-family:ui-monospace,monospace;background:var(--bg-sunken);border-radius:8px;padding:8px 12px;color:var(--text-soft)">
            <summary style="cursor:pointer;font-weight:600">Debug log (${this._debugLog.length})</summary>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:2px">
              ${this._debugLog.map(e=>V`<div>${e}</div>`)}
            </div>
            <button class="btn btn--sm" style="margin-top:8px" @click=${()=>{this._debugLog=[]}}>Clear log</button>
          </details>
        `:G}

        ${this._pickerOpen?this._renderPicker(t):G}
        ${this._confirmRemoveId?this._renderConfirm():G}
        ${this._bulkOpen?this._renderBulkRemove():G}
      </div>
    `}_renderConfirm(){const e=this.card._devices.find(e=>e.id===this._confirmRemoveId);return e?V`
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
              ${_e("trash",12)} ${this._busy?"…":Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `:G}_renderBulkRemove(){const e=this.card._devices,t=e.find(e=>e.id===this._bulkSelected);return V`
      <div class="modal-overlay" @click=${()=>{this._bulkOpen=!1}}>
        <div class="card" style="width:min(520px,100%);padding:22px" @click=${e=>e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${Ve("devices.unlink")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 14px">
            ${"devices.bulk_remove.hint"!==Ve("devices.bulk_remove.hint")?Ve("devices.bulk_remove.hint"):"Seleziona il dispositivo da scollegare. Verrà rimosso anche dalle schedulazioni che lo usano."}
          </p>
          <select class="select mono" style="margin-bottom:12px"
            @change=${e=>{this._bulkSelected=e.target.value}}>
            ${e.map(e=>V`
              <option value="${e.id}" ?selected=${e.id===this._bulkSelected}>${e.alias} — ${e.entity_id}</option>
            `)}
          </select>
          ${t?V`
            <div class="card card--ghost" style="padding:12px;margin-bottom:14px">
              <div class="row" style="gap:10px;align-items:center">
                <div class="device-row__icon">${we(t.type,16)}</div>
                <div>
                  <div class="fw-600">${t.alias}</div>
                  <div class="text-xs text-mute mono">${t.entity_id}</div>
                </div>
              </div>
            </div>
          `:G}
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${()=>{this._bulkOpen=!1}}>${Ve("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              ?disabled=${this._busy||!this._bulkSelected}
              @click=${()=>this._doRemove(this._bulkSelected)}>
              ${_e("trash",12)} ${this._busy?"…":Ve("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `}_renderPicker(e){const t=e.filter(e=>!this._search||(e.entity_id+e.friendly_name).toLowerCase().includes(this._search.toLowerCase()));return V`
      <div class="modal-overlay" @click=${()=>{this._pickerOpen=!1}}>
        <div class="card" style="width:min(640px,100%);max-height:80vh;display:flex;flex-direction:column" @click=${e=>e.stopPropagation()}>
          <div class="sp-between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0">${Ve("devices.picker.title")}</h3>
              <p class="text-mute text-sm" style="margin:2px 0 0">${Ve("devices.picker.count",{n:e.length})}</p>
            </div>
            <button class="btn btn--icon btn--ghost" @click=${()=>{this._pickerOpen=!1}}>${_e("close",16)}</button>
          </div>
          <input class="input" placeholder="${Ve("devices.picker.search")}" .value=${this._search}
            @input=${e=>{this._search=e.target.value}}
            style="margin-bottom:12px"/>
          <div style="overflow:auto;flex:1;display:flex;flex-direction:column;gap:4px">
            ${t.map(e=>{const t=e.type||"plug",i=ot[t]||{label:t};return V`
                <div class="device-row" style="background:var(--bg-sunken);padding:10px 12px">
                  <div class="device-row__icon">${we(t,16)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.friendly_name}</div>
                    <div class="device-row__meta"><span class="mono">${e.entity_id}</span> · ${e.area||""}</div>
                  </div>
                  <input class="input" placeholder="${Ve("devices.alias.placeholder")}"
                    .value=${this._pickedAlias[e.entity_id]||""}
                    @input=${t=>{this._pickedAlias={...this._pickedAlias,[e.entity_id]:t.target.value}}}
                    style="width:160px;font-size:12px"/>
                  <span class="chip chip--accent">${i.label}</span>
                  <button class="btn btn--sm btn--primary" @click=${async()=>{await this.card.doAddDevice(e.entity_id,this._pickedAlias[e.entity_id]||void 0),this._pickedAlias={...this._pickedAlias,[e.entity_id]:""}}}>${_e("plus",12)} ${Ve("devices.import")}</button>
                </div>
              `})}
            ${e.length?G:V`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text);font-size:14px">${Ve("devices.picker.all_imported")}</div>
              <div style="font-size:12.5px;margin-top:4px">${Ve("devices.picker.all_imported.hint")}</div>
            </div>`}
          </div>
        </div>
      </div>
    `}};_t.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],_t.prototype,"card",void 0),e([ve({type:Number})],_t.prototype,"nowHour",void 0),e([ge()],_t.prototype,"_pickerOpen",void 0),e([ge()],_t.prototype,"_search",void 0),e([ge()],_t.prototype,"_pickedAlias",void 0),e([ge()],_t.prototype,"_confirmRemoveId",void 0),e([ge()],_t.prototype,"_bulkOpen",void 0),e([ge()],_t.prototype,"_bulkSelected",void 0),e([ge()],_t.prototype,"_busy",void 0),e([ge()],_t.prototype,"_lastError",void 0),e([ge()],_t.prototype,"_debugLog",void 0),_t=e([he("chronos-devices-screen")],_t);let bt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._settings;return e?V`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">${Ve("screen.settings.title")}</h1>
          <p class="page-sub">${Ve("settings.subtitle")}</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.language.title")}</h3><p class="card__sub">${Ve("settings.language.subtitle")}</p></div></div>
          <div class="segmented">
            ${["auto","it","en","fr","de"].map(t=>V`
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
                ${this.card._weatherEntities.map(t=>V`
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
                ${[1,5,15].map(t=>V`
                  <button data-active="${e.polling_minutes===t}" @click=${()=>this._updateSetting("polling_minutes",t)}>${t} ${Ve("common.min")}</button>
                `)}
              </div>
              <span class="field__hint">${Ve("settings.polling.hint")}</span>
            </div>
            <div class="field">
              <label class="field__label">${Ve("settings.snap")}</label>
              <div class="segmented">
                ${[5,15,30,60].map(t=>V`
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
            ${[["notify_block_executed",Ve("settings.notify.block_executed"),Ve("settings.notify.block_executed.desc")],["notify_rule_triggered",Ve("settings.notify.rule_triggered"),Ve("settings.notify.rule_triggered.desc")],["notify_sched_skipped",Ve("settings.notify.sched_skipped"),Ve("settings.notify.sched_skipped.desc")],["notify_command_error",Ve("settings.notify.command_error"),Ve("settings.notify.command_error.desc")]].map(([t,i,s])=>V`
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.appearance.title")}</h3><p class="card__sub">${Ve("settings.appearance.subtitle")}</p></div></div>
          <div class="field">
            <label class="field__label">${Ve("settings.density")}</label>
            <div class="segmented">
              ${["comfortable","compact"].map(t=>V`
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
            ${["linear","radial","list"].map(t=>V`
              <button data-active="${e.default_timeline_variant===t}" @click=${()=>this._updateSetting("default_timeline_variant",t)}>
                ${Ve("timeline."+t)}
              </button>
            `)}
          </div>
        </div>

        ${this._renderColorsSection()}
      </div>
    `:V`<div class="text-mute">${Ve("common.loading")}</div>`}_renderColorsSection(){const e=this.card._settings,t=Ae(e,"thermostat"),i=Ae(e,"boiler"),s=ze(e),r=Ce(e);return V`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${Ve("settings.colors.title")}</h3><p class="card__sub">${Ve("settings.colors.subtitle")}</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">${Ve("settings.colors.lights.title")}</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">${Ve("settings.colors.lights.desc")}</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${r}
                @change=${e=>this._updateSetting("color_light_use_state",e.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops(Ve("settings.colors.thermostat.title"),Ve("settings.colors.thermostat.desc"),t,"color_stops_climate",$e)}

          ${this._renderTempStops(Ve("settings.colors.boiler.title"),Ve("settings.colors.boiler.desc"),i,"color_stops_boiler",ke)}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">${Ve("settings.colors.preset.title")}</div>
                <div class="text-xs text-mute">${Ve("settings.colors.preset.desc")}</div>
              </div>
              <button class="btn btn--sm" @click=${()=>this._updateSetting("color_presets",{...Se})}>
                ${_e("repeat",12)} ${Ve("common.default")}
              </button>
            </div>
            <div class="grid-2" style="gap:8px">
              ${Object.entries(s).map(([e,t])=>V`
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
    `}_renderTempStops(e,t,i,s,r){return V`
      <div>
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
          <div>
            <div class="fw-600" style="font-size:13.5px">${e}</div>
            <div class="text-xs text-mute">${t}</div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn btn--sm" @click=${()=>this._addStop(i,s)}>
              ${_e("plus",12)} ${Ve("settings.colors.add_stop")}
            </button>
            <button class="btn btn--sm" @click=${()=>this._updateSetting(s,r.map(e=>({...e})))}>
              ${_e("repeat",12)} ${Ve("common.default")}
            </button>
          </div>
        </div>
        <div class="col" style="gap:6px">
          ${i.map((e,t)=>{const r=t===i.length-1;return V`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <span class="text-sm text-mute" style="width:18px">${r?">":"≤"}</span>
                ${r?V`<span class="mono text-sm" style="width:80px">${i[t-1]?.max??0}°+</span>`:V`<input type="number" class="input mono" step="0.5" .value=${String(e.max)}
                      @change=${e=>this._updateStopMax(i,s,t,parseFloat(e.target.value))}
                      style="width:80px;font-size:13px"/>`}
                <span class="text-sm text-mute">°C</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${e.color};border:1px solid var(--border)"></div>
                <span class="mono text-xs" style="flex:1;color:var(--text-muted)">${e.color}</span>
                <input type="color" .value=${e.color}
                  @change=${e=>this._updateStopColor(i,s,t,e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                ${i.length>1?V`
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._removeStop(i,s,t)} title="${Ve("common.remove")}">
                    ${_e("trash",12)}
                  </button>
                `:G}
              </div>
            `})}
        </div>
      </div>
    `}_addStop(e,t){const i=e.filter(e=>e.max<900),s={max:(i.length?i[i.length-1].max:20)+5,color:"#9ca3af"},r=e.find(e=>e.max>=900),a=[...i,s];r&&a.push(r),this._updateSetting(t,a)}_removeStop(e,t,i){const s=e.filter((e,t)=>t!==i);this._updateSetting(t,s)}_updateStopMax(e,t,i,s){if(isNaN(s))return;const r=e.map((e,t)=>t===i?{...e,max:s}:e);this._updateSetting(t,r)}_updateStopColor(e,t,i,s){const r=e.map((e,t)=>t===i?{...e,color:s}:e);this._updateSetting(t,r)}_updatePresetColor(e,t){const i=ze(this.card._settings);this._updateSetting("color_presets",{...i,[e]:t})}_renderSensorOverrides(){const e=this.card._settings.weather_sensor_map||{},t=this.card._sensorEntities||[],i=(this.card._weatherAttributes||[]).filter(e=>!e.key.startsWith("forecast."));if(!i.length)return G;const s=this._groupSensorsByDeviceClass(t);return V`
      <div class="field" style="margin-top:8px">
        <label class="field__label">${Ve("settings.weather.overrides.title")}</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          ${Ve("settings.weather.overrides.hint")}
        </span>
        ${t.length?G:V`
          <div style="padding:10px 12px;background:#fef3c7;color:#92400e;border-radius:var(--r-md);font-size:12.5px">
            ${Ve("settings.weather.overrides.no_sensors")}
          </div>
        `}
        <div class="col" style="gap:6px">
          ${i.map(i=>{const r=e[i.key]||"",a=t.find(e=>e.entity_id===r),n=a?`${a.state}${a.unit_of_measurement?" "+a.unit_of_measurement:""}`:"",o=r&&a?this._compatWarning(i,a):"";return V`
              <div class="col" style="gap:4px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md)">
                <div class="row" style="gap:10px;align-items:center;flex-wrap:wrap">
                  <div style="min-width:160px">
                    <div class="fw-600 text-sm">${Fe(i.key,i.label)}</div>
                    <div class="text-xs text-mute mono">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                  </div>
                  <select class="select mono" style="flex:1;min-width:240px"
                    @change=${e=>this._updateSensorOverride(i.key,e.target.value)}>
                    <option value="" ?selected=${!r}>${Ve("settings.weather.overrides.use_main")}</option>
                    ${this._renderSensorOptions(s,i,r)}
                  </select>
                  ${r?V`
                    <span class="mono text-xs" style="color:${o?"#b45309":"var(--text-muted)"};min-width:90px;text-align:right;font-weight:${o?600:400}">${n}</span>
                    <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._updateSensorOverride(i.key,"")} title="${Ve("common.remove")}">
                      ${_e("close",12)}
                    </button>
                  `:G}
                </div>
                ${o?V`
                  <div class="text-xs" style="color:#b45309;padding:6px 8px;background:#fef3c7;border-radius:6px;margin-top:2px">
                    ${_e("info",11)} ${o}
                  </div>
                `:G}
              </div>
            `})}
        </div>
      </div>
    `}_compatWarning(e,t){const i=(e.unit||"").trim(),s=(t.unit_of_measurement||"").trim(),r=this._matchingDeviceClass(e.key),a=t.device_class||"";if("condition"===e.key){const e=String(t.state||"");return e&&!isNaN(parseFloat(e))?Ve("settings.weather.overrides.warn.numeric_for_condition",{state:e}):""}const n=t.state;return null!=n&&""!==n&&isNaN(parseFloat(n))?Ve("settings.weather.overrides.warn.not_numeric",{state:String(n)}):i&&s&&i!==s?Ve("settings.weather.overrides.warn.unit_mismatch",{expected:i,got:s}):r&&a&&r!==a?Ve("settings.weather.overrides.warn.class_mismatch",{expected:r,got:a}):""}_groupSensorsByDeviceClass(e){const t={};for(const i of e){const e=i.device_class||"other";(t[e]=t[e]||[]).push(i)}return t}_renderSensorOptions(e,t,i){const s=this._matchingDeviceClass(t.key),r=s&&e[s]?[s,...Object.keys(e).filter(e=>e!==s).sort()]:Object.keys(e).sort();return r.map(t=>V`
      <optgroup label="${"other"===t?Ve("settings.weather.overrides.others"):t}${t===s?" · "+Ve("settings.weather.overrides.suggested"):""}">
        ${e[t].map(e=>V`
          <option value="${e.entity_id}" ?selected=${i===e.entity_id}>
            ${e.entity_id}${e.unit_of_measurement?` (${e.unit_of_measurement})`:""} — ${e.friendly_name}
          </option>
        `)}
      </optgroup>
    `)}_matchingDeviceClass(e){return{temperature:"temperature",humidity:"humidity",wind_speed:"wind_speed",wind_bearing:"wind_direction",pressure:"atmospheric_pressure",uv_index:"uv_index"}[e]||null}_updateSensorOverride(e,t){const i={...this.card._settings?.weather_sensor_map||{}};t?i[e]=t:delete i[e],this._updateSetting("weather_sensor_map",i)}_updateSetting(e,t){this.card.doUpdateSettings({[e]:t})}};bt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],bt.prototype,"card",void 0),e([ve({type:Number})],bt.prototype,"nowHour",void 0),bt=e([he("chronos-settings-screen")],bt);const wt=[{id:"thermostat_day_night",device_type:"thermostat",default_name_key:"recipe.thermostat_day_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:7,action:{id:"set_temperature",value:18}},{start:7,end:22,action:{id:"set_temperature",value:21}},{start:22,end:24,action:{id:"set_temperature",value:18}}],weather_rules:[{if:"temperature > 22",then:"Salta esecuzione",active:!0}]},{id:"lights_at_sunset",device_type:"light",default_name_key:"recipe.lights_at_sunset.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:18,end:23,start_anchor:"sunset",start_offset:-30,action:{id:"turn_on",value:80}}],weather_rules:[]},{id:"blinds_wind_safety",device_type:"blind",default_name_key:"recipe.blinds_wind_safety.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:7,end:19,start_anchor:"sunrise",start_offset:0,end_anchor:"sunset",end_offset:0,action:{id:"set_position",value:100}}],weather_rules:[{if:"wind_speed > 30",then:"Forza: Chiudi",active:!0,trigger_action:{action_id:"close_cover"},fire_mode:"once_per_daytime"}]},{id:"irrigation_skip_rain",device_type:"irrigation",default_name_key:"recipe.irrigation_skip_rain.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:6,end:6.5,action:{id:"turn_on",value:30}}],weather_rules:[{if:"forecast.rain_6h > 2",then:"Salta esecuzione",active:!0}]},{id:"boiler_eco_night",device_type:"boiler",default_name_key:"recipe.boiler_eco_night.preset_name",days:[1,1,1,1,1,1,1],blocks:[{start:0,end:6,action:{id:"set_operation",value:"eco"}},{start:6,end:23,action:{id:"set_operation",value:"electric"}},{start:23,end:24,action:{id:"set_operation",value:"eco"}}],weather_rules:[]}];let xt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){return V`
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

        <div class="grid-auto" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
          ${wt.map(e=>this._renderRecipe(e))}
        </div>

        <div class="card">
          <h3 class="card__title" style="margin:0 0 10px">${Ve("help.glossary.title")}</h3>
          <div class="col" style="gap:10px">
            ${[["help.glossary.block.title","help.glossary.block.body"],["help.glossary.anchor.title","help.glossary.anchor.body"],["help.glossary.rule.title","help.glossary.rule.body"],["help.glossary.fire_mode.title","help.glossary.fire_mode.body"],["help.glossary.override.title","help.glossary.override.body"]].map(([e,t])=>V`
              <div>
                <div class="fw-600 text-sm">${Ve(e)}</div>
                <div class="text-sm" style="color:var(--text-soft);line-height:1.5">${Ve(t)}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderRecipe(e){e.blocks.reduce((e,t)=>e+(t.end-t.start),0);const t=e.blocks.some(e=>e.start_anchor||e.end_anchor),i=e.weather_rules.some(e=>e.trigger_action);return V`
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
          ${t?V`<span class="chip chip--weather">${_e("sun",11)} ${Ve("help.tag.anchored")}</span>`:G}
          ${e.weather_rules.length?V`<span class="chip chip--accent">${_e("cloud",11)} ${e.weather_rules.length} ${Ve("nav.weather_rules").toLowerCase()}</span>`:G}
          ${i?V`<span class="chip" style="background:#fef3c7;color:#92400e">${_e("bolt",11)} ${Ve("help.tag.trigger")}</span>`:G}
        </div>

        <button class="btn btn--primary" @click=${()=>this._createFromRecipe(e)}>
          ${_e("plus",13)} ${Ve("help.create_button")}
        </button>
      </div>
    `}_renderTimelinePreview(e){return V`
      <svg viewBox="0 0 ${280} ${18}" style="width:100%;height:18px;border-radius:4px;background:var(--bg-sunken)">
        ${e.blocks.map(t=>{const i=t.start/24*280,s=(t.end-t.start)/24*280;return V`<rect x="${i}" y="0" width="${Math.max(2,s)}" height="${18}" fill="${Oe(e.device_type,t.action)}" rx="2"/>`})}
      </svg>
    `}async _createFromRecipe(e){const t={id:"",name:Ve(e.default_name_key),device_type:e.device_type,device_ids:[],days:e.days,enabled:!1,blocks:e.blocks.map(e=>({...e,action:{...e.action}})),weather_rules:e.weather_rules.map(e=>({...e}))};await this.card.doAddSchedule(t)}};xt.styles=fe,e([ve({attribute:!1,hasChanged:()=>!0})],xt.prototype,"card",void 0),e([ve({type:Number})],xt.prototype,"nowHour",void 0),xt=e([he("chronos-help-screen")],xt);const yt={overview:["screen.overview.title","chronos / overview"],editor:["screen.editor.title","chronos / schedule / edit"],weatherRule:["screen.weather_rule.title","chronos / schedule / weather"],weatherRulesList:["nav.weather_rules","chronos / weather"],device:["screen.device.title","chronos / device"],week:["screen.week.title","chronos / week"],live:["screen.live.title","chronos / live"],wizard:["screen.wizard.title","chronos / wizard"],devices:["screen.devices.title","chronos / devices"],settings:["screen.settings.title","chronos / settings"],help:["nav.help","chronos / help"]};let $t=class extends de{constructor(){super(...arguments),this._screen="overview",this._selectedId="",this._deviceDetailId="",this._schedules=[],this._savedSchedules=[],this._devices=[],this._settings=null,this._timelineVariant="linear",this._pendingNav=null,this._loading=!0,this._loadError=null,this._actionsMap={},this._weatherAttributes=[],this._forecast=[],this._availableEntities=[],this._weatherEntities=[],this._sensorEntities=[],this._mobile=!1,this._drawerOpen=!1,this._appliedLang=""}setConfig(e){this.config=e}static getStubConfig(){return{type:"custom:chronos-card"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{for(const t of e)this._mobile=t.contentRect.width<700}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}async firstUpdated(){await this._loadAll()}updated(e){e.has("hass")&&this.hass&&function(e){rt=e}(this.hass),e.has("_settings")&&this._settings&&(this._settings.density&&this.setAttribute("density",this._settings.density),this._applyLanguage())}_applyLanguage(){const e=this._settings?.language,t=function(e){const t=(e||"").toLowerCase().split("-")[0];return Ue=je.includes(t)?t:"it",Ue}(e&&"auto"!==e?e:this.hass?.language);this._appliedLang!==t&&(this._appliedLang=t,this.requestUpdate())}async _loadAll(){if(!this.hass)return;this._loading=!0,this._loadError=null;const e=async(e,t,i)=>{try{return await e()}catch(e){console.error(`Chronos: ${i} failed`,e);const s=e?.message||String(e);return this._loadError=(this._loadError?this._loadError+" · ":"")+`${i}: ${s}`,t}};try{const[t,i,s,r,a,n,o,l,d]=await Promise.all([e(()=>Ze(this.hass),[],"devices/list"),e(()=>Je(this.hass),[],"schedules/list"),e(()=>Qe(this.hass),null,"settings/get"),e(()=>async function(e){return e.callWS({type:"chronos/actions"})}(this.hass),{},"actions"),e(()=>async function(e){return e.callWS({type:"chronos/weather/attributes"})}(this.hass),[],"weather/attributes"),e(()=>async function(e){return e.callWS({type:"chronos/preview/forecast"})}(this.hass),[],"preview/forecast"),e(()=>Xe(this.hass),[],"entities/available"),e(()=>async function(e){return e.callWS({type:"chronos/weather/entities"})}(this.hass),[],"weather/entities"),e(()=>async function(e){return e.callWS({type:"chronos/sensor/entities"})}(this.hass),[],"sensor/entities")]);this._devices=t,this._schedules=i,this._savedSchedules=JSON.parse(JSON.stringify(i)),this._settings=s,this._actionsMap=r,this._weatherAttributes=a,this._forecast=n,this._availableEntities=o,this._weatherEntities=l,this._sensorEntities=d,Ne=r,De(s),s?.snap_minutes&&it(s.snap_minutes),s?.default_timeline_variant&&(this._timelineVariant=s.default_timeline_variant),i.length&&!this._selectedId&&(this._selectedId=i[0].id),t.length&&!this._deviceDetailId&&(this._deviceDetailId=t[0].id)}catch(e){console.error("Chronos: failed to load data",e)}this._loading=!1}navigate(e){JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)&&"editor"===this._screen&&"editor"!==e?this._pendingNav=e:this._screen=e,this._drawerOpen=!1}selectSchedule(e,t){this._selectedId=e,t&&(this._screen=t)}selectDevice(e){this._deviceDetailId=e}get isDirty(){return JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)}async saveCurrentSchedule(){const e=this._schedules.find(e=>e.id===this._selectedId);if(!e)return;const t=await Ke(this.hass,e),i=this._schedules.findIndex(e=>e.id===t.id);i>=0&&(this._schedules=[...this._schedules.slice(0,i),t,...this._schedules.slice(i+1)]),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}updateScheduleLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,...t}:i)}updateBlocksLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,blocks:[...t].sort((e,t)=>e.start-t.start)}:i)}async doToggleSchedule(e,t){try{await async function(e,t,i){await e.callWS({type:"chronos/schedules/toggle",schedule_id:String(t),enabled:i})}(this.hass,e,t),this._schedules=this._schedules.map(i=>i.id===e?{...i,enabled:t}:i),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: toggleSchedule failed",e),await this._reloadAfterError()}}async doAddDevice(e,t){try{await async function(e,t,i,s){return e.callWS({type:"chronos/devices/add",entity_id:t,alias:i,area:s})}(this.hass,e,t)}catch(e){console.error("Chronos: addDevice failed",e)}this._devices=await Ze(this.hass),this._availableEntities=await Xe(this.hass)}async doUpdateDevice(e,t){try{await async function(e,t,i){return e.callWS({type:"chronos/devices/update",device_id:String(t),patch:i})}(this.hass,e,t)}catch(e){console.error("Chronos: updateDevice failed",e)}this._devices=await Ze(this.hass)}async doRemoveDevice(e){try{await async function(e,t){await e.callWS({type:"chronos/devices/remove",device_id:String(t)})}(this.hass,e)}catch(e){throw console.error("Chronos: removeDevice WS failed",e),e}try{this._devices=await Ze(this.hass)}catch(e){console.error("Chronos: fetchDevices after remove failed",e)}try{this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: fetchSchedules after remove failed",e)}try{this._availableEntities=await Xe(this.hass)}catch(e){console.error("Chronos: fetchAvailableEntities after remove failed",e)}}async doRemoveSchedule(e){try{await async function(e,t){await e.callWS({type:"chronos/schedules/remove",schedule_id:String(t)})}(this.hass,e)}catch(e){console.error("Chronos: removeSchedule failed",e)}this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId===e&&this._schedules.length?this._selectedId=this._schedules[0].id:this._schedules.length||(this._selectedId="")}async doAddSchedule(e){try{const t=await Ke(this.hass,e);this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId=t.id,this._screen="editor"}catch(e){console.error("Chronos: addSchedule failed",e)}}async doUpdateSettings(e){try{const t=await async function(e,t){return e.callWS({type:"chronos/settings/update",patch:t})}(this.hass,e);this._settings=t}catch(e){console.error("Chronos: updateSettings failed",e),this._settings=await Qe(this.hass)}De(this._settings),this._settings?.snap_minutes&&it(this._settings.snap_minutes)}async _reloadAllDebug(){await this._loadAll()}_isDark(){return!!this.hass?.themes?.darkMode}async _toggleHaTheme(){const e=!this._isDark();try{await this.hass.callService("frontend","set_theme",{name:"default",mode:e?"dark":"light"})}catch(e){console.error("Chronos: cannot toggle HA theme",e)}}async _reloadAfterError(){try{this._devices=await Ze(this.hass),this._schedules=await Je(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._settings=await Qe(this.hass)}catch{}}setTimelineVariant(e){this._timelineVariant=e}render(){if(this._loading)return V`<div style="padding:40px;text-align:center;color:var(--text-muted)">${Ve("common.loading")}</div>`;const e=this._loadError?V`<div style="margin:10px;padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:4px;font-size:12.5px;font-family:ui-monospace,monospace">
          Chronos load errors: ${this._loadError}
        </div>`:G,[t,i]=yt[this._screen]||yt.overview,s=Ve(t),r=new Date,a=r.getHours()+r.getMinutes()/60,n=this._mobile&&this._drawerOpen,o=this._mobile?n?"drawer":"mini":"full";return V`
      ${e}
      <div class="app" data-mobile="${this._mobile}" data-drawer="${n}">
        ${this._renderSidebar(o)}
        ${n?V`<div class="sidebar-backdrop" @click=${()=>{this._drawerOpen=!1}}></div>`:G}
        <main class="content">
          ${this._renderTopbar(s,i,a)}
          <div class="content__inner">
            ${this._renderScreen(a)}
          </div>
        </main>
        ${this._pendingNav?this._renderDirtyModal():G}
      </div>
    `}_renderSidebar(e){const t=[{key:"overview",label:Ve("nav.overview"),iconName:"dashboard"},{key:"editor",label:Ve("nav.editor"),iconName:"clock"},{key:"week",label:Ve("nav.week"),iconName:"calendar"},{key:"weatherRulesList",label:Ve("nav.weather_rules"),iconName:"cloud"},{key:"device",label:Ve("nav.devices"),iconName:"device"},{key:"live",label:Ve("nav.live"),iconName:"live"}],i=[{key:"wizard",label:Ve("nav.new_schedule"),iconName:"wand"},{key:"devices",label:Ve("nav.manage_devices"),iconName:"device"},{key:"help",label:Ve("nav.help"),iconName:"info"}],s="mini"===e,r=this._mobile;return V`
      <aside class="sidebar" data-mode="${e}">
        ${r?V`
              <button class="sidebar__hamburger" title="${Ve(s?"nav.menu_open":"nav.menu_close")}"
                @click=${()=>{this._drawerOpen=!this._drawerOpen}}>
                ${_e(s?"menu":"close",18)}
              </button>
            `:G}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark" style="background:transparent;box-shadow:none;padding:0;overflow:hidden">
            <img src="/local/chronos-icon.png?v=${Ge}" alt="Chronos"
              style="width:100%;height:100%;object-fit:contain;display:block"
              @error=${e=>{e.target.style.display="none",e.target.parentElement.textContent="C",e.target.parentElement.style.background="linear-gradient(135deg, var(--accent), var(--weather))",e.target.parentElement.style.color="white"}}/>
          </div>
          ${s?G:V`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v${Ge} · HACS</div>
              </div>`}
        </div>
        ${s?G:V`<div class="nav-section">${Ve("nav.section.main")}</div>`}
        ${t.map(e=>V`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${s?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${_e(e.iconName,16)} ${s?G:V`<span>${e.label}</span>`}
            </button>
          `)}
        ${s?G:V`<div class="nav-section">${Ve("nav.section.actions")}</div>`}
        ${i.map(e=>V`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${s?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${_e(e.iconName,16)} ${s?G:V`<span>${e.label}</span>`}
            </button>
          `)}
        <div class="sidebar__footer">
          <button class="nav-item" data-active="${"settings"===this._screen}"
            title="${s?Ve("nav.settings"):""}" @click=${()=>this.navigate("settings")}>
            ${_e("settings",16)} ${s?G:V`<span>${Ve("nav.settings")}</span>`}
          </button>
        </div>
      </aside>
    `}_renderTopbar(e,t,i){return V`
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
        <button class="btn btn--icon btn--ghost" @click=${()=>this._toggleHaTheme()}
          title="${this._isDark()?"Light theme":"Dark theme"}">
          ${_e(this._isDark()?"sun":"moon",16)}
        </button>
      </div>
    `}_renderScreen(e){switch(this._screen){case"overview":default:return V`<chronos-overview .card=${this} .nowHour=${e}></chronos-overview>`;case"editor":return V`<chronos-editor .card=${this} .nowHour=${e}></chronos-editor>`;case"weatherRule":return V`<chronos-weather-rule .card=${this} .nowHour=${e}></chronos-weather-rule>`;case"weatherRulesList":return V`<chronos-weather-rules-list .card=${this} .nowHour=${e}></chronos-weather-rules-list>`;case"device":return V`<chronos-device-screen .card=${this} .nowHour=${e}></chronos-device-screen>`;case"week":return V`<chronos-week .card=${this} .nowHour=${e}></chronos-week>`;case"live":return V`<chronos-live .card=${this} .nowHour=${e}></chronos-live>`;case"wizard":return V`<chronos-wizard .card=${this} .nowHour=${e}></chronos-wizard>`;case"devices":return V`<chronos-devices-screen .card=${this} .nowHour=${e}></chronos-devices-screen>`;case"settings":return V`<chronos-settings-screen .card=${this} .nowHour=${e}></chronos-settings-screen>`;case"help":return V`<chronos-help-screen .card=${this} .nowHour=${e}></chronos-help-screen>`}}_renderDirtyModal(){return V`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">${Ve("modal.unsaved.title")}</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">${Ve("modal.unsaved.body")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${()=>{this._pendingNav=null}}>${Ve("modal.unsaved.stay")}</button>
            <button class="btn" @click=${()=>{this._schedules=JSON.parse(JSON.stringify(this._savedSchedules)),this._screen=this._pendingNav,this._pendingNav=null}}>${Ve("modal.unsaved.discard")}</button>
            <button class="btn btn--primary" @click=${async()=>{await this.saveCurrentSchedule(),this._screen=this._pendingNav,this._pendingNav=null}}>${_e("check",14)} ${Ve("modal.unsaved.save")}</button>
          </div>
        </div>
      </div>
    `}};$t.styles=[me,fe],e([ve({attribute:!1})],$t.prototype,"hass",void 0),e([ve({attribute:!1})],$t.prototype,"config",void 0),e([ge()],$t.prototype,"_screen",void 0),e([ge()],$t.prototype,"_selectedId",void 0),e([ge()],$t.prototype,"_deviceDetailId",void 0),e([ge()],$t.prototype,"_schedules",void 0),e([ge()],$t.prototype,"_savedSchedules",void 0),e([ge()],$t.prototype,"_devices",void 0),e([ge()],$t.prototype,"_settings",void 0),e([ge()],$t.prototype,"_timelineVariant",void 0),e([ge()],$t.prototype,"_pendingNav",void 0),e([ge()],$t.prototype,"_loading",void 0),e([ge()],$t.prototype,"_loadError",void 0),e([ge()],$t.prototype,"_actionsMap",void 0),e([ge()],$t.prototype,"_weatherAttributes",void 0),e([ge()],$t.prototype,"_forecast",void 0),e([ge()],$t.prototype,"_availableEntities",void 0),e([ge()],$t.prototype,"_weatherEntities",void 0),e([ge()],$t.prototype,"_sensorEntities",void 0),e([ge()],$t.prototype,"_mobile",void 0),e([ge()],$t.prototype,"_drawerOpen",void 0),$t=e([he("chronos-card")],$t),window.customCards=window.customCards||[],window.customCards.push({type:"chronos-card",name:"Chronos Scheduler",description:"Advanced scheduler for Home Assistant with weather-based rules"});export{$t as ChronosCard};
