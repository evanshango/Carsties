import NextAuth, {Account, NextAuthOptions, Profile, Session} from "next-auth"
import DuendeIdentityServer6 from "next-auth/providers/duende-identity-server6";
import {JWT} from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        DuendeIdentityServer6({
            id: 'id-server',
            clientId: 'nextApp',
            clientSecret: 'super_secure_secret',
            issuer: 'http://localhost:5001',
            authorization: {params: {scope: 'openid profile auctionApp'}},
            idToken: true
        })
    ],
    callbacks: {
        async jwt({token, profile, account}: {
            token: JWT,
            profile?: Profile | undefined,
            account: Account | null
        }): Promise<JWT> {
            if (profile) {
                token.username = profile.username
            }
            if (account) {
                token.access_token = account.access_token
            }
            return token
        },

        async session({session, token}: { session: Session, token: JWT }): Promise<Session> {
            session.user.username = token && token.username
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}