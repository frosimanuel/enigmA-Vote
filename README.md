<h1 align="center"> 🤫 enigmA-Vote 🤫</h1>
  <h4 align="center">Built for TheLevelUp Hackathon !</h4>

<h4 align="center">
  <a href="https://www.canva.com/design/DAGM5T86daQ/HCFXclyE3jIqX7A-uA68hw/edit?utm_content=DAGM5T86daQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">Slides</a> |
  <a href="https://drive.google.com/drive/folders/162bkq76J3gUUd-HeIkMxQcDDxeZeckNy?usp=sharing">Demo</a>
</h4>

### About

🧪 This is a draft for an Anonymous voting dApp designed to facilitate anonymous and secure voting. By leveraging the Semaphore protocol for zero-knowledge proofs and the Gelato Relay network for transaction relaying, this dApp ensures voter privacy, data integrity, and resistance to censorship.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

### Features

- ✅ **Anonymous Voting**: Uses Semaphore protocol to enable anonymous voting through zero-knowledge proofs.

- 🪝 **Secure and Transparent**: Ensures votes are securely recorded on the blockchain and visible for verification without compromising voter identities.

- 🧱 **Decentralized Transaction Relaying**: Utilizes Gelato Relay to submit transactions, adding a layer of anonymity by obfuscating the voter's wallet address.

## Quickstart

To get started follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
git clone https://github.com/your-username/enigmA-vote.git
cd enigmA-Vote
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page.
