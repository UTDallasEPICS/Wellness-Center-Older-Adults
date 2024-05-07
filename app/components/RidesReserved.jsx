import "app/styles/reservedRides.css";

// Array of fake names
const names = ["Bob Ross", "Bob Ross Jr", "Bob Ross II", "Bob Ross III", "Bross"];

// Function to generate random dates
const getRandomDates = () => {
  const dates = [
    "2023-04-10", "2023-04-15", "2023-04-20",
    "2023-05-01", "2023-05-05", "2023-05-10"
  ];
  return dates.map(date => new Date(date).toLocaleDateString());
};

// Array of random dates
const randomDates = getRandomDates();

function ReservedRides() {
  return (
    <div className="reserved-rides">
      <h1>Rides Reserved</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Contact Info</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name, index) => (
            <tr key={index}>
              <td>{name}</td>
              <td>{randomDates[index % randomDates.length]}</td>
              <td>123</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservedRides;