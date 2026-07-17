import { SignIn as ClerkSignIn } from "@clerk/react";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function SignIn() {
  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-secondary/5 py-12 px-4">
        <div className="w-full max-w-md">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            fallbackRedirectUrl="/admin" 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-md border-border rounded-2xl w-full",
                headerTitle: "font-serif text-primary text-2xl",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
                footerActionLink: "text-secondary hover:text-secondary/80",
                formFieldLabel: "text-foreground",
                formFieldInput: "border-border focus:ring-primary rounded-md"
              }
            }}
          />
        </div>
      </div>
    </PublicLayout>
  );
}
