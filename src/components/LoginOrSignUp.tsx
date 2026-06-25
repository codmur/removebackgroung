import { useState } from "react";
import { Segment } from "@heroui-pro/react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";

export const LoginOrSignUp = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <div className={cn("flex flex-col items-center gap-6 max-w-xl mx-auto p-12")}>
  

      <Segment
        selectedKey={activeTab}
        onSelectionChange={(key: any) => setActiveTab(String(key))}
        size="lg"
      >
        <Segment.Item id="login">
          <Segment.Separator />
          {m.auth_loginTab()}
        </Segment.Item>
        <Segment.Item id="signup">
          <Segment.Separator />
          {m.auth_signUpTab()}
        </Segment.Item>
      </Segment>

      <div className="w-full transition-all duration-300">
        {activeTab === "login" ? (
          <LoginForm switchToSignUp={() => setActiveTab("signup")} />
        ) : (
          <SignUpForm switchToLogIn={() => setActiveTab("login")} />
        )}
      </div>
    </div>
  );
};
