const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { PAYPAL_CLIENT_ID,PAYPAL_SECRET } = require("../constants");
const walletService = require("../services/wallet.service");
const {systemConfigService} = require("../services/systemconfig.service");
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
    let currencyConverter = new CC()
    const cvrtMoney = await currencyConverter.from("VND").to("USD").amount(parseInt(money)).convert() / 100
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
                        "name": "Nạp tiền vào Student Loan",
                        "sku": "item",
                        "price": `${cvrtMoney.toFixed(2)}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${cvrtMoney.toFixed(2)}`
                },
                "description": `Nạp ${cvrtMoney.toFixed(2)} vào Student Loan vào lúc ${now}`
            }]
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                return res
                .status(BAD_REQUEST)
                .json(restError.BAD_REQUEST.extra({ error: error }));
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
    const { money,email,accountId } = req.body
    const now = new Date().getTime()
    let currencyConverter = new CC()
    const transactionFee = await systemConfigService.getTransactionFee()
    try {   
        const balance = await walletService.getBalanceById(accountId)
        
        if (balance.money < parseInt(money)) {
            return res
            .status(BAD_REQUEST)
            .json(restError.BAD_REQUEST.extra({ error: "Số dư ví không đủ" }));
        }
        const fee = parseInt(money) * transactionFee.transactionFee
        const cvrtMoney = await currencyConverter.from("VND").to("USD").amount(parseInt(money) - fee).convert() / 100
        
        let requestBody = {
            "sender_batch_header": {
              "email_message": `Chuyển tiền đến tài khoản ${email}`,
              "note": `Số tiền ${cvrtMoney.toFixed(2)} đã được chuyển`,
              "email_subject": "Chuyển tiền Paypal"
            },
            "items": [{
              "recipient_type": "EMAIL",
              "note": `Chuyển ${cvrtMoney.toFixed(2)} đến tài khoản ${email}`,
              "amount": {
                "currency": "USD",
                "value": `${cvrtMoney.toFixed(2)}`
              },
              "receiver": `${email}`,
              "sender_item_id": `${now}`
            }]
        }
        paypal.payout.create(requestBody,function (error, payment){
            if (error) {
                return res
                .status(BAD_REQUEST)
                .json(restError.BAD_REQUEST.extra({ error: "Giao dịch không thể thực hiện" }));
            } else {
                res.json({payoutId : payment.batch_header.payout_batch_id})
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
