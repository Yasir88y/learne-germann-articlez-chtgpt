# Artikel Studio — German Article Trainer

A free, mobile-friendly, silent German noun-article trainer, hosted with GitHub Pages. It includes both sets of 100 nouns (200 in total). Local saving always works; optional Supabase cloud sync can be enabled.

## Vocabulary sets

- **Words 101–200 (New words):** Default study set, taken **exactly** from the PDF `German_100_Common_Words_101-200_Articles_English.pdf` supplied by the learner. This set has 100 German nouns, their articles, and English meanings.
- **Words 1–100 (Original words):** Switch back at any time. Original nouns keep their existing IDs (0–99), stored answers, mistakes and mastery steps.
- The new nouns use IDs 100–199 within the existing `artikel-studio-v2` learning-history key. **No migration or reset** of previous learning data is necessary.
- Each set has its own 30-question round and recent-word history, so switching does not overwrite the other set's unfinished session. The daily 60-minute study timer remains shared.
- The progress dashboard displays counts out of 100 nouns per selected set; mastery requirements adjust dynamically when a noun enters mistake-recovery mode.
- The recovery page reports original and new noun coverage separately and exports both sets together.

## Daily study

- **Study for up to 60 minutes per calendar day.** The on-screen timer tracks active time while the quiz is visible; it pauses when the page is hidden, when you press Pause, after two minutes of inactivity, or between rounds. Unused minutes remain available later that day.
- **30 questions per round**, mixing multiple-choice and typed article recall. Start another round while daily minutes remain.
- **Pause / Resume** at any point. Individual answers, the current round, errors, and accumulated minutes are saved in browser localStorage. Closing and reopening the browser on the same day resumes the round.
- At the daily one-hour cap, the app stops until the next calendar day. Progress remains intact. A new daily budget starts at local midnight.
- **New vocabulary first:** Unseen nouns from the **selected 100-word deck** are introduced before routinely recycling correct answers. While unseen nouns remain, about four out of five prompts are new; the fifth may revisit a missed word.
- **Balanced reviews:** After all nouns have been introduced, the trainer favours under-practised, due-for-mastery, and difficult words. It avoids repeating the same noun within a 30-question round whenever possible, and remembers the most recent ten nouns across rounds.
- **Visible coverage counter:** The dashboard shows how many unique nouns have been introduced out of 100. New questions are marked NEW NOUN.
- **Mistake Hunter is automatic.** Missed nouns are prioritized and may recur later in the round.
- **Never locked out of practice due to spaced recall.** If every word is waiting for another mastery credit, unmastered words still appear for extra practice. Extra answers affect accuracy and mistake statistics but do not earn premature mastery credit.

## Mastery and mistake recovery

- **Normal mastery:** a noun needs 3 credited correct MCQs and 2 credited correct typed answers.
- **Any incorrect response or revealed answer resets that noun’s current mastery credits to zero.** Historical correct/wrong statistics are preserved.
- **Recovery step 1:** get 1 correct multiple-choice answer as soon as possible (preferably on the day of the mistake).
- **Recovery steps 2–4:** only **at least 24 hours after that first credited MCQ**, earn 1 additional correct MCQ and 2 correct typed answers. That completes recovery mastery (2 MCQs + 2 typed after the error).
- Recovery answers are spaced by at least 5 minutes, with a maximum of 3 mastery credits per noun per day; extra practice answers can still be completed and are recorded without premature credit.
- **Any further error resets recovery to the beginning again**, with a new 24-hour wait after the next first MCQ.
- After mastery, the noun is removed from the selected deck. All other learning history remains saved. Multiple-choice and typed questions are mixed adaptively.
- Correct answers advance after **0.6 seconds**; incorrect/revealed answers show feedback for **3 seconds**.

## Publishing

1. Open repository **Settings → Pages**.
2. Configure **Deploy from a branch → main / (root)**.
3. Live site: https://yasir88y.github.io/learne-germann-articlez-chtgpt/

## Optional cross-device cloud sync

GitHub Pages hosts a **static website**; it cannot safely write private answers to the public GitHub repository. Optional cloud sync uses **Supabase Auth + a private PostgreSQL row protected by row-level security**.

To activate it:

1. Connect the Supabase app to ChatGPT or create a free Supabase project.
2. Run [supabase-setup.sql](./supabase-setup.sql) in the project's SQL editor.
3. Set the authentication Site URL and Redirect URL to `https://yasir88y.github.io/learne-germann-articlez-chtgpt/`.
4. Enter the Supabase **public Project URL** and **publishable key** in [cloud-config.js](./cloud-config.js) (never put any secret or service-role key in a static website).
5. Open the app and sign in via an email magic link on every device using the same email address.

The complete visual guide is at [cloud-setup.html](./cloud-setup.html). **Cross-device sync is not active until a Supabase project is configured and the learner signs in.** The app remains fully usable with local-only storage until then.

The cloud adapter merges existing per-word statistics instead of starting at zero, takes a local pre-merge safety copy, and refuses to replace local data with a result containing fewer total answers. It syncs after answered questions and periodically while signed in. It is designed for one device at a time; conflicting simultaneous edits to the same noun may need manual reconciliation.

## Data and privacy

- Local browser progress remains in `artikel-studio-v2` and is backed up independently, even if cloud sync is enabled or temporarily unavailable.
- Supabase authentication and RLS enforce per-user privacy. The site contains only the publishable key, not any database password or service-role credential.
- Browser-local data alone does **not** synchronize across devices; the optional cloud integration must first be activated.
- Clearing the site's data or resetting your progress can destroy the local copy. Export your backup JSON regularly.

## Data recovery and backups

Visit [recovery.html](./recovery.html) on the **same browser profile and GitHub Pages domain** where you studied. The page scans the original localStorage keys (`artikel-studio-v1`, `artikel-studio-v2`, daily time, rounds, and newer safety copies) without modifying records during the scan.

- **Download backup JSON** before making any changes. Backups stay on the device; they are not uploaded to GitHub.
- If historical v1 records remain, use **Restore earlier vocabulary records** to merge seen/correct/wrong counts into v2 without deleting existing v2 successes.
- If an automatic safety copy is fuller than the current record, use **Restore automatic safety copy**. A local pre-restore snapshot is retained before replacing the v2 record.
- After this update, writing new word progress preserves the fullest preceding record in `artikel-studio-safety-copy-v1`, and resetting requires typing DELETE.

Existing erased localStorage cannot be reconstructed from repository history; GitHub hosts the program but not individual browser learning data. Different browser profiles and website origins have separate localStorage.
