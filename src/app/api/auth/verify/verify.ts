// app/api/auth/verify.ts
import {NextApiRequest, NextApiResponse} from 'next';
import {api} from "@/trpc/react";

export default async function verifyEmail(req: NextApiRequest, res: NextApiResponse) {
    const {token} = req.query;

    if (!token) {
        return res.status(400).json({error: 'Invalid token'});
    }

    const {data: verificationToken} = api.verificationTokens.getOneByToken.useQuery({
        token: token,
    });

    if (!verificationToken) {
        return res.status(404).json({error: 'Verification token not found'});
    }

    const {data: user} = api.user.getOneByIdentifier.useQuery({
        email: verificationToken.identifier,
    });

    if (!user) {
        return res.status(404).json({error: 'User not found'});
    }

    // 标记用户邮箱为已验证
    api.user.updateVerified.useMutation().mutate({
        id: user.id,
        emailVerified: new Date(),
    });

    // 删除 verification token
    api.verificationTokens.delVerificationTokens.useMutation().mutate({identifier: verificationToken.identifier});

    return res.status(200).json({message: 'Email verified successfully'});
}