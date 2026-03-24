import { cn, EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AnimatedTvIcon from "@/components/AnimatedTvIcon";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
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
              Don&apos;t have an account? <Link href="register">Sign up</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              required
              id="email"
              type="email"
              placeholder={EMAIL_PLACEHOLDER}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              required
              id="password"
              type="password"
              placeholder={PASSWORD_PLACEHOLDER}
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
