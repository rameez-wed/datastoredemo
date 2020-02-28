/**
 * React Native DataStore Sample App
 */

import React, {Component} from 'react';
import {Text, AsyncStorage, StyleSheet, ScrollView} from 'react-native';
global.Buffer = global.Buffer || require('buffer').Buffer;
import Amplify from '@aws-amplify/core';
import {DataStore, Predicates} from '@aws-amplify/datastore';
import {Post, PostStatus, Comment} from './src/models';

import awsConfig from './aws-exports';
Amplify.configure(awsConfig);
let subscription;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
  }

  componentDidMount() {
    this.onQuery();
    subscription = DataStore.observe(Post).subscribe(msg => {
      console.log('SUBSCRIPTION_UPDATE', msg);
      this.onQuery();
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
      <ScrollView
        style={{paddingTop: 40, flex: 1}}
        contentContainerStyle={{alignItems: 'center'}}>
        <Text style={styles.text} onPress={this.getAsyncStorage}>
          Get Store
        </Text>
        <Text style={styles.text} onPress={this.onCreatePost}>
          Create One Post
        </Text>
        <Text style={styles.text} onPress={this.onCreatePostAndComments}>
          Create Post & Comments
        </Text>
        <Text style={styles.text} onPress={this.onQuery}>
          Query Posts
        </Text>
        <Text style={styles.text} onPress={this.onDelete}>
          Delete Posts
        </Text>
        {this.state.posts.map((post, i) => (
          <Text key={i}>{`${post.title} ${post.rating}`}</Text>
        ))}
      </ScrollView>
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
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;
