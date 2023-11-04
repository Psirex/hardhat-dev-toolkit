export interface EtherscanChainConfig {
    network: string;
    chainId: number;
    urls: {
        apiURL: string;
        browserURL: string;
    };
}
export declare const BUILTIN_ETHERSCAN_CHAINS: readonly [{
    readonly network: "mainnet";
    readonly chainId: 1;
    readonly urls: {
        readonly apiURL: "https://api.etherscan.io/api";
        readonly browserURL: "https://etherscan.io";
    };
}, {
    readonly network: "goerli";
    readonly chainId: 5;
    readonly urls: {
        readonly apiURL: "https://api-goerli.etherscan.io/api";
        readonly browserURL: "https://goerli.etherscan.io";
    };
}, {
    readonly network: "optimisticEthereum";
    readonly chainId: 10;
    readonly urls: {
        readonly apiURL: "https://api-optimistic.etherscan.io/api";
        readonly browserURL: "https://optimistic.etherscan.io/";
    };
}, {
    readonly network: "bsc";
    readonly chainId: 56;
    readonly urls: {
        readonly apiURL: "https://api.bscscan.com/api";
        readonly browserURL: "https://bscscan.com";
    };
}, {
    readonly network: "sokol";
    readonly chainId: 77;
    readonly urls: {
        readonly apiURL: "https://blockscout.com/poa/sokol/api";
        readonly browserURL: "https://blockscout.com/poa/sokol";
    };
}, {
    readonly network: "bscTestnet";
    readonly chainId: 97;
    readonly urls: {
        readonly apiURL: "https://api-testnet.bscscan.com/api";
        readonly browserURL: "https://testnet.bscscan.com";
    };
}, {
    readonly network: "xdai";
    readonly chainId: 100;
    readonly urls: {
        readonly apiURL: "https://api.gnosisscan.io/api";
        readonly browserURL: "https://gnosisscan.io";
    };
}, {
    readonly network: "gnosis";
    readonly chainId: 100;
    readonly urls: {
        readonly apiURL: "https://api.gnosisscan.io/api";
        readonly browserURL: "https://gnosisscan.io";
    };
}, {
    readonly network: "heco";
    readonly chainId: 128;
    readonly urls: {
        readonly apiURL: "https://api.hecoinfo.com/api";
        readonly browserURL: "https://hecoinfo.com";
    };
}, {
    readonly network: "polygon";
    readonly chainId: 137;
    readonly urls: {
        readonly apiURL: "https://api.polygonscan.com/api";
        readonly browserURL: "https://polygonscan.com";
    };
}, {
    readonly network: "opera";
    readonly chainId: 250;
    readonly urls: {
        readonly apiURL: "https://api.ftmscan.com/api";
        readonly browserURL: "https://ftmscan.com";
    };
}, {
    readonly network: "hecoTestnet";
    readonly chainId: 256;
    readonly urls: {
        readonly apiURL: "https://api-testnet.hecoinfo.com/api";
        readonly browserURL: "https://testnet.hecoinfo.com";
    };
}, {
    readonly network: "optimisticGoerli";
    readonly chainId: 420;
    readonly urls: {
        readonly apiURL: "https://api-goerli-optimism.etherscan.io/api";
        readonly browserURL: "https://goerli-optimism.etherscan.io/";
    };
}, {
    readonly network: "moonbeam";
    readonly chainId: 1284;
    readonly urls: {
        readonly apiURL: "https://api-moonbeam.moonscan.io/api";
        readonly browserURL: "https://moonbeam.moonscan.io";
    };
}, {
    readonly network: "moonriver";
    readonly chainId: 1285;
    readonly urls: {
        readonly apiURL: "https://api-moonriver.moonscan.io/api";
        readonly browserURL: "https://moonriver.moonscan.io";
    };
}, {
    readonly network: "moonbaseAlpha";
    readonly chainId: 1287;
    readonly urls: {
        readonly apiURL: "https://api-moonbase.moonscan.io/api";
        readonly browserURL: "https://moonbase.moonscan.io/";
    };
}, {
    readonly network: "ftmTestnet";
    readonly chainId: 4002;
    readonly urls: {
        readonly apiURL: "https://api-testnet.ftmscan.com/api";
        readonly browserURL: "https://testnet.ftmscan.com";
    };
}, {
    readonly network: "base";
    readonly chainId: 8453;
    readonly urls: {
        readonly apiURL: "https://api.basescan.org/api";
        readonly browserURL: "https://basescan.org/";
    };
}, {
    readonly network: "chiado";
    readonly chainId: 10200;
    readonly urls: {
        readonly apiURL: "https://blockscout.chiadochain.net/api";
        readonly browserURL: "https://blockscout.chiadochain.net";
    };
}, {
    readonly network: "arbitrumOne";
    readonly chainId: 42161;
    readonly urls: {
        readonly apiURL: "https://api.arbiscan.io/api";
        readonly browserURL: "https://arbiscan.io/";
    };
}, {
    readonly network: "avalancheFujiTestnet";
    readonly chainId: 43113;
    readonly urls: {
        readonly apiURL: "https://api-testnet.snowtrace.io/api";
        readonly browserURL: "https://testnet.snowtrace.io/";
    };
}, {
    readonly network: "avalanche";
    readonly chainId: 43114;
    readonly urls: {
        readonly apiURL: "https://api.snowtrace.io/api";
        readonly browserURL: "https://snowtrace.io/";
    };
}, {
    readonly network: "polygonMumbai";
    readonly chainId: 80001;
    readonly urls: {
        readonly apiURL: "https://api-testnet.polygonscan.com/api";
        readonly browserURL: "https://mumbai.polygonscan.com/";
    };
}, {
    readonly network: "baseGoerli";
    readonly chainId: 84531;
    readonly urls: {
        readonly apiURL: "https://api-goerli.basescan.org/api";
        readonly browserURL: "https://goerli.basescan.org/";
    };
}, {
    readonly network: "arbitrumTestnet";
    readonly chainId: 421611;
    readonly urls: {
        readonly apiURL: "https://api-testnet.arbiscan.io/api";
        readonly browserURL: "https://testnet.arbiscan.io/";
    };
}, {
    readonly network: "arbitrumGoerli";
    readonly chainId: 421613;
    readonly urls: {
        readonly apiURL: "https://api-goerli.arbiscan.io/api";
        readonly browserURL: "https://goerli.arbiscan.io/";
    };
}, {
    readonly network: "sepolia";
    readonly chainId: 11155111;
    readonly urls: {
        readonly apiURL: "https://api-sepolia.etherscan.io/api";
        readonly browserURL: "https://sepolia.etherscan.io";
    };
}, {
    readonly network: "aurora";
    readonly chainId: 1313161554;
    readonly urls: {
        readonly apiURL: "https://explorer.mainnet.aurora.dev/api";
        readonly browserURL: "https://explorer.mainnet.aurora.dev";
    };
}, {
    readonly network: "auroraTestnet";
    readonly chainId: 1313161555;
    readonly urls: {
        readonly apiURL: "https://explorer.testnet.aurora.dev/api";
        readonly browserURL: "https://explorer.testnet.aurora.dev";
    };
}, {
    readonly network: "harmony";
    readonly chainId: 1666600000;
    readonly urls: {
        readonly apiURL: "https://ctrver.t.hmny.io/verify";
        readonly browserURL: "https://explorer.harmony.one";
    };
}, {
    readonly network: "harmonyTest";
    readonly chainId: 1666700000;
    readonly urls: {
        readonly apiURL: "https://ctrver.t.hmny.io/verify?network=testnet";
        readonly browserURL: "https://explorer.pops.one";
    };
}];
