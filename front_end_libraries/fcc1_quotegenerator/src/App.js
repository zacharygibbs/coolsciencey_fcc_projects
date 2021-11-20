import React from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {Helmet} from "react-helmet";





// Redux:
const ADD = 'ADD';

const QUOTES = [
                {quote: 'Be yourself; everyone else is already taken.', author: 'Oscar Wilde'},
                {quote: 'I\'m selfish, impatient and a little insecure. I make mistakes, I am out of control and at times hard to handle. But if you can\'t handle me at my worst, then you sure as hell don\'t deserve me at my best.', author: 'Marilyn Monroe'},
                {quote: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', author: 'Albert Einstein'},
                {quote: 'So many books, so little time.', author: 'Frank Zappa'},
                {quote: 'You\'ve gotta dance like there\'s nobody watching, Love like you\'ll never be hurt, Sing like there\'s nobody listening, And live like it\'s heaven on earth.', author: 'William W. Purkey'},
                {quote: 'You know you\'re in love when you can\'t fall asleep because reality is finally better than your dreams.', author: 'Dr. Seuss'},
                {quote: 'You only live once, but if you do it right, once is enough.', author: 'Mae West'},
                {quote: 'Be the change that you wish to see in the world.', author: 'Mahatma Ghandi'},
                {quote: 'In three words I can sum up everything I\'ve learned about life: it goes on.', author: 'Robert Frost'},
                {quote: 'If you want to know what a man\'s like, take a good look at how he treats his inferiors, not his equals.', author: 'J.K. Rowling'},
                {quote: 'Don’t walk in front of me… I may not follow. Don\'t walk behind me… I may not lead. Walk beside me… just be my friend', author: 'Albert Camus'},
              ]

const incrementQuoteNum = () => {
  return {
    type: ADD,
  }
};

const quotenumReducer = (state = 0, action) => {
  switch (action.type) {
    case ADD:
      return state + 1;
    default:
      return state;
  }
};

const store = createStore(
  quotenumReducer,
  applyMiddleware(thunk)
);

class Presentational extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotenum: 0,
      quote: QUOTES[0]['quote'],
      author: QUOTES[0]['author']
    }
    this.submitNewQuote = this.submitNewQuote.bind(this);
  }

  submitNewQuote() {
    this.props.submitNewQuote();
    let new_quotenum = this.state.quotenum+1;
    if(this.state.quotenum+1 >= QUOTES.length){
      new_quotenum = 0
    }
    this.setState((state) => ({
      quotenum: (state['quotenum'] + 1) < QUOTES.length ? state['quotenum'] + 1 : 0,
      quote: (state['quotenum'] + 1) < QUOTES.length ? QUOTES[state['quotenum'] + 1]['quote'] : QUOTES[0]['quote'], 
      author: (state['quotenum'] + 1) < QUOTES.length ? QUOTES[state['quotenum'] + 1]['author'] : QUOTES[0]['author']
    }));
  }

  render() {
    return (
      <div className="application">
        <Helmet>
            {/*<script src="https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js"></script>*/}
            {/*<script>try{Typekit.load({ async: true })}catch(e){}</script>*/}
        </Helmet>
        

        <div>
          <h2>Quote Generator:</h2>
          {/*button onClick={this.submitMessage}>Submit</button>*/}
          <div id="quote-box">
            <button id="new-quote" onClick={this.submitNewQuote}>New Quote</button><br/>
            <a id="tweet-quote" href="http://twitter.com/intent/tweet">Tweet Quote</a>
            <div id="text">{this.state.quote}</div>
            <div id="author">author: {this.state.author}</div>
            <br/><br/>
            
          </div>
          <div id="quotenum">{this.state.quotenum}</div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {quotenum: state}
};

const mapDispatchToProps = (dispatch) => {
  return {
    submitNewQuote: () => {
      dispatch(incrementQuoteNum())
    }
  }
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class AppQuoteGenerator extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container/>
      </Provider>
    );
  }
};

export default AppQuoteGenerator;