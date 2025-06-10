import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from 'nuqs/server'

import { DEFAULT_PAGE } from '@/constants'
import { MeetingStatus } from './types'

export const filtersSearchParams = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
  search: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  agentId: parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  status: parseAsStringEnum(Object.values(MeetingStatus)).withOptions({ clearOnDefault: true }),
}

export const loadSearchParams = createLoader(filtersSearchParams)
