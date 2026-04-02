import Header from '@/components/home/Header';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    // Use min-h-screen and flex-col
    <main className="min-h-screen flex flex-col bg-white">
      <div className="flex-grow">
        <Header />
      </div>
      {/* Ensure Footer is OUTSIDE the flex-grow div */}
      <Footer />
    </main>
  );
}