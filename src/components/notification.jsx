import React, { useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import Badge from "@material-ui/core/Badge";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from "@material-ui/icons/Notifications";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PollIcon from "@mui/icons-material/Poll";
import CommentIcon from "@mui/icons-material/Comment";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function Notification() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [invisible, setInvisible] = React.useState(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    axios
      .get(`http://localhost:5000/notifications`, {
        headers: {
          token: JSON.parse(sessionStorage.getItem("userdata")).token,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setNotifications(response.data.data);
        setInvisible(
          response.data.data.length > 0
            ? response.data.data.some((i) => i.isViewed === true)
            : true
        );
      });
  };

  const readNotification = (e, value) => {
    e.preventDefault();
    !value.isViewed &&
      axios
        .put(`http://localhost:5000/view/${value._id}`, null, {
          headers: {
            token: JSON.parse(sessionStorage.getItem("userdata")).token,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          getNotifications();
        });
  };

  const getMessageQuote = (value) => {
    switch (value.notificationType) {
      case "MENTION":
        return `${value.from.firstName} 
        ${value.from.lastName} has mentioned you in his post !`;
      case "LIKE":
        return `${value.from.firstName} 
        ${value.from.lastName} has liked your post !`;
      case "VOTE":
        return `${value.from.firstName} 
        ${value.from.lastName} has voted on your poll post !`;
      case "COMMENT":
        return `${value.from.firstName} 
        ${value.from.lastName} has commented on your poll post !`;
      default:
        break;
    }
  };

  return (
    <div>
      <IconButton
        style={{ marginRight: "20px" }}
        aria-label="delete"
        onClick={handleClick}
      >
        <Badge color="secondary" variant="dot" invisible={invisible}>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 && (
          <StyledMenuItem
            style={{
              backgroundColor: "lightgrey",
            }}
          >
            <ListItemText primary={` No Notifications !`} />
          </StyledMenuItem>
        )}
        {notifications.map((notification) => (
          <StyledMenuItem
            style={{
              backgroundColor: notification.isViewed ? "lightgrey" : "grey",
            }}
            onClick={(e) => readNotification(e, notification)}
          >
            {!notification.isViewed && (
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText primary={getMessageQuote(notification)} />
            {notification.notificationType === "LIKE" && (
              <FavoriteIcon fontSize="small" style={{ marginLeft: "10px" }} />
            )}
            {notification.notificationType === "MENTION" && (
              <AssignmentIndIcon
                fontSize="small"
                style={{ marginLeft: "10px" }}
              />
            )}
            {notification.notificationType === "VOTE" && (
              <PollIcon fontSize="small" style={{ marginLeft: "10px" }} />
            )}
            {notification.notificationType === "COMMENT" && (
              <CommentIcon fontSize="small" style={{ marginLeft: "10px" }} />
            )}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </div>
  );
}
