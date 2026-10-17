# Bistro Bliss deployment guide

Updated 17 October 2026 after the first authorized cloud attempt. **STOP — NOT READY: DEPLOYMENT FAILURE.** No working Preview exists. The backend build rejected an array-valued `includeFiles`; that is corrected locally and the backend suite passes 42/42. Vercel also classified this first deployment as **Production despite the explicit Preview flag**. No retry is authorized while that conflict remains. No application function started. The short-lived Atlas entry is removed and the original list restored. The deployment attempt made no Git commit/push/merge or existing-project change. The owner subsequently requested publishing the reviewed fixes on `chore/vercel-fullstack-mongodb-migration`; that publication leaves the deployment hold unchanged.

## Current cloud state and safety gate

The approved Hobby team is `ali-muhammed-ahmeds-projects` (`team_nF7VlOdzWpgVNJ0gKvZ8VemI`). Authenticated CLI/API access works; the installed Vercel connector still lacks this team's access. Existing `portfolio-concept-c` and `bistro-api` remain untouched.

Created new protected projects:

| Project | ID | Root/framework | Node/build/install/output |
|---|---|---|---|
| `bistro-bliss-api` | `prj_tFcmyazYZSIbNQ7FyGftcRWcXzGu` | `server`, Express | 24.x, `npm run build`, `npm ci`, native output |
| `bistro-bliss` | `prj_idJT2ERirwSAOy4ofnmFhdRqWikb` | `bistro`, CRA | 24.x, `npm run build`, `npm ci`, `build` |

Both retain `all_except_custom_domains` Vercel protection, with no public exception, custom domain or Git integration. Project creation triggered no automatic deployments. The repository root is linked to the backend only in ignored `.vercel/`. No paid plan/add-on was enabled. No READY deployments exist; the frontend has not been deployed/linked locally.

Backend has six core Preview-only variables; URI and a fresh independent JWT use Secret storage. SMTP/Cloudinary/PORT are absent. `FRONTEND_URL` and `PUBLIC_API_URL` still use the approved closed bootstrap `https://preview-pending.invalid`; final origins were not reached. Frontend variables remain unset. Both projects have zero Production variables. Do not claim Preview secrets were supplied to the Production-classified failed build.

Official Atlas CLI 1.59.2 was installed after owner approval, checksum verified, and authenticated interactively by the owner using profile `bistro-preview`. Project `Bistro-Bliss` (`6ad38d241c2693ee120ab5d7`) has one Free cluster, `bistro-bliss-cluster`, AWS `sa-east-1`; Data Explorer showed only `bistro_bliss` and no documents. Driver reads confirmed zero users/menus/bookings and exactly `readWrite@bistro_bliss`. The original one-entry owner `/32` baseline was retained privately. No users/roles/clusters/billing were changed.

The CLI created the one approved temporary `0.0.0.0/0` entry with a verified stored expiry **2026-10-17T22:18:53Z**, below two hours. Cleanup removed it by **20:24:08Z** after failure and verified exact restoration of the original one-entry list. It was not re-added. A new network window requires separate approval. See `/tmp/bistro-preview-execution-20261017-okHPN7/network-cleanup.json`; Atlas notes that existing connections may survive IP-list removal for a variable period.

**Attempt 1/3:** `dpl_9QZxsKQAAGzAvpkaTJtwGUZ7DVQz`, failed URL `https://bistro-bliss-jp06oe8b0-ali-muhammed-ahmeds-projects.vercel.app`, actual target **Production**, status **ERROR**, `INVALID_VERCEL_CONFIG`. This is a failed deployment record, not a usable Preview. Its automatic alias `bistro-bliss-api-ali-muhammed-ahmeds-projects.vercel.app` is a Production alias; never reuse it as a Preview origin.

Vercel's [first-deployment rule](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting) explains this classification; the earlier preflight missed it. **The command examples below are reference only and must not be executed as a retry.** The Preview flag is insufficient for a new project's first deployment. Preserve the strict Preview-only stop unless an officially supported target-safe path is established or the owner separately authorizes a precise protected initialization plan for only these new demo projects. Reassess execution count and origin reconciliation afterward. No initialization/extra deployment/network renewal is implicitly authorized.

The config fix uses one string glob, `"{views/emails/**,public/bistro-logo.png}"`, which matches every existing Pug template and the embedded logo. The regression failed on the old array and passes with the correction; full backend tests 42/42 and asset build pass. The official function-property schema rejects the old value and accepts the fixed value; full published-schema validation was not completed due validator/draft incompatibility. Actual pre-upload CLI inventory was 241 entries with zero active-secret matches; local offline inventories still pass after the fix. The fixed config has not been redeployed. Frontend tests/build were not rerun during this correction; previous preflight evidence remains in the report.

No hosted read-only API/UI/CORS/static/function test ran because function creation failed; build logs and deployment metadata were inspected. No new records, assets or emails were created. Keep both projects protected; any exact backend public exception, hosted write/admin/media/mail scope remains separately gated. See [DEPLOYMENT_READINESS_REPORT.md](DEPLOYMENT_READINESS_REPORT.md) for current evidence, rollback limits and owner decisions.

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

1. **Least privilege is now verified.** The owner replaced the former `readWriteAnyDatabase` role. A fresh effective-role query found exactly `readWrite` on **`bistro_bliss` only**, and customer creation/password-reset/deletion passed. Preserve this scope; do not grant wildcard or database-administration roles. Codex did not change permissions. See [database users](https://www.mongodb.com/docs/atlas/security-add-mongodb-users/).
2. The Atlas browser and authenticated CLI inspected all project clusters and access-list entries. The approved temporary entry was removed and the original owner `/32` baseline verified. Preserve that list; any fresh broad window needs approval. Successful local ping does not prove hosted connectivity. See [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).
3. Preserve the privately configured URI with its explicit `/bistro_bliss` database and Atlas authentication options. If credentials are rotated, obtain the actual URI from this cluster's Connect → Drivers dialog and percent-encode reserved password characters. Never invent a cluster hostname or expose the URI.
4. Rerun the read-only diagnostic after role/network changes:

   ```bash
   npm --prefix server run db:check
   ```

   It verifies SRV DNS, authentication, connectivity and ping without writing records. It does not prove CRUD rights; repeat authorized disposable CRUD separately after narrowing permissions.
5. Keep local `FRONTEND_URL=http://localhost:3000` and `PUBLIC_API_URL=http://localhost:4000` for normal use. Integration used a temporary explicit API port 4001 to preserve an existing owner process on 4000; this does not change production defaults. Restart existing local processes to load the corrected connector/logout code.
6. Configure separate least-privilege Preview credentials/database where possible, with Production secrets separate. The two approved protected Vercel projects and core backend Preview variables now exist; both Production-variable sets remain empty. Never broaden database roles to make another database test pass.

### Empty database and original data

The models use collections `users` (`User`), `menus` (`Menu`), and `bookings` (`Bookings`). The connector explicitly creates missing collections and awaits schema indexes, including unique email, before database-dependent requests proceed. A temporary initialization failure returns a safe 503 and can retry. It never drops collections or indexes. Initial inspection found no collections/records. After authorized testing, the three collections remain empty with the unique email index preserved. No original users, reservations or menu records were recovered. An empty menu returns an empty array and displays “No items found”; empty booking lists remain valid.

No trustworthy structured menu seed was found, so no automatic or invented production seed was added. Original image bytes are preserved in `server/upload/`; those files alone cannot reconstruct menu names, prices, or bookings. Add owner-approved menu content through the admin UI with new uploads. The build copies the repository images to `server/public/legacy/` for native Vercel static serving. Existing filename references continue to resolve through `fileUrl`; new media references are Cloudinary HTTPS URLs.

### Initial administrator — explicit owner authorization required

The separately approved disposable administrator was deleted after testing; no permanent administrator or default password exists. No administrator is created automatically. On the new isolated database, register the intended owner's account normally with a unique password. Verify the exact email and document `_id`. Only after the owner explicitly authorizes that identity as administrator, use Atlas **Browse Collections → bistro_bliss → users** to change **only that document's** `role` to `admin`. Sign in again and verify the admin pages and API permissions. Record the approved identity privately. Public signup and profile/admin profile edits cannot grant roles. Never make all users admins or store a plaintext password in Atlas; registration performs bcrypt hashing.

## 3. Atlas network access from Vercel

Vercel outbound addresses are dynamic by default. A frontend/backend domain's inbound IP is not a reliable Atlas allowlist entry. Prefer approved stable egress and restrict Atlas to those addresses. Vercel [Static IPs](https://vercel.com/docs/networking/static-ips) require Pro/Enterprise: Pro costs $20/month platform fee plus $100/month for the backend Static IPs project, with regional transfer/usage extra. Secure Compute is Enterprise/custom priced. Static public egress can work with Atlas Free IP access lists; Atlas Free does not support private endpoints/peering. No paid option may be enabled without separate approval.

If a Free-tier demonstration cannot use restricted stable egress, stop for explicit owner approval before adding `0.0.0.0/0` to Atlas. That admits connection attempts from the entire internet; TLS and strong database credentials still apply, but the network restriction is lost. First inspect all clusters/current entries in the Atlas project: network entries apply project-wide. Use the least-privilege demo user/database, no sensitive records, and a temporary entry expiring within two hours. Record the original list and approved entry ID; remove only the added entry immediately when tests finish/fail or at expiry, whichever is sooner. Verify restoration of the original entries. It is not a silent production default. The one approved entry was created through CLI with a verified under-two-hour deadline, then removed after failure; the original list was restored. It must not be re-added without a fresh approved window.

## 4. Cloudinary and email setup

Cloudinary credentials are already configured and actual signed upload/replacement/deletion passed. Keep using the owner-controlled product environment, review quotas, and do not purchase upgrades without approval. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` only in backend environments after the applicable configuration/test scope is approved; they remain unset in the current hosted projects. Use a separate product environment/account for Preview when possible. No unsigned upload preset is required; the backend signs uploads. [Cloudinary Node uploads](https://cloudinary.com/documentation/node_image_and_video_upload) describes the API.

Menu uploads remain admin-only using field `photo`; profile uploads require login and use field `image`. Images must be valid decodable images, at most 3 MB and 25 million input pixels. Sharp auto-orients and converts them to 500×500 JPEG, quality 90. Cloudinary returns an HTTPS reference stored in the existing `file` property and exposed by `fileUrl`. The size limit leaves room for multipart fields below Vercel's request limit. Failed database writes trigger removal of newly uploaded media; successful replacements/deletions remove only app-managed Cloudinary assets. Original repository files are never deleted. Cross-service cleanup is best effort: interruptions or Cloudinary deletion failures may leave an unreferenced asset; monitor the explicit cleanup log and reconcile before manual deletion. MongoDB and Cloudinary do not share a transaction.

For password recovery, preserve the configured owner-controlled Gmail identity and new app password. Exactly one authorized reset email was delivered; the owner confirmed Spam placement, the reset button, and SPF/DKIM/DMARC **PASS**. Actual reset/password login/replay rejection and scoped cleanup passed. No second email is authorized. Do not change working sender authentication or invent DNS records for Google's personal Gmail domain.

The logo is embedded as a trusted PNG buffer referenced with `cid:`, so Gmail does not need to fetch localhost or a remote asset server. Keep both `views/emails/**` and `public/bistro-logo.png` in the single string glob `functions.app.js.includeFiles`; arrays are rejected by the hosted function configuration. Keep `disableFileAccess`, `disableUrlAccess` and required SMTP TLS; the attachment buffer avoids relaxing those restrictions. The shared footer has account-security wording without a fake address/unsubscribe. Subject/body state the purpose, 10-minute expiry and single use. These fixes pass offline MIME and local desktop/mobile visual checks; revised Gmail rendering/placement requires approval for another email.

Gmail classified the original as similar to previously identified spam despite passing authentication. Sender/account/IP reputation and content heuristics cannot be repaired or guaranteed by a code change. The connector was not authenticated; header results are owner-verified, and no provider reputation dashboard was available. The owner may mark the legitimate message not spam; no mailbox labels were changed automatically. For a future owned-domain sender, separately configure provider-required SPF/DKIM/DMARC and inspect reputation metrics; do not migrate providers or provision paid services without approval. See [Google sender guidance](https://support.google.com/mail/answer/81126?hl=en-GB), [authentication inspection](https://support.google.com/mail/answer/180707?hl=en) and [Nodemailer embedded images](https://nodemailer.com/message/embedded-images).

Local reset links intentionally use local `FRONTEND_URL`. Production/Preview must use the approved HTTPS frontend origin, with public backend origins and no localhost values. Hosted links, Vercel asset bundling/SMTP egress and revised Gmail rendering remain unverified until their respective approvals.

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

1. Review the local diff and readiness report. Atlas least privilege and one live reset workflow are verified. Review the documented revised-template/deliverability limits, confirm credential rotation, and remediate or explicitly accept the documented frontend advisories for an isolated Preview. No deployment approval is implied by successful local tests. Current execution remains stopped at the first-deployment target conflict described above.
2. **Prefer an explicitly approved local CLI Preview** of the existing feature branch, including reviewed uncommitted files, without a Git push. Use the repository root for both projects; do not invoke the monorepo CLI from `server` or `bistro`. Select the linked project before each deployment and preserve its Root Directory setting. Project creation/linking and deployment require owner authorization. See [Vercel monorepo CLI instructions](https://vercel.com/docs/monorepos#add-a-monorepo-through-vercel-cli).
3. If a Git workflow is separately authorized, push only `chore/vercel-fullstack-mongodb-migration`, then import each project from that reviewed branch. Do not merge or deploy unchanged `main`. If the import UI cannot select the intended branch before triggering deployment, use the approved CLI path instead. The earlier feature-branch push was explicitly authorized and completed. The later approved local CLI backend attempt ran once, failed validation and was unexpectedly Production-classified; no Git deployment path was executed. The email fixes are already present in published commit `2483dd7`. The owner subsequently requested publication of the reviewed preparation/configuration fixes on the feature branch. This authorizes their commit/push only; no merge, deployment retry or renewed network window is implied.
4. Suggested project name: `bistro-bliss-api`; **Root Directory `server`**, **Framework Express**, **Node 24.x**, **Install Command `npm ci`**, **Build Command `npm run build`**, no frontend output-directory override. Choose a function region close to Atlas. `app.js` exports Express directly; `server.js` is only a local listener. No serverless wrapper or `api/` rewrite is used. See [native Express on Vercel](https://vercel.com/docs/frameworks/backend/express) and [supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
5. Set only the approved initial core backend Preview variables; keep SMTP and Cloudinary variables unset until separately approved. Use the actual approved Preview aliases in `FRONTEND_URL` and `PUBLIC_API_URL`, or the explicitly approved closed bootstrap origins described in step 9. Add secrets privately.
6. Keep the checked-in `server/vercel.json`: it declares the native framework, includes dynamic Pug email templates and the embedded PNG logo in the function bundle, and sets headers for public legacy assets. The build copies the original uploads into `public/legacy`. Native Vercel ignores `express.static()`; it serves `public/` through the CDN.
7. Trigger the explicitly approved **Preview**, with deployment protection as appropriate. `/health` should return `{"status":"ok","database":"not_checked"}`. `/health/db` should return `{"status":"ok","database":"connected"}`; a 503 means the API is reachable but the database check failed. Inspect logs privately without exposing credentials.
8. Keep both projects protected. Before browser integration, obtain separate approval for the exact backend Preview-alias exception or an approved server-side alternative. An OPTIONS allowlist alone does not authenticate GET/POST requests. A Vercel HTML login page is not API JSON; no bypass secret may enter the CRA bundle.
9. Use observed stable **Preview** branch aliases for final origins; do not assume project names imply domains or bind Production domains. If no aliases exist before backend-first deployment, explicitly approve a closed `https://preview-pending.invalid` bootstrap origin, perform the initial backend Preview, observe its branch alias, deploy the frontend using that alias, then observe the frontend alias and redeploy only the backend with exact final origins. Budget at most three Preview deployments for this bootstrap/reconciliation plan; stop if stable aliases are unavailable or further redeploys exceed authorization. No functional/email test runs using placeholder origins.

The following repository-root sequence is **historical/reference, blocked from retry** by the current target conflict. Backend linking and one explicit Preview-request attempt were executed; frontend linking/deployment and backend reconciliation were not executed. Do not run this sequence until the target method and any renewed network window are authorized:

```bash
cd /home/https_ali_muhammed/Documents/Final-Project-Amit
git branch --show-current
vercel link --scope ali-muhammed-ahmeds-projects --project bistro-bliss-api
# Confirm linked project, Root Directory server, and backend Preview variables.
vercel deploy --scope ali-muhammed-ahmeds-projects --target=preview
vercel link --scope ali-muhammed-ahmeds-projects --project bistro-bliss
# Confirm linked project, Root Directory bistro, and frontend Preview API origin.
vercel deploy --scope ali-muhammed-ahmeds-projects --target=preview
```

Use an owner-approved current Vercel CLI and authenticated team. The first real attempt proved that a Preview flag alone does not prevent first-deployment Production classification; keep the current stop gate until this is resolved. Stop if the CLI proposes Production or an unexpected project/root. Do not pass `--prod`; an explicit Preview target only requests Preview and did not prevent the observed first-deployment Production classification. Verify the displayed branch is `chore/vercel-fullstack-mongodb-migration` and that branch-specific Preview variables/aliases apply. Source deployment uploads local reviewed changes; it does not commit or push them. See [deploy command](https://vercel.com/docs/cli/deploy). Check actual CLI upload inventory before upload. The new root `.vercelignore` explicitly excludes local `.env`, `config.env`, `.vercel`, IDE/dependency/build output and backend tests. `.gitignore` contents alone were proven insufficient for repository-root CLI uploads; retain the backend ignore file as well. Never include test credentials.

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
| Function cannot find email template | Retain `functions.app.js.includeFiles` for `views/emails/**` and `public/bistro-logo.png`; the fixed attachment uses a trusted buffer, not an external image URL. |
| Frontend route refresh 404 | Confirm root `bistro`, output `build`, checked-in SPA rewrite; test a real application path. File-like missing asset paths should remain 404. |
| CORS failure | Match frontend scheme, hostname and port exactly in `FRONTEND_URL`; no path. Check Vercel deployment protection and Preview aliases. |
| API connection failure / HTML instead of JSON | Rebuild frontend with the correct HTTPS backend `REACT_APP_API_URL`; inspect protection pages, health endpoints and browser network errors. |
| Upload returns 400 | Image type must be valid, within 3 MB and 25 million pixels; use field `photo` for menu, `image` for profile. |
| Upload returns 502/503 | Configure the three Cloudinary variables, verify account/quota and network. Database failures must not replace the existing reference. |
| Original image 404 / browser CORS failure | Backend build must copy `upload` into `public/legacy`; `PUBLIC_API_URL` must be the backend origin; retain public static CORS headers. |
| Reset message delivered to Spam | Inspect Gmail Show original authentication and classification reason. Passing SPF/DKIM/DMARC does not guarantee Inbox placement. Preserve authenticated identity; review content/reputation and use approved HTTPS links. No automatic test resend. |
| Reset email fails | Check new Gmail app-password eligibility, sender, provider restrictions and logs; tokens are cleared on send failure. Do not trigger unsolicited messages. |
| 401/403 | Login/refresh expired credentials, check active user/role and Bearer header; do not loosen permissions. Wrong current-password 401 is an ordinary retryable form error. |

## 10. Rollback and production approval

One failed Production-classified record exists in the new backend project; zero READY deployments and no working Preview exist. The new protected projects and backend Preview variables remain for review. The temporary Atlas entry was removed and the original baseline restored. Do not delete cloud projects/credentials or the failed record without authorization. Retain the feature branch and leave `main` and existing live projects untouched.

If an approved Preview fails, stop using that Preview and preserve its private diagnostics. After owner approval, restore a previously verified compatible Preview pair with matching origins, if one exists. On the first Preview there may be no known-good pair; record that and stop using it. Remove the approved temporary Atlas entry and specific backend exception at the approved window end, preserving all original rules; verify removal. Roll back frontend/backend as a compatible pair when the API/configuration requires it. Never roll back to exposed credentials or the obsolete Atlas configuration. Deployment rollback does not restore database records or Cloudinary assets: use independently approved backups/recovery, and never delete the new cluster, account, original uploads, or test data automatically. Keep new secrets; revoke only credentials explicitly authorized for retirement.

Promoting Preview to Production, merging, pushing, paid resources, unrestricted Atlas access, and destructive cleanup each remain separate owner decisions. Before production, address or explicitly accept the readiness report's residual risks and run the full authorized live workflow.
