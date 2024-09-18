import {z} from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import {verificationTokens} from "@/server/db/schema";
import {eq} from "drizzle-orm";

export const verificationTokensRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({identifier: z.string(), token: z.string(), expires: z.date()}))
        .mutation(({ctx, input}) => {
            return ctx.db.insert(verificationTokens).values({
                identifier: input.identifier,
                token: input.token,
                expires: input.expires,
            }).returning({token: verificationTokens.token, expires: verificationTokens.expires});
        }),
    getOneByToken: publicProcedure
        .input(z.object({token: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.query.verificationTokens.findFirst({where: eq(verificationTokens.token, input.token)})
        }),
    delVerificationTokens: publicProcedure
        .input(z.object({identifier:z.string()}))
        .mutation(({ctx, input}) => {
            return ctx.db.delete(verificationTokens).where(eq(verificationTokens.identifier,input.identifier))
        })
});
