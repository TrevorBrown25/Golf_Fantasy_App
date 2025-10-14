// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';
// If deploying to a project page, set REPO_NAME to your repo (e.g., 'mhs-golf-dayz').
// For user/org pages or custom domain, leave it ''.
const REPO_NAME = process.env.NEXT_PUBLIC_REPO_NAME ?? '';

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd && REPO_NAME ? `/${REPO_NAME}` : '',
  assetPrefix: isProd && REPO_NAME ? `/${REPO_NAME}/` : '',
  trailingSlash: true
};
