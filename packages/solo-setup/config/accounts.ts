/**
 * Seeded Thor solo accounts for testing purposes.
 * Every account has 10000 VET and 10000 VTHO.
 */
const THOR_SOLO_ACCOUNTS_TO_SEED: Array<{
    privateKey: string;
    address: string;
}> = [
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
    {
        privateKey:
            'deffcf96479a5a96da44dc2a7a8bac76bfa8419fe4c04a0ec451b8b3cd59d1f1',
        address: '0x982E6C08c767ca7dD6216738E6A25413c341f976'
    },
    {
        privateKey:
            'c28b624ca34d79faea128d75c5245753a3db86de6c25f13a01bf5219ced7e4ce',
        address: '0x74284087E9b0953b453FDced661ac37F51E53Fe2'
    },
    {
        privateKey:
            '26e677ecb20d46180826c59ef89f0ae9911977758a6a2c56282d92250258bdad',
        address: '0x0DcC42dfEd29218713aF324241D848a7520dbc21'
    },
    {
        privateKey:
            '1685223dd6d6a176d79ee4e4e7aa135f34200a370ad5406dbecb7f00c3e0d8ca',
        address: '0x17906B53a9b987bFf4f7237903B265Cb1AAcb730'
    },
    {
        privateKey:
            '2c25e6396d5a08934da4b5f3676bdab972fae0f4f5cd280b005784bffe112a2d',
        address: '0xd95aEf7F16225735F2828bbC66E94FAcDF2497A6'
    },
    {
        privateKey:
            '5792faa53744041eba7cb8b32a46873fdcd1d8ba539be1a26be35a42ba884737',
        address: '0x60b406d7186c497D6a5cE31EdC478343878F754e'
    },
    {
        privateKey:
            '8b6a1b73c6b16c18a5eb1b46d4d0d4ba814238eee816ae62f35773b84b412353',
        address: '0xFE3B5E9b0A1f138ba5cD8eC3E680377b87D9EDec'
    },
    {
        privateKey:
            'f62f0d5000e6db546bc6211d9d48206d5b34b01a2a24d2220767eead0d1ff9dd',
        address: '0xa246E66bb325DD2A44A0e91ecF666e09b71279fB'
    },
    {
        privateKey:
            'bab4f3336a77eec9fdf7376364064fee73e09d41476822f643e7588bdf7c630b',
        address: '0x31C547C920015D8beE16E268bB68544f504078B9'
    },
    {
        privateKey:
            '30838bf61ff83e1e46b1a03b513891dc7a952337e0dd4f21e0dfb476a9a3ecf4',
        address: '0x5b4890580888abd2f86e5edBA84Bbda8f3Dd059D'
    },
    {
        privateKey:
            '4e7e8fe56a58519d11fb6715bda21e03625cd3681a30b8a794e8e903c9f1928d',
        address: '0x003BF8BA29D56b12eAbf49a2D4d0c53772192cbC'
    },
    {
        privateKey:
            '9e0377258219da33780f7bcaaccba0265cafbfd41ac80d2fba464e22a6dae89d',
        address: '0x8d9F4AAc301e72e42dFa2cBd7FF5E7aB37307B47'
    },
    {
        privateKey:
            'faa67ba07113618be1fddcb7e140dbfe3abb6c91dc78573b5e3d145f0017f827',
        address: '0xDA1D8cDc054f69c13f928F7D91d19B3Ab58bDD77'
    },
    {
        privateKey:
            '2247de7b0f86ab0e4ca75bf1523d3d28db65a14a5ec925db4830174f2ddc5454',
        address: '0x1e0E3249DED9B40F32b845f882D5770d1d82BA88'
    },
    {
        privateKey:
            '773b068cce7d1fa773e67f4cb4b850abe64902ff4bb62bbf6999eded54416ce4',
        address: '0x5D37A25d68d47Ba3CC2AA39121b656c264089090'
    },
    {
        privateKey:
            '7fbb40478385547e747a5654e791b592c90b17acb0bf4ecf9e60d496c84b7ed1',
        address: '0xDDBa9D735F6f205eF9F4aaf043F03bc90F3F3f30'
    },
    {
        privateKey:
            '461d5a5ac88f635001a030968d751a199d3f1a786f54f6712e20087fe783b0aa',
        address: '0x0D6925144803b331e09d2d60b2D2d670438D9977'
    },
    {
        privateKey:
            'd12574629f65259c99837b27432df45c85c8c9c9c0d5111b79766cbe9b523507',
        address: '0x77d06Fb005252Ff67F54623FcE721c88503c21a1'
    },
    {
        privateKey:
            '605f80ed94fe3ae1261fbda6eb3a941367675de4980040e421abb316806de181',
        address: '0x5804B0609fceDcaA9dE460B35315745d15eAC627'
    },
    {
        privateKey:
            '62183dac319418f40e47dec7b60f104d0d6a9e248860b005e8b6d36cf9e8f11a',
        address: '0x9E4E0efb170070e35A6b76b683aEE91dd77805B3'
    }
];

// Default genesis accounts for the Thor Solo
const THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS: Array<{
    privateKey: string;
    address: string;
}> = [
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
            '9d68178cdc934178cca0a0fd1f40ed46be153cf23cb1805b59cc612c0ad2bbe0',
        address: '0x865306084235bf804c8bba8a8d56890940ca8f0b'
    },
    {
        privateKey:
            'aa3c12b75e8c7d992040de6ff97a09559cf7de2bc455ea07010b20adcb0fec62',
        address: '0x89D5C412c08679a284b149D35228a83b274a8486'
    },
    {
        privateKey:
            'a83bb5521dd7a5f4afaec3a1a38bb1187baf20fec29966849b1a7d54acd41c5f',
        address: '0x45bB89198d5023240b34D482176c982Ba0985D80'
    },
    {
        privateKey:
            '599969b8800f2ebf29dfdbda9289e99b09d4dfa6ee500e5c711b215792016ed5',
        address: '0x3710fF9FF4C7fb263c39Ed96D788151Cf88F987C'
    },
    {
        privateKey:
            '53da9696c9945d7718e1e3c534be61d9975acf01cad92b2e47364c419a6626bb',
        address: '0x426d9F15ECbb59be81999D1DC06880cbFa02bda9'
    },
    {
        privateKey:
            '2ac2ed64c98e5ffddad1d7fa82e19c99155b2a9789dc050f4ebf5458ddf6b9a6',
        address: '0x41055989aB587b9aCBDB7Ac81577e0249144Bfa0'
    },
    {
        privateKey:
            '357739d702d6f1cf8dbb276105f068165429776498fad4bb7348d56746f7e48e',
        address: '0x5E04836DF99FA2D63992e01Ce7F0d702dFe63Dc3'
    },
    {
        privateKey:
            '28eb40bad6953dd405d63af8896c1101b522bcab5d7817b24e6cfb61ba7a4609',
        address: '0xa996b54e88333F7D6252C171984CCCB3Cf730494'
    },
    {
        privateKey:
            '30b9fd2a8e7cc5bc8755afb5c3bbb5146ebef7a1120ded1fc20fa46509beebde',
        address: '0x3A3bC8b8dA5049003A3a3a51138c0DA34B5471ba'
    },
    {
        privateKey:
            '74fc230d4f716cfc1412db39789c6fe9dc09d4c4af89049c81c8f19f11a1637f',
        address: '0x4d7Edb29bfb3a64eAD68B1AeEB21Ef9eff7af8F0'
    },
    {
        privateKey:
            '784ac3eaebb120ce4833d8c6b16c996d2500c2a13db9bf435a8ac22923039dde',
        address: '0xFdC39bA5126bceaA0B11A0a4D8Dfd18C1fbD8dfA'
    },
    {
        privateKey:
            '684c87e0be4b2bad262391a99f0be2865e4b470816d33344301fed4c1e9211f9',
        address: '0x6C310F58e9B6Efc43392705FdBBbed1d691204eF'
    },
    {
        privateKey:
            '29b78acc9b5b54ab35fc0b39147ebe180ae9c941524b6a5b0a2249d12344b827',
        address: '0xCfCaDaF427d9e7112220f9C180C777A1C0E93012'
    },
    {
        privateKey:
            '1002feaf1a3087630daa0c6dec4953c521f0ddc1bccd45826a8f6aa469ffb9ea',
        address: '0xB4E3b2bD715b1529C76c79f827B6726D969cD895'
    },
    {
        privateKey:
            'd56a1d389c42c74ba47636cbd7aad031d3f9e115c7067f464b62ae37e319263e',
        address: '0x62028705f5775e2B0c8c5347a6861493972b0CDc'
    },
    {
        privateKey:
            'c8165b45dad519ecf2e462e10fe6ab52f49fcd435a07da4dcb25e8e5d9429a5d',
        address: '0x2AE21d812Af6B8434A7484A6C8092c273e2920a5'
    },
    {
        privateKey:
            '95d40aac1986bbc44c424db2be41a1f28ca1550344a55f7bd8dae257f1fb9340',
        address: '0xE57A13a41756106F03dc9d80f255E9B8E4306997'
    },
    {
        privateKey:
            '40b2eead54cfc624679a3ff5b196e4016b9a4942b67844fc041c1029e12626e1',
        address: '0x59e96c968b2daB63Add6711a4d58d7B7219E0779'
    },
    {
        privateKey:
            'b93b6576e5514e36394ed07b8e6ada752c63b21a2a91f98c2ea2a9c95a24da97',
        address: '0x6F7C53286e6303bbafC2c3EF3Aa9302E938A264b'
    },
    {
        privateKey:
            'e17d7640ecd4abb1565f114a4c83e74871736c81bb486f4a9ddd943a8a69e376',
        address: '0x9B865BB9CB726209cf145F2195da4BEF54D200d1'
    },
    {
        privateKey:
            '76227c448df1ea457fa23c697a72ad90cce96a1160f853aab729747b1b0614a2',
        address: '0xc0724fC1F8B0414d6D55C0EE9fbeA199b9056AD9'
    }
];

/**
 * Interface representing a Thor solo account
 */
interface ThorSoloAccount {
    privateKey: string;
    address: string;
}

/**
 * Combined array of all available accounts
 */
const ALL_ACCOUNTS = [
    ...THOR_SOLO_ACCOUNTS_TO_SEED,
    ...THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS
];

export {
    THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS,
    THOR_SOLO_ACCOUNTS_TO_SEED,
    ALL_ACCOUNTS,
    type ThorSoloAccount
};
