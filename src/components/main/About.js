import "../../css/main/about.css";
import AboutCard from "../utilities/AboutCard";
import ServiceCard from "../utilities/ServiceCard";

const About = () => {
  const cardDetails = [
    {
      title: "Seamless Experience",
      icon: "fa-solid fa-face-grin",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat odio adipisci iure rem quas, animi dignissimos laudantium cupiditate expedita at.",
    },
    {
      title: " Safer",
      icon: "fa-solid fa-shield-heart",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum laborum fugiat nisi deserunt? Ea quidem id repellat commodi tenetur nemo!",
    },
    {
      title: "Fast & Secure",
      icon: "fa-solid fa-stopwatch",
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam sunt autem aut ut! Iure quas mollitia obcaecati nihil, repudiandae id.",
    },
    {
      title: "Best Prices",
      icon: "fa-solid fa-tag",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, eveniet architecto veritatis saepe rem obcaecati labore illum praesentium sed corrupti.",
    },
  ];
  return (
    <div id="#about">
      <div className="about-heading">
        <p>TRUSTED CAB SERVICES IN ALL WORLD</p>
        <hr></hr>
        <h1>
          About<span> US</span>
        </h1>
        <div className="about-card-section">
          {cardDetails.map((item, key) => {
            return <AboutCard key={key} item={item} />;
          })}
        </div>
        <h1>
          <span>Our</span> Services
        </h1>

        <p>Service is our attitude, attitude is everything!</p>
        <hr></hr>

        <div className="services-container">
          <ServiceCard
            icon="fa-solid fa-square-phone"
            title="CALL ON TAXI"
            hasBackground={false}
          />
          <ServiceCard
            icon="fa-solid fa-plane-departure"
            title="AIRPORT TRANSFER"
            hasBackground={true}
          />
          <ServiceCard
            icon="fa-solid fa-taxi"
            title="ACCESSIBLE TAXI"
            hasBackground={false}
          />
          <ServiceCard
            icon="fa-solid fa-circle-user"
            title="SKILLED DRIVER"
            hasBackground={false}
          />
        </div>
      </div>
    </div>
  );
};

export default About;
