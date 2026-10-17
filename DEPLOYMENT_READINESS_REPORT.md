# Bistro Bliss deployment readiness report

Updated 17 October 2026. Repository: `/home/https_ali_muhammed/Documents/Final-Project-Amit`. This supersedes the earlier migration-only assessment with actual service and application evidence.

## Executive summary

**BLOCKED — LIVE INTEGRATION INCOMPLETE.** Authorized customer/admin API workflows and browser integration passed against the new Atlas database and Cloudinary. Gmail authentication passed, but actual reset-email delivery remains blocked because no owner-controlled recipient was approved. Vercel execution remains untested because deployment is prohibited. The application's Atlas credential also has excessive privileges that the owner must restrict before release.

The existing React/CRA, Express, Mongoose, JWT, Cloudinary and SMTP architecture is retained. Four additional issues were corrected: missing unique-index initialization (including retry recovery), tests accidentally loading owner credentials, a login network-error crash, and admin logout retaining its JWT. No permanent administrator, real email, cloud permission change, commit, push, merge, resource provisioning or deployment was performed.

Statuses: **PASS — LIVE VERIFIED**, **PASS — LOCAL VERIFIED**, **PASS — MOCKED**, **BLOCKED — OWNER APPROVAL REQUIRED**, **FAIL — REPRODUCED**, **FIXED — RETESTED**, **NOT TESTED**. Local execution is never evidence of Vercel execution. Mocked boundaries are identified below.

## Git and scope safety

Work remains on `chore/vercel-fullstack-mongodb-migration`. `HEAD` and `main` remain at `a99e7056014a783d0f14112463187be9b6344813`. Existing uncommitted migration work was preserved. Final status: 39 modified tracked files, 24 new files and one staged deletion. The staged deletion of `server/config.env` remains; its ignored local copy is preserved. No history rewrite, reset or broad clean occurred. The previous migration's changes remain part of the handoff; the additional files for this follow-up are listed below.

Live writes were separately authorized only for disposable records in `bistro_bliss`, after verifying an initially empty database with zero collections. A second approval allowed changing only the role of the exact run-owned user `6ad39facd9f673c83b19be6c` to `admin`. Identity was checked before promotion. Every test used generated data; no existing user, menu, booking or asset was modified. Email to the synthetic `.invalid` accounts was prohibited and never attempted.

A pre-existing owner backend on port 4000 was preserved. Integration used a separate loopback API on 4001 and frontend on 3000 with an explicit API-origin override. The task-owned API/frontend were stopped after cleanup; no owner process was stopped. Test wrappers journaled uploads and refused cleanup of non-run assets; MongoDB, Cloudinary and application routes remained real. Third-party browser widgets were blocked; application API calls were not mocked.

## Live service verification

| Service | Status | Evidence and limit |
|---|---|---|
| MongoDB Atlas | **PASS — LIVE VERIFIED** | New SRV DNS, authenticated connection/ping, intended `bistro_bliss` database, real CRUD, schema validation, email unique index and connection reuse. No obsolete-host retry. |
| Atlas least privilege | **FAIL — REPRODUCED** | Authenticated `bistro-app` effective role is `readWriteAnyDatabase` on `admin`, with wildcard privileges. Owner must replace with `readWrite` on `bistro_bliss` only. No permissions were changed or destructive cross-database probe attempted. |
| Cloudinary | **PASS — LIVE VERIFIED** | Admin ping, signed uploads, persistent HTTPS references, actual downloaded optimized JPEG, replacement, compensation after rejected DB writes, deletion and independent resource-absence checks. |
| Gmail SMTP authentication | **PASS — LIVE VERIFIED** | Nodemailer transport `verify()` accepted configured credentials. This does not prove message delivery. |
| Actual reset email delivery | **BLOCKED — OWNER APPROVAL REQUIRED** | No approved owner-controlled recipient; no SMTP `sendMail` against Gmail occurred. |
| Vercel functions/CDN | **NOT TESTED** | No project creation, platform build, deployment, function execution or hosted email-link test authorized. |

Local backend configuration contains the required values and validates; values are not reproduced. Frontend development fallback and explicit integration override work. Production compilation uses the non-live `https://api.example.com` origin solely to verify HTTPS build configuration.

## Backend integration results

**PASS — LIVE VERIFIED** against the actual Express API and Atlas:

- `/health/db` and empty menu queried the real database. `/health` and preserved legacy-image serving passed as **PASS — LOCAL VERIFIED**.
- Public signup creates customers even with injected role/reset fields; bcrypt hashes are persisted. Duplicate email, invalid email and short passwords are rejected.
- Correct/incorrect login, missing/invalid/expired JWTs, safe protected-route denials, password change and subsequent login.
- Customers cannot list users, create/update/delete menu items, approve bookings, or read another user's bookings/counts by changing query parameters.
- Profile field allowlists preserve role/media boundaries; normal user and admin list responses exclude passwords/reset metadata, including hostile field projections.
- Booking creation assigns authenticated ownership and default status; owned history, admin listing, approval, rejection and invalid-status rejection persist correctly.
- Approved temporary admin creates/reads/updates/deletes a disposable menu item, including actual images. Metadata-only edits preserve images; invalid input/identifiers fail safely.
- Admin edits only run-owned customer fields, disables/reactivates that customer, and verifies disabled login/JWT rejection. Role injection through admin profile editing is ignored.
- Actual CORS preflight accepts the configured frontend; unrelated browser origin returns 403.
- Deletion endpoints remove only the run-owned menu/users; booking cleanup uses exact record IDs and owner/name checks because there is no booking-delete endpoint.

**PASS — MOCKED**: isolated regression suites cover DB/service failure sanitization, upload size/type/pixel validation, media compensation, transport failure and reset handling. These are not claims of actual external-service outages.

## Database initialization and permissions

The first live index inspection was **FAIL — REPRODUCED**: `users` had only `_id_`, so email uniqueness was not ready. Global command buffering was disabled before model compilation; Mongoose cached an early failed initialization. The connector now disables buffering at connection time, disables automatic collection/index initialization, and explicitly awaits public `createCollection()` and `createIndexes()` after connecting. It never synchronizes/drops indexes. Initialization failure returns a sanitized 503 and can retry; a rejected cached `Model.init()` cannot permanently poison readiness.

**FIXED — RETESTED**: actual email unique index exists; duplicate signup is rejected. Final connector code was separately exercised against Atlas for initialization and shared concurrent/connected promise reuse. Offline regressions verify that readiness waits for indexes and that a transient index failure recovers. Pool size remains five per instance with bounded connection/socket timeouts.

Collection names are `users`, `menus`, `bookings`. Initially there were no collections or important existing records. No collection, index or database was dropped. MongoDB and Cloudinary operations are not a distributed transaction; interrupted operations may require reconciliation.

## Image storage results

**PASS — LIVE VERIFIED**: profile field `image` and admin-menu field `photo` produced signed uploads under the application's fixed `bistro-bliss/<UUID>` namespace. The returned HTTPS URL was stored in Atlas and served across subsequent requests. A fetched result was a 500×500 JPEG. Profile/menu replacement changed the persisted reference; failed validation preserved the previous reference and removed the newly uploaded unused asset. Corrupt image input was rejected before persistence.

Actual deletion was independently checked through Cloudinary's resource API, rather than relying on potentially cached CDN responses. File-size/non-image/pixel limits also pass the focused local suite. All 12 original repository upload files and their built legacy copies were byte-compared successfully; they were never Cloudinary cleanup targets. Deletion remains best effort in the application and logs a sanitized warning on provider failure, so future interrupted runs still need reconciliation.

## Frontend and complete workflows

Chromium used the running React app, real API, Atlas and Cloudinary. Routing/refresh/session removal are **PASS — LOCAL VERIFIED**; the data and image workflows below are **PASS — LIVE VERIFIED**. Direct opening and refresh passed for home, login, registration, menu, booking, profile, invalid reset-token page and approved admin dashboard/users/menu/bookings pages. Anonymous and ordinary-customer admin navigation redirect safely.

Customer UI login persists the session, renders the real menu item, submits a reservation with a Bearer token, displays persisted history, updates profile text/image, changes password, logs out and signs in with the new password. The stored image reference was checked against the real API after page reload. Admin UI login/pages/refresh and logout pass. Positive admin CRUD/status changes were exercised through the real API; not every admin dialog was separately clicked in Chromium. No uncaught page errors occurred in the final browser workflow.

The initial image browser harness tried to read the response body during the page's automatic reload and stalled; checking persisted browser state plus the real API resolved this harness synchronization issue. No application change was needed for it. Earlier failed attempts and their generated assets remain accounted for in the private journal.

**FIXED — RETESTED**: login now displays a safe fallback for network errors instead of dereferencing an absent `response`. Admin logout removes both the user and JWT storage keys. Focused regression cases failed before correction and pass afterward; final real-browser logout also confirms both keys are absent.

## Email and password reset

**PASS — LIVE VERIFIED** for SMTP authentication only. **PASS — MOCKED** for the complete reset workflow with the SMTP send boundary replaced by an in-memory capture: real Express and Atlas persisted only a hashed reset token with expiration, rendered the configured frontend link and sender, reset the password, rejected the old password, accepted the new password, rejected token reuse/expiry, and cleared reset fields. No token, URL containing a token, password or mail body is published.

The distinction matters: Atlas operations were real, but this combined reset campaign is classified mocked because delivery was simulated. Gmail receipt, spam placement, delivered HTML/logo rendering and an actual hosted HTTPS reset link remain **BLOCKED — OWNER APPROVAL REQUIRED**. Vercel template bundling remains **NOT TESTED** until deployment approval.

## Automated verification

Environment: Linux, Node `v24.19.0`, npm `11.17.0`.

| Command/check | Result |
|---|---|
| `npm --prefix server test` | **PASS — MOCKED**: 38 tests, zero failures; owner `.env` loading disabled for unit tests. Real local Sharp/model behavior included; service calls stubbed. |
| `npm --prefix server run build` | **PASS — LOCAL VERIFIED**: terminating asset preparation, original uploads copied into `public/legacy`. |
| `npm --prefix server audit --omit=dev --registry=https://registry.npmjs.org --json` | **PASS — LOCAL VERIFIED**: zero advisories. |
| `CI=true npm --prefix bistro test -- --watchAll=false --runInBand` | **PASS — MOCKED**: 16 tests in two suites, zero failures. |
| `CI=true REACT_APP_API_URL=https://api.example.com npm --prefix bistro run build` | **PASS — LOCAL VERIFIED**: strict production build, no ESLint build warnings. Test origin is not contacted. |
| `npm --prefix bistro audit --json` | **FAIL — REPRODUCED**: 104 affected packages: 64 high, 37 moderate, three low, zero critical. |
| `npm --prefix server run db:check` | **PASS — LIVE VERIFIED**: SRV, authentication, network and ping; diagnostic writes no records. |
| Real API/customer/admin/browser campaigns | **PASS — LIVE VERIFIED** for the scoped workflows above; private evidence below. |
| `git diff --check`, branch/main checks, original assets | **PASS — LOCAL VERIFIED**. |
| Active/historical exact secret-value scan | **PASS — LOCAL VERIFIED**: 204 current tracked/unignored text files and compiled JS inputs checked, zero matches; no active credential file tracked. Ignored local secrets/history excluded from report output. |

No dependency versions changed during this follow-up; lockfiles were preserved and no redundant reinstall was required. The earlier migration's reproducible installs are historical baseline evidence, not newly claimed runs. Test output retains upstream React testing/router warnings; passing compilation does not imply absence of vulnerabilities. Initial failures and red/green regression evidence were retained privately.

## Security findings and release requirements

1. **Atlas privilege scope — unresolved:** current credential is broader than `bistro_bliss`. Owner must restrict it, then rerun the diagnostic and authorized CRUD/readiness checks. This task did not change cloud permissions. The Atlas network access list itself was not inspected through a control-plane session, so its scope is **NOT TESTED**; successful local connectivity does not prove a safe Vercel network configuration.
2. **Frontend advisories — unresolved:** lockfile dependency-graph analysis separates two affected application-runtime packages (`react-router`, `react-router-dom`, moderate) from 102 affected build/test/tooling packages, including CRA. `--omit=dev` alone misclassifies CRA because it is listed in dependencies. Direct affected packages are Router/Router DOM and `react-scripts`; the rest are transitive. Reported fixes require major-version/toolchain decisions. No safe compatible change identified by this audit resolves the remaining families; no force update or framework migration was attempted.
3. Router advisories include [backslash open redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) and [SSR hydration constructor injection](https://github.com/advisories/GHSA-337j-9hxr-rhxg). This app uses fixed navigation destinations and client rendering without SSR, so an exploitable path was not demonstrated here. This is limited reachability analysis, not proof of non-exploitability. Tooling advisories can affect untrusted build inputs/development-server exposure. Keep development servers private; review a separately scoped Router/toolchain upgrade or explicitly accept the residual risk for an isolated Preview.
4. **Credentials:** active database password, JWT secret and Gmail app password differ from historically committed values, checked without displaying them. Independent generation/revocation cannot be proven from value comparison; Cloudinary historical comparison is unavailable. Owner should confirm generation and revocation. Previously committed credentials remain in historical commits and unchanged `main`; no history rewrite was authorized.
5. **Abuse control:** the in-memory authentication limiter is per instance. Multiple Vercel instances do not share counts. Before production, choose owner-approved managed edge/WAF protection or a shared limit store; no paid resource was provisioned.
6. Role enforcement, sensitive-field projection, CORS, upload validation, HTTPS-origin configuration and sanitized errors passed their stated checks. Existing local-storage JWTs retain XSS exposure and no global logout-revocation service. This task is not a penetration-test sign-off.

## Additional files changed in this follow-up

- `server/config/database.js`: connection-time buffering, awaited explicit collection/index readiness and retry recovery.
- `server/test/database.test.js`: index readiness and failed-index retry regressions.
- `server/test/isolate-env.cjs`: prevent unit tests loading owner service credentials.
- `server/package.json`, `server/test/config-assets.test.js`: preload isolation for the suite and its spawned child.
- `bistro/src/Pages/Login/Login.jsx`: network-error fallback.
- `bistro/src/Admin/components/AdminNav/AdminNav.jsx`: remove stored JWT on logout.
- `bistro/src/App.test.js`: login outage and admin logout regressions.
- This report and `VERCEL_DEPLOYMENT_GUIDE.md`: replace stale connectivity blockers with observed results and remaining owner actions.

Private test harnesses, generated credentials and fixture images were not added to Git. No dependency version, API envelope, frontend layout or production account was changed in this follow-up.

## Evidence, records and cleanup

Private evidence directory: `/tmp/bistro-live-20261017-ZZcrwF0g` (temporary local storage; preserve selected non-secret evidence separately if needed). `records.json` records exact IDs, checks, earlier failures and cleanup. `manifest.json` journals only this run's Cloudinary assets and independently verified removal. These files contain no passwords/JWTs/reset tokens; synthetic credentials were kept separately and removed after cleanup. Shell test logs use `/tmp/bistro-followup-*`.

| Collection | Exact disposable record ID | Purpose |
|---|---|---|
| users | `6ad39fabd9f673c83b19be6a` | Customer |
| users | `6ad39facd9f673c83b19be6c` | Separately approved temporary admin |
| menus | `6ad3a097ebb32796396ce8ba` | Menu/image CRUD |
| bookings | `6ad3a03debb32796396ce892` | API reservation/status |
| bookings | `6ad3a16aebb32796396ce8f3` | Browser reservation |

**PASS — LIVE VERIFIED**: all five exact records were deleted, including the temporary administrator. All 11 generated Cloudinary assets (including earlier browser attempts) returned independently verified resource-not-found results. Final record counts are zero in `users`, `menus` and `bookings`; their collections and the unique email index remain. No test records/assets remain. The synthetic credentials file was deleted. The first absence-check harness used the wrong level of Cloudinary's nested 404 error; after correcting the harness, resource absence checks passed. This was a verification issue, not a failed application deletion. No administrator remained to revoke after record cleanup.

## Vercel readiness and next owner actions

Local configuration matches two independent projects: frontend `bistro-bliss` with root `bistro`, CRA, `npm ci`, `npm run build`, output `build`; backend `bistro-bliss-api` with root `server`, native Express, exported `app.js`, Node 24, `npm ci`, terminating `npm run build`. Email Pug templates are explicitly included; legacy assets are copied into `public`; runtime uploads use memory/Cloudinary, without persistent local writes. Frontend SPA rewrites and exact scoped CORS are implemented.

Current [Vercel Express](https://vercel.com/docs/frameworks/backend/express), [CRA](https://vercel.com/docs/frameworks/frontend/create-react-app) and [Node support](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) documentation were checked. That validates the intended configuration, not actual platform execution. Native static serving, templates, SMTP egress, function payload/time limits, deployment protection and Atlas access must still pass an approved Preview. Default dynamic egress must not be treated as a stable Atlas allowlist address.

Owner actions, in order:

1. Restrict the app's Atlas database role and review existing network entries; approve any necessary Vercel egress arrangement. Never silently open `0.0.0.0/0` or provision paid networking.
2. Approve an owner-controlled recipient for one real password-reset delivery workflow, then verify receipt/link/rendering. Synthetic test accounts are deleted and no permanent admin exists; any new test identity needs the corresponding scope approval.
3. Confirm rotation/revocation provenance and decide remediation or isolated-Preview risk acceptance for frontend advisories. Production also requires effective distributed abuse protection.
4. Configure separate backend/frontend Preview secrets and exact HTTPS aliases as described in the guide. Prefer an explicitly approved local CLI Preview of the existing feature branch without a Git push. Project creation/import and deployment require separate authorization.
5. Authorize the two Preview deployments, then perform the guide's hosted smoke/integration checks before any Production decision.

**Final decision: BLOCKED — LIVE INTEGRATION INCOMPLETE.** No unresolved application failure was hidden, but actual email delivery and platform execution have no live evidence. This is neither a production sign-off nor deployment authorization.

Methods used: Ponytail and Superpowers planning/debugging/TDD/verification/review workflows; shell, Playwright and official-document web research. A Valyu lookup returned no useful supporting evidence and was not relied on. Final read-only review found no material unresolved code or documentation finding.
