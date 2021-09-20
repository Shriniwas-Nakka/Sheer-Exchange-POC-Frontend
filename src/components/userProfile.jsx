import React from "react";
import "./userProfile.css";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Post from "./post";

import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PhoneIcon from "@material-ui/icons/Phone";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import Box from "@material-ui/core/Box";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: {},
      users: [],
      posts: [],
      answers: [],
      value: 0,
    };
  }

  componentDidMount() {
    if (this.props.location.state) {
      axios
        .get(`http://localhost:5000/${this.props.location.state._id}/profile`, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          this.setState({
            userdata: response.data.data,
          });
        });
    } else {
      // this.setState({
      //   userdata: JSON.parse(sessionStorage.getItem("userdata")),
      // });
      axios
        .get(
          `http://localhost:5000/${
            JSON.parse(sessionStorage.getItem("userdata"))._id
          }/profile`,
          {
            headers: {
              token: JSON.parse(sessionStorage.getItem("userdata")).token,
            },
          }
        )
        .then((response) => {
          console.log(response.data.data);
          this.setState({
            userdata: response.data.data,
          });
        });
    }
    this.getAll();
  }

  listOfFollowerAndFollowings = (e, action, userId) => {
    e.preventDefault();
    this.setState({ users: [] });
    this.setState({
      value: (action === "followers" && 1) || (action === "following" && 2),
    });

    axios
      .get(`http://localhost:5000/${userId}/${action}/list`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ users: response.data.data });
      });
  };

  getAll = async (value = "SELF") => {
    let posts = await this.getPosts(value);
    let postAnswers = await this.getPollAnswers();
    let array = posts.map((post) => {
      return {
        ...post,
        answered: postAnswers
          .map((answer) => post.question._id === answer.pollQuestionId)
          .some((element) => element),
      };
    });
    console.log("answered posts --->", array);
    // console.log("post answer", postAnswers);
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

  getPosts(value) {
    return axios
      .get(`http://localhost:5000/pollposts?key=${value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log("posts --->", response.data.data);
        return response.data.data;
      });
  }

  selectAction = (value) => {
    switch (value) {
      case 0:
        return { name: "Follow", color: "primary" };
      case 1:
        return { name: "Following", color: "default" };
      case 2:
        return { name: "Follow back", color: "primary" };
      default:
        return { name: "Follow", color: "primary" };
    }
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  followUnfollowAction = (e, action, userId) => {
    e.preventDefault();
    console.log(action, userId._id);

    let setAction =
      (action === 2 && "follow") ||
      (action === 0 && "follow") ||
      (action === 1 && "unfollow");

    console.log(setAction);

    return axios
      .post(`http://localhost:5000/${setAction}/${userId._id}`, null, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        return response.data.data;
      });
  };

  getTaggedPosts = (e, value) => {
    e.preventDefault();
    this.getAll(value);
  };

  render() {
    const {
      firstName,
      lastName,
      numberOfFollowers,
      numberOfFollowings,
      _id,
      action,
    } = this.state.userdata;
    return (
      <div className="profile-container">
        <div className="profile">
          <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
            <div className="box">
              <Avatar
                size="large"
                alt="Remy Sharp"
                src={JSON.parse(sessionStorage.getItem("userdata"))?.profileUrl}
              />
              <Typography variant="subtitle1">
                {firstName} {lastName}
              </Typography>
            </div>
            <div
              className="box"
              onClick={(e) =>
                this.listOfFollowerAndFollowings(e, "followers", _id)
              }
            >
              <Typography variant="subtitle1">{numberOfFollowers}</Typography>
              <Typography variant="subtitle1">Followers</Typography>
            </div>
            <div
              className="box"
              onClick={(e) =>
                this.listOfFollowerAndFollowings(e, "following", _id)
              }
            >
              <Typography variant="subtitle1">{numberOfFollowings}</Typography>
              <Typography variant="subtitle1">Followings</Typography>
            </div>
          </div>

          {JSON.parse(sessionStorage.getItem("userdata"))._id !== _id && (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                padding: "30px 0px",
              }}
            >
              <Button
                variant="contained"
                color={this.selectAction(action).color}
                style={{ marginLeft: "13%" }}
                onClick={(e) =>
                  this.followUnfollowAction(e, action, this.state.userdata)
                }
              >
                {this.selectAction(action).name}
              </Button>
            </div>
          )}
        </div>

        <Divider />

        <Paper square style={{ flexGrow: "1", maxWidth: "100%" }}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example"
            centered
          >
            <Tab
              icon={<ViewComfyIcon />}
              onClick={(e) => this.getTaggedPosts(e, "SELF")}
              aria-label="phone"
            />
            <Tab icon={<EmojiPeopleIcon />} aria-label="favorite" />
            <Tab icon={<DirectionsRunIcon />} aria-label="person" />
            <Tab
              icon={<AssignmentIndIcon />}
              onClick={(e) => this.getTaggedPosts(e, "TAGGED")}
              aria-label="person"
            />
          </Tabs>
          <TabPanel value={this.state.value} index={0}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 0px",
              }}
            >
              {this.state.posts.map((post, index) => (
                <Post
                  index={index}
                  post={post}
                  answers={this.state.answers}
                  getAll={this.getAll}
                />
              ))}
            </div>{" "}
          </TabPanel>
          <TabPanel value={this.state.value} index={1}>
            {this.state.users.map((user) => (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "20px 15%",
                  }}
                >
                  <Avatar alt="Remy Sharp" src={user.profileUrl} />
                  <Typography
                    variant="subtitle1"
                    style={{ margin: "6px 0px 0px 10px" }}
                  >
                    {user.firstName + " " + user.lastName}
                  </Typography>
                  {/* 0 -> Follow
                1 -> Following
                2 -> Follow back */}

                  <Button
                    variant="contained"
                    color={this.selectAction(user.action).color}
                    style={{ marginLeft: "15%" }}
                    onClick={(e) =>
                      this.followUnfollowAction(e, user.action, user)
                    }
                  >
                    {this.selectAction(user.action).name}
                  </Button>
                </div>
                <Divider />
              </>
            ))}
          </TabPanel>
          <TabPanel value={this.state.value} index={2}>
            {this.state.users.map((user) => (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "20px 15%",
                  }}
                >
                  <Avatar alt="Remy Sharp" src={user.profileUrl} />
                  <Typography
                    variant="subtitle1"
                    style={{ margin: "6px 0px 0px 10px" }}
                  >
                    {user.firstName + " " + user.lastName}
                  </Typography>
                  <Button
                    variant="contained"
                    color={this.selectAction(user.action).color}
                    style={{ marginLeft: "15%" }}
                    onClick={(e) =>
                      this.followUnfollowAction(e, user.action, user)
                    }
                  >
                    {this.selectAction(user.action).name}
                  </Button>
                </div>
                <Divider />
              </>
            ))}
          </TabPanel>
          <TabPanel value={this.state.value} index={3}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 0px",
              }}
            >
              {this.state.posts.map((post, index) => (
                <Post
                  index={index}
                  post={post}
                  answers={this.state.answers}
                  getAll={this.getAll}
                />
              ))}
            </div>{" "}
          </TabPanel>
        </Paper>
      </div>
    );
  }
}
