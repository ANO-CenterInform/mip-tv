import {setLoading} from "./setLoader";

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

export const fetchJSON = async (url: string) => {
    setLoading(true)
    const response = await fetch(url)

    if (response.status == 200) {
        const json = await response.json();
        setLoading(false);
        return json;
    } else {
        throw new HttpError(response);
    }
}
