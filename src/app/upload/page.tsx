import { me } from "@/actions/auth";
import UploadTrackForm from "@/components/forms/track-upload";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const UploadPage = async () => {
  try {
    const _ = await me();
  } catch {
    return redirect("/login");
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      }
    >
      <main className="flex h-screen flex-col items-center justify-center">
        <UploadTrackForm />
      </main>
    </Suspense>
  );
};

export default UploadPage;
