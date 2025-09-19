'use client'

import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";
import Image from "next/image";

interface RevoteRequestProps {
    onClose: () => void;
    onConfirm: () => void;
}

const revoteRequest = ({ onClose, onConfirm }: RevoteRequestProps) => {
    return (
        <Overlay onClick={onClose}>
            <ModalLayout onClick={(e) => e.stopPropagation()}>
                <IconContainer>
                    <Image src="/svg/RequestCheck.svg" alt="완료" width={83} height={83} />
                </IconContainer>
                <Title>요청이 <Highlight>성공적</Highlight>으로 접수됐어요</Title>
                <Description>
                    지속적으로 정상적인 가이드를 신고하는 경우<br />
                    제재의 대상이 될 수 있어요
                </Description>
                <Button onClick={onConfirm}>확인</Button>
            </ModalLayout>
        </Overlay>
    )
}

export default revoteRequest;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
`;

const ModalLayout = styled.div`
    max-width: 328px;
    width: 100%;
    background-color: ${color.white};
    border-radius: 24px;
    padding: 52px 20px 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid ${color.gray200};
`;

const IconContainer = styled.div`
    width: 83px;
    height: 83px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 600;
    color: ${color.black};
    margin: 0 0 16px 0;
    line-height: 1.4;
`;

const Highlight = styled.span`
    color: ${color.primary};
`;

const Description = styled.p`
    font-family: ${font.P6};
    font-size: 10px;
    color: ${color.gray600};
    margin: 0 0 24px 0;
    line-height: 1.2;
`;

const Button = styled.button`
    width: 100%;
    height: 40px;
    background-color: ${color.primary};
    color: ${color.white};
    border: none;
    border-radius: 16px;
    font-family: ${font.P1};
    font-size: 12px;
    font-weight: 400;
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        opacity: 0.9;
    }
`;
