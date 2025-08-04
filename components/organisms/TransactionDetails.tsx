"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Check, ArrowDown } from 'lucide-react';
import { Tag } from '@/components/atoms/Tag';

interface TransactionDetailsProps {
  hash: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ hash }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tx/${hash}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Transaction not found');
        const data = await res.json();
        setTransaction(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [hash]);

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyButton: React.FC<{ text: string; type: string }> = ({ text, type }) => (
    <button
      onClick={() => handleCopy(text, type)}
      className="ml-2 p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
      title="Copy to clipboard"
    >
      {copied === type ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );

  // Helper: parse API response to UI-friendly transaction object, including inner instructions
  const parseTransaction = (apiTx: any) => {
    if (!apiTx) return null;
    // If response is an array, use the first item
    const txObj = Array.isArray(apiTx) ? apiTx[0] : apiTx;
    const instr = txObj.transaction.message.instructions[0];
    const info = instr?.parsed?.info || {};
    const accountKeys = txObj.transaction.message.accountKeys;
    const getAccount = (pubkey: string) => accountKeys.find((a: any) => a.pubkey === pubkey);
    // Map inner instructions by index for easy lookup
    const innerInstructionsMap: Record<number, any[]> = {};
    if (txObj.meta?.innerInstructions) {
      txObj.meta.innerInstructions.forEach((ii: any) => {
        innerInstructionsMap[ii.index] = ii.instructions;
      });
    }
    return {
      signature: txObj.transaction.signatures[0],
      blockNumber: txObj.slot,
      timestamp: txObj.blockTime ? new Date(txObj.blockTime * 1000).toLocaleString() : '',
      blockTime: txObj.blockTime ? new Date(txObj.blockTime * 1000).toUTCString() : '',
      status: txObj.meta?.err === null ? 'success' : 'fail',
      signer: info.source || getAccount(info.source)?.pubkey || '',
      recipient: info.destination || getAccount(info.destination)?.pubkey || '',
      amount: info.lamports ? (info.lamports / 1e9).toFixed(6) : '0',
      amountUSD: '', // Not available in API
      token: 'GORB', // Hardcoded for now
      fee: txObj.meta?.fee ? (txObj.meta.fee / 1e9).toFixed(6) + ' GORB' : '',
      feeUSD: '', // Not available in API
      computeUnits: txObj.meta?.computeUnitsConsumed,
      version: txObj.version,
      recentBlockhash: txObj.transaction.message.recentBlockhash,
      instructions: txObj.transaction.message.instructions.map((inst: any, idx: number) => ({
        programId: inst.programId,
        programName: inst.program || '',
        instruction: inst.parsed?.type || inst.type || '',
        data: inst.data || '',
        accounts: [
          ...(inst.parsed?.info?.source ? [{ pubkey: inst.parsed.info.source, isSigner: getAccount(inst.parsed.info.source)?.signer, isWritable: getAccount(inst.parsed.info.source)?.writable }] : []),
          ...(inst.parsed?.info?.destination ? [{ pubkey: inst.parsed.info.destination, isSigner: getAccount(inst.parsed.info.destination)?.signer, isWritable: getAccount(inst.parsed.info.destination)?.writable }] : []),
          // For non-parsed instructions, map accounts array
          ...((inst.accounts || []).map((pubkey: string) => {
            const acc = getAccount(pubkey);
            return {
              pubkey,
              isSigner: acc?.signer || false,
              isWritable: acc?.writable || false
            };
          }))
        ],
        // Add inner instructions for this instruction index
        innerInstructions: (innerInstructionsMap[idx] || []).map((iinstr: any) => {
          // Try to parse info if available
          const parsed = iinstr.parsed || {};
          return {
            programId: iinstr.programId,
            programName: iinstr.program || '',
            instruction: parsed.type || iinstr.type || '',
            data: iinstr.data || '',
            info: parsed.info || {},
          };
        })
      }))
    };
  };

  const tx = transaction ? parseTransaction(transaction) : null;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading transaction...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>;
  }
  if (!tx) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">No transaction data.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Content - Desktop: Side by Side, Mobile: Stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Transaction Amount & Success */}
          <div className="card-base p-6 relative">
            {/* Success tag in top right */}
            <div className="absolute top-4 right-4">
              <Tag status="success">Success</Tag>
            </div>

            <div className="text-center mb-6 pr-20">
              <div className="text-4xl font-bold text-primary mb-2">
                {tx.amount} {tx.token}
              </div>
              <div className="text-lg text-muted-foreground">
                {tx.amountUSD ? `(~${tx.amountUSD})` : null}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="caption">Tx ID</span>
                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)}
                </code>
                <CopyButton text={tx.signature} type="signature" />
              </div>

              {/* Transfer Flow - Separate Rows */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">🔄 Transfer</h4>

                <div className="space-y-3">
                  {/* From Address */}
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-2">From:</div>
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs break-all flex-1">
                        {tx.signer}
                      </code>
                      <CopyButton text={tx.signer} type="signer" />
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowDown className="w-4 h-4 text-primary" />
                  </div>

                  {/* To Address */}
                  <div className="p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-2">To:</div>
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs break-all flex-1">
                        {tx.recipient}
                      </code>
                      <CopyButton text={tx.recipient} type="recipient" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="card-base p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="heading-md">🔍 Details</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Block Time:</span>
                  <div className="text-foreground">{tx.blockTime}</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Confirmed:</span>
                  <div className="text-foreground">{tx.timestamp}</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fee:</span>
                  <div className="text-foreground">{tx.fee}</div>
                  <div className="text-xs text-muted-foreground">({tx.feeUSD})</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Compute Units:</span>
                  <div className="text-foreground">{tx.computeUnits} units</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Version:</span>
                  <div className="text-foreground">{tx.version}</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Block Number:</span>
                  <div className="text-foreground">#{tx.blockNumber}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground block mb-2">Security Ref:</span>
                <div className="flex items-center flex-wrap gap-2">
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                    {tx.recentBlockhash.slice(0, 12)}...{tx.recentBlockhash.slice(-8)}
                  </code>
                  <CopyButton text={tx.recentBlockhash} type="blockhash" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Mode - Raw Program Data (Always Visible) */}
        <div className="space-y-6 mt-6">
          {/* Program Instructions */}
          <div className="card-base p-6">
            <h3 className="heading-md mb-4">📋 Program Instructions</h3>

            {tx.instructions.map((instruction: any, index: number) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{instruction.instruction}</span>
                    <div className="text-xs text-muted-foreground">{instruction.programName}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Program ID:</span>
                    <div className="flex items-center flex-wrap gap-2">
                      <code className="font-mono text-xs bg-muted p-2 rounded flex-1 min-w-0 break-all">
                        {instruction.programId}
                      </code>
                      <CopyButton text={instruction.programId} type={`program-${index}`} />
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Instruction Data:</span>
                    <div className="flex items-center flex-wrap gap-2">
                      <code className="font-mono text-xs bg-muted p-2 rounded flex-1 min-w-0 break-all">
                        {instruction.data}
                      </code>
                      <CopyButton text={instruction.data} type={`data-${index}`} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground block mb-2">Account Keys:</span>
                  <div className="space-y-2">
                    {instruction.accounts.map((account: any, accountIndex: number) => (
                      <div key={accountIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                          <code className="font-mono text-xs break-all">
                            {account.pubkey.slice(0, 8)}...{account.pubkey.slice(-6)}
                          </code>
                          <CopyButton text={account.pubkey} type={`account-${index}-${accountIndex}`} />
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {account.isSigner && (
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Signer</span>
                          )}
                          {account.isWritable && (
                            <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Writable</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inner Instructions */}
                {instruction.innerInstructions && instruction.innerInstructions.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Inner Instructions:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {instruction.innerInstructions.map((iinstr: any, iidx: number) => (
                        <div key={iidx} className="p-3 bg-muted/30 rounded-lg border border-border flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary">{iinstr.instruction}</span>
                            <span className="text-xs text-muted-foreground">{iinstr.programName}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            Program ID:
                            <span className="text-foreground font-mono">
                              {iinstr.programId && iinstr.programId.length > 20
                                ? `${iinstr.programId.slice(0, 6)}...${iinstr.programId.slice(-6)}`
                                : iinstr.programId}
                            </span>
                            {iinstr.programId && iinstr.programId.length > 20 && (
                              <CopyButton text={iinstr.programId} type={`inner-programid-${iinstr.programId}`} />
                            )}
                          </div>
                          {Object.keys(iinstr.info).length > 0 && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {Object.entries(iinstr.info).map(([k, v]) => {
                                const valueStr = String(v);
                                // Heuristic: if value looks like a hash (32+ chars, base58/hex), shorten display but allow copy
                                const isHash = valueStr.length > 20;
                                return (
                                  <div key={k} className="flex items-center gap-1">
                                    <span className="font-medium">{k}:</span>
                                    <span className="text-foreground font-mono">
                                      {isHash ? `${valueStr.slice(0, 6)}...${valueStr.slice(-6)}` : valueStr}
                                    </span>
                                    {isHash && (
                                      <CopyButton text={valueStr} type={`innerinfo-${k}-${valueStr}`} />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {iinstr.data && (
                            <div className="text-xs text-muted-foreground mt-1">Data: <span className="text-foreground">{iinstr.data}</span></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Raw Transaction Data */}
          <div className="card-base p-6">
            <h3 className="heading-md mb-4">🔧 Raw Transaction Data</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Full Signature:</span>
                <div className="flex items-center flex-wrap gap-2">
                  <code className="font-mono text-xs bg-muted p-3 rounded flex-1 min-w-0 break-all">
                    {tx.signature}
                  </code>
                  <CopyButton text={tx.signature} type="fullSignature" />
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Recent Blockhash:</span>
                <div className="flex items-center flex-wrap gap-2">
                  <code className="font-mono text-xs bg-muted p-3 rounded flex-1 min-w-0 break-all">
                    {tx.recentBlockhash}
                  </code>
                  <CopyButton text={tx.recentBlockhash} type="fullBlockhash" />
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Compute Budget:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Units Consumed</div>
                    <div className="text-sm font-mono">{tx.computeUnits}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Fee Paid</div>
                    <div className="text-sm font-mono">{tx.fee}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Version</div>
                    <div className="text-sm font-mono">{tx.version}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};