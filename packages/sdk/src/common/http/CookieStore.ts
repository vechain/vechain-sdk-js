/**
 * Simple cookie store implementation
 */
class CookieStore {
    private readonly cookies = new Map<string, string>();

    /**
     * Stores cookies from a response
     */
    storeFromResponse(response: Response): void {
        if (response?.headers == null) return;
        const setCookieHeader = response.headers.get('set-cookie');
        if (setCookieHeader === null) return;

        // Parse Set-Cookie header
        const cookies = setCookieHeader
            .split(',')
            .map((cookie) => cookie.trim());
        for (const cookie of cookies) {
            const [nameValue] = cookie.split(';');
            if (nameValue !== undefined) {
                const [name, value] = nameValue.split('=');
                if (name !== undefined && value !== undefined) {
                    this.cookies.set(name.trim(), value.trim());
                }
            }
        }
    }

    /**
     * Gets all stored cookies as a string for Cookie header
     */
    getCookieHeader(): string {
        return Array.from(this.cookies.entries())
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
    }

    /**
     * Clears all stored cookies
     */
    clear(): void {
        this.cookies.clear();
    }

    /**
     * Gets a specific cookie by name
     */
    get(name: string): string | undefined {
        return this.cookies.get(name);
    }

    /**
     * Sets a specific cookie
     */
    set(name: string, value: string): void {
        this.cookies.set(name, value);
    }
}

export { CookieStore };
