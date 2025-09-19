"use client";

import Question from '@/components/my/Profile/SavedQuestion/Question/Question';
import React from 'react';
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
      finishedAt: string;
    }>;
  };
}

type Vote = MyVotesData['vote']['getMyVotes'][0];

const MadeVotePage = () => {
    const { data, loading, error } = useQuery<MyVotesData>(GET_MY_VOTES, {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore'
    });

    console.log('MadeVotePage data:', data);
    console.log('MadeVotePage loading:', loading);
    console.log('MadeVotePage error:', error);

    if (loading) return <div>로딩 중...</div>;

    if (error) return <div>오류가 발생했습니다: {error.message}</div>;

    const myVotes = data?.vote?.getMyVotes || [];

    return (
        <>
            {myVotes.map((vote: Vote) => (
                <Question 
                    key={vote.id}
                    q={{
                        title: vote.title,
                        author: "나", // 내가 만든 투표이므로
                        date: vote.finishedAt ? new Date(vote.finishedAt).toLocaleDateString() : "진행 중",
                        bookmark: 0, // API에서 북마크 정보가 없어서 0으로 설정
                        comments: vote.totalResponses
                    }}
                />
            ))}
            {myVotes.length === 0 && (
                <div>만든 투표가 없습니다.</div>
            )}
        </>
    );
};

export default MadeVotePage;
