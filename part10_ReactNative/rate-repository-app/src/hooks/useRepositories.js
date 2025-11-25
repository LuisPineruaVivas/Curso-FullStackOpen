import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = ({ orderBy, orderDirection, searchKeyword, first}) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables: { orderBy, orderDirection, searchKeyword, first },
    fetchPolicy: 'cache-and-network',
    });

    const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        first,
        orderBy,
        orderDirection,
        searchKeyword
      },
    });
  };

  return { 
    repositories: data?.repositories, 
    fetchMore: handleFetchMore, 
    loading,
    ...result
  };
};

export default useRepositories;