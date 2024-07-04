import { Address, DeployInfo, Deployer } from "../../web3webdeploy/types";
import { sOPENContract } from "../../lib/open-token/export/sOPEN";
import { OpenmeshAdminContract } from "../../lib/openmesh-admin/export/OpenmeshAdmin";

export interface DeployDCIVestingManagerSettings
  extends Omit<DeployInfo, "contract" | "args"> {}

export async function deployDCIVestingManager(
  deployer: Deployer,
  settings: DeployDCIVestingManagerSettings
): Promise<Address> {
  deployer.startContext("lib/vesting");
  const dciVestingManager = await deployer
    .deploy({
      id: "DCIVestingManager",
      contract: "SingleBeneficiaryLinearERC20TransferVestingManager",
      args: [sOPENContract.address, OpenmeshAdminContract.address],
      salt: "DCI",
      ...settings,
    })
    .then((deployment) => deployment.address);
  deployer.finishContext();
  await deployer.execute({
    id: "EnablesOPENMinting",
    abi: [...OpenmeshAdminContract.abi],
    to: OpenmeshAdminContract.address,
    function: "performCall",
    args: [
      sOPENContract.address,
      BigInt(0),
      deployer.viem.encodeFunctionData({
        abi: sOPENContract.abi,
        functionName: "grantRole",
        args: [
          deployer.viem.keccak256(deployer.viem.toBytes("MINT")),
          dciVestingManager,
        ],
      }),
    ],
  });

  return dciVestingManager;
}
