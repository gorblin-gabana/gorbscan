"use client";

import React, { useEffect, useState } from "react";
import { getTokendataByAddress } from "@/contexts/GorbchainDataContext";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Copy, Check } from "lucide-react";

interface TokenDetailsPageProps {
    address: string;
}

export const TokenDetailsPage: React.FC<TokenDetailsPageProps> = ({ address }) => {
    const [tokenData, setTokenData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!address) return;
        const fetchToken = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTokendataByAddress(address);
                setTokenData(data);
            } catch (e: any) {
                setError(e.message || "Failed to fetch token data");
                toast.error(e.message || "Failed to fetch token data");
            } finally {
                setLoading(false);
            }
        };
        fetchToken();
    }, [address]);

    // Helper to shorten and copy
    const shorten = (str: string, start = 8, end = 6) => {
        if (!str || str.length <= start + end) return str;
        return `${str.slice(0, start)}...${str.slice(-end)}`;
    };
    // Track which field is copied
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const handleCopy = (field: string, value: string) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1200);
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto mt-8">
                <Card className="p-8">
                    <Skeleton className="h-8 w-1/2 mb-4" />
                    <Skeleton className="h-16 w-16 rounded mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-full mb-2" />
                </Card>
            </div>
        );
    }
    if (error) {
        return <div className="max-w-2xl mx-auto mt-8 text-center text-red-500">{error}</div>;
    }
    if (!tokenData) {
        return <div className="max-w-2xl mx-auto mt-8 text-center">No token data found.</div>;
    }

    const meta = tokenData.metadata?.tokenMetadata || {};
    const mintInfo = tokenData.metadata?.mintInfo || {};

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <Card className="p-8">
                <div className="flex items-center gap-4 mb-6">
                    {meta.uri && !imgError ? (
                        <img
                            src={meta.uri}
                            alt={meta.name}
                            className="w-16 h-16 rounded border bg-gray-100 object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-16 h-16 rounded border bg-gray-100 flex items-center justify-center text-2xl font-bold text-primary select-none">
                            {(meta.name || tokenData.name || "?").charAt(0)}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
                            {meta.name || tokenData.name}
                        </h1>
                        <div className="flex gap-2 mb-2">
                            {tokenData.isFrozen && <Badge variant="destructive">Frozen</Badge>}
                            {tokenData.isInitialized && <Badge variant="default">Initialized</Badge>}
                        </div>
                        <div className="text-gray-500 text-lg font-mono">{meta.symbol || tokenData.symbol}</div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            Mint Address
                            <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => handleCopy('mintAddress', tokenData.mintAddress)}
                                aria-label="Copy Mint Address"
                            >
                                {copiedField === 'mintAddress' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="font-mono break-all text-sm">{shorten(tokenData.mintAddress, 10, 8)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            Program ID
                            <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => handleCopy('programId', tokenData.programId)}
                                aria-label="Copy Program ID"
                            >
                                {copiedField === 'programId' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="font-mono break-all text-sm">{shorten(tokenData.programId, 10, 8)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            Mint Authority
                            <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => handleCopy('mintAuthority', tokenData.mintAuthority)}
                                aria-label="Copy Mint Authority"
                            >
                                {copiedField === 'mintAuthority' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="font-mono break-all text-sm">{shorten(tokenData.mintAuthority, 10, 8)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            Freeze Authority
                            <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => handleCopy('freezeAuthority', tokenData.freezeAuthority)}
                                aria-label="Copy Freeze Authority"
                            >
                                {copiedField === 'freezeAuthority' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="font-mono break-all text-sm">{shorten(tokenData.freezeAuthority, 10, 8)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs flex items-center gap-1">
                            Update Authority
                            <button
                                className="ml-1 p-1 rounded hover:bg-gray-100 focus:outline-none"
                                onClick={() => handleCopy('updateAuthority', tokenData.updateAuthority)}
                                aria-label="Copy Update Authority"
                            >
                                {copiedField === 'updateAuthority' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                        <div className="font-mono break-all text-sm">{shorten(tokenData.updateAuthority, 10, 8)}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs">Supply</div>
                        <div>{Number(tokenData.supply) / Math.pow(10, Number(tokenData.decimals))}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs">Decimals</div>
                        <div>{tokenData.decimals}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs">Created At</div>
                        <div>{tokenData.createdAt ? new Date(tokenData.createdAt).toLocaleString() : "-"}</div>
                    </div>
                    <div>
                        <div className="text-gray-600 text-xs">Last Updated</div>
                        <div>{tokenData.lastUpdated ? new Date(tokenData.lastUpdated).toLocaleString() : "-"}</div>
                    </div>
                </div>
                {meta.uri && (
                    <div className="mt-4">
                        <a
                            href={meta.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            View Metadata URI
                        </a>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TokenDetailsPage;
