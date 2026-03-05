const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");

const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = Number(
  process.env.JWT_REFRESH_EXPIRES_DAYS || 7,
);

const createAccessToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tv: Number(user.token_version || 0),
    },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );

const createRefreshToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      tokenType: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: `${REFRESH_TOKEN_EXPIRY_DAYS}d` },
  );

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getRefreshExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return expiresAt.toISOString();
};

const saveRefreshToken = async ({ refreshToken, userId, ip, userAgent }) => {
  const tokenHash = hashToken(refreshToken);

  const { error } = await supabase.from("user_refresh_tokens").insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: getRefreshExpiryDate(),
    created_by_ip: ip || null,
    user_agent: userAgent || null,
  });

  if (error) throw error;
};

const revokeRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  const { error } = await supabase
    .from("user_refresh_tokens")
    .update({ revoked_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .is("revoked_at", null);

  if (error) throw error;
};

const findValidRefreshToken = async (refreshToken) => {
  const tokenHash = hashToken(refreshToken);

  const { data, error } = await supabase
    .from("user_refresh_tokens")
    .select("id, user_id, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .single();

  if (error || !data) return null;

  const isExpired = new Date(data.expires_at) <= new Date();
  if (isExpired) return null;

  return data;
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api/auth",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  saveRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
  ACCESS_TOKEN_EXPIRY,
};
