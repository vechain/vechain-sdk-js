/**
 * All available Thor solo accounts for testing purposes.
 *
 * * Every account has 500000000 VET and at least 500000000 VTHO.
 * * Every account has a private key and an address. (both as hex string)
 */
const THOR_SOLO_ACCOUNTS: Array<{ privateKey: string; address: string }> = [
    /* ----------- NEW ACCOUNTS ----------- */
    /**
     * Each new account starts with
     * - VET: 500000000
     * - VTHO: at least 500000000 (VTHO is not constant due to generation when having VET)
     */
    {
        privateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
    },
    {
        privateKey:
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
    },
    {
        privateKey:
            '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
    },
    {
        privateKey:
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766',
        address: '0x88b2551c3ed42ca663796c10ce68c88a65f73fe2'
    },
    {
        privateKey:
            '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff',
        address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
    },
    {
        privateKey:
            'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
        address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
    },
    {
        privateKey:
            '0da72e8e26580d409d1837e23cc50c887358964152039e32af0c8a147c6b616d',
        address: '0xb717b660cd51109334bd10b2c168986055f58c1a'
    },
    {
        privateKey:
            '6e8ad4e4ffb888082d94975a58dc9a8179f8724ba22301cd8392ba5352af7e25',
        address: '0x62226ae029dabcf90f3cb66f091919d2687d5257'
    },
    {
        privateKey:
            '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
        address: '0x062f167a905c1484de7e75b88edc7439f82117de'
    },
    {
        privateKey:
            'adc81265b0909dec70235ec973b1758e45ce5ce7cfe92eb96b79cd0ef07bc6bc',
        address: '0x3e3d79163b08502a086213cd09660721740443d7'
    },
    /* ----------- THOR SOLO GENESIS ACCOUNTS ----------- */
    /**
     * Each Thor Solo genesis account has
     * - VET: 500000000
     * - VTHO: at least 1365000000 (VTHO is not constant due to generation when having VET)
     */
    {
        privateKey:
            '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36',
        address: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    },
    {
        privateKey:
            '7b067f53d350f1cf20ec13df416b7b73e88a1dc7331bc904b92108b1e76a08b1',
        address: '0x435933c8064b4ae76be665428e0307ef2ccfbd68'
    },
    {
        privateKey:
            'f4a1a17039216f535d42ec23732c79943ffb45a089fbb78a14daad0dae93e991',
        address: '0x0f872421dc479f3c11edd89512731814d0598db5'
    },
    {
        privateKey:
            '35b5cc144faca7d7f220fca7ad3420090861d5231d80eb23e1013426847371c4',
        address: '0xf370940abdbd2583bc80bfc19d19bc216c88ccf0'
    },
    {
        privateKey:
            '10c851d8d6c6ed9e6f625742063f292f4cf57c2dbeea8099fa3aca53ef90aef1',
        address: '0x99602e4bbc0503b8ff4432bb1857f916c3653b85'
    },
    {
        privateKey:
            '2dd2c5b5d65913214783a6bd5679d8c6ef29ca9f2e2eae98b4add061d0b85ea0',
        address: '0x61e7d0c2b25706be3485980f39a3a994a8207acf'
    },
    {
        privateKey:
            'e1b72a1761ae189c10ec3783dd124b902ffd8c6b93cd9ff443d5490ce70047ff',
        address: '0x361277d1b27504f36a3b33d3a52d1f8270331b8c'
    },
    {
        privateKey:
            '35cbc5ac0c3a2de0eb4f230ced958fd6a6c19ed36b5d2b1803a9f11978f96072',
        address: '0xd7f75a0a1287ab2916848909c8531a0ea9412800'
    },
    {
        privateKey:
            'b639c258292096306d2f60bc1a8da9bc434ad37f15cd44ee9a2526685f592220',
        address: '0xabef6032b9176c186f6bf984f548bda53349f70a'
    },
    {
        privateKey:
            '9d68178cdc934178cca0a0051f40ed46be153cf23cb1805b59cc612c0ad2bbe0',
        address: '0x865306084235bf804c8bba8a8d56890940ca8f0b'
    }
];

export { THOR_SOLO_ACCOUNTS };
