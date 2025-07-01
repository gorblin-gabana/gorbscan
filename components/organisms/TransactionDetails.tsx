"use client";

import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Clock, User, Zap, Hash, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Tag } from '@/components/atoms/Tag';
import { AddressDisplay } from '@/components/molecules/AddressDisplay';

interface TransactionDetailsProps {
  hash: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ hash }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  // Mock transaction data
  const transaction = {
    signature: hash,
    blockNumber: 35030807,
    timestamp: '35 secs ago',
    absoluteTime: 'July 01, 2025 01:14:15 +UTC',
    status: 'success' as const,
    signer: 'CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY',
    fee: '0.000005 GORB ($0.0007735)',
    computeUnits: 150,
    version: 0,
    recentBlockhash: '4zof66MBP99c6FryFUSwqquYyaPYtg7bZcuaeutiR99azuRG5q5QcaqkZNb19qPu9RZChsAisbVMVog7hebCmHjq',
    instructions: [
      {
        type: 'Transfer',
        program: 'System Program',
        from: 'CzACds...4Y8USY',
        to: 'Jlotip1',
        amount: '0.000001',
        token: 'GORB'
      }
    ]
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'token-balance', label: 'Token Balance Change' },
    { id: 'account-input', label: 'Account Input' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-orbitron text-foreground mb-2">
            Transaction Details
          </h1>
          <div className="flex items-center gap-2">
            <Tag status="info">#MEV-Tip</Tag>
          </div>
        </div>
        <Button variant="primary" className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Inspect Tx
        </Button>
      </div>

      {/* Main Content */}
      <div className="gorb-card p-6">
        {/* Tabs */}
        <div className="flex items-center gap-6 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Transaction Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Signature</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground">
                      {transaction.signature.slice(0, 8)}...{transaction.signature.slice(-8)}
                    </span>
                    <button
                      onClick={() => handleCopy(transaction.signature)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-gorb-green" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Block & Timestamp</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-primary font-medium">#{transaction.blockNumber}</div>
                    <div className="text-xs text-muted-foreground">{transaction.absoluteTime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Result</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag status="success">SUCCESS</Tag>
                    <span className="text-sm text-muted-foreground">Finalized (MAX Confirmations)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Signer</span>
                  </div>
                  <AddressDisplay address={transaction.signer} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Fee</span>
                  </div>
                  <span className="text-sm text-foreground">{transaction.fee}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Compute Units Consumed</span>
                  <span className="text-sm text-foreground">{transaction.computeUnits}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Transaction Version</span>
                  <span className="text-sm text-foreground">{transaction.version}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Recent Blockhash</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground">
                      {transaction.recentBlockhash.slice(0, 8)}...{transaction.recentBlockhash.slice(-8)}
                    </span>
                    <button
                      onClick={() => handleCopy(transaction.recentBlockhash)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Transaction Actions</h3>
                <div className="flex items-center gap-2">
                  <Tag status="success">Legacy Mode</Tag>
                  <Button variant="outline" size="sm">
                    Tx Maps
                  </Button>
                </div>
              </div>

              {/* Instruction */}
              <div className="gorb-card p-4 bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Interact with instruction</span>
                      <Tag status="info" className="ml-2">Transfer</Tag>
                      <span className="text-sm text-muted-foreground ml-2">on</span>
                      <span className="text-sm text-primary ml-1">System Program</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Transfer from</span>
                    <AddressDisplay address={transaction.signer} />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <AddressDisplay address="Jlotip1CzACdsNaSxoqtoGw4FrrgL6f27hDymptAHUhZb4Y8USY" />
                  <span className="text-muted-foreground">for</span>
                  <span className="font-medium text-foreground">{transaction.instructions[0].amount}</span>
                  <span className="text-primary">{transaction.instructions[0].token}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Token Balance Change Tab */}
        {activeTab === 'token-balance' && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No token balance changes detected</p>
          </div>
        )}

        {/* Account Input Tab */}
        {activeTab === 'account-input' && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Account input data will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};