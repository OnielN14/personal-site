declare global {

    namespace NodeJS {
        interface ProcessEnv {
            SQLITE_TYPE: 'url' | 'file'
            SQLITE_URL?: string
            SQLITE_URL_AUTH_TOKEN?: string
        }
    }
}


export { }