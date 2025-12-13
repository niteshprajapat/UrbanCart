import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({});

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});



export const sendEmailVerificationToken = async (userEmail, token, userName) => {
    // try {
    //     const info = await transporter.sendMail({
    //         from: `LumeCrush <${process.env.EMAIL_USER}>`,
    //         to: userEmail,
    //         subject: "OTP for account verification",
    //         text: 'Account Verification OTP',
    //         html: `<p>OTP for your account verification: ${token}</p>`
    //     });

    //     console.log(`OTP email sent. ${info.messageId}`);

    // } catch (error) {
    //     console.log(error);
    // }


    const mailOptions = {
        from: {
            name: 'UrbanCart',
            address: process.env.EMAIL_USER,
        },
        to: userEmail,
        subject: 'Your UrbanCart OTP - Verify Your Account',
        text: `Hello ${userName}!\n\nYour OTP for account verification is: ${token}\n\nThis OTP is valid for 10 minutes only.\n\nTeam UrbanCart`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #e91e63;">Welcome to UrbanCart!</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Use the OTP below to verify your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e91e63;">
            ${token}
          </span>
        </div>
        <p>This OTP is valid for <strong>10 minutes only</strong>.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p style="color: #888; font-size: 12px;">Team UrbanCart</p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw new Error('Failed to send verification email');
    }
}



export const sendAccountVerificationEmail = async (userEmail, userName) => {

    const mailOptions = {
        from: {
            name: 'UrbanCart',
            address: process.env.EMAIL_USER,
        },
        to: userEmail,
        subject: 'Your UrbanCart Account is Verified  🎉',
        text: `Hello ${userName}!\n\nCongratulations! Your UrbanCart account has been successfully verified.

You can now log in and start shopping with ease.

If you did not perform this action, please contact our support team immediately.

— Team UrbanCart`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #4caf50;">🎉 Account Verified Successfully!</h2>
        <p>Hello <strong>${userName}</strong>,</p>

        <p>
          We're happy to let you know that your <strong>UrbanCart account has been verified</strong>.
        </p>

        <p>
          You can now log in and enjoy a smooth shopping experience.
        </p>

        <p style="margin-top: 30px;">
          If you did not verify this account, please contact our support team immediately.
        </p>

        <hr />
        <p style="color: #888; font-size: 12px;">
          © ${new Date().getFullYear()} UrbanCart. All rights reserved.
        </p>
      </div>


    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw new Error('Failed to send verification email');
    }
}
