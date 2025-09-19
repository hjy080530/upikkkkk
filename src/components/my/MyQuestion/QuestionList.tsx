"use client";

import React from "react";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import QuestionCard, { QuestionCardProps } from "./QuestionCard";
import { useRouter } from "next/navigation";

interface QuestionListProps {
  questions: Omit<QuestionCardProps, "onClick">[];
}

const QuestionList = ({ questions }: QuestionListProps) => {
  const router = useRouter();

  const handleQuestionClick = (id: string) => {
    router.push(`/guide/${id}`);
  };

  return (
    <Container>
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          {...question}
          onClick={handleQuestionClick}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 390px;
  background-color: ${color.white};
`;

export default QuestionList;
