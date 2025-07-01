"use client";

import React from 'react';
import { StatBox } from '@/components/atoms/StatBox';
import { Activity, Zap, Users, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-8 md:py-12 bg-gradient-to-b from-[#0B0F15] to-[#121C27] border-b border-white/10">
      <div className="mx-auto px-4 flex flex-col items-center justify-center max-w-2xl">
        <div className="flex flex-col items-center justify-center w-full">
          <span className="relative flex items-center justify-center mb-2">
            <span className="absolute w-32 h-32 md:w-36 md:h-36 rounded-full z-0" style={{background: 'radial-gradient(circle at center, #24D97310 0%, #0B0F15 60%)', boxShadow: '0 0 40px 10px #24D97333'}}></span>
            <img
              src="/assets/logo.png"
              alt="GorbScan Logo"
              className="relative w-20 h-20 md:w-28 md:h-28 z-10 group-hover:scale-105 transition-transform duration-200"
              style={{ filter: 'drop-shadow(0 0 20px #24D97388)' }}
            />
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-orbitron text-white mb-1 drop-shadow-lg tracking-tight text-center">
            GorbScan
          </h1>
          <span className="text-base text-cyan-300 font-medium mt-1 mb-2 tracking-wide">Blockchain Explorer</span>
        </div>
        <p className="text-2xl md:text-3xl font-semibold text-cyan-200 mb-2 drop-shadow text-center font-orbitron">
          The <span className="text-green-400 font-bold">Gorbchain</span> Block Explorer
        </p>
        <p className="text-base text-slate-200 mb-4 max-w-[640px] mx-auto text-center leading-relaxed hero-subtext">
          Search for any address, transaction, block, or token on Gorbchain. Simple, fast, and made for everyone.
        </p>
        <a href="/blocks" className="mt-4 mb-8 flex justify-center w-full">
          <button className="btn-cta py-3 px-6 text-base rounded-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-green-400 hover:to-cyan-400 text-white font-bold shadow-lg border-none transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:outline-none hover:shadow-[0_0_16px_#24D973] hover:scale-105 cursor-pointer">
            Explore Gorbchain Data
          </button>
        </a>
        <div className="section-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-2xl mx-auto mt-8">
          <StatBox
            label="Network TPS"
            value="2,847"
            icon={Zap}
            trend={{ value: 12.5, isPositive: true }}
            tooltip="Transactions per second, updated live."
            href="/charts"
          />
          <StatBox
            label="Active Validators"
            value="156"
            icon={Users}
            trend={{ value: 3.2, isPositive: true }}
            tooltip="Number of active block validators."
            href="/validators"
          />
          <StatBox
            label="Total Blocks"
            value="8,429,847"
            icon={Activity}
            trend={{ value: 0.8, isPositive: true }}
            tooltip="Total blocks produced on Gorbchain."
            href="/blocks"
          />
          <StatBox
            label="Market Cap"
            value="$2.4B USD"
            icon={TrendingUp}
            trend={{ value: 8.7, isPositive: true }}
            tooltip="Estimated total value of GORB tokens."
            href="/charts"
          />
        </div>
        {/* Optionally, render LatestTransactions here for immediate content */}
      </div>
    </section>
  );
};