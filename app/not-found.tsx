"use client";

//TODO

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Error 404 - Page not found
        </h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or has been moved. Please
          check the URL or return to the homepage.
        </p>
      </div>
    </div>
  );
}
