'use server'

import {Auction, PagedResult} from "@/types";
import {fetchWrapper} from "@/lib/fetchWrapper";
import {FieldValues} from "react-hook-form";
import {revalidatePath} from "next/cache";

export const fetchListings = async (
    query: string
): Promise<PagedResult<Auction>> => await fetchWrapper.GET(`search${query}`)

export const fetchAuctionDetails = async (
    id: string
): Promise<Auction> => await fetchWrapper.GET(`auctions/${id}`)

export const createAuction = async (
    data: FieldValues
): Promise<any> => await fetchWrapper.POST('auctions', data)

export const updateAuction = async (
    data: FieldValues, id: string
): Promise<any> => {
    const res = await fetchWrapper.PUT(`auctions/${id}`, data)
    revalidatePath(`/auctions/${id}`)
    return res
}

export const deleteAuction = async (
    id: string
): Promise<any> => await fetchWrapper.DELETE(`auctions/${id}`)