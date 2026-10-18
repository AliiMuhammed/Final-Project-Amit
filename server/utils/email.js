const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");
const path = require("path");
const { readFileSync } = require("fs");
require("../config/environment");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Bistro Bliss <${process.env.NODEMAILER_USER}>`;
  }

  newTransport() {
    if (!process.env.NODEMAILER_USER || !process.env.NODEMAILER_PASSWORD)
      throw new Error("Email delivery is not configured.");
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      disableFileAccess: true,
      disableUrlAccess: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const logoCid = "bistro-bliss-logo";
    const html = pug.renderFile(
      path.join(__dirname, `../views/emails/${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
        logoUrl: `cid:${logoCid}`,
      },
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html, {
        selectors: [{ selector: "img", format: "skip" }],
      }),
      attachments: [
        {
          filename: "bistro-logo.png",
          content: readFileSync(
            path.join(__dirname, "../public/bistro-logo.png"),
          ),
          contentType: "image/png",
          contentDisposition: "inline",
          cid: logoCid,
        },
      ],
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Bistro Bliss!");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Reset your Bistro Bliss password");
  }

  async sendVerified() {
    await this.send("emailVerified", "Your email has been verified");
  }
};
