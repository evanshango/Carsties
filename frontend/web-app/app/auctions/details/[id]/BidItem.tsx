import {FC} from "react";
import {Bid} from "@/types";
import {format} from "date-fns";
import {numberWithCommas} from "@/app/lib/numberFormatter";

type Props = {
    bid: Bid
}

const BidItem: FC<Props> = ({bid}: Props) => {
    const getBidInfo = () => {
        let bgColor: string
        let text: string

        switch (bid.bidStatus) {
            case 'ACCEPTED':
                bgColor = 'bg-green-200'
                text = 'BID ACCEPTED'
                break
            case 'ACCEPTED_BELOW_RESERVE':
                bgColor = 'bg-amber-500'
                text = 'RESERVE NOT MET'
                break
            case 'TOO_LOW':
                bgColor = 'bg-red-200'
                text = 'BID WAS TOO LOW'
                break
            default:
                bgColor = 'bg-red-200'
                text = 'BID PLACED AFTER AUCTION FINISHED'
                break
        }
        return {bgColor, text}
    }

    return (
        <div className={`border-gray-300 border-2 px-3 py-2 rounded-lg flex justify-between items-center mb-2 
            ${getBidInfo().bgColor}`}>
            <div className="flex flex-col">
                <span>Bidder: {bid.bidder}</span>
                <span className="text-gray-700 text-sm">
                    Time: {format(new Date(bid.bidTime), 'dd MMM,  yyyy hh:mm a')}
                </span>
            </div>
            <div className="flex flex-col text-right">
                <div className="text-xl font-bold">${numberWithCommas(bid.amount)}</div>
                <div className="flex flex-row items-center">
                    <span className='text-xs font-semibold'>{getBidInfo().text}</span>
                </div>
            </div>
        </div>
    )
}

export default BidItem