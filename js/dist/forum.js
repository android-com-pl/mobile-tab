(()=>{var o={n:t=>{var n=t&&t.__esModule?()=>t.default:()=>t;return o.d(n,{a:n}),n},d:(t,n)=>{for(var e in n)o.o(n,e)&&!o.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},o:(o,t)=>Object.prototype.hasOwnProperty.call(o,t),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},t={};(()=>{"use strict";o.r(t),o.d(t,{components:()=>T});const n=flarum.core.compat["forum/app"];var e=o.n(n);const r=flarum.core.compat["common/extend"],a=flarum.core.compat["common/Application"];var s=o.n(a);function i(o,t){return i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(o,t){return o.__proto__=t,o},i(o,t)}function c(o,t){o.prototype=Object.create(t.prototype),o.prototype.constructor=o,i(o,t)}const l=flarum.core.compat["common/Component"];var u=o.n(l);const f=flarum.core.compat["common/helpers/listItems"];var p=o.n(f);const d=flarum.core.compat["common/utils/ItemList"];var b=o.n(d);const v=flarum.core.compat["common/components/LinkButton"];var y=o.n(v),h=function(o){function t(){for(var t,n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return(t=o.call.apply(o,[this].concat(e))||this).attrs=void 0,t}return c(t,o),t.prototype.view=function(o){var t=this.attrs,n=t.route,e=t.icon,r=t.label;return m(y(),{href:n,icon:e,title:r},r)},t}(u());const g=flarum.core.compat["common/components/Button"];var _=o.n(g);const w=flarum.core.compat["forum/components/LogInModal"];var O=o.n(w);const M=flarum.core.compat["forum/components/SessionDropdown"];var N=o.n(M);const k=flarum.core.compat["common/helpers/avatar"];var j=o.n(k),x=function(o){function t(){return o.apply(this,arguments)||this}return c(t,o),t.prototype.getButtonContent=function(o){var t=e().session.user;return[j()(t)," ",m("span",{className:"Button-label"},e().translator.trans("core.forum.header.profile_button"))]},t}(N()),S=function(o){function t(){return o.apply(this,arguments)||this}c(t,o);var n=t.prototype;return n.view=function(o){return m("nav",{className:"MobileTab"},m("ul",{className:"MobileTab-items"},p()(this.items().toArray())))},n.items=function(){var o=new(b());if(o.add("home",m(h,{route:"/",icon:"fas fa-home",label:e().translator.trans("acpl-mobile-tab.forum.home")}),100),"askvortsov-categories"in flarum.extensions?o.add("categories",m(h,{route:e().route("categories"),icon:"fas fa-th-list",label:e().translator.trans("askvortsov-categories.forum.index.categories_link")}),90):"flarum-tags"in flarum.extensions&&o.add("tags",m(h,{route:e().route("tags"),icon:"fas fa-tags",label:e().translator.trans("flarum-tags.forum.index.tags_link")}),90),e().session.user){var t=e().session.user.unreadNotificationCount();o.add("notifications",m(y(),{href:e().route("notifications"),icon:"fas fa-bell",title:e().translator.trans("core.forum.notifications.title"),className:"Dropdown NotificationsDropdown"},t?m("span",{className:"NotificationsDropdown-unread"},t):"",e().translator.trans("core.forum.notifications.title")),80),o.add("session",m(x,null),70)}else o.add("logIn",m(_(),{icon:"fas fa-user",className:"Button Button--link",onclick:function(){return e().modal.show(O(),{})}},e().translator.trans("core.forum.header.log_in_link")),70);return o},t}(u()),T={MobileTab:S,MobileTabItem:h,MobileTabSessionDropdown:x};e().initializers.add("acpl/mobile-tab",(function(){(0,r.extend)(s().prototype,"mount",(function(){var o=document.createElement("div");m.mount(document.body.appendChild(o),S)}))}))})(),module.exports=t})();
//# sourceMappingURL=forum.js.map