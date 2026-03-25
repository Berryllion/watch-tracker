"use client"

import AnimatedTvIcon from "@/components/AnimatedTvIcon";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from "@/lib/utils";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, pending] = useActionState(loginAction, null)
console.log("state:", state)
  return (
    <form action={formAction} >
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
            name="email"
            id="email"
            type="email"
            placeholder={EMAIL_PLACEHOLDER}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            required
            name="password"
            id="password"
            type="password"
            placeholder={PASSWORD_PLACEHOLDER}
          />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldDescription>
          {state && state}
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}

export default LoginPage;
