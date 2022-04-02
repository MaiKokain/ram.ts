import * as needle from 'needle'

export class RAM {
    private password: string|null
    private url: string
    public accounts: string[] = []
    
    /**
     * READ [Roblox Alt Manager Documentation](https://ic3w0lf22.gitbook.io/roblox-account-manager/)
     */
    constructor(opt: RAMOptions) {
        if (opt.password?.length < 6) throw new Error("Password must be over 6 characters.") 
        this.password = opt.password
        this.url = `http://localhost:${opt.port ?? "7963"}`
    }
    
    private async GET(method: string, account: string, any?: any[]) {
        let url = `${this.url}/${method}?Account=${account}`
        any?.map((v, i, a) => {
            if (v) url = `${url}&${v}`
        })
        
        if (this.password) {
            url = `${url}&Password=${this.password}`
        }
        
        const req = await needle('get', url)
        if (req.statusCode != 200) return false
        return req.body
    }

    private async POST(method: string, account: string, body: string, any?: any[]) {
        let url = `${this.url}/${method}?Account=${account}`

        any?.map((v, i, a) => {
            if (v) url = `${url}&${v}`
        })

        if (this.password) {
            url = `${url}&Password=${this.password}`
        }

        const req = await needle('post', url, body)
        if (req.statusCode != 200) return false

        return req.body
    }

    public async CheckAccount(username: string): Promise<boolean> {
        if (this.accounts.includes(username)) return true
        const isValid = await this.GET("Test", username)
        if (!!isValid || ["Invalid Account", "Empty Account"].some(v => v == isValid)) throw new Error(`Given account is invalid, Are you sure the name is correct?`)
        this.accounts.push(username)
        return true
    }
    /**
     * Add a new account to cache data. (not saved for now)
     */
    public async new(account: string): Promise<boolean|string> {
        return await this.CheckAccount(account)
    }
    /**
     * Launches an account from account manager using the given PlaceId. Requires AllowLaunchAccount setting to be set to `true`.
     * Use "placeid" as userid if you want to follow someone.
     */
    public async LaunchAccount(account: string, placeid: number, jobid?: string, followuser?: boolean, joinvip?: boolean): Promise<boolean|string> {
        return await this.GET("LaunchAccount", account, [`PlaceID=${placeid}`, (jobid && `JobId=${jobid}`), (followuser && `FollowUser=true`), (joinvip && `JoinVIP=true`)])
    }
    /**
     * Sets the next server ROBLOX matchmaking will put you in.
     */
    public async SetServer(account: string, placeid: number, jobid: string): Promise<boolean|string> {
        return await this.GET("SetService", account, [`PlaceID=${placeid}`, `JobID=${jobid}`])
    }
    /**
     * Sets the next server roblox matchmaking will put you in. Roblox Account Manager will choose the next smallest server depending on what servers are loaded.
     */
    public async SetRecommendedServer(account: string, placeid: number): Promise<boolean|string> {
        return await this.GET("SetServer", account, [`PlaceID=${placeid}`])
    }
    /**
     * Blocks a user by their UserId.
     */
    public async BlockUser(account: string, userid: number): Promise<boolean|string> {
        return await this.GET("BlockUser", account, [`UserID=${userid}`])
    }
    /**
     * Unblocks a user by their userid.
     */
    public async UnblockUser(account:string, userid: number): Promise<boolean|string> {
        return await this.GET("UnblockUser", account, [`userid=${userid}`])
    }
    /**
     * Unblocks everyone that is blocked.
     */
    public async UnblockEveryone(account: string): Promise<boolean|string> {
        return await this.GET("UnblockEveryone", account)
    }
    /**
     * Get a specific field of an account.
     */
    async GetField(account: string, field: string): Promise<boolean|string> {
        return await this.GET('GetField', account, [`Field=${field}`])
    }
    /**
     * Set an account's field.
     */
    public async SetField(account: string, field: string, value: string): Promise<boolean|string> {
        return await this.GET("SetField", account, [`Field=${field}`, `Value=${value}`])
    }
    /**
     * Remove an account's field.
     */
    public async RemoveField(account: string, field: string): Promise<boolean|string> {
        return await this.GET("RemoveField", account, [`Field=${field}`])
    }
    /**
     * Set an account's alias.
     */
    public async SetAlias(account: string, alias: string): Promise<boolean|string> {
        return await this.GET("SetAlias", account, [`alias=${alias}`])
    }
    /**
     * Set an account's description.
     */
    public async SetDescription(account: string, description: string): Promise<boolean | string> {
        return await this.POST("SetDescription", account, description)
    }
    /**
     * Append something to an account's description.
     */
    public async AppendDescription(account: string, description: string): Promise<boolean|string> {
        return await this.POST("AppendDescription", account, description)
    }
    /**
     * Get an account's alias.
     */
    public async GetAlias(account: string): Promise<boolean|string> {
        return await this.GET("GetAlias", account)
    }
    /**
     * Get an account's description.
     */
    public async GetDescription(account: string): Promise<boolean|string> {
        return await this.GET("GetDescription", account)
    }
    /**
     * Get an account's cookie (DANGEROUS, USE A SECURE PASSWORD IF YOU'RE USING THIS). Requires `AllowGetCookie` setting to be set to `true`.
     */
    public async GetCookie(account: string): Promise<boolean|string> {
        return await this.GET("GetCookie", account)
    }
    /**
     * Gets the account names in account manager and returns a list separated by commas. Requires `AllowGetAccounts` setting to be set to `true`.
     */
    public async GetAccounts(): Promise<boolean|string> {
        const req = await needle('get', `${this.url}/GetAccounts&Password=${this.password}`)
        if (req.statusCode != 200) return false
        return req.body
    }
    /**
     * Get an account's CSRF Token.
     */
    public async GetCSRF(account: string): Promise<boolean|string> {
        return await this.GET("GetCSRFToken", account)
    }
}

interface RAMOptions {
    port?: string,
    password: string
}
