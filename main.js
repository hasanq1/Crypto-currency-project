const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


class Block{
    constructor(timestamp, transactions, previousHash =''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transaction)+ this.nonce).toString();        
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}





class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock(){ 
    return new Block("12/1/2022", "Genesis block", "0");
    }

    getLatestBlock(){  
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        // reset pending transactions and sends the mining reward
        // null is used to indicate that the transaction is a mining reward
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                // if the address is the sender, reduce the balance
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                // if the address is the receiver, increase the balance
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid(){
        // check if genesis block is valid
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // check if hash is valid
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            // check if previous hash is valid
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let ProtoCoin = new Blockchain();

// add a block address1 -> address2 would be a public key of somones wallet
ProtoCoin.createTransaction(new Transaction('address1', 'address2', 100));
ProtoCoin.createTransaction(new Transaction('address2', 'address1', 50));

// mine the block and reward the miner but returns 0 for the first transaction 
console.log('\n Starting the miner...');
ProtoCoin.minePendingTransactions('testers-address');
console.log('\nBalance of tester is', ProtoCoin.getBalanceOfAddress('testers-address'));

// mine the block and reward the miner but returns 
// actual balence for the second transaction and stores a pending tranasction for the first transaction
console.log('\n Starting the miner...');
ProtoCoin.minePendingTransactions('testers-address');
console.log('\nBalance of tester is', ProtoCoin.getBalanceOfAddress('testers-address'));