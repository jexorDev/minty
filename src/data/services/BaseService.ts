import axios from 'axios';
import qs from 'qs';

export default abstract class BaseService<T> {
    readonly urlPath: string;
    private urlParameters: string = "";

    constructor(urlPath: string) {
        this.urlPath = urlPath;
    }

    protected get url(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/${this.urlPath}`;
    }

    async getSingle(routeParameter?: string): Promise<T> {
        const fullUrl = this.url + (routeParameter == undefined ? "" : `/${routeParameter}`) + (this.urlParameters == "" ? "" : `?${this.urlParameters}`);
        const res = await axios.get(fullUrl, {
            params: qs.stringify("")
        });
        return (res.data as T);
    }

    async getMultiple(routeParameter?: string): Promise<T[]> {
        const fullUrl = this.url + (routeParameter == undefined ? "" : `/${routeParameter}`) + (this.urlParameters == "" ? "" : `?${this.urlParameters}`);
        const res = await axios.get(fullUrl, {
            params: qs.stringify("")
        });
        return (res.data as T[]);
    }

    async post(data: T): Promise<T> {
        const res = await axios.post(this.url, data);
        return res.data as T;
    }

    async postMultiple(data: T[]): Promise<T[]> {
        const res = await axios.post(this.url, data);
        return res.data as T[];
    }

    async postFile(file: FormData, trailingUrl: string): Promise<void> {
        console.log(file)
        const res = await axios.post(`${this.url}/${trailingUrl}` , file, { headers: {"Content-Type": "multipart/form-data"}});
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