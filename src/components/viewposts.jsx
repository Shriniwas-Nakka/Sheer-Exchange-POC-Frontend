import React from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import "./viewposts.css";
import AssessmentIcon from "@material-ui/icons/Assessment";
import CanvasJSReact from "../assests/canvasjs.react";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import Post from "./post";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
    this.getAll();
  }

  filterAnswer = (value) => {
    return this.state.answers.find((answer) => {
      if (answer.pollOptionId === value) return true;
    });
  };

  getAll = async () => {
    let posts = await this.getPosts();
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

  getPosts() {
    return axios
      .get("http://localhost:5000/pollposts", {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
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
        this.getAll();
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
        this.getAll();
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
          this.getAll();
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
        this.getAll();
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
        {this.state.posts.map((post, index) => (
          <Post
            index={index}
            post={post}
            answers={this.state.answers}
            getAll={this.getAll}
          />
          // <div className="main" key={index}>
          //   <div className="nameplate">
          //     <div
          //       style={{
          //         display: "flex",
          //         justifyContent: "space-between",
          //         alignItems: "center",
          //       }}
          //     >
          //       <Avatar alt="Remy Sharp" src={post.createdBy.profileUrl} />
          //       <Typography
          //         variant="subtitle1"
          //         style={{ margin: "6px 0px 0px 10px" }}
          //       >
          //         {post.createdBy.firstName + " " + post.createdBy.lastName}
          //       </Typography>
          //     </div>
          //     {JSON.parse(sessionStorage.getItem("userdata"))._id ===
          //     post.createdBy._id.toString() ? (
          //       <IconButton
          //         aria-label="delete"
          //         onClick={(e) => this.edit(e, post)}
          //       >
          //         <EditIcon />
          //       </IconButton>
          //     ) : (
          //       ""
          //     )}
          //   </div>
          //   <Typography variant="h6" gutterBottom>
          //     {post.subject}
          //   </Typography>
          //   <Typography variant="body2" align="left" gutterBottom>
          //     {post.description}
          //   </Typography>
          //   <Typography variant="body1" gutterBottom>
          //     {post.question.question}
          //   </Typography>
          //   {post.question.options.map((option, index) => (
          //     <>
          //       {!post.answered ? (
          //         <Button
          //           className="m"
          //           key={index}
          //           variant="contained"
          //           // color="secondary"
          //           // disabled={post.answered.flag}
          //           color={
          //             this.filterAnswer(option._id) ? "secondary" : "default"
          //           }
          //           onClick={(e) => this.answerPoll(e, post, option._id)}
          //         >
          //           {option.option}
          //         </Button>
          //       ) : (
          //         <div
          //           style={{
          //             margin: "12px 0",
          //             display: "flex",
          //             alignItems: "center",
          //             position: "relative",
          //             backgroundColor: "lightgrey",
          //             width: "100%",
          //             height: "50px",
          //             borderRadius: "25px",
          //           }}
          //         >
          //           <div
          //             className="bar"
          //             style={{
          //               width: `${option.percentage}%`,
          //               backgroundColor: this.filterAnswer(option._id)
          //                 ? "#F24A58"
          //                 : "#E0E0E0",
          //             }}
          //           ></div>
          //           <span
          //             style={{
          //               zIndex: "1",
          //               textAlign: "center",
          //               width: "100%",
          //               display: "flex",
          //               justifyContent: "space-around",
          //             }}
          //           >
          //             <Typography variant="subtitle1" align="left" gutterBottom>
          //               {option.option}
          //             </Typography>
          //             <Typography variant="subtitle1" align="left" gutterBottom>
          //               {option.percentage.toFixed(2)}%
          //             </Typography>
          //           </span>
          //         </div>
          //       )}
          //     </>
          //   ))}
          //   <div className="buttons">
          //     <IconButton
          //       aria-label="delete"
          //       color={this.setLikeDislikes(post.voters, "like")}
          //       onClick={(e) => this.vote(e, post._id, true)}
          //     >
          //       <ThumbUpAltIcon />
          //     </IconButton>
          //     {post.likes}
          //     <IconButton
          //       aria-label="delete"
          //       color={this.setLikeDislikes(post.voters, "dislike")}
          //       onClick={(e) => this.vote(e, post._id, false)}
          //     >
          //       <ThumbDownIcon />
          //     </IconButton>
          //     {post.dislikes}
          //     <IconButton
          //       aria-label="delete"
          //       onClick={(e) => this.viewPost(e, post._id)}
          //     >
          //       <VisibilityIcon />
          //     </IconButton>
          //     {post.views}
          //     <IconButton
          //       aria-label="delete"
          //       onClick={(e) => this.handleComment(e, post._id)}
          //     >
          //       <CommentIcon />
          //     </IconButton>
          //     {post.comments}
          //     <IconButton
          //       aria-label="delete"
          //       onClick={(e) => this.report(e, post._id)}
          //     >
          //       <AssessmentIcon />
          //     </IconButton>
          //   </div>
          //   {post._id === this.state.openComment && (
          //     <div style={{ width: "100%", marginTop: "20px" }}>
          //       <Typography variant="h6" align="left" gutterBottom>
          //         Comments
          //       </Typography>
          //       {this.state.comments.length > 0 && (
          //         <div
          //           style={{
          //             width: "100%",
          //             border: "1px solid lightgray",
          //             borderRadius: "5px",
          //             marginBottom: "20px",
          //             maxHeight: "400px",
          //             overflowY: "scroll",
          //           }}
          //         >
          //           {this.state.comments.map((comment, index) => (
          //             <div
          //               key={index}
          //               style={{
          //                 margin: "10px",
          //                 backgroundColor: "lightgrey",
          //                 width: "70%",
          //                 padding: "10px",
          //                 borderRadius: "6px",
          //               }}
          //             >
          //               <div
          //                 style={{
          //                   display: "flex",
          //                   alignItems: "center",
          //                 }}
          //               >
          //                 <Avatar
          //                   alt="Remy Sharp"
          //                   src={comment.userId.profileUrl}
          //                 />
          //                 <Typography
          //                   variant="subtitle1"
          //                   style={{ margin: "6px 0px 0px 10px" }}
          //                 >
          //                   {comment.userId.firstName +
          //                     " " +
          //                     comment.userId.lastName}
          //                 </Typography>
          //               </div>
          //               <Typography
          //                 variant="subtitle2"
          //                 align="left"
          //                 style={{ margin: "0px 0px 0px 50px" }}
          //                 gutterBottom
          //               >
          //                 {comment.text}
          //               </Typography>
          //             </div>
          //           ))}
          //         </div>
          //       )}
          //       <div
          //         style={{
          //           display: "flex",
          //           alignItems: "flex-start",
          //         }}
          //       >
          //         <TextField
          //           id="outlined-basic"
          //           name="commentText"
          //           value={this.state.subject}
          //           label="Text"
          //           variant="outlined"
          //           onChange={this.handleCommentText}
          //           className="mb"
          //           size="small"
          //           style={{ width: "100%" }}
          //         />
          //         <IconButton
          //           aria-label="delete"
          //           onClick={(e) => this.send(e, post._id)}
          //         >
          //           <SendIcon />
          //         </IconButton>
          //       </div>
          //     </div>
          //   )}
          //   {post._id === this.state.openReport && (
          //     <div style={{ width: "100%", marginTop: "20px" }}>
          //       <Typography variant="h6" align="left" gutterBottom>
          //         Poll Result
          //       </Typography>
          //       <Typography variant="body1" align="left" gutterBottom>
          //         Total Votes : {this.state.report.totalVotes}
          //       </Typography>
          //       <Typography variant="body1" align="left" gutterBottom>
          //         User : {this.state.report.totalNumberOfUsersVoted}
          //       </Typography>
          //       <Typography variant="body1" align="left" gutterBottom>
          //         Guest : {this.state.report.totalNumberOfGuestssVoted}
          //       </Typography>
          //       <CanvasJSChart options={options} />
          //     </div>
          //   )}
          // </div>
        ))}
      </div>
    );
  }
}
