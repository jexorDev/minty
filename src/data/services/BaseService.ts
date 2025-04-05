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

    getMultiple(filter: string): T[] {
        const fullUrl = this.url + (filter == "" ? "" : `?${filter}`);
        axios.get(fullUrl).then((res) => {
            return (res.data as T[]);
        });
        return [];
    }
}