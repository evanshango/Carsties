'use server'

import {Auction, PagedResult} from "@/types";
import {fetchToken} from "@/app/actions/authActions";

export const fetchListings = async (query: string): Promise<PagedResult<Auction>> => {
    const res: Response = await fetch(`http://localhost:6001/search${query}`, {next: {revalidate: 1800}})

    if (!res.ok) throw new Error("Failed to fetch Listings")

    return res.json()
}

export const updateAuction = async () => {
    const data = {
        mileage: Math.floor(Math.random() * 100000) + 1
    }

    const token = await fetchToken()

    const res: Response = await fetch('http://localhost:6001/auctions/afbee524-5972-4075-8800-7d1f9d7b0a0c', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token?.access_token}`
        },
        body: JSON.stringify(data)
    })

    if (!res.ok) return {status: res.status, message: res.statusText}

    return res.statusText
}