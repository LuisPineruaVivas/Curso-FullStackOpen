import { TextInput, Pressable, View, StyleSheet } from 'react-native';
import theme from '../theme';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Text from './Text';
import useSignIn from '../hooks/useSignIn';
import { useNavigate } from 'react-router-native';

 const validationSchema = yup.object().shape({
   username: yup
     .string()
     .required('Username is required'),
   password: yup
     .string()
     .required('Password is required'),
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

export const SignInForm = ({ onSubmit }) => {
  const formik = useFormik({
     initialValues: {
       username: '',
       password: '',
     },
     validationSchema,
     onSubmit: values => {
       onSubmit(values);
     },
   });

  return (
    <View style={styles.container}>
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.username ? 'red' : theme.colors.textSecondary}}
        placeholder="Username"
        value={formik.values.username}
        onChangeText={formik.handleChange('username')}
      />
      {formik.errors.username && <Text color="error">{formik.errors.username}</Text>}
      <TextInput secureTextEntry
        style={{...styles.input, borderColor: formik.errors.password ? 'red' : theme.colors.textSecondary}}
        placeholder="Password"
        value={formik.values.password}
        onChangeText={formik.handleChange('password')}
      />
      {formik.errors.password && <Text color="error">{formik.errors.password}</Text>}
      <Pressable style={styles.button} onPress={formik.handleSubmit}>
        <Text color="white" fontWeight="bold" fontSize="subheading" >Sign In</Text>
      </Pressable>
    </View>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async ({ username, password }) => {
    try {
      const data  = await signIn({ username, password });
      if (data.authenticate) {
        navigate('/');
      }
    } catch (e) {
      alert(e.message);
    }
  };

   return (
     <SignInForm onSubmit={onSubmit} />
   );
};

export default SignIn;