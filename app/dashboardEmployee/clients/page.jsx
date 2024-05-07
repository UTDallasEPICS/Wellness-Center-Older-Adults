import "app/styles/clientPage.css";

import ClientInputForm from "app/components/ClientInputForm.jsx";
import ListItemContainer from "app/components/ListItemContainer.jsx";

export default function Page() {
  return (
    <div className="clientPageContainer">
      <div className="clientBoxHead">
        <div className="clientTitle">
          <h1>Client Page</h1>
        </div>

        <div className="addClientButtonContainer">
          <ClientInputForm />
        </div>
        <div className="editButtonContainer">
          <button type="button" className="editButton">
            <span className="material-symbols-rounded">edit</span>
          </button>
        </div>
      </div>
      <div className="clientListLabels">
        <p>Name</p>
        <p>Address</p>
        <p>Email</p>
        <p>Phone</p>
        <p>Birthdate</p>
      </div>
      <div className="clientListContainer">
        <p> </p>
        <ListItemContainer
          clientName="Jane Doe"
          clientAddress="123 Address"
          clientEmail="abc@gmail.com"
          clientPhone="123-456-789"
          clientBirthdate="Jan 15, 1980"
        />
        <p> </p>
        <ListItemContainer
          clientName="John Smith"
          clientAddress="456 Address"
          clientEmail="def@gmail.com"
          clientPhone="523-456-789"
          clientBirthdate="Dec 15, 1980"
        />
      </div>
    </div>
  );
}
