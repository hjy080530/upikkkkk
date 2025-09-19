'use client'

import Header from "@/components/common/Header";
import NavigationBar from "@/components/common/NavigationBar";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import { useRouter, useSearchParams } from "next/navigation";
import RevoteComponent from "@/components/Guide/RevoteComponent";
import DetailContent from "@/components/Guide/DetailContent";
import React, { useState, useMemo, Suspense } from "react";
import RevoteSend from "@/components/Button/RevoteSend";
import apolloClient from "@/lib/apollo-client";
import { REVOTE_MUTATION } from "@/graphql/queries";

const revoteReasons = [
  "가이드 내용이 부정확해요",
  "가이드가 이해하기 어려워요", 
  "더 나은 대안이 있어요",
  "가이드가 현실적이지 않아요",
  "기타"
];

const RevoteContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guideId = searchParams.get("guideId") || 
                  searchParams.get("id") || 
                  searchParams.get("guide") ||
                  searchParams.get("gid");
  
  console.log('Revote Debug:', {
    guideId,
    searchParams: Object.fromEntries(searchParams.entries()),
    currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
    allParams: {
      guideId: searchParams.get("guideId"),
      id: searchParams.get("id"),
      guide: searchParams.get("guide"),
      gid: searchParams.get("gid")
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReasonIndex, setSelectedReasonIndex] = useState<number | null>(null);
  const [detailText, setDetailText] = useState("");
  const isSendEnabled = useMemo(() => selectedReasonIndex !== null && detailText.trim().length > 0, [selectedReasonIndex, detailText]);

  const handleSendClick = () => {
    if (isSendEnabled) {
      handleRequestConfirm();
    }
  };

  const handleRequestConfirm = async () => {
    if (!guideId) {
      console.error('Guide ID is missing:', { 
        guideId, 
        searchParams: Object.fromEntries(searchParams.entries()),
        allParams: {
          guideId: searchParams.get("guideId"),
          id: searchParams.get("id"),
          guide: searchParams.get("guide"),
          gid: searchParams.get("gid")
        }
      });
      console.log("가이드 ID를 찾을 수 없습니다. URL을 확인해주세요.");
      return;
    }

    const reasonText = selectedReasonIndex !== null ? revoteReasons[selectedReasonIndex] : "";

    try {
      setIsSubmitting(true);
      console.log('Sending revote request:', {
        guideId,
        reason: reasonText,
        detailReason: detailText,
      });
      
      const result = await apolloClient.mutate({
        mutation: REVOTE_MUTATION,
        variables: {
          input: {
            guideId: String(guideId),
            reason: reasonText,
            detailReason: detailText,
          },
        },
      });
      
      console.log('Revote request result:', result);
      console.log("재투표 신청이 완료되었습니다.");
      router.push('/moreguide');
    } catch (error) {
      console.error('Revote request error:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      console.error(`요청 중 오류가 발생했어요: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <GuidePageLayout>
      <Header 
        LeftItem={
          <img
            src="/svg/Back.svg"
            width={20}
            height={50}
            onClick={() => router.back()}
          />
        } 
        RightItem={<HeaderItemsBox type={'revote'} />}
        types={'none'}
      />

      <RevoteLayout>
        <Layout>
        <RevoteHeader>
          <SmallHeader>재투표 신청</SmallHeader>
            <Title>가이드 재투표 신청하기</Title>
        </RevoteHeader>

        <Column>
                <SmallTitle>재투표 요청 이유 선택 <Star>*</Star></SmallTitle>
                <RevoteComponent selectedIndex={selectedReasonIndex} onSelect={setSelectedReasonIndex}/>
        </Column>

        <Column>
                <SmallTitle>상세 내용 <Star>*</Star></SmallTitle>
                <DetailContent value={detailText} onChange={setDetailText}/>
                <CharacterLimit>500자 이내로 입력해주세요</CharacterLimit>
        </Column>
        </Layout>

        <SendBar>
            <RevoteSend disabled={!isSendEnabled || isSubmitting} onClick={handleSendClick}>
              {isSubmitting ? "보내는 중..." : "신청 보내기"}
            </RevoteSend>
        </SendBar>
      </RevoteLayout>

    <NavigationBar />
    </GuidePageLayout>
  );
}

const Revote = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RevoteContent />
    </Suspense>
  );
};

export default Revote;

const GuidePageLayout = styled.div`
  display :flex;
  flex-direction : column;
  align-items : center;
  max-width : 600px;
  width : 100%;
  min-height: 100vh;
  background-color : ${color.white};
`;

const RevoteLayout = styled.div`
  display :flex;
  flex-direction : column;
  align-items : center;
  max-width : 600px;
  width : 100%;
  min-height: 100vh;
  margin-top:15%;
  padding-bottom: 0px;
  background-color : ${color.white};
`;  

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4.74vh;  
  width: 90%;
  align-items: start; 
`;

const RevoteHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;   
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; 
  width: 100%;
`;

const SmallHeader = styled.div`
  font-family:${font.P1};
  color:${color.gray700};
`;

const Title = styled.h1`
  margin: 0;
  color: ${color.black};
  font-family:${font.D2};
`;

const SmallTitle = styled.div`
font-family:${font.P13};
  color:${color.gray700};
`;

const Star = styled.span`
    color:${color.accent};
`;

const SendBar = styled.div`
  position: sticky;
  bottom: 0;
  width: 90%;
  margin: 0 auto;
  max-width: 600px;
  padding: 8px 0;
  background-color: ${color.white};
  z-index: 1001;
  margin-top: 40px;
`;

const CharacterLimit = styled.div`
  font-family: ${font.P3};
  color: ${color.gray300};
  text-align: left;
  margin-top: 8px;
`;