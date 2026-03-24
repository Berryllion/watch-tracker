import AnimatedTvIcon from "@/components/AnimatedTvIcon";
import { Button } from "@/components/ui/button";
import EmailField from "@/components/ui/email-field";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UsernameField from "@/components/ui/username-field";
import { PASSWORD_PLACEHOLDER } from "@/lib/utils";
import Link from "next/link";

function RegisterForm() {
  return (
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
            Already have an account? <Link href="login">Sign in</Link>
          </FieldDescription>
        </div>
        <EmailField />
        <UsernameField />
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            required
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={PASSWORD_PLACEHOLDER}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <Input
            required
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder={PASSWORD_PLACEHOLDER}
          />
        </Field>
        <Field>
          <Button type="submit">Sign up</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default RegisterForm;
