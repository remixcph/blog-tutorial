import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { deletePost, getPost, updatePost } from "~/models/post.server";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);

  return json({ post });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const slugOriginal = formData.get("slug-original");
  const markdown = formData.get("markdown");
  const intent = formData.get("intent");

  await new Promise((res) => setTimeout(res, 1000));

  invariant(typeof slugOriginal === "string", "slug must be a string");

  switch (intent) {
    case "delete": {
      await deletePost(slugOriginal);
      return redirect("/posts/admin");
    }
    case "update": {
      const errors = {
        title: title ? null : "Title is required",
        slug: slug ? null : "Slug is required",
        markdown: markdown ? null : "Markdown is required",
      };

      const hasErrors = Object.values(errors).some(
        (errorMessage) => errorMessage
      );
      if (hasErrors) {
        return json(errors);
      }

      invariant(typeof title === "string", "title must be a string");
      invariant(typeof slug === "string", "slug must be a string");
      invariant(typeof markdown === "string", "markdown must be a string");

      await updatePost(slugOriginal, { title, slug, markdown });

      return redirect(`/posts/admin/${slug}`);
    }
    default: {
      throw new Error(`Invalid intent: ${intent}`);
    }
  }
};

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isUpdating =
    navigation.formMethod === "PUT" &&
    Boolean(navigation.state === "submitting");
  const isDeleting =
    navigation.formMethod === "DELETE" &&
    Boolean(navigation.state === "submitting");

  return (
    <>
      <Form method="put">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              defaultValue={post.title}
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              defaultValue={post.slug}
              className={inputClassName}
            />
            <input
              type="hidden"
              name="slug-original"
              defaultValue={post.slug}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
            defaultValue={post.markdown}
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            name="intent"
            value="update"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isUpdating || isDeleting}
          >
            {isUpdating ? "Saving..." : "Update Post"}
          </button>
        </p>
      </Form>

      <Form method="delete">
        <p className="mt-4 text-right">
          <input type="hidden" name="slug-original" defaultValue={post.slug} />

          <button
            type="submit"
            name="intent"
            value="delete"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 disabled:bg-red-300"
            disabled={isDeleting || isUpdating}
          >
            {isDeleting ? "Deleting..." : "Delete Post"}
          </button>
        </p>
      </Form>
    </>
  );
}
