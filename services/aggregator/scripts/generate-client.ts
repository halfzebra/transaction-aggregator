import { generateApi } from 'openapi-typescript-codegen'

async function generate() {
  await generateApi({
    input: 'http://localhost:3000/api-docs/swagger.json',
    output: './src/generated/transaction-api',
    client: 'axios', // or 'fetch'
    httpClient: 'axios',
    useOptions: true,
    useUnionTypes: true,
  })
}

generate()