import { NextResponse } from 'next/server'
import { products } from '@/components/Base/Demo'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const limit = Number(searchParams.get('limit')) || 20

  let result = [...products]
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    )
  }
  result = result.slice(0, limit)

  return NextResponse.json({ data: result, total: result.length })
}
