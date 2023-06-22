# Remix blog tutorial

[Tutorial walkthrough](https://remix.run/docs/en/main/tutorials/blog#quickstart)

The completed tutorial code is in the `tutorial` branch

Based on the remix [indie stack](https://github.com/remix-run/indie-stack)

# Development

- Initial setup:

  ```sh
  npm run setup
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

The database seed script creates a new user with some data you can use to get started:

- Email: `rachel@remix.run`
- Password: `racheliscool`

# Assignments

## Change layout to be nested

Similar to the `/posts/admin` route, we would like to keep the posts list visible while navigating between the different posts.

In order to do so, we can make a `posts.tsx` layout route (that renders an `<Outlet />`) to nest the other routes. The `posts.index.tsx` page could also be updated to not render the list twice.

🏆 Bonus points for removing the `/posts` layout nesting from the `/posts/admin` routes.

## Update/delete posts

Make a `posts.admin.$slug.tsx` page for your posts. This should open an edit page for the post that allows you to update the post or even delete it.

The links are already there in the sidebar, but they return 404! Create a new route that reads the posts, and puts them into the fields.

Almost all the code you need is already in `app/routes/posts.$slug.tsx` and `app/routes/posts.admin.new.tsx`. You just gotta put it together 🧩

🏆 Bonus points for having different redirects for update and delete.

## Replace basic validation with remix-validated-form or zodix

During the tutorial we had to add quite a bit of code to validate the form input data, both for the user facing validation and to make typescript happy.
In an application with lots of forms this can become tedious. The real-world remix applications that we have seen does not do it manually like this, instead premade tools or libraries are used.

A number of options exist but some good candidates are:

- [Remix Validated Form](https://www.remix-validated-form.io/) Complete client and server-side validation based on zod or yup schemas.
- [Zodix](https://github.com/rileytomasek/zodix) validates, parses and casts formData, params and query data server-side based on zod schemas. This is a more general, multipurpose lib than Remix Validated Form, but you will have to implement the client side validation yourself.

The assignment is to replace the validation code and the invariants in the `posts.admin.new.tsx` file with Remix Validated Form.

## Optimistic ui

You know how when you favorite a tweet, the heart goes red instantly and if the tweet is deleted it reverts back to empty? That's Optimistic UI: assume the request will succeed, and render what the user will see if it does.

So the assignment is to make it so when you hit "Create" it renders the new post's title in the left nav and the page renders the "Create a New Post" link.

## Authentication (lock down admin routes)

We would like to allow users to only have access to their resources in the admin routes. This means we will only return posts that belong to the user that is logged in.

In order to do so there are a few things we must go through:

- create a link between a `Post` and an `User`
  - update `schema.prisma` so we can add the `userId` field to the `Post` model (similar to the link between a `Note` and an `User`)
  - update `seeds.ts` so the current data still matches the new model
  - run `npm run setup` to apply the migration to the database
- in the admin routes only return the `Posts` that belong to the logged in user
  - update the loader from `routes/posts.admin.tsx` to get the id of the current user; there's some helper functions available in `sessions.server.ts`
    - in the loader function, we can use the request object to identify the current `session` based on the cookies from the headers (`getSession` method from `session.server.ts`)
    - the `session` can store any information about the logged in user, we will only need the id for filtering the `posts`
  - once we have the id, let's create a function that will return the posts based on that `userId` (`post.models.ts`) and use it in the loader
- when creating a new `Post` we will have to link it to the `User` that created it; we have to update the `action` of `posts.admin.new.tsx` to do so
  - using the same method as before, we will get the id of the logged in user
  - once we have the id, we must pass it to the function that creates the `Post` (`post.models.ts`)
