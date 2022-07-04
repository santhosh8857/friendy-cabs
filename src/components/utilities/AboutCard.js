import "../../css/utilities/aboutCard.css";

const AboutCard = ({ item }) => {
  return (
    <>
      <div
        className="about-card"
        // style={props.contact ? { textAlign: "center" } : null}
      >
        <h2>
          <i className={`${item.icon} about-title`}></i> {item.title}
        </h2>
        <p>{item.description}</p>
      </div>
    </>
  );
};

export default AboutCard;
