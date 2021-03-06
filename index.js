let H = require('./helpers');
let conf = require('config');

async function init() {

    H.console.separatorMessage();
    H.console.nMsg(`Welcome to ${conf.get('title').toString().toUpperCase()}`);
    H.console.nMsg(`Right now we are preparing to ${conf.get('coin')} (${conf.get('symbol')})`);
    H.console.separatorMessage();

    H.console.nMsg(`${H.string.getCurrentDatetime()} Starting the Log...`);
    await H.timeout.sleep(1000);
    H.console.nMsg(`${H.string.getCurrentDatetime()} Analyzing your settings...`);
    await H.timeout.sleep(1000);
    H.console.nMsg(`${H.string.getCurrentDatetime()} Testing RPC Credentials...`);


    await H.timeout.sleep(1000);
    H.console.nMsg(`${H.string.getCurrentDatetime()} Unlocking wallet...`);
    unlockWallet(null);


    if (H.operations.equals100Percent()) {
        H.console.nMsg(`${H.string.getCurrentDatetime()} We're ready to pay to the 100% of the reward`);
        H.rpc.getBalance(function (err, resBalance) {
            if (err == null) {
                const balance = resBalance.result;
                H.console.nMsg(`${H.string.getCurrentDatetime()} You have amount ${conf.get('symbol')}: ${balance} available`);
                if (balance > conf.get('blockedAmount')) {
                    H.console.nMsg(`${H.string.getCurrentDatetime()} Getting rewards received...`);
                    let rewardsNumber = H.operations.getNumberOfRewardsReceived(balance);
                    H.console.nMsg(`${H.string.getCurrentDatetime()} you have ${rewardsNumber}  of rewards to pay...`);

                    let listOfAddress = conf.get('addresses');
                    H.console.nMsg(`${H.string.getCurrentDatetime()} Paying now...`);
                    for (let i = 0; i < listOfAddress.length; i++) {
                        let amountToSend = H.operations.getAmountToBeSent(listOfAddress[i].percentage)
                            , nameToSend = listOfAddress[i].name
                            , addressToSend = listOfAddress[i].address
                            , datetime = H.string.getCurrentDatetime();

                        H.rpc.sendAmount(addressToSend, amountToSend, function (err, res) {
                            if (!err) {
                                let txid = res.result
                                    ,
                                    strMessage = `${datetime} Paid to ${nameToSend} the amount of ${amountToSend} ${conf.get('symbol')} with the txid: ${txid}`
                                    ,
                                    strFile = `${datetime} Paid to ${nameToSend} the amount of ${amountToSend} ${conf.get('symbol')} to the address: ${addressToSend} with the txid: ${txid}`
                                    ,
                                    strErrorMsg = `${datetime} Error trying to pay to ${nameToSend} looks like the wallet was not unlocked successfully`;

                                if(txid){
                                    H.file.appendSingleLineToFile(strFile);
                                    H.console.sMsg(strMessage);
                                } else {
                                    H.file.appendSingleLineToFile(strErrorMsg);
                                    H.console.eMsg(strErrorMsg);
                                }
                            }
                            else {
                                H.console.eMsg(`${datetime} There was an error trying to pay to ${nameToSend} with the next error: ${err.message}`);
                            }
                        });
                    }
                }
                else {
                    H.console.eMsg(`${H.string.getCurrentDatetime()} There is not a masternode here, finishing it`);
                }
            }
        });
    }
    else {
        H.console.wMsg(`${H.string.getCurrentDatetime()} DOES NOT Equals 100%, you need to add complete 100% in the addresses`);
    }
}

function unlockWallet(calback){
    H.console.wMsg(`${H.string.getCurrentDatetime()} Unlocking wallet ...`);
    H.rpc.setWalletPassPhrase(conf.get('wallet.passphrase'), conf.get('wallet.timeout'), function(err, res){
       H.console.sMsg('unlocked') ;
    });
}


init();





