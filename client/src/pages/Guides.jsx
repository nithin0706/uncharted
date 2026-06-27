import GuideCard from "../components/GuideCard";
function Guides() {
  const guides = [
  {
    _id: "1",
    name: "John Mathew",
    specialization: "Kerala Backwaters",
    contact: "+91 9876543210",
    experience: 10,
    location: "Alappuzha",
    image: "guide1.jpg",
  },
  {
    _id: "2",
    name: "Priya Menon",
    specialization: "Hill Station Tours",
    contact: "+91 9123456789",
    experience: 7,
    location: "Munnar",
    image: "guide2.jpg",
  },
];

  return (
    <div>
      <h1>Guide Listing Page</h1>

      {guides.map((guide) => (
  <GuideCard key={guide._id} guide={guide} />
))}
    </div>
  );
}

export default Guides;