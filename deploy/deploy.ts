import { Address, Deployer } from "../web3webdeploy/types";
import {
  DeployDCIReserveSettings,
  deployDCIReserve,
} from "./internal/DCIReserve";
import {
  DeployDCIVestingManagerSettings,
  deployDCIVestingManager,
} from "./internal/DCIVestingManager";

export interface DCIDeploymentSettings {
  dciReserveSettings: DeployDCIReserveSettings;
  dciVestingManagerSettings: DeployDCIVestingManagerSettings;
  forceRedeploy?: boolean;
}

export interface DCIDeployment {
  dciReserve: Address;
  dciVestingManager: Address;
}

export async function deploy(
  deployer: Deployer,
  settings?: DCIDeploymentSettings
): Promise<DCIDeployment> {
  deployer.startContext("lib/vesting");
  await deployer.deploy({
    id: "DCIVestingContract",
    contract: "SingleBeneficiaryLinearERC20TransferVestingProxy",
  });
  // if (settings?.forceRedeploy !== undefined && !settings.forceRedeploy) {
  const existingDeployment = await deployer.loadDeployment({
    deploymentName: "latest.json",
  });
  if (existingDeployment !== undefined) {
    return existingDeployment;
  }
  //}

  const dciReserve = await deployDCIReserve(
    deployer,
    settings?.dciReserveSettings ?? {}
  );

  const dciVestingManager = await deployDCIVestingManager(
    deployer,
    settings?.dciVestingManagerSettings ?? {}
  );

  const deployment: DCIDeployment = {
    dciReserve: dciReserve,
    dciVestingManager: dciVestingManager,
  };
  await deployer.saveDeployment({
    deploymentName: "latest.json",
    deployment: deployment,
  });
  return deployment;
}
