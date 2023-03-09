export const generateEmbedPlayer = (type: string, id: string) => {
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

