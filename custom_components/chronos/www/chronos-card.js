function e(e,t,i,s){var a,o=arguments.length,r=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,s);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(r=(o<3?a(r):o>3?a(t,i,r):a(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),a=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:d,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,v=globalThis,g=v.trustedTypes,_=g?g.emptyScript:"",b=v.reactiveElementPolyfillSupport,m=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:f,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&d(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);a?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),a=t.litNonce;void 0!==a&&s.setAttribute("nonce",a),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:f).toAttribute(t,i.type);this._$Em=e,null==a?this.removeAttribute(s):this.setAttribute(s,a),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=s;const o=a.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,a){if(void 0!==e){const o=this.constructor;if(!1===s&&(a=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??x)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:a},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==a||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[m("elementProperties")]=new Map,y[m("finalized")]=new Map,b?.({ReactiveElement:y}),(v.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",M=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+M,E=`<${C}>`,B=document,I=()=>B.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,N=Array.isArray,O="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,T=/>/g,R=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,L=/"/g,U=/^(?:script|style|textarea|title)$/i,V=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=V(1),J=V(2),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),G=new WeakMap,X=B.createTreeWalker(B,129);function Q(e,t){if(!N(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const K=(e,t)=>{const i=e.length-1,s=[];let a,o=2===t?"<svg>":3===t?"<math>":"",r=D;for(let t=0;t<i;t++){const i=e[t];let n,l,d=-1,c=0;for(;c<i.length&&(r.lastIndex=c,l=r.exec(i),null!==l);)c=r.lastIndex,r===D?"!--"===l[1]?r=H:void 0!==l[1]?r=T:void 0!==l[2]?(U.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=a??D,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?R:'"'===l[3]?L:j):r===L||r===j?r=R:r===H||r===T?r=D:(r=R,a=void 0);const p=r===R&&e[t+1].startsWith("/>")?" ":"";o+=r===D?i+E:d>=0?(s.push(n),i.slice(0,d)+z+i.slice(d)+M+p):i+M+(-2===d?t:p)}return[Q(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Z{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let a=0,o=0;const r=e.length-1,n=this.parts,[l,d]=K(e,t);if(this.el=Z.createElement(l,i),X.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=X.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(z)){const t=d[o++],i=s.getAttribute(e).split(M),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:r[2],strings:i,ctor:"."===r[1]?se:"?"===r[1]?ae:"@"===r[1]?oe:ie}),s.removeAttribute(e)}else e.startsWith(M)&&(n.push({type:6,index:a}),s.removeAttribute(e));if(U.test(s.tagName)){const e=s.textContent.split(M),t=e.length-1;if(t>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],I()),X.nextNode(),n.push({type:2,index:++a});s.append(e[t],I())}}}else if(8===s.nodeType)if(s.data===C)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=s.data.indexOf(M,e+1));)n.push({type:7,index:a}),e+=M.length-1}a++}}static createElement(e,t){const i=B.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,s){if(t===q)return t;let a=void 0!==s?i._$Co?.[s]:i._$Cl;const o=P(t)?void 0:t._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(e),a._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=a:i._$Cl=a),void 0!==a&&(t=Y(e,a._$AS(e,t.values),a,s)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??B).importNode(t,!0);X.currentNode=s;let a=X.nextNode(),o=0,r=0,n=i[0];for(;void 0!==n;){if(o===n.index){let t;2===n.type?t=new te(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new re(a,this,e)),this._$AV.push(t),n=i[++r]}o!==n?.index&&(a=X.nextNode(),o++)}return X.currentNode=B,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),P(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>N(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new ee(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new Z(e)),t}k(e){N(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const a of e)s===t.length?t.push(i=new te(this.O(I()),this.O(I()),this,this.options)):i=t[s],i._$AI(a),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,a){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,s){const a=this.strings;let o=!1;if(void 0===a)e=Y(this,e,t,0),o=!P(e)||e!==this._$AH&&e!==q,o&&(this._$AH=e);else{const s=e;let r,n;for(e=a[0],r=0;r<a.length-1;r++)n=Y(this,s[i+r],t,r),n===q&&(n=this._$AH[r]),o||=!P(n)||n!==this._$AH[r],n===F?e=F:e!==F&&(e+=(n??"")+a[r+1]),this._$AH[r]=n}o&&!s&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class ae extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class oe extends ie{constructor(e,t,i,s,a){super(e,t,i,s,a),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??F)===q)return;const i=this._$AH,s=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ne=w.litHtmlPolyfillSupport;ne?.(Z,te),(w.litHtmlVersions??=[]).push("3.3.2");const le=globalThis;class de extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let a=s._$litPart$;if(void 0===a){const e=i?.renderBefore??null;s._$litPart$=a=new te(t.insertBefore(I(),e),e,void 0,i??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}de._$litElement$=!0,de.finalized=!0,le.litElementHydrateSupport?.({LitElement:de});const ce=le.litElementPolyfillSupport;ce?.({LitElement:de}),(le.litElementVersions??=[]).push("4.2.2");const pe=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:x},ue=(e=he,t,i)=>{const{kind:s,metadata:a}=i;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const a=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,a,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const a=this[s];t.call(this,i),this.requestUpdate(s,a,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ve(e){return(t,i)=>"object"==typeof i?ue(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ge(e){return ve({...e,state:!0,attribute:!1})}const _e=r`
  :host {
    display: block;
    height: 100%;
    --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

    --bg: oklch(0.985 0.004 85);
    --bg-soft: oklch(0.965 0.005 85);
    --bg-sunken: oklch(0.945 0.006 85);
    --surface: #ffffff;
    --border: oklch(0.90 0.006 85);
    --border-soft: oklch(0.93 0.005 85);
    --text: oklch(0.22 0.012 85);
    --text-soft: oklch(0.42 0.012 85);
    --text-muted: oklch(0.60 0.010 85);

    --accent: oklch(0.55 0.15 265);
    --accent-soft: oklch(0.93 0.04 265);
    --accent-ink: oklch(0.35 0.15 265);
    --weather: oklch(0.72 0.15 65);
    --weather-soft: oklch(0.95 0.04 65);
    --weather-ink: oklch(0.48 0.15 65);

    --ok: oklch(0.65 0.14 155);
    --warn: oklch(0.72 0.15 65);
    --danger: oklch(0.60 0.18 25);
    --info: oklch(0.60 0.13 230);

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

    --shadow-xs: 0 1px 2px rgba(20, 14, 8, 0.04);
    --shadow-sm: 0 1px 3px rgba(20, 14, 8, 0.05), 0 1px 2px rgba(20, 14, 8, 0.03);
    --shadow-md: 0 4px 14px rgba(20, 14, 8, 0.06), 0 2px 4px rgba(20, 14, 8, 0.04);
    --shadow-lg: 0 16px 40px rgba(20, 14, 8, 0.10), 0 4px 12px rgba(20, 14, 8, 0.06);

    --block-edge: #000;

    --density-pad: 16px;
    --density-gap: 16px;
    --row-h: 56px;

    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.45;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  :host([dark]) {
    --bg: oklch(0.16 0.01 265);
    --bg-soft: oklch(0.20 0.012 265);
    --bg-sunken: oklch(0.13 0.01 265);
    --surface: oklch(0.22 0.013 265);
    --border: oklch(0.30 0.015 265);
    --border-soft: oklch(0.26 0.013 265);
    --text: oklch(0.95 0.006 265);
    --text-soft: oklch(0.78 0.010 265);
    --text-muted: oklch(0.62 0.010 265);
    --accent: oklch(0.72 0.15 265);
    --accent-soft: oklch(0.30 0.08 265);
    --accent-ink: oklch(0.85 0.12 265);
    --weather: oklch(0.80 0.15 65);
    --weather-soft: oklch(0.30 0.08 65);
    --weather-ink: oklch(0.88 0.13 65);
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.35);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.25);
    --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.40), 0 2px 4px rgba(0, 0, 0, 0.30);
    --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.55), 0 4px 12px rgba(0, 0, 0, 0.40);
    --block-edge: #fff;
  }

  :host([density="compact"]) {
    --density-pad: 10px;
    --density-gap: 10px;
    --row-h: 44px;
  }
`,be=r`
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
  .radial text { font-family: var(--font-mono); fill: var(--text-muted); }
  .radial .radial__label { font-family: var(--font-sans); fill: var(--text); font-weight: 600; }

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
`;function me(e,t=16,i=1.6){const s=t,a=i;switch(e){case"dashboard":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`;case"calendar":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>`;case"clock":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`;case"cloud":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 10a3.5 3.5 0 0 1-.5 7H7z"/></svg>`;case"sun":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/></svg>`;case"rain":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15a4 4 0 1 1 1.3-7.8A5 5 0 0 1 18 8a3.5 3.5 0 0 1-.5 7"/><path d="M9 19l-1 2M13 19l-1 2M17 19l-1 2"/></svg>`;case"snow":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 7l14 10M19 7 5 17"/></svg>`;case"device":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9z"/></svg>`;case"live":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6 6a8.5 8.5 0 0 0 0 12M18 6a8.5 8.5 0 0 1 0 12"/></svg>`;case"settings":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;case"wand":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8l1.4 1.4M17.8 6.2l1.4-1.4"/><path d="m3 21 9-9"/><path d="M12.5 11.5 14 10l2 2-1.5 1.5z"/></svg>`;case"plus":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`;case"chevron-right":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>`;case"chevron-left":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>`;case"play":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16l14-8z" fill="currentColor" stroke="none"/></svg>`;case"pause":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></svg>`;case"thermostat":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="4" height="12" rx="2"/><circle cx="12" cy="17" r="3.5"/><path d="M12 8v7"/></svg>`;case"light":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.3V17h6v-1.2c0-.9.4-1.7 1-2.3A6 6 0 0 0 12 3z"/></svg>`;case"blind":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16M4 4v14h16V4M4 8h16M4 12h16M4 16h16M11 20v2M13 20v2"/></svg>`;case"irrigation":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 5 6.5 5 10a5 5 0 0 1-10 0c0-3.5 2-6 5-10z"/></svg>`;case"plug":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3v4M15 3v4M7 7h10v4a5 5 0 0 1-10 0zM12 16v5"/></svg>`;case"fan":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 10V5a4 4 0 0 1 4 4M14 12h5a4 4 0 0 1-4 4M12 14v5a4 4 0 0 1-4-4M10 12H5a4 4 0 0 1 4-4"/></svg>`;case"boiler":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M9 16h6"/></svg>`;case"mower":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-1 3a2 2 0 0 1-2 1.5H6A2 2 0 0 1 4 18zM7 15v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M10 7V4M14 7V4"/></svg>`;case"vacuum":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M20 12h-2"/></svg>`;case"repeat":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4M3 12v-2a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 12v2a4 4 0 0 1-4 4H3"/></svg>`;case"bolt":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 4 14h7l-1 7 9-11h-7z"/></svg>`;case"check":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"/></svg>`;case"close":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`;case"menu":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;case"edit":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4l10-10-4-4L4 16zM13 7l4 4"/></svg>`;case"trash":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>`;case"temp":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4a2 2 0 1 1 4 0v10a4 4 0 1 1-4 0z"/></svg>`;case"droplet":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/></svg>`;case"wind":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h9"/></svg>`;case"power":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v9M6 6a8 8 0 1 0 12 0"/></svg>`;case"moon":return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>`;default:return J`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`}}const fe={thermostat:"thermostat",light:"light",blind:"blind",irrigation:"irrigation",plug:"plug",fan:"fan",boiler:"boiler",mower:"mower",vacuum:"vacuum"};function xe(e,t=16){return me(fe[e]||"device",t)}const $e={sun:"sun",sunny:"sun",rain:"rain",rainy:"rain",cloud:"cloud",cloudy:"cloud",partlycloudy:"cloud",snow:"snow",snowy:"snow",fog:"cloud",windy:"wind"};function ye(e,t=16){return me($e[e]||"cloud",t)}const we={on:"var(--mode-comfort)",off:"var(--mode-off)",set:"var(--mode-eco)",preset:"var(--mode-night)",cmd:"var(--mode-boost)"},ke={thermostat:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"climate.set_temperature",value:{type:"number",unit:"°C",min:5,max:35,step:.5,default:21}},{id:"set_preset",label:"Preset",kind:"preset",service:"climate.set_preset_mode",value:{type:"enum",options:["none","eco","comfort","sleep","away","boost","home"],default:"comfort"}},{id:"turn_off",label:"Spegni",kind:"off",service:"climate.turn_off"}],boiler:[{id:"set_temperature",label:"Imposta temperatura",kind:"set",service:"water_heater.set_temperature",value:{type:"number",unit:"°C",min:30,max:75,step:1,default:55}},{id:"set_operation",label:"Operation mode",kind:"preset",service:"water_heater.set_operation_mode",value:{type:"enum",options:["off","eco","electric","gas","heat_pump","high_demand","performance"],default:"eco"}},{id:"turn_off",label:"Spegni",kind:"off",service:"water_heater.turn_off"}],light:[{id:"turn_on",label:"Accendi",kind:"on",service:"light.turn_on",value:{type:"number",unit:"%",min:1,max:100,step:1,default:80,label:"Luminosità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"light.turn_off"}],blind:[{id:"set_position",label:"Posiziona",kind:"set",service:"cover.set_cover_position",value:{type:"number",unit:"%",min:0,max:100,step:5,default:100,label:"Apertura"}},{id:"open_cover",label:"Apri",kind:"on",service:"cover.open_cover"},{id:"close_cover",label:"Chiudi",kind:"off",service:"cover.close_cover"}],irrigation:[{id:"turn_on",label:"Avvia",kind:"on",service:"valve.open_valve",value:{type:"number",unit:"min",min:1,max:240,step:1,default:30,label:"Durata"}},{id:"turn_off",label:"Stop",kind:"off",service:"valve.close_valve"}],plug:[{id:"turn_on",label:"Accendi",kind:"on",service:"switch.turn_on"},{id:"turn_off",label:"Spegni",kind:"off",service:"switch.turn_off"}],fan:[{id:"turn_on",label:"Accendi",kind:"on",service:"fan.turn_on",value:{type:"number",unit:"%",min:10,max:100,step:10,default:50,label:"Velocità"}},{id:"turn_off",label:"Spegni",kind:"off",service:"fan.turn_off"}],mower:[{id:"start_mowing",label:"Avvia taglio",kind:"on",service:"lawn_mower.start_mowing"},{id:"pause",label:"Pausa",kind:"cmd",service:"lawn_mower.pause"},{id:"dock",label:"Torna in base",kind:"off",service:"lawn_mower.dock"}],vacuum:[{id:"start",label:"Avvia pulizia",kind:"on",service:"vacuum.start"},{id:"pause",label:"Pausa",kind:"cmd",service:"vacuum.pause"},{id:"return_to_base",label:"Torna in base",kind:"off",service:"vacuum.return_to_base"}]};let Se={};function Ae(e){return Se[e]||ke[e]||[]}function ze(e,t){return Ae(e).find(e=>e.id===t)}function Me(e,t){if(!t)return"—";const i=ze(e,t.id);return i?i.value&&void 0!==t.value&&null!==t.value&&""!==t.value?`${t.value}${i.value.unit||""}`:i.label:t.id}function Ce(e,t){if(!t)return"var(--mode-off)";const i=ze(e,t.id);return we[i?.kind||"on"]||"var(--mode-comfort)"}function Ee(e){const t=Ae(e)[0];return t?{id:t.id,value:t.value?t.value.default:void 0}:{id:"turn_on"}}async function Be(e){return e.callWS({type:"chronos/devices/list"})}async function Ie(e){return e.callWS({type:"chronos/schedules/list"})}async function Pe(e,t){return e.callWS({type:"chronos/schedules/save",schedule:t})}async function Ne(e){return e.callWS({type:"chronos/settings/get"})}async function Oe(e){return e.callWS({type:"chronos/preview/forecast"})}async function De(e){return e.callWS({type:"chronos/entities/available"})}async function He(e){return e.callWS({type:"chronos/weather/entities"})}async function Te(e){return e.callWS({type:"chronos/sensor/entities"})}async function Re(e){return e.callWS({type:"chronos/actions"})}async function je(e){return e.callWS({type:"chronos/weather/attributes"})}function Le(e){const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function Ue(e,t,i){return Math.max(t,Math.min(i,e))}function Ve(e,t=15){const i=60/t;return Math.round(e*i)/i}const We=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"],Je={thermostat:{label:"Termostato",domain:"climate",capabilities:["set_temperature","hvac_mode","preset_mode"]},light:{label:"Luce",domain:"light",capabilities:["turn_on","turn_off","brightness","color_temp"]},blind:{label:"Tapparella",domain:"cover",capabilities:["open","close","set_position","stop"]},irrigation:{label:"Irrigazione",domain:"valve",capabilities:["turn_on","turn_off","duration"]},plug:{label:"Presa smart",domain:"switch",capabilities:["turn_on","turn_off"]},fan:{label:"Ventilatore",domain:"fan",capabilities:["turn_on","turn_off","speed","oscillate"]},boiler:{label:"Boiler",domain:"water_heater",capabilities:["set_temperature","operation_mode"]},mower:{label:"Tosaerba",domain:"lawn_mower",capabilities:["start_mowing","pause","dock"]},vacuum:{label:"Robot aspirapolvere",domain:"vacuum",capabilities:["start","pause","return_to_base","fan_speed"]}};const qe=[{max:10,color:"#3b82f6"},{max:15,color:"#06b6d4"},{max:19,color:"#fbbf24"},{max:23,color:"#10b981"},{max:25,color:"#fbbf24"},{max:999,color:"#ef4444"}],Fe=[{max:35,color:"#3b82f6"},{max:50,color:"#10b981"},{max:60,color:"#fbbf24"},{max:999,color:"#ef4444"}],Ge={eco:"#10b981",comfort:"#3b82f6",sleep:"#6366f1",away:"#9ca3af",boost:"#ef4444",home:"#06b6d4",none:"#9ca3af"};function Xe(e,t){if(!e)return"boiler"===t?Fe:qe;const i=e["boiler"===t?"color_stops_boiler":"color_stops_climate"];return i&&i.length?[...i].sort((e,t)=>e.max-t.max):"boiler"===t?Fe:qe}function Qe(e){const t=e?.color_presets;return{...Ge,...t||{}}}function Ke(e){const t=e?.color_light_use_state;return void 0===t||!!t}const Ze={accent:"var(--accent)",soft:"var(--accent-soft)",live:!1};function Ye(e,t,i){if(!t)return Ze;const s=t.state||"",a=t.attributes||{};if("light"===e.type){if("off"===s||"unavailable"===s)return{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1};if(Ke(i)){const e=a.rgb_color;if(Array.isArray(e)&&3===e.length){return{accent:`rgb(${e[0]}, ${e[1]}, ${e[2]})`,soft:`rgba(${e[0]}, ${e[1]}, ${e[2]}, 0.18)`,live:!0}}}return{accent:"#fbbf24",soft:"rgba(251, 191, 36, 0.18)",live:!0}}if("thermostat"===e.type||"boiler"===e.type){const t=Qe(i),o=a.preset_mode;if(o&&t[o]&&"off"!==s){const e=t[o];return{accent:e,soft:et(e),live:!0}}const r=function(e){const t=[e.current_temperature,e.temperature];for(const e of t){if("number"==typeof e)return e;const t=parseFloat(e);if(!isNaN(t))return t}return}(a);if("number"==typeof r){const t=function(e,t){const i=[...t].sort((e,t)=>e.max-t.max);for(const t of i)if(e<=t.max)return t.color;return i[i.length-1]?.color||"#9ca3af"}(r,Xe(i,e.type));return{accent:t,soft:et(t),live:!0}}return Ze}if("blind"===e.type){const e=a.current_position;if("number"==typeof e){const t=e/100,i=Math.round(60+140*t),s=Math.round(80+100*t),a=Math.round(120+135*t);return{accent:`rgb(${i}, ${s}, ${a})`,soft:`rgba(${i}, ${s}, ${a}, 0.18)`,live:!0}}}if("fan"===e.type){const e=a.percentage;if("number"==typeof e&&"on"===s){const t=function(e,t,i){const s=e.replace("#",""),a=t.replace("#",""),o=parseInt(s.slice(0,2),16),r=parseInt(s.slice(2,4),16),n=parseInt(s.slice(4,6),16),l=parseInt(a.slice(0,2),16),d=parseInt(a.slice(2,4),16),c=parseInt(a.slice(4,6),16),p=Math.round(o+(l-o)*i),h=Math.round(r+(d-r)*i),u=Math.round(n+(c-n)*i);return`rgb(${p}, ${h}, ${u})`}("#06b6d4","#3b82f6",e/100);return{accent:t,soft:et(t),live:!0}}}return"on"===s||"open"===s||"cleaning"===s||"mowing"===s?{accent:"#10b981",soft:"rgba(16, 185, 129, 0.18)",live:!0}:"off"===s||"closed"===s||"docked"===s||"unavailable"===s?{accent:"var(--text-muted)",soft:"var(--bg-sunken)",live:!1}:Ze}function et(e){if(!e.startsWith("#"))return"var(--bg-sunken)";const t=e.replace("#","");return`rgba(${parseInt(3===t.length?t[0]+t[0]:t.slice(0,2),16)}, ${parseInt(3===t.length?t[1]+t[1]:t.slice(2,4),16)}, ${parseInt(3===t.length?t[2]+t[2]:t.slice(4,6),16)}, 0.18)`}let tt=class extends de{constructor(){super(...arguments),this.variant="linear",this.deviceType="thermostat",this.blocks=[],this.selectedIdx=-1,this.now=null,this.interactive=!0,this.height="normal",this.showWeather=!0,this.forecast=[],this._drag=null,this._boundMove=null,this._boundUp=null}render(){return"radial"===this.variant?this._renderRadial():"list"===this.variant?this._renderList():this._renderLinear()}_renderLinear(){const e=e=>e/24*100,t="compact"===this.height?"timeline timeline--compact":"mini"===this.height?"timeline timeline--mini":"timeline";return W`
      <div class="${t}" @click=${this._onTrackClick}>
        ${this.showWeather&&"mini"!==this.height?this._renderWeatherRibbon():F}
        <div class="timeline__hours">
          ${Array.from({length:24}).map(()=>W`<div></div>`)}
        </div>
        ${"normal"===this.height?W`
          <div class="timeline__labels">
            ${[0,6,12,18,24].map(t=>W`<span style="left:${e(t)}%">${String(t).padStart(2,"0")}:00</span>`)}
          </div>
        `:F}
        ${this.blocks.map((t,i)=>W`
          <div
            class="tl-block"
            data-selected="${this.selectedIdx===i}"
            style="left:${e(t.start)}%;width:${e(t.end-t.start)}%;background:${Ce(this.deviceType,t.action)}"
            @mousedown=${e=>this._onBlockDown(e,i,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(i)}}
          >
            ${this.interactive?W`<div class="tl-block__handle tl-block__handle--l" @mousedown=${e=>this._onBlockDown(e,i,"l")}></div>`:F}
            <span class="truncate">${Me(this.deviceType,t.action)}</span>
            ${"mini"!==this.height?W`<span class="mono" style="font-size:10px;opacity:0.85">${Le(t.start)}</span>`:F}
            ${this.interactive?W`<div class="tl-block__handle tl-block__handle--r" @mousedown=${e=>this._onBlockDown(e,i,"r")}></div>`:F}
          </div>
        `)}
        ${null!==this.now?W`<div class="tl-now" style="left:${e(this.now)}%"></div>`:F}
      </div>
    `}_renderWeatherRibbon(){return this.forecast.length?W`
      <div class="tl-weather">
        ${this.forecast.map(e=>{const t=e.condition||e.state||"cloud",i=t.includes("rain")?"rain":t.includes("sun")?"sun":t.includes("snow")?"snow":"cloud";return W`<div class="tl-weather__cell" data-state="${i}"></div>`})}
      </div>
    `:F}_renderRadial(){const e=420,t=210,i=210,s=170,a=120,o=null!==this.now?this.now/24*Math.PI*2-Math.PI/2:null,r=(e,s,a)=>{const o=e/24*Math.PI*2-Math.PI/2,r=t+145*Math.cos(o),n=i+145*Math.sin(o);return J`
        <g style="cursor:${this.interactive?"ew-resize":"default"}" @mousedown=${e=>this._onRadialHandleDown(e,s,a)}>
          <circle cx="${r}" cy="${n}" r="9" fill="white" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="${r}" cy="${n}" r="3" fill="var(--accent)"/>
        </g>
      `},n=this.selectedIdx>=0?this.blocks[this.selectedIdx]:null;return J`
      <svg class="radial" viewBox="0 0 ${e} ${e}" style="touch-action:none">
        <circle cx="${t}" cy="${i}" r="${145}" fill="none" stroke="var(--border-soft)" stroke-width="${50}"/>
        ${this.blocks.map((e,o)=>J`
          <path
            d="${((e,s,a,o)=>{const r=e/24*Math.PI*2-Math.PI/2,n=s/24*Math.PI*2-Math.PI/2,l=s-e>12?1:0;return`M ${t+a*Math.cos(r)} ${i+a*Math.sin(r)} A ${a} ${a} 0 ${l} 1 ${t+a*Math.cos(n)} ${i+a*Math.sin(n)} L ${t+o*Math.cos(n)} ${i+o*Math.sin(n)} A ${o} ${o} 0 ${l} 0 ${t+o*Math.cos(r)} ${i+o*Math.sin(r)} Z`})(e.start,e.end,s,a)}"
            fill="${Ce(this.deviceType,e.action)}"
            stroke="${this.selectedIdx===o?"var(--accent)":"var(--block-edge)"}"
            stroke-width="${this.selectedIdx===o?3:1.5}"
            stroke-linejoin="round"
            style="cursor:${this.interactive?"grab":"pointer"}"
            @mousedown=${e=>this._onRadialHandleDown(e,o,"move")}
            @click=${e=>{e.stopPropagation(),this._fireSelect(o)}}
          />
        `)}
        ${Array.from({length:24}).map((e,s)=>{const a=s/24*Math.PI*2-Math.PI/2,o=s%6==0?156:162;return J`<line x1="${t+168*Math.cos(a)}" y1="${i+168*Math.sin(a)}" x2="${t+o*Math.cos(a)}" y2="${i+o*Math.sin(a)}" stroke="white" stroke-width="${s%6==0?2:1}" opacity="0.7" pointer-events="none"/>`})}
        ${[0,6,12,18].map(e=>{const s=e/24*Math.PI*2-Math.PI/2;return J`<text x="${t+195*Math.cos(s)}" y="${i+195*Math.sin(s)}" text-anchor="middle" dy="4" font-size="11">${String(e).padStart(2,"0")}</text>`})}
        ${this.interactive&&n?J`${r(n.start,this.selectedIdx,"l")}${r(n.end,this.selectedIdx,"r")}`:F}
        ${null!==o?J`
          <g pointer-events="none">
            <line x1="${t+90*Math.cos(o)}" y1="${i+90*Math.sin(o)}" x2="${t+190*Math.cos(o)}" y2="${i+190*Math.sin(o)}" stroke="var(--danger)" stroke-width="2"/>
            <circle cx="${t+190*Math.cos(o)}" cy="${i+190*Math.sin(o)}" r="5" fill="var(--danger)"/>
          </g>
        `:F}
        <text x="${t}" y="${204}" text-anchor="middle" class="radial__label" font-size="32" font-weight="700" pointer-events="none">${null!==this.now?Le(this.now):"—"}</text>
        <text x="${t}" y="${224}" text-anchor="middle" font-size="11" pointer-events="none">24h · oggi</text>
      </svg>
    `}_renderList(){return W`
      <div class="tl-list">
        ${this.blocks.map((e,t)=>W`
          <div
            class="tl-list__row"
            style="border-color:${this.selectedIdx===t?"var(--accent)":"var(--border-soft)"};background:${this.selectedIdx===t?"var(--accent-soft)":"var(--bg-sunken)"}"
            @click=${()=>this._fireSelect(t)}
          >
            <div class="tl-list__time">${Le(e.start)} → ${Le(e.end)}</div>
            <div class="tl-list__mode">
              <span class="tl-list__mode-dot" style="background:${Ce(this.deviceType,e.action)}"></span>
              <strong>${Me(this.deviceType,e.action)}</strong>
            </div>
            <span class="mono text-xs text-mute">${Math.round(60*(e.end-e.start))} min</span>
          </div>
        `)}
      </div>
    `}_onBlockDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t];this._drag={idx:t,handle:i,startX:e.clientX,origStart:s.start,origEnd:s.end},this._boundMove=e=>this._onDragMove(e),this._boundUp=()=>this._onDragUp(),window.addEventListener("mousemove",this._boundMove),window.addEventListener("mouseup",this._boundUp)}_onDragMove(e){if(!this._drag)return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=Ve(Ue((e.clientX-i.left)/i.width*24,0,24)),a=[...this.blocks],o={...a[this._drag.idx]};if("l"===this._drag.handle)o.start=Ue(s,0,o.end-.25);else if("r"===this._drag.handle)o.end=Ue(s,o.start+.25,24);else{const t=(e.clientX-this._drag.startX)/i.width*24,s=this._drag.origEnd-this._drag.origStart;let a=Ue(this._drag.origStart+t,0,24-s);a=Ve(a),o.start=a,o.end=a+s}a[this._drag.idx]=o,this._fireBlocksChanged(a)}_onDragUp(){this._drag=null,this._boundMove&&window.removeEventListener("mousemove",this._boundMove),this._boundUp&&window.removeEventListener("mouseup",this._boundUp),this._boundMove=null,this._boundUp=null}_onRadialHandleDown(e,t,i){if(!this.interactive)return;e.stopPropagation(),e.preventDefault(),this._fireSelect(t);const s=this.blocks[t],a=this.shadowRoot?.querySelector(".radial");if(!a)return;const o=e=>{const t=a.getBoundingClientRect(),i=420,s=(e.clientX-t.left)/t.width*i,o=(e.clientY-t.top)/t.height*i;let r=Math.atan2(o-210,s-210)+Math.PI/2;return r<0&&(r+=2*Math.PI),r/(2*Math.PI)*24},r=o(e),n=e=>{const a=o(e),n=Ve(a),l=[...this.blocks],d={...l[t]};if("l"===i)d.start=Ue(n,0,d.end-.25);else if("r"===i)d.end=Ue(n,d.start+.25,24);else{const e=a-r,t=s.end-s.start;let i=s.start+e;i=Ve(i),i=Ue(i,0,24-t),d.start=i,d.end=i+t}l[t]=d,this._fireBlocksChanged(l)},l=()=>{window.removeEventListener("mousemove",n),window.removeEventListener("mouseup",l)};window.addEventListener("mousemove",n),window.addEventListener("mouseup",l)}_onTrackClick(e){if(!this.interactive)return;if(e.target.closest(".tl-block"))return;const t=this.shadowRoot?.querySelector(".timeline");if(!t)return;const i=t.getBoundingClientRect(),s=Ue((e.clientX-i.left)/i.width*24,0,24),a=Math.max(0,Ve(s)-.5),o=Math.min(24,a+1),r=this.blocks.some(e=>!(o<=e.start||a>=e.end));if(r)return;const n=[...this.blocks,{start:a,end:o,action:Ee(this.deviceType)}];this._fireBlocksChanged(n)}_fireSelect(e){this.dispatchEvent(new CustomEvent("block-select",{detail:{index:e}}))}_fireBlocksChanged(e){this.dispatchEvent(new CustomEvent("blocks-changed",{detail:{blocks:e}}))}};tt.styles=be,e([ve({type:String})],tt.prototype,"variant",void 0),e([ve({type:String})],tt.prototype,"deviceType",void 0),e([ve({type:Array})],tt.prototype,"blocks",void 0),e([ve({type:Number})],tt.prototype,"selectedIdx",void 0),e([ve({type:Number})],tt.prototype,"now",void 0),e([ve({type:Boolean})],tt.prototype,"interactive",void 0),e([ve({type:String})],tt.prototype,"height",void 0),e([ve({type:Boolean})],tt.prototype,"showWeather",void 0),e([ve({type:Array})],tt.prototype,"forecast",void 0),e([ge()],tt.prototype,"_drag",void 0),tt=e([pe("chronos-timeline")],tt);let it=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t}=this.card,i=e.length,s=e.filter(e=>e.enabled).length,a=e.reduce((e,t)=>e+(t.weather_rules||[]).filter(e=>e.active).length,0);return W`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">Le tue schedulazioni</h1>
          <p class="page-sub">Programmazione oraria con override meteo · ${s} di ${i} attive · ${a} regole meteo live</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">Schedulazioni attive</div>
            <div class="kpi__value">${s}<span class="text-mute" style="font-size:16px;margin-left:6px">/${i}</span></div>
            <div class="kpi__delta">su ${t.length} dispositivi connessi</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Regole meteo</div>
            <div class="kpi__value">${a}</div>
            <div class="kpi__delta">override condizionali</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Ora locale</div>
            <div class="kpi__value">${Le(this.nowHour)}</div>
            <div class="kpi__delta">aggiornamento live</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">Tutte le schedulazioni</h2>
            <span class="tag mono">${i}</span>
          </div>
          <div class="row">
            <button class="btn" @click=${()=>this.card.navigate("week")}>${me("calendar",14)} Vista settimana</button>
            <button class="btn btn--primary" @click=${()=>this.card.navigate("wizard")}>${me("plus",14)} Nuova schedulazione</button>
          </div>
        </div>

        <div class="grid-auto">
          ${e.map(e=>{const i=(e.device_ids||[]).map(e=>t.find(t=>t.id===e)).filter(Boolean),s=(e.weather_rules||[]).filter(e=>e.active).length;return W`
              <div class="sched-card" data-selected="${e.id===this.card._selectedId}"
                @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                <div class="sched-card__header">
                  <div style="flex:1;min-width:0">
                    <h3 class="sched-card__title">${e.name}</h3>
                    <div class="sched-card__sub">${this._computeRepeat(e.days)} · ${e.blocks.length} fasce</div>
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
                    ${i.slice(0,5).map(e=>{const t=Ye(e,this.card.hass?.states?.[e.entity_id],this.card._settings);return W`<div class="device-icon-pill" title="${e.alias}" style="background:${t.soft};color:${t.accent}">${xe(e.type,14)}</div>`})}
                    ${i.length>5?W`<div class="device-icon-pill mono" style="font-size:10px">+${i.length-5}</div>`:F}
                  </div>
                  <div style="flex:1"></div>
                  ${s>0?W`<span class="chip chip--weather">${me("cloud",11)} ${s} regole</span>`:F}
                  <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?"Attiva":"Disattivata"}</span>
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_computeRepeat(e){if(!e||!e.length)return"";const t=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];return e.every(Boolean)?"Ogni giorno":e.map((e,i)=>e?t[i]:null).filter(Boolean).join(" · ")}};it.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],it.prototype,"card",void 0),e([ve({type:Number})],it.prototype,"nowHour",void 0),it=e([pe("chronos-overview")],it);let st=class extends de{constructor(){super(...arguments),this.nowHour=0,this._selectedBlockIdx=0}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return W`<div class="text-mute" style="padding:40px;text-align:center">Nessuna schedulazione selezionata</div>`;const t=e.blocks[this._selectedBlockIdx],i=(e.device_ids||[]).map(e=>this.card._devices.find(t=>t.id===e)).filter(Boolean),s=e.device_type,a=Je[s]||{label:s},o=Ae(s),r=t?.action?ze(s,t.action.id):null,n=this.card.isDirty;return W`
      <div class="col" style="gap:18px">
        <div class="sp-between">
          <div>
            <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")} style="margin-bottom:6px">
              ${me("chevron-left",14)} Torna alla panoramica
            </button>
            <input class="input" .value=${e.name}
              @input=${t=>this.card.updateScheduleLocal(e.id,{name:t.target.value})}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${e.enabled?"chip--on":""}"><span class="chip__dot"></span>${e.enabled?"In esecuzione":"Disattivata"}</span>
              <span class="chip">${me("repeat",11)} ${l=e.days,l.every(Boolean)?"Ogni giorno":l.map((e,t)=>e?We[t]:null).filter(Boolean).join(" · ")}</span>
              <span class="chip chip--accent">${xe(s,11)} ${a.label}</span>
              <span class="chip">${me("device",11)} ${i.length} dispositivi</span>
              ${(e.weather_rules||[]).filter(e=>e.active).length>0?W`<span class="chip chip--weather">${me("cloud",11)} ${(e.weather_rules||[]).filter(e=>e.active).length} regole meteo</span>`:F}
            </div>
          </div>
          <div class="row" style="gap:10px">
            <label class="switch">
              <input type="checkbox" .checked=${e.enabled} @change=${t=>this.card.doToggleSchedule(e.id,t.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" @click=${()=>this.card.doRemoveSchedule(e.id)}>${me("trash",14)}</button>
            <button class="btn btn--primary" ?disabled=${!n}
              style="opacity:${n?1:.5};cursor:${n?"pointer":"not-allowed"}"
              @click=${()=>this.card.saveCurrentSchedule()}>
              ${me("check",14)} ${n?"Salva modifiche":"Salvato"}
            </button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 340px;gap:18px">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">Programmazione 24h</h3>
                  <p class="card__sub">Trascina i bordi per ridimensionare · click sulla traccia vuota per aggiungere</p>
                </div>
                <div class="segmented">
                  ${["linear","radial","list"].map(e=>W`
                    <button data-active="${this.card._timelineVariant===e}" @click=${()=>this.card.setTimelineVariant(e)}>
                      ${{linear:"Lineare",radial:"Radiale",list:"Lista"}[e]}
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
                  ${o.map(e=>W`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${we[e.kind]};display:inline-block"></span>
                      <span class="text-xs">${e.label}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${()=>{const t=[...e.blocks,{start:12,end:13,action:Ee(s)}];this.card.updateBlocksLocal(e.id,t)}}>
                  ${me("plus",12)} Aggiungi fascia
                </button>
              </div>
            </div>

            <!-- Days -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Ripetizione settimanale</h3><p class="card__sub">Quali giorni applicare questa programmazione</p></div>
              </div>
              <div class="row" style="gap:16px;flex-wrap:wrap">
                <div class="row" style="gap:4px">
                  ${We.map((t,i)=>{const s=e.days[i];return W`
                      <button class="mono" @click=${()=>{const t=[...e.days];t[i]=t[i]?0:1,this.card.updateScheduleLocal(e.id,{days:t})}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;letter-spacing:0.02em;background:${s?"var(--accent)":"var(--bg-sunken)"};color:${s?"white":"var(--text-muted)"};border:1px solid ${s?"transparent":"var(--border-soft)"};cursor:pointer">
                        ${t}
                      </button>
                    `})}
                </div>
                <div class="row" style="gap:6px">
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,1,1]})}>Tutti</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[1,1,1,1,1,0,0]})}>Lavorativi</button>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.updateScheduleLocal(e.id,{days:[0,0,0,0,0,1,1]})}>Weekend</button>
                </div>
              </div>
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Regole meteo</h3><p class="card__sub">Override condizionali che modificano l'esecuzione</p></div>
                <button class="btn btn--sm" @click=${()=>this.card.navigate("weatherRule")}>${me("plus",12)} Nuova regola</button>
              </div>
              ${(e.weather_rules||[]).length?W`<div class="col" style="gap:8px">
                    ${(e.weather_rules||[]).map((t,i)=>W`
                      <div class="rule-block">
                        <span class="rule-block__label rule-block__label--if">SE</span>
                        <span class="rule-token rule-token--weather">${t.if}</span>
                        <span class="rule-block__label rule-block__label--then">ALLORA</span>
                        <span class="rule-token rule-token--accent">${t.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch">
                          <input type="checkbox" .checked=${t.active} @change=${t=>{const s=[...e.weather_rules||[]];s[i]={...s[i],active:t.target.checked},this.card.updateScheduleLocal(e.id,{weather_rules:s})}}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                      </div>
                    `)}
                  </div>`:W`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${me("cloud",22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">Nessuna regola meteo</div>
                    <div style="font-size:12.5px;margin-top:4px">Aggiungine una per modulare il comportamento in base alle condizioni esterne.</div>
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Fascia selezionata</h3><p class="card__sub">${t?`${Le(t.start)} → ${Le(t.end)}`:""}</p></div>
              </div>
              ${t?W`
                <div class="col" style="gap:12px">
                  <div class="grid-2">
                    <div class="field"><label class="field__label">Da</label><input class="input mono" .value=${Le(t.start)} readonly/></div>
                    <div class="field"><label class="field__label">A</label><input class="input mono" .value=${Le(t.end)} readonly/></div>
                  </div>
                  <div class="field">
                    <label class="field__label">Azione su ${a.label?.toLowerCase()}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${o.map(i=>{const s=t.action?.id===i.id;return W`<button class="btn btn--sm" @click=${()=>this._setBlockAction(e.id,i.id,i.value?.default)}
                          style="background:${s?we[i.kind]:"var(--surface)"};color:${s?"white":"var(--text)"};border-color:${s?"transparent":"var(--border)"}">
                          ${i.label}</button>`})}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${r?.service||""}</span>
                  </div>
                  ${r?.value?W`
                    <div class="field">
                      <label class="field__label">${r.value.label||"Valore"} ${r.value.unit?W`<span class="text-mute">(${r.value.unit})</span>`:F}</label>
                      ${"number"===r.value.type?W`
                        <div class="row" style="gap:10px;align-items:center">
                          <input type="range" min="${r.value.min}" max="${r.value.max}" step="${r.value.step}"
                            .value=${String(t.action?.value??r.value.default)}
                            @input=${t=>this._setBlockValue(e.id,parseFloat(t.target.value))}
                            style="flex:1"/>
                          <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${t.action?.value??r.value.default}${r.value.unit}</span>
                        </div>
                      `:"enum"===r.value.type?W`
                        <select class="input"
                          @change=${t=>this._setBlockValue(e.id,t.target.value)}>
                          ${(r.value.options||[]).map(e=>{const i=String(t.action?.value??r.value.default);return W`<option value="${e}" ?selected=${i===e}>${e}</option>`})}
                        </select>
                      `:F}
                    </div>
                  `:F}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${()=>this._removeBlock(e.id)}>
                    ${me("trash",14)} Elimina fascia
                  </button>
                </div>
              `:F}
            </div>

            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Dispositivi influenzati</h3><p class="card__sub">${i.length} selezionati</p></div>
              </div>
              <div class="col" style="gap:2px">
                ${i.map(e=>W`
                  <div class="device-row">
                    <div class="device-row__icon">${xe(e.type,17)}</div>
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
      </div>
    `;var l}_setBlockAction(e,t,i){const s=this.card._schedules.find(t=>t.id===e);if(!s)return;const a=[...s.blocks];a[this._selectedBlockIdx]={...a[this._selectedBlockIdx],action:{id:t,value:i}},this.card.updateBlocksLocal(e,a)}_setBlockValue(e,t){const i=this.card._schedules.find(t=>t.id===e);if(!i)return;const s=[...i.blocks],a=s[this._selectedBlockIdx];s[this._selectedBlockIdx]={...a,action:{...a.action,value:t}},this.card.updateBlocksLocal(e,s)}_removeBlock(e){const t=this.card._schedules.find(t=>t.id===e);if(!t||t.blocks.length<=1)return;const i=t.blocks.filter((e,t)=>t!==this._selectedBlockIdx);this._selectedBlockIdx=Math.max(0,this._selectedBlockIdx-1),this.card.updateBlocksLocal(e,i)}};st.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],st.prototype,"card",void 0),e([ve({type:Number})],st.prototype,"nowHour",void 0),e([ge()],st.prototype,"_selectedBlockIdx",void 0),st=e([pe("chronos-editor")],st);const at=[{key:"skip",label:"Salta esecuzione",desc:"Annulla questa fascia"},{key:"shift",label:"Modifica valore",desc:"Aggiungi/sottrai dal valore"},{key:"force",label:"Forza azione",desc:"Sostituisci con un'altra azione"},{key:"duration",label:"Modifica durata",desc:"Estendi o riduci la fascia"}];let ot=class extends de{constructor(){super(...arguments),this.nowHour=0,this._variable="temperature",this._op=">",this._value="22",this._action="skip",this._actionValue=""}render(){const e=this.card._schedules.find(e=>e.id===this.card._selectedId)||this.card._schedules[0];if(!e)return F;const t=Ae(e.device_type),i=this.card._weatherAttributes,s=i.find(e=>e.key===this._variable)||i[0],a=this.card._settings?.weather_entity||"",o=`${this._variable} ${this._op} ${this._value}${s?.unit||""}`,r=t.find(e=>e.id===this._actionValue),n="skip"===this._action?"Salta esecuzione":"shift"===this._action?`${this._actionValue}${s?.unit||""} su tutte le fasce`:"force"===this._action?`Forza: ${r?.label||"—"}`:`Durata ${this._actionValue||"+30"} min`;return W`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("editor")}>
            ${me("chevron-left",14)} Torna all'editor
          </button>
          <h1 class="page-title" style="margin-top:6px">Nuova regola meteo</h1>
          <p class="page-sub">Override condizionale per <strong>${e.name}</strong> · sorgente: <span class="mono">${a}</span></p>
        </div>

        <div class="card" style="padding:22px">
          <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border)">
            <span class="rule-block__label rule-block__label--if">SE</span>
            <span class="rule-token mono text-xs">${a}.</span>
            <span class="rule-token rule-token--weather">${me(s?.icon||"cloud",11)} ${s?.label||this._variable}</span>
            <span class="rule-token mono">${this._op}</span>
            <span class="rule-token rule-token--weather mono">${this._value}${s?.unit||""}</span>
            <span class="rule-block__label rule-block__label--then">ALLORA</span>
            <span class="rule-token rule-token--accent">${n}</span>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">Condizione · attributo meteo</h3><p class="card__sub">Esposto da ${a}</p></div></div>
            <div class="col" style="gap:12px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:380px;overflow-y:auto;padding-right:4px">
                ${i.map(e=>W`
                  <button class="tile-pick" data-selected="${this._variable===e.key}" @click=${()=>{this._variable=e.key}} style="padding:10px">
                    <div class="row" style="gap:8px">
                      <div class="tile-pick__icon" style="width:28px;height:28px">${me(e.icon,14)}</div>
                      <div style="min-width:0;flex:1">
                        <div class="tile-pick__name" style="font-size:12.5px">${e.label}</div>
                        <div class="tile-pick__desc mono" style="font-size:10.5px">${e.key}${e.unit?` · ${e.unit}`:""}</div>
                      </div>
                    </div>
                  </button>
                `)}
              </div>
              <div class="grid-2">
                <div class="field">
                  <label class="field__label">Operatore</label>
                  <select class="select mono" @change=${e=>{this._op=e.target.value}}>
                    ${"enum"===s?.type?W`
                          <option value="==" ?selected=${"=="===this._op}>uguale a (==)</option>
                          <option value="!=" ?selected=${"!="===this._op}>diverso da (!=)</option>`:W`
                          <option value=">" ?selected=${">"===this._op}>maggiore di (&gt;)</option>
                          <option value=">=" ?selected=${">="===this._op}>maggiore o uguale</option>
                          <option value="<" ?selected=${"<"===this._op}>minore di (&lt;)</option>
                          <option value="<=" ?selected=${"<="===this._op}>minore o uguale</option>
                          <option value="==" ?selected=${"=="===this._op}>uguale a (==)</option>
                          <option value="!=" ?selected=${"!="===this._op}>diverso da (!=)</option>`}
                  </select>
                </div>
                <div class="field">
                  <label class="field__label">Soglia</label>
                  ${"enum"===s?.type?W`<select class="select" @change=${e=>{this._value=e.target.value}}>
                        ${(s.options||[]).map(e=>W`<option value="${e}" ?selected=${this._value===e}>${e}</option>`)}
                      </select>`:W`<input class="input mono" .value=${this._value} @input=${e=>{this._value=e.target.value}}/>`}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">Azione · cosa fare</h3><p class="card__sub">L'effetto sulla fascia oraria attiva</p></div></div>
            <div class="col" style="gap:12px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
                ${at.map(e=>W`
                  <button class="tile-pick" data-selected="${this._action===e.key}" @click=${()=>{this._action=e.key}}>
                    <div class="tile-pick__name">${e.label}</div>
                    <div class="tile-pick__desc">${e.desc}</div>
                  </button>
                `)}
              </div>
              ${"skip"!==this._action?W`
                <div class="field">
                  <label class="field__label">${"force"===this._action?"Azione da forzare":"Valore"}</label>
                  ${"force"===this._action?W`<select class="select" @change=${e=>{this._actionValue=e.target.value}}>
                        ${t.map(e=>W`<option value="${e.id}" ?selected=${this._actionValue===e.id}>${e.label}</option>`)}
                      </select>`:W`<input class="input mono" .value=${this._actionValue} @input=${e=>{this._actionValue=e.target.value}}
                        placeholder="${"shift"===this._action?"-1, +2, …":"+30, -15, …"}"/>`}
                </div>
              `:F}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Anteprima impatto · prossime 24h</h3></div></div>
          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} .now=${this.nowHour} .forecast=${this.card._forecast}></chronos-timeline>
        </div>

        <div class="row" style="justify-content:flex-end;gap:8px">
          <button class="btn" @click=${()=>this.card.navigate("editor")}>Annulla</button>
          <button class="btn btn--primary" @click=${()=>{const e=this.card._schedules.find(e=>e.id===this.card._selectedId);if(!e)return;const t=[...e.weather_rules||[],{if:o,then:n,active:!0}];this.card.updateScheduleLocal(e.id,{weather_rules:t}),this.card.navigate("editor")}}>${me("check",14)} Salva regola</button>
        </div>
      </div>
    `}};ot.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],ot.prototype,"card",void 0),e([ve({type:Number})],ot.prototype,"nowHour",void 0),e([ge()],ot.prototype,"_variable",void 0),e([ge()],ot.prototype,"_op",void 0),e([ge()],ot.prototype,"_value",void 0),e([ge()],ot.prototype,"_action",void 0),e([ge()],ot.prototype,"_actionValue",void 0),ot=e([pe("chronos-weather-rule")],ot);let rt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._devices.find(e=>e.id===this.card._deviceDetailId)||this.card._devices[0];if(!e)return W`<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-weight:600;font-size:14px">Nessun dispositivo</div>
      <div style="font-size:12.5px;margin-top:4px">Importa prima un'entità HA.</div>
    </div>`;const t=Je[e.type]||{label:e.type,domain:"",capabilities:[]},i=this.card._schedules.filter(t=>t.device_ids.includes(e.id)),s=this.card.hass?.states?.[e.entity_id],a=s?.state||"—";return W`
      <div class="col" style="gap:18px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${me("chevron-left",14)} Indietro
          </button>
        </div>

        <div class="row" style="gap:16px">
          <div style="width:60px;height:60px;border-radius:16px;background:${Ye(e,s,this.card._settings).soft};color:${Ye(e,s,this.card._settings).accent};display:grid;place-items:center">
            ${xe(e.type,28)}
          </div>
          <div style="flex:1">
            <h1 class="page-title" style="margin-bottom:2px">${e.alias}</h1>
            <p class="page-sub mono" style="margin-bottom:0">${e.entity_id} · ${e.area}</p>
          </div>
          <select class="select" style="width:240px"
            @change=${e=>this.card.selectDevice(e.target.value)}>
            ${this.card._devices.map(t=>W`<option value="${t.id}" ?selected=${t.id===e.id}>${t.alias}</option>`)}
          </select>
        </div>

        <div class="grid-3">
          <div class="kpi"><div class="kpi__label">Stato attuale</div><div class="kpi__value">${a}</div><div class="kpi__delta">aggiornato live</div></div>
          <div class="kpi"><div class="kpi__label">Tipo dispositivo</div><div class="kpi__value" style="font-size:20px">${t.label}</div><div class="kpi__delta mono">dominio ${t.domain}</div></div>
          <div class="kpi"><div class="kpi__label">Schedule collegate</div><div class="kpi__value">${i.length}</div><div class="kpi__delta">${i.filter(e=>e.enabled).length} attive</div></div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Capabilities rilevate</h3><p class="card__sub">Servizi HA chiamabili su questo dispositivo</p></div></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${(t.capabilities||[]).map(e=>W`<span class="rule-token mono">${t.domain}.${e}</span>`)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Schedulazioni che usano questo dispositivo</h3><p class="card__sub">${i.length} programmazioni collegate</p></div></div>
          ${i.length?W`<div class="col" style="gap:10px">
                ${i.map(e=>W`
                  <div class="card card--ghost" style="padding:14px">
                    <div class="sp-between" style="margin-bottom:8px">
                      <div>
                        <div class="fw-600">${e.name}</div>
                        <div class="text-xs text-mute mono">${this._computeRepeat(e.days)}</div>
                      </div>
                      <button class="btn btn--sm" @click=${()=>this.card.selectSchedule(e.id,"editor")}>Apri ${me("chevron-right",12)}</button>
                    </div>
                    <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${e.enabled?this.nowHour:null}></chronos-timeline>
                  </div>
                `)}
              </div>`:W`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                <div style="font-weight:600;color:var(--text);font-size:14px">Nessuna programmazione</div>
                <div style="font-size:12.5px;margin-top:4px">Questo dispositivo non è incluso in nessuno schedule.</div>
              </div>`}
        </div>
      </div>
    `}_computeRepeat(e){const t=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];return e?.length?e.every(Boolean)?"Ogni giorno":e.map((e,i)=>e?t[i]:null).filter(Boolean).join(" · "):""}};rt.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],rt.prototype,"card",void 0),e([ve({type:Number})],rt.prototype,"nowHour",void 0),rt=e([pe("chronos-device-screen")],rt);let nt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e}=this.card,t=(new Date).getDay(),i=0===t?6:t-1;return W`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">Vista settimanale</h1>
          <p class="page-sub">Tutte le schedulazioni distribuite sui giorni della settimana</p>
        </div>

        <div class="row" style="justify-content:space-between">
          <div class="row">
            <button class="btn btn--icon btn--ghost">${me("chevron-left",14)}</button>
            <strong class="mono">Settimana corrente</strong>
            <button class="btn btn--icon btn--ghost">${me("chevron-right",14)}</button>
          </div>
          <div class="segmented">
            <button data-active="false">Giorno</button>
            <button data-active="true">Settimana</button>
            <button data-active="false">Mese</button>
          </div>
        </div>

        <div class="card">
          <div class="weekgrid">
            <div class="weekgrid__row" style="margin-bottom:6px">
              <div></div>
              <div style="position:relative;height:18px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
                ${[0,4,8,12,16,20,24].map(e=>W`
                  <span style="position:absolute;left:${e/24*100}%;transform:translateX(-50%)">${String(e).padStart(2,"0")}</span>
                `)}
              </div>
            </div>
            ${We.map((t,s)=>W`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${s===i?"var(--accent)":""}">
                  ${t}${s===i?W`<span style="display:block;font-size:9px;margin-top:2px">OGGI</span>`:F}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${e.filter(e=>e.enabled&&e.days[s]).map(e=>W`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500" class="truncate">${e.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="mini" .showWeather=${!1}
                            .now=${s===i?this.nowHour:null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${e.filter(e=>e.enabled&&e.days[s]).length?F:W`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">Nessuna schedulazione attiva</div>`}
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(we).map(([e,t])=>W`
            <div class="row" style="gap:6px">
              <span style="width:12px;height:8px;border-radius:2px;background:${t}"></span>
              <span class="text-xs">${{on:"Attiva",off:"Spenta",set:"Imposta valore",preset:"Preset",cmd:"Comando"}[e]}</span>
            </div>
          `)}
        </div>
      </div>
    `}};nt.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],nt.prototype,"card",void 0),e([ve({type:Number})],nt.prototype,"nowHour",void 0),nt=e([pe("chronos-week")],nt);let lt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const{_schedules:e,_devices:t,_forecast:i,_settings:s}=this.card,a=s?.weather_entity||"",o=a?this.card.hass?.states?.[a]:null,r=o?.attributes?.temperature??"—",n=o?.state||"cloud",l=o?.attributes?.humidity??"—",d=o?.attributes?.wind_speed??"—",c=e.filter(e=>e.enabled).map(e=>{const t=e.blocks.find(e=>this.nowHour>=e.start&&this.nowHour<e.end);return{schedule:e,active:t}});return W`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">Stato live</h1>
            <p class="page-sub">Cosa sta facendo ora il sistema</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>In esecuzione</span>
          </div>
        </div>

        <!-- Weather hero -->
        <div class="grid-2">
          <div class="weather-hero">
            <div class="weather-hero__icon">${ye(n,32)}</div>
            <div>
              <div class="weather-hero__temp">${r}°<span style="font-size:16px;color:var(--text-muted)">C</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(n)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${me("droplet",11)} ${l}%</span>
              <span class="chip">${me("wind",11)} ${d} km/h</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">Previsione 24h</h3><p class="card__sub">Forecast orario</p></div></div>
            <div class="forecast-row">
              ${i.filter((e,t)=>t%2==0).slice(0,12).map(e=>{const t=new Date(e.datetime||"").getHours?.()??0,i=e.condition||"cloud";return W`
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Schedulazioni live</h3><p class="card__sub">${c.filter(e=>e.active).length} fasce attive ora</p></div></div>
          <div class="col" style="gap:12px">
            ${c.map(({schedule:e,active:t})=>W`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${t?"var(--ok)":"var(--text-muted)"};box-shadow:${t?"0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)":"none"}"></span>
                    <strong>${e.name}</strong>
                    ${t?W`<span class="chip chip--accent">${Me(e.device_type,t.action)}</span>`:W`<span class="chip">In attesa</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${()=>this.card.selectSchedule(e.id,"editor")}>
                    Apri ${me("chevron-right",12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${e.device_type} .blocks=${e.blocks} .interactive=${!1} height="compact" .showWeather=${!1} .now=${this.nowHour}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Dispositivi · stato live</h3><p class="card__sub">Valori in tempo reale</p></div></div>
          <div class="col" style="gap:0">
            ${t.map(e=>{const t=this.card.hass?.states?.[e.entity_id],i=Ye(e,t,this.card._settings),s=this._computeBarPercent(e,t);return W`
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
    `}_computeBarPercent(e,t){if(!t)return 0;const i=t.attributes||{};if("light"===e.type){const e=i.brightness;return"number"==typeof e?Math.round(e/255*100):"on"===t.state?100:0}if("fan"===e.type)return"number"==typeof i.percentage?i.percentage:0;if("blind"===e.type)return"number"==typeof i.current_position?i.current_position:0;if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return Math.min(100,Math.max(0,(e-5)/30*100))}return"on"===t.state||"open"===t.state?100:0}_formatState(e,t){if(!t)return"—";const i=t.attributes||{};if("thermostat"===e.type||"boiler"===e.type){const e=i.current_temperature??i.temperature;if("number"==typeof e)return`${e.toFixed(1)}°`}return"fan"===e.type&&"number"==typeof i.percentage?`${i.percentage}%`:"blind"===e.type&&"number"==typeof i.current_position?`${i.current_position}%`:"light"===e.type&&"on"===t.state&&"number"==typeof i.brightness?`${Math.round(i.brightness/255*100)}%`:t.state}_conditionLabel(e){return{sunny:"Soleggiato",rainy:"Pioggia",cloudy:"Nuvoloso",partlycloudy:"Parzialmente nuvoloso",snowy:"Neve",fog:"Nebbia",windy:"Ventoso"}[e]||e}};lt.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],lt.prototype,"card",void 0),e([ve({type:Number})],lt.prototype,"nowHour",void 0),lt=e([pe("chronos-live")],lt);let dt=class extends de{constructor(){super(...arguments),this.nowHour=0,this._step=0,this._name="Nuova schedulazione",this._pickedDevices=[],this._days=[1,1,1,1,1,1,1],this._weatherEnabled=!0,this._blocks=[],this._blocksDeviceType="",this._selectedBlockIdx=-1,this._variant="linear",this._steps=[{key:"name",label:"Nome"},{key:"device",label:"Dispositivi"},{key:"time",label:"Fasce orarie"},{key:"days",label:"Ripetizione"},{key:"weather",label:"Meteo"},{key:"review",label:"Riepilogo"}]}render(){return W`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${()=>this.card.navigate("overview")}>
            ${me("chevron-left",14)} Annulla
          </button>
          <h1 class="page-title" style="margin-top:6px">Crea schedulazione</h1>
          <p class="page-sub">Procedura guidata · puoi modificare tutto in seguito</p>
        </div>

        <div class="wizard-stepper">
          ${this._steps.map((e,t)=>W`
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
            ${me("chevron-left",14)} Indietro
          </button>
          ${this._step<this._steps.length-1?W`<button class="btn btn--primary" @click=${()=>{this._step++}}>
                Avanti ${me("chevron-right",14)}
              </button>`:W`<button class="btn btn--primary" @click=${()=>this._finish()}>
                ${me("check",14)} Crea schedulazione
              </button>`}
        </div>
      </div>
    `}_renderStepContent(){switch(this._step){case 0:return W`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Dai un nome alla schedulazione</h3>
            <p class="text-mute text-sm" style="margin:0">Sarà visibile nella panoramica e nelle notifiche.</p>
            <input class="input" .value=${this._name} @input=${e=>{this._name=e.target.value}}
              style="font-size:18px;padding:12px 14px"/>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              <span class="text-xs text-mute">Suggerimenti:</span>
              ${["Riscaldamento Casa","Irrigazione Giardino","Tapparelle Sud","Luci Serata"].map(e=>W`
                <button class="chip" @click=${()=>{this._name=e}} style="cursor:pointer">${e}</button>
              `)}
            </div>
          </div>
        `;case 1:return W`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Quali dispositivi sono coinvolti?</h3>
            <p class="text-mute text-sm" style="margin:0">Verranno tutti controllati dalla stessa programmazione.</p>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
              ${this.card._devices.map(e=>W`
                <button class="tile-pick" data-selected="${this._pickedDevices.includes(e.id)}"
                  @click=${()=>this._togglePick(e.id)}>
                  <div class="row" style="gap:10px">
                    <div class="tile-pick__icon">${xe(e.type,16)}</div>
                    <div style="min-width:0;flex:1">
                      <div class="tile-pick__name truncate">${e.alias}</div>
                      <div class="tile-pick__desc">${e.area} · ${Je[e.type]?.label||e.type}</div>
                    </div>
                    ${this._pickedDevices.includes(e.id)?me("check",16):F}
                  </div>
                </button>
              `)}
            </div>
          </div>
        `;case 2:{const e=this._inferDeviceType();this._ensureBlocksFor(e);const t=this._selectedBlockIdx>=0?this._blocks[this._selectedBlockIdx]:void 0,i=t?.action?ze(e,t.action.id):void 0,s=Ae(e);return W`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Imposta le fasce orarie</h3>
            <p class="text-mute text-sm" style="margin:0">Clicca su una zona vuota della barra per aggiungere una fascia. Trascina i bordi per modificarne durata e posizione.</p>

            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
              <span class="text-xs text-mute">Visualizzazione:</span>
              <div class="segmented">
                ${["linear","radial","list"].map(e=>W`
                  <button data-active="${this._variant===e}" @click=${()=>{this._variant=e}}>
                    ${{linear:"Lineare",radial:"Radiale",list:"Lista"}[e]}
                  </button>
                `)}
              </div>
              <div style="flex:1"></div>
              <button class="btn btn--sm" @click=${()=>this._resetBlocks(e)}>
                ${me("repeat",12)} Reset preset
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

            ${t?W`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div>
                    <div class="text-xs text-mute mono">Fascia selezionata</div>
                    <div class="fw-600 mono">${this._fmtBlockRange(t)}</div>
                  </div>
                  <button class="btn btn--sm" style="color:var(--danger)" @click=${()=>this._removeSelected()}>
                    ${me("trash",12)} Rimuovi fascia
                  </button>
                </div>
                <div class="field">
                  <label class="field__label">Azione</label>
                  <div class="row" style="gap:6px;flex-wrap:wrap">
                    ${s.map(i=>W`
                      <button class="chip" data-active="${t.action?.id===i.id}"
                        style="background:${t.action?.id===i.id?Ce(e,{id:i.id}):"var(--bg-sunken)"};color:${t.action?.id===i.id?"white":"var(--text-soft)"};border:1px solid ${t.action?.id===i.id?"transparent":"var(--border-soft)"};cursor:pointer"
                        @click=${()=>this._setAction(i.id)}>${i.label}</button>
                    `)}
                  </div>
                </div>
                ${i?.value?W`
                  <div class="field" style="margin-top:10px">
                    <label class="field__label">${i.value.label||"Valore"} ${i.value.unit?W`<span class="text-mute">(${i.value.unit})</span>`:F}</label>
                    ${"number"===i.value.type?W`
                      <div class="row" style="gap:10px;align-items:center">
                        <input type="range" min="${i.value.min}" max="${i.value.max}" step="${i.value.step}"
                          .value=${String(t.action?.value??i.value.default)}
                          @input=${e=>this._setActionValue(parseFloat(e.target.value))}
                          style="flex:1"/>
                        <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${t.action?.value??i.value.default}${i.value.unit||""}</span>
                      </div>
                    `:"enum"===i.value.type?W`
                      <select class="input" @change=${e=>this._setActionValue(e.target.value)}>
                        ${(i.value.options||[]).map(e=>{const s=String(t.action?.value??i.value.default);return W`<option value="${e}" ?selected=${s===e}>${e}</option>`})}
                      </select>
                    `:F}
                  </div>
                `:F}
              </div>
            `:W`
              <p class="text-xs text-mute" style="margin:0">Nessuna fascia selezionata. Clicca su una fascia esistente per modificarla, oppure su una zona libera per aggiungerne una nuova.</p>
            `}

            <p class="text-xs text-mute" style="margin:0">${this._blocks.length} fasce · totale coperto ${this._totalCoverage()}h / 24h</p>
          </div>
        `}case 3:return W`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Quali giorni della settimana?</h3>
            <p class="text-mute text-sm" style="margin:0">La schedulazione si ripeterà automaticamente ogni settimana.</p>
            <div class="row" style="gap:4px">
              ${We.map((e,t)=>{const i=this._days[t];return W`
                  <button class="mono" @click=${()=>{const e=[...this._days];e[t]=e[t]?0:1,this._days=e}} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${i?"var(--accent)":"var(--bg-sunken)"};color:${i?"white":"var(--text-muted)"};border:1px solid ${i?"transparent":"var(--border-soft)"};cursor:pointer">
                    ${e}
                  </button>
                `})}
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,1,1]}}>Tutti i giorni</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[1,1,1,1,1,0,0]}}>Lavorativi</button>
              <button class="btn btn--sm" @click=${()=>{this._days=[0,0,0,0,0,1,1]}}>Weekend</button>
            </div>
          </div>
        `;case 4:return W`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Logica meteo</h3>
            <p class="text-mute text-sm" style="margin:0">Vuoi che il meteo locale modifichi automaticamente questa programmazione?</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!0}}>
                <div class="tile-pick__icon">${me("cloud",16)}</div>
                <div class="tile-pick__name">Sì, abilita</div>
                <div class="tile-pick__desc">Suggeriremo regole utili in base al tipo di dispositivo</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${()=>{this._weatherEnabled=!1}}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${me("close",16)}</div>
                <div class="tile-pick__name">No, solo orari</div>
                <div class="tile-pick__desc">Esecuzione fissa indipendente dal meteo</div>
              </button>
            </div>
          </div>
        `;case 5:return W`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">Riepilogo</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">Nome</span><strong>${this._name}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Dispositivi</span><strong>${this._pickedDevices.length} selezionati</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Giorni</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Logica meteo</span><strong>${this._weatherEnabled?"Abilitata":"Disabilitata"}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Fasce orarie</span><strong>${this._blocks.length}</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">Potrai modificare ogni dettaglio dall'editor dopo la creazione.</p>
          </div>
        `;default:return F}}_togglePick(e){this._pickedDevices.includes(e)?this._pickedDevices=this._pickedDevices.filter(t=>t!==e):this._pickedDevices=[...this._pickedDevices,e]}_inferDeviceType(){if(!this._pickedDevices.length)return"thermostat";const e=this.card._devices.find(e=>e.id===this._pickedDevices[0]);return e?.type||"thermostat"}_defaultBlocks(e){const t=Ee(e);return[{start:0,end:7,action:{...t}},{start:7,end:22,action:{...t}},{start:22,end:24,action:{...t}}]}_ensureBlocksFor(e){this._blocksDeviceType!==e&&(this._blocks=this._defaultBlocks(e),this._blocksDeviceType=e,this._selectedBlockIdx=-1)}_resetBlocks(e){this._blocks=this._defaultBlocks(e),this._selectedBlockIdx=-1}_removeSelected(){this._selectedBlockIdx<0||(this._blocks=this._blocks.filter((e,t)=>t!==this._selectedBlockIdx),this._selectedBlockIdx=-1)}_setAction(e){if(this._selectedBlockIdx<0)return;const t=ze(this._inferDeviceType(),e),i=[...this._blocks];i[this._selectedBlockIdx]={...i[this._selectedBlockIdx],action:{id:e,value:t?.value?t.value.default:void 0}},this._blocks=i}_setActionValue(e){if(this._selectedBlockIdx<0)return;const t=[...this._blocks],i=t[this._selectedBlockIdx];t[this._selectedBlockIdx]={...i,action:{...i.action||{id:""},value:e}},this._blocks=t}_fmtBlockRange(e){const t=e=>{const t=Math.floor(e),i=Math.round(60*(e-t));return`${String(t).padStart(2,"0")}:${String(i).padStart(2,"0")}`};return`${t(e.start)} → ${t(e.end)}`}_totalCoverage(){const e=this._blocks.reduce((e,t)=>e+(t.end-t.start),0);return e.toFixed(1).replace(/\.0$/,"")}async _finish(){const e=this._inferDeviceType();this._ensureBlocksFor(e);const t={id:"",name:this._name,device_type:e,device_ids:this._pickedDevices,days:this._days,enabled:!0,blocks:[...this._blocks].sort((e,t)=>e.start-t.start),weather_rules:this._weatherEnabled?[{if:"temperature > 22°C",then:"Salta esecuzione",active:!0}]:[]};await this.card.doAddSchedule(t)}};dt.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],dt.prototype,"card",void 0),e([ve({type:Number})],dt.prototype,"nowHour",void 0),e([ge()],dt.prototype,"_step",void 0),e([ge()],dt.prototype,"_name",void 0),e([ge()],dt.prototype,"_pickedDevices",void 0),e([ge()],dt.prototype,"_days",void 0),e([ge()],dt.prototype,"_weatherEnabled",void 0),e([ge()],dt.prototype,"_blocks",void 0),e([ge()],dt.prototype,"_blocksDeviceType",void 0),e([ge()],dt.prototype,"_selectedBlockIdx",void 0),e([ge()],dt.prototype,"_variant",void 0),dt=e([pe("chronos-wizard")],dt);let ct=class extends de{constructor(){super(...arguments),this.nowHour=0,this._pickerOpen=!1,this._search="",this._pickedAlias={}}render(){const{_devices:e,_availableEntities:t}=this.card;return W`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">Gestisci dispositivi</h1>
            <p class="page-sub">Entità di Home Assistant importate · ${e.length} dispositivi controllati</p>
          </div>
          <button class="btn btn--primary" @click=${()=>{this._pickerOpen=!0}}>
            ${me("plus",14)} Aggiungi entità
          </button>
        </div>

        <div class="card">
          <div class="col" style="gap:0">
            ${e.map(e=>{const t=Je[e.type]||{label:e.type,capabilities:[]},i=this.card.hass?.states?.[e.entity_id],s=i?.state||"—",a=Ye(e,i,this.card._settings);return W`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center">
                  <div class="device-row__icon" style="background:${a.soft};color:${a.accent};flex:0 0 auto;border:1px solid ${a.soft}">
                    ${xe(e.type,17)}
                  </div>
                  <div class="device-row__main" style="min-width:0">
                    <input class="input" .value=${e.alias}
                      @change=${t=>this.card.doUpdateDevice(e.id,{alias:t.target.value})}
                      style="border:1px solid transparent;background:transparent;padding:4px 6px;font-weight:500;font-size:14px;margin-left:-6px;width:100%;max-width:240px"
                      placeholder="Alias…"/>
                    <div class="device-row__meta" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--text-muted)">${e.entity_id}</span>
                      ${e.area?W` · ${e.area}`:F}
                    </div>
                  </div>
                  <span class="chip chip--accent" style="flex:0 0 auto">${t.label}</span>
                  <div class="row" style="gap:4px;flex:0 1 auto;min-width:0;overflow:hidden">
                    ${(t.capabilities||[]).slice(0,2).map(e=>W`<span class="tag mono" style="white-space:nowrap">${e}</span>`)}
                    ${(t.capabilities||[]).length>2?W`<span class="tag mono">+${t.capabilities.length-2}</span>`:F}
                  </div>
                  <span class="mono text-xs text-mute" style="flex:0 0 auto;min-width:60px;text-align:right">${s}</span>
                  <button class="btn btn--icon btn--ghost btn--sm" style="flex:0 0 auto" @click=${()=>this.card.doRemoveDevice(e.id)} title="Sgancia">
                    ${me("trash",14)}
                  </button>
                </div>
              `})}
            ${e.length?F:W`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${me("device",22)}</div>
              <div style="font-weight:600;color:var(--text);font-size:14px">Nessun dispositivo importato</div>
              <div style="font-size:12.5px;margin-top:4px">Aggiungi le tue prime entità HA per iniziare.</div>
            </div>`}
          </div>
        </div>

        <p class="text-xs text-mute" style="margin:0">
          <strong>Tipo e capabilities</strong> vengono dedotti automaticamente dal dominio dell'entità HA (es. <span class="mono">climate.*</span> → termostato).
        </p>

        ${this._pickerOpen?this._renderPicker(t):F}
      </div>
    `}_renderPicker(e){const t=e.filter(e=>!this._search||(e.entity_id+e.friendly_name).toLowerCase().includes(this._search.toLowerCase()));return W`
      <div class="modal-overlay" @click=${()=>{this._pickerOpen=!1}}>
        <div class="card" style="width:min(640px,100%);max-height:80vh;display:flex;flex-direction:column" @click=${e=>e.stopPropagation()}>
          <div class="sp-between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0">Aggiungi entità HA</h3>
              <p class="text-mute text-sm" style="margin:2px 0 0">${e.length} entità disponibili nel tuo Home Assistant</p>
            </div>
            <button class="btn btn--icon btn--ghost" @click=${()=>{this._pickerOpen=!1}}>${me("close",16)}</button>
          </div>
          <input class="input" placeholder="Cerca per nome o entity_id…" .value=${this._search}
            @input=${e=>{this._search=e.target.value}}
            style="margin-bottom:12px"/>
          <div style="overflow:auto;flex:1;display:flex;flex-direction:column;gap:4px">
            ${t.map(e=>{const t=e.type||"plug",i=Je[t]||{label:t};return W`
                <div class="device-row" style="background:var(--bg-sunken);padding:10px 12px">
                  <div class="device-row__icon">${xe(t,16)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.friendly_name}</div>
                    <div class="device-row__meta"><span class="mono">${e.entity_id}</span> · ${e.area||""}</div>
                  </div>
                  <input class="input" placeholder="Alias (opzionale)"
                    .value=${this._pickedAlias[e.entity_id]||""}
                    @input=${t=>{this._pickedAlias={...this._pickedAlias,[e.entity_id]:t.target.value}}}
                    style="width:160px;font-size:12px"/>
                  <span class="chip chip--accent">${i.label}</span>
                  <button class="btn btn--sm btn--primary" @click=${async()=>{await this.card.doAddDevice(e.entity_id,this._pickedAlias[e.entity_id]||void 0),this._pickedAlias={...this._pickedAlias,[e.entity_id]:""}}}>${me("plus",12)} Importa</button>
                </div>
              `})}
            ${e.length?F:W`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text);font-size:14px">Tutto importato</div>
              <div style="font-size:12.5px;margin-top:4px">Tutte le entità disponibili sono già state aggiunte.</div>
            </div>`}
          </div>
        </div>
      </div>
    `}};ct.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],ct.prototype,"card",void 0),e([ve({type:Number})],ct.prototype,"nowHour",void 0),e([ge()],ct.prototype,"_pickerOpen",void 0),e([ge()],ct.prototype,"_search",void 0),e([ge()],ct.prototype,"_pickedAlias",void 0),ct=e([pe("chronos-devices-screen")],ct);let pt=class extends de{constructor(){super(...arguments),this.nowHour=0}render(){const e=this.card._settings;return e?W`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">Impostazioni</h1>
          <p class="page-sub">Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Sorgente meteo</h3><p class="card__sub">Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">Entità meteo principale</label>
              <select class="select mono"
                @change=${e=>this._updateSetting("weather_entity",e.target.value)}>
                <option value="" ?selected=${!e.weather_entity}>Nessuna</option>
                ${this.card._weatherEntities.map(t=>W`
                  <option value="${t.entity_id}" ?selected=${e.weather_entity===t.entity_id}>${t.entity_id} — ${t.friendly_name}</option>
                `)}
              </select>
              <span class="field__hint">Usata per le forecast.* e come fallback se nessun override è impostato qui sotto</span>
            </div>

            ${this._renderSensorOverrides()}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Comportamento esecuzione</h3><p class="card__sub">Frequenza di aggiornamento e granularità</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">Polling meteo</label>
              <div class="segmented">
                ${[1,5,15].map(t=>W`
                  <button data-active="${e.polling_minutes===t}" @click=${()=>this._updateSetting("polling_minutes",t)}>${t} min</button>
                `)}
              </div>
              <span class="field__hint">Ogni quanto rivalutare le regole</span>
            </div>
            <div class="field">
              <label class="field__label">Snap timeline</label>
              <div class="segmented">
                ${[15,30,60].map(t=>W`
                  <button data-active="${e.snap_minutes===t}" @click=${()=>this._updateSetting("snap_minutes",t)}>${60===t?"1 h":`${t} min`}</button>
                `)}
              </div>
              <span class="field__hint">Granularità nel disegnare le fasce</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Notifiche</h3><p class="card__sub">Eventi che vogliono una notifica HA</p></div></div>
          <div class="col" style="gap:0">
            ${[["notify_rule_triggered","Regola meteo attivata","Quando una regola override entra in azione"],["notify_sched_skipped","Schedulazione saltata","Quando una fascia viene skippata per condizioni meteo"],["notify_command_error","Errore comando","Se un dispositivo non risponde"]].map(([t,i,s])=>W`
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Aspetto</h3><p class="card__sub">Tema e densità predefinita</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">Tema</label>
              <div class="segmented">
                ${["light","dark","auto"].map(t=>W`
                  <button data-active="${e.theme===t}" @click=${()=>this._updateSetting("theme",t)}>
                    ${{light:"Chiaro",dark:"Scuro",auto:"Auto"}[t]}
                  </button>
                `)}
              </div>
            </div>
            <div class="field">
              <label class="field__label">Densità</label>
              <div class="segmented">
                ${["comfortable","compact"].map(t=>W`
                  <button data-active="${e.density===t}" @click=${()=>this._updateSetting("density",t)}>
                    ${{comfortable:"Comoda",compact:"Compatta"}[t]}
                  </button>
                `)}
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Timeline predefinita</h3><p class="card__sub">Quale variante mostrare di default nell'editor</p></div></div>
          <div class="segmented">
            ${["linear","radial","list"].map(t=>W`
              <button data-active="${e.default_timeline_variant===t}" @click=${()=>this._updateSetting("default_timeline_variant",t)}>
                ${{linear:"Lineare",radial:"Radiale",list:"Lista"}[t]}
              </button>
            `)}
          </div>
        </div>

        ${this._renderColorsSection()}
      </div>
    `:W`<div class="text-mute">Caricamento…</div>`}_renderColorsSection(){const e=this.card._settings,t=Xe(e,"thermostat"),i=Xe(e,"boiler"),s=Qe(e),a=Ke(e);return W`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">Colori dispositivi</h3><p class="card__sub">L'accent del dispositivo riflette il suo stato corrente</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">Luci · usa colore reale da Home Assistant</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${a}
                @change=${e=>this._updateSetting("color_light_use_state",e.target.checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops("Termostati · gradiente temperatura","Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.",t,"color_stops_climate",qe)}

          ${this._renderTempStops("Boiler · gradiente temperatura","Stessa logica del termostato, range tipico 30-75°C.",i,"color_stops_boiler",Fe)}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">Preset modalità (climate)</div>
                <div class="text-xs text-mute">Override del colore quando il termostato è in un preset specifico</div>
              </div>
              <button class="btn btn--sm" @click=${()=>this._updateSetting("color_presets",{...Ge})}>
                ${me("repeat",12)} Reset default
              </button>
            </div>
            <div class="grid-2" style="gap:8px">
              ${Object.entries(s).map(([e,t])=>W`
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
    `}_renderTempStops(e,t,i,s,a){return W`
      <div>
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
          <div>
            <div class="fw-600" style="font-size:13.5px">${e}</div>
            <div class="text-xs text-mute">${t}</div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn btn--sm" @click=${()=>this._addStop(i,s)}>
              ${me("plus",12)} Stop
            </button>
            <button class="btn btn--sm" @click=${()=>this._updateSetting(s,a.map(e=>({...e})))}>
              ${me("repeat",12)} Default
            </button>
          </div>
        </div>
        <div class="col" style="gap:6px">
          ${i.map((e,t)=>{const a=t===i.length-1;return W`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <span class="text-sm text-mute" style="width:18px">${a?">":"≤"}</span>
                ${a?W`<span class="mono text-sm" style="width:80px">${i[t-1]?.max??0}°+</span>`:W`<input type="number" class="input mono" step="0.5" .value=${String(e.max)}
                      @change=${e=>this._updateStopMax(i,s,t,parseFloat(e.target.value))}
                      style="width:80px;font-size:13px"/>`}
                <span class="text-sm text-mute">°C</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${e.color};border:1px solid var(--border)"></div>
                <span class="mono text-xs" style="flex:1;color:var(--text-muted)">${e.color}</span>
                <input type="color" .value=${e.color}
                  @change=${e=>this._updateStopColor(i,s,t,e.target.value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                ${i.length>1?W`
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._removeStop(i,s,t)} title="Rimuovi">
                    ${me("trash",12)}
                  </button>
                `:F}
              </div>
            `})}
        </div>
      </div>
    `}_addStop(e,t){const i=e.filter(e=>e.max<900),s={max:(i.length?i[i.length-1].max:20)+5,color:"#9ca3af"},a=e.find(e=>e.max>=900),o=[...i,s];a&&o.push(a),this._updateSetting(t,o)}_removeStop(e,t,i){const s=e.filter((e,t)=>t!==i);this._updateSetting(t,s)}_updateStopMax(e,t,i,s){if(isNaN(s))return;const a=e.map((e,t)=>t===i?{...e,max:s}:e);this._updateSetting(t,a)}_updateStopColor(e,t,i,s){const a=e.map((e,t)=>t===i?{...e,color:s}:e);this._updateSetting(t,a)}_updatePresetColor(e,t){const i=Qe(this.card._settings);this._updateSetting("color_presets",{...i,[e]:t})}_renderSensorOverrides(){const e=this.card._settings.weather_sensor_map||{},t=this.card._sensorEntities||[],i=(this.card._weatherAttributes||[]).filter(e=>!e.key.startsWith("forecast."));if(!i.length)return F;const s=this._groupSensorsByDeviceClass(t);return W`
      <div class="field" style="margin-top:8px">
        <label class="field__label">Override su sensori puntuali</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          Per ogni attributo puoi specificare un'entità <span class="mono">sensor.*</span> da cui leggere il valore.
          Se vuoto, viene letto dall'entità weather principale.
        </span>
        <div class="col" style="gap:6px">
          ${i.map(i=>{const a=e[i.key]||"",o=t.find(e=>e.entity_id===a),r=o?`${o.state}${o.unit_of_measurement?" "+o.unit_of_measurement:""}`:"";return W`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center;flex-wrap:wrap">
                <div style="min-width:160px">
                  <div class="fw-600 text-sm">${i.label}</div>
                  <div class="text-xs text-mute mono">${i.key}${i.unit?` · ${i.unit}`:""}</div>
                </div>
                <select class="select mono" style="flex:1;min-width:240px"
                  @change=${e=>this._updateSensorOverride(i.key,e.target.value)}>
                  <option value="" ?selected=${!a}>— usa entità weather —</option>
                  ${this._renderSensorOptions(s,i,a)}
                </select>
                ${a?W`
                  <span class="mono text-xs" style="color:var(--text-muted);min-width:90px;text-align:right">${r}</span>
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${()=>this._updateSensorOverride(i.key,"")} title="Rimuovi override">
                    ${me("close",12)}
                  </button>
                `:F}
              </div>
            `})}
        </div>
      </div>
    `}_groupSensorsByDeviceClass(e){const t={};for(const i of e){const e=i.device_class||"other";(t[e]=t[e]||[]).push(i)}return t}_renderSensorOptions(e,t,i){const s=this._matchingDeviceClass(t.key),a=s&&e[s]?[s,...Object.keys(e).filter(e=>e!==s).sort()]:Object.keys(e).sort();return a.map(t=>W`
      <optgroup label="${"other"===t?"Altri sensori":t}${t===s?" · suggeriti":""}">
        ${e[t].map(e=>W`
          <option value="${e.entity_id}" ?selected=${i===e.entity_id}>
            ${e.entity_id}${e.unit_of_measurement?` (${e.unit_of_measurement})`:""} — ${e.friendly_name}
          </option>
        `)}
      </optgroup>
    `)}_matchingDeviceClass(e){return{temperature:"temperature",humidity:"humidity",wind_speed:"wind_speed",wind_bearing:"wind_direction",pressure:"atmospheric_pressure",uv_index:"uv_index"}[e]||null}_updateSensorOverride(e,t){const i={...this.card._settings?.weather_sensor_map||{}};t?i[e]=t:delete i[e],this._updateSetting("weather_sensor_map",i)}_updateSetting(e,t){this.card.doUpdateSettings({[e]:t})}};pt.styles=be,e([ve({attribute:!1,hasChanged:()=>!0})],pt.prototype,"card",void 0),e([ve({type:Number})],pt.prototype,"nowHour",void 0),pt=e([pe("chronos-settings-screen")],pt);const ht={overview:["Panoramica","chronos / overview"],editor:["Editor schedulazione","chronos / schedule / edit"],weatherRule:["Regola meteo","chronos / schedule / weather"],device:["Dispositivo","chronos / device"],week:["Vista settimanale","chronos / week"],live:["Stato live","chronos / live"],wizard:["Wizard","chronos / wizard"],devices:["Gestisci dispositivi","chronos / devices"],settings:["Impostazioni","chronos / settings"]};let ut=class extends de{constructor(){super(...arguments),this._screen="overview",this._selectedId="",this._deviceDetailId="",this._schedules=[],this._savedSchedules=[],this._devices=[],this._settings=null,this._timelineVariant="linear",this._pendingNav=null,this._loading=!0,this._actionsMap={},this._weatherAttributes=[],this._forecast=[],this._availableEntities=[],this._weatherEntities=[],this._sensorEntities=[],this._mobile=!1,this._drawerOpen=!1,this._dark=!1}setConfig(e){this.config=e}static getStubConfig(){return{type:"custom:chronos-card"}}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(e=>{for(const t of e)this._mobile=t.contentRect.width<700}),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}async firstUpdated(){await this._loadAll()}updated(e){if(e.has("hass")&&this.hass){const e=this.hass.themes?.darkMode??!1;e!==this._dark&&(this._dark=e)}e.has("_dark")&&(this._dark?this.setAttribute("dark",""):this.removeAttribute("dark")),e.has("_settings")&&this._settings?.density&&this.setAttribute("density",this._settings.density)}async _loadAll(){if(this.hass){this._loading=!0;try{const[e,t,i,s,a,o,r,n,l]=await Promise.all([Be(this.hass),Ie(this.hass),Ne(this.hass),Re(this.hass),je(this.hass),Oe(this.hass),De(this.hass),He(this.hass),Te(this.hass)]);this._devices=e,this._schedules=t,this._savedSchedules=JSON.parse(JSON.stringify(t)),this._settings=i,this._actionsMap=s,this._weatherAttributes=a,this._forecast=o,this._availableEntities=r,this._weatherEntities=n,this._sensorEntities=l,Se=s,i?.default_timeline_variant&&(this._timelineVariant=i.default_timeline_variant),t.length&&!this._selectedId&&(this._selectedId=t[0].id),e.length&&!this._deviceDetailId&&(this._deviceDetailId=e[0].id)}catch(e){console.error("Chronos: failed to load data",e)}this._loading=!1}}navigate(e){JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)&&"editor"===this._screen&&"editor"!==e?this._pendingNav=e:this._screen=e,this._drawerOpen=!1}selectSchedule(e,t){this._selectedId=e,t&&(this._screen=t)}selectDevice(e){this._deviceDetailId=e}get isDirty(){return JSON.stringify(this._schedules)!==JSON.stringify(this._savedSchedules)}async saveCurrentSchedule(){const e=this._schedules.find(e=>e.id===this._selectedId);if(!e)return;const t=await Pe(this.hass,e),i=this._schedules.findIndex(e=>e.id===t.id);i>=0&&(this._schedules=[...this._schedules.slice(0,i),t,...this._schedules.slice(i+1)]),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}updateScheduleLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,...t}:i)}updateBlocksLocal(e,t){this._schedules=this._schedules.map(i=>i.id===e?{...i,blocks:[...t].sort((e,t)=>e.start-t.start)}:i)}async doToggleSchedule(e,t){try{await async function(e,t,i){await e.callWS({type:"chronos/schedules/toggle",id:t,enabled:i})}(this.hass,e,t),this._schedules=this._schedules.map(i=>i.id===e?{...i,enabled:t}:i),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules))}catch(e){console.error("Chronos: toggleSchedule failed",e),await this._reloadAfterError()}}async doAddDevice(e,t){try{await async function(e,t,i,s){return e.callWS({type:"chronos/devices/add",entity_id:t,alias:i,area:s})}(this.hass,e,t)}catch(e){console.error("Chronos: addDevice failed",e)}this._devices=await Be(this.hass),this._availableEntities=await De(this.hass)}async doUpdateDevice(e,t){try{await async function(e,t,i){return e.callWS({type:"chronos/devices/update",id:t,patch:i})}(this.hass,e,t)}catch(e){console.error("Chronos: updateDevice failed",e)}this._devices=await Be(this.hass)}async doRemoveDevice(e){try{await async function(e,t){await e.callWS({type:"chronos/devices/remove",id:t})}(this.hass,e)}catch(e){console.error("Chronos: removeDevice failed",e)}this._devices=await Be(this.hass),this._schedules=await Ie(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._availableEntities=await De(this.hass)}async doRemoveSchedule(e){try{await async function(e,t){await e.callWS({type:"chronos/schedules/remove",id:t})}(this.hass,e)}catch(e){console.error("Chronos: removeSchedule failed",e)}this._schedules=await Ie(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId===e&&this._schedules.length?this._selectedId=this._schedules[0].id:this._schedules.length||(this._selectedId="")}async doAddSchedule(e){try{const t=await Pe(this.hass,e);this._schedules=await Ie(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._selectedId=t.id,this._screen="editor"}catch(e){console.error("Chronos: addSchedule failed",e)}}async doUpdateSettings(e){try{const t=await async function(e,t){return e.callWS({type:"chronos/settings/update",patch:t})}(this.hass,e);this._settings=t}catch(e){console.error("Chronos: updateSettings failed",e),this._settings=await Ne(this.hass)}}async _reloadAfterError(){try{this._devices=await Be(this.hass),this._schedules=await Ie(this.hass),this._savedSchedules=JSON.parse(JSON.stringify(this._schedules)),this._settings=await Ne(this.hass)}catch{}}setTimelineVariant(e){this._timelineVariant=e}render(){if(this._loading)return W`<div style="padding:40px;text-align:center;color:var(--text-muted)">Caricamento Chronos…</div>`;const[e,t]=ht[this._screen]||ht.overview,i=new Date,s=i.getHours()+i.getMinutes()/60,a=this._mobile&&this._drawerOpen,o=this._mobile?a?"drawer":"mini":"full";return W`
      <div class="app" data-mobile="${this._mobile}" data-drawer="${a}">
        ${this._renderSidebar(o)}
        ${a?W`<div class="sidebar-backdrop" @click=${()=>{this._drawerOpen=!1}}></div>`:F}
        <main class="content">
          ${this._renderTopbar(e,t,s)}
          <div class="content__inner">
            ${this._renderScreen(s)}
          </div>
        </main>
        ${this._pendingNav?this._renderDirtyModal():F}
      </div>
    `}_renderSidebar(e){const t="mini"===e,i=this._mobile;return W`
      <aside class="sidebar" data-mode="${e}">
        ${i?W`
              <button class="sidebar__hamburger" title="${t?"Apri menu":"Chiudi menu"}"
                @click=${()=>{this._drawerOpen=!this._drawerOpen}}>
                ${me(t?"menu":"close",18)}
              </button>
            `:F}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark">C</div>
          ${t?F:W`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v1.0 · HACS</div>
              </div>`}
        </div>
        ${t?F:W`<div class="nav-section">Principale</div>`}
        ${[{key:"overview",label:"Panoramica",iconName:"dashboard"},{key:"editor",label:"Editor",iconName:"clock"},{key:"week",label:"Settimana",iconName:"calendar"},{key:"weatherRule",label:"Regole meteo",iconName:"cloud"},{key:"device",label:"Dispositivi",iconName:"device"},{key:"live",label:"Stato live",iconName:"live"}].map(e=>W`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${t?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${me(e.iconName,16)} ${t?F:W`<span>${e.label}</span>`}
            </button>
          `)}
        ${t?F:W`<div class="nav-section">Azioni</div>`}
        ${[{key:"wizard",label:"Nuova schedulazione",iconName:"wand"},{key:"devices",label:"Gestisci dispositivi",iconName:"device"}].map(e=>W`
            <button class="nav-item" data-active="${this._screen===e.key}"
              title="${t?e.label:""}" @click=${()=>this.navigate(e.key)}>
              ${me(e.iconName,16)} ${t?F:W`<span>${e.label}</span>`}
            </button>
          `)}
        <div class="sidebar__footer">
          <button class="nav-item" data-active="${"settings"===this._screen}"
            title="${t?"Impostazioni":""}" @click=${()=>this.navigate("settings")}>
            ${me("settings",16)} ${t?F:W`<span>Impostazioni</span>`}
          </button>
        </div>
      </aside>
    `}_renderTopbar(e,t,i){return W`
      <div class="topbar">
        <div>
          <div class="topbar__title">${e}</div>
          <div class="topbar__crumbs">${t}</div>
        </div>
        <div class="topbar__spacer"></div>
        <div class="topbar__time">
          <span class="time-dot"></span>
          <span>${Le(i)}</span>
        </div>
        <button class="btn btn--icon btn--ghost" @click=${()=>{this._dark=!this._dark}}>
          ${me(this._dark?"sun":"moon",16)}
        </button>
      </div>
    `}_renderScreen(e){switch(this._screen){case"overview":default:return W`<chronos-overview .card=${this} .nowHour=${e}></chronos-overview>`;case"editor":return W`<chronos-editor .card=${this} .nowHour=${e}></chronos-editor>`;case"weatherRule":return W`<chronos-weather-rule .card=${this} .nowHour=${e}></chronos-weather-rule>`;case"device":return W`<chronos-device-screen .card=${this} .nowHour=${e}></chronos-device-screen>`;case"week":return W`<chronos-week .card=${this} .nowHour=${e}></chronos-week>`;case"live":return W`<chronos-live .card=${this} .nowHour=${e}></chronos-live>`;case"wizard":return W`<chronos-wizard .card=${this} .nowHour=${e}></chronos-wizard>`;case"devices":return W`<chronos-devices-screen .card=${this} .nowHour=${e}></chronos-devices-screen>`;case"settings":return W`<chronos-settings-screen .card=${this} .nowHour=${e}></chronos-settings-screen>`}}_renderDirtyModal(){return W`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">Modifiche non salvate</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${()=>{this._pendingNav=null}}>Resta qui</button>
            <button class="btn" @click=${()=>{this._schedules=JSON.parse(JSON.stringify(this._savedSchedules)),this._screen=this._pendingNav,this._pendingNav=null}}>Scarta modifiche</button>
            <button class="btn btn--primary" @click=${async()=>{await this.saveCurrentSchedule(),this._screen=this._pendingNav,this._pendingNav=null}}>${me("check",14)} Salva ed esci</button>
          </div>
        </div>
      </div>
    `}};ut.styles=[_e,be],e([ve({attribute:!1})],ut.prototype,"hass",void 0),e([ve({attribute:!1})],ut.prototype,"config",void 0),e([ge()],ut.prototype,"_screen",void 0),e([ge()],ut.prototype,"_selectedId",void 0),e([ge()],ut.prototype,"_deviceDetailId",void 0),e([ge()],ut.prototype,"_schedules",void 0),e([ge()],ut.prototype,"_savedSchedules",void 0),e([ge()],ut.prototype,"_devices",void 0),e([ge()],ut.prototype,"_settings",void 0),e([ge()],ut.prototype,"_timelineVariant",void 0),e([ge()],ut.prototype,"_pendingNav",void 0),e([ge()],ut.prototype,"_loading",void 0),e([ge()],ut.prototype,"_actionsMap",void 0),e([ge()],ut.prototype,"_weatherAttributes",void 0),e([ge()],ut.prototype,"_forecast",void 0),e([ge()],ut.prototype,"_availableEntities",void 0),e([ge()],ut.prototype,"_weatherEntities",void 0),e([ge()],ut.prototype,"_sensorEntities",void 0),e([ge()],ut.prototype,"_mobile",void 0),e([ge()],ut.prototype,"_drawerOpen",void 0),e([ge()],ut.prototype,"_dark",void 0),ut=e([pe("chronos-card")],ut),window.customCards=window.customCards||[],window.customCards.push({type:"chronos-card",name:"Chronos Scheduler",description:"Advanced scheduler for Home Assistant with weather-based rules"});export{ut as ChronosCard};
