import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from "@apollo/client/react";
import { ME } from '../../graphql/queries';
import { useApolloClient } from '@apollo/client/react';

import Constants from 'expo-constants';
import AppBarTab from './AppBarTab';
import theme from '../../theme';
import useAuthStorage from '../../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBar,
    flexDirection: 'row',
    flexShrink: 0,
  }
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const [ authenticated, setAuthenticated ] = useState(null);
  const { loading, error, data } = useQuery(ME);

  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (data && data.me !== null) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [data])

  const logOut = async () => {
    setAuthenticated(false);
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <AppBarTab title="Repositories" path="/" />
        {authenticated && <AppBarTab title={`Sign out ${data.me.username}`} onClick={logOut} />}
        {!authenticated && <AppBarTab title="Sign in" path="/SignIn" />}
      </ScrollView>
    </View>
  )
};

export default AppBar;