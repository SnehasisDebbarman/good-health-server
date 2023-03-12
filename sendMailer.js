const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const AbandonedCart = require("./Model/AbandonedCartModel");
const sendMessageModel = require("./Model/sentMessageModel");
const moment = require("moment");

async function sendMailer() {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
  });

  // Define email templates for each day
  const emailTemplates = [
    {
      subject: "Your cart is still waiting! you left it 5 minutes ago",
      message:
        "Hi {username},\n\nWe noticed that you left some items in your cart. Come back soon and complete your purchase!",
    },
    {
      subject: "Your cart is still waiting! you left it 10 minutes ago",
      message:
        "Hi {username},\n\nWe noticed that you left some items in your cart. Come back soon and complete your purchase!",
    },
    {
      subject: "Don't forget about your cart! you left it 15 minutes ago",
      message:
        "Hi {username},\n\nYour cart is still waiting for you! Take a look at the items you left behind and complete your purchase.",
    },
  ];

  // Schedule function to run every minute
  cron.schedule("* * * * *", async () => {
    const abandonedCarts = await AbandonedCart.find({ abandonedStatus: true });

    // console.log("cart.createdAt", moment().format("dd/MM/yyyy, hh:mm a"));
    // console.log("cart.createdAt", moment(c.createdAt).format());
    abandonedCarts.forEach(async (cart) => {
      const now = new Date();
      const cartCreated = cart.createdAt;
      const timeDiff = now.getTime() - cartCreated.getTime();
      const duration = moment.duration(moment().diff(moment(cartCreated)));
      console.log("duration", duration.asMilliseconds());
      const timeDiffMinutes = duration.asMinutes();
      console.log("timeDiffMinutes", timeDiffMinutes);

      try {
        if (cart.count === 0 && timeDiffMinutes > 5 && timeDiffMinutes < 9) {
          cart.count = 1;
          await cart.save();
          await sendEmail(0, cart, cart.count);
        } else if (
          cart.count === 1 &&
          timeDiffMinutes >= 10 &&
          timeDiffMinutes < 13
        ) {
          cart.count = 2;
          await cart.save();
          await sendEmail(1, cart, cart.count);
        } else if (
          cart.count === 2 &&
          timeDiffMinutes >= 15 &&
          timeDiffMinutes < 19
        ) {
          cart.abandonedStatus = false;
          cart.count = 3;
          await cart.save();
          await sendEmail(2, cart, cart.count);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  async function sendEmail(templateIndex, cart, count) {
    const emailTemplate = emailTemplates[templateIndex];

    const sentMsg = new sendMessageModel({
      username: cart.username,
      email: cart.email,
      phone: cart.phone,
      abandonedStatus: cart.abandonedStatus,
      sendMessage: emailTemplate.subject,
      url: cart.url,
      orderId: cart.orderId,
      count: count,
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: cart.email,
      subject: emailTemplate.subject,
      text: emailTemplate.message.replace("{username}", cart.username),
    };

    try {
      await transporter.sendMail(mailOptions);
      await sentMsg.save();
      console.log(`Email sent to ${cart.email}`);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  sendMailer,
};
