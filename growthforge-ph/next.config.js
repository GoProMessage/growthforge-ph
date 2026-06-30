/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep heavy server-only packages as external requires (not bundled into the server bundle)
  // This prevents issues with packages that access `process` or Node internals at module level
  serverExternalPackages: ["@supabase/supabase-js"],
};

module.exports = nextConfig;
