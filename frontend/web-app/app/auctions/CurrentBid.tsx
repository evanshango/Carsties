import {FC} from "react";

type Props = {
    amount?: number
    reservePrice: number
}

const CurrentBid: FC<Props> = ({amount, reservePrice}: Props) => {
    const text: string = amount ? '$' + amount : 'No bids'
    const color: string = amount ? amount > reservePrice ? 'bg-green-600' : 'bg-amber-600' : 'bg-red-600'

    return (
        <div className={`border-2 border-white text-white py-1 px-2 rounded-lg flex justify-center ${color}`}>
            {text}
        </div>
    )
}

export default CurrentBid