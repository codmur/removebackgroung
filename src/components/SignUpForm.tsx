import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Card,
  Button,
  Spinner,
  Alert,
} from "@heroui/react";
import { signUpFn } from "@/lib/auth";
import * as m from "@/paraglide/messages";

type SignUpFormProps = {
  switchToLogIn: () => void;
};

export function SignUpForm({ switchToLogIn }: SignUpFormProps) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signUpFn({
        data: {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
      });
      router.invalidate();
    } catch (err: any) {
      setErrorMsg(err.message || m.auth_errorSignUp());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-none bg-background/80 backdrop-blur-xl">
      <Card.Header className="pt-6 pb-2 sm:pt-8 sm:pb-4 text-center">
        <Card.Title className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">{m.auth_signUpTitle()}</Card.Title>
        <Card.Description className="text-sm text-muted-foreground">{m.auth_signUpDescription()}</Card.Description>
      </Card.Header>
      <Card.Content className="px-4 pb-6 sm:px-6 sm:pb-6">
        <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {errorMsg && (
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{errorMsg}</Alert.Title>
              </Alert.Content>
            </Alert>
          )}

          <TextField isRequired name="email" type="email">
            <Label>{m.auth_email()}</Label>
            <Input placeholder="m@example.com" variant="secondary" />
            <FieldError />
          </TextField>

          <TextField isRequired name="password" type="password">
            <Label>{m.auth_password()}</Label>
            <Input placeholder="••••••••" variant="secondary" />
            <FieldError />
          </TextField>

          <Button type="submit" color="primary" isPending={isLoading} className="w-full mt-4 font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
            {({ isPending }) => (
              <>
                {isPending && <Spinner color="current" size="sm" />}
                {isPending ? m.auth_signUpPending() : m.auth_signUpButton()}
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-2">
            {m.auth_hasAccount()}{" "}
            <button
              type="button"
              onClick={switchToLogIn}
              className="underline hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              {m.auth_switchToLogin()}
            </button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
}
