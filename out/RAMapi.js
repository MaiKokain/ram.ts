"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAM = void 0;
const needle = require("needle");
class RAM {
    /**
     * READ [Roblox Alt Manager Documentation](https://ic3w0lf22.gitbook.io/roblox-account-manager/)
     */
    constructor(opt) {
        this.accounts = [];
        if (opt.password?.length < 6)
            throw new Error("Password must be over 6 characters.");
        this.password = opt.password;
        this.url = `http://localhost:${opt.port ?? "7963"}`;
    }
    async GET(method, account, any) {
        let url = `${this.url}/${method}?Account=${account}`;
        any?.map((v, i, a) => {
            if (v)
                url = `${url}&${v}`;
        });
        if (this.password) {
            url = `${url}&Password=${this.password}`;
        }
        const req = await needle('get', url);
        if (req.statusCode != 200)
            return false;
        return req.body;
    }
    async POST(method, account, body, any) {
        let url = `${this.url}/${method}?Account=${account}`;
        any?.map((v, i, a) => {
            if (v)
                url = `${url}&${v}`;
        });
        if (this.password) {
            url = `${url}&Password=${this.password}`;
        }
        const req = await needle('post', url, body);
        if (req.statusCode != 200)
            return false;
        return req.body;
    }
    async CheckAccount(username) {
        if (this.accounts.includes(username))
            return true;
        const isValid = await this.GET("Test", username);
        if (!!isValid || ["Invalid Account", "Empty Account"].some(v => v == isValid))
            throw new Error(`Given account is invalid, Are you sure the name is correct?`);
        this.accounts.push(username);
        return true;
    }
    /**
     * Add a new account to cache data. (not saved for now)
     */
    async new(account) {
        return await this.CheckAccount(account);
    }
    /**
     * Launches an account from account manager using the given PlaceId. Requires AllowLaunchAccount setting to be set to `true`.
     * Use "placeid" as userid if you want to follow someone.
     */
    async LaunchAccount(account, placeid, jobid, followuser, joinvip) {
        return await this.GET("LaunchAccount", account, [`PlaceID=${placeid}`, (jobid && `JobId=${jobid}`), (followuser && `FollowUser=true`), (joinvip && `JoinVIP=true`)]);
    }
    /**
     * Sets the next server ROBLOX matchmaking will put you in.
     */
    async SetServer(account, placeid, jobid) {
        return await this.GET("SetService", account, [`PlaceID=${placeid}`, `JobID=${jobid}`]);
    }
    /**
     * Sets the next server roblox matchmaking will put you in. Roblox Account Manager will choose the next smallest server depending on what servers are loaded.
     */
    async SetRecommendedServer(account, placeid) {
        return await this.GET("SetServer", account, [`PlaceID=${placeid}`]);
    }
    /**
     * Blocks a user by their UserId.
     */
    async BlockUser(account, userid) {
        return await this.GET("BlockUser", account, [`UserID=${userid}`]);
    }
    /**
     * Unblocks a user by their userid.
     */
    async UnblockUser(account, userid) {
        return await this.GET("UnblockUser", account, [`userid=${userid}`]);
    }
    /**
     * Unblocks everyone that is blocked.
     */
    async UnblockEveryone(account) {
        return await this.GET("UnblockEveryone", account);
    }
    /**
     * Get a specific field of an account.
     */
    async GetField(account, field) {
        return await this.GET('GetField', account, [`Field=${field}`]);
    }
    /**
     * Set an account's field.
     */
    async SetField(account, field, value) {
        return await this.GET("SetField", account, [`Field=${field}`, `Value=${value}`]);
    }
    /**
     * Remove an account's field.
     */
    async RemoveField(account, field) {
        return await this.GET("RemoveField", account, [`Field=${field}`]);
    }
    /**
     * Set an account's alias.
     */
    async SetAlias(account, alias) {
        return await this.GET("SetAlias", account, [`alias=${alias}`]);
    }
    /**
     * Set an account's description.
     */
    async SetDescription(account, description) {
        return await this.POST("SetDescription", account, description);
    }
    /**
     * Append something to an account's description.
     */
    async AppendDescription(account, description) {
        return await this.POST("AppendDescription", account, description);
    }
    /**
     * Get an account's alias.
     */
    async GetAlias(account) {
        return await this.GET("GetAlias", account);
    }
    /**
     * Get an account's description.
     */
    async GetDescription(account) {
        return await this.GET("GetDescription", account);
    }
    /**
     * Get an account's cookie (DANGEROUS, USE A SECURE PASSWORD IF YOU'RE USING THIS). Requires `AllowGetCookie` setting to be set to `true`.
     */
    async GetCookie(account) {
        return await this.GET("GetCookie", account);
    }
    /**
     * Gets the account names in account manager and returns a list separated by commas. Requires `AllowGetAccounts` setting to be set to `true`.
     */
    async GetAccounts() {
        const req = await needle('get', `${this.url}/GetAccounts&Password=${this.password}`);
        if (req.statusCode != 200)
            return false;
        return req.body;
    }
    /**
     * Get an account's CSRF Token.
     */
    async GetCSRF(account) {
        return await this.GET("GetCSRFToken", account);
    }
}
exports.RAM = RAM;
