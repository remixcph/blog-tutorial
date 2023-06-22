import type { Post } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getPosts() {
  return prisma.post.findMany();
}

export async function getPostsByUserId(userId: string) {
  return prisma.post.findMany({ where: { userId } });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown" | "userId">
) {
  return prisma.post.create({ data: post });
}
