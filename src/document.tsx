'use html-server';

export const document = (options?: { title?: string }) => {
  return (
    <html lang="en" class="sl-theme-dark">
      <head>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/src/document.scss" />
        <script type="module" src="/src/document.client.ts"></script>

        <title>{options?.title ?? 'Node Flow Elements | Documentation'}</title>
      </head>

      <body>
        <route-template-outlet></route-template-outlet>
      </body>
    </html>
  );
};
