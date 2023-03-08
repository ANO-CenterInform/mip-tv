import './style.css'

interface HttpError extends Error {
    status?: number;
    response?: string;
}

class HttpError extends Error {
    constructor(response: any) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

const openModal = (data: Array<any>) => {

    document.body.classList.add('overflow-hidden');
    const modalWrapper = document.createElement('div');
    modalWrapper.classList.add('modal', 'flex', 'flex-col', 'items-center', 'fixed', 'inset-0', 'z-50', 'bg-slate-900/[.6]', 'overflow-y-auto');
    modalWrapper.innerHTML = `
            <div class="modal-content relative flex flex-col w-full max-w-screen-md rounded-xl bg-white-100 my-6">
            <div class="modal-close" data-dismiss="modal" aria-label="Close"></div>
                ${generateEmbedPlayer(data[0].acf.video_type, data[0].acf.video_id)}
                <div class="p-8">                
                    <h3 class="mb-8 text-3xl">${data[0].title.rendered}</h3>
                    <p class="whitespace-pre-line">${data[0].acf.video_description}</p>
                </div>
            <div>
            `;

    document.body.appendChild(modalWrapper);

    const closeButton = modalWrapper.querySelector('[data-dismiss="modal"]') as HTMLElement;

    closeButton.addEventListener('click', () => {
        document.body.classList.remove('overflow-hidden');
        modalWrapper.remove();
    });

    modalWrapper.addEventListener('click', ev => {
        const target = ev.target as HTMLElement;
        if(!target.closest('.modal-content')) {
            modalWrapper.remove();
            document.body.classList.remove('overflow-hidden');
        }
    });
}

const generateEmbedPlayer = (type: string, id: string) => {
    let url = `https://rutube.ru/play/embed/${id}?autoplay=1`;
    if (type === 'youtube') {
        url = `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`;
    }
    return `
            <div class="videoWrapper">
                <iframe
                width="768"
                height="405"
                src="${url}"
                frameBorder="0"
                allow="clipboard-write; autoplay; fullscreen"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen>
                </iframe>
            </div>
            `;
};

const fetchJSON = (video_id: string) => {
    setLoading(true)
    fetch(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${video_id}`)
        .then(response => {
            if (response.status === 200) {
                setLoading(false);
                return response.json();
            } else {
                throw new HttpError(response);
            }
        })
        .then(data => {
            updateURL(data[0].acf.video_id);
            openModal(data)
        })
        .finally(() => setLoading(false))
}

const videoLinks = document.querySelectorAll('[data-video]');

if(videoLinks) {
    Array.from(videoLinks).forEach((link) => {
        link.addEventListener('click', (evt) => {
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

const setLoading = (status: boolean): void => {
    if(status) {
        const loader = document.createElement('div');
        loader.classList.add('loader', 'fixed', 'inset-0', 'flex', 'justify-center', 'items-center', 'bg-slate-900/[.6]');
        loader.innerHTML = `
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
            `;
        document.body.appendChild(loader);
    } else {
        const loader = document.querySelector('.loader');
        if(loader) {
            loader.remove();
        }
    }
}

const updateURL = (new_video_id: string) => {
    if(window.history.pushState){
        let loc = document.location.pathname;
        loc = loc + "?video_id=" + new_video_id;
        window.history.pushState({url: loc}, document.title, loc);
    }
};

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
