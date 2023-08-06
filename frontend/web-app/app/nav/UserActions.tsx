'use client'

import {FC, useEffect, useState} from "react";
import {HiCog, HiUser} from "react-icons/hi";
import {User} from "next-auth";
import Link from "next/link";
import {AiFillCar, AiFillTrophy, AiOutlineLogout} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {Button, Dropdown} from "flowbite-react";
import {usePathname, useRouter} from "next/navigation";
import {useParamsStore} from "@/hooks/useParamsStore";

type Props = {
    user: User
}

const UserActions: FC<Props> = ({user}: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const [loadComplete, setLoadComplete] = useState(false)
    const setParams = useParamsStore(state => state.setParams)

    const setWinner = () => {
        setParams({winner: user.username, seller: undefined});
        if (pathname !== '/') router.push('/')
    }

    const setSeller = () => {
        setParams({seller: user.username, winner: undefined});
        if (pathname !== '/') router.push('/')
    }

    useEffect(() => setLoadComplete(true), [])

    return (
        loadComplete ? (
            <Dropdown inline label={`Welcome ${user.name}`}>
                <Dropdown.Item icon={HiUser} onClick={setSeller}>
                    My Auctions
                </Dropdown.Item>
                <Dropdown.Item icon={AiFillTrophy} onClick={setWinner}>
                    Auctions Won
                </Dropdown.Item>
                <Dropdown.Item icon={AiFillCar}>
                    <Link href={'/auctions/create'}>
                        Sell My car
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item icon={HiCog}>
                    <Link href={'/session'}>
                        Session (dev only)
                    </Link>
                </Dropdown.Item>
                <Dropdown.Divider/>
                <Dropdown.Item icon={AiOutlineLogout} onClick={() => signOut({callbackUrl: '/'})}>
                    Sign out
                </Dropdown.Item>
            </Dropdown>
        ) : (
            <Button color="red" isProcessing size="md" className='rounded-full'>
                <p>Please wait...</p>
            </Button>
        )
    )
}

export default UserActions