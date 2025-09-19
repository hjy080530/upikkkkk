'use client'

import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import color from "@/packages/design-system/src/color";
import MemberChose from "@/components/Modal/MemberChose";
import Header from "@/components/common/Header";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import TwoOptionsModal from "@/components/Modal/TwoOptionsModal";
import AILoadingModal from "@/components/Modal/LoadingModal";
import CompleteVote from "@/components/Modal/Complete";
import { useAiOptionCreate } from "@/hooks/useVote";
import { useVoteStore } from "@/app/stores/useVoteStore";

export default function OptionsPage() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWarnOpen, setWarnOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const { title, ballots, setBallots } = useVoteStore();

  // AI 옵션 생성 훅 (ballots 길이와 title을 전달)
  const { options, loading, refetch } = useAiOptionCreate(ballots.length, title);

  useEffect(() => {
    setIsClient(true);
    const savedCount = sessionStorage.getItem('aiUsageCount');
    if (savedCount) {
      setAiUsageCount(parseInt(savedCount));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem('aiUsageCount', aiUsageCount.toString());
    }
  }, [aiUsageCount, isClient]);

  const CompleteAi = () => {
    router.back();
  };

  const MaxAi = () => {
    setWarnOpen(false);
  };

  const handleUseAI = async () => {
    if (aiUsageCount >= 3) {
      setWarnOpen(true);
    } else {
      setIsAiOpen(true);

      try {
 
        const result = await refetch({ count: ballots.length, title });

        const aiOptions = result.data?.optionGenerator?.generateOptions?.options || [];
        if (aiOptions.length > 0) {
          setBallots(aiOptions);
        }

        setTimeout(() => {
          setIsAiOpen(false);
          setIsCompleteOpen(true);
          setAiUsageCount(prev => prev + 1);
        }, 3000);
      } catch (err) {
        console.error("AI 옵션 생성 실패:", err);
        setIsAiOpen(false);
      }
    }
  };

  return (
    <OptionsLayout>
      <Header
        LeftItem={
          <img
            src="/svg/Back.svg"
            width={20}
            height={50}
            onClick={() => { router.back() }}
          />
        }
        CenterItem={<HeaderItemsBox type={'votesetting'} />}
        types="votemake"
      />

      <OptionsSection>

        <OptionItemWrapper onClick={() => setIsOpenModal(true)}>
          <OptionContent>
            <OptionHeaderRow>
              <OptionTitleText>선지 작성하기</OptionTitleText>
            </OptionHeaderRow>
            <OptionActionRow>
              <OptionSubtitleText>AI 자동 선지 추천 기능 사용하기</OptionSubtitleText>
              <img src="/svg/Nexts.svg" alt="next" width={20} height={20} />
            </OptionActionRow>
          </OptionContent>
        </OptionItemWrapper>

        <MemberChose isOpen={isOpen} setIsOpen={setIsOpen} />
        <TwoOptionsModal
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          icon="exclamation"
          title="AI 선지 추천 기능 사용하기"
          subtitle={`투표를 제작할 때 선지 작성에 어려움을 겪는 경우\n이 기능을 사용하여 AI가 선지를 작성하도록 할 수 있습니다.`}
          primaryButtonText={`사용하기 ${aiUsageCount}/3`}
          secondaryButtonText="뒤로가기"
          onPrimaryClick={() => handleUseAI()}
          onSecondaryClick={() => setIsOpenModal(false)}
        />

        {isAiOpen && (
          <AILoadingModal
            title="AI가 선지를 작성하는 중..."
            des="AI가 선지를 작성하는데 약 1분정도의 시간이 소요됩니다."
          />
        )}
        {isCompleteOpen && (
          <CompleteVote
            isOpen={isCompleteOpen}
            setIsOpen={setIsCompleteOpen}
            text1="AI가 선지 작성을"
            text2="했어요!"
            text3="완료"
            subtext="선지가 마음에 들지 않는다면 최대 2회까지 선지를 재생성을 할 수 있습니다."
            img="/svg/Completevote.svg"
            onfunciton={CompleteAi}
          />
        )}
        {isWarnOpen && (
          <CompleteVote
            isOpen={isWarnOpen}
            setIsOpen={setWarnOpen}
            text1={`오늘은 더 이상 AI 선지추천\n기능을`}
            text2="할 수 없어요"
            text3="이용"
            subtext={`AI 선지 추천 기능은 하루에 3번만 사용할 수 있고,\n사용 기능 횟수는 매일밤 12시에 초기화 돼요.`}
            img="/svg/Bad.svg"
            onfunciton={MaxAi}
          />
        )}
      </OptionsSection>
    </OptionsLayout>
  );
}

// styled-components 동일
const OptionsLayout = styled.div`
  max-width: 600px;
  width : 100%;
  background-color : ${color.white};
  height : 100vh;
`

const OptionsSection = styled.div`
  display :flex;
  flex-direction : column;
  margin-top : 100px;
`

const OptionItemWrapper = styled.div`
  max-width : 600px;
  width : 100%;
  display : flex;
  justify-content: center;   
  align-items: center;
  padding : 20px 0px;
  border-bottom : 1px solid #F0F0F0;
`

const OptionContent = styled.div`
  width : 90%;
  display : flex;
  flex-direction : column;
  align-items : center;
  justify-content: center;
  gap : 20px;
`

const OptionActionRow = styled.div`
  display : flex;
  flex-direction : row;
  width : 100%;
  justify-content: space-between;
`

const OptionHeaderRow = styled.div`
  display : flex;
  flex-direction : row;
  width : 100%;
  justify-content: space-between;
`

const OptionTitleText = styled.p`
  font-size : 12px;
  color : #B3B3B3;
  font-weight : 600;
  cursor : pointer;
`

const OptionSubtitleText = styled.p`
  font-size : 16px;
  color : #011627;
  font-weight : 600;
  cursor : pointer;
`
