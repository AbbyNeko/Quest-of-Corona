var RPGUI=RPGUI||{};RPGUI.__update_funcs={},RPGUI.__create_funcs={},RPGUI.__get_funcs={},RPGUI.__set_funcs={},RPGUI.create=function(e,t){if(!RPGUI.__create_funcs[t])throw"Not a valid rpgui type! options: "+Object.keys(RPGUI.__create_funcs);e.dataset.rpguitype=t,RPGUI.__create_funcs[t](e)},RPGUI.update=function(e){var t=e.dataset.rpguitype;RPGUI.__update_funcs[t]?RPGUI.__update_funcs[t](e):RPGUI.fire_event(e,"change")},RPGUI.set_value=function(e,t){var n=e.dataset.rpguitype;RPGUI.__set_funcs[n]?RPGUI.__set_funcs[n](e,t):e.value=t,RPGUI.update(e)},RPGUI.get_value=function(e){var t=e.dataset.rpguitype;return RPGUI.__get_funcs[t]?RPGUI.__get_funcs[t](e):e.value};var RPGUI=RPGUI||{};!function(){function e(e){RPGUI.set_cursor(e,"point")}var t="rpgui-button";RPGUI.__create_funcs.button=function(n){RPGUI.add_class(n,t),e(n)},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"button")})}();var RPGUI=RPGUI||{};!function(){function e(e){var n=e.nextSibling;if(!n||"LABEL"!==n.tagName)throw"After an '"+t+"' there must be a label!";RPGUI.set_cursor(n,"point"),RPGUI.copy_event_listeners(e,n),function(e,t){t.addEventListener("click",function(){RPGUI.set_value(e,!e.checked)})}(e,n)}var t="rpgui-checkbox";RPGUI.__create_funcs.checkbox=function(n){RPGUI.add_class(n,t),e(n)},RPGUI.__set_funcs.checkbox=function(e,t){e.checked=t},RPGUI.__get_funcs.checkbox=function(e){return e.checked},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"checkbox")})}();var RPGUI=RPGUI||{};!function(){window.addEventListener("load",function(){for(var e=document.getElementsByClassName("rpgui-content"),t=0;t<e.length;++t){var n=e[t];RPGUI.prevent_drag(n),RPGUI.set_cursor(n,"default")}})}();var RPGUI=RPGUI||{};!function(){function e(e){s=null,window.removeEventListener("mousemove",n)}function t(e){var t=e.target||e.srcElement;if(RPGUI.has_class(t,i)){s=t;var o=s.getBoundingClientRect();a={x:o.left-e.clientX,y:o.top-e.clientY},t.style.zIndex=r++,window.addEventListener("mousemove",n,!0)}}function n(e){s&&(s.style.position="absolute",s.style.left=e.clientX+a.x+"px",s.style.top=e.clientY+a.y+"px")}var s=null,a=null,r=1e3,i="rpgui-draggable";RPGUI.__create_funcs.draggable=function(e){e.draggable=!1,e.ondragstart=function(){return!1},RPGUI.add_class(e,i),e.addEventListener("mousedown",t)},window.addEventListener("load",function(){for(var t=document.getElementsByClassName(i),n=0;n<t.length;++n)RPGUI.create(t[n],"draggable");window.addEventListener("mouseup",e)})}();var RPGUI=RPGUI||{};!function(){function e(e){progress_container=e,RPGUI.insert_after(progress_container,e),progress_container.style.width=e.offsetWidth+"px";var t=RPGUI.create_element("div");RPGUI.add_class(t,"rpgui-progress-track"),progress_container.appendChild(t);var n=RPGUI.create_element("div");RPGUI.add_class(n,"rpgui-progress-left-edge"),progress_container.appendChild(n);var s=RPGUI.create_element("div");RPGUI.add_class(s,"rpgui-progress-right-edge"),progress_container.appendChild(s);var a=RPGUI.create_element("div");RPGUI.add_class(a,"rpgui-progress-fill"),t.appendChild(a),RPGUI.has_class(e,"blue")&&(a.className+=" blue"),RPGUI.has_class(e,"red")&&(a.className+=" red"),RPGUI.has_class(e,"green")&&(a.className+=" green");var r=void 0!==e.dataset.value?parseFloat(e.dataset.value):1;RPGUI.set_value(e,r)}var t="rpgui-progress";RPGUI.__create_funcs.progress=function(n){RPGUI.add_class(n,t),e(n)},RPGUI.__set_funcs.progress=function(e,t){var n=RPGUI.get_child_with_class(e,"rpgui-progress-track"),s=RPGUI.get_child_with_class(n,"rpgui-progress-fill"),a=RPGUI.get_child_with_class(e,"rpgui-progress-left-edge"),r=RPGUI.get_child_with_class(e,"rpgui-progress-right-edge"),i=a.offsetWidth+r.offsetWidth;n.style.left=a.offsetWidth+"px",n.style.width=e.offsetWidth-i+"px",s.style.left="0px",s.style.width=n.offsetWidth*t+"px"},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"progress")})}();var RPGUI=RPGUI||{};!function(){function e(e){var n=e.nextSibling;if(!n||"LABEL"!==n.tagName)throw"After an '"+t+"' there must be a label!";RPGUI.set_cursor(n,"point"),RPGUI.copy_event_listeners(e,n),function(e,t){t.addEventListener("click",function(){RPGUI.set_value(e,!0)})}(e,n)}var t="rpgui-radio";RPGUI.__create_funcs.radio=function(n){RPGUI.add_class(n,t),e(n)},RPGUI.__set_funcs.radio=function(e,t){e.checked=t},RPGUI.__get_funcs.radio=function(e){return e.checked},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"radio")})}();var RPGUI=RPGUI||{};!function(){function e(e){var t="<label>&#9660;</label> ",n=RPGUI.create_element("p","point");RPGUI.add_class(n,"rpgui-dropdown-imp rpgui-dropdown-imp-header"),RPGUI.insert_after(n,e);var s=RPGUI.create_element("ul","point");RPGUI.add_class(s,"rpgui-dropdown-imp"),RPGUI.insert_after(s,n);var a=n.getBoundingClientRect();s.style.position="absolute",s.style.width=a.right-a.left-14+"px",s.style.display="none",e.style.display="none";for(var r=0;r<e.children.length;++r){var i=e.children[r];if("OPTION"==i.tagName){var o=RPGUI.create_element("li","point");o.innerHTML=i.innerHTML,s.appendChild(o),RPGUI.copy_event_listeners(i,o),function(e,n,s,a,r){s.addEventListener("click",function(){a.innerHTML=t+n.innerHTML,r.style.display="none",n.selected=!0,RPGUI.fire_event(e,"change")})}(e,i,o,n,s)}}n.innerHTML=t+e.options[e.selectedIndex].text,function(e,t,n){n.onclick=function(){var e=t.style.display;t.style.display="none"==e?"block":"none"},t.onmouseleave=function(){t.style.display="none"}}(e,s,n),function(e,n,s){e.addEventListener("change",function(){n.innerHTML=t+e.options[e.selectedIndex].text,s.style.display="none"})}(e,n,s)}var t="rpgui-dropdown";RPGUI.__create_funcs.dropdown=function(n){RPGUI.add_class(n,t),e(n)},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"dropdown")})}();var RPGUI=RPGUI||{};!function(){function e(e){e.size||(e.size=3);var t=RPGUI.create_element("ul","point");RPGUI.add_class(t,"rpgui-list-imp"),e.parentNode.insertBefore(t,e.nextSibling),e.style.display="none";for(var n=[],s=0;s<e.children.length;++s){var a=e.children[s];if("OPTION"==a.tagName){var r=RPGUI.create_element("li","point");r.innerHTML=a.innerHTML,t.appendChild(r),r.dataset.rpguivalue=a.value,n.push(r),RPGUI.copy_event_listeners(a,r),function(e,t,n,s,a){n.addEventListener("click",function(){t.selected=!0,RPGUI.fire_event(e,"change")})}(e,a,r,t,n)}}var i=r.offsetHeight;t.style.height=i*e.size+"px",function(e,t){function n(e){for(var n=0;n<t.length;++n){var s=t[n];s.dataset.rpguivalue==e.value?RPGUI.add_class(s,"rpgui-selected"):RPGUI.remove_class(s,"rpgui-selected")}}e.addEventListener("change",function(){n(this)}),n(e)}(e,n)}var t="rpgui-list";RPGUI.__create_funcs.list=function(n){RPGUI.add_class(n,t),e(n)},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"list")})}();var RPGUI=RPGUI||{};!function(){function e(e){var t=RPGUI.has_class(e,"golden")?" golden":"",n=RPGUI.create_element("div","point");RPGUI.add_class(n,"rpgui-slider-container"+t),RPGUI.insert_after(n,e),n.style.width=e.offsetWidth+"px";var s=RPGUI.create_element("div","point");RPGUI.add_class(s,"rpgui-slider-track"+t),n.appendChild(s);var a=RPGUI.create_element("div","point");RPGUI.add_class(a,"rpgui-slider-left-edge"+t),n.appendChild(a);var r=RPGUI.create_element("div","point");RPGUI.add_class(r,"rpgui-slider-right-edge"+t),n.appendChild(r);var i=RPGUI.create_element("div","point");RPGUI.add_class(i,"rpgui-slider-thumb"+t),n.appendChild(i),e.style.display="none",RPGUI.copy_event_listeners(e,n);var o={mouse_down:!1};!function(e,t,n,s,a,r,i){function o(e){var t=l+Math.round(e/_*u)-1;c(t)}function c(t){e.value!=t&&RPGUI.set_value(e,t)}function d(){var t=_/(u-l);n.style.left=Math.floor(.25*f)+Math.round((parseFloat(e.value)-l)*t)+"px"}var l=parseFloat(e.min),u=parseFloat(e.max),f=r.offsetWidth+i.offsetWidth,_=s.offsetWidth-f;t.addEventListener("mouseup",function(e){a.mouse_down=!1}),window.addEventListener("mouseup",function(e){a.mouse_down=!1}),s.addEventListener("mousedown",function(e){a.mouse_down=!0,o(e.offsetX||e.layerX)}),t.addEventListener("mousedown",function(e){a.mouse_down=!0}),i.addEventListener("mousedown",function(e){c(l)}),r.addEventListener("mousedown",function(e){c(u)}),i.addEventListener("mousemove",function(e){a.mouse_down&&c(l)}),r.addEventListener("mousemove",function(e){a.mouse_down&&c(u)}),s.addEventListener("mousemove",function(e){a.mouse_down&&o(e.offsetX||e.layerX)}),e.addEventListener("change",function(e){d()}),d()}(e,n,i,s,o,r,a)}var t="rpgui-slider";RPGUI.__create_funcs.slider=function(n){RPGUI.add_class(n,t),e(n)},window.addEventListener("load",function(){for(var e=document.getElementsByClassName(t),n=0;n<e.length;++n)RPGUI.create(e[n],"slider")})}();var RPGUI=RPGUI||{};RPGUI.version=1,RPGUI.author="Ronen Ness",RPGUI.create_element=function(e,t){return e=document.createElement(e),t&&RPGUI.set_cursor(e,t),e},RPGUI.set_cursor=function(e,t){RPGUI.add_class(e,"rpgui-cursor-"+t)},RPGUI.prevent_drag=function(e){},RPGUI.has_class=function(e,t){return(" "+e.className+" ").indexOf(" "+t+" ")>-1},RPGUI.add_class=function(e,t){RPGUI.has_class(e,t)||(e.className+=" "+t)},RPGUI.get_child_with_class=function(e,t){for(var n=0;n<e.childNodes.length;n++)if(RPGUI.has_class(e.childNodes[n],t))return e.childNodes[n]},RPGUI.remove_class=function(e,t){e.className=(" "+e.className+" ").replace(t,""),e.className=e.className.substring(1,e.className.length-1)},RPGUI.fire_event=function(e,t){if("createEvent"in document){var n=document.createEvent("HTMLEvents");n.initEvent(t,!1,!0),e.dispatchEvent(n)}else e.fireEvent("on"+t)},RPGUI.copy_event_listeners=function(e,t){if("function"==typeof getEventListeners){var n=getEventListeners(e);for(var s in n)n[s].forEach(function(e){t.addEventListener(s,e.listener,e.useCapture)})}for(attr in e)0===attr.indexOf("on")&&(t[attr]=e[attr])},RPGUI.insert_after=function(e,t){t.parentNode.insertBefore(e,t.nextSibling)};