import { Avatar as RadixAvatar } from "radix-ui";

export async function Avatar({
  className,
  user,
}: {
  className?: string;
  user: {
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
}) {
  return (
    <RadixAvatar.Root className={className}>
      <RadixAvatar.Image
        alt={`${user.firstName} ${user.lastName}`}
        src={user.avatar || undefined}
      />
      <RadixAvatar.Fallback>
        {user.firstName.length > 0 &&
          user.lastName.length > 0 &&
          user.firstName.charAt(0).toUpperCase() +
            user.lastName.charAt(0).toLocaleUpperCase()}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
