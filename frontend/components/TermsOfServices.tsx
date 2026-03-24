import Link from "next/link";
import { FieldDescription } from "./ui/field";

function TermsOfServices() {
  return (
    <FieldDescription className="px-6 text-center">
      By clicking continue, you agree to our{" "}
      <Link href="#">Terms of Service</Link> and{" "}
      <Link href="#">Privacy Policy</Link>.
    </FieldDescription>
  );
}

export default TermsOfServices;
