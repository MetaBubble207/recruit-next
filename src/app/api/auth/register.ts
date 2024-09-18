import {v4 as uuidv4} from 'uuid';
import {NextApiRequest, NextApiResponse} from "next";
import {api} from "@/trpc/react";
import {sendEmail} from "@/utils/sendEmail";

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    console.log(req)
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed123'});
    }

    const {email, password}: { email: string, password: string } = req.body;

    try {
        // 检查邮箱是否已被注册
        const existingUser = api.user.checkMailStatus.useQuery({email: email});

        if (existingUser) {
            return res.status(400).json({error: 'Email already in use'});
        }

        // 加密密码
        const bcrypt = require("bcrypt");
        const hashedPassword: string = await bcrypt.hash(password, 10);

        // 创建新用户
        const newUserApi = api.user.create.useMutation();
        const newUser = newUserApi.mutate({
            email: email,
            password: hashedPassword,
        })

        // 生成验证 token
        const verificationToken = uuidv4();
        const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        const veriTokensApi = api.verificationTokens.create.useMutation();
        veriTokensApi.mutate({
            identifier: email,
            token: verificationToken,
            expires: verificationTokenExpires,
        })


        const verificationUrl = `http://127.0.0.1/verify?token=${verificationToken}`;
        await sendEmail(email, 'Verify Your Email Address', verificationUrl);

        return res.status(201).json({ message: 'User created. Please verify your email.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error'});
    }
}