import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-20">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">Playdate</h1>
          <p className="max-w-prose text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Coordinate playdates with your kids’ friends — scheduling, availability,
            and parent-friendly logistics.
          </p>
        </header>

        <section className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            href="/auth"
          >
            Sign in
          </Link>
          <a
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-black dark:text-white dark:hover:bg-white/5"
            href="https://github.com/levineam/playdate-app"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </section>

        <footer className="pt-6 text-sm text-zinc-500 dark:text-zinc-500">
          <p>
            This is an early preview. If you’re seeing the Next.js starter page,
            something is misconfigured.
          </p>
        </footer>
      </main>
    </div>
  );
}
