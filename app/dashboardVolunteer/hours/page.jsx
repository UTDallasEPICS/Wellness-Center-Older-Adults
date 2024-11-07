import React from "react";

export default function Page() {
  return (
    <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
      <div className="flex w-full">
        {/* Table Section */}
        <div className="w-3/4">
          <table className="w-full text-left table-auto min-w-max border-collapse border border-8 border-white">
            <thead>
              <tr>
                <th className="p-4 border-b border-r border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Name
                  </p>
                </th>
                <th className="p-4 border-b border-r border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Job
                  </p>
                </th>
                <th className="p-4 border-b border-gray-300 bg-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                    Employed
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
                    Manager
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
                    Alexa Liras
                  </p>
                </td>
                <td className="p-4 border-b border-r border-gray-300">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    Developer
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
                    Executive
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
                    Developer
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
                    Manager
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
                    Designer
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
                    Product Manager
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
          <div className="w-60 h-60 rounded-full inline-flex items-center justify-center bg-custom-green text-gray-700 text-xl font-bold">
            Total Hours
          </div>
        </div>
      </div>
    </div>
  );
}
