const { STRIPE_SECRET_KEY } = require("../constants");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const createAccount = ({ email, firstname, lastname }) => {
  const account = {
    type: "custom",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    default_currency: "usd",
    business_type: "individual",
    business_profile: { mcc: 5734, url: "larrytran.com" },
    tos_acceptance: {
      date: Math.floor(Date.now() / 1000),
      ip: "178.166.15.32",
    },
    external_account: "tok_visa_debit_us_transferSuccess",
    individual: {
      address: {
        city: "Lincoln",
        line1: "address_full_match",
        line2: "address_full_match",
        postal_code: "62656",
        state: "Illinois",
      },
      dob: {
        day: "01",
        month: "01",
        year: 1901,
      },
      email: email,
      first_name: firstname,
      last_name: lastname,
      id_number: "000000000",
      gender: "male",
      phone: "202-555-0145",
    },
  };

  return stripe.accounts.create(account);
};

const getAccountBalance = (accountId) => {
  return stripe.accounts.retrieve(accountId);
};

const transfer = ({ amount, currency, destination, transfer_group }) => {
  return stripe.transfers.create({
    amount: amount,
    currency: currency,
    destination: destination,
    transfer_group: transfer_group,
  });
};

module.exports = { getAccountBalance, transfer, createAccount };
