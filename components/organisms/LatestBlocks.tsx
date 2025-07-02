"use client";

import React from 'react';
import { BlockRow } from '@/components/molecules/BlockRow';
import { useGorbchainData } from '@/contexts/GorbchainDataContext';
import { ArrowRight, Box } from 'lucide-react';

export const LatestBlocks: React.FC = () => {
	const { blocks, loading } = useGorbchainData();

	// Get the latest 4 blocks from the context
	const latestBlocks = blocks.slice(0, 4);

	if (loading) {
		return (
			<section className="w-full section-spacing-sm bg-gradient-to-b from-card/20 to-background border-t border-border">
				<div className="container-page">
					<div className="section-header">
						<div className="section-title">
							<div className="section-icon bg-primary/20 shadow-glow">
								<Box className="icon-xl text-primary" />
							</div>
							<div>
								<h2 className="heading-lg mb-2">
									Latest Blocks
								</h2>
								<p className="body-lg">
									Real-time block production on Gorbchain
								</p>
							</div>
						</div>
						
						<a
							href="/blocks"
							className="btn-outline btn-md group"
							aria-label="View all blocks"
						>
							View All Blocks
							<ArrowRight className="icon-md group-hover:translate-x-1 transition-transform duration-200" />
						</a>
					</div>
					
					<div className="grid gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i} className="gorb-card p-6 animate-pulse">
								<div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
								<div className="h-4 bg-muted rounded w-1/2"></div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full section-spacing-sm bg-gradient-to-b from-card/20 to-background border-t border-border">
			<div className="container-page">
				<div className="section-header">
					<div className="section-title">
						<div className="section-icon bg-primary/20 shadow-glow">
							<Box className="icon-xl text-primary" />
						</div>
						<div>
							<h2 className="heading-lg mb-2">
								Latest Blocks
							</h2>
							<p className="body-lg">
								Real-time block production on Gorbchain
							</p>
						</div>
					</div>
					
					<a
						href="/blocks"
						className="btn-outline btn-md group"
						aria-label="View all blocks"
					>
						View All Blocks
						<ArrowRight className="icon-md group-hover:translate-x-1 transition-transform duration-200" />
					</a>
				</div>
				
				<div className="grid gap-4">
					{latestBlocks.map((block) => (
						<BlockRow key={block.blockNumber} {...block} />
					))}
					
					{latestBlocks.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No recent blocks available</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};