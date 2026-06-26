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
import { loginFn, sendPasswordResetEmailFn } from "@/lib/auth";
import * as m from "@/paraglide/messages";

type LoginFormProps = {
  switchToSignUp: () => void;
};

export function LoginForm({ switchToSignUp }: LoginFormProps) {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await loginFn({
        data: {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        },
      });
      router.invalidate();
    } catch (err: any) {
      setErrorMsg(err.message || m.auth_errorLogin());
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const originUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
      await sendPasswordResetEmailFn({
        data: {
          email: formData.get("email") as string,
          redirectTo: `${originUrl}/update-password`,
        },
      });
      setResetSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || m.auth_errorReset());
    } finally {
      setIsLoading(false);
    }
  };

  if (isForgotPassword) {
    if (resetSent) {
      return (
        <Card className="w-full shadow-xl border-none bg-background/80 backdrop-blur-xl">
          <Card.Header className="pt-6 pb-2 sm:pt-8 sm:pb-4 text-center">
            <Card.Title className="text-xl sm:text-2xl font-bold text-success">{m.auth_checkEmailTitle()}</Card.Title>
            <Card.Description className="text-sm text-muted-foreground">{m.auth_checkEmailDesc()}</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4 px-4 pb-6 sm:px-6 sm:pb-6">
            <Button variant="bordered" onClick={() => { setIsForgotPassword(false); setResetSent(false); }} className="w-full cursor-pointer mt-4">
              {m.auth_backToLogin()}
            </Button>
          </Card.Content>
        </Card>
      );
    }
    
    return (
        <Card className="w-full shadow-xl border-none bg-background/80 backdrop-blur-xl">
          <Card.Header className="pt-6 pb-2 sm:pt-8 sm:pb-4 text-center">
            <Card.Title className="text-xl sm:text-2xl font-bold">{m.auth_resetPassword()}</Card.Title>
            <Card.Description className="text-sm text-muted-foreground">{m.auth_resetPasswordDescription()}</Card.Description>
          </Card.Header>
          <Card.Content className="px-4 pb-6 sm:px-6 sm:pb-6">
            <Form className="flex flex-col gap-4" onSubmit={handleResetPassword}>
              {errorMsg && (
                <Alert status="danger" className="mb-2">
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

              <Button type="submit" color="primary" isPending={isLoading} className="w-full mt-4 font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
                {({ isPending }) => (
                  <>
                    {isPending && <Spinner color="current" size="sm" />}
                    {isPending ? m.auth_loginPending() : m.auth_sendResetEmail()}
                  </>
                )}
              </Button>

              <div className="text-center text-sm mt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="underline text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                >
                  {m.auth_backToLogin()}
                </button>
              </div>
            </Form>
          </Card.Content>
        </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl border-none bg-background/80 backdrop-blur-xl">
      <Card.Header className="pt-6 pb-2 sm:pt-8 sm:pb-4 text-center">
        <Card.Title className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">{m.auth_loginTitle()}</Card.Title>
        <Card.Description className="text-sm text-muted-foreground">{m.auth_loginDescription()}</Card.Description>
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
            <div className="flex justify-between items-center w-full">
              <Label>{m.auth_password()}</Label>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer bg-transparent border-0 p-0"
              >
                {m.auth_forgotPassword()}
              </button>
            </div>
            <Input placeholder="••••••••" variant="secondary" />
            <FieldError />
          </TextField>

          <Button type="submit" color="primary" isPending={isLoading} className="w-full mt-4 font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
            {({ isPending }) => (
              <>
                {isPending && <Spinner color="current" size="sm" />}
                {isPending ? m.auth_loginPending() : m.auth_loginButton()}
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-2">
            {m.auth_noAccount()}{" "}
            <button
              type="button"
              onClick={switchToSignUp}
              className="underline hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              {m.auth_switchToSignUp()}
            </button>
          </div>
        </Form>
      </Card.Content>
    </Card>
  );
}
