
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex items-center justify-center h-[80vh] bg-[#fbfcf8] w-full" >
      <div className="page">
      <h1 className="text-center text-[#333333]">Welcome to the Admin Portal</h1>
        <a href="/registration">
        <button className="flex items-center justify-center text-center w-1/2 h-[50px] p-2 bg-[#419902] text-white font-bold text-lg cursor-pointer my-4 mx-auto transition-colors duration-300 hover:bg-[#357a01]">
Register </button>
        </a>
      </div>
    </div>
  );
}
