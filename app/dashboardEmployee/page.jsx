import "app/styles/dashboardPage.css";
import TestContainer from "app/components/TestContainer.jsx";

export default function Page() {
  return (
    <div className="dashContainer">
      <p className="dashTitle">Dashboard Page</p>
      <TestContainer />
    </div>
  );
}
