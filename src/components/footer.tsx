const GITHUB_URL = "https://github.com/NishantDixit1";
const LINKEDIN_URL = "https://www.linkedin.com/in/nishant-dixit-741472243/";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row md:px-6">
        <span>
          Built by{" "}
          <span className="font-medium text-foreground">Nishant Dixit</span> ·
          © {new Date().getFullYear()}
        </span>
        <div className="flex items-center gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <LinkedinIcon className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.04-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.02 2.89-.02 3.28 0 .32.22.7.83.58A12 12 0 0 0 12 .297" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452H17.21v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.985V9h3.108v1.561h.045c.433-.82 1.493-1.685 3.073-1.685 3.286 0 3.892 2.163 3.892 4.977v6.599zM5.337 7.433a1.804 1.804 0 1 1 0-3.609 1.804 1.804 0 0 1 0 3.609zM6.955 20.452H3.715V9h3.24v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.728v20.544C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.272V1.728C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}
