import React from "react";
import "./userProfile.css";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import Button from "@material-ui/core/Button";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: {},
      users: [],
    };
  }

  componentDidMount() {
    // console.log(this.props.location.state);
    // console.log("--", JSON.parse(sessionStorage.getItem("userdata")));
    if (this.props.location.state) {
      //   this.setState({
      //     userdata: this.props.location.state,
      //   });
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
      this.setState({
        userdata: JSON.parse(sessionStorage.getItem("userdata")),
      });
    }
  }

  listOfFollowerAndFollowings = (e, action, userId) => {
    e.preventDefault();
    // console.log(action, userId);
    // console.log(JSON.parse(sessionStorage.getItem("userdata")));
    this.setState({ users: [] });
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
              >
                {this.selectAction(action).name}
              </Button>
            </div>
          )}
        </div>

        <Divider />
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
              >
                {this.selectAction(user.action).name}
              </Button>
            </div>
            <Divider />
          </>
        ))}
      </div>
    );
  }
}
