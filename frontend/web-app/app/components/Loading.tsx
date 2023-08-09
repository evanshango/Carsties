import {Spinner} from "flowbite-react";
import {FC} from "react";

type Props = {
    label: string
}

const Loading: FC<Props> = ({label}: Props) => {
    return (
        <div className='flex justify-center items-center m-auto flex-col h-[40vh]'>
            <Spinner aria-label="Center-aligned Spinner" size='xl'/>
            <span className='mt-3'>{label}</span>
        </div>
    )
}

export default Loading