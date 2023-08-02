'use client'

import {FC} from "react";
import {FaSearch} from "react-icons/fa";
import {useParamsStore} from "@/hooks/useParamsStore";

const Search: FC = () => {
    const setParams = useParamsStore(state => state.setParams)
    const setSearchValue = useParamsStore(state => state.setSearchValue)
    const searchValue: string = useParamsStore(state => state.searchValue)

    const onChange = (e: any) => setSearchValue(e.currentTarget.value)
    const search = () => setParams({searchTerm: searchValue})

    return (
        <div className='flex w-[50%] items-center border-2 rounded-full py-2 shadow-sm'>
            <input type="text" onChange={onChange} onKeyDown={(e: any) => e.key === 'Enter' && search()}
                   value={searchValue} placeholder='Search for Cars by make, model or color'
                   className='flex-grow pl-5 bg-transparent focus:outline-none border-transparent
                   focus:border-transparent focus:ring-0 text-sm text-gray-600'
            />
            <button onClick={search}>
                <FaSearch size={34} className='bg-red-400 text-white rounded-full p-2 cursor-pointer mx-2'/>
            </button>
        </div>
    )
}

export default Search