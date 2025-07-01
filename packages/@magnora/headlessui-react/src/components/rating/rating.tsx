interface RatingProps {
    productId: string
    totalReviews?: number
    size?: number
    color?: string
    mount: HTMLElement
}

export function createRatingStars({
                                      productId,
                                      totalReviews = 0,
                                      size = 24,
                                      color = '#FFD700',
                                      mount,
                                  }: RatingProps) {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.gap = '4px'

    // Simulated static value (you’ll fetch real data later)
    const rating = 4.2
    const stars = Math.round(rating * 2) / 2

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span')
        star.innerHTML = i <= stars ? '★' : '☆'
        star.style.fontSize = `${size}px`
        star.style.color = color
        container.appendChild(star)
    }

    if (totalReviews) {
        const text = document.createElement('span')
        text.textContent = `(${totalReviews})`
        text.style.fontSize = `${size - 4}px`
        text.style.marginLeft = '6px'
        container.appendChild(text)
    }
    //rating.tsx

    // Don't clear the div, just append inside
    mount.appendChild(container)
}