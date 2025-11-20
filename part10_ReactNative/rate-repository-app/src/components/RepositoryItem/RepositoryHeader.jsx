import {View, Image, StyleSheet} from 'react-native';
import Text from '../Text';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    padding: 10
  },
  tinyLogo: {
    width: 50,
    height: 50,
    borderRadius: 5
  },
  tag: {
    backgroundColor: theme.colors.primary,
    color: 'white',
    padding: 5,
    borderRadius: 5,
    fontSize: theme.fontSizes.subheading,
    alignSelf: 'flex-start'
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 10,
    paddingLeft: 10
  }

});


const RepositoryHeader = ({imageUrl, name, description, language}) => {
  return (
    <View style={styles.container}>
        <Image
        style={styles.tinyLogo}
        source={{uri: imageUrl}}
      />

      <View style={styles.info}>
        <Text fontSize="subheading" fontWeight="bold">{name}</Text>
        <Text fontSize="body" color="textSecondary">{description}</Text>
        <Text style={styles.tag} >{language}</Text>
      </View>

    </View>
  )
}

export default RepositoryHeader