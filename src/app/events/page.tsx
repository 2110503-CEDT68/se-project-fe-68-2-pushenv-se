import EventSearch from "@/components/shared/EventSearch";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  banner: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
    total: number;
    page: number;
    limit: number;
  };
}

const MOCK_EVENTS: Event[] = [
  { id: "1", name: "Green Tech Summit 2026", description: "Exploring the future of renewable energy and sustainable technology.", location: "Bangkok Convention Center", startDate: "2026-04-30T09:00:00Z", endDate: "2026-04-30T17:00:00Z", banner: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=400" },
  { id: "2", name: "Ocean Conservation Workshop", description: "Hands-on workshop on protecting marine life and coastal ecosystems.", location: "Phuket Marine Science Center", startDate: "2026-05-05T10:00:00Z", endDate: "2026-05-05T15:00:00Z", banner: "https://images.unsplash.com/photo-1544551763-47a18411c976?q=80&w=400" },
  { id: "3", name: "Urban Gardening Class", description: "Learn how to grow your own food in limited city spaces.", location: "Naresuan University", startDate: "2026-04-20T14:00:00Z", endDate: "2026-04-20T16:00:00Z", banner: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400" },
  { id: "4", name: "Sustainable Fashion Fair", description: "Showcase of eco-friendly apparel and ethical manufacturing.", location: "CentralWorld, Bangkok", startDate: "2026-06-12T10:00:00Z", endDate: "2026-06-14T20:00:00Z", banner: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400" },
  { id: "5", name: "Wildlife Photography Walk", description: "Capture the beauty of local fauna with expert guidance.", location: "Khao Yai National Park", startDate: "2026-05-15T06:00:00Z", endDate: "2026-05-15T10:00:00Z", banner: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=400" },
  { id: "6", name: "Zero Waste Living Seminar", description: "Practical tips for reducing your environmental footprint.", location: "Chiang Mai University", startDate: "2026-05-20T13:00:00Z", endDate: "2026-05-20T15:00:00Z", banner: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=400" },
  { id: "7", name: "Solar Energy Expo", description: "The latest in solar panel technology and home battery systems.", location: "BITEC Bangna", startDate: "2026-07-01T10:00:00Z", endDate: "2026-07-03T18:00:00Z", banner: "https://images.unsplash.com/photo-1509391366360-feaf94447701?q=80&w=400" },
  { id: "8", name: "Reforestation Project: Nan", description: "Join us in planting 10,000 trees to restore the forest floor.", location: "Nan Province", startDate: "2026-06-05T08:00:00Z", endDate: "2026-06-05T16:00:00Z", banner: "https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=400" },
  { id: "9", name: "Climate Change Forum", description: "International speakers discussing the policy and action needed now.", location: "United Nations Building, BKK", startDate: "2026-08-10T09:00:00Z", endDate: "2026-08-12T17:00:00Z", banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400" },
  { id: "10", name: "Electric Vehicle Meetup", description: "Network with EV owners and learn about charging infrastructure.", location: "Siam Square One", startDate: "2026-05-25T17:00:00Z", endDate: "2026-05-25T20:00:00Z", banner: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=400" },
  { id: "11", name: "Composting for Beginners", description: "Turn your kitchen waste into black gold with our help.", location: "Naresuan University", startDate: "2026-04-25T10:00:00Z", endDate: "2026-04-25T12:00:00Z", banner: "https://images.unsplash.com/photo-1589151525049-74e5083cfc0e?q=80&w=400" },
  { id: "12", name: "Clean Energy Career Fair", description: "Meet representatives from top companies in the green sector.", location: "Kasetsart University", startDate: "2026-06-20T09:00:00Z", endDate: "2026-06-20T16:00:00Z", banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" },
  { id: "13", name: "Air Quality Hackathon", description: "Coding for better air quality monitoring and solution tracking.", location: "True Digital Park", startDate: "2026-07-15T09:00:00Z", endDate: "2026-07-17T18:00:00Z", banner: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400" },
  { id: "14", name: "Sustainable Tourism Summit", description: "Redefining travel for a more responsible future in Thailand.", location: "Krabi Cultural Center", startDate: "2026-09-01T10:00:00Z", endDate: "2026-09-03T17:00:00Z", banner: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=400" },
  { id: "15", name: "Permaculture Design Course", description: "A deep dive into living in harmony with nature's systems.", location: "Udon Thani Eco-Village", startDate: "2026-10-10T09:00:00Z", endDate: "2026-10-24T17:00:00Z", banner: "https://images.unsplash.com/photo-1592398687702-8a9d023f03b5?q=80&w=400" },
  { id: "16", name: "Plastic-Free Thailand Drive", description: "Nationwide movement to ban single-use plastics from markets.", location: "Various Locations", startDate: "2026-11-15T08:00:00Z", endDate: "2026-11-15T18:00:00Z", banner: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?q=80&w=400" },
  { id: "17", name: "River Cleanup: Chao Phraya", description: "Collecting floating debris to ensure a cleaner river flow.", location: "Asiatique Pier", startDate: "2026-05-30T07:00:00Z", endDate: "2026-05-30T11:00:00Z", banner: "https://images.unsplash.com/photo-1618477462146-050d2767eac4?q=80&w=400" },
  { id: "18", name: "Green Architecture Awards", description: "Celebrating the most innovative and energy-efficient designs.", location: "Museum of Contemporary Art, BKK", startDate: "2026-12-05T18:00:00Z", endDate: "2026-12-05T22:00:00Z", banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400" },
  { id: "19", name: "Eco-Friendly DIY Workshop", description: "Make your own natural soap and household cleaners.", location: "Thammasat University", startDate: "2026-04-28T13:00:00Z", endDate: "2026-04-28T16:00:00Z", banner: "https://images.unsplash.com/photo-1605264964528-06403738d6dc?q=80&w=400" },
  { id: "20", name: "Sustainability Film Festival", description: "Documentaries highlighting environmental activism globally.", location: "Alliance Française de Bangkok", startDate: "2026-11-20T17:00:00Z", endDate: "2026-11-22T21:00:00Z", banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=400" }
];

async function getEvents(search?: string, page: number = 1, limit: number = 10) {
  try {
    const url = new URL("http://localhost:4000/api/v1/events");
    if (search) url.searchParams.append("search", search);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch events: ${res.status}`);
    }

    const json: ApiResponse = await res.json();
    if (json.success && json.data.events.length > 0) {
      return json.data;
    }
  } catch (error) {
    console.warn("Backend API unreachable or empty, using mock data for style preview.");
  }
  
  // Local Mock Logic
  const filteredMock = search 
    ? MOCK_EVENTS.filter(e => 
        e.name.toLowerCase().includes(search.toLowerCase()) || 
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
      )
    : MOCK_EVENTS;
  
  const start = (page - 1) * limit;
  const slicedMock = filteredMock.slice(start, start + limit);
    
  return { events: slicedMock, total: filteredMock.length };
}

export default async function EventExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  const limit = 10;
  
  const { events, total } = await getEvents(search, currentPage, limit);

  return (
    <div className="w-full bg-white flex flex-col justify-start items-center overflow-hidden font-sans">
      {/* Banner Section */}
      <div className="self-stretch h-96 px-28 py-10 flex flex-col justify-center items-center gap-2.5 overflow-hidden bg-slate-900 relative">
        <img 
          src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Banner"
        />
        <div className="z-10 flex flex-col justify-center items-center gap-6">
          <div className="w-[540px] flex flex-col justify-center items-center gap-4">
            <div className="self-stretch text-center font-sans text-white text-5xl font-semibold leading-[48px]">Events</div>
            <div className="self-stretch text-center font-sans text-white text-sm font-normal uppercase leading-5 tracking-wider opacity-90">
              WOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.
            </div>
          </div>
          
          <Suspense fallback={<div className="w-[600px] h-10 bg-white/10 rounded-lg animate-pulse" />}>
            <EventSearch />
          </Suspense>
        </div>
      </div>

      {/* Events List Section */}
      <div className="self-stretch px-28 py-10 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col justify-start items-center gap-8">
          <div className="self-stretch text-center">
            {search ? (
              <>
                <span className="text-black text-lg font-medium font-sans">{total}</span>
                <span className="text-black text-lg font-normal font-sans"> Events match your preferences</span>
              </>
            ) : (
              <span className="text-black text-lg font-semibold font-sans uppercase tracking-tight">All Events</span>
            )}
          </div>

          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            {events.length > 0 ? (
              <>
                {events.map((event, index) => (
                  <div key={event.id || index} className="self-stretch px-14 py-8 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-slate-200 inline-flex justify-start items-center gap-12 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex justify-start items-center gap-12 w-full">
                      <img 
                        className="w-48 h-48 rounded-lg object-contain" 
                        src={event.banner || "https://placehold.co/200x200?text=Event"} 
                        alt={event.name} 
                      />
                      <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
                        <div className="self-stretch text-black text-3xl font-semibold font-sans leading-8">{event.name}</div>
                        <div className="self-stretch text-black text-base font-normal font-sans leading-6">{event.description}</div>
                        <div className="self-stretch inline-flex flex-col justify-start items-start gap-1">
                          <div className="text-slate-500 text-lg font-normal font-sans">Location</div>
                          <div className="text-black text-lg font-medium font-sans">{event.location}</div>
                          <div className="text-slate-500 text-lg font-normal font-sans mt-2">Time & Date</div>
                          <div className="text-black text-lg font-medium font-sans">
                            {new Date(event.startDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="w-32 flex flex-col justify-center items-center">
                        <Link href={`/events/${event.id}`} className="px-6 py-2.5 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                          <div className="text-center text-slate-900 text-sm font-medium font-sans">See details</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                <div className="w-full flex justify-center mt-6">
                  <Pagination total={total} limit={limit} currentPage={currentPage} />
                </div>
              </>
            ) : (
              <div className="w-full py-20 text-center text-slate-400 italic">
                {search ? `No events found matching "${search}".` : "No events available at the moment."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}