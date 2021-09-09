import React from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

export default class SearchUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  handleSearch = (e) => {
    console.log(e.target.value);
    axios
      .get(`http://localhost:5000/users?value=${e.target.value}`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ users: response.data.data });
      });
  };

  openUserProfile = (e, value) => {
    e.preventDefault();
    this.props.history.push({ pathname: "/userprofile", state: value });
  };

  render() {
    return (
      <div className="profile-container">
        <div style={{ padding: "20px" }}>
          <TextField
            id="outlined-basic"
            name="commentText"
            //   value={this.state.subject}
            label="Search"
            variant="outlined"
            size="small"
            style={{ width: "100%" }}
            onChange={this.handleSearch}
          />
        </div>

        {this.state.users.map((user) => (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "20px 15%",
              }}
              onClick={(e) => this.openUserProfile(e, user)}
            >
              <Avatar alt="Remy Sharp" src={user.profileUrl} />
              <Typography
                variant="subtitle1"
                style={{ margin: "6px 0px 0px 10px" }}
              >
                {user.firstName + " " + user.lastName}
              </Typography>
            </div>
            <Divider />
          </>
        ))}
      </div>
    );
  }
}
