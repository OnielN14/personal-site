import { drizzle } from "drizzle-orm/libsql"
import { Config, createClient } from "@libsql/client"
import * as schema from "./schema.server"
import { config } from 'dotenv'

config()

const clientConfig: Config = {
    url: process.env.SQLITE_URL ?? 'file:db.sqlite'
}

if (process.env.SQLITE_TYPE === 'url') {
    clientConfig.url = process.env.SQLITE_URL!
    clientConfig.authToken = process.env.SQLITE_URL_AUTH_TOKEN!
}


const client = createClient(clientConfig)
const db = drizzle(client, { schema })

export { client, db }