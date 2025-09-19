'use client'

import Header from "@/components/common/Header";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import GuideComponent from "@/components/Main/GuideComponent";
import NavigationBar from "@/components/common/NavigationBar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import VoteSort from "@/components/Modal/VoteSort";

const Guide = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortStandard, setSortStandard] = useState("가이드 제작일 기준");
  const router = useRouter();

  const handleOptionClick = () => setIsModalOpen(true);

  return (
    <GuidePageLayout>
      <Header
        LeftItem={<img src="/svg/Logo.svg" width={50} height={50} alt="Logo" />}
        RightItem={
          <div style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" }}>
            <img src="/svg/Bell.svg" alt="알림" width={24} height={24} />
            <img
              src="/svg/Search.svg"
              alt="검색"
              width={24}
              height={24}
              onClick={() => router.push("/guide/search")}
              style={{ cursor: "pointer" }}
            />
            <img src="/svg/User.svg" alt="사용자" width={24} height={24} />
          </div>
        }
        types="default"
        onOptionClick={handleOptionClick}
        onSelect={(label: string) => setSelectedCategory(label)}
      />

      <MainLayout>
        <GuideComponent gap="16px" category={selectedCategory} sortstandard={sortStandard} />
      </MainLayout>

      <NavigationBar />

      <VoteSort
        title="가이드 정렬하기"
        options={["가이드 제작일 기준", "많이 저장한 가이드 기준"]}
        sortstandard={sortStandard}
        setsortstandard={setSortStandard}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </GuidePageLayout>
  );
};

export default Guide;

const GuidePageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-height: 100vh;
  background-color: ${color.white};
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-height: 100vh;
  margin-top: 15vh;
  padding-bottom: 80px;
  background-color: ${color.white};
`;
