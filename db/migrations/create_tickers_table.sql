CREATE TABLE tickers (
    symbol VARCHAR(20) PRIMARY KEY,
    last_price DECIMAL(20, 8) NOT NULL,
    price_change_24h DECIMAL(20, 8),
    price_change_percentage_24h DECIMAL(10, 2),
    high_price_24h DECIMAL(20, 8),
    low_price_24h DECIMAL(20, 8),
    volume_24h DECIMAL(20, 8) DEFAULT 0,
    quote_volume_24h DECIMAL(20, 8) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 