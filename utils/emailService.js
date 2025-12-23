const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user, 
            pass: testAccount.pass, 
        },
    });

    let info = await transporter.sendMail({
        from: '"Nexus Security" <security@nexus.com>', 
        to: email, 
        subject: "Your 2FA Code", 
        text: `Your verification code is: ${otp}`, 
    });

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendOTP;