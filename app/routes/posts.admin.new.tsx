import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createPost } from "~/models/post.server";

import {
  ValidatedForm,
  useField,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const validator = withZod(
  z.object({
    title: z.string().min(1, { message: "Title is required" }),
    slug: z.string().min(1, { message: "Slug name is required" }),
    markdown: z.string().min(1, { message: "Markdown content is required" }),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  await new Promise((res) => setTimeout(res, 1000));

  await createPost(result.data);

  return redirect("/posts/admin");
};

export default function NewPost() {
  return (
    <ValidatedForm method="post" validator={validator}>
      <Input name="title" label="Post Title" />
      <Input name="slug" label="Post Slug" />

      <Textarea name="markdown" label="Markdown" />

      <p className="text-right">
        <SubmitButton />
      </p>
    </ValidatedForm>
  );
}

type InputProps = {
  name: string;
  label: string;
};

export const Input = ({ name, label }: InputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <p>
      <label htmlFor={name}>
        {`${label}: `}
        {error && <em className="text-red-600">{error}</em>}
        <input {...getInputProps({ id: name, className: inputClassName })} />
      </label>
    </p>
  );
};

type TextareaProps = {
  name: string;
  label: string;
};

export const Textarea = ({ name, label }: TextareaProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <p>
      <label htmlFor={name}>
        {`${label}: `}
        {error && <em className="text-red-600">{error}</em>}
        <textarea
          {...getInputProps({
            id: name,
            rows: 20,
            className: `${inputClassName} font-mono`,
          })}
        />
      </label>
    </p>
  );
};

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();

  return (
    <button
      type="submit"
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Creating..." : "Create Post"}
    </button>
  );
};
