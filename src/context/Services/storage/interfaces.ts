import { Dispatch } from 'react'
import { tokenDisplayNames } from 'api/rif-marketplace-cache/rates/xr'
import networkConfig from 'config'
import { ContextState } from 'context/storeUtils/interfaces'
import { StorageOffersFilters } from 'models/marketItems/StorageFilters'
import { StorageItem, StorageOffer } from 'models/marketItems/StorageItem'
import { ServiceOrder, ServiceState } from '../interfaces'
import { OFFERS_ACTION } from './offersActions'
import { ContextName as OffersContextName } from './OffersContext'
import { StorageSellAction, STORAGE_SELL_ACTION } from './storageSellActions'
import { ContextName as SellContextName } from './StorageSellContext'

export type StorageContextNames = OffersContextName | SellContextName

export interface StoragePlanItem {
  internalId?: number
  currency: string // for now we only support RIF but in the future we may need something like an enum
  pricePerGb: number
  timePeriod: TimePeriodEnum
}

export interface StorageSellState extends ContextState {
  system: string
  availableSize: number
  country: string
  planItems: StoragePlanItem[]
  internalCounter: number
  allPeriods: TimePeriodEnum[]
  peerId: string
  usedPeriodsPerCurrency: Record<string, TimePeriodEnum[]> // dictionary to easily know the timePeriods already used by a given currency
}

export interface StorageSellContextProps {
  state: StorageSellState
  dispatch: Dispatch<StorageSellAction>
}

export type StorageState = ServiceState<StorageItem> & {
  filters: StorageOffersFilters
  limits: Pick<StorageOffersFilters, 'price' | 'size'>
}

export enum TimePeriodEnum {
  Daily = 1,
  Weekly = 7,
  Monthly = 30,
}

export type STORAGE_ACTION = STORAGE_SELL_ACTION | OFFERS_ACTION

export const zeroAddress = '0x'.padEnd(42, '0')

export const TokenAddressees = {
  [tokenDisplayNames.rbtc]: zeroAddress, // we are using zero address for native token is Storage Manager SC
  [tokenDisplayNames.rif]: networkConfig.contractAddresses.rif,
}
export type PinnedContent = {
  contentName: string
  contentSize: string
  contentHash: string
}

export type StorageOrder = Omit<ServiceOrder<StorageOffer>, 'isOutdated'>
