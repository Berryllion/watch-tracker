"use client";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import api from "@/lib/api/client";
import { useDebounce } from "@/lib/hooks";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function UsernameField() {
  const [username, setUsername] = useState("");
  const debouncedUsername = useDebounce(username, 300);

  const { data: available } = useQuery({
    queryKey: ["username-check", debouncedUsername],
    queryFn: () => api.get(`/users/username-availability/${encodeURIComponent(debouncedUsername)}`),
    enabled: debouncedUsername !== "",
    staleTime: 1000 * 30, // cache result for 30s: same username won't re-check
  });

  const usernameTooShort = username !== "" && username.length < 4;
  const usernameUnavailable = username !== "" && available === false;
  const usernameInvalid = usernameUnavailable || usernameTooShort;

  return (
    <Field data-invalid={usernameInvalid}>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input
        aria-invalid={usernameInvalid}
        type="username"
        placeholder="Username"
        id="username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      {usernameUnavailable && (
        <FieldDescription>Username already in use.</FieldDescription>
      )}
      {usernameTooShort && (
        <FieldDescription>Username must be at least 4 characters.</FieldDescription>
      )}
    </Field>
  );
}

export default UsernameField;
