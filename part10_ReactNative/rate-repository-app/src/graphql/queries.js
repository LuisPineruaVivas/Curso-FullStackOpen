import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query Repositories(
    $orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, 
    $searchKeyword: String, $first: Int, $after: String) {
      repositories(orderBy: $orderBy, orderDirection: $orderDirection, 
        searchKeyword: $searchKeyword, first: $first, after: $after) {
          edges {
            node {
                fullName
                description
                language
                ownerAvatarUrl
                stargazersCount
                forksCount
                reviewCount
                ratingAverage
                id
            }
            cursor
          }
        totalCount
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
  }
`;

export const GET_REPOSITORY = gql`
 query Repository($id: ID!, $first: Int, $after: String) {
    repository(id: $id) {
      id
      fullName
      description
      language
      ownerAvatarUrl
      stargazersCount
      forksCount
      reviewCount
      ratingAverage
      url
      reviews(first: $first, after: $after)
       {
        edges {
          node {
            id
            createdAt
            rating
            text
            user {
              id
              username
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          startCursor
        }
      }
    }
  }
`;

export const ME = gql`
  query Me ($includeReviews: Boolean = false) {
    me {
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            rating
            repository {
              fullName
              id
            }
            text
            createdAt
            id
          }
        }
      }
    }
  }
`;
