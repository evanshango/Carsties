'use client'

import {FC, ReactNode, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {useAuctionStore} from "@/hooks/useAuctionStore";
import {useBidStore} from "@/hooks/useBidStore";
import {Auction, AuctionFinished, Bid} from "@/types";
import {User} from "next-auth";
import toast from "react-hot-toast";
import AuctionCreatedToast from "@/app/components/AuctionCreatedToast";
import {fetchAuctionDetails} from "@/app/actions/auctionActions";
import Loading from "@/app/components/Loading";
import AuctionFinishedToast from "@/app/components/AuctionFinishedToast";

type Props = {
    children: ReactNode,
    user: User | null
}

const SignalRProvider: FC<Props> = ({children, user}: Props) => {
    const [
        connection,
        setConnection
    ] = useState<HubConnection | null>(null)
    const setCurrentPrice = useAuctionStore(state => state.setCurrentPrice)
    const addBid = useBidStore(state => state.addBid)

    useEffect(() => {
        const newConn: HubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:6001/notifications')
            .withAutomaticReconnect()
            .build()
        setConnection(newConn)
    }, [])

    useEffect(() => {
        if (connection) {
            connection.start().then((): void => {
                console.log('Connected to notification hub')
                connection.on('BidPlaced', (bid: Bid) => {
                    if (bid.bidStatus.includes('ACCEPTED')) setCurrentPrice(bid.auctionId, bid.amount)
                    addBid(bid)
                })

                connection.on('AuctionCreated', (auction: Auction) => {
                    if (user?.username !== auction.seller) {
                        return toast(<AuctionCreatedToast auction={auction}/>, {duration: 10000})
                    }
                })

                connection.on('AuctionFinished', (finished: AuctionFinished) => {
                    const auction = fetchAuctionDetails(finished.auctionId)
                    return toast.promise(auction, {
                        loading: <Loading label='Loading'/>,
                        success: (a: Auction) => <AuctionFinishedToast finishedAuction={finished} auction={a}/>,
                        error: () => 'Auction finished?'
                    }, {success: {duration: 10000, icon: null}})
                })
            }).catch(err => console.log(err))
        }
        return (): void => {
            connection?.stop()
        }
    }, [connection, setCurrentPrice, addBid, user?.username])
    return (
        children
    )
}

export default SignalRProvider