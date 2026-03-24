"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function UsernameField() {
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 300);

  const { data: available } = useQuery({
    queryKey: ["username-check", debouncedUsername],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/username-availability/${encodeURIComponent(debouncedUsername)}`,
      ).then((r) => r.json()),
    enabled: !!debouncedUsername,
    staleTime: 1000 * 30, // cache result for 30s: same username won't re-check
  });

  const emailUnavailable = username !== "" && available === false;

  return (
    <Field data-invalid={emailUnavailable}>
      <FieldLabel>Username</FieldLabel>
      <Input
        aria-invalid={emailUnavailable}
        type="username"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      {emailUnavailable && (
        <FieldDescription>Username already in use.</FieldDescription>
      )}
    </Field>
  );
}

export default UsernameField;
