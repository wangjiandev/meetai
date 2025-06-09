import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { DEFAULT_PAGE } from '@/constants'

export const useAgentFilters = () => {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  )
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  )

  return { page, search, setPage, setSearch }
}
