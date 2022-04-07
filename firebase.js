// const { initializeApp } = require("firebase-admin/app");
// const serviceAccount = require("C:/Users/SE141083/Downloads/notification-test-c4db1-firebase-adminsdk-p51zl-06a9726ff2.json");
// const admin = require("firebase-admin");

// initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // This registration token comes from the client FCM SDKs.
// const registrationToken =
//   "dFHfq51RVI0t4hBu1CLj5r:APA91bEnBze4Zp5YQGWaJBxZGRiVQ44zx7tM875vS_Hp180F4GYKv3CNNqonTcmDu4DHfsxZDaOdee8KZw7D-n_W0v4i8VO0SdZbqu2QKtUMJ5XGgeoWhY0hCeJpAiw2-PiT1P-D_gRd";

// var payload = {
//   notification: {
//     title: "This is a Notification test",
//     body: "This is the body of the  message.",
//   },
// };

// var options = {
//   priority: "high",
//   timeToLive: 60 * 60 * 24,
// };

// // Send a message to the device corresponding to the provided
// // registration token.
// admin
//   .messaging()
//   .sendToDevice(registrationToken, payload, options)
//   .then(function (response) {
//     console.log("Successfully sent message:", response);
//   })
//   .catch(function (error) {
//     console.log("Error sending message:", error);
//   });
const FCM = require("fcm-node");

var serverKey =
  "AAAAsTkfFbA:APA91bF2cc2Af_4o-yc8c7g2rnNMjYg5AQMnSGTPvL-j-Uoslj6D71V1Z-Ev9WAo12n8QC5mROmc1l2VkiKPjY7LTa6ZrRDP9phcp5kvFJPB1ZYXOggV8mnKHn0Nc-BS2lAsHZXrEmT8";
var fcm = new FCM(serverKey);

var message = {
  //this may vary according to the message type (single recipient, multicast, topic, et cetera)
  to: "cgMYMHmLAqLaYlwGKpTGL3:APA91bH3bYhvDb8xYtF0yFG04W2Q3a5lZw3NnDbvOng-1TqqAJXYpnO06QnkfBAR8Jb7eTWgN5BjWeOgUHusLC3xwovcWssfWVHvG3Dce_XliqT8Qhpge92jnOBAi47udxMC9VQF8D4J",

  notification: {
    title: "Title of your push notification",
    body: "Body of your push notification",
  },

  data: {
    //you can send only notification or only data(or include both)
    my_key: "my value",
    my_another_key: "my another value",
  },
};

fcm.send(message, function (err, response) {
  if (err) {
    console.log("Something has gone wrong!");
    console.log(err);
  } else {
    console.log("Successfully sent with response: ", response);
  }
});
