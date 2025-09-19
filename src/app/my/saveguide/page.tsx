"use client";

import React, { useState } from 'react';
import styled from "@emotion/styled";
import Header from "@/components/common/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GuideItem from "@/components/my/SavedGuide/GuideItem";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import TabButton from "@/components/common/TabButton";
import { useQuery } from '@apollo/client/react';
import { GET_BOOKMARKED_GUIDES } from '@/graphql/queries';

interface BookmarkedGuidesData {
  bookmark: {
    getBookmarkedGuides: Array<{
      id: string;
      title: string;
      category?: {
        id: string;
        name: string;
      } | null;
      views: number;
      emoji: string;
    }>;
  };
}

const SaveGuidePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');

  const { data, loading, error } = useQuery<BookmarkedGuidesData>(GET_BOOKMARKED_GUIDES, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  });

  const handleBack = () => {
    router.back();
  };

  const handleGuideClick = (id: string) => {
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
          CenterItem={<Title>저장한 가이드</Title>}
          types="saveGuide"
        />
        <ContentContainer>
          <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
        </ContentContainer>
      </PageContainer>
    );
  }

  const bookmarkedGuides = data?.bookmark?.getBookmarkedGuides?.filter(guide => guide && guide.id) || [];

  return (
    <PageContainer>
      <Header 
        LeftItem={
          <BackButton onClick={handleBack}>
            <Image src="/svg/Back.svg" alt="Back" width={24} height={24} />
          </BackButton>
        }
        CenterItem={<Title>저장한 가이드</Title>}
        types="saveGuide"
      />
      
      <ContentContainer>
        <GuideList>
          {bookmarkedGuides.length > 0 ? (
            bookmarkedGuides.map(guide => (
              <GuideItem
                key={guide.id}
                title={guide.title || '제목 없음'}
                category={guide.category?.name || '기타'}
                views={guide.views || 0}
                emoji={guide.emoji || '📚'}
                onClick={() => handleGuideClick(guide.id)}
              />
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center' }}>저장한 가이드가 없습니다.</div>
          )}
        </GuideList>
      </ContentContainer>
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

const GuideList = styled.div`
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

export default SaveGuidePage;