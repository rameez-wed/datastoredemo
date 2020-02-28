/**
 * React Native DataStore Sample App
 */

import React, {Component} from 'react';
import {Button, AsyncStorage, StyleSheet, ScrollView} from 'react-native';
import {ListItem, Icon, Header} from 'react-native-elements';

global.Buffer = global.Buffer || require('buffer').Buffer;
import Amplify from '@aws-amplify/core';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {Post, PostStatus, Comment, Quote, QuoteStatus} from './src/models';
import {NavigationContainer} from '@react-navigation/native';

import awsConfig from './aws-exports';
Amplify.configure(awsConfig);
let subscription;

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

  onCreateQuote() {
    DataStore.save(
      new Quote({
        quoteNumber: Math.floor(Math.random() * 10),
        quoteName: `Quote Name ${Date.now()}`,
        status: QuoteStatus.DRAFT,
        expirationDate: `${Date.now()}`,
        customerPoNumber: `PO-${Math.random()}-${Date.now()}`,
        description: `Quote Description - ${Date.now()}`,
      }),
    );
  }

  onQuotesQuery = async () => {
    const quotes = await DataStore.query(Quote);
    console.log('QUERY_QUOTES_RESULT', quotes);
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
    return (
      // <View>
      <NavigationContainer>
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
              onPress: this.onCreateQuote,
            }}
            containerStyle={{height: 64}}
          />
          {/* <Button title="Add Quote" onPress={this.onCreateQuote} />
        <Button title="Query Quotes" onPress={this.onQuotesQuery} />
        <Button title="Delete All Quotes" onPress={this.onQuotesDelete} /> */}
          {/*
        <Text style={styles.text} onPress={this.onQuotesQuery}>
          Query Quotes
        </Text>
        <Text style={styles.text} onPress={this.onQuotesDelete}>
          Delete Quotes
        </Text> */}
          {/* <Text style={styles.text} onPress={this.getAsyncStorage}>
          Get Store
        </Text>
        <Text style={styles.text} onPress={this.onCreatePost}>
          Create One Post
        </Text> */}
          {/* <Text style={styles.text} onPress={this.onCreatePostAndComments}>
          Create Post & Comments
        </Text> */}
          {/* <Text style={styles.text} onPress={this.onQuery}>
          Query Posts
        </Text>
        <Text style={styles.text} onPress={this.onDelete}>
          Delete Posts
        </Text> */}

          {/* {this.state.quotes.map((quote, i) => (
          <Text key={i}>{`${quote.quoteName} ${quote.description}`}</Text>
        ))} */}
          {this.state.quotes.map((quote, i) => (
            <ListItem
              key={i}
              leftIcon={
                <Icon name="drafts" type="material" size={30} color="#f50" />
              }
              title={quote.quoteName}
              subtitle={quote.description}
              containerStyle={{width: '100%'}}
              bottomDivider
            />
          ))}
        </ScrollView>
      </NavigationContainer>
      // </View>
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
