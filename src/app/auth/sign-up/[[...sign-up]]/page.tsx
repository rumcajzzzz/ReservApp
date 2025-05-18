import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">TempoBook</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
