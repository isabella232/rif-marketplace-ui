import { client } from "./cacheController"

const service = client.service('/rates/v0/');

export type SupportedCurrencies = 'usd' | 'eur' | 'btc' | 'ars' | 'cny' | 'krw' | 'jpy';
export type SupportedTokens = 'rif';
export const tokenDisplayNames = {
    rif: 'RIF',
    rbtc: 'RBTC',
}

export const fetchExchangeRatesFor = (fiatSymbol: SupportedCurrencies) => {
    return service.find({
        query: {
            $select: ['token', fiatSymbol]
        }
    });
}