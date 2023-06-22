import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import { ValidatedForm, useField } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const validator = withZod(
  z.object({
    title: z
      .string()
      .min(12, { message: "A minimun of 12 chars is required for title." }),
    body: z
      .string()
      .min(144, { message: "A minimun of 12 chars is required for body." }),
  })
);

export const action = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null } },
      { status: 400 }
    );
  }

  const note = await createNote({ body, title, userId });

  return redirect(`/notes/${note.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <ValidatedForm
      validator={validator}
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <TextInput name="title" label="Title:" />
      <TextAreaInput name="body" label="Body:" />

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </ValidatedForm>
  );
}

type MyInputProps = {
  name: string;
  label: string;
};

export const TextInput = ({ name, label }: MyInputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
        {...getInputProps({ id: name })}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export const TextAreaInput = ({ name, label }: MyInputProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className="flex w-full flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <textarea
        rows={8}
        className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
        {...getInputProps({ id: name })}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};
