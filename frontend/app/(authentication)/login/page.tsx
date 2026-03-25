"use client"

import { AlertDestructive } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { EMAIL_PLACEHOLDER, PASSWORD_PLACEHOLDER } from "@/lib/utils";
import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, formAction, pending] = useActionState(loginAction, null)


  const submitButton = (
    <Button type="submit" disabled={pending}>
      {pending ? <>
        <Spinner data-icon="inline-start" />
        <span className="sr-only">Logging in...</span>
      </> : "Login"}
    </Button>
  )

  const loginError = !!error && !pending
  const errorAlert = (
    loginError && (
      <AlertDestructive title="Login failed" description={error} />
    )
  )

  return (
    <form action={formAction} >
      <FieldSet>
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
          {submitButton}
        </Field>
        <FieldDescription>
          {errorAlert}
        </FieldDescription>
      </FieldSet>
    </form>
  );
}

export default LoginPage;
