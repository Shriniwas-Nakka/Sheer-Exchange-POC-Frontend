import React from "react";
import "./dashboard.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import axios from "axios";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Create Poll Post",
      buttonText: "Create",
      pollId: "",
      questionId: "",
      subject: "",
      description: "",
      question: "",
      options: [
        { placeholder: "Option 1", text: "" },
        { placeholder: "Option 2", text: "" },
      ],
      updateMode: false,
    };
  }

  componentDidMount() {
    console.log(this.props.location.state);
    let data = this.props.location.state;
    if (data) {
      this.setState({
        title: "Update Poll Post",
        buttonText: "Update",
        pollId: data._id,
        subject: data.subject,
        description: data.description,
        questionId: data.question._id,
        question: data.question.question,
        options: data.question.options.map((option, index) => {
          return {
            ...option,
            placeholder: `Option ${index + 1}`,
            text: option.option,
          };
        }),
        updateMode: true,
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
    if (this.state.updateMode) {
      let data = {
        pollId: this.state.pollId,
        subject: this.state.subject,
        description: this.state.description,
        questionId: this.state.questionId,
        pollQuestion: this.state.question,
        location: "america",
      };
      axios
        .put("http://localhost:5000/pollpost", data, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          this.props.history.push("/dashboard/posts");
        });
    } else {
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
    }
  };

  render() {
    return (
      <div className="container">
        <div className="form">
          <h1>{this.state.title}</h1>
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
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <TextField
                    key={index}
                    id="outlined-basic"
                    // label={option.text}
                    value={option.text}
                    variant="outlined"
                    placeholder={option.placeholder}
                    onChange={(e) => this.handleOptionText(e, index)}
                    className="mb"
                    fullWidth
                  />
                  <IconButton aria-label="delete">
                    <HighlightOffIcon />
                  </IconButton>
                </div>
              ))}
            </div>
            <IconButton aria-label="delete" onClick={this.handleOptions}>
              <AddIcon />
            </IconButton>
          </div>

          <Button variant="contained" color="secondary" onClick={this.post}>
            {this.state.buttonText}
          </Button>
          <a href="/dashboard/posts" style={{ marginTop: "25px" }}>
            Take me to home
          </a>
        </div>
      </div>
    );
  }
}
