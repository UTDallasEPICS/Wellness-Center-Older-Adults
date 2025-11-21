import { useState } from "react";

const AdminInputForm = ({ onSubmit, onClose, initialData = null }) => {
  const [adminInfo, setAdminInfo] = useState({
    email: initialData?.email || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phone: initialData?.phone || "",
  });

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const validateFields = (data) => {
    const out = { email: "", firstName: "", lastName: "", phone: "" };
    const email = (data.email || "").trim();
    const first = (data.firstName || "").trim();
    const last = (data.lastName || "").trim();
    const phoneRaw = (data.phone || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    const nameRe = /^[A-Za-z][A-Za-z' -]{0,39}$/; // 1-40 chars letters, space, -, '
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!first || !nameRe.test(first)) {
      out.firstName = "First name is required and must be 1-40 letters (may include space, - or ').";
    }
    if (!last || !nameRe.test(last)) {
      out.lastName = "Last name is required and must be 1-40 letters (may include space, - or ').";
    }
    if (!email || !emailRe.test(email) || email.length > 254) {
      out.email = "Enter a valid email address.";
    }
    if (phoneRaw && phoneDigits.length !== 10) {
      out.phone = "Enter a valid 10-digit phone number or leave blank.";
    }
    return out;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateFields(adminInfo);
    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      email: adminInfo.email.trim(),
      firstName: adminInfo.firstName.trim(),
      lastName: adminInfo.lastName.trim(),
      phone: adminInfo.phone.trim(),
      id: initialData?.id, // allow edit flows to pass id through
    });
  };

  const isEdit = Boolean(initialData);

  return (
    <div className="bg-gray-100 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-[500px]">
      <h1 className="block text-gray-700 text-2xl font-bold mb-6 text-center">{isEdit ? 'Edit Admin' : 'Add New Admin'}</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4 mb-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={adminInfo.email}
            onChange={handleChange}
            maxLength={254}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="First Name"
            name="firstName"
            value={adminInfo.firstName}
            onChange={handleChange}
            maxLength={40}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={adminInfo.lastName}
            onChange={handleChange}
            maxLength={40}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={adminInfo.phone || ""}
            onChange={handleChange}
            inputMode="tel"
            maxLength={20}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-[#419902] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isEdit ? 'Save' : 'Add Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminInputForm;