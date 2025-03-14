import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  API_ERROR_MESSAGE,
  BUTTON_LABEL,
  FORM_LABEL,
  STATUS,
} from "shared/constants";
import { AdminConfigAPIService } from "services/api/AdminConfigAPIService";

const SectorCreation = ({onHandleClose}) => {
  const navigate = useNavigate();
 
  const [snackData, setSnackData] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const [formData, setFormData] = useState({
    sector_desc: "",
    sector_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      sector_name: formData.sector_name,
      sector_desc: "",
    };

    AdminConfigAPIService.sectorCreate(payload)
      .then((response) => {
        // On success, you can add any additional logic here

        setSnackData({
          show: true,
          message: response?.data?.message,
          type: "success",
        });

        setFormData({
          ...formData,
          sector_name: "",
          sector_desc: "",
        });
        onHandleClose(response?.data?.message);

        
      })
      .catch((errResponse) => {
        setSnackData({
          show: true,
          message:
            errResponse?.error?.message ||
            API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          type: "error",
        });
      });
  };

  return (
    <>
      <Box
        sx={{
          margin: "auto",
          padding: 3,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* First row - 3 items */}
            <Grid item xs={12} sm={12}>
              <TextField
                label={FORM_LABEL.SECTOR_NAME}
                variant="outlined"
                fullWidth
                name="sector_name"
                value={formData.sector_name}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                type="submit"
                variant="contained"
                style={{
                  background: "#2ba9bc",
                  float: "right",
                  textTransform: "none",
                }}
              >
                {BUTTON_LABEL.SUBMIT}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
      style={{top:"80px"}}
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
    </>
  );
};

export default SectorCreation;
