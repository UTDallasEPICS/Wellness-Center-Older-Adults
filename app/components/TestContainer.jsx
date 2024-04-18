import "app/styles/testContainer.css";
import TestContainerTwo from "app/components/TestContainerTwo.jsx";

export default function TestContainer() {
  return (
    <div className="mainContainer">
      <p className="containerText">This is example text</p>
      <div className="contentElements">
        <TestContainerTwo />
      </div>
    </div>
  );
}
