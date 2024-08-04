"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { toHex } from "viem";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Deploy: NextPage = () => {
  const [ballotAddress, setBallotAddress] = useLocalStorage("ballotAddress", "");
  const { writeContractAsync: writeBallotFactoryAsync } = useScaffoldWriteContract("BallotFactory");
  const [proposals, setProposals] = useState<string[]>(["", ""]);
  const [isWaiting, setIsWaiting] = useState(false);

  useScaffoldWatchContractEvent({
    contractName: "BallotFactory",
    eventName: "BallotCreated",
    onLogs: logs => {
      logs.map(log => {
        const { ballotAddress: newBallotAddress } = log.args;

        if (!newBallotAddress || newBallotAddress === ballotAddress) return;

        setBallotAddress(newBallotAddress);

        notification.success("New ballot address: " + newBallotAddress);
        setIsWaiting(false);
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (proposals.some(proposal => proposal.trim() === "")) {
      notification.error("All proposals must have a name");
      return;
    }
    setIsWaiting(true);
    try {
      await writeBallotFactoryAsync({
        functionName: "createBallot",
        args: [proposals.map(prop => toHex(prop, { size: 32 }))],
      });
    } catch (error) {
      console.error(error);
      notification.error("Failed to create ballot");
      setIsWaiting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 items-center text-center bg-base-200 p-8 max-w-5xl mx-auto"
    >
      <div className="flex flex-col gap-2">
        <h1 className="mb-5 text-5xl font-bold text-neutral">Create a new Ballot from scratch</h1>
        <b className="mb-5 text-2xl text-accent" style={{ opacity: 1.2 }}>
          Enter the name of each proposal for your ballot
        </b>
        <div className="flex flex-col items-center gap-3 w-full">
          {proposals.map((proposal, index) => (
            <input
              key={index}
              value={proposal}
              onChange={e => {
                const newProposals = [...proposals];
                newProposals[index] = e.target.value;
                setProposals(newProposals);
              }}
              required
              className="input input-bordered w-full max-w-lg"
              placeholder={`Proposal ${index + 1}`}
            />
          ))}
          <button
            type="button"
            className="btn btn-outline btn-circle"
            onClick={() => setProposals(current => [...current, ""])}
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <button type="submit" disabled={isWaiting} className={`btn btn-primary ${isWaiting ? "loading" : ""} my-6`}>
        {isWaiting ? "Waiting..." : "Create Ballot"}
      </button>

      {ballotAddress && (
        <div className="alert alert-info shadow-lg w-full max-w-lg">
          <div>
            <span>Current Ballot Address: {ballotAddress}</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default Deploy;
