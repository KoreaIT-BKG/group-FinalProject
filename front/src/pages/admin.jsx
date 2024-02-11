import React, { useEffect, useState } from "react";
import Header from "../components/Header/header";
import Footer from "../components/Home/Footer";
import "../css/Admin.css"; // CSS 파일 불러오기
import axios from "axios";
import { SystemUpdateOutlined } from "@mui/icons-material";
const AdminPage = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [editedMember, setEditedMember] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열림/닫힘 상태 추가
  const [sites, setSite] = useState([]);
  const [newSite, setNewSite] = useState({
    siteName: "",
    category: "",
    sitetalk: "",
    address: "",
    file: null, // 파일을 저장하는 상태 추가
  });
  const handleButtonClick = (button) => {
    setSelectedButton(button);
    if (button === "회원") {
      fetchMembers(); // 수정: 함수명을 대문자로 변경
    } else if (button === "그룹") {
      fetchGroup();
    } else if (button === "사이트") {
      fetchSites();
    }
  };

  const handleDelete = async (seq) => {
    try {
      const response = await axios.post("/admin/delete", seq);
      alert("삭제완료");
      fetchMembers(); 
    } catch (error) {
      console.log("error" + error);
    }
  };
  const handleGroupDelete = async (seq) => {
    try {
      const response = await axios.post("/admin/groupdelete", seq);
      alert("삭제완료");
      fetchGroup(); 
    } catch (error) {
      console.log("error" + error);
    }
  };
  const handleSiteDelete = async (seq) => {
    try {
      const response = await axios.post("/admin/sitedelete", seq);
      alert("삭제완료");
      fetchSites(); 
    } catch (error) {
      console.log("error" + error);
    }
  };

  const fetchGroup = async () => {
    try {
      const response = await axios.post("/admin/groupSearch");
      if (response.data && Array.isArray(response.data)) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error("Error fetching Group:", error);
    }
  };
  const fetchMembers = async () => {
    try {
      const response = await axios.post("/admin/memberSearch");
      if (response.data && Array.isArray(response.data)) {
        console.log(response.data)
        setMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  const fetchSites = async () => {
    try {
      const response = await axios.post("/admin/siteSearch");
      if (response.data && Array.isArray(response.data)) {
        setSite(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  };
  const handleRoleChange = (seq, event) => {
    const newRole = event.target.value;
    setEditedMember({ seq, role: newRole, evp: editedMember?.evp || "" });
  };

  const handlePointChange = (seq, event) => {
    const newPoint = event.target.value;
    setEditedMember({ seq, role: editedMember?.role || "", evp: newPoint });
  };

  const handleEdit = (member) => {
    setEditedMember(member);
  };

  const handleSaveEdit = async () => {
    if (!editedMember) return;

    try {
      const { seq, role, evp } = editedMember;
      await axios.post("/admin/updateRole", { seq, role });
      await axios.post("/admin/updatePoint", { seq, evp });
      alert("수정 완료");
      fetchMembers();
      setEditedMember(null);
    } catch (error) {
      console.log("Error saving edit:", error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewSite({
      siteName: "",
      category: "",
      sitetalk: "",
      address: "",
      file: null,
    });
    setModalOpen(false);
  };

  const handleSiteChange = (field, value) => {
    setNewSite((prevSite) => ({
      ...prevSite,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setNewSite((prevSite) => ({
      ...prevSite,
      file,
    }));
  };
  const insertSite = async () => {
    try {
      // 여기에서 새로운 사이트를 추가하는 로직을 작성합니다.
      const formData = new FormData();
      formData.append("siteName", newSite.siteName);
      formData.append("category", newSite.category);
      formData.append("sitetalk", newSite.sitetalk);
      formData.append("address", newSite.address);
      formData.append("file", newSite.file);

      await axios.post("/admin/insertSite", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("사이트 추가 완료");
      fetchSites();
      closeModal();
    } catch (error) {
      console.error("Error inserting site:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchGroup();
    fetchSites();
  }, []);

  return (
    <>
      {/* header */}
      <Header />
      {/* End header */}
      {/* Main */}
      <div className="adminBody">
        <div className="left">
          <button
            className={`left-button ${
              selectedButton === "회원" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("회원")}
          >
            회원
          </button>
          <button
            className={`left-button ${
              selectedButton === "그룹" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("그룹")}
          >
            그룹
          </button>
          <button
            className={`left-button ${
              selectedButton === "사이트" ? "active" : ""
            }`}
            onClick={() => handleButtonClick("사이트")}
          >
            사이트
          </button>
        </div>
        <div className={`right ${selectedButton ? "right-active" : ""}`}>
          {/* right의 내용은 selectedButton에 따라 동적으로 변경 */}
          {selectedButton === "회원" && (
            <table className="right-table">
              <tr className="right-table-tr">
                <td className="right-table-td">아이디</td>
                <td className="right-table-td">이름</td>
                <td className="right-table-td">은행</td>
                <td className="right-table-td">계좌번호</td>
                <td className="right-table-td">점수</td>
                <td className="right-table-td">권한</td>
                <td className="right-table-td">삭제</td>
              </tr>
              {members.map((member) => (
                <tr className="right-table-tr" key={member.seq}>
                  <td className="right-table-td">{member.id}</td>
                  <td className="right-table-td">{member.name}</td>
                  <td className="right-table-td">{member.bank}</td>
                  <td className="right-table-td">{member.banknum}</td>
                  <td className="right-table-td">
                    {editedMember?.seq === member.seq ? (
                      <input
                        className="right-table-input"
                        type="text"
                        value={editedMember.evp}
                        onChange={(e) => handlePointChange(member.seq, e)}
                      />
                    ) : (
                      member.evp
                    )}
                  </td>
                  <td>
                    {editedMember?.seq === member.seq ? (
                      <select
                        className="right-talbe-select"
                        value={editedMember.role}
                        onChange={(e) => handleRoleChange(member.seq, e)}
                      >
                        <option
                          className="right-table-option"
                          value="ROLE_ADMIN"
                        >
                          ROLE_ADMIN
                        </option>
                        <option
                          className="right-table-option"
                          value="ROLE_USER"
                        >
                          ROLE_USER
                        </option>
                        <option
                          className="right-table-option"
                          value="ROLE_MUSER"
                        >
                          ROLE_MUSER
                        </option>
                      </select>
                    ) : (
                      member.role
                    )}
                  </td>
                  <td>
                    {editedMember?.seq === member.seq ? (
                      <button
                        className="membereditbtn"
                        onClick={() => handleSaveEdit()}
                      >
                        저장
                      </button>
                    ) : (
                      <button
                        className="membereditbtn"
                        onClick={() => handleEdit(member)}
                      >
                        수정
                      </button>
                    )}
                
                    <button
                      className="membereditbtn"
                      onClick={() => handleDelete(member.seq)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          )}
          {selectedButton === "그룹" && (
            <table className="right-table">
              <tr className="right-table-tr">
                <td className="right-table-td">개설 아이디</td>
                <td className="right-table-td">그룹주제</td>
                <td className="right-table-td">카테고리</td>
                <td className="right-table-td">모임시작</td>
                <td className="right-table-td">모임끝</td>
                <td className="right-table-td">모임종류</td>
                <td className="right-table-td">현재인원</td>
                <td className="right-table-td">모임인원</td>
                <td className="right-table-td">모이기시작날짜</td>
                <td className="right-table-td">모이기마지막말짜</td>
                <td className="right-table-td">삭제</td>
              </tr>
              {groups.map((groups) => (
                <tr className="right-table-tr" key={groups.seq}>
                  <td className="right-table-td">{groups.userId}</td>
                  <td className="right-table-td">{groups.meetingTitle}</td>
                  <td className="right-table-td">{groups.category}</td>
                  <td className="right-table-td">{groups.meetingDateStart}</td>
                  <td className="right-table-td">{groups.meetingDateEnd}</td>
                  <td className="right-table-td">{groups.meetingType}</td>
                  <td className="right-table-td">{groups.joinPeople}</td>
                  <td className="right-table-td">{groups.peopleNum}</td>
                  <td className="right-table-td">{groups.recruitments}</td>
                  <td className="right-table-td">{groups.recruitmentd}</td>
                  <td>
                    <button
                      className="membereditbtn"
                      onClick={() => handleGroupDelete(groups.seq)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          )}
          {selectedButton === "사이트" && (
            <table className="right-table">
              <tr className="right-table-tr">
                <td className="right-table-td">사이트 이름</td>
                <td className="right-table-td">사이트 설명</td>
                <td className="right-table-td">사이트 카테고리</td>
                <td className="right-table-td">주소</td>
                <td className="right-table-td">
                  <button className="siteInsertbtn" onClick={openModal}>
                    추가
                  </button>
                </td>
              </tr>
              {sites.map((site) => (
                <tr className="right-table-tr" key={site.seq}>
                  <td className="right-table-td">{site.siteName}</td>
                  <td className="right-table-td">{site.sitetalk}</td>
                  <td className="right-table-td">{site.category}</td>
                  <td className="right-table-td">{site.address}</td>

                  <td>
                    <button
                      className="membereditbtn"
                      onClick={() => handleSiteDelete(site.seq)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          )}
        </div>
      </div>
      {/* Footer */}
      {/* 모달 창 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <label>사이트 이름</label>
            <input
              type="text"
              value={newSite.siteName}
              onChange={(e) => handleSiteChange("siteName", e.target.value)}
            />
            <label>사이트 설명</label>
            <input
              type="text"
              value={newSite.sitetalk}
              onChange={(e) => handleSiteChange("sitetalk", e.target.value)}
            />
            <label>사이트 주소</label>
            <input
              type="text"
              value={newSite.address}
              onChange={(e) => handleSiteChange("address", e.target.value)}
            />
            <label>카테고리</label>
            <select
              value={newSite.category}
              onChange={(e) => handleSiteChange("category", e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="sport">스포츠</option>
              <option value="IT">IT</option>
              <option value="language">어학</option>
              <option value="life">라이프</option>
              <option value="tour">여행</option>
              <option value="work">취업</option>
            </select>
            <label>파일:</label>
            <input type="file" onChange={handleFileChange} />
            <button onClick={insertSite}>추가</button>
          </div>
        </div>
      )}
      <Footer />
      {/* End footer */}
    </>
  );
};

export default AdminPage;
