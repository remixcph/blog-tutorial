import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

export const loader = async () => {
  const posts = await getPosts();
  return json({ posts });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main className="flex gap-2">
      <div>
        <h1>Posts</h1>

        <Link to="admin" className="text-red-600 underline">
          Admin
        </Link>

        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link to={post.slug} className="text-blue-600 underline">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full items-center justify-center">
        <Outlet />
      </div>
    </main>
  );
}
