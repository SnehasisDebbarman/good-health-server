const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const AbandonedCart = require("./Model/AbandonedCartModel");
const sendMessageModel = require("./Model/sentMessageModel");

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

    abandonedCarts.forEach(async (cart) => {
      const now = new Date();
      const cartCreated = cart.createdAt;
      const timeDiff = now.getTime() - cartCreated.getTime();

      try {
        if (cart.count === 0 && timeDiff < 5 * 60 * 1000) {
          cart.count += 1;
          await cart.save();
          await sendEmail(0, cart);
        } else if (cart.count === 1 && timeDiff < 10 * 60 * 1000) {
          cart.count += 1;
          await cart.save();
          await sendEmail(1, cart);
        } else if (cart.count === 2 && timeDiff < 15 * 60 * 1000) {
          cart.abandonedStatus = false;
          cart.count += 1;
          await cart.save();
          await sendEmail(2, cart);
        }
      } catch (error) {
        console.log(error);
      }

      // Send email based on time difference
      // if (timeDiff >= 60 * 1000 && timeDiff < * 60 * 1000) {
      //   await sendEmail(0, cart);
      // }
      // if (timeDiff >= 30 * 60 * 1000 && timeDiff < 24 * 60 * 60 * 1000) {
      //   await sendEmail(1, cart);
      // } else if (
      //   timeDiff >= 24 * 60 * 60 * 1000 &&
      //   timeDiff < 72 * 60 * 60 * 1000
      // ) {
      //   await sendEmail(2, cart);
      // } else if (timeDiff >= 72 * 60 * 60 * 1000) {
      //   await sendEmail(3, cart);
      //   // Set abandonedStatus to false after sending final email
      //   cart.abandonedStatus = false;
      //   await cart.save();
      // }
    });
  });

  async function sendEmail(templateIndex, cart) {
    const emailTemplate = emailTemplates[templateIndex];

    const sentMsg = new sendMessageModel({
      username: cart.username,
      email: cart.email,
      phone: cart.phone,
      abandonedStatus: cart.abandonedStatus,
      sendMessage: emailTemplate.subject,
      url: cart.url,
      orderId: cart.orderId,
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
