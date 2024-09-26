import "/app/styles/header.css";
import Image from 'next/image';

export default function Header() {
  return (
    <div className="header-component">
      
      <div className="header">
        <a href="/dashboardEmployee">
        <Image className="logo" src="/logo.png" alt="Logo" width={1600} height={800} />
        </a>
      </div>
    </div>
  );
}
