
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

    if(data.rutube) {
        url = `https://rutube.ru/play/embed/${data.rutube}?autoplay=1`;
        label = 'YouTube';
    } else if(data.youtube && !isYouTubeBlocked()) {
        url = `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`;
        label = 'RuTube';
    }

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
        const switchButton = document.createElement('button');
        switchButton.classList.add('bg-white')
        switchButton.innerText = label;
        tabs.appendChild(switchButton);

        switchButton.addEventListener('click', (evt) => {
            const target = evt.target;

            if(label === "YouTube") {
                iframe.setAttribute('src', `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`);
                label = "RuTube";
            }

        })

        videoWrapper.appendChild(tabs);
    }

    const modalClose = document.querySelector('.modal-close') as HTMLElement;

    if(modalClose) {
        modalClose.after(videoWrapper);
    }
};

