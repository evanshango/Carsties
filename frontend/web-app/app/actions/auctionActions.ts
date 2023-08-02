'use server'

import {Auction, PagedResult} from "@/types";

export const fetchListings = async (query: string): Promise<PagedResult<Auction>> => {
    const res: Response = await fetch(`http://localhost:6001/search${query}`)

    if (!res.ok) throw new Error("Failed to fetch Listings")

    return res.json()
}