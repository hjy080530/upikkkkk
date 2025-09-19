"use client";

import React, { useState } from 'react';
import styled from "@emotion/styled";
import Header from "@/components/common/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QuestionItem from "@/components/my/SavedQuestion/QuestionItem";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import TabButton from "@/components/common/TabButton";
import { useQuery } from '@apollo/client/react';
import { GET_BOOKMARKS } from '@/graphql/queries';

interface BookmarksData {
  bookmark: {
    getBookmarks: Array<{
      id: string;
      userId: string;
      guideId: string;
      createdAt: string;
    }>;
  };
}

const SavedQuestionPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');

  const { data, loading, error } = useQuery<BookmarksData>(GET_BOOKMARKS, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  });

  const handleBack = () => {
    router.back();
  };

  const handleQuestionClick = (id: string) => {
  };

  // 로딩 처리
  if (loading) {
    return (
      <PageContainer>
        <Header 
          LeftItem={
            <BackButton onClick={handleBack}>
              <Image src="/svg/Back.svg" alt="Back" width={24} height={24} />
            </BackButton>
          }
          types="saveQuestion"
        />
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      </PageContainer>
    );
  }

  // 북마크 데이터는 ID만 있으므로, 필터링은 임시로 전체만 표시
  const bookmarks = data?.bookmark?.getBookmarks || [];

  return (
    <PageContainer>
      <Header 
        LeftItem={
          <BackButton onClick={handleBack}>
            <Image src="/svg/Back.svg" alt="Back" width={24} height={24} />
          </BackButton>
        }
        types="saveQuestion"
      />
        
        <QuestionList>
          {bookmarks.map(bookmark => (
            <QuestionItem
              key={bookmark.id}
              title={`북마크 ID: ${bookmark.guideId}`}
              date={new Date(bookmark.createdAt).toLocaleDateString()}
              views={0}
              comments={0}
              onClick={() => handleQuestionClick(bookmark.id)}
            />
          ))}
          {bookmarks.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center' }}>저장한 질문이 없습니다.</div>
          )}
        </QuestionList>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${color.white};
  align-items: center;
  max-width: 600px;
  width: 100%;
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

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${color.gray100};
  margin-bottom: 16px;
  width: 100%;
`;

export default SavedQuestionPage;
