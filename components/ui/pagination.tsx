import * as React from 'react'
import { Pagination as RsPagination } from 'rsuite'

import { cn } from '@/lib/utils'
type PaginationContextType = {
  activePage: number
  setActivePage: (page: number) => void
  totalPages: number
}
const PaginationContext = React.createContext<PaginationContextType | null>(null)

function Pagination({
  className,
  totalPages = 1,
  defaultPage = 1,
}: {
  className?: string
  totalPages?: number
  defaultPage?: number
}) {
  const [activePage, setActivePage] = React.useState(defaultPage)
  return (
    <div data-slot="pagination" className={cn('mx-auto flex w-full justify-center', className)}>
      <PaginationContext.Provider value={{ activePage, setActivePage, totalPages }}>
        <RsPagination
          prev
          next
          first={false}
          last={false}
          ellipsis
          boundaryLinks
          maxButtons={5}
          pages={Math.max(1, totalPages)}
          activePage={activePage}
          onSelect={setActivePage}
        />
      </PaginationContext.Provider>
    </div>
  )
}

function PaginationContent({ children }: { children?: React.ReactNode }) { return <>{children}</> }
function PaginationItem({ children }: { children?: React.ReactNode }) { return <>{children}</> }
function PaginationLink({ children }: { children?: React.ReactNode }) { return <>{children}</> }
function PaginationPrevious({ children }: { children?: React.ReactNode }) { return <>{children}</> }
function PaginationNext({ children }: { children?: React.ReactNode }) { return <>{children}</> }
function PaginationEllipsis() { return null }

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
