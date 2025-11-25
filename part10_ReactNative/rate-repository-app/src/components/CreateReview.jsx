import { View, StyleSheet, TextInput, Pressable } from 'react-native'
import Text from './Text'
import { useFormik } from 'formik'
import * as yup from 'yup'
import theme from '../theme'
import { useMutation } from '@apollo/client/react'
import { CREATE_REVIEW } from '../graphql/mutations'
import { useNavigate } from 'react-router-native'

const validationSchema = yup.object().shape({
    ownerName: yup
      .string()
      .required('Owner username is required'),
    repositoryName: yup
      .string()
      .required('Repository name is required'),
    rating: yup
      .number()
      .typeError('Rating must be a number')
      .integer('Rating must be an integer')
      .required('Rating is required')
      .min(0)
      .max(100),
    text: yup
      .string()
      .optional(),
});

 const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    borderRadius: 5,
    paddingHorizontal: 20
  },
  button: {
    height: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  }
 });

const CreateReview = () => {
    const navigate = useNavigate();
    const [mutate, result] = useMutation(CREATE_REVIEW);
    const formik = useFormik({
      initialValues: {
        ownerName: '',
        repositoryName: '',
        rating: '',
        text: '',
      },
      validationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: values => {
        createReview();
      },
    })

    const handleChangeAndClear = (field) => (value) => {
      formik.setFieldValue(field, value);
      if (formik.errors && formik.errors[field]) {
        formik.setFieldError(field, undefined);
      }
    };

    const createReview = async () => {
      const reviewInput = {
        ownerName: formik.values.ownerName,
        repositoryName: formik.values.repositoryName,
        rating: parseInt(formik.values.rating, 10),
        text: formik.values.text,
      };

      try {
        const { data } = await mutate({
          variables: {
            review: reviewInput,
          },
        });
        if (data.createReview) {
          formik.resetForm();
          navigate(`/repository/${data.createReview.repositoryId}`);

        }

      } catch (e) {
        alert(e.message);
      }
    };


  return (
    <View style={styles.container}>
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.ownerName ? 'red' : theme.colors.textSecondary}}
        placeholder="Repository owner username"
        value={formik.values.ownerName}
        onChangeText={handleChangeAndClear('ownerName')}
      />
      {formik.errors.ownerName &&  <Text color="error">{formik.errors.ownerName}</Text>}
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.repositoryName ? 'red' : theme.colors.textSecondary}}
        placeholder="Repository name"
        value={formik.values.repositoryName}
        onChangeText={handleChangeAndClear('repositoryName')}
      />
      {formik.errors.repositoryName && <Text color="error">{formik.errors.repositoryName}</Text>}
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.rating ? 'red' : theme.colors.textSecondary}}
        placeholder="Rating between 0 and 100"
        value={formik.values.rating}
        onChangeText={handleChangeAndClear('rating')}
        keyboardType="numeric"
      />
      {formik.errors.rating && <Text color="error">{formik.errors.rating}</Text>}
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.text ? 'red' : theme.colors.textSecondary}}
        placeholder="Review"
        value={formik.values.text}
        onChangeText={handleChangeAndClear('text')}
        multiline
      />
      {formik.errors.text && <Text color="error">{formik.errors.text}</Text>}
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text color="white">Create a review</Text>
      </Pressable>

    </View>
  )
}
export default CreateReview