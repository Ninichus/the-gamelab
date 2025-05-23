This is the repository of The Gamelab, a website created in 2025 for the eponym course. Its aim is to store games built by students taking this class.

## Architecture

The website is created in NextJS, using Typescript. It works along with a mysql (mariadb) database, as well as a MinIO Objects storage.

## Testing in local

- Clone this repo
- Create a .env file, non-versioned, whith sensitive environnment variables.
- Start a temporary database as well as a MinIO instance with `docker compose up -d`
- Apply migrations with `pnpm db:apply-migrations`
- Start the server with `pnpm dev`
- Open the website at [http://localhost:3000](http://localhost:3000)

If you change the schema of the database, you need to generate migrations with `pnpm db:generate-migrations`

## Deployment

When pushing to the gitlab, a CI/CD pipeline runs and automatically builds 2 docker images :

- db-migrations
- web

The first one contains everything necessary to apply migrations in production.
The second one contains the web application.

Upon completion, those images are stored on gitlab's container registry.

Then, a webhook sends an http post request to the production server. The latter pulls new images and restarts everything.

A nginx service runs on the server, handling routes. It redirects the-gamelab.cs-campus.fr toward gamelab.cs-campus.fr, and forces https.

## Authentication

We use ViaRézo's Oauth2 system to authenticate users.
Some pages are protected, only some users can access them, while others are public.
A middleware ensures private pages are not accessible by a non-connected user. Then a second layer, depending on the page, checks if the connected user is authorized.
