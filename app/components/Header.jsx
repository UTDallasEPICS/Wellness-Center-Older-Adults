import "app/styles/header.css";
import Image from 'next/image';

export default function Header() {
  return (
    <div className="header-component">
      
      <div className="header">
        <a href="/">
        <Image className="logo" src="/logo.png" alt="Logo" width={100} height={50} />
        </a>
      </div>
    </div>
  );
}
