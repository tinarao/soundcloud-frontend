import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1>Soundcloud</h1>
      <Button asChild>
        <Link href="/app">
          <Play /> Найти новую музыку
        </Link>
      </Button>
    </div>
  );
}
