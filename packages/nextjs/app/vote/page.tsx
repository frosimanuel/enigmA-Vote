"use client";

import { Group, Identity, generateProof } from "@semaphore-protocol/core";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { Hex, hexToString } from "viem";
import { useAccount } from "wagmi";
import { useReadBallotContract } from "~~/hooks/useReadBallotContract";
import { useWriteBallotContract } from "~~/hooks/useWriteBallotContract";

const Vote: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [ballotAddress] = useLocalStorage("ballotAddress", "");

  const { data: proposals } = useReadBallotContract({
    contractName: "Ballot",
    functionName: "getAllProposals",
    address: ballotAddress,
  });

  const { data: voterUser } = useReadBallotContract({
    functionName: "voters",
    address: ballotAddress,
    args: [connectedAddress],
  });

  const { data: groupId } = useReadBallotContract({
    address: ballotAddress,
    functionName: "groupId",
  });

  const { writeContractAsync: writeBallotAsync } = useWriteBallotContract(ballotAddress);
  return (
    <div className="flex flex-col items-center flex-grow pt-10 p-8 max-w-5xl mx-auto">
      <h1 className="mb-5 text-5xl font-bold text-neutral">Voting </h1>
      {/* User Joined, time to vote*/}
      {voterUser?.[0] ? (
        <div>
          <p>
            <strong className="mb-5 text-2xl text-accent">Ballot contract address: </strong> {ballotAddress}
          </p>
          <p>
            <strong className="mb-5 text-2xl text-accent">Proposals:</strong>
          </p>
          <div className="flex flex-wrap gap-5 pt-2 mx-auto">
            {proposals?.map((proposal: any, i: number) => (
              <div className="card bg-base-100 w-72 shadow-xl" key={proposal.name}>
                <div className="card-body p-6">
                  <h2 className="card-title">{hexToString(proposal.name as Hex, { size: 32 })}</h2>
                  <span>{proposal.voteCount.toString()} votes</span>
                  <div className="mt-6 mb-4 h-px bg-gray-300"></div>
                  <div className="card-actions">
                    <button
                      className="btn btn-secondary w-full"
                      onClick={async () => {
                        try {
                          // Uncomment this when we deploy to Sepolia. We'll recreate the group from the Ballot contract
                          // to replicate the on-chain group off-chain. This is needed to generate the proofs.
                          const semaphoreSubgraph = new SemaphoreSubgraph("sepolia");
                          const { members } = await semaphoreSubgraph.getGroup(groupId?.toString() || "0", {
                            members: true,
                          });
                          const group = new Group(members);

                          // Group of only one user, just for the local tests
                          const privKey = localStorage.getItem("identity");
                          const identity = new Identity(Buffer.from(privKey!, "base64"));
                          // const group = new Group([identity.commitment]);
                          const proposalId = BigInt(i);
                          const { points, merkleTreeDepth, merkleTreeRoot, nullifier } = await generateProof(
                            identity,
                            group,
                            proposalId,
                            Number(groupId),
                          );
                          await writeBallotAsync({
                            functionName: "vote",
                            args: [
                              proposalId,
                              {
                                merkleTreeDepth: BigInt(merkleTreeDepth),
                                merkleTreeRoot: merkleTreeRoot,
                                nullifier: nullifier,
                                message: proposalId,
                                scope: BigInt(groupId || 0n),
                                points: points,
                              },
                            ],
                          });
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      Vote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-error font-semibold">Please join a Ballot first</h2>
        </div>
      )}
    </div>
  );
};

export default Vote;
