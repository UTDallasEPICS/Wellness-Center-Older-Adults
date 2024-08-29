import React from 'react';
import '/app/styles/tile.css'; 

const Tile = () => {
  return (
    <div className="tile">
      <table className="summary-table">
        <thead>
          <tr>
            <th>Volunteer Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Volunteer Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            
            <td>Jane Smith</td>
            <td>123-456-6789</td>
            <td>123 Address</td>
            <td>5 hrs</td>
          </tr>
        </tbody>
      </table>

     
      <div className="detail-info">
        Name: Jane Smith<br />
        Address: 123 Address<br />
        Phone number: 321-654-1987<br />
        Volunteers Hours: 5hrs
      </div>
    </div>
  );
};

export default Tile;