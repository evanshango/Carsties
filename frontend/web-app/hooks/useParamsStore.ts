import {create} from "zustand";

type State = {
    pageNo: number
    pageSize: number
    totalPages: number
    searchTerm: string
    searchValue: string
    orderBy: string
    filterBy: string
}

type Actions = {
    setParams: (params: Partial<State>) => void
    reset: () => void
    setSearchValue: (value: string) => void
}

const initialState: State = {
    pageNo: 1,
    pageSize: 12,
    totalPages: 1,
    searchTerm: '',
    searchValue: '',
    orderBy: 'make',
    filterBy: 'live'
}

export const useParamsStore
    = create<State & Actions>()((set) => ({
    ...initialState,
    setParams: (newParams: Partial<State>) => {
        set((state) => {
            if (newParams.pageNo) {
                return {...state, pageNo: newParams.pageNo}
            } else {
                return {...state, ...newParams, pageNo: 1}
            }
        })
    },
    reset: () => set(initialState),
    setSearchValue: (value: string) => set({searchValue: value})
}))