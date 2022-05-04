const FCM = require("fcm-node");

var serverKey =
  "AAAAxHZu1RE:APA91bG38CxAbi6G95Er8pXaOW2U3g66URY2HL2HClbLYX2ZnrtAayH3kTE_ZuT41t6Y0Br0KUrS5-wTf7-XZ7-jX_y4ZN5Zdia4hDKxyZdUXD3yjOSnjsIKqmfHkBhH1IYQXTtQg21z";
var fcm = new FCM(serverKey);

// var message = {
//   //this may vary according to the message type (single recipient, multicast, topic, et cetera)
//   to: "cgMYMHmLAqLaYlwGKpTGL3:APA91bH3bYhvDb8xYtF0yFG04W2Q3a5lZw3NnDbvOng-1TqqAJXYpnO06QnkfBAR8Jb7eTWgN5BjWeOgUHusLC3xwovcWssfWVHvG3Dce_XliqT8Qhpge92jnOBAi47udxMC9VQF8D4J",

//   notification: {
//     title: "Title of your push notification",
//     body: "Body of your push notification",
//   },

//   data: {
//     //you can send only notification or only data(or include both)
//     my_key: "my value",
//     my_another_key: "my another value",
//   },
// };

// fcm.send(message, function (err, response) {
//   if (err) {
//     console.log("Something has gone wrong!");
//     console.log(err);
//   } else {
//     console.log("Successfully sent with response: ", response);
//   }
// });

const pushNotificationService = (token, payload) => {
  var message = {
    //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: token,
    notification: payload.notification,

    data: payload.data,
  };

  return fcm.send(message, function (err, response) {
    if (err) {
      return null;
    }
    return response;
  });
};

module.exports = { pushNotificationService };
