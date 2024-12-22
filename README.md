<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  
<h1 align="center">Blockchain Price Tracker</h1>
<p align="center">Thank you Hyperhire for this opportunity to showcase my backend development skills.</p>

## What it does

- Tracks ETH and Polygon prices every 5 minutes
- Sends automatic email alerts for 3% price changes to hyperhire_assignment@hyperhire.in
- Allows users to set custom price alerts, sent to specified email
- Provides ETH-BTC swap rate calculator with 0.03% fees
- Shows 24-hour price history

## Tech Stack
- NestJS
- PostgreSQL
- Docker
- Moralis API
- Swagger UI

## Project Structure
```
src/
├── config/         # Configuration management
├── email/          # Email notification system
├── price/          # Price tracking and alerts
└── main.ts         # Application entry point
```
## Environment Setup

Copy `.env.example` to `.env` and update the values according to the instructions provided in the example file.

## Quick Start

The application runs in containerized environment
- NestJS application container
- PostgreSQL database container

One command to run everything

```bash
docker compose up --build
```

Visit [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI

![Swagger UI API Endpoints](<swagger-ui.png>)


## API Endpoints

### Get 24-hour Price History
```http
GET /prices/hourly
```

### Set Custom Price Alert

```http
POST /prices/alerts
```

#### Request body

```
{
    "chain": "ethereum",
    "targetPrice": 2000,
    "email": "user@example.com"
}
```

### Get ETH-BTC Swap Rate

```http
GET /prices/swap-rate
```

Returns BTC amount and fees for the given ETH amount.


## Development

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Start development server
yarn start:dev
```


## Connect With Me

- LinkedIn - [Chinmai Siddhartha](https://www.linkedin.com/in/ncsiddhartha/)

- Check out my DeFi development: [Cross-Protocol Arbitrage Smart Contract](https://github.com/chinmaisiddhartha/balancer-fl)
  - Executes flash loan arbitrage across multiple DEX protocols
  - Integrates Uniswap V2/V3, PancakeSwap, and Aerodrome
  - Uses advanced features like ECDSA signatures and submarine sends
  - Implements MEV protection mechanisms

