const userService = require("../services/user.service");
const accountService = require("../services/account.service");
const transactionService = require("../services/transaction.service");
const { USER_STATUS } = require("../models/enum/index");
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
} = require("http-status");
const { restError } = require("../errors/rest");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY, VERIFY_TOKEN } = require("../constants");
const { excludePassword, hashPassword } = require("../utils");
const { authenticator } = require("otplib");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const nodemailer = require("nodemailer");
const axios = require("axios");

const sendMail = async (token) => {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: `${process.env.EMAIL_ADDRESS}`,
  //     pass: `${process.env.EMAIL_PASSWORD}`,
  //   },
  // });
  // const mailOptions = {
  //   from: `${process.env.EMAIL_ADDRESS}`,
  //   to: "qthai20102000@gmail.com",
  //   subject: "Verify your account",
  //   text: `OTP code is ${token}`,
  // };
  // const key = jwt.sign(
  //   {
  //     token,
  //   },
  //   VERIFY_TOKEN,
  //   {
  //     expiresIn: "1h",
  //   }
  // );
  // await transporter.verify();
  // await transporter.sendMail(mailOptions, (err, res) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("success");
  //   }
  // });
};

const sendOTP = (req, res) => {
  try {
    authenticator.options = {
      step: 900,
      window: [1, 0],
    };

    const secret = authenticator.generateSecret();
    const token = authenticator.generate(secret);
    const timeRemaining = authenticator.timeRemaining();
    const { phoneNumber } = req.body;

    //send SMS

    // client.messages
    //   .create({
    //     body: `OTP code is : ${token}. Your code will expired in 90 seconds. Please don't share your code with anymore!`,
    //     from: '+15076153483',
    //     to: `${phoneNumber}`
    //   })

    // send email
    sendMail(token);

    res.json({
      secret,
      timeRemaining,
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR);
  }
};

const verifyOTP = (req, res) => {
  try {
    const { token, secret } = req.body;
    const isValid = authenticator.check(token, secret);
    res.json({
      isValid,
    });
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR);
  }
};

const creatUser = async (req, res) => {
  try {
    const data = req.body;

    const checkExistsUser = await userService.getOne({
      email: data.email,
      phoneNumber: data.phoneNumber,
    });
    if (checkExistsUser) return res.json(checkExistsUser);

    const status = USER_STATUS.ACTIVE;
    const password = hashPassword(data.password);
    const user = await userService.createUserService({
      email: data.email,
      phoneNumber: data.phoneNumber,
      password,
      type: data.type,
      status,
    });
    res.json(user);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json(restError.INTERNAL_SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginService(email, password);
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY);
    res.json({ token });
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const loginByFb = async (req, res) => {
  const { access_token } = req.body;
  try {
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?access_token=${access_token}&fields=email,first_name,last_name`
    );
    const { id: fb_userId, email, first_name, last_name } = fbRes.data;
    const user = await userService.getOne({ oAuthId: fb_userId });

    if (!user) {
      return res.json({
        isNew: true,
        user: {
          email,
          first_name,
          last_name,
        },
      });
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
        },
        JWT_SECRET_KEY
      );
      return res.json({
        token,
      });
    }
  } catch (err) {
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const loginByGoogle = async (req, res) => {
  const { access_token } = req.body;
  try {
    let googleRes = await axios("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const {
      id: gog_userId,
      email,
      given_name: first_name,
      family_name: last_name,
    } = googleRes.data;
    const user = await userService.getOne({ oAuthId: gog_userId });

    if (!user) {
      return res.json({
        isNew: true,
        user: {
          email,
          first_name,
          last_name,
        },
      });
    } else {
      const token = jwt.sign(
        {
          userId: user.id,
        },
        JWT_SECRET_KEY
      );
      return res.json({
        token,
      });
    }
  } catch (err) {
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const registerByFb = async (req, res) => {
  try {
    const { data } = req.body;

    let fbRes = await axios.get(
      `https://graph.facebook.com/me?access_token=${data.access_token}&fields=id,picture,email`
    );
    const { id: fb_userId, email } = fbRes.data;
    const profileUrl = fbRes.data.picture?.data?.url || "";
    const password = hashPassword(data.password);
    const status = USER_STATUS.INACTIVE;
    const user = await userService.createUserService({
      oAuthId: fb_userId,
      email,
      phoneNumber: data.phoneNumber,
      password,
      type: data.type,
      status,
    });
    return res.json({ ...excludePassword(user), profileUrl });
  } catch (error) {
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const registerByGoogle = async (req, res) => {
  try {
    const { data } = req.body;
    let googleRes = await axios("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    const { id: google_userId, email, picture } = googleRes.data;
    const password = hashPassword(data.password);
    const status = USER_STATUS.INACTIVE;
    const user = await userService.createUserService({
      oAuthId: google_userId,
      email,
      phoneNumber: data.phoneNumber,
      password,
      type: data.type,
      status,
    });
    return res.json({ ...excludePassword(user), profileUrl: picture });
  } catch (error) {
    return res.status(BAD_REQUEST).json(restError.BAD_REQUEST.default());
  }
};

const getProfile = async (req, res) => {
  const user = req.user;

  res.json(excludePassword(user));
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await userService.deleteUserService(id);

    res.json(user);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await userService.updateUserService(data);
    res.json(user);
  } catch (err) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const checkEmail = async (req, res) => {
  try {
    const email = req.body;
    const user = await userService.getOne(email);
    if (user) {
      res.json(excludePassword(user));
    }
  } catch (e) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getWalletInfo = async (req, res) => {
  try {
    const user = req.user;
    const wallet = await accountService.getWalletByUserId(user.id);

    return res.json(wallet);
  } catch (e) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};

const getTransactionsByAccountId = async (req, res) => {
  try {
    const { accountId } = req.body;
    const transactions = await transactionService.getTransactionsByWalletId(
      accountId
    );

    return res.json(transactions);
  } catch (e) {
    console.log(e);
    res
      .status(INTERNAL_SERVER_ERROR)
      .json(restError.INTERNAL_SERVER_ERROR.default());
  }
};
module.exports = {
  creatUser,
  login,
  getProfile,
  deleteUser,
  updateUser,
  sendOTP,
  verifyOTP,
  registerByFb,
  loginByFb,
  loginByGoogle,
  registerByGoogle,
  checkEmail,
  getWalletInfo,
  getTransactionsByAccountId,
};