"use client";

import React, { useState } from 'react';
import { Copy, Check, ArrowDown } from 'lucide-react';
import { Tag } from '@/components/atoms/Tag';

interface TransactionDetailsProps {
  hash: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ hash }) => {
  const [copied, setCopied] = useState<string | null>(null);

  // Mock transaction data
  const transaction = {
    signature: hash,
    blockNumber: 35030807,
    timestamp: '35s ago',
    blockTime: 'Jul 1, 2025 • 01:14 UTC',
    status: 'success' as const,
    signer: 'CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY',
    recipient: 'Jlotip1CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY',
    amount: '0.000001',
    amountUSD: '$0.0002',
    token: 'GORB',
    fee: '0.000005 GORB',
    feeUSD: '$0.0008',
    computeUnits: 150,
    version: 0,
    recentBlockhash: '4zof66MBP99c6FryFUSwqquYyaPYtg7bZcuaeutiR99azuRG5q5QcaqkZNb19qPu9RZChsAisbVMVog7hebCmHjq',
    instructions: [
      {
        programId: '11111111111111111111111111111112',
        programName: 'System Program',
        instruction: 'Transfer',
        data: '0x02000000e803000000000000',
        accounts: [
          { pubkey: 'CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY', isSigner: true, isWritable: true },
          { pubkey: 'Jlotip1CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY', isSigner: false, isWritable: true }
        ]
      }
    ]
  };

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
                {transaction.amount} {transaction.token}
              </div>
              <div className="text-lg text-muted-foreground">
                (~{transaction.amountUSD})
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="caption">Tx ID</span>
                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {transaction.signature.slice(0, 10)}...{transaction.signature.slice(-10)}
                </code>
                <CopyButton text={transaction.signature} type="signature" />
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
                        {transaction.signer}
                      </code>
                      <CopyButton text={transaction.signer} type="signer" />
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
                        {transaction.recipient}
                      </code>
                      <CopyButton text={transaction.recipient} type="recipient" />
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
                  <div className="text-foreground">{transaction.blockTime}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Confirmed:</span>
                  <div className="text-foreground">{transaction.timestamp}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Fee:</span>
                  <div className="text-foreground">{transaction.fee}</div>
                  <div className="text-xs text-muted-foreground">({transaction.feeUSD})</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Compute Units:</span>
                  <div className="text-foreground">{transaction.computeUnits} units</div>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">Version:</span>
                  <div className="text-foreground">{transaction.version}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Block Number:</span>
                  <div className="text-foreground">#{transaction.blockNumber}</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground block mb-2">Security Ref:</span>
                <div className="flex items-center flex-wrap gap-2">
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded flex-1 min-w-0 break-all">
                    {transaction.recentBlockhash.slice(0, 12)}...{transaction.recentBlockhash.slice(-8)}
                  </code>
                  <CopyButton text={transaction.recentBlockhash} type="blockhash" />
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
            
            {transaction.instructions.map((instruction, index) => (
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
                    {instruction.accounts.map((account, accountIndex) => (
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
                    {transaction.signature}
                  </code>
                  <CopyButton text={transaction.signature} type="fullSignature" />
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Recent Blockhash:</span>
                <div className="flex items-center flex-wrap gap-2">
                  <code className="font-mono text-xs bg-muted p-3 rounded flex-1 min-w-0 break-all">
                    {transaction.recentBlockhash}
                  </code>
                  <CopyButton text={transaction.recentBlockhash} type="fullBlockhash" />
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">Compute Budget:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Units Consumed</div>
                    <div className="text-sm font-mono">{transaction.computeUnits}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Fee Paid</div>
                    <div className="text-sm font-mono">{transaction.fee}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded">
                    <div className="text-xs text-muted-foreground">Version</div>
                    <div className="text-sm font-mono">{transaction.version}</div>
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