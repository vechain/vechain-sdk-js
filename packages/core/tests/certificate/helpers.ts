import { type Certificate } from '../../src/certificate/certificate';
import { privKey, cert, cert2 } from './fixture';

export class CertificateTestHelper {
    getPrivKey(): Buffer {
        return privKey;
    }

    getCert(): Certificate {
        return { ...cert };
    }

    getCert2(): Certificate {
        return { ...cert2 };
    }
}
