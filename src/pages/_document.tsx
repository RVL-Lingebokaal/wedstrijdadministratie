import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default function WedstrijdAdministratieDocument() {
  return (
    <Html lang="nl">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

WedstrijdAdministratieDocument.getInitialProps = async function getInitialProps(
  ctx: DocumentContext
) {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [initialProps.styles, sheet.getStyleElement()],
    };
  } finally {
    sheet.seal();
  }
};
