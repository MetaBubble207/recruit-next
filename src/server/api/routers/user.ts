import {z} from "zod";

import {
    createTRPCRouter,
    publicProcedure,
} from "@/server/api/trpc";
import {eq} from "drizzle-orm";
import {users} from "@/server/db/schema";

export const userRouter = createTRPCRouter({

    checkMailStatus: publicProcedure
        .input(z.object({email: z.string().email()}))
        .query(({input, ctx}) => {
            return ctx.db.query.users.findFirst({where: eq(users.email, input.email)})
        }),
    create: publicProcedure
        .input(z.object({email: z.string().email(), password: z.string()}))
        .mutation(({ctx, input}) => {
            return ctx.db.insert(users).values({
                email: input.email,
                password: input.password,
            }).returning({id: users.id, email: users.email, password: users.password});
        }),
    getOneByIdentifier: publicProcedure
        .input(z.object({email: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.query.users.findFirst({where: eq(users.email, input.email)})
        }),
    updateVerified: publicProcedure
        .input(z.object({id: z.string(), emailVerified: z.date()}))
        .mutation(({ctx, input}) => {
            return ctx.db.update(users).set({
                emailVerified: input.emailVerified,
            }).where(eq(users.id, input.id)).returning({id: users.id, email: users.email, password: users.password});
        }),
});
