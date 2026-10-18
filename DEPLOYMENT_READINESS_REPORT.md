# Bistro Bliss deployment readiness report

Updated 17 October 2026. Repository: `/home/https_ali_muhammed/Documents/Final-Project-Amit`. This supersedes the earlier migration-only assessment with actual service and application evidence.

## Executive summary

**NOT READY — DEPLOYMENT FAILURE.** The authorized backend attempt failed before function creation because `functions.app.js.includeFiles` was an array instead of a string. That defect is fixed locally with a regression that failed before the correction; the full backend suite now passes 42/42. More importantly, Vercel classified the first deployment as **Production despite the explicit `--target preview` CLI command**. All deployment work stopped. There is no working Preview or live application from this run. The earlier preflight missed Vercel's documented first-deployment rule; its implication that the Preview flag guaranteed a Preview on a new project was incorrect.

The owner-approved new projects and backend Preview-only core variables were created. Both projects remain protected. The approved Atlas entry was created with a verified UTC expiry under two hours, then removed immediately when the run failed; the exact original access list was restored. During the deployment attempt, no Production environment variables, existing projects, database users/roles, records, Cloudinary assets, SMTP settings, Git commits/refs or billing plan were modified. The subsequent owner-requested publication is recorded below. A failed **Production-classified deployment record does exist** in the new backend project; do not describe this run as having no Production deployment record. No new email was sent.

Previous real customer/admin/media/reset campaigns remain historical evidence below, not hosted verification. The existing React/CRA, Express, Mongoose, JWT, Cloudinary and SMTP architecture is retained. The published migration/email baseline is `2483dd7b0a7d506f59d4f8c7d050daee55978c70`. The owner subsequently requested publication of the reviewed configuration/test/documentation/upload-ignore fixes on the same feature branch; this follow-up includes those files. Publishing does not authorize or resolve a deployment retry.

Statuses: **PASS — LIVE VERIFIED**, **PASS — LOCAL VERIFIED**, **PASS — MOCKED**, **BLOCKED — OWNER APPROVAL REQUIRED**, **FAIL — REPRODUCED**, **FIXED — RETESTED**, **NOT TESTED**. Local execution is never evidence of Vercel execution. Mocked boundaries are identified below.

## Git and scope safety

Work remains on `chore/vercel-fullstack-mongodb-migration`. Before this publication follow-up, local and remote feature refs matched at baseline `2483dd7b0a7d506f59d4f8c7d050daee55978c70`; the owner then requested pushing the reviewed fixes. Both local and remote `main` remain at `a99e7056014a783d0f14112463187be9b6344813`. The latest email fixes are committed and included in the source, contrary to the attachment's older baseline. New local changes are the root `.vercelignore`, these two deployment documents, `server/vercel.json` and its mail-asset regression test; unrelated `.idea/` files remain untracked and preserved. The CLI linked the repository root to the new backend project in ignored `.vercel/`. Redundant `.gitignore` lines added by linking were removed, restoring its original rules. No merge or history rewrite occurred. The deployment campaign made no commits/pushes; this separate owner-requested follow-up publishes only the reviewed fixes. Its exact revision is recorded in Git history. The failed cloud attempt is recorded below. `server/config.env` is absent from the current Git tree; its ignored local copy remains private.

Live writes were separately authorized only for disposable records in `bistro_bliss`, after verifying an initially empty database with zero collections. A second approval allowed changing only the role of the exact run-owned user `6ad39facd9f673c83b19be6c` to `admin`. Identity was checked before promotion. Every test used generated data; no existing user, menu, booking or asset was modified. Email to the synthetic `.invalid` accounts was prohibited and never attempted.

A pre-existing owner backend on port 4000 was preserved. Integration used a separate loopback API on 4001 and frontend on 3000 with an explicit API-origin override. The task-owned API/frontend were stopped after cleanup; no owner process was stopped. Test wrappers journaled uploads and refused cleanup of non-run assets; MongoDB, Cloudinary and application routes remained real. Third-party browser widgets were blocked; application API calls were not mocked.

## Approved deployment execution — 17 October 2026

### Authority and verified Atlas prerequisites

The owner approved two new projects under Hobby team `ali-muhammed-ahmeds-projects`, Preview-only core variables with the existing least-privilege DB credential and a fresh independent JWT, up to three local CLI Preview executions, isolated-Preview dependency/per-instance-limit risks, and read-only hosted tests. SMTP/Cloudinary, hosted record creation, temporary admin, real email and public backend protection exceptions remain separately gated. No Git push/commit/merge, Production deployment, existing-project modification or paid upgrade was authorized.

Following separate owner approval, official Atlas CLI **1.59.2** was installed at `/home/https_ali_muhammed/.local/bin/atlas`. The release SHA-256 matched publisher checksums and the official GitHub release asset digest. The owner completed user-account browser activation for profile `bistro-preview`; authenticated project and network reads succeeded. The private activation note/log were deleted and CLI config restricted to owner-only access. No credentials/tokens are reproduced.

**PASS — LIVE VERIFIED:** project **Bistro-Bliss** (`6ad38d241c2693ee120ab5d7`), one Free cluster **bistro-bliss-cluster**, AWS São Paulo (`sa-east-1`). Data Explorer showed only application database `bistro_bliss`, zero data bytes, three collections and four indexes. Fresh driver checks found zero users/menus/bookings and exactly `readWrite@bistro_bliss`. No unrelated application clusters/databases or sensitive records were observed. The original network list had one active owner `/32`, with its exact address/comment saved privately.

The UI offered only six-hour/day/week expiry. The authenticated CLI instead created exactly one run-tagged `0.0.0.0/0` entry using `--deleteAfter`. Requested and independently stored expiry: **2026-10-17T22:18:53Z**, 119 minutes after the request, below the two-hour maximum. Atlas accepted that exact UTC value. An additional list read returned nonzero while the source upload was running; its error text was not retained. Immediate cleanup was initiated and succeeded. The hosted build then failed; a second cleanup check also confirmed absence and baseline restoration. No six-hour/non-expiring substitute was used.

**PASS — LIVE VERIFIED, CLEANUP:** by **2026-10-17T20:24:08Z** the temporary entry was absent and the complete original one-entry list was restored. Later CLI verification confirmed the same baseline. No entry was re-added. Do not claim removal terminates every established socket immediately; Atlas documents that existing connections can persist for a variable period. No application function was built in this attempt. [Atlas IP-list/connection limits](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

### Vercel projects and actual environment state

Authenticated CLI/API reverified Hobby team `team_nF7VlOdzWpgVNJ0gKvZ8VemI`, slug `ali-muhammed-ahmeds-projects`, owner account `aliimuhammed`. The installed connector still lacks team access; the authorized CLI's own authentication supplied results. No plan/add-on was purchased. Existing `portfolio-concept-c` and `bistro-api` were preserved.

| New project | Project ID | Root/framework | Node/build/install/output | Current state |
|---|---|---|---|---|
| `bistro-bliss-api` | `prj_tFcmyazYZSIbNQ7FyGftcRWcXzGu` | `server` / Express | 24.x / `npm run build` / `npm ci` / native Functions | One failed deployment; zero READY |
| `bistro-bliss` | `prj_idJT2ERirwSAOy4ofnmFhdRqWikb` | `bistro` / CRA | 24.x / `npm run build` / `npm ci` / `build` | No deployment |

Creation of each project was followed by a deployment-list read confirming zero automatic deployments. Both use `all_except_custom_domains` Vercel protection, no Git connection and basic build machines; backend region remains `iad1`. No custom domain or public exception was added. Only the backend is linked locally; the frontend's cloud configuration exists but has not been locally linked/deployed.

Backend has exactly six **Preview-only** keys: `NODE_ENV`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`, `PUBLIC_API_URL`. The URI is the approved existing least-privilege value; JWT is freshly generated independently, stored as a Secret, and not printed/persisted in test artifacts. API readback identifies URI/JWT as `sensitive` (Secret). Both origins still use the reviewed closed bootstrap `https://preview-pending.invalid`; no final origin reconciliation occurred. Frontend variables remain unset because no actual backend Preview origin exists. Production-variable count is zero in both projects. SMTP/Cloudinary/PORT remain unset. No claim is made that Preview secrets were injected into the Production-classified failed attempt.

### Deployment attempt and stop condition

**Attempt 1/3**, source branch `chore/vercel-fullstack-mongodb-migration`, local CLI 64.5.0 from repository root with reviewed uncommitted preparation changes. Actual command explicitly included `--target preview`, `--project bistro-bliss-api`, the exact team, and no `--prod` flag. Actual CLI `--dry --json` inventory immediately before upload: 241 entries; 179 selected text files scanned with zero active exact-secret matches. Credential/config/IDE/dependency/build/private-journal files were excluded; Express, mail templates/logo, legacy inputs and frontend source retained. Source was uploaded once; do not repeat earlier preparation-only claims that no upload occurred.

| Deployment fact | Observed value |
|---|---|
| ID | `dpl_9QZxsKQAAGzAvpkaTJtwGUZ7DVQz` |
| Failed generated URL | `https://bistro-bliss-jp06oe8b0-ali-muhammed-ahmeds-projects.vercel.app` |
| Platform creation / end | 2026-10-17T20:24:02.652Z / 2026-10-17T20:24:05.737Z |
| Requested / actual target | Preview / **Production** |
| Status/code | **ERROR** / `INVALID_VERCEL_CONFIG` |
| Error | `functions['app.js'].includeFiles` should be string |
| Automatic alias | `bistro-bliss-api-ali-muhammed-ahmeds-projects.vercel.app` — Production alias, never treat it as Preview |
| Runtime/CDN result | No built function, working app, successful static delivery or hosted DB connection verified |

**Target mismatch:** current [Vercel documentation](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting) states a new project's first deployment is Production. The CLI source also recognizes this automatic first-deployment assignment. This rule was missed in the earlier preflight; explicit Preview intent did not prevent the platform classification. The backend project's Production target points to the **ERROR** record, with zero READY deployments. No existing live project or Production variable was modified. The frontend has no deployment and remains subject to the same first-deployment risk. Further deployments stopped; no workaround, placeholder Production initialization or deletion was attempted.

### Confirmed configuration defect and local verification

**FAIL — HOSTED REPRODUCED:** the function-level `includeFiles` field accepted by Vercel is a string, while the earlier source/test assumed an array. Changed it to the single brace glob `{views/emails/**,public/bistro-logo.png}`. The strengthened existing regression first failed on the old array, then passed with the fix; it checks the platform's string contract and actual selection of every Pug mail template plus the embedded PNG using Node's glob implementation.

**PASS — LOCAL VERIFIED:** full backend 42/42 tests, backend asset build, both offline source inventories and `git diff --check` after the fix. The exact `functions.includeFiles` property from the current official JSON schema rejects the old value and accepts the new value. An attempted full-schema validation could not run with the installed validator because the published schema mixes draft constructs; no full-schema PASS is claimed. No dependency change was made. The corrected configuration has **not** been redeployed.

Frontend 16/16 tests, strict HTTPS-origin build, backend audit zero, frontend audit 104 (two runtime/102 tooling) are the fresh earlier preflight results, not reruns after this config-only correction. They do not establish hosted behavior. Initial `/health`, `/health/db`, empty menu, frontend routing, CORS, static assets, function logs and browser integration are **NOT TESTED** because build creation failed before application execution. Build logs and platform metadata were read; no hosted records/assets/mail were created.

### Cleanup, evidence and next decision

Private evidence: `/tmp/bistro-preview-execution-20261017-okHPN7` contains original/project/cluster/access-list reads, requested/stored expiry, exact cleanup/baseline verification, project IDs/configuration, Preview variable metadata without values, source inventories, build log, deployment metadata and red/green tests. `journal.json` records the failed Production-classified attempt and stop. No local API/frontend process was started or owner process stopped in this campaign. No records/assets exist to clean up; original collections/indexes are retained. A final driver read at 2026-10-17T20:29:31Z reconfirmed zero documents in all three collections, the unique `users.email_1` index and exactly `readWrite@bistro_bliss`.

**Current hold:** 1/3 deployment attempts used, zero working Previews, no broad Atlas entry. Retain the two new protected projects and failed record for review; deleting them or revoking credentials is not implicit cleanup. Existing creation/configuration/risk approvals remain valid, but they do not authorize Production initialization. Under the strict Preview-only condition, stop until a supported Preview-only first-deployment path is established. Alternatively, the owner could separately authorize tightly scoped protected initialization for only these two new demo projects; no such permission is assumed. A fresh temporary network window needs separate approval because the single authorized entry was already removed. Reassess the exact execution count/origin plan after the target decision; do not exceed the original remaining cap or guess Preview aliases. Hosted writes/admin/media/mail/public exceptions remain separately gated.

## Live service verification

| Service | Status | Evidence and limit |
|---|---|---|
| MongoDB Atlas | **PASS — LIVE VERIFIED** | New SRV DNS, authenticated connection/ping, intended `bistro_bliss` database, real CRUD, schema validation, email unique index and connection reuse. No obsolete-host retry. |
| Atlas least privilege | **FIXED — RETESTED** | Owner changed the role. A fresh authenticated effective-role check found exactly `readWrite` on `bistro_bliss`; diagnostic and live customer create/reset/delete passed with the narrowed credential. No agent permission change or destructive cross-database probe occurred. |
| Cloudinary | **PASS — LIVE VERIFIED** | Admin ping, signed uploads, persistent HTTPS references, actual downloaded optimized JPEG, replacement, compensation after rejected DB writes, deletion and independent resource-absence checks. |
| Gmail SMTP authentication | **PASS — LIVE VERIFIED** | Nodemailer transport `verify()` accepted configured credentials. This does not prove message delivery. |
| Actual reset email delivery | **PASS — LIVE VERIFIED** | Exactly one Gmail SMTP send to the approved owner-controlled recipient, with owner-confirmed receipt in Spam and visible reset button. Original logo/footer defects and post-fix verification limits are documented below. |
| Vercel functions/CDN | **FAIL — HOSTED BUILD; RUNTIME NOT TESTED** | The approved CLI attempt failed configuration validation and was unexpectedly Production-classified. No function/static-app workflow executed; see current execution evidence above. |

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

**PASS — LIVE VERIFIED**: the owner separately approved one exact controlled recipient. Before creating an account, fresh checks confirmed zero records and exactly `readWrite@bistro_bliss`. One tagged ordinary customer was created; no existing account was reused or modified. The real application generated the token and sent exactly one message through Gmail SMTP. A persisted send-attempt guard prohibited retries/other recipients. The owner confirmed receipt in **Spam**, a visible reset button, and SPF/DKIM/DMARC **PASS** in Gmail Show original.

The actual emailed URL opened the real React reset form. After owner confirmation, Chromium submitted a generated new password to the real API/Atlas; browser login accepted it, the old password returned 401, replaying the same token returned 400, and reset metadata was cleared. No passwords, JWTs, raw headers, actual token/link or recipient address are published. Earlier mocked expiry/failure coverage remains separately classified **PASS — MOCKED**.

**FAIL — REPRODUCED** on the delivered original: the logo URL used `PUBLIC_API_URL=http://localhost:4001`, unreachable by Gmail's image fetcher. The shared footer contained a fabricated address and `href="#"` unsubscribe link. **FIXED — RETESTED locally**: the existing logo now travels as a PNG buffer with a matching Content-ID referenced by HTML; the backend function bundle explicitly includes that asset. No remote image host, Cloudinary account or localhost logo URL is needed. The footer now explains that this is an account-security email; it has no invented business details or mailing-list unsubscribe. Subject and body clearly identify the reset, 10-minute validity, single use and unchanged password if ignored. Plain text omits the CID image reference. Actual offline MIME generation and desktop/mobile Chromium rendering passed. This is not a Gmail post-fix rendering claim.

The authenticated From identity, Gmail SMTP credentials and TLS/access restrictions are preserved. No DNS/authentication change was justified by the passing authentication results. Public sender-domain DNS includes SPF and DMARC; DNS presence alone was not treated as message-level authentication. The Gmail connector returned `USER_NOT_LOGGED_IN`, so received authentication results and the classification reason come from the owner's inspection, not direct connector access.

Gmail's reported reason was: the message resembles previously flagged spam. This does not prove a particular account/IP reputation score or identify one template element as the cause. Actual provider reputation metrics were unavailable. Content fixes remove observed defects; they cannot guarantee Inbox placement. [Google sender guidance](https://support.google.com/mail/answer/81126?hl=en-GB) distinguishes authentication, reputation, formatting and marketing/subscription requirements. The current personal Gmail domain is controlled by Google; the app must not invent SPF/DKIM/DMARC headers or DNS records for it. Owner actions: optionally mark this legitimate message as not spam, review provider reputation where available, use approved HTTPS production origins, and approve a separate revised-message test if desired. No second email was sent. See [Nodemailer embedded images](https://nodemailer.com/message/embedded-images) for the CID/buffer mechanism.

**BLOCKED — OWNER APPROVAL REQUIRED**: a second email to validate revised-template Gmail rendering/placement. **NOT TESTED**: hosted HTTPS reset URLs, Vercel template/asset bundling and SMTP egress. Local reset links still intentionally use the configured local frontend; production requires the approved HTTPS `FRONTEND_URL`.

## Automated verification

Environment: Linux, Node `v24.19.0`, npm `11.17.0`.

| Command/check | Result |
|---|---|
| `npm --prefix server test` | **PASS — MOCKED**: 42 tests, zero failures; owner `.env` loading disabled for unit tests. Real local Sharp/model behavior included; service calls stubbed. |
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

1. **Atlas privilege scope — resolved by owner and retested:** exactly `readWrite@bistro_bliss` was observed; diagnostic and disposable customer/reset/delete checks passed. This task did not change cloud permissions. The Atlas access list and project scope were subsequently inspected; the one approved short-lived entry was removed and the original baseline verified. Hosted application connectivity remains untested because the build failed.
2. **Frontend advisories — unresolved:** lockfile dependency-graph analysis separates two affected application-runtime packages (`react-router`, `react-router-dom`, moderate) from 102 affected build/test/tooling packages, including CRA. `--omit=dev` alone misclassifies CRA because it is listed in dependencies. Direct affected packages are Router/Router DOM and `react-scripts`; the rest are transitive. Reported fixes require major-version/toolchain decisions. No safe compatible change identified by this audit resolves the remaining families; no force update or framework migration was attempted.
3. Router advisories include [backslash open redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) and [SSR hydration constructor injection](https://github.com/advisories/GHSA-337j-9hxr-rhxg). This app uses fixed navigation destinations and client rendering without SSR, so an exploitable path was not demonstrated here. This is limited reachability analysis, not proof of non-exploitability. Tooling advisories can affect untrusted build inputs/development-server exposure. Keep development servers private; review a separately scoped Router/toolchain upgrade or explicitly accept the residual risk for an isolated Preview.
4. **Credentials:** active database password, JWT secret and Gmail app password differ from historically committed values, checked without displaying them. Independent generation/revocation cannot be proven from value comparison; Cloudinary historical comparison is unavailable. Owner should confirm generation and revocation. Previously committed credentials remain in historical commits and unchanged `main`; no history rewrite was authorized.
5. **Abuse control:** the in-memory authentication limiter is per instance. Multiple Vercel instances do not share counts. Before production, choose owner-approved managed edge/WAF protection or a shared limit store; no paid resource was provisioned.
6. Role enforcement, sensitive-field projection, CORS, upload validation, HTTPS-origin configuration and sanitized errors passed their stated checks. Existing local-storage JWTs retain XSS exposure and no global logout-revocation service. This task is not a penetration-test sign-off.

## Files changed across the integration follow-ups

- `server/config/database.js`: connection-time buffering, awaited explicit collection/index readiness and retry recovery.
- `server/test/database.test.js`: index readiness and failed-index retry regressions.
- `server/test/isolate-env.cjs`: prevent unit tests loading owner service credentials.
- `server/package.json`, `server/test/config-assets.test.js`: preload isolation for the suite and its spawned child.
- `bistro/src/Pages/Login/Login.jsx`: network-error fallback.
- `bistro/src/Admin/components/AdminNav/AdminNav.jsx`: remove stored JWT on logout.
- `bistro/src/App.test.js`: login outage and admin logout regressions.
- `server/utils/email.js`, `server/views/emails/passwordReset.pug`, `server/views/emails/baseEmail.pug`: embedded logo, transactional wording/footer and clear reset subject/plain text; authenticated sender and SMTP settings preserved.
- `server/vercel.json`: explicitly bundle the logo and Pug templates through one platform-compatible string glob; correct the array rejected by the hosted build.
- `server/test/email.test.js`: four regressions for logo/content, unchanged transport safeguards, real offline MIME and function asset inclusion; the last now checks the string/glob contract and actual template/logo matches.
- This report and `VERCEL_DEPLOYMENT_GUIDE.md`: current service evidence, cleanup, deliverability findings and remaining owner actions.

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

Mail follow-up evidence: `/tmp/bistro-mail-20261017-wssmqA/evidence.json`. Disposable user `6ad3a742955c1f79572a2e5c` was verified by exact ID, email, run name and ordinary-customer role, then deleted. All three collection counts are zero; unique email index remains. Exactly one SMTP send occurred, no image/booking/menu asset was created, and private credential/token storage was deleted. No account remains. Local preview artifacts use synthetic identities/links only. Gmail messages/labels were not modified.

## Vercel readiness and next owner actions

Local configuration matches two independent projects: frontend `bistro-bliss` with root `bistro`, CRA, `npm ci`, `npm run build`, output `build`; backend `bistro-bliss-api` with root `server`, native Express, exported `app.js`, Node 24, `npm ci`, terminating `npm run build`. Email Pug templates are explicitly included; legacy assets are copied into `public`; runtime uploads use memory/Cloudinary, without persistent local writes. Frontend SPA rewrites and exact scoped CORS are implemented.

Current [Vercel Express](https://vercel.com/docs/frameworks/backend/express), [CRA](https://vercel.com/docs/frameworks/frontend/create-react-app) and [Node support](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) documentation were checked. That validates the intended configuration, not actual platform execution. Native static serving, templates, SMTP egress, function payload/time limits, deployment protection and Atlas access must still pass an approved Preview. Default dynamic egress must not be treated as a stable Atlas allowlist address.

Owner actions, in order:

1. Resolve the first-deployment target conflict. Strict Preview-only authorization remains the default. Any protected Production-classified initialization limited to these two new demo projects would need explicit separate authorization; it is not part of the current plan.
2. After a target-safe method and exact revised deployment/origin plan are agreed, approve a fresh maximum-two-hour Atlas window if needed. The first approved entry is already removed; do not silently re-add it or extend its expiry. One of the original three attempts has been used.
3. Keep both projects protected, Production variables empty, SMTP/Cloudinary unset, existing projects/main untouched. Hosted records/admin/media/mail and exact public backend exceptions remain separately gated.
4. Historical credential revocation provenance, frontend advisory remediation and distributed abuse protection remain production-review requirements. No additional email is authorized.

**Final decision: NOT READY — DEPLOYMENT FAILURE.** Local configuration correction is tested, but no working Preview exists. The unexpected Production classification and closed network window prevent an automatic retry. The failed deployment record, two protected projects and core Preview variables remain for owner review.
Methods used across the integration follow-ups: Ponytail and Superpowers planning/debugging/TDD/verification/review workflows; shell, Playwright and official-document web research. Current Preview preparation also used the plugin-management skill, Vercel MCP read attempts, authenticated CLI/API inventory, offline CLI upload inspection, and Valyu research supporting the official networking documentation. Read-only review identified stale runbook scope/current-state statements, which were corrected. A subsequent review of the string-glob fix found no code/test issue; its documentation findings were also corrected.
