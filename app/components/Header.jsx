import Image from 'next/image';

export default function Header() {
  return (
    <div className="bg-white py-4 shadow-md">
      <div className="flex justify-center">
        <a href="/Dashboard">
          <Image 
            className="w-40 h-auto" 
            src="/logo.png" 
            alt="Logo" 
            width={1600} 
            height={800} 
          />
        </a>
      </div>
    </div>
  );
}

