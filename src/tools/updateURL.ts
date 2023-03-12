import {checkYouTubeBlocked} from "./checkYouTubeBlocked";

type videoObject = {
    youtube: string | null,
    rutube: string | null

}

export const updateURL = (new_video_id: videoObject) => {
    console.log(new_video_id)
    if(window.history.pushState){
        let loc = document.location.pathname;

        let source = new_video_id.rutube;
        if(!checkYouTubeBlocked && new_video_id.youtube !== null) {
            source = new_video_id.youtube;
        }

        loc = loc + "?video_id=" + source;
        window.history.pushState({url: loc}, document.title, loc);
    }
};
