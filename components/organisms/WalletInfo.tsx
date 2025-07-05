import React from "react";

interface WalletInfoProps {
    accountInfo: any;
}

const formatLamports = (lamports: number) => {
    if (typeof lamports !== 'number') return 'N/A';
    // 1 GORB = 1e9 lamports (Solana convention)
    return `${(lamports / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} GORB`;
};

const WalletInfo: React.FC<WalletInfoProps> = ({ accountInfo }) => {
    if (!accountInfo || !accountInfo.value) return <div className="text-muted-foreground">No wallet info available.</div>;
    const value = accountInfo.value;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Owner:</span>
                    <span className="font-mono text-xs text-foreground">{value.owner}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Lamports:</span>
                    <span className="font-mono text-xs text-foreground">{formatLamports(value.lamports)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Executable:</span>
                    <span className="font-mono text-xs text-foreground">{value.executable ? 'Yes' : 'No'}</span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Rent Epoch:</span>
                    <span className="font-mono text-xs text-foreground">{value.rentEpoch}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Space:</span>
                    <span className="font-mono text-xs text-foreground">{value.space}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">API Version:</span>
                    <span className="font-mono text-xs text-foreground">{accountInfo.context?.apiVersion || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default WalletInfo;
