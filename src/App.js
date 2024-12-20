/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 1234567.89,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Add Credit
  addCredit = (newCredit) => {
    this.setState((prevState) => {
      const updatedCredits = [...prevState.credits, newCredit];
      const updatedBalance = prevState.accountBalance + newCredit.amount;

      return { credits: updatedCredits, accountBalance: updatedBalance };
    });
  };

  // Add Debit
  addDebit = (newDebit) => {
    this.setState((prevState) => {
      const updatedDebits = [...prevState.debits, newDebit];
      const updatedBalance = prevState.accountBalance - newDebit.amount;

      return { debits: updatedDebits, accountBalance: updatedBalance };
    });
  };

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Fetch data on component mount
  componentDidMount() {
    Promise.all([
      fetch('https://johnnylaicode.github.io/api/credits.json').then((res) => res.json()),
      fetch('https://johnnylaicode.github.io/api/debits.json').then((res) => res.json()),
    ])
      .then(([credits, debits]) => {
        const totalCredits = credits.reduce((acc, credit) => acc + credit.amount, 0);
        const totalDebits = debits.reduce((acc, debit) => acc + debit.amount, 0);
        const accountBalance = totalCredits - totalDebits;

        this.setState({ credits, debits, accountBalance });
      })
      .catch((error) => console.error('Error fetching data:', error));
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList}  addCredit={this.addCredit} />) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} />) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      // <Router basename="/bank-of-react-starter-code">
      <Router basename="/my-react-app">
        <div>
          <Route exact path="/" render={HomeComponent} />
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;