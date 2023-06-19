# Remix blog tutorial

[Tutorial walkthrough](https://remix.run/docs/en/main/tutorials/blog#quickstart)

The completed tutorial code is in the `tutorial` branch

Based on the remix [indie stack](https://github.com/remix-run/indie-stack)

# Assignments

## Change layout to be nested + add pending states

Add short assignemnt description here

## Update/delete posts

Add short assignemnt description here

## Replace basic validation with remix-validated-form or zodix

Add short assignemnt description here

## Optimistic ui

Add short assignemnt description here

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
