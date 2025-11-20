import { View , StyleSheet} from 'react-native'
import Text from '../Text'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 5,
        flex: 1
    }
})

const formatValue = (value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value

const RatingItem = ({item, value}) => {
  return (
     <View style={styles.container}>
        <Text fontWeight={"bold"} >{formatValue(value)}</Text>
        <Text fontSize="body" color="textSecondary">{item} </Text>
    </View>
  )
}

export default RatingItem