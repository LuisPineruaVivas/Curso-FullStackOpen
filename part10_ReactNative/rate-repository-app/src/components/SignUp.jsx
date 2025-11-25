import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import theme from '../theme';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Text from './Text';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';
import { CREATE_USER } from '../graphql/mutations';
import { useMutation } from '@apollo/client/react';

const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required('Username is required')
      .min(5, 'Username must be at least 5 characters long')
      .max(30, 'Username must be at most 30 characters long'),
    password: yup
      .string()
      .required('Password is required')
      .min(5, 'Password must be at least 5 characters long')
      .max(30, 'Password must be at most 30 characters long'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required'),
})

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

const SignUp = () => {
    const [mutate] = useMutation(CREATE_USER);
    const [signIn] = useSignIn();
    const navigate = useNavigate();

    const formik = useFormik({
      initialValues: {
        username: '',
        password: '',
        passwordConfirmation: '',
      },
      validationSchema,
      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: values => {
        createUser();
      },
    })

    const handleChangeAndClear = (field) => (value) => {
      formik.setFieldValue(field, value);
      if (formik.errors && formik.errors[field]) {
        formik.setFieldError(field, undefined);
      }
    };

    const createUser = async () => {
      const user = { username: formik.values.username, password: formik.values.password };
      try {
        const { data } = await mutate({ variables: { user } });
        if (data.createUser) {
          await signIn({ username: user.username, password: user.password });
          navigate('/');  
        }
      } catch (e) {
        alert(e.message);
      }
    }


  return (
    <View style={styles.container}>
        <TextInput 
          style={styles.input}
          placeholder="Username"
          value={formik.values.username}
          onChangeText={handleChangeAndClear('username')}
        />
        {formik.errors.username && <Text color="error">{formik.errors.username}</Text>}
        <TextInput secureTextEntry
          style={styles.input}
          placeholder="Password"
          value={formik.values.password}
          onChangeText={handleChangeAndClear('password')}
        />
        {formik.errors.password && <Text color="error">{formik.errors.password}</Text>}
        <TextInput secureTextEntry
          style={styles.input}
          placeholder="Password confirmation"
          value={formik.values.passwordConfirmation}
          onChangeText={handleChangeAndClear('passwordConfirmation')}
        />
        {formik.errors.passwordConfirmation && <Text color="error">{formik.errors.passwordConfirmation}</Text>}
        <Pressable style={styles.button} onPress={formik.handleSubmit}><Text color="white">Sign up</Text></Pressable>
    </View>
  )
}

export default SignUp