import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import "./viewposts.css";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Post from "./post";
import Tags from "./tags";
import Notification from "./notification";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      answers: [],
      reportData: [],
      report: [],
      comments: [],
      openReport: "",
      openComment: "",
      commentText: "",
    };
  }

  componentDidMount() {
    this.getAll("ALL");
  }

  filterAnswer = (value) => {
    return this.state.answers.find((answer) => {
      if (answer.pollOptionId === value) return true;
    });
  };

  getAll = async (key = "ALL", value = null) => {
    console.log(key);
    let posts = await this.getPosts(key, value);
    let postAnswers = await this.getPollAnswers();
    let array = posts.map((post) => {
      return {
        ...post,
        answered: postAnswers
          .map((answer) => post.question._id === answer.pollQuestionId)
          .some((element) => element),
      };
    });
    console.log(array);
    console.log(postAnswers);
    this.setState({ posts: array, answers: postAnswers });
  };

  getPollAnswers = () => {
    return axios
      .get("http://localhost:5000/pollpost/answers", {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        return response.data.data;
      });
  };

  getPosts(key, value = null) {
    console.log(key, value);
    return axios
      .get(`http://localhost:5000/pollposts?key=${key}&value=${value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        return response.data.data;
      });
  }

  vote = (e, pollId, vote) => {
    e.preventDefault();
    let data = {
      pollId: pollId,
      vote: vote,
    };
    console.log(data);
    axios
      .put("http://localhost:5000/pollpost/vote", data, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response);
        this.getAll("ALL");
      });
  };

  viewPost = (e, pollId) => {
    e.preventDefault();
    let data = {
      pollId: pollId,
    };
    console.log(data);
    axios
      .put("http://localhost:5000/pollpost/view", data, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response);
        this.getAll("ALL");
      });
  };

  answerPoll = (e, post, option) => {
    e.preventDefault();
    if (!post.answered) {
      let data = {
        pollId: post._id,
        pollQuestionId: post.question._id,
        pollOptionId: option,
      };
      axios
        .post("http://localhost:5000/pollpost/answer", data, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          console.log(response);
          this.getAll("ALL");
        });
    }
  };

  report = (e, post) => {
    e.preventDefault();

    if (this.state.openReport !== post) {
      this.setState({ openReport: post });
      this.setState({ openComment: "" });

      axios
        .get(`http://localhost:5000/pollpost/${post}/report`, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          // console.log("-->", response.data.data);
          this.setState({ report: response.data.data });
          this.setState({
            reportData: response.data.data.data.map((element) => {
              return {
                y: element.percentage.toFixed(2),
                label: element.option,
              };
            }),
          });
        });
    } else {
      this.setState({ openReport: "" });
    }
  };

  createPost = () => {
    if (JSON.parse(sessionStorage.getItem("userdata")).role === "user")
      this.props.history.push("/dashboard");
  };

  userProfile = () => {
    this.props.history.push("/userprofile");
  };

  handleComment = (e, post) => {
    e.preventDefault();
    if (this.state.openComment !== post) {
      this.setState({ openReport: "" });
      this.setState({ openComment: post });

      axios
        .get(`http://localhost:5000/pollpost/comments/${post}`, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          this.setState({ comments: response.data.data });
        });
    } else {
      this.setState({ openComment: "" });
    }
  };

  handleCommentText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  send = (e, post) => {
    e.preventDefault();
    console.log(this.state.commentText, post);
    let data = {
      pollId: post,
      text: this.state.commentText,
    };
    axios
      .post(`http://localhost:5000/pollpost/comment`, data, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response);
        this.handleComment(e, post);
        this.getAll("ALL");
        this.setState({ commentText: "" });
      });
  };

  setLikeDislikes = (votes, selector) => {
    if (votes.length > 0) {
      if (selector === "like") {
        if (votes[0].vote === true) return "primary";
        return "default";
      }
      if (selector === "dislike") {
        if (votes[0].vote === false) return "primary";
        return "default";
      }
    } else {
      return "default";
    }
  };

  edit = (e, value) => {
    e.preventDefault();
    console.log(value);
    let count =
      value.likes + value.dislikes + value.comments + value.totalNumberOfVotes;
    console.log(count);
    if (count <= 0)
      this.props.history.push({ pathname: "/dashboard", state: value });
  };

  searchUserProfile = () => {
    this.props.history.push({ pathname: "/search" });
  };

  handleCountry = (event) => {
    console.log(event.target.value);
    event.target.value === "default"
      ? this.getAll("ALL")
      : this.getAll("COUNTRY", event.target.value);
  };

  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light1", // "light1", "dark1", "dark2"
      title: {
        text: "",
      },
      data: [
        {
          type: "pie",
          indexLabel: "{label}: {y}%",
          startAngle: -90,
          dataPoints: this.state.reportData,
        },
      ],
    };
    return (
      <div className="container">
        <div className="nav">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginLeft: "15%",
              cursor: "pointer",
            }}
            onClick={this.userProfile}
          >
            <Avatar
              alt="Remy Sharp"
              src={JSON.parse(sessionStorage.getItem("userdata"))?.profileUrl}
            />
            <Typography
              variant="subtitle1"
              style={{ margin: "6px 0px 0px 10px" }}
            >
              {JSON.parse(sessionStorage.getItem("userdata")).firstName +
                " " +
                JSON.parse(sessionStorage.getItem("userdata")).lastName}
            </Typography>
            <Typography
              variant="subtitle1"
              style={{
                margin: "6px 0px 0px 10px",
                textTransform: "capitalize",
                color: "grey",
              }}
            >
              ( {JSON.parse(sessionStorage.getItem("userdata")).role} )
            </Typography>
          </div>
          <div>
            <FormControl variant="outlined">
              <InputLabel htmlFor="outlined-age-native-simple">
                Country
              </InputLabel>
              <Select
                native
                // value={state.age}
                onChange={this.handleCountry}
                label="Country"
                // inputProps={{
                //   name: "age",
                //   id: "outlined-age-native-simple",
                // }}
              >
                {/* <option aria-label="None" value="default" /> */}
                <option value={"default"}>Default</option>
                <option value={"india"}>India</option>
                <option value={"america"}>America</option>
                <option value={"japan"}>Japan</option>
              </Select>
            </FormControl>
          </div>
          <Notification />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "15%",
            }}
          >
            <IconButton
              style={{ marginRight: "20px" }}
              aria-label="delete"
              onClick={this.searchUserProfile}
            >
              <SearchIcon />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.createPost}
            >
              Create Post
            </Button>
          </div>
        </div>
        <Tags />
        {this.state.posts.length > 0 &&
          this.state.posts.map((post, index) => (
            <Post
              index={index}
              post={post}
              answers={this.state.answers}
              getAll={this.getAll}
            />
          ))}
      </div>
    );
  }
}
