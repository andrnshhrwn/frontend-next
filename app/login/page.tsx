import { Suspense } from "react";
import LoginPageContent from "@/components/auth/LoginPageContent";
import LoginLoading from "@/components/auth/LoginLoading";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginPageContent />
    </Suspense>
  );
}
