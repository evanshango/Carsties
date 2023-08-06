'use client'

import {FC} from "react";
import {Button} from "flowbite-react";
import Link from "next/link";

type Props = {
    id: string
}

const EditButton: FC<Props> = ({id}: Props) => {
    return (
        <Button outline pill>
            <Link href={`/auctions/update/${id}`}>Update Auction</Link>
        </Button>
    )
}

export default EditButton