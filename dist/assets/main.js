(function(l){typeof define=="function"&&define.amd?define(l):l()})(function(){"use strict";const l="",r=t=>{if(t){const e=document.createElement("div");e.classList.add("loader","fixed","inset-0","flex","justify-center","items-center","bg-slate-900/[.6]"),e.innerHTML=`
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
            `,document.body.appendChild(e)}else{const e=document.querySelector(".loader");e&&e.remove()}},s=(t,e)=>{let o=`https://rutube.ru/play/embed/${e}?autoplay=1`;return t==="youtube"&&(o=`https://www.youtube.com/embed/${e}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`),`
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
            `},c=t=>{document.body.classList.add("overflow-hidden");const e=document.createElement("div");e.classList.add("modal","flex","flex-col","items-center","fixed","inset-0","z-50","bg-slate-900/[.6]","overflow-y-auto"),e.innerHTML=`
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
            <div class="modal-close" data-dismiss="modal" aria-label="Close"></div>
                ${s(t[0].acf.video_type,t[0].acf.video_id)}
                <div class="p-8">                
                    <h3 class="mb-8 text-3xl">${t[0].title.rendered}</h3>
                    <p class="whitespace-pre-line">${t[0].acf.video_description}</p>
                </div>
            <div>
            `,document.body.appendChild(e),e.querySelector('[data-dismiss="modal"]').addEventListener("click",()=>{document.body.classList.remove("overflow-hidden"),e.remove()}),e.addEventListener("click",i=>{i.target.closest(".modal-content")||(e.remove(),document.body.classList.remove("overflow-hidden"))})};class u extends Error{constructor(e){super(`${e.status} for ${e.url}`),this.name="HttpError",this.response=e}}const f=t=>{if(window.history.pushState){let e=document.location.pathname;e=e+"?video_id="+t,window.history.pushState({url:e},document.title,e)}},n=t=>{r(!0),fetch(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${t}`).then(e=>{if(e.status===200)return r(!1),e.json();throw new u(e)}).then(e=>{f(e[0].acf.video_id),c(e)}).finally(()=>r(!1))},a=document.querySelectorAll("[data-video]");a&&Array.from(a).forEach(t=>{t.addEventListener("click",e=>{e.preventDefault();const o=e.target;if(o instanceof HTMLElement){const i=o.dataset.video;i&&n(i)}})});const d=window.location.href;if(d.includes("?video_id=")&&d.split("?video_id=")[1]){const t=d.split("?video_id=")[1];n(t)}if(history.replaceState){let t=document.location.href.replace(document.location.origin,"");window.onpopstate=function(e){e.state&&(window.location.href=e.state.url)},history.replaceState({url:t},document.title,t)}});
