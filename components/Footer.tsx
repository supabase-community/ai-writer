import DeployButton from "./DeployButton"

const supabasePath =
  "M 9.7113571,0.39877949 C 10.324476,-0.37341465 11.567653,0.04969199 11.582428,1.0355858 l 0.09466,14.4196652 H 2.1026547 c -1.75621979,0 -2.73569549,-2.028386 -1.64362618,-3.403771 z M 13.654582,23.601263 c -0.613123,0.772108 -1.856281,0.349071 -1.871052,-0.636811 L 11.567501,8.5447627 h 9.695787 c 1.756165,0 2.735615,2.0283873 1.643599,3.4037733 z m 0,0 c -0.613123,0.772108 -1.856281,0.349071 -1.871052,-0.636811 L 11.567501,8.5447627 h 9.695787 c 1.756165,0 2.735615,2.0283873 1.643599,3.4037733 z"

export default function Footer() {
  return (
    <footer className="flex w-full flex-col justify-center gap-y-4 border-t border-t-foreground/10 py-4 text-center text-xs">
      <p>
        Powered by{" "}
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          className="inline-flex items-center font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
          <svg
            viewBox="0 0 24 24"
            className="ml-1 inline-block size-3 fill-current"
          >
            <path d={supabasePath} />
          </svg>
        </a>
      </p>
      <DeployButton />
    </footer>
  )
}