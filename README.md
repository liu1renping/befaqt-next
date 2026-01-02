This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Deploy in Vercel

## Initial Deployment

1. **Create Vercel Account**:
   Sign up at [vercel.com](https://vercel.com) using your GitHub account.
2. **Import Project**:
   - Click "Add New..." -> "Project".
   - Select your `inart` repository from GitHub.
3. **Configure Build Settings**:
   - Framework Preset: **Next.js**.
   - Root Directory: `./`.
4. **Set Environment Variables**:
   In the "Environment Variables" section during setup (or later in Settings), upload `.env.production` file, or add variables

   **Public variables** (accessible in browser):
   - `NEXT_PUBLIC_SITE_URL`: `https://befaqt.com`
   - `NEXT_PUBLIC_COMPANY_NAME`: `BeFAQT`
   - `NEXT_PUBLIC_COMPANY_SHORTNAME`: `BeFAQT`
   - `NEXT_PUBLIC_COMPANY_EMAIL`: `liu1renping@gmail.com`

   **Secret variables** (server-side only):
   - `GMAIL_USER`: (Your Gmail address for contact form)
   - `GMAIL_PASS`: (Your Gmail App Password)

   **Note:** For `GMAIL_PASS`, you need to create a Gmail App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password (not your regular Gmail password)

5. **Configure Region:**
   - The `vercel.json` file is already configured to deploy to Sydney (`syd1`)
   - Vercel will automatically use this region

6. **Deploy:**
   - Click "Deploy", Vercel will build and deploy your application
   - You'll get a deployment URL like `https://your-project.vercel.app`
   - Automatically deploy every push to `main` branch (production)

## Custom Domain Setup

1. **Add domain in Vercel:**
   - Go to your project dashboard → Settings → Domains
   - Add your domain (e.g., `infinityart.com.au`)

2. **Configure DNS:**
   - Vercel will provide DNS records to add at your domain provider
   - Add the A and/or CNAME records as instructed

   | Type      | Name  | Value                                  |
   | :-------- | :---- | :------------------------------------- |
   | **A**     | `@`   | `216.198.79.1`                         |
   | **CNAME** | `www` | `900b98cd25550d46.vercel-dns-017.com.` |
   - DNS propagation may take a few minutes to 24 hours

3. **SSL Certificate:**
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - HTTPS will be enabled automatically

4. **Debug DNS:**
   - Use `nslookup befaqt.com` to check DNS records
   - Use [DNSChecker](https://dnschecker.org/) to check DNS records (A and CNAME)
