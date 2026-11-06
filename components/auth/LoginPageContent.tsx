"use client";

import LoginBrandPanel from "./LoginBrandPanel";
import LoginForm from "./LoginForm";

export default function LoginPageContent() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pdam-bg p-4 sm:p-6">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg bg-white shadow-xl lg:grid-cols-2">
        <LoginBrandPanel />

        <section className="flex flex-col justify-center p-6 pt-0 sm:p-10 sm:pt-0 lg:p-12">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
