import {fetchAuctionDetails} from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import {Auction} from "@/types";
import CountDownTimer from "@/app/auctions/CountDownTimer";
import CarImage from "@/app/auctions/CarImage";
import DetailedSpecs from "@/app/auctions/details/[id]/DetailedSpecs";
import {fetchCurrentUser} from "@/app/actions/authActions";
import EditButton from "@/app/auctions/details/[id]/EditButton";
import DeleteButton from "@/app/auctions/details/[id]/DeleteButton";

const AuctionDetails = async ({params}: { params: { id: string } }) => {
    const data: Auction = await fetchAuctionDetails(params.id)
    const user = await fetchCurrentUser()
    return (
        <div>
            <div className="flex justify-between">
               <div className='flex items-center gap-3'>
                   <Heading title={`${data.make} ${data.model}`}/>
                   {user?.username === data.seller && (
                       <>
                           <EditButton id={data.id}/>
                           <DeleteButton id={data.id}/>
                       </>
                   )}
               </div>
                <div className='flex gap 3'>
                    <h3 className="text-2xl font-semibold">Time Remaining:</h3>
                    <CountDownTimer auctionEnd={data.auctionEnd}/>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-3">
                <div className="w-full bg-gray-200 aspect-h-10 aspect-w-16 rounded-lg overflow-hidden">
                    <CarImage imageUrl={data.imageUrl} make={data.model}/>
                </div>
                <div className="border-2 rounded-lg p-2 bg-gray-100">
                    <Heading title='Bids'/>
                </div>
            </div>
            <div className="mt-3 grid grid-cols-1 rounded-lg">
                <DetailedSpecs auction={data}/>
            </div>
        </div>
    )
}

export default AuctionDetails