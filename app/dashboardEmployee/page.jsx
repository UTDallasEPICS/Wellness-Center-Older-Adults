import "/app/styles/dashboardPage.css";
import TextContainer from "/app/components/TextContainer.jsx";

export default function Page() {
  return (
    <div className="h-[90%] w-full">
      <h1 className="text-black text-left font-light text-[40px] ml-[5%]">Dashboard</h1>
      <div className="flex flex-col gap-5 md:flex-row">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
    </div>
  );
}


    /* 
    <main className="main-content">
      <div className="card-header">
        <div className="title-bar">
          <div className="title">Dashboard</div>
        </div>
      </div>

      <div className="card small"></div>
      <div className="card medium"></div>
      <div className="card medium"></div>
    </main>
    */