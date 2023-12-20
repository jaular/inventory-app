import { z } from "zod";
import { accSchema } from "~/lib/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const accRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.acc.findMany({
      include: {
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ n: z.string() }))
    .query(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.acc.findFirst({
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        where: { n },
      });
    }),

  create: protectedProcedure
    .input(accSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.acc.create({
        data: { ...input, createdBy: { connect: { id: ctx.session.user.id } } },
      });
    }),

  update: protectedProcedure
    .input(accSchema)
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.acc.update({
        where: { n },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ n: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.acc.delete({
        where: { n },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.acc.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),
});
