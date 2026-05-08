import httpRequests from "@/utils/httpRequest"

// /products?search=Exo&page=2&paginate=5&brand_names[]=Pharimexco&product_price=below_100k&category_name=Thuốc cảm lạnh&brand_names[]=Hasan- Demarpharm
export const getProductsByCategoryIdApi = async (
    category_name?: string,
    page: number = 1,
    paginate: number = 16,
    typesort: string = 'product_sold',
    sortlatest: boolean = true,
    price_from?: number,
    price_to?: number,
    brand_names: string[] = [],
    search: string = ''
) => {
    const params = {} as any
    if (category_name) {
        params['category_name'] = category_name
    }
    if (page) {
        params['page'] = page
    }
    if (paginate) {
        params['paginate'] = paginate
    }
    if (typesort) {
        params['typesort'] = typesort
    }
    if (sortlatest !== undefined) {
        params['sortlatest'] = sortlatest
    }
    if (price_from) {
        params['price_from'] = price_from
    }
    if (price_to) {
        params['price_to'] = price_to
    }
    if (brand_names) {
        params['brand_names'] = brand_names
    }
    if (search !== '') {
        params['search'] = search
    }
    const response = await httpRequests.get(`/products`, {
        params: params
    })
    return response
}

export const getProductByIdApi = async (productId: number) => {
    const response = await httpRequests.get(`/products/${productId}`)
    return response
}

export const getTopSellingProductsApi = async (
    limit: number = 16
) => {
    const response = await httpRequests.get(`/products?typesort=product_sold&sortlatest=true&paginate=${limit}`)
    return response
}

export const getNewestProductsApi = async (
    limit: number = 16,
    page: number = 1
) => {
    const response = await httpRequests.get(`/products?typesort=new&sortlatest=true&paginate=${limit}&page=${page}`)
    return response
}

export const getReviewProductApi = async (productId: number,
    page: number = 1,
    paginate: number = 3
) => {
    return httpRequests.get(`/reviews/product/${productId}?paginate=${paginate}&page=${page}`)
}
