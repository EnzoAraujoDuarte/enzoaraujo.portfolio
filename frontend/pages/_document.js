import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR" className="dark">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/Images/EnzoIA.png" />
        <link rel="apple-touch-icon" href="/Images/EnzoIA.png" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fonts - Inter, Poppins and Space Grotesk */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

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
