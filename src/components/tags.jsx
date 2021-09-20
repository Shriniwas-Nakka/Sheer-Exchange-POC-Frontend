import React, { Component } from "react";
import "./tags.css";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
    };
  }

  componentDidMount() {
    this.getTags();
  }

  getTags = (value = "") => {
    axios
      .get(`http://localhost:5000/tags?value=${value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        this.setState({ tags: response.data.data });
      });
  };

  handleCountry = (event) => {
    // console.log(event.target.value);
    event.target.value === "default"
      ? this.getTags()
      : this.getTags(event.target.value);
  };

  render() {
    return (
      <div className="tag-main">
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            style={{
              margin: "6px 20px 40px 14%",
              textTransform: "capitalize",
            }}
          >
            Trending Tags
          </Typography>
          <div>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-age-native-simple">
                Country
              </InputLabel>
              <Select native onChange={this.handleCountry} label="Country">
                <option value={"default"}>Default</option>
                <option value={"india"}>India</option>
                <option value={"america"}>America</option>
                <option value={"japan"}>Japan</option>
              </Select>
            </FormControl>
          </div>
        </div>
        <div
          style={{
            // width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            padding: "0px 1%",
          }}
        >
          {this.state.tags.map((tag, index) => (
            <div key={index} className="tag">
              <Typography
                variant="subtitle1"
              >
                {tag.name}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
