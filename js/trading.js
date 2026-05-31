// Trading Module
const TradingModule = (() => {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    const positions = JSON.parse(localStorage.getItem('positions')) || [];

    return {
        // Place a new trade
        placeTrade: (tradeData) => {
            const currentUser = AuthModule.getCurrentUser();
            if (!currentUser) return { success: false, message: 'User not logged in' };

            const {
                asset,
                type,
                amount,
                price,
                market
            } = tradeData;

            // Validate trade
            if (!asset || !type || !amount || !price) {
                return { success: false, message: 'Invalid trade data' };
            }

            // Check wallet balance
            const totalCost = amount * price;
            if (currentUser.wallet.balance < totalCost && type === 'BUY') {
                return { success: false, message: 'Insufficient funds' };
            }

            // Create trade
            const trade = {
                id: Date.now(),
                userId: currentUser.id,
                asset,
                type,
                amount,
                price,
                market,
                totalValue: totalCost,
                status: 'OPEN',
                entryTime: new Date().toISOString(),
                exitTime: null,
                profitLoss: 0
            };

            // Add position
            if (type === 'BUY') {
                positions.push({
                    ...trade,
                    status: 'ACTIVE'
                });
                
                // Update wallet
                AuthModule.updateWallet(currentUser.id, -totalCost);
            } else if (type === 'SELL') {
                // Check if position exists
                const positionIndex = positions.findIndex(
                    p => p.asset === asset && p.userId === currentUser.id && p.status === 'ACTIVE'
                );

                if (positionIndex === -1) {
                    return { success: false, message: 'No active position to sell' };
                }

                // Close position
                const position = positions[positionIndex];
                const profitLoss = (price - position.price) * amount;
                position.status = 'CLOSED';
                position.exitTime = new Date().toISOString();
                position.profitLoss = profitLoss;

                // Update wallet
                AuthModule.updateWallet(currentUser.id, totalCost + profitLoss);
            }

            trade.status = 'CLOSED';
            trades.push(trade);

            // Save to storage
            localStorage.setItem('trades', JSON.stringify(trades));
            localStorage.setItem('positions', JSON.stringify(positions));

            return {
                success: true,
                message: `${type} order placed successfully`,
                trade
            };
        },

        // Get user trades
        getUserTrades: (userId) => {
            return trades.filter(t => t.userId === userId);
        },

        // Get user positions
        getUserPositions: (userId) => {
            return positions.filter(p => p.userId === userId && p.status === 'ACTIVE');
        },

        // Close position
        closePosition: (positionId, exitPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            const profitLoss = (exitPrice - position.price) * position.amount;
            position.status = 'CLOSED';
            position.exitTime = new Date().toISOString();
            position.profitLoss = profitLoss;

            // Update wallet
            const exitValue = position.amount * exitPrice;
            AuthModule.updateWallet(position.userId, exitValue + profitLoss);

            localStorage.setItem('positions', JSON.stringify(positions));

            return {
                success: true,
                message: 'Position closed successfully',
                position,
                profitLoss
            };
        },

        // Calculate portfolio value
        calculatePortfolioValue: (userId) => {
            const userPositions = positions.filter(p => p.userId === userId && p.status === 'ACTIVE');
            let totalValue = 0;
            let totalCost = 0;

            userPositions.forEach(position => {
                // In real app, fetch current price
                const currentPrice = position.price * (1 + Math.random() * 0.1 - 0.05);
                const positionValue = position.amount * currentPrice;
                totalValue += positionValue;
                totalCost += position.totalValue;
            });

            return {
                totalValue,
                totalCost,
                profitLoss: totalValue - totalCost,
                profitLossPercent: ((totalValue - totalCost) / totalCost * 100).toFixed(2)
            };
        },

        // Get trade history
        getTradeHistory: (userId, limit = 10) => {
            return trades
                .filter(t => t.userId === userId)
                .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
                .slice(0, limit);
        },

        // Set stop loss
        setStopLoss: (positionId, stopLossPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            position.stopLoss = stopLossPrice;
            localStorage.setItem('positions', JSON.stringify(positions));

            return { success: true, position };
        },

        // Set take profit
        setTakeProfit: (positionId, takeProfitPrice) => {
            const position = positions.find(p => p.id === positionId);
            if (!position) return { success: false, message: 'Position not found' };

            position.takeProfit = takeProfitPrice;
            localStorage.setItem('positions', JSON.stringify(positions));

            return { success: true, position };
        },

        // Check for SL/TP
        checkOrderTriggers: () => {
            positions.forEach(position => {
                if (position.status !== 'ACTIVE') return;

                // Simulate price update
                const priceChange = Math.random() - 0.48;
                const currentPrice = position.price * (1 + priceChange * 0.01);

                // Check stop loss
                if (position.stopLoss && currentPrice <= position.stopLoss) {
                    TradingModule.closePosition(position.id, position.stopLoss);
                    showNotification(`Stop Loss triggered for ${position.asset}`, 'warning');
                }

                // Check take profit
                if (position.takeProfit && currentPrice >= position.takeProfit) {
                    TradingModule.closePosition(position.id, position.takeProfit);
                    showNotification(`Take Profit triggered for ${position.asset}`, 'success');
                }
            });
        }
    };
})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TradingModule;
}