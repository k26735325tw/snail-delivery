import type { NextRequest } from "next/server";

const basicPrefix = "Basic ";

export function getCmsAdminPassword() {
  return process.env.CMS_ADMIN_PASSWORD?.trim() ?? "";
}

export function isCmsProtected() {
  return getCmsAdminPassword().length > 0;
}

export function isAuthorizedWithHeader(authorization: string | null) {
  const password = getCmsAdminPassword();

  if (!password) {
    return true;
  }

  if (!authorization || !authorization.startsWith(basicPrefix)) {
    return false;
  }

  try {
    const decoded = Buffer.from(authorization.slice(basicPrefix.length), "base64")
      .toString("utf8");
    const separator = decoded.indexOf(":");

    if (separator === -1) {
      return false;
    }

    const providedPassword = decoded.slice(separator + 1);
    return providedPassword === password;
  } catch {
    return false;
  }
}

export function isAuthorizedRequest(request: NextRequest) {
  return isAuthorizedWithHeader(request.headers.get("authorization"));
}

