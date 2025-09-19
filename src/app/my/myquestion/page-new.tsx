"use client";

import React from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import MyPageHeader from "@/components/my/MyQuestion/MyPageHeader";
import MyQuestionList from "@/components/my/MyQuestion/MyQuestionList";
import { useQuery } from '@apollo/client/react';
import { GET_MY_VOTES } from '@/graphql/queries';

interface MyVotesData {
  vote: {
    getMyVotes: Array<{
      id: string;
      title: string;
      category: string;
      status: string;
      totalResponses: number;
      createdAt: string;
      finishedAt: string;
    }>;
  };
}

const MyQuestionPage = () => {
  const { data, loading, error } = useQuery<MyVotesData>(GET_MY_VOTES, {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore'
  });


  // 로딩 처리
  if (loading) {
    return (
      <MainPageLayout>
        <MyPageHeader title="내가 만든 투표" backLink="/my" headerType="makeVote" />
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      </MainPageLayout>
    );
  }

  // 에러 처리
  if (error) {
    return (
      <MainPageLayout>
        <MyPageHeader title="내가 만든 투표" backLink="/my" headerType="makeVote" />
        <div style={{ padding: '20px', textAlign: 'center' }}>데이터를 불러오는 중 오류가 발생했습니다.</div>
      </MainPageLayout>
    );
  }

  // MyQuestionList가 기대하는 형태로 데이터 변환
  const transformedQuestions = data?.vote?.getMyVotes?.map(vote => ({
    id: vote.id,
    title: vote.title,
    category: vote.category,
    state: vote.status,
    voteCount: vote.totalResponses,
    endDate: vote.finishedAt,
    createdAt: vote.finishedAt
  })) || [];

  return (
    <MainPageLayout>
      <MyPageHeader title="내가 만든 투표" backLink="/my" headerType="makeVote" />
      <MyQuestionList questions={transformedQuestions} />
    </MainPageLayout>
  );
};

export default MyQuestionPage;

const MainPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-height: 100vh;
  background-color: ${color.white};
`

const PageContainer = styled.main`
  background: ${color.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;
