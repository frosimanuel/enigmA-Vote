import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem, run } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Group, Identity, generateProof } from "@semaphore-protocol/core";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const semaphoreAddress = "0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f";
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount] = await viem.getWalletClients();

  // Deploy Ballot contract
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map(prop => toHex(prop, { size: 32 })),
    semaphoreAddress,
  ]);

  return { publicClient, deployer, otherAccount, ballotContract };
}

describe("Ballot", async () => {
  let deployer, otherAccount, ballotContract, publicClient;

  before(async () => {
    // Deploy the contract once for all tests
    ({ publicClient, deployer, otherAccount, ballotContract } = await deployContract());
  });

  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposalsFromContract = (await ballotContract.read.proposals([BigInt(i)])) as Array<any>;
        const proposal = hexToString(proposalsFromContract[0], { size: 32 });
        expect(PROPOSALS[i]).to.equal(proposal);
      }
    });

    it("has zero votes for all proposals", async () => {
      for (let i = 0; i < PROPOSALS.length; i++) {
        const proposal = (await ballotContract.read.proposals([BigInt(i)])) as Array<bigint>;
        expect(proposal[1]).to.eq(0n);
      }
    });
  });

  describe("when the voter joins the ballot to vote", async () => {
    it("should be in the voters list with joined status", async () => {
      const user = new Identity();
      const tx = await ballotContract.write.joinBallot([user.commitment]);
      const receipt = await publicClient.getTransactionReceipt({ hash: tx });
      expect(receipt.status).to.equal("success");

      const voter = (await ballotContract.read.voters([deployer.account.address])) as Array<any>;
      const voterStatus = voter[0];
      expect(voterStatus).to.eq(true);
    });
  });

  describe("when a valid voter interacts with the vote function in the contract", async () => {
    it("should register the vote", async () => {
      const user = new Identity();
      let tx = await ballotContract.write.joinBallot([user.commitment]);
      let receipt = await publicClient.getTransactionReceipt({ hash: tx });
      expect(receipt.status).to.equal("success");

      const group = new Group([user.commitment]);
      const groupId = (await ballotContract.read.groupId()) as number;
      const proposalId = 0;
      const proof = await generateProof(user, group, proposalId, groupId);

      tx = await ballotContract.write.vote([0n, proof]);
      receipt = await publicClient.getTransactionReceipt({ hash: tx });
      expect(receipt.status).to.equal("success");

      const voteCount = (await ballotContract.read.proposals([0n])) as Array<any>;
      expect(voteCount[1]).to.eq(1n);
    });
  });

  describe("when an user that did not joined the ballot try to vote", async () => {
    it("it should revert", async () => {
      const contractAsOtherAccount = await viem.getContractAt("Ballot", ballotContract.address, {
        client: { wallet: otherAccount },
      });

      const user = new Identity();
      const group = new Group([user.commitment]);
      const groupId = (await ballotContract.read.groupId()) as number;
      const proposalId = 0;
      const proof = await generateProof(user, group, proposalId, groupId);

      await expect(contractAsOtherAccount.write.vote([1n, proof])).to.be.rejectedWith(
        "Did not joined the voting group",
      );
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    it("should return 0", async () => {
      const winningProposal = await ballotContract.read.winningProposal();
      expect(winningProposal).to.eq(0n);
    });
  });
});
