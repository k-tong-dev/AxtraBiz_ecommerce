import { db } from '../client';
import { currencies } from '@/lib/drizzle/schema';

export async function seedCurrencies() {
    await db.insert(currencies).values([
        { code: 'USD', name: 'US Dollar',        symbol: '$',  decimal_places: 2, exchange_rate: '1.000000', active: true },
        { code: 'EUR', name: 'Euro',             symbol: '€',  decimal_places: 2, exchange_rate: '0.920000', active: true },
        { code: 'GBP', name: 'British Pound',    symbol: '£',  decimal_places: 2, exchange_rate: '0.790000', active: true },
        { code: 'CAD', name: 'Canadian Dollar',  symbol: 'C$', decimal_places: 2, exchange_rate: '1.370000', active: true },
        { code: 'AUD', name: 'Australian Dollar',symbol: 'A$', decimal_places: 2, exchange_rate: '1.520000', active: true },
        { code: 'JPY', name: 'Japanese Yen',     symbol: '¥',  decimal_places: 0, exchange_rate: '151.500000', active: true },
        { code: 'CNY', name: 'Chinese Yuan',     symbol: '¥',  decimal_places: 2, exchange_rate: '7.240000', active: true },
    ]).onConflictDoNothing(); // skip if already exists

    console.log('✅ Currencies seeded');
}