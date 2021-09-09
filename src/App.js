import "./App.css";
import Dashboard from "./components/dashboard";
import Posts from "./components/viewposts";
import SignIn from "./components/signIn";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HasComponent from "./components/hashTagCategorization";
import UserProfile from "./components/userProfile";
import SearchUserProfile from "./components/searchUserProfile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/posts" component={Posts} />
          <Route exact path="/hashtag" component={HasComponent} />
          <Route exact path="/userprofile" component={UserProfile} />
          <Route exact path="/search" component={SearchUserProfile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
