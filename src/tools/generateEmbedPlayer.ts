
import {isYouTubeBlocked} from "./isYouTubeBlocked";

type dataObject = {
    youtube: string|null,
    rutube: string|null,
}

export const generateEmbedPlayer = (data: dataObject) => {

    const videoWrapper = document.createElement('div');
    videoWrapper.classList.add('videoWrapper');

    let url = '';
    let label = ''

    if (data.rutube) {
        url = `https://rutube.ru/play/embed/${data.rutube}?autoplay=1`;
        label = 'YouTube';
    } else if (data.youtube && !isYouTubeBlocked()) {
        url = `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`;
        label = 'RuTube';
    }

    if (url) {
        const iframe = document.createElement('iframe');
        iframe.id = 'videoPlayer';
        iframe.setAttribute('width', '768');
        iframe.setAttribute('height', '405');
        iframe.setAttribute('src', url);
        iframe.setAttribute('allow', "clipboard-write; autoplay; fullscreen");
        iframe.setAttribute('allowFullScreen', 'allowFullScreen');

        videoWrapper.appendChild(iframe);

        if (data.rutube && data.youtube && !isYouTubeBlocked()) {
            const tabs = document.createElement('div');
            tabs.classList.add('tabs', 'absolute', 'top-0', 'left-0', 'z-50');
            const switchButton = document.createElement('div');
            switchButton.classList.add('cursor-pointer', 'ml-4', 'mt-4', 'rounded-md', 'outline-none', 'outline-0', 'bg-gray-600', 'px-3', 'text-sm', 'font-semibold', 'text-white', 'hover:bg-indigo-500')
            switchButton.innerText = label;
            tabs.appendChild(switchButton);

            switchButton.addEventListener('click', () => {

                if(label === "YouTube") {
                    iframe.setAttribute('src', `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`);
                    label = "RuTube";
                } else {
                    iframe.setAttribute('src', `https://rutube.ru/play/embed/${data.rutube}?autoplay=1`);
                    label = "YouTube";
                }

                switchButton.innerText = label;
            })

            videoWrapper.appendChild(tabs);
        }
    } else {
        const error = document.createElement('div');
        error.classList.add('flex', 'absolute', 'w-full', 'h-full', 'justify-center', 'items-center', 'text-white', 'bg-gray-600')
        error.innerHTML = '<h4 class="text-xl">К сожалению, видео не найдено</h4>';
        videoWrapper.appendChild(error);
    }

    const modalClose = document.querySelector('.modal-close') as HTMLElement;

    if(modalClose) {
        modalClose.after(videoWrapper);
    }
};

