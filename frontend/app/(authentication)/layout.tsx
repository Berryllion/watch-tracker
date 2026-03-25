import AnimatedTvIcon from "@/components/AnimatedTvIcon";
import { FieldDescription } from "@/components/ui/field";
import Link from "next/link";
import HeaderDescription from "./_components/header-description";

function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link
            href=""
            className="flex flex-col items-center gap-2 font-medium"
          >
            <AnimatedTvIcon />
            <span className="sr-only">Acme Inc.</span>
          </Link>
          <h1 className="text-xl font-bold">Watch Tracker.</h1>
          <FieldDescription>
            <HeaderDescription />
          </FieldDescription>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthenticationLayout;
