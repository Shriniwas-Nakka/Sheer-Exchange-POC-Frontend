import React from "react";
import "./dashboard.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      tags: [],
      taggedUsers: [],
      selectedTags: [],
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
    // console.log(this.props.location.state);
    let data = this.props.location.state;
    if (data) {
      this.setState({
        title: "Update Poll Post",
        buttonText: "Update",
        pollId: data._id,
        subject: data.subject,
        description: data.description,
        taggedUsers: data.taggedUsers,
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
    this.getUsers();
    this.getTags();
  }

  getUsers = (value = "") => {
    axios
      .get(`http://localhost:5000/users?value=${value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        // console.log(response.data.data);
        this.setState({ users: response.data.data });
      });
  };

  getTags = (value = "") => {
    axios
      .get(`http://localhost:5000/tags?value=${value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ tags: response.data.data });
      });
  };

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
        taggedUsers: this.state.taggedUsers,
        tags: this.state.selectedTags,
        questionId: this.state.questionId,
        pollQuestion: this.state.question,
        location: "america",
      };
      console.log(data);
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
        taggedUsers: this.state.taggedUsers,
        tags: this.state.selectedTags,
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

  getOption = (event, option) => {
    event.preventDefault();
    option.length > 0 &&
      this.setState({
        taggedUsers: option.map((user) => user._id),
      });
  };

  selectTag = (event, option) => {
    console.log(option);
    event.preventDefault();
    option.length > 0 &&
      this.setState({
        selectedTags: option.map((tag) => tag._id),
      });
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
          <Autocomplete
            className="mb"
            multiple
            id="tags-outlined"
            options={this.state.users}
            getOptionLabel={(option) => option.userName}
            onChange={this.getOption}
            // getOptionLabel={(option) => this.getOption(option)}
            // defaultValue={[top100Films[0]]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tag Users"
                placeholder="Select users to tag"
              />
            )}
          />
          <Autocomplete
            className="mb"
            multiple
            id="tags-outlined"
            options={this.state.tags}
            getOptionLabel={(option) => option.name}
            onChange={this.selectTag}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Tags"
                placeholder="Select tags"
              />
            )}
          />
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
