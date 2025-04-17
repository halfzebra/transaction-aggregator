# Transaction Aggregator System

## Quick Start

### Prerequisites
- Node.js 18+ (`brew install node`)
- Git (`brew install git`)

### Run Services

1. Clone and setup:
```bash
git clone git@github.com:yourusername/transaction-aggregation.git
cd transaction-aggregation
```

2. Start each service in separate terminals:

```bash
# Terminal 1: Transaction API
cd services/transaction-api
npm install
npm run start:dev     # Runs on :3000

# Terminal 2: Aggregator
cd services/aggregator
npm install
npm run start:dev     # Runs on :3001

# Terminal 3: Reporter
cd services/reporter
npm install
npm run start:dev     # Runs on :3002
```

### Test
```bash
# Trigger aggregation
curl -X POST http://localhost:3001/transactions/aggregate

# View results
curl http://localhost:3002/users/1/transactions
```

## Solution Architecture

While making everything as a single service would be more time efficient, it would not be a good design choice. The architecture should be designed to be scalable and maintainable.

```mermaid
graph LR
    B[Aggregator Service] -->|5 req/min| A[Transaction API]
    B -->|Write| C[(Database)]
    D[Reporter API Service] -->|Read| C
    E[End Users] -->|Millions req/day| D
``` 

## Focus on

- Integrate all the services in a reliable way first
- Focus on correctness and data consistency later

## Decisions

- Create a mock transaction-api using Faker, OpenAPI and rate limiting
- Use nest CLI to bootstrap the transaction-aggregator
- NPM for simplicity
- Use TypeORM and Sqlite for simplicity
- Generate interfaces from OpenAPI spec using `openapi-typescript-codegen`
- Do not use NPM Workspaces for shared due to the time constrains
- Concern: 5000 * 60 * 24 = up to 7.2M records/day(might be a problem with 5 req/min)

## Ideas

- `docker-compose.yml` for local development and testing with real PostgreSQL
- Higher-quality mock data with stateful users for correctness and data consistency
- Use Redis for caching
- generate transaction-api on build and don't store generated client in the repo

### Production Architecture

```mermaid
graph TD
    subgraph "Data Collection"
        A[Transaction API] -->|Rate Limited 5 req/min| B[AWS Lambda]
        B -->|Messages| C[AWS SQS Queue]
        B -->|Metrics| M[AWS CloudWatch]
    end

    subgraph "Data Processing"
        C -->|Consume Messages| D[ECS Worker Service]
        D -->|Write| E[(Amazon RDS)]
        D -->|Cache| F[Redis Cluster]
        D -->|Metrics| M
    end

    subgraph "Data Serving"
        G[API Gateway] -->|Route| H[ECS API Service]
        H -->|Read| E
        H -->|Cache| F
        H -->|Metrics| M
    end

    subgraph "Monitoring & Alerts"
        M -->|Alerts| N[AWS SNS]
        N -->|Notify| O[PagerDuty]
    end

    P[CDN] -->|Cache| G
    Q[End Users] -->|Millions req/day| P
```