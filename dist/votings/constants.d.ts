import { AddressLike, BaseContract, BigNumberish, BytesLike } from "ethers";
import { ChainId } from "../common";
import { Contract__factory } from "../contracts/named-contract";
import { TypedContractMethod } from "./types";
export declare const CREATOR = "0x1D0f1d0f1d0F1d0F1d0F1d0F1d0f1D0f1D0F1d0F";
export declare const CREATOR_ETH_BALANCE: bigint;
export declare const CREATOR_LDO_BALANCE: bigint;
export declare const VOTE_DURATION: number;
export declare const DEFAULT_GAS_LIMIT = 5000000;
type TypedContract<T> = BaseContract & T;
type LdoContract = TypedContract<{
    balanceOf: TypedContractMethod<[_owner: AddressLike], [bigint], "view">;
    transfer: TypedContractMethod<[_to: AddressLike, _amount: BigNumberish], [boolean], "nonpayable">;
}>;
type VotingContract = BaseContract & {
    vote: TypedContractMethod<[
        _voteId: BigNumberish,
        _supports: boolean,
        _executesIfDecided_deprecated: boolean
    ], [
        void
    ], "nonpayable">;
    newVote: TypedContractMethod<[
        _executionScript: BytesLike,
        _metadata: string,
        _castVote: boolean,
        _executesIfDecided_deprecated: boolean
    ], [
        bigint
    ], "nonpayable">;
    executeVote: TypedContractMethod<[_voteId: BigNumberish], [void], "nonpayable">;
};
type TokenManager = BaseContract & {
    forward: TypedContractMethod<[_evmScript: BytesLike], [void], "nonpayable">;
};
export declare function config(chainId: ChainId): {
    readonly ldo: {
        readonly impl: {
            readonly address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32" | "0x56340274fB5a72af1A3C6609061c451De7961Bd4";
            readonly factory: Contract__factory<LdoContract>;
        };
        readonly proxy: null;
    };
    readonly acl: {
        readonly impl: {
            readonly address: "0x9f3b9198911054B122fDb865f8A5Ac516201c339" | "0x74C81dd97338329367E5C52B1E3CBC5C757d9AEb";
            readonly factory: Contract__factory<BaseContract>;
        };
        readonly proxy: {
            readonly address: "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb" | "0xb3CF58412a00282934D3C3E73F49347567516E98";
            readonly factory: Contract__factory<BaseContract>;
        };
    };
    readonly kernel: {
        readonly impl: {
            readonly address: "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425" | "0xcC272fA3bFa4AE2043320e2d56Cf5AE439c62C3d";
            readonly factory: Contract__factory<BaseContract>;
        };
        readonly proxy: {
            readonly address: "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc" | "0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A";
            readonly factory: Contract__factory<BaseContract>;
        };
    };
    readonly voting: {
        readonly impl: {
            readonly address: "0x2e59A20f205bB85a89C53f1936454680651E618e" | "0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db";
            readonly factory: Contract__factory<VotingContract>;
        };
        readonly proxy: null;
    };
    readonly evmScriptRegistry: {
        readonly impl: {
            readonly address: "0x" | "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb";
            readonly factory: Contract__factory<BaseContract>;
        };
        readonly proxy: {
            readonly address: "0x" | "0x853cc0D5917f49B57B8e9F89e491F5E18919093A";
            readonly factory: Contract__factory<BaseContract>;
        };
    };
    readonly callsScript: {
        readonly impl: {
            readonly address: "0x" | "0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054";
            readonly factory: Contract__factory<BaseContract>;
        };
        readonly proxy: null;
    };
    readonly tokenManager: {
        readonly impl: {
            readonly address: "0xf73a1260d222f447210581DDf212D915c09a3249" | "0xAb304946E8Ed172037aC9aBF9da58a6a7C8d443B";
            readonly factory: Contract__factory<TokenManager>;
        };
        readonly proxy: null;
    };
};
export declare const CONTRACTS: {
    "1": import("../contracts/contracts").Instance<{
        readonly ldo: {
            readonly impl: {
                readonly address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32" | "0x56340274fB5a72af1A3C6609061c451De7961Bd4";
                readonly factory: Contract__factory<LdoContract>;
            };
            readonly proxy: null;
        };
        readonly acl: {
            readonly impl: {
                readonly address: "0x9f3b9198911054B122fDb865f8A5Ac516201c339" | "0x74C81dd97338329367E5C52B1E3CBC5C757d9AEb";
                readonly factory: Contract__factory<BaseContract>;
            };
            readonly proxy: {
                readonly address: "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb" | "0xb3CF58412a00282934D3C3E73F49347567516E98";
                readonly factory: Contract__factory<BaseContract>;
            };
        };
        readonly kernel: {
            readonly impl: {
                readonly address: "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425" | "0xcC272fA3bFa4AE2043320e2d56Cf5AE439c62C3d";
                readonly factory: Contract__factory<BaseContract>;
            };
            readonly proxy: {
                readonly address: "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc" | "0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A";
                readonly factory: Contract__factory<BaseContract>;
            };
        };
        readonly voting: {
            readonly impl: {
                readonly address: "0x2e59A20f205bB85a89C53f1936454680651E618e" | "0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db";
                readonly factory: Contract__factory<VotingContract>;
            };
            readonly proxy: null;
        };
        readonly evmScriptRegistry: {
            readonly impl: {
                readonly address: "0x" | "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb";
                readonly factory: Contract__factory<BaseContract>;
            };
            readonly proxy: {
                readonly address: "0x" | "0x853cc0D5917f49B57B8e9F89e491F5E18919093A";
                readonly factory: Contract__factory<BaseContract>;
            };
        };
        readonly callsScript: {
            readonly impl: {
                readonly address: "0x" | "0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054";
                readonly factory: Contract__factory<BaseContract>;
            };
            readonly proxy: null;
        };
        readonly tokenManager: {
            readonly impl: {
                readonly address: "0xf73a1260d222f447210581DDf212D915c09a3249" | "0xAb304946E8Ed172037aC9aBF9da58a6a7C8d443B";
                readonly factory: Contract__factory<TokenManager>;
            };
            readonly proxy: null;
        };
    }>;
};
export declare const ADDRESSES: {
    readonly "1": {
        readonly ldo: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32";
        readonly aclProxy: "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb";
        readonly aclImpl: "0x9f3b9198911054B122fDb865f8A5Ac516201c339";
        readonly voting: "0x2e59A20f205bB85a89C53f1936454680651E618e";
        readonly kernelProxy: "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc";
        readonly kernelImpl: "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425";
        readonly lidoLocator: "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb";
        readonly tokenManager: "0xf73a1260d222f447210581DDf212D915c09a3249";
        readonly callsScript: "0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054";
        readonly evmScriptRegistryProxy: "0x853cc0D5917f49B57B8e9F89e491F5E18919093A";
        readonly evmScriptRegistryImpl: "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb";
    };
    readonly "5": {
        readonly ldo: "0x56340274fB5a72af1A3C6609061c451De7961Bd4";
        readonly aclProxy: "0xb3CF58412a00282934D3C3E73F49347567516E98";
        readonly aclImpl: "0x74C81dd97338329367E5C52B1E3CBC5C757d9AEb";
        readonly callsScript: "0x";
        readonly evmScriptRegistryProxy: "0x";
        readonly evmScriptRegistryImpl: "0x";
        readonly voting: "0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db";
        readonly kernelProxy: "0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A";
        readonly kernelImpl: "0xcC272fA3bFa4AE2043320e2d56Cf5AE439c62C3d";
        readonly lidoLocator: "0x1eDf09b5023DC86737b59dE68a8130De878984f5";
        readonly tokenManager: "0xAb304946E8Ed172037aC9aBF9da58a6a7C8d443B";
    };
};
export declare const LDO_WHALES: {
    readonly 1: "0x820fb25352BB0c5E03E07AFc1d86252fFD2F0A18";
    readonly 5: "0x319d5370715D24A1225817009BB23e676aE741D3";
};
export declare function getWhale(chainId: ChainId): "0x820fb25352BB0c5E03E07AFc1d86252fFD2F0A18" | "0x319d5370715D24A1225817009BB23e676aE741D3";
export {};
