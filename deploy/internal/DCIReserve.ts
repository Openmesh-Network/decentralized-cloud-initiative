import { Address, DeployInfo, Deployer } from "../../web3webdeploy/types";

export interface DeployDCIReserveSettings
  extends Omit<DeployInfo, "contract" | "args"> {}

export async function deployDCIReserve(
  deployer: Deployer,
  settings: DeployDCIReserveSettings
): Promise<Address> {
  return await deployer
    .deploy({
      id: "DCIReserve",
      contract: "DCIReserve",
      args: [BigInt(6_500_000)],
      ...settings,
    })
    .then((deployment) => deployment.address);
}
