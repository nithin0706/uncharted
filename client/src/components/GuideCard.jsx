function GuideCard({ guide }) {
  return (
    <div>
      <h3>{guide.name}</h3>
      <p>Specialization: {guide.specialization}</p>
      <p>Contact: {guide.contact}</p>
      <p>Experience: {guide.experience} years</p>
      <p>Location: {guide.location}</p>
    </div>
  );
}

export default GuideCard;