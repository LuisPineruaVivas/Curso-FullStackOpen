import {View, StyleSheet, Pressable} from 'react-native';
import RepositoryHeader from './RepositoryHeader';
import Ratings from './Ratings';
import Text from '../Text';
import theme from '../../theme';
import * as Linking from 'expo-linking';

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 10
  }
});

const Item = ({item, button = false}) => {

  const handlePress = () => {
    Linking.openURL(item.url);
  }


  return ( 
    <View testID='repositoryItem' style={styles.card}>
      <RepositoryHeader imageUrl={item.ownerAvatarUrl} name={item.fullName} description={item.description} language={item.language}/>
      <Ratings item={item}/>
      {
        button && 
        <Pressable style={styles.button} onPress={handlePress} >
          <Text color="white">Open in GitHub</Text>
        </Pressable>
      }
  </View>
  )
};


export default Item;