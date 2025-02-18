import { me } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Bell, Mail } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import UserPopover from "./_components/user-popover";

const Layout = async ({ children }: PropsWithChildren) => {
  const user = await me();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <header className="w-full border-b py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost">
            <Link href="/app">Soundcloud</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Bell fill="gray" stroke="gray" />
            </Button>
            <Button size="icon" variant="ghost">
              <Mail stroke="gray" className="stroke-[2.7]" />
            </Button>
            <UserPopover />
          </div>
        </div>
      </header>
      <main className="w-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;
