import React from "react";
import "./dashboard.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import axios from "axios";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subject: "",
      description: "",
      question: "",
      options: [
        { placeholder: "Option 1", text: "" },
        { placeholder: "Option 2", text: "" },
      ],
    };
  }

  componentDidMount() {
    console.log(this.props.location.state);
    let data = this.props.location.state;
    if (data) {
      this.setState({
        subject: data.subject,
        description: data.description,
        question: data.question.question,
        options: data.question.options.map((option, index) => {
          return { placeholder: `Option ${index + 1}`, text: option.option };
        }),
      });
    }
  }

  handleOptions = () => {
    if (this.state.options.length < 20 && this.state.options.length >= 2) {
      let newObj = {
        placeholder: `Option ${this.state.options.length + 1}`,
        text: "",
      };
      this.setState({ options: [...this.state.options, newObj] });
    }
  };

  handleTextChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOptionText = (e, key) => {
    let newArray = [...this.state.options];
    newArray[key].text = e.target.value;
    this.setState({
      options: newArray,
    });
  };

  post = () => {
    let data = {
      subject: this.state.subject,
      description: this.state.description,
      location: "america",
      pollQuestion: this.state.question,
      pollOptions: this.state.options.map((option) => option.text),
    };
    axios
      .post("http://localhost:5000/pollpost", data, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        this.setState({
          subject: "",
          description: "",
          question: "",
          options: [{ text: "" }, { text: "" }],
        });
        this.props.history.push("/dashboard/posts");
      });
  };

  render() {
    return (
      <div className="container">
        <div className="form">
          <h1>Create Poll Post</h1>
          <TextField
            id="outlined-basic"
            name="subject"
            value={this.state.subject}
            label="Subject"
            variant="outlined"
            onChange={this.handleTextChange}
            className="mb"
          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            name="description"
            value={this.state.description}
            onChange={this.handleTextChange}
            className="mb"
          />
          <TextField
            id="outlined-basic"
            name="question"
            value={this.state.question}
            label="Question"
            variant="outlined"
            onChange={this.handleTextChange}
            className="mb"
          />
          <div className="options">
            <div className="option">
              {this.state.options.map((option, index) => (
                <TextField
                  key={index}
                  id="outlined-basic"
                  // label={option.text}
                  value={option.text}
                  variant="outlined"
                  placeholder={option.placeholder}
                  onChange={(e) => this.handleOptionText(e, index)}
                  className="mb"
                />
              ))}
            </div>
            <IconButton aria-label="delete" onClick={this.handleOptions}>
              <AddIcon />
            </IconButton>
          </div>

          <Button variant="contained" color="secondary" onClick={this.post}>
            Post
          </Button>
          <a href="/dashboard/posts" style={{ marginTop: "25px" }}>
            Take me to home
          </a>
        </div>
      </div>
    );
  }
}
