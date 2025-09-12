import axios from 'axios';
import qs from 'qs';

export default abstract class BaseService<T> {
    readonly urlPath: string;
    private routeParameter: string = "";
    private urlParameters: string = "";
    private headers: {headerName: string, headerValue: any}[] = [];

    constructor(urlPath: string) {
        this.urlPath = urlPath;
    }

    protected get url(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/${this.urlPath}` + (this.routeParameter === "" ? "" : `/${this.routeParameter}`) + (this.urlParameters == "" ? "" : `?${this.urlParameters}`);
    }

    async getSingle(): Promise<T> {        
        const res = await axios.get(this.url, {
            params: qs.stringify(this.urlParameters)
        });
        return (res.data as T);
    }

    async getMultiple(): Promise<T[]> {
        const res = await axios.get(this.url, {
            params: qs.stringify(this.urlParameters)
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

    async put(data: T): Promise<T> {
        const res = await axios.put(this.url, data);
        return res.data as T;
    }

    withRouteParameter(parameter: string): this {
        this.routeParameter = parameter;
        return this;
    }

    withUrlParameters(parameters: any): this {
        this.urlParameters = qs.stringify(parameters);
        return this;
    }

    withHeaders(headers: {headerName: string, headerValue: any}[]): this {
        this.headers = headers;
        return this;
    }
}