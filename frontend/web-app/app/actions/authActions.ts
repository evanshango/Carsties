import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {cookies, headers} from "next/headers";
import {NextApiRequest} from "next";
import {getToken} from "next-auth/jwt";

export const fetchSession = async () => await getServerSession(authOptions)

export const fetchCurrentUser = async () => {
    try {
        const session: Session | null = await fetchSession()
        return !session ? null : session.user
    } catch (e) {
        return null
    }
}

export const fetchToken = async () => {
    const req = {
        headers: Object.fromEntries(headers() as Headers),
        cookies: Object.fromEntries(cookies().getAll().map(c => [c.name, c.value]))
    } as NextApiRequest

    return await getToken({req})
}