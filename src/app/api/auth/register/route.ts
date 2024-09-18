import {v4 as uuidv4} from 'uuid';
import {NextApiRequest, NextApiResponse} from "next";
import {sendEmail} from "@/utils/sendEmail";
import {api} from "@/trpc/server";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed333'});
    }
    console.log("================",req.body);
    const {email, password}: { email: string, password: string } = req.body;
    console.log("email================",email)
    try {
        // 检查邮箱是否已被注册
        const existingUser = await api.user.checkMailStatus({email: email});
        console.log("================",existingUser)
        if (existingUser) {
            return res.status(400).json({error: 'Email already in use'});
        }

        // 加密密码
        const bcrypt = require("bcrypt");
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUser = await api.user.create({
            email: email,
            password: hashedPassword,
        })
        console.log("================",res)
        // 生成验证 token
        const verificationToken = uuidv4();
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        const veriTokensApi = await api.verificationTokens.create({
            identifier: email,
            token: verificationToken,
            expires: verificationTokenExpires,
        })
        console.log("================",res)

        const verificationUrl = `http://127.0.0.1/verify?token=${verificationToken}`;
        await sendEmail(email, 'Verify Your Email Address', verificationUrl);
        console.log("================",res)
        return res.status(201).json({message: 'User created. Please verify your email.'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
}
