import { useRef, useState } from "react";
import * as actionTypes from "../../../../../store/actions/actionTypes";
import { useDispatch } from "react-redux";
// material-ui
import { useTheme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";
import CardContent from "@mui/material/CardContent";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// project import
import ProfileTab from "./ProfileTab";
import SettingTab from "./SettingTab";
import Avatar from "components/@extended/Avatar";
import MainCard from "components/MainCard";
import Transitions from "components/@extended/Transitions";

// assets
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import avatar1 from "assets/images/users/avatar-1.png";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  KeyOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { AuthApiService } from "services/api/AuthApiService";
import { useNavigate } from "react-router";
import userIcon from "../../../../../assets/images/icons/users2.svg";
import informationIcon from "../../../../../assets/images/icons/information.svg";
import logoutIcon from "../../../../../assets/images/icons/logout.svg";
import passwordIcon from "../../../../../assets/images/icons/password.svg";

import * as Yup from "yup";
import { Formik } from "formik";

import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import {
  LOGIN_PAGE,
  API_ERROR_MESSAGE,
  API_SUCCESS_MESSAGE,
} from "shared/constants";

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openModal, setOpenmodal] = useState(false);
  const [snackData, setSnackData] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const handleCloseModal = () => {
    setOpenmodal(false);
  };

  const handleListItemClick = (index, url) => {
    setSelectedIndex(index);
    if (url === "logout") {
      handleLogout();
    }
    if (url === "profileDetails") {
      navigate("/profileDetails");
    }
    if (url === "/changePassword") {
      setOpenmodal(true);
    }
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const iconBackColorOpen = "grey.100";

  const userdetails = JSON.parse(sessionStorage.getItem("userDetails"));
  const handleLogout = () => {
    let payload = {
      user_id: userdetails?.[0]?.user_id,
    };
    AuthApiService.logout(payload)
      .then((response) => {
        // On success, you can add any additional logic here

        setSnackData({
          show: true,
          message: API_SUCCESS_MESSAGE.LOGGED_OUT,
          type: "success",
        });

        sessionStorage.clear();
        localStorage.clear();

        navigate("/login");
      })
      .catch((errResponse) => {
        setSnackData({
          show: true,
          message: errResponse?.error?.message || "Internal server error",
          type: "error",
        });
      });
  };

  const handleSubmitForm = (values,{ setSubmitting }) => {
    let payload = {
      oldPassword: values.currentPassword,
      newPassword: values.password
    };

    console.log("payload",payload)
   
    AuthApiService.changePassword(payload)
      .then((response) => {

        console.log("response",response)

        if(response?.message === "Old password is incorrect")
        {
          setSnackData({
            show: true,
            message: response?.message || API_SUCCESS_MESSAGE.PASSWORD_RESET,
            type: "error",
          });
          setSubmitting(false);
        }
        else{
          setSnackData({
            show: true,
            message: response?.message || API_SUCCESS_MESSAGE.PASSWORD_RESET,
            type: "success",
          });
          setOpenmodal(false);
        }
        
      })
      .catch((errResponse) => {
        setSnackData({
          show: true,
          message:
            errResponse?.error?.message ||
            API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          type: "error",
        });
        setSubmitting(false); // This will reset isSubmitting in Formik
      });
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : "transparent",
          borderRadius: 1,
          "&:hover": { bgcolor: "secondary.lighter" },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ p: 0.5 }}
        >
          {userdetails?.[0]?.user_profile &&
          userdetails?.[0]?.user_profile !== "null" ? (
            <img
              src={userdetails?.[0]?.user_profile}
              alt={value.user_first_name}
              style={{ borderRadius: "50%", width: "32px", height: "32px" }}
            />
          ) : (
            <Avatar alt="profile user" src={avatar1} size="sm" />
          )}

          <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
            {userdetails?.[0]?.user_first_name}{" "}
            {userdetails?.[0]?.user_last_name}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions
            type="grow"
            position="top-right"
            in={open}
            {...TransitionProps}
          >
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: { xs: 250, md: 290 },
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item style={{ width: "80%" }}>
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          {userdetails?.[0]?.user_profile ? (
                            <img
                              src={userdetails?.[0]?.user_profile}
                              alt={value.user_first_name}
                              style={{
                                borderRadius: "50%",
                                width: "32px",
                                height: "32px",
                              }}
                            />
                          ) : (
                            <Avatar
                              alt="profile user"
                              src={avatar1}
                              sx={{ width: 32, height: 32 }}
                            />
                          )}
                          <Stack style={{ width: "80%" }}>
                            <Typography
                              variant="h6"
                              style={{ wordBreak: "break-word" }}
                            >
                              {" "}
                              {userdetails?.[0]?.user_first_name}{" "}
                              {userdetails?.[0]?.user_last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              style={{ wordBreak: "break-word" }}
                            >
                              {userdetails?.[0]?.user_email}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton
                            size="large"
                            sx={{ color: "text.primary" }}
                            onClick={(event) =>
                              handleListItemClick(3, "logout")
                            }
                          >
                            {/* <LogoutOutlined /> */}
                            <img src={logoutIcon} width="20px" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <List
                    component="nav"
                    sx={{ p: 0, "& .MuiListItemIcon-root": { minWidth: 32 } }}
                  >
                    <ListItemButton
                      selected={selectedIndex === 1}
                      onClick={(event) =>
                        handleListItemClick(1, "profileDetails")
                      }
                    >
                      <ListItemIcon>
                        {/* <UserOutlined /> */}
                        <img src={userIcon} width="20px" />
                      </ListItemIcon>
                      <ListItemText primary="View Profile" />
                    </ListItemButton>
                    <ListItemButton
                      selected={selectedIndex === 4}
                      onClick={(event) =>
                        handleListItemClick(4, "/changePassword")
                      }
                    >
                      <ListItemIcon>
                        <img src={passwordIcon} width="20px" />
                      </ListItemIcon>
                      <ListItemText primary="Change Password" />
                    </ListItemButton>

                    <ListItemButton
                      selected={selectedIndex === 2}
                      onClick={(event) => handleListItemClick(2, "/apps")}
                    >
                      <ListItemIcon>
                        {/* <QuestionCircleOutlined /> */}
                        <img src={informationIcon} width="20px" />
                      </ListItemIcon>
                      <ListItemText primary="Support" />
                    </ListItemButton>
                    <ListItemButton
                      selected={selectedIndex === 3}
                      onClick={(event) => handleListItemClick(3, "logout")}
                    >
                      <ListItemIcon>
                        {/* <LogoutOutlined /> */}
                        <img src={logoutIcon} width="20px" />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <Snackbar
        style={{ top: "80px",zIndex:1000000 }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackData.show}
        autoHideDuration={3000}
        onClose={() => setSnackData({ show: false })}
      >
        <Alert
          onClose={() => setSnackData({ show: false })}
          severity={snackData.type}
        >
          {snackData.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Password reset
        </DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              email: sessionStorage.getItem("email"),
              currentPassword:"",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={Yup.object().shape({
              currentPassword: Yup.string().required("Current password is required"),
              password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .matches(
                  /[A-Z]/,
                  "Password must contain at least one uppercase letter"
                )
                .matches(
                  /[a-z]/,
                  "Password must contain at least one lowercase letter"
                )
                .matches(/\d/, "Password must contain at least one number")
                .matches(
                  /[@$!%*?&]/,
                  "Password must contain at least one special character"
                )
                .required("Password is required"),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
            })}
            onSubmit={handleSubmitForm} // Using Formik's onSubmit directly
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>

                <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="old-password">
                        {LOGIN_PAGE.CURRENT_PASSWORD}
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="old-password"
                        type={showPassword ? "text" : "password"}
                        value={values.currentPassword}
                        name="currentPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your current password"
                      />
                    </Stack>
                    {touched.currentPassword && errors.currentPassword && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-currentPassword-reset"
                      >
                        {errors.currentPassword}
                      </FormHelperText>
                    )}
                    
                  </Grid>

                  {/* Password Field */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-reset">
                        {LOGIN_PAGE.NEW_PASSWORD}
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="password-reset"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your new password"
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-password-reset"
                      >
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Confirm Password Field */}
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="confirm-password-reset">
                        {LOGIN_PAGE.CONFIRM_PASSWORD}
                      </InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(
                          touched.confirmPassword && errors.confirmPassword
                        )}
                        id="confirm-password-reset"
                        type={showPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Re-enter your new password"
                      />
                    </Stack>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <FormHelperText
                        error
                        id="standard-weight-helper-text-confirm-password-reset"
                      >
                        {errors.confirmPassword}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Submit Button */}
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      size="large"
                      onClick={handleCloseModal}
                      variant="outlined"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Grid>

                  <Grid item xs={6}>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Reset Password
                    </Button>
                  </Grid>
                 
                </Grid>
                <Snackbar
        style={{ top: "80px",zIndex:1000000 }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackData.show}
        autoHideDuration={3000}
        onClose={() => setSnackData({ show: false })}
      >
        <Alert
          onClose={() => setSnackData({ show: false })}
          severity={snackData.type}
        >
          {snackData.message}
        </Alert>
      </Snackbar>
              </form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleCloseModal}>Disagree</Button>
          <Button onClick={handleCloseModal} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
