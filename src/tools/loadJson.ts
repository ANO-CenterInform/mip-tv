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

export function loadJson(url: string) {
    fetch(url)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new HttpError(response);
            }
        })
        .then(data => data)
}
