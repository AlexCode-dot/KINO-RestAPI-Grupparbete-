function createStarElement(type) {
  const star = document.createElement('span')
  star.classList.add('top-rated__movie-star', type)
  star.textContent = '★'
  return star
}

function calculateStarRating(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating - fullStars >= 0.3
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  return { fullStars, halfStar, emptyStars }
}

export function createStars(rating) {
  const { fullStars, halfStar, emptyStars } = calculateStarRating(rating)

  const starsContainer = document.createElement('div')
  starsContainer.classList.add('top-rated__movie-stars')

  for (let i = 0; i < fullStars; i++) {
    starsContainer.appendChild(createStarElement('filled'))
  }

  if (halfStar) {
    starsContainer.appendChild(createStarElement('half'))
  }

  for (let i = 0; i < emptyStars; i++) {
    starsContainer.appendChild(createStarElement('empty'))
  }

  return starsContainer
}
