import { FlatList, View, StyleSheet, Pressable, TextInput } from 'react-native';
import RepositoryItem from './RepositoryItem/RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import { useNavigate } from 'react-router-native';
import { useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  searchBar:{
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'white', 
  }
});

const RepositoryListHeader = ({orderBy, setOrderBy, orderDirection, setOrderDirection, searchKeyword, handleSearchChange }) => {
  const [localSearch, setLocalSearch] = React.useState(searchKeyword);

  React.useEffect(() => {
    setLocalSearch(searchKeyword);
  }, [searchKeyword]);

  const onChange = (val) => {
    setLocalSearch(val);
    handleSearchChange(val);
  };

  return (
    <View>
      <TextInput style={styles.searchBar} placeholder="Search..." onChangeText={onChange} value={localSearch} />
      <Picker
          selectedValue={`${orderBy}|${orderDirection}`}
          onValueChange={(itemValue) => {
            const [by, dir] = String(itemValue).split('|');
            setOrderBy(by);
            setOrderDirection(dir || 'DESC');
          }}
        >
          <Picker.Item label="Select an item..." style={{ color: 'gray' }} value={null} enabled={false} />
          <Picker.Item label="Latest repositories" style={{ color: 'black' }} value="CREATED_AT|DESC" />
          <Picker.Item label="Highest rated repositories" style={{ color: 'black' }}  value="RATING_AVERAGE|DESC" />
          <Picker.Item label="Lowest rated repositories" style={{ color: 'black' }}  value="RATING_AVERAGE|ASC" />
        </Picker>
    </View>
  );

}

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { orderBy, setOrderBy, orderDirection, setOrderDirection, searchKeyword, handleSearchChange } = this.props;
    return (
      <RepositoryListHeader 
        orderBy={orderBy} 
        setOrderBy={setOrderBy} 
        orderDirection={orderDirection} 
        setOrderDirection={setOrderDirection}
        searchKeyword={searchKeyword}
        handleSearchChange={handleSearchChange}
        />
    );
  };

  render() {
    const { repositories, navigate, onEndReach } = this.props;
    const goToRepository = ({ id}) => {
      navigate(`/repository/${id}`);
    };

    const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

    return (
      <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={<View style={styles.separator} />}
      renderItem={({ item }) => {
        return (
          <Pressable onPress={() => goToRepository(item)}>
            <RepositoryItem item={item} />
          </Pressable>
        )}
      }
      ListHeaderComponent={this.renderHeader} 
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
    );
  }
}


const RepositoryList = () => {
  const [orderBy, setOrderBy] = useState('CREATED_AT');
  const [orderDirection, setOrderDirection] = useState('DESC');
  const [searchKeyword, setSearchKeyword] = useState('');
  const { repositories, fetchMore } = useRepositories({
    orderBy,orderDirection, searchKeyword, first: 5
  });
  const navigate = useNavigate();

  const debouncedSet = useDebouncedCallback((val) => {
    setSearchKeyword(val);
  }, 500);

  const handleSearchChange = (val) => {
    debouncedSet(val);
  };

   const onEndReach = () => {
    fetchMore();
  };

    return <RepositoryListContainer 
      repositories={repositories} 
      orderBy={orderBy} 
      setOrderBy={setOrderBy} 
      orderDirection={orderDirection} 
      setOrderDirection={setOrderDirection} 
      searchKeyword={searchKeyword}
      handleSearchChange={handleSearchChange}
      navigate={navigate} 
      onEndReach={onEndReach}
      />
};

export default RepositoryList;