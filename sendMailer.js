const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const AbandonedCart = require("./Model/AbandonedCartModel");
const sendMessage = require("./Model/sentMessageModel");

async function sendMailer() {
  // Set up email transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "goodhealth.nodemailer@gmail.com",
      pass: "irzvgrfwbaxqwpsd",
    },
  });

  // Define email templates for each day
  const emailTemplates = [
    {
      subject: "Your cart is still waiting! you left it 1 minutes ago",
      message:
        "Hi {username},\n\nWe noticed that you left some items in your cart. Come back soon and complete your purchase!",
    },
    {
      subject: "Your cart is still waiting! you left it 2 minutes ago",
      message:
        "Hi {username},\n\nWe noticed that you left some items in your cart. Come back soon and complete your purchase!",
    },
    {
      subject: "Don't forget about your cart! you left it 2 minutes ago",
      message:
        "Hi {username},\n\nYour cart is still waiting for you! Take a look at the items you left behind and complete your purchase.",
    },
    {
      subject: "Last chance to complete your purchase! you left it 3 days ago",
      message:
        "Hi {username},\n\nThis is your final reminder to complete your purchase. Your cart will expire soon, so act fast!",
    },
  ];

  // Schedule function to run every minute
  cron.schedule("* * * * *", async () => {
    const abandonedCarts = await AbandonedCart.find({ abandonedStatus: true });

    abandonedCarts.forEach(async (cart) => {
      // Calculate time difference between now and cart creation
      const now = new Date();
      const cartCreated = cart.createdAt;
      const timeDiff = now.getTime() - cartCreated.getTime();

      // const sentMessage = await sendMessage.find({ username: cart.username });
      try {
        console.log(cart);
        if (cart.count === 0 && timeDiff < 1 * 60 * 1000) {
          cart.count += 1;
          await cart.save();
          await sendEmail(0, cart);
        } else if (cart.count === 1 && timeDiff < 2 * 60 * 1000) {
          cart.count += 1;
          await cart.save();
          await sendEmail(2, cart);
        } else if (cart.count === 2 && timeDiff < 3 * 60 * 1000) {
          cart.abandonedStatus = false;
          cart.count += 1;
          await cart.save();
          await sendEmail(3, cart);
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

    const sentMsg = new sendMessage({
      username: cart.username,
      email: cart.email,
      phone: cart.phone,
      abandonedStatus: cart.abandonedStatus,
      sendMessage: emailTemplate.subject,
      url: cart.url,
    });

    const mailOptions = {
      from: "your-email@gmail.com",
      to: cart.email,
      subject: emailTemplate.subject,
      text: emailTemplate.message.replace("{username}", cart.username),
    };

    try {
      await transporter.sendMail(mailOptions);
      sentMsg.save();
      console.log(`Email sent to ${cart.email}`);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = {
  sendMailer,
};
