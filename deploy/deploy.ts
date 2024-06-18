import { Address, Deployer } from "../web3webdeploy/types";
import {
  DeployDCIReserveSettings,
  deployDCIReserve,
} from "./internal/DCIReserve";

export interface DCIDeploymentSettings {
  dciReserveSettings: DeployDCIReserveSettings;
  forceRedeploy?: boolean;
}

export interface DCIDeployment {
  dciReserve: Address;
}

export async function deploy(
  deployer: Deployer,
  settings?: DCIDeploymentSettings
): Promise<DCIDeployment> {
  if (settings?.forceRedeploy !== undefined && !settings.forceRedeploy) {
    const existingDeployment = await deployer.loadDeployment({
      deploymentName: "latest.json",
    });
    if (existingDeployment !== undefined) {
      return existingDeployment;
    }
  }

  const dciReserve = await deployDCIReserve(
    deployer,
    settings?.dciReserveSettings ?? {}
  );

  const deployment: DCIDeployment = {
    dciReserve: dciReserve,
  };
  await deployer.saveDeployment({
    deploymentName: "latest.json",
    deployment: deployment,
  });
  return deployment;
}
