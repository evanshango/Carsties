'use client'

import {FC} from "react";
import {Pagination} from "flowbite-react";

type Props = {
    currentPage: number
    totalPages: number,
    pageChanged: (page: number) => void
}

const AppPagination: FC<Props> = ({currentPage, totalPages, pageChanged}: Props) => {

    return (
        <Pagination
            currentPage={currentPage}
            onPageChange={(e: number) => pageChanged(e)}
            totalPages={totalPages}
            layout='pagination'
            showIcons={true}
            className='text-blue-500 mb-5'
        />
    )
}

export default AppPagination