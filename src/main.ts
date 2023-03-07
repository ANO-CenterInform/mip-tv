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

const url = window.location.href;

if (url.includes('?video_id=')) {
    if(url.split('?video_id=')[1]) {
        const video_id = url.split('?video_id=')[1];
        fetch(`/wp-json/wp/v2/video?meta_key=video_id&meta_value=${video_id}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new HttpError(response);
                }
            })
            .then(data => openModal(data))

        const openModal = (data: any) => {
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
                }
            })



        }

        const generateEmbedPlayer = (type: string, id: string) => {
            console.log(type)
            let url = `https://rutube.ru/play/embed/${id}?autoplay=1`;
            if (type === 'youtube') {
                url = `https://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&mute=1&modestbranding=1&controls=2&showinfo=0&rel=0`;
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
        }

    }
}
