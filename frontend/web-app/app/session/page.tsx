import {FC} from "react";
import {fetchSession, fetchToken} from "@/app/actions/authActions";
import Heading from "@/app/components/Heading";
import AuthTest from "@/app/session/AuthTest";
import {JWT} from "next-auth/jwt";
import {Session} from "next-auth";

const Session: FC = async () => {
    const session: Session | null = await fetchSession()
    const token: JWT | null = await fetchToken()
    return (
        <div>
            <Heading title={'Session Dashboard'}/>
            <div className="bg-blue-200 border-2 border-blue-500 py-2 px-4 rounded-md">
                <h3 className='text-lg'>Session Data</h3>
                {session && <pre>{JSON.stringify(session, null, 2)}</pre>}
            </div>
            <div className='mt-4'>
                <AuthTest/>
            </div>
            <div className="bg-green-200 border-2 border-green-500 py-2 px-4 rounded-md mt-4">
                <h3 className='text-lg'>Token Data</h3>
                {token && <pre className='overflow-auto'>{JSON.stringify(token, null, 2)}</pre>}
            </div>
        </div>
    )
}

export default Session