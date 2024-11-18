export interface Book {
  id: string,
  title: string,
  author: string,
  year: number | null,
  description?: string,
  image?: string,
}
