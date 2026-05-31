// Chart Library using Chart.js
// Include Chart.js: <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

const ChartModule = (() => {
    const chartInstances = {};

    return {
        // Initialize all charts
        initCharts: async () => {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded');
                return;
            }

            // Initialize trading charts
            await ChartModule.initForexChart();
            await ChartModule.initCryptoCharts();
            await ChartModule.initPortfolioChart();
        },

        // Forex Chart
        initForexChart: async () => {
            const canvas = document.getElementById('forexChart');
            if (!canvas) return;

            const data = await APIModule.getHistoricalData('EUR/USD');
            const prices = data.map(d => d.close);
            const labels = data.map(d => d.date.split('-').slice(1).join('/'));

            chartInstances.forex = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'EUR/USD',
                        data: prices,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        hoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: { color: '#f1f5f9', font: { size: 12 } }
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#cbd5e1' }
                        },
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#cbd5e1' }
                        }
                    }
                }
            });
        },

        // Crypto Charts
        initCryptoCharts: async () => {
            const charts = [
                { id: 'cryptoChart1', asset: 'Bitcoin' },
                { id: 'cryptoChart2', asset: 'Ethereum' },
                { id: 'cryptoChart3', asset: 'Ripple' }
            ];

            for (const chart of charts) {
                const canvas = document.getElementById(chart.id);
                if (!canvas) continue;

                const data = await APIModule.getHistoricalData(chart.asset);
                const prices = data.map(d => d.close);
                const labels = data.map(d => d.date.split('-').slice(1).join('/'));

                chartInstances[chart.id] = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: chart.asset,
                            data: prices,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            }
        },

        // Portfolio Chart (Pie Chart)
        initPortfolioChart: async () => {
            const canvas = document.getElementById('portfolioChart');
            if (!canvas) return;

            chartInstances.portfolio = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Bitcoin', 'Ethereum', 'Stocks', 'Gold'],
                    datasets: [{
                        data: [21625, 11729, 9475, 20453],
                        backgroundColor: [
                            '#f59e0b',
                            '#8b5cf6',
                            '#6366f1',
                            '#fbbf24'
                        ],
                        borderColor: '#1e293b',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#f1f5f9', padding: 15 }
                        }
                    }
                }
            });
        },

        // Destroy chart
        destroyChart: (chartId) => {
            if (chartInstances[chartId]) {
                chartInstances[chartId].destroy();
                delete chartInstances[chartId];
            }
        },

        // Update chart data
        updateChart: (chartId, newData) => {
            if (chartInstances[chartId]) {
                chartInstances[chartId].data.datasets[0].data = newData;
                chartInstances[chartId].update();
            }
        }
    };
})();

// Initialize charts when DOM is ready
function initCharts() {
    // Add Chart.js CDN if not already included
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => ChartModule.initCharts();
        document.head.appendChild(script);
    } else {
        ChartModule.initCharts();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartModule;
}