'use client';

import { useState, use } from "react"; // use 추가
import styled from "@emotion/styled";
import Header from "@/components/common/Header";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import VoteOption from "@/components/Vote/VoteOption";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import { useRouter, usePathname } from "next/navigation"; // useParams 제거
import { useVoteById, useVoteResponse } from "@/hooks/useVote";

const DoVote = ({ params }: { params: Promise<{ id: string }> }) => { // Promise 타입으로 변경
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // React.use()로 params unwrap
  const { id } = use(params);
  
  const router = useRouter();
  const path = usePathname();

  const labels = ['A','B','C','D','E'];

  const { vote, loading, error } = useVoteById(id);
  const { createResponse, loading: responseLoading } = useVoteResponse();

  // 나머지 코드는 동일...
  const handleVoteSubmit = async () => {
    if (!selectedOption) {
      alert("선택지를 선택해주세요.");
      return;
    }
    if (!vote) {
      return;
    }
    
    try {
      await createResponse({
        voteId: vote.id,
        optionId: selectedOption,
      });
      router.push(`${path}/tailvote`);
    } catch (err) {
      console.error(err);
      alert("투표 참여 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>투표 정보를 불러오는 중...</p>;
  if (error) return <p>투표 정보 불러오기 실패: {error.message}</p>;
  if (!vote) return <p>투표를 찾을 수 없습니다.</p>;

  return (
    <DoVoteLayout>
      <Header
        LeftItem={
          <img
            src="/svg/Back.svg"
            width={20}
            height={50}
            onClick={() => router.back()}
          />
        }
        RightItem={<HeaderItemsBox type={"reportvote"} />}
        types="Nones"
      />

      <DoVoteContainer>
        <ContentWrapper>
          <TextWrapper>
            <Title>투표하기</Title>
            <Question>{vote.title}</Question>
            <Description>
              부적절한 투표는 위에 있는 신고버튼을 이용해 신고해주세요
            </Description>
          </TextWrapper>

          <OptionsWrapper>
            {vote?.options?.map((option: { id: string; content: string }, idx: number) => (
              <VoteOption
                key={option.id}
                label={labels[idx] ?? ''}
                text={option.content}
                isSelected={selectedOption === option.id}
                onClick={() =>
                  setSelectedOption((prev) =>
                    prev === option.id ? null : option.id
                  )
                }
              />
            ))}
          </OptionsWrapper>

          <SubmitButton
            onClick={handleVoteSubmit}
            disabled={!selectedOption || responseLoading}
          >
            {responseLoading ? "투표 중..." : "투표 완료하기"}
          </SubmitButton>
        </ContentWrapper>
      </DoVoteContainer>
    </DoVoteLayout>
  );
};

export default DoVote;




// styled-components (기존과 동일)
const DoVoteLayout = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  background-color: ${color.white};
  min-height: 100vh;
`;

const DoVoteContainer = styled.div`
  width: 100%;
  padding: 100px 20px 40px 20px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  ${font.H1};
  color: #FF8A00;
  margin: 0;
`;

const Question = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
  line-height: 1.4;
`;

const Description = styled.p`
  ${font.H3};
  color: #9CA3AF;
  margin: 0;
  line-height: 1.4;
`;

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 20px;
  border-radius: 30px;
  border: none;
  background-color: ${(props) =>
    props.disabled ? "#D1D5DB" : `${color.primary}`};
  color: ${color.white};
  font-size: 20px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  margin-top: 60px;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "#D1D5DB" : `${color.primary}`};
  }
`;
