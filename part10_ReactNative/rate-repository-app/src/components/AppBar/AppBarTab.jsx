import { Pressable } from 'react-native';
import Text from '../Text';
import { Link } from 'react-router-native';
const AppBarTab = ({title, path, onClick = () => {}}) => {
  return (
    <Link to={path} style={{padding: 16}} component={Pressable} onPress={onClick}>
        <Text fontSize="subheading" style={{color: "white"}}>{title}</Text>
    </Link>
  )
}

export default AppBarTab