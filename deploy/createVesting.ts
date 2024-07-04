import { Address, Deployer } from "../web3webdeploy/types";
import { OpenmeshAdminContract } from "../lib/openmesh-admin/export/OpenmeshAdmin";
import { DCIVestingManagerContract } from "../export/DCIVestingManager";

export async function deploy(deployer: Deployer): Promise<void> {
  const vestings: {
    amount: bigint;
    start: number;
    duration: number;
    beneficiary: Address;
  }[] = [
    {
      amount: deployer.viem.parseEther("100"),
      start: Math.round(Date.UTC(2024, 7 - 1, 1) / 1000),
      duration: 365 * 24 * 60 * 60,
      beneficiary: "0xaF7E68bCb2Fc7295492A00177f14F59B92814e70",
    },
  ];

  for (let i = 0; i < vestings.length; i++) {
    await deployer.execute({
      abi: [...OpenmeshAdminContract.abi],
      to: OpenmeshAdminContract.address,
      function: "performCall",
      args: [
        DCIVestingManagerContract.address,
        BigInt(0),
        deployer.viem.encodeFunctionData({
          abi: DCIVestingManagerContract.abi,
          functionName: "createVesting",
          args: [
            vestings[i].amount,
            BigInt(vestings[i].start),
            BigInt(vestings[i].duration),
            vestings[i].beneficiary,
          ],
        }),
      ],
    });
  }
}
