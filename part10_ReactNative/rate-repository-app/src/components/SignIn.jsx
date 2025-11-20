 import { TextInput, Pressable, View, StyleSheet } from 'react-native';
 import theme from '../theme';
 import { useFormik } from 'formik';
 import * as yup from 'yup';
 import Text from './Text';

 const validationSchema = yup.object().shape({
   userName: yup
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

const SignIn = () => {
  const formik = useFormik({
     initialValues: {
       userName: '',
       password: '',
     },
     validationSchema,
     onSubmit: values => {
       alert(JSON.stringify(values, null, 2));
     },
   });
   return (
     <View style={styles.container}>
      <TextInput 
        error
        style={{...styles.input, borderColor: formik.errors.userName ? 'red' : theme.colors.textSecondary}}
        placeholder="Username"
        value={formik.values.userName}
        onChangeText={formik.handleChange('userName')}
      />
      {formik.errors.userName && <Text color="error">{formik.errors.userName}</Text>}
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

export default SignIn;