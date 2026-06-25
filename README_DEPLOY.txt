AQUAHEALTH - FRESH REPO DEPLOY INSTRUCTIONS
==============================================

WHAT WAS FIXED
--------------
1. src/main.tsx was MISSING -> created it (React entry point that mounts <App/>).
   This is why `npm run build` was failing completely before.
2. src/index.css was MISSING -> created it with Tailwind directives.
   Without it, Tailwind classes used throughout your components would not
   apply any styling even if the build had succeeded.
3. vite.config.ts was missing the correct `base` path -> added
   `base: '/AquaHealth/'`.
   Your site will be hosted at
   https://sriramakanthpendikatla.github.io/AquaHealth/
   (a subpath, not domain root), so Vite needs to know that prefix or all
   asset URLs (JS/CSS) resolve incorrectly and the page loads blank.
   IMPORTANT: if you rename the repo again, this base path (and the
   homepage path below) must be updated to match exactly, case-sensitive.
4. Added .github/workflows/deploy.yml -> sets up GitHub Actions to
   automatically run `npm run build` and deploy the `dist` output on every
   push to main. No more manual building/copying dist by hand.
5. Removed the stray 0-byte "project" file and the committed stale dist/
   folder (Actions builds fresh each time, so committing dist is unnecessary).
6. Added .gitignore so node_modules/dist never get committed by accident.

Verified locally: `npm install && npm run build` completes successfully and
dist/index.html correctly references /AquaHealth/assets/... paths.

HOW TO DEPLOY TO YOUR NEW REPO
---------------------------------
1. Create a new, empty repository on GitHub named "AquaHealth"
   (https://github.com/new) - do NOT initialize it with a README,
   .gitignore, or license.

2. Extract this zip's contents into a fresh, empty folder, e.g.
   C:\Users\Asus\AquaHealth

3. Open PowerShell in that folder and run:

   git init
   git add -A
   git commit -m "Initial commit: AquaHealth project"
   git branch -M main
   git remote add origin https://github.com/sriramakanthpendikatla/AquaHealth.git
   git push -u origin main

4. In your browser, go to:
   https://github.com/sriramakanthpendikatla/AquaHealth/settings/pages
   Under "Build and deployment" -> "Source", select "GitHub Actions" and save.

5. Watch the deploy at:
   https://github.com/sriramakanthpendikatla/AquaHealth/actions
   Wait for the green checkmark (1-2 minutes).

6. Visit:
   https://sriramakanthpendikatla.github.io/AquaHealth/
   Hard refresh (Ctrl+F5) to bypass any cached blank page.

LOCAL TESTING (OPTIONAL, BEFORE PUSHING)
------------------------------------------
   npm install
   npm run build
   npm run preview
   Then open the local preview URL it prints to confirm the app renders
   correctly before you push.
