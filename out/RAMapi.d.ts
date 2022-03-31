export declare class RAM {
    private password;
    private url;
    accounts: string[];
    /**
     * READ [Roblox Alt Manager Documentation](https://ic3w0lf22.gitbook.io/roblox-account-manager/)
     */
    constructor(port: string | undefined, password: string);
    private GET;
    private POST;
    CheckAccount(username: string): Promise<boolean>;
    /**
     * Add a new account to cache data. (not saved for now)
     */
    new(account: string): Promise<boolean | string>;
    /**
     * Launches an account from account manager using the given PlaceId. Requires AllowLaunchAccount setting to be set to `true`.
     * Use "placeid" as userid if you want to follow someone.
     */
    LaunchAccount(account: string, placeid: number, jobid?: string, followuser?: boolean, joinvip?: boolean): Promise<boolean | string>;
    /**
     * Sets the next server ROBLOX matchmaking will put you in.
     */
    SetServer(account: string, placeid: number, jobid: string): Promise<boolean | string>;
    /**
     * Sets the next server roblox matchmaking will put you in. Roblox Account Manager will choose the next smallest server depending on what servers are loaded.
     */
    SetRecommendedServer(account: string, placeid: number): Promise<boolean | string>;
    /**
     * Blocks a user by their UserId.
     */
    BlockUser(account: string, userid: number): Promise<boolean | string>;
    /**
     * Unblocks a user by their userid.
     */
    UnblockUser(account: string, userid: number): Promise<boolean | string>;
    /**
     * Unblocks everyone that is blocked.
     */
    UnblockEveryone(account: string): Promise<boolean | string>;
    /**
     * Get a specific field of an account.
     */
    GetField(account: string, field: string): Promise<boolean | string>;
    /**
     * Set an account's field.
     */
    SetField(account: string, field: string, value: string): Promise<boolean | string>;
    /**
     * Remove an account's field.
     */
    RemoveField(account: string, field: string): Promise<boolean | string>;
    /**
     * Set an account's alias.
     */
    SetAlias(account: string, alias: string): Promise<boolean | string>;
    /**
     * Set an account's description.
     */
    SetDescription(account: string, description: string): Promise<boolean | string>;
    /**
     * Append something to an account's description.
     */
    AppendDescription(account: string, description: string): Promise<boolean | string>;
    /**
     * Get an account's alias.
     */
    GetAlias(account: string): Promise<boolean | string>;
    /**
     * Get an account's description.
     */
    GetDescription(account: string): Promise<boolean | string>;
    /**
     * Get an account's cookie (DANGEROUS, USE A SECURE PASSWORD IF YOU'RE USING THIS). Requires `AllowGetCookie` setting to be set to `true`.
     */
    GetCookie(account: string): Promise<boolean | string>;
    /**
     * Gets the account names in account manager and returns a list separated by commas. Requires `AllowGetAccounts` setting to be set to `true`.
     */
    GetAccounts(): Promise<boolean | string>;
    /**
     * Get an account's CSRF Token.
     */
    GetCSRF(account: string): Promise<boolean | string>;
}
