## Focus on

- Integrate all the services in a reliable way first
- Focus on correctness and data consistency later

## Solution Architecture

```mermaid
graph LR
    B[Aggregator Service] -->|5 req/min| A[Transaction API]
    B -->|Write| C[(Database)]
    D[API Service] -->|Read| C
    E[End Users] -->|Millions req/day| D
``` 

## Decisions

- Create a mock transaction-api using Faker, OpenAPI and rate limiting
- Use nest CLI to bootstrap the transaction-aggregator
- NPM for simplicity
- Use TypeORM and Sqlite for simplicity
- Generate interfaces from OpenAPI spec using `openapi-typescript-codegen`

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