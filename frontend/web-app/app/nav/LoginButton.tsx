'use client'

import {FC} from "react";
import {Button} from "flowbite-react";
import {signIn} from "next-auth/react";
import {AiOutlineLogin} from "react-icons/ai";

const LoginButton: FC = () => {
    return (
        <Button color="info" size="md" pill onClick={() => signIn('id-server', {callbackUrl: '/'})}>
            <AiOutlineLogin className='mr-2 h-4 w-4'/>
            Login
        </Button>
    )
}

export default LoginButton