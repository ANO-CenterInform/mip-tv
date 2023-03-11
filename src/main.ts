import './style.css'
import { fetchJSON } from "./tools/fetcher";
import { openModal } from "./tools/openModal";
import { updateURL } from "./tools/updateURL";

const videoLinks = document.querySelectorAll('[data-video]');
const yt_blocked = document.body.classList.contains('yt-blocked');

if(videoLinks) {
    Array.from(videoLinks).forEach((link) => {
        link.addEventListener('click', (evt) => {
            evt.preventDefault();
            const target = evt.target;
            if( target instanceof HTMLElement) {
                const video_id = target.dataset.video;
                if(video_id) {
                    fetchJSON(`/wp-json/wp/v2/video/${video_id}`).then(data => {
                        console.log(data)
                        let source = 'youtube';
                        if(!yt_blocked && data[0].acf.video_id.rutube !== 'null') {
                            source = 'rutube';
                        } else if (!yt_blocked && data[0].acf.video_id.youtube !== 'null') {
                            source = 'youtube';
                        }
                        updateURL(data.acf.video_id[source]);
                        openModal(data)
                    })
                }
            }
        })
    });
}

const url = window.location.href;

if (url.includes('?video_id=')) {
    if(url.split('?video_id=')[1]) {
        const video_id = url.split('?video_id=')[1];
        fetchJSON(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${video_id}`).then(data => {
            let source = 'youtube';
            if(!yt_blocked || data[0].acf.video_id.rutube !== 'null') {
                source = 'rutube';
            }
            updateURL(data[0].acf.video_id[source]);
            openModal(data[0])
        });
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
