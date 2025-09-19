'use client'

import Header from "@/components/common/Header";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import NavigationBar from "@/components/common/NavigationBar";
import font from "@/packages/design-system/src/font";
import { useRouter, useSearchParams } from "next/navigation";
import ChartComponent from "@/components/Guide/ChartComponent";
import { useMoreGuide } from "@/hooks/useMoreGuide";
import { useQuery } from '@apollo/client/react';
import { GET_VOTE_BY_ID } from '@/graphql/queries';
import { Vote } from '@/types/api';
import { Suspense } from 'react';

const MoreGuideContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guideId = searchParams.get('id');
  
  const { guide, loading, error } = useMoreGuide(guideId || '');
  
  console.log('MoreGuide Debug:', {
    guideId,
    guide,
    loading,
    error
  });

  const { data: voteData, loading: voteLoading, error: voteError } = useQuery<{ vote: { getVoteById: Vote } }>(GET_VOTE_BY_ID, {
    variables: { id: guide?.voteId || '' },
    skip: !guide?.voteId || !guide,
  });
  
  const vote = voteData?.vote?.getVoteById;
  
  console.log('Vote Debug:', {
    voteId: guide?.voteId,
    vote,
    voteLoading,
    voteError
  });
  
  if (loading) {
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
          RightItem={<HeaderItemsBox type={'guide'} />}
          types={'none'}
        />
        <MainLayout>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            로딩 중...
          </div>
        </MainLayout>
        <NavigationBar />
      </GuidePageLayout>
    );
  }

  if (error || !guide) {
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
          RightItem={<HeaderItemsBox type={'guide'} />}
          types={'none'}
        />
        <MainLayout>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <div>가이드를 불러올 수 없습니다.</div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              ID: {guideId}
            </div>
            {error && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#ff0000' }}>
                Error: {error.message}
              </div>
            )}
          </div>
        </MainLayout>
        <NavigationBar />
      </GuidePageLayout>
    );
  }

  const chartData = vote?.options?.map((option: { content: string; responseCount?: number }, index: number) => ({
    label: option.content,
    value: option.responseCount || 0,
    color: ['#FF3B3B', '#FF6D38', '#FFBE3C'][index % 3]
  })) || [
    { label: "옵션 1", value: 30, color: '#FF3B3B' },
    { label: "옵션 2", value: 40, color: '#FF6D38' },
    { label: "옵션 3", value: 30, color: '#FFBE3C' }
  ];

  console.log('Chart Data Debug:', {
    vote,
    voteOptions: vote?.options,
    chartData,
    isUsingDefaultData: !vote?.options || vote.options.length === 0
  });

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
        RightItem={<HeaderItemsBox type={'guide'} />}
        types={'none'}
      />

      <MainLayout>
        <Layout>
        <TitleColumn>
          <Thumb src="/svg/School.svg" alt="thumbnail" />
          <TitleTexts>
            <Title>{guide.title}</Title>
            <DateText>{guide.createdAt ? new Date(guide.createdAt as string).toLocaleDateString() : '날짜 없음'}</DateText>
          </TitleTexts>
          <Line />
        </TitleColumn>

      <VoteResult>
        <VoteCheck className="sancheon">투표 결과 확인하기</VoteCheck>
        <VoteSection>
          <VoteTitle>{vote?.title || '투표 제목'}</VoteTitle>
          <Participate>전체 참여자 수 {vote?.totalResponses || guide.revoteCount || 0}명</Participate>
          <ChartArea>
            {voteLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                투표 데이터를 불러오는 중...
              </div>
            ) : (
              <ChartComponent data={chartData} />
            )}
          </ChartArea>
        </VoteSection>
      </VoteResult>
        </Layout>
      </MainLayout>
      
      <ContentLayout>
      <Content>
        {guide.content}
      </Content>
      </ContentLayout>

      <Line2 />
      
      <ProblemLayout>
        <Problem onClick={() => router.push('/Revote')}>가이드에 문제가 있다면</Problem>
      </ProblemLayout>
      <NavigationBar />
    </GuidePageLayout>
  );
}

const MoreGuide = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MoreGuideContent />
    </Suspense>
  );
};

export default MoreGuide;

const GuidePageLayout = styled.div`
  display :flex;
  flex-direction : column;
  align-items : center;
  max-width : 600px;
  width : 100%;
  background-color : ${color.white};
  padding-bottom: 72px;
`;

const MainLayout = styled.div`
  display :flex;
  flex-direction : column;
  align-items : center;
  max-width : 600px;
  width : 100%;
  margin-top:13%;
  margin-bottom: 10px;
  background-color : ${color.white};
`;  

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width : 90%;
  align-items: center;
`;
const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
  width: 100%;
`;

const Thumb = styled.img`
  width: 33px;
  height: 33px;
`;

const TitleTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${color.black};
  ${font.D1};
`;

const DateText = styled.span`
  color: ${color.gray500};
  font-family: ${font.p1};
`;

const Line = styled.hr`
  width: 100%;
  border: none;
  height: 1px;
  background: ${color.gray300};
  margin: 0;
`;

const Line2 = styled.hr`
  width: 90%;
  border: none;
  height: 1px;
  background: ${color.gray300};
  margin: 0 auto;
`;

const VoteResult = styled.div`
  width: 90%;
  min-height: 561px;
  border-radius:8px;
  border:1px solid ${color.gray500};
  display:flex;
  align-items : center;
  flex-direction : column;
  position: relative;
  margin-top: 20px;
`;

const VoteCheck = styled.div`
  width:148px;
  height:37px;
  background-color:${color.black};
  border-radius:30px;
  color:${color.white};
  display:flex;
  align-items : center;
  justify-content: center;
  position: absolute;
  top:0;
  left:50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const VoteSection = styled.section`
  width: 318px;
  display:flex;
  align-items : center;
  flex-direction : column;
  margin-top: 60px;
`;

const VoteTitle = styled.div`
  height: 33px;
  color: ${color.black};
  text-align: center;
  font-family: ${font.D1};
`;

const Participate = styled.div`
  margin-top: 20px;
  color: ${color.black};
  text-align: center;
  font-family: ${font.P1};
`;

const ChartArea = styled.div`
  width: 318px;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20%;
`;

const ContentLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  width: 90%;
  color: ${color.black};
  font-family: ${font.P1};
  line-height: 24px;
`;

const ProblemLayout = styled.div`
  width: 90%;
  line-height: 24px;
  text-align: right;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Problem = styled.button`
  color: ${color.gray500};
  font-family: ${font.P6};
  border: none;
  height: 42px;
  background-color: transparent;
  text-align: right;
  margin-bottom: 20px;
  cursor: pointer;
`;