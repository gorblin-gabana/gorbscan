import React from 'react';
import { Github, Twitter, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/logo.png" alt="GorbScan Logo" className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-bold font-orbitron text-foreground">
                  GorbScan
                </h3>
                <p className="text-xs text-muted-foreground">
                  Gorbchain Explorer
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              The most comprehensive blockchain explorer for Gorbchain. 
              Track transactions, explore blocks, and monitor network activity in real-time.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
                <Github className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-primary/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Explorer Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Explorer</h4>
            <ul className="space-y-2">
              <li><a href="/blocks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blocks</a></li>
              <li><a href="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Transactions</a></li>
              <li><a href="/l2-chains" className="text-sm text-muted-foreground hover:text-foreground transition-colors">L2 Chains</a></li>
              <li><a href="/charts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Charts</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API Docs</a></li>
              <li><a href="/status" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Network Status</a></li>
              <li><a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 GorbScan. Built with ❤️ for the Gorbchain community.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};