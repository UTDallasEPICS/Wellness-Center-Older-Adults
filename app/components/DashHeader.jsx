import "app/styles/dashHeader.css";

export default function DashHeader() {
  return (
    <div className="header-component">
      <div className="logo-component">
        <a href="/">
          <p className="header-text">WCOA</p>
        </a>
      </div>
      <div className="profile-circle">
        <img
          className="profile-placeholder"
          src="/images/profileImagePlaceHolder.png"
          alt="profile image"
        />
      </div>
    </div>
  );
}
