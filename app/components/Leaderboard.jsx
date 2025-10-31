"use client"
import { useEffect, useState } from "react"

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([])

  const colors = [
    "#419902",
    "#419902CC",
    "#41990299",
    "#41990266",
    "#41990233"
  ]

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch('/api/leaderboard')
      const data = await res.json()
      setLeaders(data)
    }
    fetchLeaderboard()
  }, [])

  return (
    <div className="flex flex-col bg-white shadow-md rounded-xl p-6 w-[90%] ml-[5%] mt-5">
      <h3 className="text-[#103713] text-xl font-semibold mb-4">Top Riders This Year</h3>

      {leaders.length === 0 ? (
        <p className="text-gray-500">No ride data available.</p>
      ) : (
        <div className="space-y-3">
          {leaders.map((c, index) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-2 rounded-lg"
              style={{ backgroundColor: colors[index] }}
            >
              <span className="text-white font-medium">
                {index + 1}. {c.firstName} {c.lastName}
              </span>
              <span className="text-white">{c.rideCount} rides</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
