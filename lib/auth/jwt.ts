import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "./roles";

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  username: string;
  role: Role;
  nama: string;
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  type: "refresh";
}

function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function getRefreshSecret(): Uint8Array {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) throw new Error("REFRESH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getAccessSecret());
}

export async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getAccessSecret());
  return payload as AccessTokenPayload;
}

export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(token, getRefreshSecret());
  return payload as RefreshTokenPayload;
}
