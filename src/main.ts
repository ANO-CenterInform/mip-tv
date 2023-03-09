import './style.css'
import { fetchJSON } from "./fetcher";

const videoLinks = document.querySelectorAll('[data-video]');

if(videoLinks) {
    Array.from(videoLinks).forEach((link) => {
        link.addEventListener('click', (evt) => {
            evt.preventDefault();
            const target = evt.target;
            if( target instanceof HTMLElement) {
                const video_id = target.dataset.video;
                if(video_id) {
                    fetchJSON(video_id)
                }
            }
        })
    });
}

const url = window.location.href;

if (url.includes('?video_id=')) {
    if(url.split('?video_id=')[1]) {
        const video_id = url.split('?video_id=')[1];
        fetchJSON(video_id);
    }
}

if (history.replaceState) {
    let startUrl = document.location.href.replace(document.location.origin, '');

    window.onpopstate = function(event) {
        if (!event.state) {
            return;
        }
        window.location.href = event.state.url;
    };

    history.replaceState({url: startUrl}, document.title, startUrl);
}
