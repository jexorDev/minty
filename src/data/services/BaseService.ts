import router from '@/router';
import { useErrorStore } from '@/stores/ErrorStore';
import axios from 'axios';
import qs from 'qs';

export default abstract class BaseService<T> {
    readonly urlPath: string;
    private routeParameter: string = "";
    private urlParameters: string = "";
    private headers: {headerName: string, headerValue: any}[] = [];
    private axiosInstance = axios.create();

    private errorStore = useErrorStore();

    constructor(urlPath: string) {
        this.urlPath = urlPath;
        const authToken = localStorage.getItem('authToken');
        const myHeaders = this.headers;
        if (authToken) {
            myHeaders.push({headerName: "Authorization", headerValue: `Bearer ${authToken}`})
        }
        this.axiosInstance.interceptors.request.use(function (config) {    
            for (var i = 0; i < myHeaders.length; i++) {
                const currHeader = myHeaders[i];
                config.headers[currHeader.headerName] = currHeader.headerValue;
            }
            return config;
        });
        this.axiosInstance.interceptors.response.use(response => response, 
            (error) => {
            if (error.response.status === 401) {
                router.push("/login");
            } else {
                this.errorStore.setError(JSON.stringify(error.response.data));
            }
            return Promise.reject(error);
        })
    }

    protected get url(): string {
        return `${import.meta.env.VITE_API_BASE_URL}/${this.urlPath}` + (this.routeParameter === "" ? "" : `/${this.routeParameter}`) + (this.urlParameters == "" ? "" : `?${this.urlParameters}`);
    }

    async getSingle(): Promise<T> {        
        const res = await this.axiosInstance.get(this.url, {
            params: qs.stringify(this.urlParameters),
        });        
        return (res.data as T);
    }

    async getMultiple(): Promise<T[]> {
        const res = await this.axiosInstance.get(this.url, {
            params: qs.stringify(this.urlParameters)
        });
        return (res.data as T[]);
    }

    async getFile(): Promise<T> {        
        const res = await this.axiosInstance.get(this.url, {
            params: qs.stringify(this.urlParameters),
            responseType: 'blob'
        });        
        return (res.data as T);
    }

    async post(data: T): Promise<T> {
        const res = await this.axiosInstance.post(this.url, data);
        return res.data as T;
    }

    async postMultiple(data: T[]): Promise<void> {
        await this.axiosInstance.post(this.url, data);        
    }

    async put(data: T): Promise<T> {
        const res = await this.axiosInstance.put(this.url, data);
        return res.data as T;
    }

    async delete(): Promise<void> {
        await this.axiosInstance.delete(this.url);
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
        this.headers = [...this.headers, ...headers];
        return this;
    }    
}