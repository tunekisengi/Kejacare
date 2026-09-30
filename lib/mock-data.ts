export type Service = {
  id: string;
  name: string;
  short: string;
  description: string;
  icon: string;
  price: string;
};

export type FundiProfile = {
  id: string;
  name: string;
  rating: number;
  price: number;
  distance: string;
  verified: boolean;
  gender: "Female" | "Male";
  skills: string[];
  location: { lat: number; lng: number };
  avatar: string;
  online: boolean;
};

export const services: Service[] = [
  { id: "cleaning", name: "Mama Fua", short: "Cleaning", description: "Home cleaning and laundry", icon: "🧼", price: "KES 800/day" },
  { id: "plumbing", name: "Plumber", short: "Plumbing", description: "Leak fixes & pipe repair", icon: "🔧", price: "KES 1,200/day" },
  { id: "electrical", name: "Electrician", short: "Electrical", description: "Wiring, sockets & repairs", icon: "💡", price: "KES 1,400/day" },
  { id: "gas", name: "Gas Technician", short: "Gas", description: "Cylinder and gas fittings", icon: "🔥", price: "KES 1,500/day" },
  { id: "moving", name: "Mover", short: "Moving", description: "Packing and relocation", icon: "📦", price: "KES 1,800/day" },
  { id: "repair", name: "Fundi", short: "Repair", description: "General handyman work", icon: "🛠️", price: "KES 1,000/day" },
];

export const fundis: FundiProfile[] = [
  { id: "f1", name: "Amina Wanjiku", rating: 4.9, price: 800, distance: "1.2km away", verified: true, gender: "Female", skills: ["cleaning"], location: { lat: -1.3733, lng: 37.9709 }, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f2", name: "James Kilonzo", rating: 4.8, price: 1200, distance: "2.1km away", verified: true, gender: "Male", skills: ["plumbing"], location: { lat: -1.3712, lng: 37.9822 }, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f3", name: "Salma Njeri", rating: 4.7, price: 900, distance: "2.5km away", verified: true, gender: "Female", skills: ["cleaning", "repair"], location: { lat: -1.3675, lng: 37.9638 }, avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80", online: false },
  { id: "f4", name: "Daniel Mutua", rating: 4.6, price: 1300, distance: "1.8km away", verified: false, gender: "Male", skills: ["electrical"], location: { lat: -1.3796, lng: 37.9651 }, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f5", name: "Miriam Kaluki", rating: 5.0, price: 950, distance: "0.9km away", verified: true, gender: "Female", skills: ["cleaning", "moving"], location: { lat: -1.3759, lng: 37.9685 }, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f6", name: "Patrick Kiio", rating: 4.9, price: 1500, distance: "3.1km away", verified: true, gender: "Male", skills: ["gas"], location: { lat: -1.3635, lng: 37.9778 }, avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f7", name: "Rose Muthoni", rating: 4.7, price: 1100, distance: "2.9km away", verified: true, gender: "Female", skills: ["repair", "electrical"], location: { lat: -1.3818, lng: 37.9789 }, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f8", name: "Simon Nzioka", rating: 4.5, price: 1400, distance: "1.6km away", verified: false, gender: "Male", skills: ["plumbing", "gas"], location: { lat: -1.3703, lng: 37.9558 }, avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80", online: false },
  { id: "f9", name: "Faith Kivuva", rating: 4.8, price: 1250, distance: "1.1km away", verified: true, gender: "Female", skills: ["moving"], location: { lat: -1.3748, lng: 37.9740 }, avatar: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=200&q=80", online: true },
  { id: "f10", name: "Martin Musyoki", rating: 4.9, price: 1350, distance: "2.2km away", verified: true, gender: "Male", skills: ["repair", "electrical"], location: { lat: -1.3694, lng: 37.9616 }, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", online: true },
];

export const adminUsers = [
  { name: "Amina Wanjiku", role: "Fundi", status: "Verified", rating: 4.9 },
  { name: "Grace Mumo", role: "Client", status: "Active", rating: 4.8 },
  { name: "Daniel Mutua", role: "Fundi", status: "Pending", rating: 4.6 },
  { name: "Ezekiel Kivuva", role: "Client", status: "Active", rating: 5.0 },
];

export const jobRecords = [
  { id: "J-2118", client: "Grace Mumo", fundi: "Amina Wanjiku", service: "Cleaning", status: "Completed", commission: "KES 1,600" },
  { id: "J-2119", client: "John Kamau", fundi: "Patrick Kiio", service: "Gas", status: "In Progress", commission: "KES 2,100" },
  { id: "J-2120", client: "Lucy Nduku", fundi: "James Kilonzo", service: "Plumbing", status: "Pending", commission: "KES 1,200" },
  { id: "J-2121", client: "Chris Kioko", fundi: "Martin Musyoki", service: "Repair", status: "Verified", commission: "KES 1,800" },
];
