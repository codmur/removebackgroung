import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { updatePasswordFn, setSessionFn, exchangeCodeFn } from "@/lib/auth";
import { Card, Form, TextField, Label, Input, FieldError, Button, Spinner, Alert } from "@heroui/react";
import * as m from "@/paraglide/messages";

export const Route = createFileRoute("/update-password")({
  component: UpdatePasswordComponent,
});

function UpdatePasswordComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Check for PKCE Code first (Query params)
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code");

      // Check for Hash tokens (Implicit flow)
      const hashStr = location.hash || window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hashStr.startsWith('#') ? hashStr.substring(1) : hashStr);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      try {
        if (code) {
          await exchangeCodeFn({ data: { code } });
          navigate({ to: "/update-password", replace: true, search: {} });
        } else if (accessToken && refreshToken) {
          await setSessionFn({ data: { access_token: accessToken, refresh_token: refreshToken } });
          navigate({ to: "/update-password", replace: true, hash: "" });
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Error verificando enlace: " + err.message);
      } finally {
        setSessionLoading(false);
      }
    };

    checkSession();
  }, [location.hash, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorMsg(m.auth_passwordsDoNotMatch());
      setIsLoading(false);
      return;
    }

    try {
      await updatePasswordFn({ data: { password } });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || m.auth_errorReset());
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-background">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm text-muted-foreground">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-background">
      <div className="max-w-md w-full">
        {success ? (
          <Card className="w-full border border-success/30 shadow-lg">
            <Card.Header>
              <Card.Title className="text-success">{m.auth_passwordUpdated()}</Card.Title>
            </Card.Header>
            <Card.Content>
              <Button 
                variant="solid"
                color="primary"
                className="w-full cursor-pointer rounded-xl font-medium" 
                onClick={() => navigate({ to: "/projects" })}
              >
                Continuar
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card className="w-full shadow-lg border border-border/60">
            <Card.Header>
              <Card.Title className="text-xl font-bold">{m.auth_updatePasswordTitle()}</Card.Title>
              <Card.Description>{m.auth_updatePasswordDesc()}</Card.Description>
            </Card.Header>
            <Card.Content>
              <Form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {errorMsg && (
                  <Alert status="danger" className="rounded-lg">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title className="text-sm font-semibold">{errorMsg}</Alert.Title>
                    </Alert.Content>
                  </Alert>
                )}

                <TextField isRequired name="password" type="password">
                  <Label className="text-sm font-medium">{m.auth_newPassword()}</Label>
                  <Input placeholder="••••••••" variant="secondary" className="rounded-xl" />
                  <FieldError className="text-xs text-danger mt-1" />
                </TextField>

                <TextField isRequired name="confirmPassword" type="password">
                  <Label className="text-sm font-medium">{m.auth_confirmNewPassword()}</Label>
                  <Input placeholder="••••••••" variant="secondary" className="rounded-xl" />
                  <FieldError className="text-xs text-danger mt-1" />
                </TextField>

                <Button type="submit" isPending={isLoading} variant="solid" color="primary" className="w-full cursor-pointer mt-2 rounded-xl font-medium shadow-md">
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      {isPending ? "Actualizando..." : m.auth_updatePasswordButton()}
                    </>
                  )}
                </Button>
              </Form>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
}
