import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

interface DecodedToken {
    header?: Record<string, unknown>;
    payload?: JwtPayload | Record<string, unknown>;
    signature?: string;
    error?: string;
}

export default function App() {
    const [token, setToken] = useState<string>("");
    const [decoded, setDecoded] = useState<DecodedToken | null>(null);

    const handleDecode = () => {
        try {
            const parts = token.split(".");
            if (parts.length !== 3) {
                setDecoded({ error: "JWT must have 3 parts (header.payload.signature)" });
                return;
            }

            const [headerB64, , signature] = parts;

            const headerJson = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
            const payloadJson = jwtDecode<JwtPayload | Record<string, unknown>>(token);

            setDecoded({
                header: headerJson,
                payload: payloadJson,
                signature,
            });
        } catch {
            setDecoded({ error: "Invalid JWT" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center gap-4">
            {/* Left panel: Input */}
            <div className="w-1/2 min-w-[48vw] max-w-[50vw] flex flex-col">
                <h1 className="text-3xl font-bold mb-4">🔑 JWT Decoder</h1>
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste your JWT here..."
                    className="w-full h-[70vh] p-3 border rounded-lg shadow text-sm font-mono mb-4"
                />
                <div className="flex justify-start">
                    <button
                        onClick={handleDecode}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Decode
                    </button>
                </div>
                {decoded?.error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {decoded.error}
                    </div>
                )}
            </div>

            {/* Right panel: Decoded output */}
            <div className="w-1/2 min-w-[48vw] max-w-[50vw] flex flex-col gap-4 overflow-auto">
                {decoded?.header && (
                    <div className="p-4 bg-purple-100 border border-purple-400 rounded-lg shadow flex-1">
                        <h2 className="text-lg font-semibold mb-2 text-purple-700">Header</h2>
                        <pre className="text-sm font-mono overflow-auto text-purple-900">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
                    </div>
                )}
                {decoded?.payload && (
                    <div className="p-4 bg-blue-100 border border-blue-400 rounded-lg shadow flex-1">
                        <h2 className="text-lg font-semibold mb-2 text-blue-700">Payload (Claims)</h2>
                        <pre className="text-sm font-mono overflow-auto text-blue-900">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
                    </div>
                )}
                {decoded?.signature && (
                    <div className="p-4 bg-green-100 border border-green-400 rounded-lg shadow flex-1">
                        <h2 className="text-lg font-semibold mb-2 text-green-700">Signature</h2>
                        <pre className="text-sm font-mono overflow-auto text-green-900">
              {decoded.signature}
            </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
