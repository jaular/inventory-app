import { Prisma } from "@prisma/client";
import { z } from "zod";
import { postSchema } from "~/lib/schema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  serialNumber: true,
  modelName: true,
  createdBy: true,
});

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

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      include: {
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      // where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ n: z.string() }))
    .query(async ({ ctx, input }) => {
      const { n } = input;
      return ctx.db.post.findFirst({
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
      return ctx.db.post.create({
        data: { ...input, createdBy: { connect: { id: ctx.session.user.id } } },
      });
    }),

  update: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return ctx.db.post.update({
        where: { n },
        data: input,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ n: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { n } = input;
      return ctx.db.post.delete({
        where: { n },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
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
    .query(({ input, ctx }) => {
      const { id } = input;
      return ctx.db.user.findMany({
        where: { id },
      });
    }),
});
