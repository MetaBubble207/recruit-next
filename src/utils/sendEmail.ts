// utils/sendEmail.ts
import nodemailer from 'nodemailer';
import process from "process";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465, // 对于 SMTP 协议，QQ 邮箱使用 465 或 587 端口
    secure: true, // 对于 465 端口，需要设置为 true
    auth: {
        user: process.env.NEXT_PUBLIC_EMAIL, // QQ 邮箱地址
        pass: process.env.NEXT_PUBLIC_EMAIL_AUTHORIZATION_CODE, // 您在步骤 1 中获取的授权码
    },
});

export const sendEmail = async (to, subject, html) => {
    const info = await transporter.sendMail({
        from: process.env.NEXT_PUBLIC_EMAIL, // 发件人
        to: to, // 收件人列表
        subject: subject, // 主题
        html: html, // 邮件内容
    });

    console.log('Message sent: %s', info.messageId);
};