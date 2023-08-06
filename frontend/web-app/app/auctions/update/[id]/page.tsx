import Heading from "@/app/components/Heading";
import AuctionForm from "@/app/auctions/AuctionForm";
import {fetchAuctionDetails} from "@/app/actions/auctionActions";
import {Auction} from "@/types";

const UpdateAuction = async ({params}: { params: { id: string } }) => {
    const data: Auction = await fetchAuctionDetails(params.id)
    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <Heading title='Update your Auction' subtitle='Please update the details of your car'/>
            <AuctionForm auction={data}/>
        </div>
    )
}

export default UpdateAuction