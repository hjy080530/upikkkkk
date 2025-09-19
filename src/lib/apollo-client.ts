"use client";

import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';

// 에러 처리 링크
const errorLink = onError((errorResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { graphQLErrors, networkError } = errorResponse as any;
  if (graphQLErrors)
    graphQLErrors.forEach((error: { message: string; locations?: unknown; path?: unknown }) =>
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// Authorization 헤더 추가 링크
const authLink = setContext((_, { headers }) => {
  // 토큰을 localStorage에서 가져오거나 환경변수에서 가져오기
  let token = "";
  
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드에서 localStorage에서 토큰 가져오기
    token = localStorage.getItem('authToken') || "";
  }
  
  // 환경변수에서 토큰 가져오기 (서버 사이드)
  if (!token) {
    token = process.env.NEXT_PUBLIC_AUTH_TOKEN || "";
  }
  
  // 하드코딩된 토큰 (개발용)
  if (!token) {
    token = "eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiZ29vZ2xlXzEwNTAwNzE3NTc1NzM1ODk1MTE4NCIsInJvbGUiOiJST0xFX0JTTSIsImlhdCI6MTc1ODE3ODk0MSwiZXhwIjoxODQ4MTc4OTQxfQ.x-6ExSnj63bl7_8-XmXlp6DswnQJWv8bdAzJAujGqEg";
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://realupik-659794985248.asia-northeast3.run.app/graphql',
  credentials: 'include'
});


const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;