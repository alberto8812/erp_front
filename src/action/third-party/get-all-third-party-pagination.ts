import { IPaginationShared } from "@/common/interfaces/pagination.filter.common"

export const getAllThirdPartyPagination = async (paginationShared: IPaginationShared) => {
    const response = await fetch('http://localhost:3009/onerp/ms-erp-manager/pagination',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paginationShared)

        }
    ).then(
        (res) => res.json()
    )



    return response
}