
import Image from 'next/image';
import "/app/styles/volunteerAdmin.css"

export default function Page() {
  return (
    <div className="page-component">
      <div className="page">
        <h1 className="page-title">Welcome to the Admin Portal</h1>
        <a href="/registration">
          <button className="register-button">Register Admin Here</button>
        </a>
      </div>
    </div>
  );
}
