'use client'

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Header from "@/components/common/Header";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import MakeCancel from "@/components/Modal/MakeCancel"
import { useRouter } from "next/navigation";
import GuideBlock from "@/components/VoteMakes/GuideBlock";
import LoadingModal from "@/components/Modal/LoadingModal";
import Complete from "@/components/Modal/Complete"
import { useVoteStore } from "@/app/stores/useVoteStore";
import { useCreateVote } from "@/hooks/useVote";
import type { CreateVoteInput } from "@/types/api";
import { useGuideStore } from "@/app/stores/useGuideStore";

const SimilarGuide = () => {

  const { similarGuides } = useGuideStore(); 
  console.log(similarGuides);

  const router = useRouter();
  const [isOpenMakeModal, setIsOpenMakeModal] = useState(false);
  const [LodingModal, setLodingModal] = useState(false);
  const [CompleteModal, setCompleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { title, category, ballots, resetVoteData } = useVoteStore();
  const { createVote, loading, error } = useCreateVote();

  const handleContinue = async () => {
    setErrorMessage("");
    
    if (!title.trim()) {
      alert("투표 제목을 입력해주세요.");
      return;
    }

    const validBallots = ballots.filter(ballot => ballot.trim() !== "");
    if (validBallots.length < 2) {
      alert("최소 2개의 투표 옵션을 입력해주세요.");
      return;
    }

    setLodingModal(true);
    const voteInput: CreateVoteInput = {
      title: title.trim(),
      category: category,
      options: validBallots 
    };

    console.log("투표 데이터:", voteInput);

    try {
      const result = await createVote(voteInput);
      console.log("투표 생성 완료:", result);
      setLodingModal(false);
      setCompleteModal(true);
    } catch (err) {
      console.error("투표 생성 실패:", err);
      setLodingModal(false);
      setErrorMessage(err instanceof Error ? err.message : "투표 생성 중 오류가 발생했습니다.");
    }
  };

  const CompleteVotemake = () => {
    resetVoteData();
    router.push("/");
  }

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <SimilarGuideLayout>
      <Header
        LeftItem={
          <img
            src="/svg/Back.svg"
            width={20}
            height={50}
            onClick={() => router.back()}
          />
        }
        RightItem={
          <div onClick={() => setIsOpenMakeModal(true)}>
            <HeaderItemsBox type="votemake" />
          </div>
        }
        types="Nones"
      />
      <SimilarGuideContainer>
        <ContentWrapper>
          <TextWrapper>
            <SubTitle>유사한 내용의 가이드가 있어요!</SubTitle>
            <MainTitle>아래의 가이드에 원하는 내용이 있다면,<br />상단의 엑스 버튼을 선택해주세요!</MainTitle>
            <Description>가이드 제목을 클릭하면 내용 전부를 확인할 수 있어요.</Description>
          </TextWrapper>

        <GuideListWrapper>
          {similarGuides.length > 0 ? (
            similarGuides.map((guide) => (
              <GuideBlock
                key={guide.id}
                id={guide.id}
                title={guide.title}
                catogory={guide.category}
                count={guide.likeCount}
              />
            ))
          ) : (
            <NoGuideMessage>유사 가이드가 없습니다.</NoGuideMessage>
          )}
        </GuideListWrapper>


          <ContinueButton 
            onClick={handleContinue} 
            disabled={loading || !title.trim() || ballots.filter(b => b.trim()).length < 2}
          >
            <img src="/svg/Plus.svg" width={24} height={24} /> 
            {loading ? "투표 생성 중..." : "계속 진행하기"}
          </ContinueButton>
        </ContentWrapper>
      </SimilarGuideContainer>

      {isOpenMakeModal && (
        <MakeCancel setIsOpen={setIsOpenMakeModal} isOpen={isOpenMakeModal} />
      )}

      {LodingModal && (
        <LoadingModal 
          title="투표를 제작하고 있어요." 
          des="유픽에서는 재학생들로부터 더 정확한 정보를 제공받을 수 있어요." 
        />
      )}

      {CompleteModal && (
        <Complete 
          text1="투표 제작을" 
          text2="했어요!" 
          text3="완료" 
          subtext="투표 제작 이후 투표 내용은 변경될 수 없어요." 
          img="/svg/Completevote.svg" 
          onfunciton={CompleteVotemake} 
        />
      )}

      {errorMessage && (
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      )}
    </SimilarGuideLayout>
  );
}


export default SimilarGuide;

const SimilarGuideLayout = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: ${color.white};
  min-height: 100vh;
  margin-bottom : 30px;
`;

const SimilarGuideContainer = styled.div`
  width: 100%;
  margin-top : 100px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  color : #FF9F1C;
  margin: 0;
`;

const MainTitle = styled.h1`
  color : #011627;
  font-weight: 600;
  font-size : 23px;
`;

const NoGuideMessage = styled.p`
  font-size: 16px;
  color: #9CA3AF;
  text-align: center;
  margin: 20px 0;
`;



const Description = styled.p`
  ${font.H3};
  color: #9CA3AF;
  margin: 0;
`;

const GuideListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 30px;
  border: none;
  background-color: ${color.primary};
  color: ${color.white};
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${color.primary};
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #ccc;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fee;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  font-size: 14px;
  z-index: 1000;
  max-width: 90%;
  text-align: center;
`;