export function Error({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold text-red-500">Error</h1>
      <p className="text-lg text-red-700">{message}</p>
    </div>
  );
}
