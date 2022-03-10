const { INTERNAL_SERVER_ERROR } = require("http-status");
const { restError } = require("../errors/rest");
const { PAYPAL_CLIENT_ID,PAYPAL_SECRET } = require("../constants");
const CC = require('currency-converter-lt')

const paypal = require('paypal-rest-sdk')

paypal.configure({
    'mode' : 'sandbox',
    'client_id' : PAYPAL_CLIENT_ID,
    'client_secret' : PAYPAL_SECRET
})

const topup = async (req, res, next) => {
    const { money } = req.body
    const now = new Date().getTime()
    let currencyConverter = new CC({ isDecimalComma:true })
    const cvrtMoney = await currencyConverter.from("VND").to("USD").amount(parseInt(money)).convert()
    try {   
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://studentloanfpt.ddns.net/payment/success",
                "cancel_url": "https://studentloanfpt.ddns.net/payment/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Top-up money",
                        "sku": "item",
                        "price": `${cvrtMoney}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${cvrtMoney}`
                },
                "description": `Top-up money at ${now}`
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                res.json(payment.links[1].href)
            }
        });
    } catch (err) {
        res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default());
    }
};

const transfer = async (req, res, next) => {
    const { money,email } = req.body
    const now = new Date().getTime()
    try {   
        let requestBody = {
            "sender_batch_header": {
              "email_message": "SDK payouts test txn",
              "note": "Enjoy your Payout!!",
              "email_subject": "This is a test transaction from SDK"
            },
            "items": [{
              "recipient_type": "EMAIL",
              "note": `Transfer ${money} to ${email}`,
              "amount": {
                "currency": "USD",
                "value": `${money}`
              },
              "receiver": `${email}`,
              "sender_item_id": "Test_txn_1"
            }]
        }
        paypal.payout.create(requestBody,function (error, payment){
            if (error) {
                throw error;
            } else {
                console.log(payment);
            }
        } )
    } catch (err) {
        res
        .status(INTERNAL_SERVER_ERROR)
        .json(restError.INTERNAL_SERVER_ERROR.default());
    }
};

const success = async (req, res, next) => {
    var payer_id = req.query.PayerID;
    var paymentId = req.query.paymentId;
   
    paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
            console.log(error);
            throw error;
        } else {
            var execute_payment_json = {
                "payer_id": payer_id,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": payment.transactions[0].item_list.items[0].price
                    }
                }]
            };
            paypal.payment.execute(paymentId, execute_payment_json, function (error) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    res.send("Success")
                }
            });
        }
    });
}

const cancel = async (req, res, next) => {
    res.send("Cancel")
}


exports.paypalController = { 
    topup,
    transfer,
    success,
    cancel
};
