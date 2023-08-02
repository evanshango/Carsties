import EmptyFilter from "@/app/components/EmptyFilter";

const Page = ({searchParams}: { searchParams: { callbackUrl: string } }) => {
    return (
        <EmptyFilter
            title={'Alert! Unauthorized Request'}
            subtitle={'Please click below to login'}
            showLogin
            callbackUrl={searchParams.callbackUrl}
        />
    )
}

export default Page