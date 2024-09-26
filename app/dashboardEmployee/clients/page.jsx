import "/app/styles/clientPage.css";
import ClientInputForm from "/app/components/ClientInputForm.jsx";
import ListItemContainer from "/app/components/ListItemContainer.jsx";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <div className="flex flex-row items-center py-8 px-8">
        <div className="text-black text-left font-light text-[30px]">
          <h1>Client Page</h1>
        </div>

        <div className="ml-auto pr-6">
          <ClientInputForm />
        </div>
        <div className="pr-6">
          <button type="button" className="h-[45px] w-[45px] rounded-full text-white bg-black border-none">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>

      {/* Client List Header */}
      <div className="grid grid-cols-5 text-black px-6 py-4 font-light text-[15px] bg-white border-b border-gray-300 w-full">
        <p>Name</p>
        <p>Address</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Birthdate</p>
      </div>

      {/* Client List Table */}
      <div className="w-full flex flex-col text-black bg-white border-t border-b border-gray-300">
        <div className="grid grid-cols-5 py-4 border-b border-gray-300 px-6">
          <p>Jane Doe</p>
          <p>123 Address</p>
          <p>abc@gmail.com</p>
          <p>123-456-789</p>
          <p>Jan 15, 1980</p>
        </div>
        <div className="grid grid-cols-5 py-4 border-b border-gray-300 px-6">
          <p>John Smith</p>
          <p>456 Address</p>
          <p>def@gmail.com</p>
          <p>523-456-789</p>
          <p>Dec 15, 1980</p>
        </div>
      </div>
    </div>
  );
}
