"use client";

import React from 'react';
import { BlockRow } from '@/components/molecules/BlockRow';
import { Button } from '@/components/atoms/Button';
import { ArrowRight } from 'lucide-react';

const mockBlocks = [
	{
		blockNumber: 8429847,
		timestamp: '12 secs ago',
		transactionCount: 247,
		validator: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
		reward: '2.5',
		gasUsed: '29,847,392',
	},
	{
		blockNumber: 8429846,
		timestamp: '24 secs ago',
		transactionCount: 189,
		validator: '0x8D4C0532925a3b8D4742d35Cc6634C0532925a3b',
		reward: '2.5',
		gasUsed: '28,392,847',
	},
	{
		blockNumber: 8429845,
		timestamp: '36 secs ago',
		transactionCount: 312,
		validator: '0x925a3b8D4742d35Cc6634C0532925a3b8D4C0532',
		reward: '2.5',
		gasUsed: '30,192,485',
	},
	{
		blockNumber: 8429844,
		timestamp: '48 secs ago',
		transactionCount: 156,
		validator: '0xC6634C0532925a3b8D4742d35Cc6634C0532925a',
		reward: '2.5',
		gasUsed: '27,583,291',
	},
];

export const LatestBlocks: React.FC = () => {
	return (
		<section className="w-full py-14 bg-transparent border-t border-white/10">
			<div className="container mx-auto px-4 max-w-2xl">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
					<div>
						<h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-1 flex items-center gap-2 drop-shadow">
							<span>Latest Blocks</span>
						</h2>
						<p className="text-cyan-200 text-base">
							Real-time block production on Gorbchain
						</p>
					</div>
					<Button
						variant="primary"
						className="px-6 py-3 text-base rounded-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-green-400 hover:to-cyan-400 text-white font-bold shadow-lg border-none"
					>
						View All Blocks
					</Button>
				</div>
				<div className="space-y-6">
					{mockBlocks.map((block) => (
						<BlockRow key={block.blockNumber} {...block} />
					))}
				</div>
			</div>
		</section>
	);
};