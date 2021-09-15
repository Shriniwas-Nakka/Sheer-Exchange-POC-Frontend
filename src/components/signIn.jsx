import React from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Chart from "./chart";
import "./signIn.css";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "123456",
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((data) => {
      console.log(data);
      axios
        .get(
          // `http://maps.googleapis.com/maps/api/geocode/json?latlng=${data.coords.latitude},${data.coords.longitude}&sensor=false.`
          `https://api.opencagedata.com/geocode/v1/json?q=${data.coords.latitude}+${data.coords.longitude}&key=f9553ca7225745328988cc671bee371a`
        )
        .then((response) => {
          console.log(response);
        });
    });
  }

  handleTextChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submit = () => {
    axios
      .post("http://localhost:5000/user/signIn", this.state)
      .then((response) => {
        console.log(response);
        sessionStorage.setItem("userdata", JSON.stringify(response.data.data));
        this.props.history.push("/dashboard/posts");
      });
  };

  render() {
    return (
      <div className="container">
        <h2>Login</h2>
        <div className="login-container">
          <TextField
            id="outlined-basic"
            name="email"
            value={this.state.email}
            label="email"
            variant="outlined"
            onChange={this.handleTextChange}
            className="mb"
          />
          <TextField
            type="password"
            id="outlined-basic"
            label="password"
            variant="outlined"
            name="password"
            value={this.state.password}
            onChange={this.handleTextChange}
            className="mb"
          />

          <Button variant="contained" color="secondary" onClick={this.submit}>
            Submit
          </Button>
        </div>
        {/* <Chart /> */}
      </div>
    );
  }
}
