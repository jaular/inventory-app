import { z } from "zod";
import { userSchema } from "~/lib/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findMany({
      orderBy: { id: "desc" },
    });
  }),

  update: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.db.user.update({
        where: { id },
        data: input,
      });
    }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      return await ctx.db.user.findMany({
        where: { id },
      });
    }),
});
