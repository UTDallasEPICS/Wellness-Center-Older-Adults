// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Dashboard", href: "/dashboardEmployee" },
  {
    name: "Rides",
    href: "/dashboardEmployee/rides",
  },
  {
    name: "Volunteers",
    href: "/dashboardEmployee/volunteers",
  },
  {
    name: "Clients",
    href: "/dashboardEmployee/clients",
  },
  {
    name: "Settings",
    href: "/dashboardEmployee/settings",
  },
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        return (
          <a key={link.name} href={link.href}>
            <p>{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
