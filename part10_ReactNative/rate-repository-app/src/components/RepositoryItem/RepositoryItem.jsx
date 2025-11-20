import {View, StyleSheet} from 'react-native';
import RepositoryHeader from './RepositoryHeader';
import Ratings from './Ratings';

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10
  }
});

const Item = ({item}) => (
  <View style={styles.card}>
    <RepositoryHeader imageUrl={item.ownerAvatarUrl} name={item.fullName} description={item.description} language={item.language}/>
    <Ratings item={item}/>
  </View>
);


export default Item;