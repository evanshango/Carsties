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

const Listings: FC = () => {
    const [data, setData] = useState<PagedResult<Auction>>()
    const params = useParamsStore(state => ({
        pageNo: state.pageNo,
        pageSize: state.pageSize,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        filterBy: state.filterBy
    }), shallow)

    const setParams = useParamsStore(state => state.setParams)
    const url: string = qs.stringifyUrl({url: '', query: params})

    const setPageNo = (pageNo: number) => setParams({pageNo})

    useEffect(() => {
        fetchListings(url).then((data: PagedResult<Auction>) => setData(data))
    }, [url])

    if (!data) return <h4>Loading...</h4>

    return (
        <>
            <Filters/>
            {data.totalCount === 0 ? (
                <EmptyFilter showReset/>
            ) : (
                <>
                    <div className='grid grid-cols-4 gap-6'>
                        {data.results.map((auction: Auction) => <AuctionCard key={auction.id} auction={auction}/>)}
                    </div>
                    <div className='flex justify-center mt-4'>
                        <AppPagination currentPage={params.pageNo} totalPages={data.totalPages} pageChanged={setPageNo}/>
                    </div>
                </>
            )}
        </>
    )
}

export default Listings