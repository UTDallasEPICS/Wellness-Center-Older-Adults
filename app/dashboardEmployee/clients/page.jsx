import "app/styles/clientPage.css";
import ClientInputForm from "app/components/ClientInputForm.jsx";

export default function Page() {
  return (
    <div className="clientPageContainer">
      <p className="clientTitle">Client Page</p>
      <ClientInputForm />
    </div>
  );
}
