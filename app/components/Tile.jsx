import React from 'react';

const Tile = () => {
  return (
    <div className="w-full max-w-[800px] mx-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b border-gray-300">Volunteer Name</th>
            <th className="p-2 border-b border-gray-300">Contact</th>
            <th className="p-2 border-b border-gray-300">Address</th>
            <th className="p-2 border-b border-gray-300">Volunteer Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border-b border-gray-300">Jane Smith</td>
            <td className="p-2 border-b border-gray-300">123-456-6789</td>
            <td className="p-2 border-b border-gray-300">123 Address</td>
            <td className="p-2 border-b border-gray-300">5 hrs</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-5">
        Name: Jane Smith<br />
        Address: 123 Address<br />
        Phone number: 321-654-1987<br />
        Volunteers Hours: 5hrs
      </div>
    </div>
  );
};

export default Tile;
