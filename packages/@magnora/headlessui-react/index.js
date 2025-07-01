export * from './src'
import { createRatingStars } from './dist/components/rating/rating.js'
const targetDiv = document.getElementById('rating-root')

if (targetDiv){
    createRatingStars({
        productId: 'xyz123',
        size: 20,
        color: '#f39c12',
        mount: targetDiv,
    })

}
