import {FC} from "react";
import Heading from "@/app/components/Heading";
import AuctionForm from "@/app/auctions/AuctionForm";

const CreateAuction: FC = () => {
    return (
        <div className='mx-auto max-w-[75%] shadow-lg p-10 bg-white rounded-lg'>
            <Heading title={'Sell you Car!'} subtitle={'Please enter the details of your car'}/>
            <AuctionForm/>
        </div>
    )
}

export default CreateAuction