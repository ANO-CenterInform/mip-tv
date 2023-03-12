
import {checkYouTubeBlocked} from "./checkYouTubeBlocked";

type dataObject = {
    youtube: string|null,
    rutube: string|null,
}

export const generateEmbedPlayer = (data: dataObject) => {
    let url = '';

    console.log(data)
    if(data) {
        url = `https://rutube.ru/play/embed/${data.rutube}?autoplay=1`;
    } else if(data.youtube && !checkYouTubeBlocked) {
        url = `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`;
    }

        const renderTabs = () => {
            if(data.rutube && data.youtube && !checkYouTubeBlocked) {
                const ytButton = document.createElement('button');
                ytButton.classList.add('yt');
                ytButton.innerText = 'YouTube';
                ytButton.addEventListener('click', () => {
                    const videoPlayer = document.getElementById('videoPlayer') as HTMLElement;
                    if(videoPlayer instanceof HTMLElement) {
                        videoPlayer.setAttribute(
                            'src',
                            `https://www.youtube.com/embed/${data.youtube}?enablejsapi=1&autoplay=1&modestbranding=1&controls=2&showinfo=0&rel=0`);
                    }
                })

                const rtButton = document.createElement('button');
                rtButton.classList.add('rt');
                rtButton.innerText = 'RuTube';

                const videoWrapper = document.querySelector('.videoWrapper') as HTMLElement;

                if(videoWrapper instanceof HTMLElement) {
                    videoWrapper.append(ytButton);
                    videoWrapper.append(rtButton);
                }
            }

            return 'hello'
    }

    return `
            <div class="videoWrapper">
                ${renderTabs()}
                <iframe
                id="videoPlayer"
                width="768"
                height="405"
                src="${url}"
                allow="clipboard-write; autoplay; fullscreen"
                allowFullScreen>
                </iframe>
            </div>
            `;
};

