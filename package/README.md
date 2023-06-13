# js-mat
JavaScript library for representation and mathematical operations using matrix

# Usage
Create a matrix of random values:
```
var M = Matrix.rand(3,3); // create a 3x3 matrix
```

Create a null matrix:
```
var M = Matrix.zeros(2,5); // create a 2x5 null matrix
```

Create a matrix of ones:
```
var M = Matrix.ones(2,2) // create a 2x2 matrix of ones
```

Create an identity matrix:
```
var I = Matrix.eye(4); // identity matrix of size 4x4
```

Create a matrix from a 2D array:
```
var M = Matrix.fromArray([
    [1,2,3],
    [4,5,6],
    [7,8,9]
]);
```

Create a matrix from another matrix
```
var M1 = Matrix.rand(3,6);
var M2 = Matrix.fromMatrix(M1); // equal to M1
```


# Backend (Blockchain) API
## This API handles the communication between the client and Talamo's Blockchain

This API has been written using the NodeJS+Expresss environment. 

## Requirements
* NodeJS v16+

## Installation

To install this API, just clone the repository and run the following command:
```
npm install
```
This will install all required packages automatically.

## Configuration
In order for the API to work correctly, you have to edit some variables inside the .env file, which can be seen below:
```
MESSAGES_KEY=thisisatestkeymustbechangedlater
PORT=4050
API_TOKEN_KEY=thisistheapikey
```

* **MESSAGES_KEY**: Key used to encrypt/decrypt the messages
* **PORT**: Port for the API to run
* **API_TOKEN_KEY**: Key used to generate the access tokens


## Execution
To execute this API, just run the following command:
```
npm run dev
```
If everything went ok, you should see the following message
```
API listening at port 4050
```
To check that the API has been successfully deployed, you can send a GET request to **http://localhost:4050** and you should get the following response:
```
{
    "msg": "Eveything is working!"
}
```

## Routes
The API contains the following routes:
```
.../api/login

.../api/transactions/username?
.../api/transactions/create
.../api/transactions/approve
.../api/transactions/decline

.../api/blocks

.../api/wallets/user/username?
.../api/wallets/all
.../api/wallets/create
.../api/wallets/update

.../api/tokens/create
.../api/tokens/update
.../api/tokens/tokenId?
```
---
# .../api/login
### POST
This route is used to register a new user that will later be authenticated to obtain an **access token**. To register a new user, just pass the following body to the request (Note, the parameters used are just for testing):
```
{
    "username": "usertest",
    "password": "passtest"
}
```
After that, you should get a response containing a JSON object with an access token:
```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7fSwiaWF0IjoxNjcxNzE3NjQ5fQ.opTnsMtdEKw10EpPNLv1Yl3QkNwwWF4NrZqjZKxEkt0"
}
```

### GET
This request is used to prove that the access token is correct. If you send a GET request with the provided access token, you should get the following response:
```
{
    "message": "Authenticated!",
    "authData": {
        "account": {},
        "iat": 1671717649
    }
}
```

In case the token is not valid, you will get the following response:
```
Forbidden
```
---
# .../api/transactions
### GET
This route is used to get a list of transactions from Blockchain. In order to get a list of all transactions, you can send the request with no username specified in the url. If you want to retrieve the transactions for an specific user, you need to provide an username as: ```/api/transactions/usertest123```
If you do that, you will receive a response with the following JSON object:
```
{
    "type": 15,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "34294eca76757341f93f2628d2d709e32f7ff050eaf780a226405d3658b8f526",
        "tx": [
            {
                "id": "e45ea74e49",
                "sender": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f",
                "receiver": "9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
                "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9",
                "amount": 25,
                "description": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f sent 25 314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9 to 9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
                "creationDate": 1671718282762,
                "signature": "e27b4bc7c1b508b9b1d1467599ad53d0ab2cde82a30e88103291fa818309d425",
                "status": 1,
                "blockId": null,
                "type": 1,
                "onhold": 0,
                "processedDate": 1671718282766
            }
        ]
    },
    "timestamp": "2022-12-22T14:12:21.982Z",
    "signature": null
}
```
Where ```tx``` is an array containing all transactions.

# .../api/transactions/create
### POST
The POST request for this route is used to store/register new transactions into the Blockchain. This request requires abody containing all valid info in order for a transaction to be valid. An example of a transaction is shown below:
```
 {
    "sender": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f",
    "receiver": "9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
    "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9",
    "amount": 25,
    "type": 1
}  
```
Where ```sender``` and ```receiver``` are the wallet's addresses, ```tokenId``` is the id of the token beign processed, ```amount``` is the amount of the transaction, and ```type``` defines the type of the transaction. The transaction can have two types:
* **AUTOMATIC (1)**: This transaction is processed instantly
* **MANUAL (2)**: This transaction is registered into the blockchain but requires a manual approval. The approval of this transaction is done sending a request to the Blockchain that is explained below

When a transaction is sent to the Blockchain, the bloclchain sents back a response with the status of the transaction and a status code as follows:
```
{
    "type": 15,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "b6e7fda56fc30a42173ebfa664bc9a51ede7470c3e0d00a28f5e307f51c10702",
        "tx": {
            "id": "e45ea74e49",
            "sender": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f",
            "receiver": "9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
            "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9",
            "amount": 25,
            "description": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f sent 25 314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9 to 9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
            "creationDate": 1671718282762,
            "signature": "e27b4bc7c1b508b9b1d1467599ad53d0ab2cde82a30e88103291fa818309d425",
            "status": 1,
            "blockId": null,
            "type": 1,
            "onhold": 0,
            "processedDate": 1671718282766
        }
    },
    "timestamp": "2022-12-22T14:11:22.766Z",
    "signature": null
}
```

The ```status``` attribute outside the ```tx``` attributes refers to the status of the request (CODE 200 means the request is correct), while the ```status``` attribute inside the ```tx``` attribute refers to the **status of the transaction**. The transaction's status can have one of two values:
* **PROCESSED (1)**: The transaction is processed and closed
* **PENDING (2)**: The transaction is pending of processing
* **DECLINED (3)**: The transaction was declined
* **WAITING_MANUAL_APPROVAL(4)**: The transaction requires a manual approval (it is pending)

# .../api/transactions/approve
### POST
This request is used to **manually approve** a transaction. The body of this request requires only the ```id``` of the transaction:
```
{
    "txId": "x0s66dgkop46sad" # example
}
```

The response is the same as the one shown from the POST request: a JSON object with the data of the transaction and its status.

# .../api/transactions/decline
### POST
This route is used to decline a pending transaction. The body of this request requires only the ```id``` of the transaction:
```
{
    "txId": "x0s66dgkop46sad" # example
}
```
---
# ...api/blocks
### GET
This request is used to get all blocks from the blockchain. You will obtain a JSON object with an array containing JSON objects, each of one block

---
# .../api/wallets/all
### GET
This request is used to get all wallet's from blockchain
The response obtained is shown below:
```
{
    "type": 16,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "8a66859c3b9fca18af86b67adae2d11aecf39df8d6c5dda1ab3152146c761648",
        "wallet": [
            {
                "id": 0,
                "address": "3deb1a3c3cf1e7f2e244418f9bb116c3d936cbf0d8f80ad75419800ede3ad94f",
                "username": "usertest",
                "registration_date": 1671657202085,
                "balance": 75,
                "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9"
            },
            {
                "id": 1,
                "address": "9cc6a17defcf0ca86b878806443490c7957d98edc91215a9746fc9c7ecce9350",
                "username": "justanotheruser",
                "registration_date": 1671718216811,
                "balance": 25,
                "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9"
            }
        ]
    },
    "timestamp": "2022-12-22T15:17:57.711Z",
    "signature": null
}
```

# .../api/wallets/user
### GET
This route is used to get a wallet for an specified username. The username must be given in the URL as: ```.../api/wallets/user/usertest123``` where ```usertest123``` is the username.

# .../api/wallets/create
### POST
This request is used to register a new wallet into the blockchain. To register a new wallet, the body of the request must contains the ```username``` and ```tokenId``` (reference to the token that will be stored):
```
{
    "username": "this is an username",
    "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9"
}
```
The response obtained will be a JSON object with the rest of wallet´s details as ```id```, ```registration_date```, etc.:
```
{
    "type": 16,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "e9fe11d9ed938d128d661e9d779eccb21c65fe8c4c573a6d5a116a3b4ee1de47",
        "wallet": {
            "id": 2,
            "address": "fcebb88ec626145270665475e28ec2ac8ecdb1bf1057f4991395e1ba31f01379",
            "username": "just an user",
            "registration_date": 1671722435407,
            "balance": 0,
            "tokenId": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9"
        }
    },
    "timestamp": "2022-12-22T15:20:35.407Z",
    "signature": null
}
```

# .../api/wallets/update
### POST
This route is used to update a wallet's balance. The body of the request must contains the following:
```
{
    "address": "fcebb88ec626145270665475e28ec2ac8ecdb1bf1057f4991395e1ba31f01379",
    ¨tokenId: "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9",
    "amount": 10
}
```
The above request will assign an amount of ```10``` to the specified wallet.

---
# ...api/tokens/all
### GET
This request is used to get a list of all tokens registered into the Blockchain
This request does not requires a body and the format of the response is shown below:
```
{
    "type": 17,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "c5558d62f2777ee12f5e35039531b192abbbc3b5dc9488c3b0c9e7b4c7923a1e",
        "token": [
            {
                "name": "DIELL",
                "supply": "100000",
                "description": "Just a token",
                "registration_date": 0,
                "onuse": 0,
                "id": "314267a5cadee3e9da0284086a097ac3687ecfb8262655fbc85a616650a5dfc9",
                "category": 1
            },
            {
                "name": "MOBILITY",
                "supply": 500000,
                "description": "Mobility token",
                "registration_date": 0,
                "onuse": 0,
                "id": "5e8abf99613d85c3d1bf8a29aff027549add52d8656cdace735ab09c8d266a13",
                "category": 2
            }
        ]
    },
    "timestamp": "2022-12-22T15:25:05.044Z",
    "signature": null
}
```
The ```category``` attribute defines the type of token. For now there are only two categories:
* **NORMAL**: 1
* **NON_TRANSFERABLE**: 2
These categories are not final.

# .../api/tokens/create
### POST
This request is used to register new tokens into the Blockchain. The body of the request is shown below:
```
{
    "name": "MOBILITY",
    "supply": 500000,
    "description": "Mobility token",
    "category": 1
}
```
The response obtained should contains the data of the token:
```
{
    "type": 17,
    "senderId": "MASTER",
    "senderAddress": "wss://tlm-blockchain.onrender.com",
    "content": {
        "status": 200,
        "receiverId": "6638a14c4fbf42391f23b87803699201d0191b7ad0c23a1ed9f78539ed9ace2d",
        "token": {
            "name": "MOBILITY",
            "supply": 500000,
            "description": "Mobility token",
            "registration_date": 0,
            "onuse": 0,
            "id": "5e8abf99613d85c3d1bf8a29aff027549add52d8656cdace735ab09c8d266a13",
            "category": 1
        }
    },
    "timestamp": "2022-12-22T15:24:27.158Z",
    "signature": null
}
```

# .../api/tokens/update
### POST
This route is used to update the supply of an existing token. To do this, you just need to send a body with the ```tokenId``` and ```supply``` attributes. 