'use client'

import Header from "@/components/common/Header";
import HeaderItemsBox from "@/components/Header/HeaderItemBox";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import GuideCategoryImage from "@/components/VoteMakes/GuideCategoryImage";
import GuideCategoryText from "@/components/VoteMakes/GuideCategoryText";
import CategoryChooseBox from "@/components/VoteMakes/CategoryChoseBox";
import CategoryChooseModal from "@/components/Modal/CategoryChose";
import ChooseButton from "@/components/VoteMakes/ChoseButton";
import MakeCancel from "@/components/Modal/MakeCancel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useVoteStore } from "@/app/stores/useVoteStore";

const VoteMakePage = () => {
  const router = useRouter();
  
  const { category, setCategory } = useVoteStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMakeModal, setIsOpenMakeModal] = useState(false);

  return (
    <VoteMakeLayout>
      <Header
        LeftItem={
          <img
            src="/svg/Back.svg"
            width={20}
            height={50}
            onClick={() => {
              router.back();
            }}
          />
        }
        RightItem={
          <div onClick={() => setIsOpenMakeModal(true)}>
            <HeaderItemsBox type="votemake" />
          </div>
        }
        types="votemake"
      />

      <ContentWrapper>
        <CategoryGuideSection>
          <GuideCategoryImage category={category} />
          <GuideCategoryText />
        </CategoryGuideSection>

        <CategoryChooseBox
          category={category}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />

        <ChooseButton />

        <CategoryChooseModal
          setGuideCategory={setCategory} 
          category={category}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
        />
      </ContentWrapper>

      {isOpenMakeModal ? (
        <MakeCancel setIsOpen={setIsOpenMakeModal} isOpen={isOpenMakeModal} />
      ) : null}
    </VoteMakeLayout>
  );
};

export default VoteMakePage;

const VoteMakeLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-height: 100vh;
  background-color: ${color.white};
`;

const CategoryGuideSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 36px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  gap: 36px;
  margin-top: 140px;
`;