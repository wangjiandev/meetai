import { parseAsStringEnum, parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { DEFAULT_PAGE } from '@/constants'
import { MeetingStatus } from '../types'

export const useMeetingFilters = () => {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  )
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  )
  const [agentId, setAgentId] = useQueryState(
    'agentId',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  )
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum(Object.values(MeetingStatus)).withOptions({ clearOnDefault: true }),
  )

  return { page, search, agentId, status, setPage, setSearch, setAgentId, setStatus }
}
