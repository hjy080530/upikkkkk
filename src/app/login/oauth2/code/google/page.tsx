"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "@emotion/styled";
import color from "@/packages/design-system/src/color";
import font from "@/packages/design-system/src/font";

const GoogleOAuthCallbackPage = (): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 authorization code 추출
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        if (error) {
          console.error('OAuth 에러:', error);
          router.push('/login?error=oauth_failed');
          return;
        }

        if (code) {
          // 백엔드 API에 authorization code 전송
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              state
            }),
          });

          if (response.ok) {
            // 쿠키에서 토큰 확인 (백엔드에서 설정됨)
            const cookies = document.cookie.split(';');
            const accessTokenCookie = cookies.find(cookie => 
              cookie.trim().startsWith('access-token=')
            );
            
            if (accessTokenCookie) {
              const token = accessTokenCookie.split('=')[1];
              localStorage.setItem('access-token', token);
              
              setTimeout(() => {
                router.push('/');
              }, 1000);
            } else {
              throw new Error('토큰을 찾을 수 없습니다');
            }
          } else {
            throw new Error('인증 실패');
          }
        } else {
          router.push('/login?error=no_code');
        }
      } catch (error) {
        console.error('OAuth 콜백 처리 에러:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <Container>
      <LoadingSection>
        <Spinner />
        <Title>로그인 처리 중...</Title>
        <Description>잠시만 기다려주세요</Description>
      </LoadingSection>
    </Container>
  );
};

export default GoogleOAuthCallbackPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: ${color.white};
  max-width: 600px;
  margin: 0 auto;
`;

const LoadingSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${color.gray200};
  border-top: 3px solid ${color.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Title = styled.h2`
  ${font.H2}
  color: ${color.black};
  margin: 0;
`;

const Description = styled.p`
  ${font.H4}
  color: ${color.gray600};
  margin: 0;
`;
