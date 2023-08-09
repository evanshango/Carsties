'use client'

import {FC, useState} from "react";
import {updateAuction} from "@/app/actions/auctionActions";
import {Button} from "flowbite-react";

const AuthTest: FC = () => {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>()

    const update = () => {
        setResult(undefined)
        setLoading(true)
        updateAuction({}, '123')
            .then(res => setResult(res))
            .finally(() => setLoading(false))
    }

    return (
        <div className='flex items-center gap-4'>
            <Button outline isProcessing={loading} onClick={update}>
                Test Auth
            </Button>
            <div>
                {JSON.stringify(result, null, 2)}
            </div>
        </div>
    )
}
export default AuthTest
