type MagnoraContextType = {
    apiKey: string
    shopDomain?: string
    getRating: (productId: string) => Promise<{
        rating: number
        totalReviews: number
    }>
}

let magnoraContext: MagnoraContextType | null = null

export function initMagnoraProvider(options: {
    apiKey: string
    shopDomain?: string
}) {
    magnoraContext = {
        apiKey: options.apiKey,
        shopDomain: options.shopDomain,
        getRating: async (productId: string) => {
            const res = await fetch(
                `/api/shopify/reviews?productId=${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${options.apiKey}`,
                    },
                }
            )

            if (!res.ok) throw new Error('Failed to fetch rating')
            const data = await res.json()
            return {
                rating: data.rating,
                totalReviews: data.totalReviews,
            }
        },
    }
}

export function useMagnora() {
    if (!magnoraContext) {
        throw new Error('MagnoraProvider has not been initialized')
    }
    return magnoraContext
}