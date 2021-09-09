import React from "react";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import axios from "axios";

export default class HasComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashtag: "",
      category: "",
    };
  }

  handleHashtag = (e) => {
    if (this.state.category) this.setState({ category: "" });

    this.setState({ hashtag: e.target.value });
  };

  send = () => {
    this.setState({ hashtag: "" });

    axios
      .get(`http://localhost:5000/category?hashtag=${this.state.hashtag}`)
      .then((response) => {
        console.log(response);
        this.setState({ category: response.data });
      });
  };

  render() {
    return (
      <div
        style={{
          //   border: "1px solid",
          marginTop: "10%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <TextField
            id="outlined-basic"
            name="commentText"
            value={this.state.hashtag}
            label="Text"
            variant="outlined"
            onChange={this.handleHashtag}
            className="mb"
            size="small"
          />
          <IconButton aria-label="delete" onClick={this.send}>
            <SendIcon />
          </IconButton>
        </div>
        Category : {this.state.category}
      </div>
    );
  }
}
