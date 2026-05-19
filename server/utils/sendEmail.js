const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  const emailUser = process.env.EMAIL_USER || "neetvinayakmg@gmail.com";
  const emailPass = process.env.EMAIL_PASS || "wusk afmj lkfn uaon";

  console.log(`[Email Service] Attempting to send email to: ${to}`);
  console.log(`[Email Service] Sender address: ${emailUser}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      html,
    });
    console.log(`[Email Service] Success! Message ID: ${info.messageId}`);
  } catch (error) {
    console.error("[Email Service] SMTP error occurred during email transmission:", error);
    throw error;
  }
};

module.exports = sendEmail;