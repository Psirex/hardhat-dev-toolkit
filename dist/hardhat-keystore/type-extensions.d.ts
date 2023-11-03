import "hardhat/types/config";
import "hardhat/types/runtime";
import { NamedKeystoreService } from "./keystores";
interface KeystoreConfig {
    path?: string;
}
declare module "hardhat/types/config" {
    interface ProjectPathsUserConfig {
        newPath?: string;
    }
    interface ProjectPathsConfig {
        newPath: string;
    }
    interface HardhatUserConfig {
        keystore: KeystoreConfig;
    }
    interface HardhatConfig {
        keystore: Required<KeystoreConfig>;
    }
}
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        keystore: NamedKeystoreService;
    }
}
export {};
