export async function fetchTopRatedMovies() {
  const response = await fetch('/api/movies/top-rated')

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error)
  }

  return await response.json()
}
