import Header from "app/components/Header.jsx";
import LandingMain from "app/components/LandingMain.jsx";
import Footer from "app/components/Footer.jsx";
import "app/styles/landingPage.css";

export default function LandingPage() {
  return (
    <div className="flex-container">
      <Header />
      <LandingMain />
      <Footer />
    </div>
  );
}
