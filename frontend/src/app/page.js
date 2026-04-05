import Header from '@/components/home/Header';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow">
        <Header />
      </div>
      <Footer />
    </main>
  );
}