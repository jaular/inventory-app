import { z } from "zod";
import { postSchema, postTrackingSchema } from "~/lib/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // create: protectedProcedure
  //   .input(postSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const { serialNumber, modelName } = input;
  //     return ctx.db.post.create({
  //       data: {
  //         serialNumber: serialNumber,
  //         modelName: modelName,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // https://github.com/prisma/prisma/discussions/3087
  // getAll: protectedProcedure
  //   .input(z.object({ t: z.number() }))
  //   .query(async ({ ctx, input }) => {
  //     const { t } = input;
  //     const [data, total] = await ctx.db.$transaction([
  //       ctx.db.post.findMany({
  //         take: t,
  //         include: {
  //           createdBy: {
  //             select: { name: true },
  //           },
  //         },
  //         orderBy: { createdAt: "desc" },
  //         // where: { createdBy: { id: ctx.session.user.id } },
  //       }),
  //       ctx.db.post.count(),
  //     ]);

  //     return { data, total };
  //   }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany({
      include: {
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      // where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getTrackingAllById: protectedProcedure
    .input(z.object({ n: z.string() }))
    .query(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.postTracking.findMany({
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        where: { n },
        orderBy: { createdAt: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ n: z.string() }))
    .query(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.post.findFirst({
        include: {
          createdBy: {
            select: { name: true },
          },
        },
        where: { n },
      });
    }),

  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: { ...input, createdBy: { connect: { id: ctx.session.user.id } } },
      });
    }),

  createTracking: protectedProcedure
    .input(postTrackingSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.postTracking.create({
        data: { ...input, createdBy: { connect: { id: ctx.session.user.id } } },
      });
    }),

  update: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.post.update({
        where: { n },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ n: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return await ctx.db.post.delete({
        where: { n },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  // getUserById: protectedProcedure.query(({ input, ctx }) => {
  //   const { id } = input;
  //   return ctx.db.user.findMany({
  //     where: { id },
  //   });
  // }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      return await ctx.db.user.findMany({
        where: { id },
      });
    }),
});
