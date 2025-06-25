
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

---

## Deployment Guide for Firebase Studio

Congratulations on building your app! Here’s how to deploy it and connect your custom domain from GoDaddy using the Firebase Studio interface.

### Step 1: Deploy Your App with a Single Click

Firebase Studio makes deploying your application incredibly simple.

1.  **Find the "Publish" Button:** Look for the **Publish** button, typically located in the top-right corner of the Firebase Studio editor.
2.  **Click to Deploy:** Clicking **Publish** will automatically build your Next.js application and deploy it to Firebase App Hosting. This single step handles the entire process for you.
3.  **Wait for Deployment:** The process will take a few minutes. Once it's complete, you will be given a unique URL for your live site (e.g., `https://your-project-name--live-xxxxxxxx.web.app`). Visit this URL to see your deployed app!

### Step 2: Connect Your GoDaddy Domain

Now, let's connect your custom domain (e.g., `www.your-domain.com`).

1.  **Go to the Firebase Console:**
    *   Open the [Firebase Console](https://console.firebase.google.com/).
    *   Select your project.
    *   In the left-hand menu, go to **Build > App Hosting**.

2.  **Add Custom Domain:**
    *   Click the **"Add custom domain"** button.
    *   Enter the domain you own on GoDaddy (e.g., `www.your-domain.com`) and click "Continue".

3.  **Verify Ownership (TXT Record):**
    *   Firebase will provide you with a **TXT record** to verify that you own the domain. It will look something like `google-site-verification=...`.
    *   **Keep the Firebase page open** and open a new browser tab.
    *   Log in to your **GoDaddy** account.
    *   Navigate to your domain's **DNS Management** page.
    *   Add a new DNS record with the following details:
        *   **Type:** `TXT`
        *   **Name/Host:** `@` (or your domain name, depending on GoDaddy's interface)
        *   **Value:** Paste the verification code from Firebase.
        *   **TTL:** Leave as default (usually 1 hour).
    *   Save the record in GoDaddy.

4.  **Point Your Domain to Firebase (A Records):**
    *   Switch back to the Firebase Console tab and click **"Verify"**. This can take a few minutes to a few hours.
    *   Once verified, Firebase will show you two **IP addresses (A records)**.
    *   Go back to your **GoDaddy DNS Management** page.
    *   Add **two** new `A` records:
        *   **Record 1:**
            *   **Type:** `A`
            *   **Name/Host:** `@`
            *   **Value/Points to:** The first IP address from Firebase.
            *   **TTL:** Leave as default.
        *   **Record 2:**
            *   **Type:** `A`
            *   **Name/Host:** `@`
            *   **Value/Points to:** The second IP address from Firebase.
            *   **TTL:** Leave as default.
    *   Save these records in GoDaddy.

5.  **Finalize in Firebase:**
    *   Go back to the Firebase Console and click **"Finish"**.
    *   Firebase will now provision an SSL certificate for your domain. This process can take anywhere from a few minutes to a couple of hours.

Once complete, your site will be live and secure at your custom GoDaddy domain!
