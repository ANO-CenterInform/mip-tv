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
            `,document.body.appendChild(e)}else{const e=document.querySelector(".loader");e&&e.remove()}};class v extends Error{constructor(e){super(`${e.status} for ${e.url}`),this.name="HttpError",this.response=e}}const d=async t=>{u(!0);const e=await fetch(t);if(e.status==200){const n=await e.json();return u(!1),n}else throw new v(e)},a=()=>document.body.classList.contains("yt-blocked"),y=t=>{let e="";return t.rutube?e=`https://rutube.ru/play/embed/${t.rutube}?autoplay=1`:t.youtube&&!a&&(e=`https://www.youtube.com/embed/${t.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`),`
            <div class="videoWrapper">
                ${(()=>{if(t.rutube&&t.youtube&&!a){const r=document.createElement("button");r.classList.add("yt"),r.innerText="YouTube",r.addEventListener("click",()=>{const s=document.getElementById("videoPlayer");s instanceof HTMLElement&&s.setAttribute("src",`https://www.youtube.com/embed/${t.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`)});const o=document.createElement("button");o.classList.add("rt"),o.innerText="RuTube";const i=document.querySelector(".videoWrapper");i instanceof HTMLElement&&(i.append(r),i.append(o))}return"hello"})()}
                <iframe
                id="videoPlayer"
                width="768"
                height="405"
                src="${e}"
                frameBorder="0"
                allow="clipboard-write; autoplay; fullscreen"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen>
                </iframe>
            </div>
            `},m=t=>{document.body.classList.add("overflow-hidden");const e=document.createElement("div");e.classList.add("modal","flex","flex-col","items-center","fixed","inset-0","z-50","bg-slate-900/[.6]","overflow-y-auto");const n=new Date(t.date);e.innerHTML=`
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
                <div class="modal-close max-md:top-0 max-md:right-0 z-50" data-dismiss="modal" aria-label="Close"></div>
                ${y(t.acf.video_id)}
                <div class="p-8">             
                    <date class="block mb-4 text-xl text-blue-200" datetime="${t.date}">${n.toLocaleDateString("ru-RU",{year:"numeric",month:"long",day:"numeric"})}</date>   
                    <h3 class="mb-2 text-3xl">${t.title.rendered}</h3>
                    <p class="whitespace-pre-line text-xl">${t.acf.video_description}</p>
                    <div class="category pt-4"></div>
                </div>
            <div>
            `,document.body.appendChild(e),d(`/wp-json/wp/v2/video_categories/${t.acf.video_categories}`).then(o=>{const i=document.createElement("div");i.innerHTML=`<a href="${o.link}" class="px-4 py-2 border border-blue-200 rounded-xl">#${o.name}</a>`;const s=e.querySelector(".category");s&&s.appendChild(i)}),e.querySelector('[data-dismiss="modal"]').addEventListener("click",()=>{document.body.classList.remove("overflow-hidden"),e.remove()}),e.addEventListener("click",o=>{o.target.closest(".modal-content")||(e.remove(),document.body.classList.remove("overflow-hidden"))})},f=t=>{if(console.log(t),window.history.pushState){let e=document.location.pathname,n=t.rutube;!a&&t.youtube!==null&&(n=t.youtube),e=e+"?video_id="+n,window.history.pushState({url:e},document.title,e)}},p=document.querySelectorAll("[data-video]");p&&Array.from(p).forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const n=e.target;if(n instanceof HTMLElement){const r=n.dataset.video;r&&d(`/wp-json/wp/v2/video/${r}`).then(o=>{f(o.acf.video_id),m(o)})}})});const c=window.location.href;if(c.includes("?video_id=")&&c.split("?video_id=")[1]){const t=c.split("?video_id=")[1];d(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${t}`).then(e=>{f(e[0].acf.video_id),m(e[0])})}if(history.replaceState){let t=document.location.href.replace(document.location.origin,"");window.onpopstate=function(e){e.state&&(window.location.href=e.state.url)},history.replaceState({url:t},document.title,t)}});
