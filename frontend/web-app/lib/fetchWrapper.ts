import {fetch, Response} from "next/dist/compiled/@edge-runtime/primitives";
import {fetchToken} from "@/app/actions/authActions";
import {JWT} from "next-auth/jwt";

const baseUrl: string = 'http://localhost:6001/'

const GET = async (url: string): Promise<any> => {
    const requestOptions = {
        method: 'GET',
        headers: await fetchHeaders()
    }

    const response: Response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

const POST = async (url: string, body: any): Promise<any> => {
    const requestOptions = {
        method: 'POST',
        headers: await fetchHeaders(),
        body: JSON.stringify(body)
    }

    const response: Response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

const PUT = async (url: string, body: any): Promise<any> => {
    const requestOptions = {
        method: 'PUT',
        headers: await fetchHeaders(),
        body: JSON.stringify(body)
    }

    const response: Response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

const DELETE = async (url: string): Promise<any> => {
    const requestOptions = {
        method: 'DELETE',
        headers: await fetchHeaders(),
    }

    const response: Response = await fetch(baseUrl + url, requestOptions)
    return await handleResponse(response)
}

const fetchHeaders = async (): Promise<any> => {
    const token: JWT | null = await fetchToken()
    const headers = {'Content-type': 'application/json'} as any
    if (token) headers.Authorization = `Bearer ${token?.access_token}`
    return headers
}

const handleResponse = async (response: Response): Promise<any> => {
    const text: string = await response.text()
    let data
    try {
        data = JSON.parse(text)
    } catch (err) {
        data = text
    }

    if (response.ok) {
        return data || response.statusText
    } else {
        const error = {
            status: response.status,
            message: typeof data === 'string' ? data : response.statusText
        }
        return {error}
    }
}

export const fetchWrapper = {
    GET, POST, PUT, DELETE
}