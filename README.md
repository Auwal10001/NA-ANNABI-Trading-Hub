# NA ANNABI Trading Hub

A comprehensive professional trading platform built with HTML5, CSS3, and JavaScript. Trade Forex, Cryptocurrencies, DEX tokens, Stocks, and Precious Metals all in one place.

## Features

### 🎯 Core Features
- **Dashboard** - Real-time portfolio overview and market overview
- **Forex Trading** - Trade major currency pairs with live charts
- **Cryptocurrency Trading** - Bitcoin, Ethereum, and other crypto assets
- **DEX (Decentralized Exchange)** - Swap tokens directly
- **Stock Trading** - Trade stocks from major exchanges
- **Precious Metals** - Gold, Silver, Platinum, and Palladium trading
- **Portfolio Management** - Track your holdings and performance

### 🔐 User Management
- User registration and login
- Secure authentication
- Wallet management
- Profile settings

### 📊 Trading Features
- Place Buy/Sell orders
- Real-time price charts
- Trade history
- Portfolio analytics
- Stop Loss and Take Profit orders
- Position management

### 🎨 User Interface
- Professional dark/light theme
- Responsive design (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Real-time notifications
- Intuitive navigation

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js
- **APIs**: 
  - CoinGecko (Cryptocurrency data)
  - Alpha Vantage (Stock data)
  - OpenExchangeRates (Forex data)
- **Storage**: Local Storage

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/NA-ANNABI-Trading-Hub.git
```

2. Navigate to the project directory
```bash
cd NA-ANNABI-Trading-Hub
```

3. Open index.html in your browser
```bash
open index.html
```

Or use a local server:
```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`

## Project Structure

```
NA-ANNABI-Trading-Hub/
├── index.html           # Main HTML file
├── css/
│   └── styles.css      # All CSS styles
├── js/
│   ├── main.js         # Main application logic
│   ├── auth.js         # Authentication module
│   ├── api-integration.js  # API integration
│   ├── chart-library.js    # Chart functionality
│   └── trading.js      # Trading operations
└── README.md           # This file
```

## Usage

### Getting Started
1. Open the application
2. Sign up for a new account
3. Login to access the trading dashboard
4. Start trading across different markets

### Trading
1. Navigate to your desired market (Forex, Crypto, etc.)
2. Enter trade details (asset, amount, type)
3. Review and confirm
4. Monitor your positions in the portfolio

### Portfolio Management
- View your holdings in the Portfolio section
- Check profit/loss for each asset
- Set stop loss and take profit levels
- Close positions at desired prices

## API Integration

### Setting Up APIs

1. **CoinGecko** (Free - No key needed)
   - Used for cryptocurrency prices
   - API: https://api.coingecko.com/api/v3

2. **Alpha Vantage** (Free tier available)
   - Used for stock prices
   - Get your key: https://www.alphavantage.co/
   - Update the API key in `js/api-integration.js`

3. **OpenExchangeRates** (Free tier available)
   - Used for forex rates
   - Get your key: https://openexchangerates.io/
   - Update the API key in `js/api-integration.js`

## Features Coming Soon

- [ ] WebSocket for real-time data
- [ ] Advanced charting with TradingView
- [ ] Social trading features
- [ ] AI-powered trading signals
- [ ] Mobile app
- [ ] API documentation
- [ ] Automated trading strategies
- [ ] Advanced analytics

## Data Storage

The application uses browser's Local Storage for data persistence:
- User accounts
- Trading history
- Portfolio positions
- User preferences

**Note**: Data is stored locally. Use cloud database for production.

## Security Considerations

⚠️ **Important**: This is a demo application. For production use:

1. Implement proper backend authentication (JWT, OAuth2)
2. Use secure API endpoints
3. Encrypt sensitive data
4. Implement proper SSL/TLS
5. Use environment variables for API keys
6. Add rate limiting
7. Implement proper error handling
8. Add input validation and sanitization

## Performance Optimization

- Lazy loading of assets
- CSS animations using GPU acceleration
- Debounced API calls
- Efficient DOM manipulation
- Service Workers for offline support

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@naannabi.com or open an issue on GitHub.

## Disclaimer

This application is for educational purposes only. It is not a real trading platform. Do not use real money. Always conduct your own research before making any investment decisions.

## Roadmap

### Phase 1 (Current)
- ✅ Dashboard and market overview
- ✅ Basic trading interface
- ✅ Authentication system
- ✅ Portfolio management

### Phase 2
- Advanced charting
- Real-time WebSocket data
- Social features

### Phase 3
- Mobile application
- AI trading signals
- Automated strategies

## Contact

**NA ANNABI Trading Hub**
- Email: info@naannabi.com
- Website: www.naannabi.com
- Twitter: @naannabi
- Discord: [Join our community](https://discord.gg/naannabi)

---

**Made with ❤️ by NA ANNABI Team**