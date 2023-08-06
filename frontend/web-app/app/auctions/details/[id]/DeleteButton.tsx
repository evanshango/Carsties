'use client'

import {FC, useState} from "react";
import {Button} from "flowbite-react";
import {useRouter} from "next/navigation";
import {deleteAuction} from "@/app/actions/auctionActions";
import toast from "react-hot-toast";

type Props = {
    id: string
}
const DeleteButton: FC<Props> = ({id}: Props) => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)

    const doDelete = () => {
        setLoading(true)
        deleteAuction(id).then(res => {
            if (res.error) throw res.error
            router.push('/')
        }).catch(e => {
            toast.error(e.status + ' ' + e.message)
        }).finally(() => setLoading(false))
    }

    return (
        <Button className='rounded-full' isProcessing={loading} color='failure' onClick={doDelete}>
            Delete Auction
        </Button>
    )
}
export default DeleteButton