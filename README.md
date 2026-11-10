# Artikel Studio — German Article Trainer

A free, mobile-friendly German A1 noun article practice app. No microphones, accounts, frameworks, build tools, API keys, or paid services.

## Modes
- **Article Challenge**: choose der, die, or das for an unseen or previously difficult word.
- **Type the Article**: type the answer without multiple-choice prompts.
- **Mistake Hunter**: practise missed words until you achieve three consecutive correct recalls.

Includes **the exact 100 nouns and articles** from the user's original "100 deutsche Wörter" study PDF, English glosses, in-browser progress, and searchable vocabulary.

## Getting started
Open index.html in any modern browser, or publish it using GitHub Pages:
1. Go to repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.
4. Your app will be available at https://yasir88y.github.io/learne-germann-articlez-chtgpt/ once GitHub Pages completes deployment.

## Storage
Progress uses browser localStorage (key: artikel-studio-v1). It stays on that browser and is not synced between devices. Clearing site data resets it.

## Maintenance
The app is intentionally one file, index.html, to make future ChatGPT GitHub edits straightforward. The README documents setup only.