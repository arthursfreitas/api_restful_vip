import nodemail from 'nodemailer'

const transporter = nodemail.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

async function dataSendMail(
  to: string[],
  subject: string,
  text: string,
  html: string
) {
  const mailSent = await transporter.sendMail({
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  })

  return mailSent
}

export { dataSendMail }
