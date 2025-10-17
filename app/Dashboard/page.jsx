"use client";
import { useEffect, useState } from "react";
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity"; 
import { useRouter } from "next/navigation";

export default function Page() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [ridesData, setRidesData] = useState([]);
  const [ridesPercentage, setRidesPercentage] = useState(0);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserRoleAndName() {
      try {
        const roleRes = await fetch('/api/getRole');
        const roleData = await roleRes.json();
        if (roleRes.ok && roleData.role) {
          setRole(roleData.role);
          if (roleData.role === 'ADMIN') {
            // Stay on this page
          } else if (roleData.role === 'VOLUNTEER') {
            router.replace('/Dashboard/rides'); // Redirect volunteers to rides page
            return;
          } else {
            router.replace('/'); // Redirect all others to home
            return;
          }
        } else {
          setRole(null);
          router.replace('/');
          return;
        }
        const response = await fetch('/api/getFirstName');
        const data = await response.json();
        if (response.ok) {
          setWelcomeMessage(data.message);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setRole(null);
        router.replace('/');
      } finally {
        setLoading(false);
      }
    }

    async function fetchUserName() {
      try {
        const response = await fetch('/api/getFirstName');
        const data = await response.json();
        if (response.ok) {
          setWelcomeMessage(data.message);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    }
    
    async function fetchRides() {
      try {
        const response = await fetch("/api/getAvailableRides");
        if (!response.ok) throw new Error("Failed to fetch rides");
        const data = await response.json();

        // Filter rides for current year
        const currentYear = new Date().getFullYear();
        const ridesThisYear = data.filter(
          ride => new Date(ride.date).getFullYear() === currentYear
        );

        console.log("Rides this year:", ridesThisYear);

        setRidesData(ridesThisYear);

        // Calculate percentage
        const completedRides = ridesThisYear.filter(r => r.status === "Completed").length;
        const percentage = ridesThisYear.length === 0 ? 0 : Math.round((completedRides / ridesThisYear.length) * 100);
        setRidesPercentage(percentage);

      } catch (err) {
        console.error(err);
      }
    }

    // ✅ Moved this inside the effect, after functions are declared
    fetchUserRoleAndName();
    fetchUserName();
    fetchRides();

  }, [router]); // ✅ Single correct dependency and closing bracket

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="h-[90%] w-full bg-[#f4f1f0]">
      <h1 className="text-[#103713] text-left font-light text-[40px] ml-[5%]">{welcomeMessage}</h1>
      <h2 className="text-[#103713] text-left font-light text-[25px] ml-[5%]">{"Dashboard"}</h2>
      <div className="flex flex-col gap-5 md:flex-row">
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Rides Completed" showCircle={true} percentage={ridesPercentage} />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <RecentActivity />
    </div>
  );
}
