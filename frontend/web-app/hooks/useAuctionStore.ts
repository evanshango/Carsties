import {Auction, PagedResult} from "@/types";
import {create} from "zustand";

type State = {
    auctions: Auction[]
    totalPages: number
    totalCount: number
}

type Actions = {
    setData: (data: PagedResult<Auction>) => void
    setCurrentPrice: (auctionId: string, amount: number) => void
}

const initialState: State = {
    auctions: [],
    totalPages: 0,
    totalCount: 0
}

export const useAuctionStore = create<State & Actions>(
    (set) => ({
        ...initialState,
        setData: (data: PagedResult<Auction>) => {
            set(() => ({
                auctions: data.results,
                totalPages: data.totalPages,
                totalCount: data.totalCount
            }))
        },
        setCurrentPrice: (auctionId: string, amount: number) => {
            set((state) => ({
                auctions: state.auctions.map((a: Auction) => a.id === auctionId ? {...a, currentHighBid: amount} : a)
            }))
        }
    })
)
