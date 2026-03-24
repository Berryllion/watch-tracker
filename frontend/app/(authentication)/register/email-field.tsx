"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks";
import { EMAIL_PLACEHOLDER, validateEmail } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function EmailField() {
  const [ email, setEmail ] = useState("");
  const debouncedEmail = useDebounce(email, 300);

  const { data: available } = useQuery({
    queryKey: [ "email-check", debouncedEmail ],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/email-availability/${encodeURIComponent(debouncedEmail)}`,
      ).then((r) => r.json()),
    enabled: !!debouncedEmail && validateEmail(debouncedEmail),
    staleTime: 1000 * 30, // cache result for 30s: same email won't re-check
  });

  const emailUnavailable = email !== "" && available === false;

  return (
    <Field data-invalid={emailUnavailable}>
      <FieldLabel>Email</FieldLabel>
      <Input
        aria-invalid={emailUnavailable}
        type="email"
        placeholder={EMAIL_PLACEHOLDER}
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      {emailUnavailable && (
        <FieldDescription>Email already in use.</FieldDescription>
      )}
    </Field>
  );
}

export default EmailField;
