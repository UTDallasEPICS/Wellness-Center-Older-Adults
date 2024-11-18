import React from "react";

export default function Page() {
  return (
    <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div className="flex w-full">
        {/* Table Section */}
        <div className="w-3/4">
          <table className="w-full text-left table-auto min-w-max border-collapse border border-4 border-[#65b037]">
            <thead>
              <tr>
                <th className="p-4 border-b border-r border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Name
                  </p>
                </th>
                <th className="p-4 border-b border-r border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Hours
                  </p>
                </th>
                <th className="p-4 border-b border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Date
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    John Michael
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    10
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    23/04/18
                  </p>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Bob
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    4
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    23/04/18
                  </p>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Laurent Perrier
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    4
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    19/09/17
                  </p>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Michael Levi
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    3
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    24/12/08
                  </p>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Richard Gran
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    6
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    04/10/21
                  </p>
                </td>
              </tr>
              {/* Additional rows */}
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Emma Watson
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    5
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    15/02/20
                  </p>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Sarah Johnson
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    8
                  </p>
                </td>
                <td className="p-4 border-b border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    11/05/19
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Hours Section */}
        <div className="flex items-center justify-center w-1/4 mt-6">
          <div className="text-[#65b037] text-[140px] bg-[#65b037]/30 w-[230px] h-[230px] rounded-full flex justify-center items-center mx-auto mt-[10%]">
            4
          </div>
        </div>
      </div>
    </div>
  );
}
