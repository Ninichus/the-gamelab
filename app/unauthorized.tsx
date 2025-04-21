"use client";

export default function GlobalError() {
  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unauthorized
        </h1>
        <p className="mt-4 text-muted-foreground">
          You don&apos;t have permission to access this page. Please log in or
          contact support for assistance.
        </p>
      </div>
    </div>
  );
}
