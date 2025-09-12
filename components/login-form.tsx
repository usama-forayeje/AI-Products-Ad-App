"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Authentication from "@/app/_components/Authentication";
import { Sparkles, ArrowRight } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-6 max-w-lg mx-auto", className)}
      {...props}
    >
      <Card className="overflow-hidden p-1 shadow-2xl rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 transform hover:scale-[1.01] transition-transform duration-300">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-6 bg-background dark:bg-card rounded-[1.4rem] h-full">
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-center gap-2 mb-2 text-primary">
              <Sparkles className="h-7 w-7 text-orange-500 dark:text-orange-300 drop-shadow-lg" />
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm dark:text-primary">
                Welcome back
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to your account to continue your creative journey.
            </p>
          </div>

          <Authentication>
            <Button
              variant="secondary"
              className="relative cursor-pointer z-10 w-full flex items-center gap-3 py-7 rounded-xl text-lg font-bold shadow-md hover:shadow-xl transition-all duration-300 group
              bg-white/90 text-foreground border border-border/20
              dark:bg-card dark:text-primary-foreground dark:hover:bg-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-orange-500 dark:text-orange-300 transition-colors duration-300 group-hover:text-red-600 dark:group-hover:text-red-400"
              >
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-semibold text-lg dark:text-primary">Login with Google</span>
              <ArrowRight className="h-6 w-6 ml-auto text-muted-foreground transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </Authentication>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}