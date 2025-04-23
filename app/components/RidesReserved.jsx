function ReservedRides() {
  const names = ["Bob Ross", "Bob Ross Jr", "Bob Ross II", "Bob Ross III", "Bross"];
  const getRandomDates = () => {
    const dates = ["2023-04-10", "2023-04-15", "2023-04-20", "2023-05-01", "2023-05-05", "2023-05-10"];
    return dates.map(date => new Date(date).toLocaleDateString());
  };
  const randomDates = getRandomDates();

  return (
    <div className="bg-white p-5 shadow-md rounded-lg my-5 mx-auto w-[95%]">
      <h1 className="text-center text-[#333] text-xl font-normal mb-5">Rides Reserved</h1>
      <table className="w-full border-collapse m-0">
        <thead>
          <tr>
            <th className="bg-gray-200 text-[#333] font-bold p-3 text-left border-b border-gray-300">Name</th>
            <th className="bg-gray-200 text-[#333] font-bold p-3 text-left border-b border-gray-300">Date</th>
            <th className="bg-gray-200 text-[#333] font-bold p-3 text-left border-b border-gray-300">Contact Info</th>
          </tr>
        </thead>
        <tbody>
          {names.map((name, index) => (
            <tr key={index} className="hover:bg-gray-100 odd:bg-white even:bg-gray-50">
              <td className="p-3 text-left border-b border-gray-300">{name}</td>
              <td className="p-3 text-left border-b border-gray-300">{randomDates[index % randomDates.length]}</td>
              <td className="p-3 text-left border-b border-gray-300">123</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservedRides;