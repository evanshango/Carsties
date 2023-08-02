import {FC} from "react";
import {useParamsStore} from "@/hooks/useParamsStore";
import Heading from "@/app/components/Heading";
import {Button} from "flowbite-react";

type Props = {
    title?: string
    subtitle?: string
    showReset?: boolean
}

const EmptyFilter: FC<Props> = (
    {
        title = 'No Matches for this Filter',
        subtitle = 'Try changing or resetting the filter',
        showReset
    }: Props) => {
    const reset = useParamsStore(state => state.reset)

    return (
        <div className='h-[50vh] flex flex-col gap-2 justify-center items-center shadow-lg mt-2 rounded-md'>
            <Heading title={title} subtitle={subtitle} center/>
            <div className="mt-4">
                {showReset && (
                    <Button outline onClick={reset}>
                        Remove Filters
                    </Button>
                )}
            </div>
        </div>
    )
}

export default EmptyFilter