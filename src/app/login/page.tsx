import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    // 🚨 ESTA es la forma correcta y automática de redirigir a Keycloak
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">ERP System</h1>
          <p className="text-gray-500 mt-2">Gestión empresarial integrada</p>
        </div>
        <LoginForm />
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("keycloak");
        }}
      >
        <button type="submit">Signin with Keycloak</button>
      </form>
      {/* <pre>{JSON.stringify(session)}</pre> */}
    </div>
  );
}
