import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { AwaitedReactNode } from "react";

type ProtectedRouteProps = {
  redirectUrl?: string;
  children: AwaitedReactNode;
};

export default async function ProtectedRoute({
  children,
  redirectUrl,
}: ProtectedRouteProps) {
  const { isAuthenticated } = getKindeServerSession();
  const kindaLoginUrl = "/api/auth/login";
  const url = !redirectUrl
    ? kindaLoginUrl
    : kindaLoginUrl + `?post_login_redirect_url=${redirectUrl}`;

  if (!(await isAuthenticated())) {
    redirect(url);
  }

  return children;
}
