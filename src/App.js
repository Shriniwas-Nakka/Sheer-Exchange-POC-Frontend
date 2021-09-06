import "./App.css";
import Dashboard from "./components/dashboard";
import Posts from "./components/viewposts";
import SignIn from "./components/signIn";
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/posts" component={Posts} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
