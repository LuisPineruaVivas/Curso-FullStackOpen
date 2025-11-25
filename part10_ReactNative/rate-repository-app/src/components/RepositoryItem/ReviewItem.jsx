import { View, StyleSheet, Pressable, Alert } from "react-native";
import Text from "../Text";
import theme from "../../theme";
import { format } from "date-fns";
import { useNavigate } from "react-router-native";
import { useMutation } from "@apollo/client/react";
import { DELETE_REVIEW } from "../../graphql/mutations";


const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginHorizontal: 10
    },
    info: {
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    rating: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        borderWidth: 2,
        borderColor: theme.colors.primary
    },
    buttons: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
        justifyContent: "center"
    },
    viewButton: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: "center"
    },
    deleteButton: {
        backgroundColor: theme.colors.error,
        padding: 15,
        borderRadius: 5,
        flex: 1,
        alignItems: "center"
    }
});

const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy.MM.dd");
  };


const ReviewItem = ({ id, repositoryId, rating, title, text, createdAt, buttons = false, refetch = () => {} }) => {
    const navigate = useNavigate();
    const [ mutate ] = useMutation(DELETE_REVIEW);

    const goToRepository = ({ id}) => {
      navigate(`/repository/${repositoryId}`);
    };


    const handleDeleteReview = ({id}) => {
      Alert.alert(
        "Delete Review",
        "Are you sure you want to delete this review?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => deleteReview() }
        ]
      );
    }

    const deleteReview = async () => {
      try {
        await mutate({ variables: { id } });
        refetch();
      } catch (error) {
        console.log(error);
      }
    };

  return(
    <View style={styles.container}>
        <View style={styles.info}>
            <View style={styles.rating} >
                <Text 
                fontWeight={"bold"} 
                color={theme.colors.primary} 
                >{rating}
                </Text>
            </View>
            <View style={{flex: 1}}>
                <Text fontWeight={"bold"} fontSize={"subheading"}>{title}</Text>
                <Text fontSize={"body"} color="textSecondary" >{formatDate(createdAt)}</Text>
                <Text>{text}</Text>
            </View>
        </View>
        {buttons && 
            <View style={styles.buttons}>
                <Pressable onPress={() => goToRepository({id})} style={styles.viewButton}><Text style={{color:"white"}}>View Repository</Text></Pressable>
                <Pressable onPress={() => handleDeleteReview({id})} style={styles.deleteButton}><Text style={{color:"white"}}>Delete Review</Text></Pressable>
            </View>
            }
    </View>
  )
};

export default ReviewItem