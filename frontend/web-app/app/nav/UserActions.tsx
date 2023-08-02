'use client'

import {FC, useEffect, useState} from "react";
import {HiCog, HiUser} from "react-icons/hi";
import {User} from "next-auth";
import Link from "next/link";
import {AiFillCar, AiFillTrophy, AiOutlineLogout} from "react-icons/ai";
import {signOut} from "next-auth/react";
import {Button, Dropdown} from "flowbite-react";

type Props = {
    user: Partial<User>
}

const UserActions: FC<Props> = ({user}: Props) => {
    const [loadComplete, setLoadComplete] = useState(false)

    useEffect(() => setLoadComplete(true), [])

    return (
        loadComplete ? (
            <Dropdown inline label={`Welcome ${user.name}`}>
                <Dropdown.Item icon={HiUser}>
                    <Link href={'/'}>
                        My Auctions
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item icon={AiFillTrophy}>
                    <Link href={'/'}>
                        Auctions Won
                    </Link>
                </Dropdown.Item>
                <Dropdown.Item icon={AiFillCar}>
                    <Link href={'/'}>
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