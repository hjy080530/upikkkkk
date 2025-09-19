"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import QuestionList from "@/components/my/MyQuestion/QuestionList";
import Header from "@/components/common/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TabButton from "@/components/common/TabButton";
import { useQuestions } from "@/hooks/useQuestions";

const MyQuestionHistoryPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');
  
  const { questions, loading, error } = useQuestions(0, 20);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <MainPageLayout>
        <Header 
          LeftItem={
            <BackButton onClick={handleBack}>
              <Image src="/svg/Back.svg" alt="Back" width={24} height={24} />
            </BackButton>
          }
          CenterItem={<Title>질문 게시판 글 작성 내역</Title>}
          types="Nones"
        />
        <ContentContainer>
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        </ContentContainer>
      </MainPageLayout>
    );
  }

  return (
    <MainPageLayout>
      <Header 
        LeftItem={
          <BackButton onClick={handleBack}>
            <Image src="/svg/Back.svg" alt="Back" width={24} height={24} />
          </BackButton>
        }
        CenterItem={<Title>질문 게시판 글 작성 내역</Title>}
        types="saveGuide"
      />
      
      <ContentContainer>
        <TabContainer>
          <TabButton 
            isActive={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            전체
          </TabButton>
          <TabButton 
            isActive={activeTab === 'recent'} 
            onClick={() => setActiveTab('recent')}
          >
            최신
          </TabButton>
        </TabContainer>
        
        <QuestionList questions={questions.map(q => ({
          id: q.id,
          title: q.title,
          author: q.userName,
          date: new Date(q.createdAt).toLocaleDateString(),
          bookmarkCount: q.bookmarkCount,
          commentCount: q.commentCount
        }))} />
        {questions.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center' }}>작성한 질문이 없습니다.</div>
        )}
      </ContentContainer>
    </MainPageLayout>
  );
};

const MainPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-height: 100vh;
  background-color: ${color.white};
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  ${font.H7}
  margin: 0;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px 16px;
  margin-top: 56px;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${color.gray100};
  margin-bottom: 16px;
  width: 100%;
`;

export default MyQuestionHistoryPage;
