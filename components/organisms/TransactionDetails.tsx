"use client";

import React, { useEffect, useState } from 'react';
import { Copy, Check, ArrowDown, ExternalLink, Clock, Hash, DollarSign, Activity, Users, Shield, FileText, Settings } from 'lucide-react';
import { Tag } from '@/components/atoms/Tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface TransactionDetailsProps {
  hash: string;
}

interface ParsedTransaction {
  signature: string;
  blockNumber: number;
  timestamp: string;
  blockTime: string;
  status: 'success' | 'failed' | 'pending';
  signer: string;
  recipient: string;
  amount: string;
  amountUSD: string;
  token: string;
  fee: string;
  feeUSD: string;
  computeUnits: number;
  version: number;
  recentBlockhash: string;
  instructions: Array<{
    programId: string;
    programName: string;
    instruction: string;
    data: string;
    accounts: Array<{
      pubkey: string;
      isSigner: boolean;
      isWritable: boolean;
    }>;
    innerInstructions?: Array<{
      programId: string;
      programName: string;
      instruction: string;
      data: string;
      info: any;
    }>;
  }>;
  // Additional dynamic fields
  tokenTransfers?: Array<{
    mint: string;
    symbol: string;
    amount: string;
    from: string;
    to: string;
    decimals: number;
  }>;
  balanceChanges?: Array<{
    account: string;
    preBalance: string;
    postBalance: string;
    change: string;
  }>;
  logs?: string[];
  rewards?: Array<{
    account: string;
    amount: string;
    type: string;
  }>;
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

  const CopyButton: React.FC<{ text: string; type: string; size?: 'sm' | 'md' }> = ({ text, type, size = 'md' }) => (
    <button
      onClick={() => handleCopy(text, type)}
      className={`p-1 rounded hover:bg-muted transition-colors flex-shrink-0 ${size === 'sm' ? 'ml-1' : 'ml-2'
        }`}
      title="Copy to clipboard"
    >
      {copied === type ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );

  const formatAddress = (address: string, length: number = 8) => {
    if (!address) return '';
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  };

  const formatAmount = (amount: string, decimals: number = 9) => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    return num.toFixed(6);
  };

  const parseTransaction = (apiTx: any): ParsedTransaction | null => {
    if (!apiTx) return null;
    const txObj = Array.isArray(apiTx) ? apiTx[0] : apiTx;

    // Calculate balance changes
    const preBalances = txObj.meta?.preBalances || [];
    const postBalances = txObj.meta?.postBalances || [];
    const balanceChanges = preBalances.map((pre: number, index: number) => {
      const post = postBalances[index] || 0;
      const change = post - pre;
      return {
        account: txObj.accountKeys?.[index]?.pubkey || '',
        preBalance: (pre / 1e9).toFixed(6),
        postBalance: (post / 1e9).toFixed(6),
        change: (change / 1e9).toFixed(6)
      };
    });

    // Parse token transfers from pre/post token balances
    const preTokenBalances = txObj.meta?.preTokenBalances || [];
    const postTokenBalances = txObj.meta?.postTokenBalances || [];
    const tokenTransfers: any[] = [];

    // Simple token transfer detection (can be enhanced)
    preTokenBalances.forEach((pre: any) => {
      const post = postTokenBalances.find((p: any) => p.accountIndex === pre.accountIndex);
      if (post && pre.uiTokenAmount.uiAmount !== post.uiTokenAmount.uiAmount) {
        tokenTransfers.push({
          mint: pre.mint,
          symbol: pre.uiTokenAmount.symbol || 'Unknown',
          amount: Math.abs(post.uiTokenAmount.uiAmount - pre.uiTokenAmount.uiAmount).toString(),
          from: pre.uiTokenAmount.uiAmount > post.uiTokenAmount.uiAmount ? txObj.accountKeys[pre.accountIndex]?.pubkey : '',
          to: pre.uiTokenAmount.uiAmount < post.uiTokenAmount.uiAmount ? txObj.accountKeys[pre.accountIndex]?.pubkey : '',
          decimals: pre.uiTokenAmount.decimals
        });
      }
    });

    // Determine signer and recipient
    const signer = txObj.accountKeys?.find((acc: any) => acc.signer)?.pubkey || '';
    const recipient = txObj.accountKeys?.find((acc: any, index: number) => !acc.signer && index > 0)?.pubkey || '';

    // Parse log messages
    const logMessages = txObj.meta?.logMessages || [];
    const programLogs = logMessages.filter((log: string) => log.includes('Program '));

    // Calculate total amount from balance changes
    const totalAmount = balanceChanges.reduce((sum: number, change: any) => {
      const changeNum = parseFloat(change.change);
      return sum + (changeNum > 0 ? changeNum : 0);
    }, 0);

    return {
      signature: txObj.signature || txObj.transaction.signatures[0],
      blockNumber: txObj.blockHeight || txObj.slot,
      timestamp: txObj.createdAt ? new Date(txObj.createdAt).toLocaleString() : '',
      blockTime: txObj.createdAt ? new Date(txObj.createdAt).toUTCString() : '',
      status: txObj.meta?.err === null ? 'success' : 'failed',
      signer,
      recipient,
      amount: totalAmount.toFixed(6),
      amountUSD: '', // Not available in API
      token: 'GORB',
      fee: txObj.meta?.fee ? (txObj.meta.fee / 1e9).toFixed(6) + ' GORB' : '',
      feeUSD: '',
      computeUnits: txObj.meta?.computeUnitsConsumed || 0,
      version: txObj.version,
      recentBlockhash: txObj.blockhash,
      instructions: programLogs.map((log: string, idx: number) => {
        const programMatch = log.match(/Program ([A-Za-z0-9]+)/);
        const programId = programMatch ? programMatch[1] : '';
        const isInvoke = log.includes('invoke');
        const isSuccess = log.includes('success');

        return {
          programId,
          programName: programId,
          instruction: isInvoke ? 'invoke' : isSuccess ? 'success' : 'unknown',
          data: '',
          accounts: txObj.accountKeys?.map((acc: any) => ({
            pubkey: acc.pubkey,
            isSigner: acc.signer,
            isWritable: acc.writable
          })) || [],
          innerInstructions: txObj.meta?.innerInstructions?.[idx]?.instructions?.map((iinstr: any) => ({
            programId: iinstr.programId || '',
            programName: iinstr.program || '',
            instruction: iinstr.parsed?.type || iinstr.type || '',
            data: iinstr.data || '',
            info: iinstr.parsed?.info || {},
          })) || []
        };
      }),
      tokenTransfers,
      balanceChanges,
      logs: logMessages,
      rewards: txObj.meta?.rewards?.map((reward: any) => ({
        account: txObj.accountKeys[reward.accountIndex]?.pubkey || '',
        amount: (reward.lamports / 1e9).toFixed(6),
        type: reward.rewardType
      })) || []
    };
  };

  const tx = transaction ? parseTransaction(transaction) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transaction...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">No transaction data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="relative w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <div className="flex items-center gap-2">
              <Tag status={tx.status === 'success' ? 'success' : 'error'}>
                {tx.status === 'success' ? 'Success' : 'Failed'}
              </Tag>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <code className="font-mono text-sm flex-1 break-all">{tx.signature}</code>
            <CopyButton text={tx.signature} type="signature" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transaction Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Transaction Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-mono font-medium">{tx.amount} {tx.token}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fee</span>
                      <span className="font-mono text-sm">{tx.fee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compute Units</span>
                      <span className="font-mono text-sm">{tx.computeUnits.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Block</span>
                      <span className="font-mono text-sm">#{tx.blockNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Version</span>
                      <span className="font-mono text-sm">{tx.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Timestamp</span>
                      <span className="font-mono text-sm">{tx.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Transfers */}
            {tx.tokenTransfers && tx.tokenTransfers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Token Transfers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tx.tokenTransfers.map((transfer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{formatAmount(transfer.amount, transfer.decimals)} {transfer.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {transfer.from && `From: ${formatAddress(transfer.from)}`}
                              {transfer.to && `To: ${formatAddress(transfer.to)}`}
                            </div>
                          </div>
                        </div>
                        <CopyButton text={transfer.mint} type={`token-${index}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Balance Changes */}
            {tx.balanceChanges && tx.balanceChanges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Balance Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tx.balanceChanges.map((change, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <div className="font-medium">{formatAddress(change.account)}</div>
                            <div className="text-sm text-muted-foreground">
                              {change.preBalance} → {change.postBalance}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-mono text-sm ${parseFloat(change.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {parseFloat(change.change) >= 0 ? '+' : ''}{change.change} GORB
                          </div>
                          <CopyButton text={change.account} type={`balance-${index}`} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Program Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Program Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tx.instructions.map((instruction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <span className="font-medium">{instruction.instruction}</span>
                        <Badge variant="secondary">{instruction.programName}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Program ID:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="font-mono text-xs bg-muted p-2 rounded flex-1">
                              {instruction.programId}
                            </code>
                            <CopyButton text={instruction.programId} type={`program-${index}`} />
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Accounts:</span>
                          <div className="mt-1 space-y-1">
                            {instruction.accounts.slice(0, 3).map((account, accIndex) => (
                              <div key={accIndex} className="flex items-center gap-2">
                                <code className="font-mono text-xs">
                                  {formatAddress(account.pubkey, 6)}
                                </code>
                                <div className="flex gap-1">
                                  {account.isSigner && <Badge variant="outline" className="text-xs">S</Badge>}
                                  {account.isWritable && <Badge variant="outline" className="text-xs">W</Badge>}
                                </div>
                              </div>
                            ))}
                            {instruction.accounts.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{instruction.accounts.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Inner Instructions */}
                      {instruction.innerInstructions && instruction.innerInstructions.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-sm font-medium text-muted-foreground">Inner Instructions:</span>
                          <div className="mt-2 space-y-2">
                            {instruction.innerInstructions.map((inner, innerIndex) => (
                              <div key={innerIndex} className="bg-muted/50 p-2 rounded text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{inner.instruction}</span>
                                  <span className="text-muted-foreground">{inner.programName}</span>
                                </div>
                                {Object.keys(inner.info).length > 0 && (
                                  <div className="mt-1 text-muted-foreground">
                                    {Object.entries(inner.info).slice(0, 3).map(([k, v]) => (
                                      <span key={k} className="mr-3">
                                        {k}: {String(v).slice(0, 20)}
                                        {String(v).length > 20 ? '...' : ''}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Metadata */}
          <div className="space-y-6">
            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Blockhash</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs">
                        {formatAddress(tx.recentBlockhash, 8)}
                      </code>
                      <CopyButton text={tx.recentBlockhash} type="blockhash" size="sm" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Signer</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs">
                        {formatAddress(tx.signer, 6)}
                      </code>
                      <CopyButton text={tx.signer} type="signer" size="sm" />
                    </div>
                  </div>
                  {tx.recipient && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Recipient</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs">
                            {formatAddress(tx.recipient, 6)}
                          </code>
                          <CopyButton text={tx.recipient} type="recipient" size="sm" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            {tx.rewards && tx.rewards.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tx.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="text-sm font-medium">{formatAddress(reward.account, 6)}</div>
                          <div className="text-xs text-muted-foreground">{reward.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">+{reward.amount} GORB</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Raw Logs */}
            {tx.logs && tx.logs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Raw Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="logs" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="logs">Logs</TabsTrigger>
                      <TabsTrigger value="raw">Raw Data</TabsTrigger>
                    </TabsList>
                    <TabsContent value="logs" className="mt-4">
                      <div className="max-h-64 overflow-y-auto space-y-1">
                        {tx.logs.map((log, index) => (
                          <div key={index} className="text-xs font-mono bg-muted/50 p-2 rounded">
                            {log}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="raw" className="mt-4">
                      <div className="max-h-64 overflow-y-auto">
                        <pre className="text-xs bg-muted/50 p-3 rounded overflow-x-auto">
                          {JSON.stringify(transaction, null, 2)}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};