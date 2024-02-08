import axios from "axios";
import { useEffect, useState } from "react";

const Site = ({ print }) => {
  const [sites, setSites] = useState([]); // 상태 변수 이름을 복수형으로 변경
  const [prints, setPrints] = useState("");

  const fetchSites = async () => {
    try {
      const response = await axios.post("/groupjoin/siteCSearch", prints);
      if (response.data && Array.isArray(response.data)) {
        setSites(response.data); // setSites로 상태 업데이트
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  useEffect(() => {
    if (Array.isArray(print)) {   
      const category = print.find((item) => typeof item === "object" && item.category);
      if (category) {
        setPrints(category.category);
      } else {
        setPrints("");
      }
    } else {
      setPrints(print);
    }
  }, [print]);

  useEffect(() => {
    fetchSites();
  }, [prints]);
    

  return (
    <>
      {sites.map((site) => (
        <div className="group-item" key={site.seq}>
          <a
            href={`http://${site.address}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              className="group-item-img"
              src={`/Image/site/${site.filePath}`}
              alt="Card"
            />
            <h4 className="group-item-h4">{site.siteName}</h4>
            <h4 className="group-item-h4">{site.sitetalk}</h4>
          </a>
        </div>
      ))}
    </>
  );
};
export default Site; // 컴포넌트 이름을 대문자로 변경
