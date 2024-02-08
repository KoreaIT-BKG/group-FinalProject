import "../../css/GroupList.css";
import SportGroup from "../../JS/CategoryList/sport";
import TourGroup from "../../JS/CategoryList/tour";
import LifeGroup from "../../JS/CategoryList/life";
import LanguageGroup from "../../JS/CategoryList/language";
import ItGroup from "../../JS/CategoryList/It";
import WorkGroup from "../../JS/CategoryList/work";


const GroupList = ({ print,searchValue}) => {
if ((Array.isArray(print) && print.some((c) => c.category === "sport")) || print === "sport") {
    return <SportGroup print={print} searchValue={searchValue}/>;
  } else if ((Array.isArray(print) && print.some((c) => c.category === "life")) || print === "life") {
    return <LifeGroup print={print} searchValue={searchValue}/>;
  } else if ((Array.isArray(print) && print.some((c) => c.category === "language")) || print === "language") {
    return <LanguageGroup print={print} searchValue={searchValue} />;
  } else if ((Array.isArray(print) && print.some((c) => c.category === "IT")) || print === "IT") {
    return <ItGroup print={print} searchValue={searchValue}  />;
  } else if ((Array.isArray(print) && print.some((c) => c.category === "tour")) || print === "tour") {
    return <TourGroup print={print} searchValue={searchValue}/>;
  } else if ((Array.isArray(print) && print.some((c) => c.category === "work")) || print === "work") {
    return <WorkGroup print={print} searchValue={searchValue}/>;
  }

  return null;
};
export default GroupList;
