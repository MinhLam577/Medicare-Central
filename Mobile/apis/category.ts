import { CategoryType } from "@/type/categoryType"
import httpRequests from "@/utils/httpRequest"

export const getAllCategoriesApi = async () => {
    const response = await httpRequests.get("/categories")
    return response
}

export const getCategoriesLevel1Api = async () => {
    const response = await getAllCategoriesApi()
    return {
        ... response,
        data: response.data.filter((category: any) => category.category_parent_id === null),
    }
}

export const getCategoryByIdApi = async (categoryId: string) => {
    const response = await getAllCategoriesApi()
    const categories: CategoryType[] = []

    const getChildren = (category: CategoryType) => {
        categories.push(category)
        if (category.children) {
            category.children.forEach((child: CategoryType) => {
                getChildren(child)
            })
        }
    }

    response.data.forEach((category: CategoryType) => {
        getChildren(category)
    })


    return {
        ... response,
        data: categories.find((category: CategoryType) => category.category_id === parseInt(categoryId)),
    }
}