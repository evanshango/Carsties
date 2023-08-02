import {FC} from "react";
import CountDownTimer from "@/app/auctions/CountDownTimer";
import CarImage from "@/app/auctions/CarImage";
import {Auction} from "@/types";

type Props = {
    auction: Auction
}

const AuctionCard: FC<Props> = ({auction}: Props) => {
    return (
        <a href={'#'} className='group'>
            <div className="w-full bg-gray-200 aspect-w-16 aspect-h-10 rounded-lg overflow-hidden border-2">
                <div>
                    <CarImage imageUrl={auction.imageUrl} make={auction.make}/>
                    <div className='absolute bottom-2 left-2'>
                        <CountDownTimer auctionEnd={auction.auctionEnd}/>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center mt-4'>
                <h3 className="text-gray-700">
                    {auction.make} {auction.model}
                </h3>
                <p className="font-semibold text-sm">
                    {auction.year}
                </p>
            </div>
        </a>
    )
}

export default AuctionCard