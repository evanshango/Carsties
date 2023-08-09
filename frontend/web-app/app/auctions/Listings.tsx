'use client'

import {FC, useEffect, useState} from "react";
import AuctionCard from "@/app/auctions/AuctionCard";
import {Auction, PagedResult} from "@/types";
import AppPagination from "@/app/components/AppPagination";
import {fetchListings} from "@/app/actions/auctionActions";
import Filters from "@/app/auctions/Filters";
import {useParamsStore} from "@/hooks/useParamsStore";
import {shallow} from "zustand/shallow";
import qs from "query-string";
import EmptyFilter from "@/app/components/EmptyFilter";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import Loading from "@/app/components/Loading";

const Listings: FC = () => {
    const [loading, setLoading] = useState(true)
    const params = useParamsStore(state => ({
        pageNo: state.pageNo,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy,
        seller: state.seller,
        winner: state.winner
    }), shallow)

    const data = useAuctionStore(state => ({
        auctions: state.auctions,
        totalPages: state.totalPages,
        totalCount: state.totalCount
    }), shallow)

    const setData = useAuctionStore(state => state.setData)

    const setParams = useParamsStore(state => state.setParams)
    const url: string = qs.stringifyUrl({url: '', query: params})

    const setPageNo = (pageNo: number) => setParams({pageNo})

    useEffect(() => {
        fetchListings(url)
            .then((data: PagedResult<Auction>) => setData(data))
            .finally(() => setLoading(false))
    }, [setData, url])

    return (
        loading ? (
            <Loading label={'Please wait...'}/>
        ) : (
            <>
                <Filters/>
                {data.totalCount === 0 ? (
                    <EmptyFilter showReset/>
                ) : (
                    <>
                        <div className='grid grid-cols-4 gap-6'>
                            {data.auctions.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction}/>)}
                        </div>
                        <div className='flex justify-center mt-4'>
                            <AppPagination currentPage={params.pageNo} totalPages={data.totalPages}
                                           pageChanged={setPageNo}/>
                        </div>
                    </>
                )}
            </>
        )
    )
}

export default Listings