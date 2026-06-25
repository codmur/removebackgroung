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
    <Card className="w-full">
      <Card.Header>
        <Card.Title>{m.auth_signUpTitle()}</Card.Title>
        <Card.Description>{m.auth_signUpDescription()}</Card.Description>
      </Card.Header>
      <Card.Content>
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

          <Button type="submit" isPending={isLoading} className="w-full">
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
