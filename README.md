# ICP Token Wallet

A decentralized token wallet built on the Internet Computer Protocol (ICP) implementing the ICRC-2 token standard.

## Features

- 💰 Send and receive tokens
- 📊 Check token balance
- 🔄 View total supply
- 📱 QR code generation for receiving tokens
- 🏷️ Token metadata display

## Technology Stack

- **Backend**: Rust + Internet Computer
- **Frontend**: React.js
- **Token Standard**: ICRC-2
- **Package Manager**: DFX + npm

## Prerequisites

- Node.js (v16 or higher)
- Rust
- DFX (v0.24.3 or higher)
- Internet Computer SDK

## Installation

1. Clone the repository:

git clone https://github.com/yourusername/icp-token-wallet.git

cd icp-token-wallet


2.Install dependencies:

npm install


3.Start local Internet Computer replica:

dfx start --clean --background


4.Deploy canisters:

dfx deploy


# ICP Token Wallet

## Screenshots

### Main Wallet Interface
![Wallet Interface](/public/images/wallet-home.png)

### Send Tokens Screen
![Send Screen](/public/images/send-screen.png)
![Sent Screen](/public/images/sent-screen.png)

### Receive QR Code
![Receive Screen](/public/images/receive-screen.png)
