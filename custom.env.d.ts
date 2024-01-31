declare global {

    namespace NodeJS {
        interface ProcessEnv {
            SQLITE_TYPE: 'url' | 'file'
            SQLITE_URL?: string
            SQLITE_URL_AUTH_TOKEN?: string

            GITHUB_USER?: string
            OAUTH_GITHUB_CLIENT_ID?: string
            OAUTH_GITHUB_CLIENT_SECRET?: string
            SESSION_SECRET?: string
            APP_URL?: string
        }
    }
}


export { }