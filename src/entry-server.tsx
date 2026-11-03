import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
export function render(path: string) { return renderToString(<StaticRouter location={path}><App /></StaticRouter>); }
export { pageMetadata, organization, structuredData } from "./seo";
