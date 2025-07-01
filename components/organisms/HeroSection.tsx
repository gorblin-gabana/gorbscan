"use client";

import React from 'react';
import { StatBox } from '@/components/atoms/StatBox';
import { Activity, Zap, Users, TrendingUp } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-20 md:py-28 bg-gradient-to-b from-[#0B0F15] to-[#121C27] border-b border-white/10">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center max-w-2xl animate-fade-in-up">
        <div className="flex flex-col items-center justify-center w-full">
          <span className="relative flex items-center justify-center mb-4">
            <span className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full z-0" style={{background: 'radial-gradient(circle at center, #24D97310 0%, #0B0F15 60%)', boxShadow: '0 0 40px 10px #24D97333'}}></span>
            <img
              src="/assets/logo.png"
              alt="GorbScan Logo"
              className="relative w-24 h-24 md:w-32 md:h-32 z-10 group-hover:scale-105 transition-transform duration-200"
              style={{ filter: 'drop-shadow(0 0 20px #24D97388)' }}
            />
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold font-orbitron text-white mb-2 drop-shadow-lg tracking-tight text-center">
            GorbScan
          </h1>
        </div>
        <p className="text-2xl md:text-3xl font-semibold text-cyan-200 mb-3 drop-shadow text-center">
          The <span className="text-[#24D973] font-bold">Gorbchain</span> Block Explorer
        </p>
        <p className="text-base text-[#94A3B8] mb-6 max-w-[640px] mx-auto text-center leading-relaxed hero-subtext">
          Search for any address, transaction, block, or token on Gorbchain. Simple, fast, and made for everyone.
        </p>
        <a href="/blocks" className="mt-6 mb-12 flex justify-center w-full">
          <button className="btn-cta py-3 px-6 text-base rounded-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-green-400 hover:to-cyan-400 text-white font-bold shadow-lg border-none transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:outline-none hover:shadow-[0_0_16px_#24D973] hover:scale-105 cursor-pointer">
            Start Exploring
          </button>
        </a>
        <div className="section-metrics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-2xl mx-auto mt-12">
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
            value="$2.4B"
            icon={TrendingUp}
            trend={{ value: 8.7, isPositive: true }}
            tooltip="Estimated total value of GORB tokens."
            href="/charts"
          />
        </div>
      </div>
    </section>
  );
};