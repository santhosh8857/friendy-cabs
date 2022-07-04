import "../../css/utilities/serviceCard.css";

const ServiceCard = ({ icon, title, hasBackground }) => {
  return (
    <>
      <div className="service-card">
        <div
          className={
            hasBackground ? "icon-container airport" : "icon-container"
          }
        >
          <i className={`${icon} icon`} id={hasBackground ? "icon" : ""}></i>
        </div>
        <h3>{title}</h3>
      </div>
    </>
  );
};

export default ServiceCard;
