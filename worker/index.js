import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import init, { test_engine } from "./pkg/backend.js";

const manifest = JSON.parse(manifestJSON);

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // API Routes
        if (url.pathname.startsWith("/api/")) {
            await init();
            return handleApiRequest(request, env);
        }

        // Static Files (Frontend)
        try {
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: manifest,
                }
            );
        } catch (e) {
            if (e.status === 404) {
                // Fallback to index.html for SPA routing
                return await getAssetFromKV(
                    {
                        request,
                        waitUntil: ctx.waitUntil.bind(ctx),
                    },
                    {
                        mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/index.html`, req),
                        ASSET_NAMESPACE: env.__STATIC_CONTENT,
                        ASSET_MANIFEST: manifest,
                    }
                );
            }
            return new Response("Internal Server Error", { status: 500 });
        }
    },
};

async function handleApiRequest(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/test-engine") {
        const result = test_engine();
        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response(JSON.stringify({
        message: "API Route Handled by Worker",
        note: "Rust WASM integration active."
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
