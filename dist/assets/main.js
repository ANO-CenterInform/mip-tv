(function(n){typeof define=="function"&&define.amd?define(n):n()})(function(){"use strict";const n="",a=t=>{if(t){const e=document.createElement("div");e.classList.add("loader","fixed","inset-0","flex","justify-center","items-center","bg-slate-900/[.6]"),e.innerHTML=`
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
            `,document.body.appendChild(e)}else{const e=document.querySelector(".loader");e&&e.remove()}};class m extends Error{constructor(e){super(`${e.status} for ${e.url}`),this.name="HttpError",this.response=e}}const r=async t=>{a(!0);const e=await fetch(t);if(e.status==200){const o=await e.json();return a(!1),o}else throw new m(e)},f=(t,e)=>{let o=`https://rutube.ru/play/embed/${e}?autoplay=1`;return t==="youtube"&&(o=`https://www.youtube.com/embed/${e}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`),`
            <div class="videoWrapper">
                <iframe
                width="768"
                height="405"
                src="${o}"
                frameBorder="0"
                allow="clipboard-write; autoplay; fullscreen"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen>
                </iframe>
            </div>
            `},p=t=>{document.body.classList.add("overflow-hidden");const e=document.createElement("div");e.classList.add("modal","flex","flex-col","items-center","fixed","inset-0","z-50","bg-slate-900/[.6]","overflow-y-auto");const o=new Date(t.date);e.innerHTML=`
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
                <div class="modal-close max-md:top-0 max-md:right-0 z-50" data-dismiss="modal" aria-label="Close"></div>
                ${f(t.acf.video_type,t.acf.video_id)}
                <div class="p-8">             
                    <date class="block mb-4 text-xl text-blue-200" datetime="${t.date}">${o.toLocaleDateString("ru-RU",{year:"numeric",month:"long",day:"numeric"})}</date>   
                    <h3 class="mb-2 text-3xl">${t.title.rendered}</h3>
                    <p class="whitespace-pre-line text-xl">${t.acf.video_description}</p>
                    <div class="category pt-4"></div>
                </div>
            <div>
            `,document.body.appendChild(e),r(`/wp-json/wp/v2/video_categories/${t.acf.video_categories}`).then(i=>{const s=document.createElement("div");s.innerHTML=`<a href="${i.link}" class="px-4 py-2 border border-blue-200 rounded-xl">#${i.name}</a>`;const u=e.querySelector(".category");u&&u.appendChild(s)}),e.querySelector('[data-dismiss="modal"]').addEventListener("click",()=>{document.body.classList.remove("overflow-hidden"),e.remove()}),e.addEventListener("click",i=>{i.target.closest(".modal-content")||(e.remove(),document.body.classList.remove("overflow-hidden"))})},v=t=>{if(window.history.pushState){let e=document.location.pathname;e=e+"?video_id="+t,window.history.pushState({url:e},document.title,e)}},c=document.querySelectorAll("[data-video]"),w=document.body.classList.contains("yt-blocked");c&&Array.from(c).forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const o=e.target;if(o instanceof HTMLElement){const l=o.dataset.video;l&&r(`/wp-json/wp/v2/video/${l}`).then(i=>{console.log(i.acf.video_id.rutube)})}})});const d=window.location.href;if(d.includes("?video_id=")&&d.split("?video_id=")[1]){const t=d.split("?video_id=")[1];r(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${t}`).then(e=>{let o="youtube";(!w||e[0].acf.video_id.rutube!=="null")&&(o="rutube"),v(e[0].acf.video_id[o]),p(e[0])})}if(history.replaceState){let t=document.location.href.replace(document.location.origin,"");window.onpopstate=function(e){e.state&&(window.location.href=e.state.url)},history.replaceState({url:t},document.title,t)}});
