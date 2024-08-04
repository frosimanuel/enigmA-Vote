"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogContext } from "../../context/LogContext";
import KeyForCopy from "./KeyForCopy";
import { Identity } from "@semaphore-protocol/core";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useWriteBallotContract } from "~~/hooks/useWriteBallotContract";

const Vote: NextPage = () => {
  const { setLog } = useLogContext();
  const [_identity, setIdentity] = useState<Identity>();
  const [ballotAddress, setBallotAddress] = useLocalStorage("ballotAddress", "");
  const { push } = useRouter();
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    const privateKey = localStorage.getItem("identity");

    if (privateKey) {
      const identity = Identity.import(privateKey);

      setIdentity(identity);

      setLog("Your Semaphore identity has been retrieved from the browser cache 👌🏽");
    } else {
      setLog("Create your Semaphore identity 👆🏽");
    }
  }, [setLog]);

  const createIdentity = useCallback(async () => {
    const identity = new Identity();

    setIdentity(identity);

    localStorage.setItem("identity", identity.export());

    setLog("Your new Semaphore identity has just been created 🎉");
  }, [setLog]);

  const { data: ballots } = useScaffoldReadContract({
    contractName: "BallotFactory",
    functionName: "getAllBallots",
  });

  const { writeContractAsync: writeBallotAsync } = useWriteBallotContract(ballotAddress);

  return (
    <>
      <>
        <div className="flex flex-col items-center flex-grow pt-10">
          <h1 className="mb-5 text-5xl font-bold text-neutral">Join a Group</h1>
          <p className="mb-5 text-2xl text-accent">The identity of a user in the Semaphore protocol.</p>

          <br />
          <h2 className="card-title mb-4">Your Identity Information</h2>
          {_identity && (
            <div className="flex w-4/5 flex-col justify-items-center items-center">
              <div className="card bg-base-100 shadow-xl flex flex-col items-center justify-items-center p-4 mb-7">
                <strong className="mb-">Private Key (base64):</strong>
                <p className="">
                  <br />
                  <span className="flex items-center">
                    {showPrivateKey ? (
                      <span className="text-sm break-all">{_identity.export()}</span>
                    ) : (
                      <h5>••••••••••••••••</h5>
                    )}
                    <button className="btn btn-ghost btn-sm ml-2" onClick={() => setShowPrivateKey(!showPrivateKey)}>
                      {showPrivateKey ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </span>
                </p>

                <table className="table mt-10">
                  <tbody>
                    <tr>
                      <th className="">
                        <strong>Public Key:</strong>
                      </th>
                      <td>
                        <div className="flex gap-7">
                          <KeyForCopy text={_identity.publicKey[0].toString()} />
                          <KeyForCopy text={_identity.publicKey[1].toString()} />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>
                        <strong>Commitment:</strong>
                      </th>
                      <td>
                        <KeyForCopy text={_identity.commitment.toString()} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <button onClick={createIdentity} className="btn btn-info">
              {" "}
              Refresh Identity{" "}
            </button>
          </div>
          <hr />

          {_identity && (
            <div>
              <p>
                <strong>Ballots to join: </strong>
                <br />
              </p>
              <div className="flex flex-wrap gap-5">
                {ballots?.map((ballot: any, i: number) => (
                  <div key={ballot.id} className="flex flex-col items-center">
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        try {
                          await writeBallotAsync({
                            functionName: "joinBallot",
                            args: [_identity.commitment],
                            address: ballot,
                          });
                          setBallotAddress(ballot);
                          push("/vote");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                    >
                      Join Ballot {i}
                    </button>
                  </div>
                ))}
              </div>
              <p className="mb-5 text-1xl text-accent">
                {" "}
                Learn more about{" "}
                <a className="text-neutral" href="https://docs.semaphore.pse.dev/guides/identities" target="_blank">
                  Semaphore identity
                </a>{" "}
                and{" "}
                <a
                  className="text-neutral"
                  href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-poseidon"
                  target="_blank"
                >
                  EdDSA
                </a>
                .
              </p>
            </div>
          )}
          <hr />
        </div>
      </>
    </>
  );
};

export default Vote;
