import { Button } from "@/components/ui/button";
import EmailField from "@/components/ui/email-field";
import {
    Field,
    FieldLabel,
    FieldSet
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UsernameField from "@/components/ui/username-field";
import { PASSWORD_PLACEHOLDER } from "@/lib/utils";
import { registerAction } from "./actions";

function RegisterPage() {
  return (
    <form action={registerAction}>
      <FieldSet>
        <EmailField />
        <UsernameField />
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            required
            name="password"
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
            name="confirm-password"
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder={PASSWORD_PLACEHOLDER}
          />
        </Field>
        <Field>
          <Button type="submit">Sign up</Button>
        </Field>
      </FieldSet>
    </form>
  );
}

export default RegisterPage;
