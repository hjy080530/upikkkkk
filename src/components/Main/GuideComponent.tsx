"use client";
import React from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import { useRouter } from "next/navigation";
import { useAllGuides } from "@/hooks/useGuides";

type GuideComponentProps = {
  gap?: string;
  category?: string;
  sortstandard?: string;
  limit?: number;
};

const GuideComponent = ({ gap = "10px", category = '전체', sortstandard = '가이드 제작일 기준', limit }: GuideComponentProps) => {
  const router = useRouter();
  
  const { guides, loading, error } = useAllGuides(0, 20, sortstandard === '가이드 제작일 기준' ? 'createdAt' : 'like');
  
  const filteredGuides = guides.filter((guide) => {
    if (category === '전체') return true;
    return guide.category === category;
  });

  const sorted = [...filteredGuides].sort((a, b) => {
    if (sortstandard === '가이드 제작일 기준') {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeB - timeA; 
    }
    if (sortstandard === '가이드 제작일 빠른순') {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    }
    if (sortstandard === '많이 저장한 가이드 기준') {
      return (b.like || 0) - (a.like || 0);
    }
    return 0;
  });

  const limitedGuides = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  const getThumbnailByCategory = (category: string) => {
    switch (category) {
      case '유머':
        return "/svg/Humors.svg";
      case '학교생활':
        return "/svg/School.svg";
      case '기숙사':
        return "/svg/Domitorys.svg";
      default:
        return "/svg/Guide.svg";
    }
  };

  if (loading) {
    return (
      <Root>
        <LoadingText>가이드를 불러오는 중...</LoadingText>
      </Root>
    );
  }

  if (error) {
    return (
      <Root>
        <ErrorText>가이드를 불러오는데 실패했습니다.</ErrorText>
      </Root>
    );
  }
  return (
    <Root>
      <Section>
        <SectionBody gap={gap}>
          {limitedGuides.length > 0 ? (
            limitedGuides.map((item) => (
              <GuideCard key={item.id} onClick={() => router.push(`/moreguide?id=${item.id}`)}>            
                <GuideEmoji src={getThumbnailByCategory(item.category || '기타')} alt="thumbnail" />
                <GuideTextWrap>
                  <GuideTitle>{item.title}</GuideTitle>
                  <GuideMeta>
                    <GuideTag>{item.category || '기타'}</GuideTag>
                    <GuideCountIcon />
                    <GuideCount>{item.like || 0}</GuideCount>
                  </GuideMeta>
                </GuideTextWrap>
              </GuideCard>
            ))
          ) : (
            <NoDataText>등록된 가이드가 없습니다.</NoDataText>
          )}
        </SectionBody>
      </Section>
    </Root>
  );
};

export default GuideComponent;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width : 90%;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionBody = styled.div<{ gap: string }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.gap};
`;

const GuideCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 67px;
  border: 1px solid ${color.gray50};
  border-radius: 8px;
  background: ${color.white};
  padding: 0 16px;
    box-shadow: 
    -4px -4px 10px 0 rgba(0,0,0,0.03),
     4px  4px 10px 0 rgba(0,0,0,0.03);
  cursor: pointer;
`;

const GuideEmoji = styled.img`
  width: 28px;
  height: 28px;
`;

const GuideTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const GuideTitle = styled.div`
  color: ${color.black};
  font-family:  ${font.P13};
`;

const GuideMeta = styled.div`
  display: flex;
  align-items: center;
`;

const GuideTag = styled.div`
  color: ${color.gray600};
  font-family: ${font.P6};
`;

const GuideCountIcon = styled.span`
  width: 10px;
  height: 10px;
  background-color: ${color.gray500};
  -webkit-mask: url('/svg/Bookmark.svg') no-repeat center / contain;
  mask: url('/svg/Bookmark.svg') no-repeat center / contain;
  display: inline-block;
  margin-left:8px;
`;

const GuideCount = styled.div`
  color: ${color.gray600};
  font-family:${font.p2};
  margin-left:2px;
`;

const LoadingText = styled.div`
  color: ${color.gray500};
  font-family: ${font.P1};
  text-align: center;
  padding: 20px;
`;

const ErrorText = styled.div`
  color: ${color.accent};
  font-family: ${font.P1};
  text-align: center;
  padding: 20px;
`;

const NoDataText = styled.div`
  color: ${color.gray400};
  font-family: ${font.P1};
  text-align: center;
  padding: 20px;
`;




