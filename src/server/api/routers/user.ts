import { Prisma } from "@prisma/client";
import { z } from "zod";
import { userSchema } from "~/lib/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({
      orderBy: { id: "desc" },
    });
  }),

  update: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      return ctx.db.user.update({
        where: { id },
        data: input,
      });
    }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      const { id } = input;
      return ctx.db.user.findMany({
        where: { id },
      });
    }),
});
