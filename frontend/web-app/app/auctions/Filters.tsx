import {FC} from "react";
import {Button} from "flowbite-react";
import {useParamsStore} from "@/hooks/useParamsStore";
import {AiOutlineClockCircle, AiOutlineSortAscending} from "react-icons/ai";
import {BsFillStopCircleFill, BsStopwatchFill} from "react-icons/bs";
import {GiFinishLine, GiFlame} from "react-icons/gi";

const pageSizeButtons: number[] = [4, 8, 12, 16]

const orderButtons = [
    {
        label: 'Alphabetical',
        icon: AiOutlineSortAscending,
        value: 'make'
    },
    {
        label: 'End Date',
        icon: AiOutlineClockCircle,
        value: 'endingSoon'
    },
    {
        label: 'Recently Added',
        icon: BsFillStopCircleFill,
        value: 'new'
    }
]

const filterButtons = [
    {
        label: 'Live Auctions',
        icon: GiFlame,
        value: 'live'
    },
    {
        label: 'Ending < 6 hours',
        icon: GiFinishLine,
        value: 'ending'
    },
    {
        label: 'Completed',
        icon: BsStopwatchFill,
        value: 'finished'
    }
]

const Filters: FC = () => {
    const pageSize: number = useParamsStore(state => state.pageSize)
    const setParams = useParamsStore(state => state.setParams)
    const orderBy: string = useParamsStore(state => state.orderBy)
    const filterBy: string = useParamsStore(state => state.filterBy)

    return (
        <div className='flex justify-between items-center mb-4'>
            <div>
                <span className="uppercase text-sm text-gray-500 mr-2">Filter By</span>
                <Button.Group>
                    {filterButtons.map(({label, icon: Icon, value}) => (
                        <Button key={value} onClick={() => setParams({filterBy: value})}
                                color={`${filterBy === value ? 'red' : 'gray'}`} className='focus:ring-0'>
                            <Icon className='mr-3 h-5 w-5'/>
                            {label}
                        </Button>
                    ))}
                </Button.Group>
            </div>
            <div>
                <span className="uppercase text-sm text-gray-500 mr-2">Order By</span>
                <Button.Group>
                    {orderButtons.map(({label, icon: Icon, value}) => (
                        <Button key={value} onClick={() => setParams({orderBy: value})}
                                color={`${orderBy === value ? 'red' : 'gray'}`} className='focus:ring-0'>
                            <Icon className='mr-3 h-5 w-5'/>
                            {label}
                        </Button>
                    ))}
                </Button.Group>
            </div>
            <div>
                <span className="uppercase text-sm text-gray-500 mr-2">Page Size</span>
                <Button.Group>
                    {pageSizeButtons.map((value: number, i: number) => (
                        <Button key={i} onClick={() => setParams({pageSize: value})}
                                color={`${pageSize === value ? 'red' : 'gray'}`}
                                className='focus:ring-0'>
                            {value}
                        </Button>
                    ))}
                </Button.Group>
            </div>
        </div>
    )
}

export default Filters