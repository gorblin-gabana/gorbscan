import React from 'react';
import { ArrowRight, Clock, Zap, ArrowUpRight } from 'lucide-react';
import { AddressDisplay } from './AddressDisplay';

export const BlockTransactionRow: React.FC<any> = ({ transaction }) => {
    const {
        signature,
        slot,
        blockTime,
        meta: { computeUnitsConsumed, err, fee },
        transaction: tx,
    } = transaction;

    const status: 'success' | 'failed' = err ? 'failed' : 'success';

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'success':
                return 'status-success';
            case 'failed':
                return 'status-error';
            default:
                return 'status-info';
        }
    };

    const signer = tx.message.accountKeys[0] || 'Unknown';
    const recipient = tx.message.accountKeys[1] || 'Unknown';
    const timestamp = blockTime ? new Date(blockTime * 1000).toLocaleString() : 'Unknown';

    return (
        <a
            href={`/tx/${signature}`}
            className="data-row group focus-visible card-cyan-glow"
            aria-label={`View transaction ${signature.slice(0, 8)}...${signature.slice(-6)}`}
        >
            <div className="data-row-content">
                {/* Header */}
                <div className="data-row-header">
                    <div className="section-icon bg-secondary/10 group-hover:bg-secondary/20">
                        <ArrowUpRight className="icon-lg text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground font-mono mb-2 truncate">
                            {`${signature.slice(0, 12)}...${signature.slice(-10)}`}
                        </h3>
                        <div className="flex items-center gap-6 body-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="icon-sm text-secondary" />
                                <span>{timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="icon-sm text-primary" />
                                <span>CU: {computeUnitsConsumed || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Flow */}
                <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="caption mb-2">From</p>
                        <AddressDisplay address={signer} />
                    </div>
                    <ArrowRight className="icon-md text-primary mt-6" />
                    <div className="text-center">
                        <p className="caption mb-2">To</p>
                        <AddressDisplay address={recipient} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-4 lg:items-end">
                    <div className={getStatusClass(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                    <div className="lg:text-right">
                        <p className="text-lg font-bold text-secondary mb-1">
                            {fee} lamports
                        </p>
                        <p className="caption">
                            Fee Paid
                        </p>
                    </div>
                </div>
            </div>
        </a>
    );
};
