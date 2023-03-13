(function(l){typeof define=="function"&&define.amd?define(l):l()})(function(){"use strict";const l="",u=t=>{if(t){const e=document.createElement("div");e.classList.add("loader","fixed","inset-0","flex","justify-center","items-center","bg-slate-900/[.6]"),e.innerHTML=`
            <svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#316595">
                <g fill="none" fill-rule="evenodd">
                    <g transform="translate(1 1)" stroke-width="2">
                        <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                        <path d="M36 18c0-9.94-8.06-18-18-18">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="1s"
                                repeatCount="indefinite"/>
                        </path>
                    </g>
                </g>
            </svg>
            `,document.body.appendChild(e)}else{const e=document.querySelector(".loader");e&&e.remove()}};class b extends Error{constructor(e){super(`${e.status} for ${e.url}`),this.name="HttpError",this.response=e}}const d=async t=>{u(!0);const e=await fetch(t);if(e.status==200){const i=await e.json();return u(!1),i}else throw new b(e)},m=()=>document.body.classList.contains("yt-blocked"),w=t=>{const e=document.createElement("div");e.classList.add("videoWrapper");let i="",s="";t.rutube?(i=`https://rutube.ru/play/embed/${t.rutube}?autoplay=1`,s="RuTube"):t.youtube&&!m()&&(i=`https://www.youtube.com/embed/${t.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`,s="YouTube");const o=document.createElement("iframe");if(o.id="videoPlayer",o.setAttribute("width","768"),o.setAttribute("height","405"),o.setAttribute("src",i),o.setAttribute("allow","clipboard-write; autoplay; fullscreen"),o.setAttribute("allowFullScreen","allowFullScreen"),e.appendChild(o),t.rutube&&t.youtube&&!m()){const r=document.createElement("div");r.classList.add("tabs","absolute","top-0","left-0","z-50");const a=document.createElement("button");a.classList.add("bg-white"),a.innerText=s,r.appendChild(a),a.addEventListener("click",y=>{const v=y.target;v&&console.log(v),o.setAttribute("src",`https://www.youtube.com/embed/${t.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`)}),e.appendChild(r)}const n=document.querySelector(".modal-close");n&&n.after(e)},p=t=>{document.body.classList.add("overflow-hidden");const e=document.createElement("div");e.classList.add("modal","flex","flex-col","items-center","fixed","inset-0","z-50","bg-slate-900/[.6]","overflow-y-auto");const i=new Date(t.date);e.innerHTML=`
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
                <div class="modal-close max-md:top-0 max-md:right-0 z-50" data-dismiss="modal" aria-label="Close"></div>
                <div class="p-8">             
                    <date class="block mb-4 text-xl text-blue-200" datetime="${t.date}">${i.toLocaleDateString("ru-RU",{year:"numeric",month:"long",day:"numeric"})}</date>   
                    <h3 class="mb-2 text-3xl">${t.title.rendered}</h3>
                    <p class="whitespace-pre-line text-xl">${t.acf.video_description}</p>
                    <div class="category pt-4"></div>
                </div>
            <div>
            `,document.body.appendChild(e),w(t.acf.video_id),d(`/wp-json/wp/v2/video_categories/${t.acf.video_categories}`).then(o=>{const n=document.createElement("div");n.innerHTML=`<a href="${o.link}" class="px-4 py-2 border border-blue-200 rounded-xl">#${o.name}</a>`;const r=e.querySelector(".category");r&&r.appendChild(n)}),e.querySelector('[data-dismiss="modal"]').addEventListener("click",()=>{document.body.classList.remove("overflow-hidden"),e.remove()}),e.addEventListener("click",o=>{o.target.closest(".modal-content")||(e.remove(),document.body.classList.remove("overflow-hidden"))})},f=t=>{if(window.history.pushState){let e=document.location.pathname;e=e+"?video_id="+t,window.history.pushState({url:e},document.title,e)}},h=document.querySelectorAll("[data-video]");h&&Array.from(h).forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const i=e.target;if(i instanceof HTMLElement){const s=i.dataset.video;s&&d(`/wp-json/wp/v2/video?meta_key=video_hash&meta_value=${s}`).then(o=>{f(o[0].acf.video_hash),p(o[0])})}})});const c=window.location.href;if(c.includes("?video_id=")&&c.split("?video_id=")[1]){const t=c.split("?video_id=")[1];d(`/wp-json/wp/v2/video?meta_key=video_hash&meta_value=${t}`).then(e=>{f(e[0].acf.video_hash),p(e[0])})}if(history.replaceState){let t=document.location.href.replace(document.location.origin,"");window.onpopstate=function(e){e.state&&(window.location.href=e.state.url)},history.replaceState({url:t},document.title,t)}});
