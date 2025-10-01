import Image from "next/image";

export function Logo() {
  return <Image src="/logo.svg" alt="Logo" width={100} height={100} className="text-foreground h-5 w-auto dark:invert" />;
}
