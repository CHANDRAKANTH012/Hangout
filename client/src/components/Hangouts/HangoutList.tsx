import HangoutCard from "./HangoutCard";
import { hangouts } from "../../utils/mockData";

const HangoutList = () => {
  return (
    <section className="hangout-list">
      {hangouts.map((item) => (
        <HangoutCard key={item.id} data={item} />
      ))}
    </section>
  );
};

export default HangoutList;