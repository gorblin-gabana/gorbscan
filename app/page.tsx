import { Navbar } from '@/components/organisms/Navbar';
import { HeroSection } from '@/components/organisms/HeroSection';
import { LatestBlocks } from '@/components/organisms/LatestBlocks';
import { LatestTransactions } from '@/components/organisms/LatestTransactions';
import { Footer } from '@/components/organisms/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <LatestBlocks />
        <LatestTransactions />
      </main>
      <Footer />
    </div>
  );
}