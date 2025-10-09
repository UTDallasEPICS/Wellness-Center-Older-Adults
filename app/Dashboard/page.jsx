"use client";
import { useEffect, useState } from "react";
import TextContainer from "/app/components/TextContainer.jsx";
import RecentActivity from "/app/components/RecentActivity"; 
import { useRouter } from "next/navigation";

export default function Page() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
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
    fetchUserRoleAndName();
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="h-[90%] w-full bg-[#f4f1f0]">
      <h1 className="text-[#103713] text-left font-light text-[40px] ml-[5%]">{welcomeMessage}</h1>
      <div className="flex flex-col gap-5 md:flex-row">
        <TextContainer text="Recently Completed Rides" number="3" />
        <TextContainer text="This Week's Volunteer Hours" number="5" />
        <TextContainer text="Total Rides for the Week" number="17" />
      </div>
      <RecentActivity />
    </div>
  );
}