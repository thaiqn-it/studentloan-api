const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("http-status");
const { restError } = require("../errors/rest");
const { PAYPAL_CLIENT_ID,PAYPAL_SECRET } = require("../constants");
const accountService = require("../services/account.service");
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
                        "name": "Nạp tiền vào Student Loan",
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
                "description": `Nạp ${cvrtMoney} vào Student Loan vào lúc ${now}`
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
    const { money,email,accountId } = req.body
    const now = new Date().getTime()
    let currencyConverter = new CC({ isDecimalComma:true })
    const cvrtMoney = await currencyConverter.from("VND").to("USD").amount(parseInt(money)).convert()
    try {   
        const balance = await accountService.getBalanceByAccountId(accountId)
        
        if (balance.money < parseInt(money)) {
            return res
            .status(BAD_REQUEST)
            .json(restError.BAD_REQUEST.extra({ error: "Số dư ví không đủ" }));
        }
        let requestBody = {
            "sender_batch_header": {
              "email_message": `Chuyển tiền đến tài khoản ${email}`,
              "note": `Số tiền ${cvrtMoney} đã được chuyển`,
              "email_subject": "Chuyển tiền Paypal"
            },
            "items": [{
              "recipient_type": "EMAIL",
              "note": `Chuyển ${cvrtMoney} đến tài khoản ${email}`,
              "amount": {
                "currency": "USD",
                "value": `${cvrtMoney}`
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
