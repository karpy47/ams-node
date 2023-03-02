'use strict'
const config = require('dotenv').config()
const nodemailer = require('nodemailer')
const Email = require('email-templates')
const path = require('path')

class Mailer {
  constructor (options) {
    // setup transporter
    this.transporter = nodemailer.createTransport({
      host: options?.host ?? process.env.EMAIL_HOST,
      port: options?.port ?? process.env.EMAIL_PORT,
      secure: options?.secure ?? (process.env.EMAIL_SECURE === 'TRUE'),
      auth: {
        user: options?.user ?? process.env.EMAIL_USER,
        pass: options?.pass ?? process.env.EMAIL_PASS
      }
    })
    // define sender
    this.sender = options?.user ?? process.env.EMAIL_USER
    const senderName = options?.sender ?? process.env.EMAIL_SENDER
    if (senderName) {
      this.sender = '"' + senderName + '" <' + this.sender + '>'
    }
    // setup email
    this.email = new Email({
      views: { root: path.resolve('services/mailTemplates') },
      message: { from: this.sender },
      send: !config.isTestEnv, // true to send actual emails (ie only in dev/oper env)
      transport: this.transporter
    })
  }

  async sendMail (to, subject, text, html) {
    const mailOptions = { to, subject, text, html, sender: this.sender }
    return this.transporter.sendMail(mailOptions)
  }

  async sendResetPassword (user) {
    await this.email.send({
      template: 'resetPassword',
      message: { to: user.email },
      locals: {
        resetLink: config.baseClientUrl + '/reset'
      }
    })
  }

  async sendWelcome (user) {
    await this.email.send({
      template: 'welcome',
      message: { to: user.email },
      locals: {
        invitedBy: 'Admin',
        welcomeLink: config.baseClientUrl + '/welcome'
      }
    })
  }
}

const mailer = new Mailer()

module.exports = { mailer }
