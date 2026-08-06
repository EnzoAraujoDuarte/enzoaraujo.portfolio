import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR" className="dark">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Global SEO Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#111111" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Script to set theme and prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    // Default to dark theme
                    document.documentElement.classList.add('dark');
                    if (!savedTheme) {
                      localStorage.setItem('theme', 'dark');
                    }
                  }
                } catch (e) {
                  // If localStorage fails, default to dark
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />

        {/* Critical CSS to prevent layout shift - force dark background immediately */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html.dark { background-color: #111111; }
              html:not(.dark) { background-color: #ffffff; }
              body { background-color: inherit; }
            `,
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
