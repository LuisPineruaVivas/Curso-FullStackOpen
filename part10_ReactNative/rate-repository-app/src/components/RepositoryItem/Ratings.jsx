import {View, StyleSheet} from 'react-native';
import RatingItem from './RatingItem';

const styles = StyleSheet.create({
  ratings: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5
  }

});

const Ratings = ({item}) => {
  return (
    <View style={styles.ratings}>
        <RatingItem item="Stars" value={item.stargazersCount}/>
        <RatingItem item="Forks" value={item.forksCount}/>
        <RatingItem item="Reviews" value={item.reviewCount}/>
        <RatingItem item="Rating" value={item.ratingAverage}/>
    </View>  
  )
}

export default Ratings