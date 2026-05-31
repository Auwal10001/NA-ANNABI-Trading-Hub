// API Integration Module
const APIModule = (() => {
    const API_CONFIG = {
        // CoinGecko API (Free)
        COINGECKO: 'https://api.coingecko.com/api/v3',
        // Alpha Vantage API (Free tier available)
        ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
        // Finnhub API (Free)
        FINNHUB: 'https://finnhub.io/api/v1',
        // OpenExchangeRates API
        OPENEXCHANGERATES: 'https://openexchangerates.io/api'
    };

    return {
        // Get Cryptocurrency Prices
        getCryptoPrices: async () => {
            try {
                const response = await fetch(
                    `${API_CONFIG.COINGECKO}/simple/price?ids=bitcoin,ethereum,ripple&vs_currencies=usd&include_24hr_change=true`
                );
                const data = await response.json();
                return formatCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto prices:', error);
                return getMockCryptoData();
            }
        },

        // Get Forex Rates
        getForexRates: async () => {
            try {
                const response = await fetch(
                    `${API_CONFIG.OPENEXCHANGERATES}/latest?app_id=YOUR_APP_ID&base=USD`
                );
                const data = await response.json();
                return formatForexData(data);
            } catch (error) {
                console.error('Error fetching forex rates:', error);
                return getMockForexData();
            }
        },

        // Get Stock Prices
        getStockPrice: async (symbol) => {
            try {
                const response = await fetch(
                    `${API_CONFIG.ALPHA_VANTAGE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=YOUR_API_KEY`
                );
                const data = await response.json();
                return formatStockData(data);
            } catch (error) {
                console.error('Error fetching stock price:', error);
                return getMockStockData(symbol);
            }
        },

        // Get Market Data
        getMarketData: async () => {
            try {
                const crypto = await APIModule.getCryptoPrices();
                const stocks = await Promise.all([
                    APIModule.getStockPrice('AAPL'),
                    APIModule.getStockPrice('MSFT'),
                    APIModule.getStockPrice('GOOGL')
                ]);
                const forex = await APIModule.getForexRates();

                return { crypto, stocks, forex };
            } catch (error) {
                console.error('Error fetching market data:', error);
                return getMockMarketData();
            }
        },

        // Get Historical Data for Charts
        getHistoricalData: async (asset) => {
            // Mock historical data for now
            return generateMockHistoricalData(asset);
        }
    };

    // Data Formatting Functions
    function formatCryptoData(data) {
        return {
            bitcoin: {
                symbol: 'BTC',
                price: data.bitcoin?.usd || 43250,
                change24h: data.bitcoin?.usd_24h_change || 5.2
            },
            ethereum: {
                symbol: 'ETH',
                price: data.ethereum?.usd || 2345.80,
                change24h: data.ethereum?.usd_24h_change || 3.8
            },
            ripple: {
                symbol: 'XRP',
                price: data.ripple?.usd || 2.15,
                change24h: data.ripple?.usd_24h_change || -1.2
            }
        };
    }

    function formatForexData(data) {
        return {
            eur_usd: {
                pair: 'EUR/USD',
                rate: data.rates?.EUR || 1.0850,
                change: 0.15
            },
            gbp_usd: {
                pair: 'GBP/USD',
                rate: data.rates?.GBP || 1.2750,
                change: 0.25
            },
            jpy_usd: {
                pair: 'USD/JPY',
                rate: 1 / (data.rates?.JPY || 0.0067),
                change: -0.15
            }
        };
    }

    function formatStockData(data) {
        const quote = data['Global Quote'] || {};
        return {
            symbol: quote['01. symbol'] || 'N/A',
            price: parseFloat(quote['05. price'] || 0),
            change: parseFloat(quote['09. change'] || 0),
            changePercent: parseFloat(quote['10. change percent'] || 0)
        };
    }

    // Mock Data Functions
    function getMockCryptoData() {
        return {
            bitcoin: { symbol: 'BTC', price: 43250, change24h: 5.2 },
            ethereum: { symbol: 'ETH', price: 2345.80, change24h: 3.8 },
            ripple: { symbol: 'XRP', price: 2.15, change24h: -1.2 }
        };
    }

    function getMockForexData() {
        return {
            eur_usd: { pair: 'EUR/USD', rate: 1.0850, change: 0.15 },
            gbp_usd: { pair: 'GBP/USD', rate: 1.2750, change: 0.25 },
            jpy_usd: { pair: 'USD/JPY', rate: 149.50, change: -0.15 }
        };
    }

    function getMockStockData(symbol) {
        const stocks = {
            'AAPL': { symbol: 'AAPL', price: 189.50, change: 2.3, changePercent: 1.23 },
            'MSFT': { symbol: 'MSFT', price: 378.90, change: 1.8, changePercent: 0.48 },
            'GOOGL': { symbol: 'GOOGL', price: 142.30, change: -0.5, changePercent: -0.35 },
            'AMZN': { symbol: 'AMZN', price: 175.45, change: 3.2, changePercent: 1.85 }
        };
        return stocks[symbol] || stocks['AAPL'];
    }

    function getMockMarketData() {
        return {
            crypto: getMockCryptoData(),
            stocks: [getMockStockData('AAPL'), getMockStockData('MSFT'), getMockStockData('GOOGL')],
            forex: getMockForexData()
        };
    }

    function generateMockHistoricalData(asset) {
        const data = [];
        const now = new Date();
        let basePrice = Math.random() * 50000 + 25000;

        for (let i = 30; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            basePrice += (Math.random() - 0.48) * 1000;
            data.push({
                date: date.toISOString().split('T')[0],
                open: basePrice - 500,
                high: basePrice + 1000,
                low: basePrice - 1000,
                close: basePrice,
                volume: Math.floor(Math.random() * 1000000)
            });
        }

        return data;
    }
})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIModule;
}