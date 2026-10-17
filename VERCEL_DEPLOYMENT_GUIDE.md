# Bistro Bliss deployment guide

Updated 17 October 2026 after authorized live integration tests. Atlas, Cloudinary and Gmail credentials are configured locally; do not recreate them. Disposable CRUD/media tests and one specifically approved temporary administrator were used and cleaned up. No real email, cloud permission/network change, commit, push, merge, provisioning or deployment was performed. Review `DEPLOYMENT_READINESS_REPORT.md` before authorizing a Preview.

## 1. Local preparation and credential replacement

Use the existing repository and feature branch:

```bash
cd ~/Documents/Final-Project-Amit
git status --short --branch
nvm use
npm --prefix server ci
npm --prefix bistro ci
cp -n server/.env.example server/.env
cp -n bistro/.env.example bistro/.env
chmod 600 server/.env
```

Use Node 24.x for both projects. `cp -n` preserves existing local configuration. Edit the new `.env` files privately. Restart any running development processes after installing dependencies or changing configuration. No values from the old `server/config.env` should be reused. That file is ignored, no longer tracked, no longer loaded, and preserved locally with owner-only permissions. `.vercelignore` also excludes local backend credential files from CLI uploads.

The previous tracked configuration exposed a database password, JWT signing secret, and email credentials. Treat them as compromised. Generate a new JWT secret independently; replace/revoke the old email app password through the account you control. The old Atlas account is inaccessible: its credentials cannot be assumed revoked. History cleanup would require a separately authorized coordinated Git history rewrite; removing the file in this branch does not erase old commits.

Generate a new JWT secret locally:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Store the result in your password manager and backend environment only. Never paste secrets into an issue, frontend variable, screenshot, or Git commit.

## 2. Verify the configured Atlas cluster and restrict access

The new `bistro-bliss-cluster`, `bistro_bliss` database and `bistro-app` database user are already configured. Live SRV/authentication/ping and authorized application CRUD passed. Do not recreate the cluster or attempt old-account recovery.

1. **Resolve excessive privileges before release.** Effective-role inspection found `readWriteAnyDatabase` on `admin`. Through an owner-authorized Atlas Database Access operation, replace this with `readWrite` on **`bistro_bliss` only**, restricting cluster access where available. Do not grant database administration or wildcard access. This guide records the required owner operation; Codex did not change permissions. See [database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/).
2. Review Network Access entries in the Atlas console. Local connectivity was verified, but the control-plane allowlist was not inspected. Prefer your current development IP as a temporary `/32`; do not assume that a successful ping proves least privilege or safe Vercel networking. See [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
3. Preserve the privately configured URI with its explicit `/bistro_bliss` database and Atlas authentication options. If credentials are rotated, obtain the actual URI from this cluster's Connect → Drivers dialog and percent-encode reserved password characters. Never invent a cluster hostname or expose the URI.
4. Rerun the read-only diagnostic after role/network changes:

   ```bash
   npm --prefix server run db:check
   ```

   It verifies SRV DNS, authentication, connectivity and ping without writing records. It does not prove CRUD rights; repeat authorized disposable CRUD separately after narrowing permissions.
5. Keep local `FRONTEND_URL=http://localhost:3000` and `PUBLIC_API_URL=http://localhost:4000` for normal use. Integration used a temporary explicit API port 4001 to preserve an existing owner process on 4000; this does not change production defaults. Restart existing local processes to load the corrected connector/logout code.
6. Configure separate least-privilege Preview credentials/database where possible, with Production secrets separate. No Vercel credentials or resources were created in this task. Never broaden database roles to make another database test pass.

### Empty database and original data

The models use collections `users` (`User`), `menus` (`Menu`), and `bookings` (`Bookings`). The connector explicitly creates missing collections and awaits schema indexes, including unique email, before database-dependent requests proceed. A temporary initialization failure returns a safe 503 and can retry. It never drops collections or indexes. Initial inspection found no collections/records. After authorized testing, the three collections remain empty with the unique email index preserved. No original users, reservations or menu records were recovered. An empty menu returns an empty array and displays “No items found”; empty booking lists remain valid.

No trustworthy structured menu seed was found, so no automatic or invented production seed was added. Original image bytes are preserved in `server/upload/`; those files alone cannot reconstruct menu names, prices, or bookings. Add owner-approved menu content through the admin UI with new uploads. The build copies the repository images to `server/public/legacy/` for native Vercel static serving. Existing filename references continue to resolve through `fileUrl`; new media references are Cloudinary HTTPS URLs.

### Initial administrator — explicit owner authorization required

The separately approved disposable administrator was deleted after testing; no permanent administrator or default password exists. No administrator is created automatically. On the new isolated database, register the intended owner's account normally with a unique password. Verify the exact email and document `_id`. Only after the owner explicitly authorizes that identity as administrator, use Atlas **Browse Collections → bistro_bliss → users** to change **only that document's** `role` to `admin`. Sign in again and verify the admin pages and API permissions. Record the approved identity privately. Public signup and profile/admin profile edits cannot grant roles. Never make all users admins or store a plaintext password in Atlas; registration performs bcrypt hashing.

## 3. Atlas network access from Vercel

Vercel outbound addresses are dynamic by default. A frontend/backend domain's inbound IP is not a reliable Atlas allowlist entry. Prefer approved stable egress and restrict Atlas to those addresses. Vercel documents [Static IPs / Secure Compute](https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address); these options may require paid plans and must not be enabled without approval.

If a Free-tier demonstration cannot use restricted stable egress, stop for explicit owner approval before adding `0.0.0.0/0` to Atlas. That admits connection attempts from the entire internet; TLS and strong database credentials still apply, but the network restriction is lost. Use a dedicated least-privilege demo user/database, a time-limited entry where available, no sensitive records, and remove the broad entry after the demonstration. It is not a silent production default. No Atlas network access was changed during this task.

## 4. Cloudinary and email setup

Cloudinary credentials are already configured and actual signed upload/replacement/deletion passed. Keep using the owner-controlled product environment, review quotas, and do not purchase upgrades without approval. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` only in backend local/Preview/Production environments. Use a separate product environment/account for Preview when possible. No unsigned upload preset is required; the backend signs uploads. [Cloudinary Node uploads](https://cloudinary.com/documentation/node_image_and_video_upload) describes the API.

Menu uploads remain admin-only using field `photo`; profile uploads require login and use field `image`. Images must be valid decodable images, at most 3 MB and 25 million input pixels. Sharp auto-orients and converts them to 500×500 JPEG, quality 90. Cloudinary returns an HTTPS reference stored in the existing `file` property and exposed by `fileUrl`. The size limit leaves room for multipart fields below Vercel's request limit. Failed database writes trigger removal of newly uploaded media; successful replacements/deletions remove only app-managed Cloudinary assets. Original repository files are never deleted. Cross-service cleanup is best effort: interruptions or Cloudinary deletion failures may leave an unreferenced asset; monitor the explicit cleanup log and reconcile before manual deletion. MongoDB and Cloudinary do not share a transaction.

For password recovery, use a controlled Gmail account with MFA and a **new app password** (not the normal sign-in password). Configure `NODEMAILER_USER` and `NODEMAILER_PASSWORD`; the sender follows that account. Confirm Gmail permits app passwords for your account, or separately adapt the mail provider if unavailable. Reset links use the configured frontend origin and expire after 10 minutes. The email logo is copied from the existing repository artwork into backend public assets; the reset template no longer depends on a previous Cloudinary account. Gmail SMTP authentication passed live. Reset hashing, expiry, single use, template generation and real Atlas password updates passed with a captured SMTP boundary; these are classified **PASS — MOCKED** for the combined workflow. No real email was sent and delivered HTML/logo rendering remains unverified. After approval, test only with an owner-controlled recipient. See [Nodemailer SMTP](https://nodemailer.com/smtp).

## 5. Environment variable reference

Frontend variables are public build-time values. Backend values belong only in the backend project's environment settings. Use Vercel's sensitive variable storage for credentials and separate Preview/Production scopes.

| Variable | Purpose | Local file | Vercel scope / requirement |
|---|---|---|---|
| `REACT_APP_API_URL` | Backend origin, no path/query; HTTPS for production builds | `bistro/.env` | Frontend Preview/Production; required for deployed app; rebuild on change |
| `NODE_ENV` | Runtime mode | `server/.env`, `development` locally | Backend `production` for Preview and Production |
| `PORT` | Local listener port, default 4000 | `server/.env` | Omit on Vercel |
| `MONGODB_URI` | New cluster URI with explicit database name | `server/.env` | Backend secret; required |
| `JWT_SECRET` | Independent random signing secret, at least 32 characters | `server/.env` | Backend secret; required |
| `JWT_EXPIRES_IN` | Positive duration such as `7d`; defaults to `7d` | `server/.env` | Backend, optional |
| `FRONTEND_URL` | Exact authorized frontend origin and reset-link origin | `server/.env` | Backend, required; HTTPS in production mode |
| `PUBLIC_API_URL` | Backend origin for preserved repository image URLs | `server/.env` | Backend, required in production mode; HTTPS |
| `NODEMAILER_USER` | Controlled Gmail sender | `server/.env` | Backend; required for reset emails |
| `NODEMAILER_PASSWORD` | New Gmail app password | `server/.env` | Backend secret; required for reset emails |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary product environment | `server/.env` | Backend; required for uploads/cleanup |
| `CLOUDINARY_API_KEY` | Signed upload API key | `server/.env` | Backend credential; required for uploads/cleanup |
| `CLOUDINARY_API_SECRET` | Signed upload secret | `server/.env` | Backend secret; required for uploads/cleanup |

`DATABASE`, `DATABASE_PASSWORD`, `JWT_COOKIE_EXPIRES_IN`, and the old `config.env` loader are retired. Authentication consistently uses the existing Bearer token flow; the API no longer issues unused JWT cookies and the frontend does not send cross-origin credentials. Logout removes local storage and each request reads the current token. Local-storage tokens retain the existing XSS exposure tradeoff; use only trusted scripts/content. Wrong-password errors leave the current session available for retry. Password changes save the returned fresh token on the frontend.

CORS accepts exactly one configured origin per backend environment. Production and Preview therefore require different scoped `FRONTEND_URL` values. Pin/assign a stable Preview alias for the frontend and backend, or update the exact Preview origins and rebuild/redeploy after approval. Do not use wildcard authenticated CORS or match every `*.vercel.app` origin. Public `/legacy/*` assets have separate wildcard read-only CORS headers for existing anonymous image tags.

## 6. Backend Vercel project — after explicit Preview approval

Project creation/import can trigger a deployment. Do not click Deploy, connect automatic Git deploys, push this branch, or provision resources before the owner approves those actions.

1. Review the local diff and readiness report. First restrict Atlas privileges, approve/test an owner-controlled email recipient, confirm credential rotation, and remediate or explicitly accept the documented frontend advisories for an isolated Preview. No deployment approval is implied by successful local tests.
2. **Prefer an explicitly approved local CLI Preview** of the existing feature branch, including reviewed uncommitted files, without a Git push. Use the repository root for both projects; do not invoke the monorepo CLI from `server` or `bistro`. Select the linked project before each deployment and preserve its Root Directory setting. Project creation/linking and deployment require owner authorization. See [Vercel monorepo CLI instructions](https://vercel.com/docs/monorepos#add-a-monorepo-through-vercel-cli).
3. If a Git workflow is separately authorized, push only `chore/vercel-fullstack-mongodb-migration`, then import each project from that reviewed branch. Do not merge or deploy unchanged `main`. If the import UI cannot select the intended branch before triggering deployment, use the approved CLI path instead. Neither path was executed here.
4. Suggested project name: `bistro-bliss-api`; **Root Directory `server`**, **Framework Express**, **Node 24.x**, **Install Command `npm ci`**, **Build Command `npm run build`**, no frontend output-directory override. Choose a function region close to Atlas. `app.js` exports Express directly; `server.js` is only a local listener. No serverless wrapper or `api/` rewrite is used. See [native Express on Vercel](https://vercel.com/docs/frameworks/backend/express) and [supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
5. Set all backend Preview variables from the table. Use your actual approved frontend Preview alias in `FRONTEND_URL` and backend alias in `PUBLIC_API_URL`. Add secrets privately.
6. Keep the checked-in `server/vercel.json`: it declares the native framework, includes dynamic Pug email templates, and sets headers for public legacy assets. The build copies the original uploads into `public/legacy`. Native Vercel ignores `express.static()`; it serves `public/` through the CDN.
7. Trigger the explicitly approved **Preview**, with deployment protection as appropriate. `/health` should return `{"status":"ok","database":"not_checked"}`. `/health/db` should return `{"status":"ok","database":"connected"}`; a 503 means the API is reachable but the database check failed. Inspect logs privately without exposing credentials.
8. Review deployment protection so the frontend can reach this backend; an authentication/HTML protection page is not an API JSON response. Any protection change is an owner decision.

After both projects/settings/Preview secrets and aliases are approved, these are the explicit CLI actions from the repository root. They were **not executed** during this task:

```bash
cd /home/https_ali_muhammed/Documents/Final-Project-Amit
git branch --show-current
vercel link --project bistro-bliss-api
# Confirm linked project, Root Directory server, and backend Preview variables.
vercel deploy --target=preview
vercel link --project bistro-bliss
# Confirm linked project, Root Directory bistro, and frontend Preview API origin.
vercel deploy --target=preview
```

Use an owner-approved current Vercel CLI and authenticated team. Stop if the CLI proposes Production or an unexpected project/root. Do not pass `--prod`; the explicit target selects Preview. Verify the displayed branch is `chore/vercel-fullstack-mongodb-migration` and that branch-specific Preview variables/aliases apply. Source deployment uploads local reviewed changes; it does not commit or push them. See [deploy command](https://vercel.com/docs/cli/deploy). Check ignore rules before upload: local `.env`, `config.env`, `.vercel` and dependency directories are excluded; never include test credentials.

## 7. Frontend Vercel project — after explicit Preview approval

1. Create the second approved project from the same reviewed branch/repository, suggested name `bistro-bliss`.
2. Use **Root Directory `bistro`**, **Framework Create React App**, **Node 24.x**, **Install Command `npm ci`**, **Build Command `npm run build`**, **Output Directory `build`**.
3. Set frontend Preview `REACT_APP_API_URL` to the actual approved backend HTTPS origin, without path/query. Set no database, JWT, SMTP or Cloudinary secrets in frontend variables.
4. Assign the frontend Preview alias and ensure the backend Preview `FRONTEND_URL` exactly matches it. Rebuild after configuration changes. Keep Production variables separate.
5. `bistro/vercel.json` rewrites application routes to `index.html`, excluding `/static/` and file-like paths so missing assets retain 404 behavior. Verify direct opening and refreshing `/login`, `/register`, `/menu`, `/booking`, `/profile/<id>`, `/admin/home` and `/resetPassword/<token>`. Anonymous profile/admin access should redirect; the API enforces the actual authorization.
6. Keep CRA. The existing `netlify.toml` is a legacy Netlify-only fallback and is ignored by Vercel; no active Netlify configuration was changed.

## 8. Local checks and approved deployment validation

```bash
npm --prefix server test
npm --prefix server run build
npm --prefix server audit --omit=dev
CI=true npm --prefix bistro test -- --watchAll=false --runInBand
CI=true REACT_APP_API_URL=https://api.example.com npm --prefix bistro run build
```

The build command's `api.example.com` is a deliberately non-live test origin. Replace it with your real approved backend origin for use. To run locally after filling the `.env` files: `npm --prefix server start` (or `run dev`) and `npm --prefix bistro start`.

The local authorized disposable-data campaign has already passed and its records/assets were removed. Do not reuse its deleted account IDs or tokens. For a separately approved hosted Preview, repeat the following with newly authorized disposable records or isolated test credentials:

1. Run `db:check` from an allowlisted machine; check both health endpoints on the approved backend.
2. Verify `GET /menu` works when empty, returns JSON, and accepts the exact frontend CORS origin. Requests from an unrelated browser origin must fail.
3. Register an owner-approved test customer; log in, browse menu, create a future booking, inspect booking history and update profile/text/image/password. Wrong current-password entry must allow retry; logout must remove the Bearer header on later requests.
4. After separately authorized admin promotion, log in as admin. Create/edit/delete an approved test menu item, upload an image, approve and reject a booking, edit/disable/reactivate a test user. Confirm a customer receives 403 for admin mutations and sees only their own bookings/counts even when changing `?user=`.
5. Use an owner-controlled email address for the approved password-reset delivery test. Confirm the HTTPS frontend link, expiration, new password login and one-time token behavior.
6. Refresh each direct route. Check the network panel for HTTPS API calls and correct CORS, preserved `/legacy/default.png`, new Cloudinary URLs, file validation failures and graceful API outages.
7. Remove only explicitly authorized disposable test records/assets after verification. A ping is non-destructive; this workflow writes data and must use the approved test environment.

Do not label any of these live steps passed based only on the mocked local suite. Keep screenshots/logs free of tokens and connection strings. Public production release additionally needs accepted dependency findings, effective shared/WAF rate limiting, and an approved data/network policy. The in-memory auth limiter is per Vercel instance, not a global abuse quota.

## 9. Troubleshooting

| Symptom | Check |
|---|---|
| `querySrv ENOTFOUND` / DNS SRV failure | Copy the URI from the **new** cluster's Connect dialog; ensure it is running, verify DNS, inspect `db:check` output. Do not repeatedly retry the obsolete host. |
| Repeated database 503 after deploying the fix | Confirm the running process includes the new connector, check private collection/index creation permissions, then retry. Do not remove the unique index or bypass readiness. |
| Authentication failed | Use a database user, correct encoded password and database privileges; preserve Atlas's `authSource` options. Replace credentials privately. |
| Network access / server-selection timeout | Allowlist current local or approved Vercel egress IPs; verify region, firewall and cluster availability. Do not automatically open all IPs. |
| Missing configuration / Vercel function startup error | Supply required variables in the correct project and Preview/Production scope, use Node 24, redeploy only after approval. Check private logs. |
| Function cannot find email template | Retain `functions.app.js.includeFiles` and the existing `views/emails` directory in the backend root. |
| Frontend route refresh 404 | Confirm root `bistro`, output `build`, checked-in SPA rewrite; test a real application path. File-like missing asset paths should remain 404. |
| CORS failure | Match frontend scheme, hostname and port exactly in `FRONTEND_URL`; no path. Check Vercel deployment protection and Preview aliases. |
| API connection failure / HTML instead of JSON | Rebuild frontend with the correct HTTPS backend `REACT_APP_API_URL`; inspect protection pages, health endpoints and browser network errors. |
| Upload returns 400 | Image type must be valid, within 3 MB and 25 million pixels; use field `photo` for menu, `image` for profile. |
| Upload returns 502/503 | Configure the three Cloudinary variables, verify account/quota and network. Database failures must not replace the existing reference. |
| Original image 404 / browser CORS failure | Backend build must copy `upload` into `public/legacy`; `PUBLIC_API_URL` must be the backend origin; retain public static CORS headers. |
| Reset email fails | Check new Gmail app-password eligibility, sender, provider restrictions and logs; tokens are cleared on send failure. Do not trigger unsolicited messages. |
| 401/403 | Login/refresh expired credentials, check active user/role and Bearer header; do not loosen permissions. Wrong current-password 401 is an ordinary retryable form error. |

## 10. Rollback and production approval

No Preview or Production deployment exists from this task. Retain the feature branch for review and do not modify `main` to undo local work. A currently deployed known-good application, if any, should remain untouched until its state is verified.

If an approved Preview fails, stop using that Preview and preserve its private diagnostics. After owner approval, redeploy a previously verified deployment for each affected project with its matching environment variables/origins. Roll back frontend/backend as a compatible pair when the API/configuration requires it. Never roll back to exposed credentials or the obsolete Atlas configuration. Deployment rollback does not restore database records or Cloudinary assets: use independently approved backups/recovery, and never delete the new cluster, account, original uploads, or test data automatically. Keep new secrets; revoke only credentials explicitly authorized for retirement.

Promoting Preview to Production, merging, pushing, paid resources, unrestricted Atlas access, and destructive cleanup each remain separate owner decisions. Before production, address or explicitly accept the readiness report's residual risks and run the full authorized live workflow.
