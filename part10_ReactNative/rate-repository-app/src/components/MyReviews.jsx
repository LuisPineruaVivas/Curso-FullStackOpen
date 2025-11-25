import { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native';
import { useQuery } from "@apollo/client/react";
import { ME } from '../graphql/queries';
import Text from './Text'
import ReviewItem from './RepositoryItem/ReviewItem';


const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const { loading, error, data, refetch } = useQuery(ME, {
      fetchPolicy: 'cache-and-network',
      variables: { includeReviews: true },
    });

    useEffect(() => {
      if (loading) return;
      if (error) return;
      if (data && data.me !== null) {
        setReviews(data.me.reviews);
      } else {
        setReviews([]);
      }
    })

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error</Text>;

    const reviewsNodes = reviews.edges ? 
    reviews.edges.map(edge => edge.node) : [];
       
  return (
    <FlatList 
    data={reviewsNodes} 
    renderItem={({ item }) => <ReviewItem id={item.id} repositoryId={item.repository.id} rating={item.rating} title={item.repository.fullName} text={item.text} createdAt={item.createdAt} buttons={true} refetch={refetch} />} 
    />
  )
}

export default MyReviews