
const callPrice = 2.75;
const smsPrice = 0.65;

function totalPhoneBill(callsAndSMS) {
    const callsAndSMSArray = callsAndSMS.split(', ');
    let callCount = 0;
    let smsCount = 0;

    for (const item of callsAndSMSArray) {
        if (item === 'call') {
            callCount++;
        } else if (item === 'sms') {
            smsCount++;
        }
    }

    const totalCost = (callCount * callPrice) + (smsCount * smsPrice);
    return totalCost.toFixed(2); 
}

function setPrice(type, price) {
    if (type === 'call') {
        callPrice = price;
    } else if (type === 'sms') {
        smsPrice = price;
    }
}

function getPrices() {
    return { call: callPrice, sms: smsPrice };
}

export {totalPhoneBill, setPrice, getPrices };
