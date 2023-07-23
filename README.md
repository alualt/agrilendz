
# AgriLendz

Introducing AgriLendz, the decentralized lending protocol for farmers on Polkadot.

Empowering remote farmers, it provides transparent access to loans, increasing margins by up to 20% for farmers and wholesalers. Government agents facilitate onboarding, loan applications, and even settle loans, while banks can see comprehensive data on farmers' loan history, credit ratings, trading volumes, revenue, and more, enabling smarter lending decisions using our protocol. 

Farmers can also list their produce, creating a direct marketplace for wholesalers. Real-time SMS notifications keep farmers informed. Join AgriLendz and revolutionize agricultural financing, fostering financial inclusion with the collaboration of banks. 

Let's cultivate success together!
## Tech Stack

**Client:** React, NextUI, Axios, Lenis, NextAuth

**Server:** NextJS, Flask, MongoDB, web3.py, Hardhat

**Languages:** : Python, Javascript, Solidity


# Basic Installation
**Make sure to install NodeJs and Python before proceeding**

Cloning the repository
```bash
git clone https://github.com/alualt/polkadot
```

Installing dependencies
```bash
python3 setup.py
```

# Environment Configuration
Adding secrets (root directory)
```bash
touch secret.json
```

Now open the secret.json file in a code editor and paste the following json in it.
```json
{
    "privateKey": "",
    "twilio_account_sid":"",
    "twilio_auth_token":"",
    "twilio_number":"",
    "publicAddress": "",
    "mongo_url":"",
    "mongo_username":"",
    "mongo_password":""
}
```

## Obtaining PrivateKey and PublicAddress
### Setting up MetaMask for MoonBase - Alpha Testnet
[MoonBase setup and Faucet](https://docs.moonbeam.network/builders/get-started/networks/moonbase/#connect-metamask)

[Extracting Private Key](https://support.metamask.io/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key)

Click on the address on top of the MetaMask UI. This copies the public key of your account to your clipboard.

Now put the PrivateKey and the PublicAddress in the JSON File secret.json.
### Obtaining Twilio Tokens

Create a free account on 
[Twilio Free Tier](https://www.twilio.com/try-twilio)

Head over to [Twilio Console](https://console.twilio.com/) and extract your twilio_account_sid, twilio_auth_token and your phone number.

Now paste these details inside the secret.json JSON file.

### Obtaining MongoDB credentials

Create a [Free Tier MongoDB](https://www.mongodb.com/cloud/atlas/register) account.

Create a [Free Database Using MongoDB Atlas](https://www.mongodb.com/basics/create-database)

**Make sure to add a user to the Database with an alphabetic username and an alphanumeric password**

Once the Database has been deployed, click on Connect and Select Drivers.

Now copy the Database URL.

For example: `mongodb+srv://<username>:<password>@agrilendz.xyz.mongodb.net/?`

Then Database URL would be: `agrilendz.xyz.mongodb.net`

Now paste all of these details into the secret.json JSON file.


## Deploying a local instance

**Open 3 Terminals**

### Terminal 1
```bash
npx hardhat run --network moonbase scripts/deploy.js
```
Now copy the Box deployed to address and paste it in the contract_hash file in the root directory of the project.

### Terminal 2
```bash
python3 -m flask --app main run --port 80
```

### Terminal 3
```bash
cd website
npm run dev
```

**Now open your browser at http://localhost:3000**

## Resetting MongoDB Database
Resetting the MongoDB Database would erase all accounts which have registered on the locally hosted dashboard.
```bash
python3 reset.py
```

## Authors

-  **Aarav Dayal** [@aludayalu](https://github.com/aludayalu) Account suspended due to some reason
- [@alualt](https://github.com/alualt) Alt Account for @aludayalu
- **Kritarth Shankar** [@kody-k](https://github.com/kody-k)


## Feedback

If you have any feedback, please reach out to us at aarav@dayal.org

