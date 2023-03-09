import {setLoading} from "./setLoader";
import {openModal} from "./openModal";

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

const updateURL = (new_video_id: string) => {
    if(window.history.pushState){
        let loc = document.location.pathname;
        loc = loc + "?video_id=" + new_video_id;
        window.history.pushState({url: loc}, document.title, loc);
    }
};

export const fetchJSON = (video_id: string) => {
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
