'use client'

import {FC} from "react";
import {FieldValues, useForm} from "react-hook-form";
import {useBidStore} from "@/hooks/useBidStore";
import {placeAuctionBid} from "@/app/actions/auctionActions";
import toast from "react-hot-toast";
import {numberWithCommas} from "@/app/lib/numberFormatter";

type Props = {
    auctionId: string
    highBid: number
}

const BidForm: FC<Props> = ({auctionId, highBid}: Props) => {
    const {
        register,
        handleSubmit,
        reset
    } = useForm()
    const addBid = useBidStore(state => state.addBid)

    const onSubmit = (data: FieldValues) => {
        if (data.amount <= highBid) {
            reset()
            return toast.error('Bid must be at least $' + numberWithCommas(highBid + 1))
        }

        placeAuctionBid(auctionId, +data.amount).then(res => {
            if (res.error) throw res.error
            addBid(res)
            reset()
        }).catch(err => toast.error(err.message))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex items-center border-2 rounded-lg py-2'>
            <input
                type='number'
                {...register('amount')}
                className='input-custom text-sm text-gray-600'
                placeholder={`Enter your bid (minimum bid is $${numberWithCommas(highBid + 1)}`}
            />
        </form>
    )
}

export default BidForm