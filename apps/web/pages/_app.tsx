import "codecrush-core/dist/index.css";
import "../styles/markdown.css";
import "../styles/globals.css";
import "@code-hike/mdx/dist/index.css";
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
