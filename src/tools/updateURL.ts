
export const updateURL = (new_video_id: string) => {
    if(window.history.pushState){
        let loc = document.location.pathname;
        loc = loc + "?video_id=" + new_video_id;
        window.history.pushState({url: loc}, document.title, loc);
    }
};
