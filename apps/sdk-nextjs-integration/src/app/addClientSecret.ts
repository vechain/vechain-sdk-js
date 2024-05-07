import { sha256 } from '@vechain/sdk-core';
import { randomBytes } from 'crypto';

export function getClientSecret(): string {
    const clientSecret = localStorage.getItem('clientSecret');
    if (clientSecret != null) {
        return clientSecret;
    } else {
        const newClientSecret = sha256(randomBytes(32), 'hex');

        localStorage.setItem('clientSecret', newClientSecret);
        return newClientSecret;
    }
}
