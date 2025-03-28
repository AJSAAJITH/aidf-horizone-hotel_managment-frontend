import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div>
      <main className="flex items-center justify-center min-h-screen px-4">
        <SignIn />
      </main>
    </div>
  );
};

export default SignInPage;
