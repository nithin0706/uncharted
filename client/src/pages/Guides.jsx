import { useState, useEffect } from "react";
import GuideCard from "../components/GuideCard";
import { getGuides } from "../services/guideService";

function Guides() {
  const [guides, setGuides] = useState([]);
  const fetchGuides = async () => {
  try {
    const response = await getGuides();

    console.log(response.data);

    setGuides(response.data);
  } catch (error) {
    console.error(error);
  }
};
  useEffect(() => {
  fetchGuides();
}, []);

  return (
    <div>
      <h1>Guide Listing Page</h1>

      {guides.length === 0 ? (
  <p>No guides available.</p>
) : (
  guides.map((guide) => (
    <GuideCard
      key={guide._id}
      guide={guide}
    />
  ))
)}
    </div>
  );
}

export default Guides;