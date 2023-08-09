'use client'

import {FC, useEffect, useState} from "react";
import {User} from "next-auth";
import {Auction, Bid} from "@/types";
import {useBidStore} from "@/hooks/useBidStore";
import {fetchAuctionBids} from "@/app/actions/auctionActions";
import toast from "react-hot-toast";
import Loading from "@/app/components/Loading";
import Heading from "@/app/components/Heading";
import BidItem from "@/app/auctions/details/[id]/BidItem";
import {numberWithCommas} from "@/app/lib/numberFormatter";
import EmptyFilter from "@/app/components/EmptyFilter";
import BidForm from "@/app/auctions/details/[id]/BidForm";

type Props = {
    user: User | null
    auction: Auction
}

const BidList: FC<Props> = ({user, auction}: Props) => {
    const [loading, setLoading] = useState(true)
    const bids: Bid[] = useBidStore(state => state.bids)
    const setBids = useBidStore(state => state.setBids)
    const open = useBidStore(state => state.open)
    const setOpen = useBidStore(state => state.setOpen)
    const openForBids = new Date(auction.auctionEnd) > new Date()

    const highBid: number = bids.reduce((prev: number, curr: Bid): number => prev > curr.amount
        ? prev : curr.bidStatus.includes('ACCEPTED') ? curr.amount : prev, 0
    )

    useEffect(() => {
        fetchAuctionBids(auction.id).then((res: any) => {
            if (res.error) throw res.error
            setBids(res as Bid[])
        }).catch(err => toast.error(err.message)).finally(() => setLoading(false))
    }, [auction.id, setLoading, setBids])

    useEffect(() => setOpen(openForBids), [openForBids, setOpen])

    return (
        loading ? (
            <Loading label={'Loading bids...'}/>
        ) : (
            <div className="rounded-lg shadow-md">
                <div className="py-2 px-4 bg-white">
                    <div className='sticky top-0 bg-white p-2'>
                        <Heading title={`Current high bid is $${numberWithCommas(highBid)}`}/>
                    </div>
                    <div className='overflow-auto h-[400px] flex flex-col-reverse px-2'>
                        {bids.length === 0 ? (
                            <EmptyFilter title='No bids for this item' subtitle='Please feel free to make a bid'/>
                        ) : (
                            <>
                                {bids.map((bid: Bid) => <BidItem key={bid.id} bid={bid}/>)}
                            </>
                        )}
                    </div>
                    <div className="px-2 pb-2 text-gray-500 mt-2">
                        {!open ? (
                            <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                                This auction has finished
                            </div>
                        ) : !user ? (
                            <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                                Please login to make a bid
                            </div>
                        ) : user && user.username === auction.seller ? (
                            <div className='flex items-center justify-center p-2 text-lg font-semibold'>
                                You cannot bid on your own auction
                            </div>
                        ) : (
                            <BidForm auctionId={auction.id} highBid={highBid}/>
                        )}
                    </div>
                </div>
            </div>
        )
    )
}

export default BidList