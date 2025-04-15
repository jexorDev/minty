import axios from 'axios';
import qs from 'qs';

export default abstract class BaseService<T> {
    readonly urlPath: string;
    private urlParameters: string = "";

    constructor(urlPath: string) {
        this.urlPath = urlPath;
    }

    private get url(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/${this.urlPath}`;
    }

    async getSingle(): Promise<T> {
        const results = await this.getMultiple();
        if (results.length > 0) {
            return results[0];
        } else {
            return {} as T;
        }
    }

    async getMultiple(): Promise<T[]> {
        const fullUrl = this.url + (this.urlParameters == "" ? "" : `?${this.urlParameters}`);
        const res = await axios.get(fullUrl, {
            params: qs.stringify("")
        });
        return (res.data as T[]);
    }

    async post(data: T): Promise<T> {
        const res = await axios.post(this.url, data);
        return res.data as T;
    }

    async put(data: T): Promise<T> {
        const res = await axios.put(this.url, data);
        return res.data as T;
    }

    withUrlParameters(parameters: any): this {
        this.urlParameters = qs.stringify(parameters);
        return this;
    }
}