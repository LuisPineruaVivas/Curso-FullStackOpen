import Text from './Text'
import { useParams } from 'react-router-native'
import { useState, useEffect } from 'react'
import { useQuery } from "@apollo/client/react";
import { GET_REPOSITORY } from '../graphql/queries';
import RepositoryItem from './RepositoryItem/RepositoryItem'
import { FlatList,} from 'react-native';
import ReviewItem from './RepositoryItem/ReviewItem';

const Repository = () => {
    const { id } = useParams()
    const [repository, setRepository] = useState()
    const first = 5
    const { data, loading, fetchMore, ...result } = useQuery(
      GET_REPOSITORY, 
      { variables: { id, first }, 
      fetchPolicy: 'cache-and-network'
     });

     const handleFetchMore = () => {
      const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;
  
      if (!canFetchMore) {
        return;
      }
  
      fetchMore({
        variables: {
          after: data.repository.reviews.pageInfo.endCursor,
          first,
        },
      });
    };

    const onEndReached = () => {
      handleFetchMore();
    };

    useEffect(() => {
      if (data) {
        setRepository(data.repository)
      }
    }, [data])


    if (!repository) {
      return <Text>Loading</Text>
    }

  return (
    <FlatList 
        data={repository.reviews.edges} 
        renderItem={({ item }) => <ReviewItem rating={item.node.rating} title={item.node.user.username} text={item.node.text} createdAt={item.node.createdAt}/>} 
        ListHeaderComponent={() => <RepositoryItem item={repository} button={true} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        />
  )
}

export default Repository