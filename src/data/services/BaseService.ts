import axios from 'axios';

export default abstract class BaseService<T> {
    readonly urlPath: string;

    constructor(urlPath: string) {
        this.urlPath = urlPath;
    }

    private get url(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/${this.urlPath}`;
    }

    getSingle(filter: string): T {
        const fullUrl = this.url + (filter == "" ? "" : `?${filter}`);
        axios.get(this.url).then((res) => {
            return (res.data as T);
        });
        return {} as T;
    }

    async getMultiple(filter: string): Promise<T[]> {
        const fullUrl = this.url + (filter == "" ? "" : `?${filter}`);
        const res = await axios.get(fullUrl);
        return (res.data as T[]);
    }

    async post(data: T): Promise<T> {
        const res = await axios.post(this.url, data);
        return res.data as T;
    }
}