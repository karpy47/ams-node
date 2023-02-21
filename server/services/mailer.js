'use strict'
require('dotenv').config()
const nodemailer = require('nodemailer')

class Mailer {
  constructor (options) {
    // setup transporter
    this.transporter = nodemailer.createTransport({
      host: options.host ?? process.env.EMAIL_HOST,
      port: options.port ?? process.env.EMAIL_PORT,
      secure: options.secure ?? (process.env.EMAIL_SECURE === 'TRUE'),
      auth: {
        user: options.user ?? process.env.EMAIL_USER,
        pass: options.pass ?? process.env.EMAIL_PASS
      }
    })
    // define sender
    this.sender = options.user ?? process.env.EMAIL_USER
    const senderName = options.sender ?? process.env.EMAIL_SENDER
    if (senderName) {
      this.sender = '"' + senderName + '" <' + this.sender + '>'
    }
  }

  async sendMail (to, subject, text, html) {
    const mailOptions = { to, subject, text, html, sender: this.sender }
    return this.transporter.sendMail(mailOptions)
  }

  async sendTemplate (to, template, substitute) {
    const replace = (text, list) => (
      Object.entries(list).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value)
      })
    )
    return this.sendMail(
      to,
      replace(template.subject, substitute),
      replace(template.text, substitute),
      replace(template.html, substitute)
    )
  }
}

const mailer = new Mailer()

module.exports = { mailer }
