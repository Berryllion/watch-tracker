"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useDebounce } from "@/lib/hooks";
import { EMAIL_PLACEHOLDER, validateEmail } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function EmailField() {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounce(email, 300);

  const { data: available } = useQuery({
    queryKey: ["email-check", debouncedEmail],
    queryFn: () => api.get(`/users/email-availability/${encodeURIComponent(debouncedEmail)}`),
    enabled: debouncedEmail !== "" && validateEmail(debouncedEmail),
    staleTime: 1000 * 30, // cache result for 30s: same email won't re-check
  });

  const emailUnavailable = email !== "" && available === false;

  return (
    <Field data-invalid={emailUnavailable}>
      <FieldLabel htmlFor="email">Email</FieldLabel>
      <Input
        aria-invalid={emailUnavailable}
        type="email"
        placeholder={EMAIL_PLACEHOLDER}
        id="email"
        name="email"
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
