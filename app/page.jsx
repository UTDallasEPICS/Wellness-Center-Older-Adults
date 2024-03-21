import Header from "app/components/Header.jsx";
import LandingMain from "app/components/LandingMain.jsx";
import Footer from "app/components/Footer.jsx";

export default function Home() {
  return (
    <div className="flex-container">
      <Header />
      <LandingMain />
      <Footer />
    </div>
  );
}
