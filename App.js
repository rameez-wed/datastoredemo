/**
 * React Native DataStore Sample App
 */

import React, {Component, useState} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ListItem,
  Icon,
  Header,
  Input,
  CheckBox,
  Button,
  Text,
  Divider,
} from 'react-native-elements';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

global.Buffer = global.Buffer || require('buffer').Buffer;
import Amplify from '@aws-amplify/core';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {Post, PostStatus, Comment, Quote, QuoteStatus} from './src/models';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import get from 'lodash/get';

import awsConfig from './aws-exports';
Amplify.configure(awsConfig);
let subscription;

function QuotesList(props) {
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{alignItems: 'center'}}>
      <Header
        centerComponent={{
          text: 'Quotes',
          style: {color: '#fff', fontSize: 24, paddingBottom: 10},
        }}
        rightComponent={{
          icon: 'add',
          color: '#fff',
          size: 35,
          iconStyle: {paddingBottom: 10},
          onPress: () => props.navigation.navigate('AddQuote'),
        }}
        containerStyle={{height: 64}}
      />

      {props.quotes.length > 0 ? (
        props.quotes.map((quote, i) => (
          <ListItem
            key={i}
            leftIcon={
              <Icon
                name={
                  quote.status === QuoteStatus.DRAFT
                    ? 'drafts'
                    : quote.status === QuoteStatus.FINALIZED
                    ? 'check'
                    : 'person'
                }
                type="material"
                size={30}
                color="#283593"
              />
            }
            rightIcon={
              <>
                <Icon
                  name="edit"
                  type="material"
                  color="#424242"
                  onPress={() =>
                    props.navigation.navigate('AddQuote', {quote: quote})
                  }
                  iconStyle={{paddingRight: 15}}
                />
                <Icon
                  name="delete"
                  type="material"
                  color="#424242"
                  onPress={() => props.onDeleteQuote(quote.id)}
                />
              </>
            }
            title={quote.quoteName}
            subtitle={quote.description}
            containerStyle={{width: '100%'}}
            bottomDivider
          />
        ))
      ) : (
        <View style={{marginTop: 50}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
}

function AddQuote(props) {
  const [quote, setQuote] = useState(
    get(props, 'route.params.quote', {
      expirationDate: moment()
        .seconds(0)
        .milliseconds(0),
    }),
  );
  return (
    <View>
      <Input
        label={'Quote Number'}
        value={quote.quoteNumber ? `${quote.quoteNumber}` : ''}
        onChangeText={text => setQuote({...quote, quoteNumber: text})}
        keyboardType="numeric"
      />
      <Input
        label="Quote Name"
        value={quote.quoteName}
        onChangeText={text => setQuote({...quote, quoteName: text})}
      />
      <Input
        label="Description"
        value={quote.description}
        onChangeText={text => setQuote({...quote, description: text})}
      />
      <Text
        style={{
          marginLeft: 10,
          fontWeight: 'bold',
          fontSize: 16,
          color: 'grey',
          marginTop: 10,
        }}>
        Expiration Date
      </Text>

      <Divider />
      <View style={{alignItems: 'center'}}>
        <DatePicker
          date={new Date(quote.expirationDate)}
          onDateChange={date => setQuote({...quote, expirationDate: date})}
          mode="date"
        />
      </View>
      <Divider style={{marginBottom: 10}} />

      <Input
        label="Customer PO Number"
        value={quote.customerPoNumber}
        onChangeText={text => setQuote({...quote, customerPoNumber: text})}
        keyboardType="numeric"
      />
      <CheckBox
        title="Draft"
        checked={quote.status === 'DRAFT'}
        onPress={() => setQuote({...quote, status: 'DRAFT'})}
      />
      <CheckBox
        title="Finalized"
        checked={quote.status === 'FINALIZED'}
        onPress={() => setQuote({...quote, status: 'FINALIZED'})}
      />
      <CheckBox
        title="Customer Reviewed"
        checked={quote.status === 'CUSTOMERREVIEWED'}
        onPress={() => setQuote({...quote, status: 'CUSTOMERREVIEWED'})}
      />
      <View style={{alignItems: 'center', marginTop: 20}}>
        <Button
          title="Save"
          containerStyle={{width: 100}}
          onPress={() => {
            if (get(props, 'route.params.quote', null)) {
              props.onEditQuote(quote);
            } else {
              props.onCreateQuote(quote);
            }
            props.navigation.navigate('QuotesList');
          }}
        />
      </View>
    </View>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      quotes: [],
    };
  }

  componentDidMount() {
    this.onQuery();
    this.onQuotesQuery();
    // subscription = DataStore.observe(Post).subscribe(msg => {
    //   console.log('SUBSCRIPTION_UPDATE', msg);
    //   this.onQuery();
    // });
    subscription = DataStore.observe(Quote).subscribe(msg => {
      console.log('SUBSCRIPTION_UPDATE', msg);
      this.onQuotesQuery();
    });
  }

  componentWillUnmount() {
    subscription.unsubscribe();
  }

  onCreatePost() {
    DataStore.save(
      new Post({
        title: `New Post ${Date.now()}`,
        rating: (function getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
        })(5, 10),
        status: PostStatus.ACTIVE,
      }),
    );
  }

  onCreateQuote(quote = {}) {
    DataStore.save(
      new Quote({
        quoteNumber:
          Number(quote.quoteNumber) || Math.floor(Math.random() * 10),
        quoteName: quote.quoteName || `Quote Name ${Date.now()}`,
        status: quote.status || QuoteStatus.DRAFT,
        expirationDate: quote.expirationDate.toString() || `${Date.now()}`,
        customerPoNumber:
          quote.customerPoNumber || `PO-${Math.random()}-${Date.now()}`,
        description: quote.description || `Quote Description - ${Date.now()}`,
      }),
    );
  }

  async onEditQuote(quote) {
    const original = await DataStore.query(Quote, quote.id);

    await DataStore.save(
      Quote.copyOf(original, updated => {
        updated.quoteNumber = quote.quoteNumber;
        updated.quoteName = quote.quoteName;
        updated.description = quote.description;
        updated.expirationDate = quote.expirationDate.toString();
        updated.customerPoNumber = quote.customerPoNumber;
        updated.status = quote.status;
      }),
    );
  }

  onDeleteQuote = async id => {
    const deletedQuote = await DataStore.delete(Quote, id);
    console.log('DELETE_QUOTE', deletedQuote);
  };

  onQuotesQuery = async () => {
    const quotes = await DataStore.query(Quote);
    console.log('QUERY_QUOTES_RESULT', quotes);
    // setTimeout(() => {
    //   this.setState({
    //     loading: false,
    //     quotes: quotes,
    //   });
    // }, 2500);
    this.setState({quotes});
  };

  async onCreatePostAndComments() {
    const post = new Post({
      title: `New Post with comments ${Date.now()}`,
      rating: 5,
      status: PostStatus.ACTIVE,
    });

    await DataStore.save(post);

    for (let i = 0; i < 2; i++) {
      DataStore.save(
        new Comment({
          content: `New comment ${Date.now()}`,
          post,
        }),
      );
    }
  }

  onQuery = async () => {
    const posts = await DataStore.query(Post, c => c.rating('gt', 2));
    console.log('QUERY_POSTS_RESULT', posts);
    const comments = await DataStore.query(Comment);
    this.setState({posts});
    console.log('QUERY_COMMENTS_RESULT', comments);
  };

  onDelete = async () => {
    const deletedPosts = await DataStore.delete(Post, Predicates.ALL);
    console.log('DELETE_RESULT', deletedPosts);
  };

  onQuotesDelete = async () => {
    const deletedQuotes = await DataStore.delete(Quote, Predicates.ALL);
    console.log('DELETE_RESULT', deletedQuotes);
  };

  getAsyncStorage = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const allDataStoreKeys = allKeys.filter(key =>
      key.startsWith('@AmplifyDatastore'),
    );
    const allItems = await AsyncStorage.multiGet(allDataStoreKeys);
    const records = allItems.map(([key, value]) => [key, JSON.parse(value)]);
    console.log('ALL_STORE_RECORDS', records);
  };

  render() {
    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="QuotesList">
            {props => (
              <QuotesList
                {...props}
                onDeleteQuote={this.onDeleteQuote}
                quotes={this.state.quotes}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddQuote">
            {props => (
              <AddQuote
                {...props}
                onEditQuote={this.onEditQuote}
                onCreateQuote={this.onCreateQuote}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
