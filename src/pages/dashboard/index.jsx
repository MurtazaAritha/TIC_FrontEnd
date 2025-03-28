// material-ui
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
// project import
import MainCard from "components/MainCard";
import AnalyticEcommerce from "components/cards/statistics/AnalyticEcommerce";
import CountView from "components/cards/statistics/CountView";

import MonthlyBarChart from "./MonthlyBarChart";
import ReportAreaChart from "./ReportAreaChart";
import UniqueVisitorCard from "./UniqueVisitorCard";
import SaleReportCard from "./SaleReportCard";
import ProjectTable from "./ProjectTable";
import ChatBotView from "../../components/chatbot/ChatbotView";

import SessionService from "../../services/SessionService";
import { API_ERROR_MESSAGE, STORAGE_KEYS } from "../../shared/constants";
import BarChart from "./BarChart";
import orgIcon from "../../assets/images/icons/orgIcon4.svg";
import UserIcon from "../../assets/images/icons/userIcon4.svg";
import UserIcon2 from "../../assets/images/icons/userIcon6.svg";

import { ProjectApiService } from "services/api/ProjectAPIService";
import content from "../../components/cards/statistics/content";
import { useEffect, useState } from "react";
import UserWeeklyBarChart from "./UserWeeklyBarChart";
import { DashboardApiService } from "services/api/DashboardAPIService";
import PieChart from "./PieChart";
import { UserApiService } from "services/api/UserAPIService";
import * as actions from "../../store/actions";
import { useSelector } from 'react-redux';
import { AdminConfigAPIService } from "services/api/AdminConfigAPIService";


// import ChatBotView from 'components/chatbot/ChatbotView';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: "1rem",
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: "auto",
  right: "auto",
  alignSelf: "flex-start",
  transform: "none",
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  let info = JSON.parse(sessionStorage.getItem("userDetails"));
  const userRole = info?.[0]?.role_name;
  const userId = info?.[0]?.user_id;
  const dispatch = useDispatch();
  sessionStorage.removeItem("resetFlow");

  const [updatedCardsValue, setUpdatedCardsValue] = useState([]);
  const [countData, setCountData] = useState({});
  const [orgCount, setOrgCount] = useState("");
  const [userCount, setUserCount] = useState("");
  const [inactiveUserCount, setInactiveUserCount] = useState("");
  const [chartData,setChartData] = useState([]);
  const [pieChartData,setPieChartData]= useState([]);

  useEffect(() => {
    fetchData();
    if(userRole === "Super Admin")
    {
      fetchDataForCharts();
    }
  }, []);

  const userdetails = JSON.parse(sessionStorage.getItem("userDetails"));
    const id = userdetails?.[0]?.user_id;

    const fetchDataForCharts = ()=>{
    DashboardApiService.topprojectIndustryVise()
      .then((response) => {
        setChartData(response?.data?.industryCount);
        setPieChartData(response?.data?.orgCount)
       
      })
      .catch((errResponse) => {
       
      });
    }

  const fetchData = () => {
    ProjectApiService.projectCounts(userId)
      .then((response) => {
        setCountData(response?.data?.details);
        setOrgCount(response?.data?.orgCount?.[0]?.count);
        setUserCount(response?.data?.activeUserCount?.[0]?.count);
        setInactiveUserCount(response?.data?.inactiveUserCount?.[0]?.count);
      })
      .catch((errResponse) => {
        setSnackData({
          show: true,
          message:
            errResponse?.error?.message ||
            API_ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          type: "error",
        });
        setUpdatedCardsValue([...content.cards1]);
      });

      UserApiService.roleDetails()
      .then((response) => {
        sessionStorage.setItem('roleDetails',JSON.stringify(response?.data?.details))
      })
      .catch((errResponse) => {
       console.log('errResponse',errResponse);
      });

      AdminConfigAPIService.permissionListing()
      .then((response) => {
        sessionStorage.setItem('permissionDetails',JSON.stringify(response?.data?.details))
      })
      .catch((errResponse) => {
       console.log('errResponse',errResponse);
      });
  };
  // const roleDetails = useSelector(state => console.log("state",state));

  // console.log("const roleDetails = useSelector(state => state.roleDetails);",roleDetails)
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <CountView data={countData} />
      </Grid>

      {/* <AnalyticEcommerce title="Total Page Views" count="4,42,236" percentage={59.3} extra="35,000" /> */}
      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
       
        <AnalyticEcommerce title="Total Projects" count="44" graphic={true}/>
      </Grid> */}
      {/* <AnalyticEcommerce title="Total Sales" count="$35,078" percentage={27.4} isLoss color="warning" extra="$20,395" /> */}

      {/* <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="In Progress" count="4" color="warning" graphic={true}/>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Success" count="30" color="success" graphic={true}/>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Failed" count="10" isLoss color="error" graphic={true}/>
      </Grid> */}

      {userRole === "Super Admin" ? (
        <>
          <Grid item xs={12} md={6} lg={9}>
            <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #eeeeee",
                borderRadius: "10px",
                boxShadow: "rgb(228, 228, 228) 6px 12px 20px",
              }}
            >
              <Typography variant="h5" style={{ padding: "25px 0px 0px 24px" }}>
                Industry wise project counts
              </Typography>
              <BarChart data={chartData}/>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <AnalyticEcommerce
              title="Organization Count"
              count={orgCount || 0}
              graphic={false}
              iconRender={true}
              icon={orgIcon}
            />
            <br />
            <AnalyticEcommerce
              title="Total Active Users"
              count={userCount || 0}
              graphic={false}
              iconRender={true}
              icon={UserIcon}
            />
            <br />
            <AnalyticEcommerce
              title="Total Inactive Users"
              count={inactiveUserCount || 0}
              graphic={false}
              iconRender={true}
              icon={UserIcon2}
            />


          </Grid>
          <Grid item xs={12} md={8} lg={8} >
          <Box
              sx={{
                bgcolor: "white",
                border: "1px solid #eeeeee",
                borderRadius: "10px",
                boxShadow: "rgb(228, 228, 228) 6px 12px 20px",
              }}
            >
              <Typography variant="h5" style={{ padding: "25px 0px 0px 24px" }}>
                Organisation wise project counts
              </Typography>
              <PieChart data={pieChartData} />
            </Box>
          
          </Grid>
        </>
      ) : (
        <>
          <Grid
            item
            md={8}
            sx={{ display: { sm: "none", md: "block", lg: "none" } }}
          />

          {/* row 2 */}
          {/* <Grid item xs={12} md={7} lg={8}>
        <UniqueVisitorCard />
      </Grid> */}

          <Grid item xs={12} md={7} lg={8}>
            {/* <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5">Recent Projects</Typography>
              </Grid>
              <Grid item />
            </Grid> */}
            <MainCard
              
              content={false}
              style={{ boxShadow: "6px 12px 20px #e4e4e4", minHeight: "428px" }}
            >
              <ProjectTable />
            </MainCard>
          </Grid>
          <Grid item xs={12} md={5} lg={4}>
            {userRole === "Org Super Admin" || userRole === "Admin" ? (
              <>
              <AnalyticEcommerce
                title="Total Active Users"
                count={userCount || 0}
                graphic={false}
                iconRender={true}
                icon={UserIcon}
              />
              <br />
            <AnalyticEcommerce
              title="Total Inactive Users"
              count={inactiveUserCount || 0}
              graphic={false}
              iconRender={true}
              icon={UserIcon2}
            />
            </>
            ) : (
              <>
                
                <MainCard
                 
                  content={false}
                  style={{ boxShadow: "6px 12px 20px #e4e4e4" }}
                >
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" color="text.secondary">
                        Last 10 days Statistics
                      </Typography>
                      {/* <Typography variant="h3">$7,650</Typography> */}
                    </Stack>
                  </Box>
                  <UserWeeklyBarChart />
                </MainCard>
              </>
            )}
          </Grid>
          {/* <Grid item xs={12} md={8} lg={8}>
          <MainCard
                 
                 content={false}
                 style={{ boxShadow: "6px 12px 20px #e4e4e4" }}
               >
         
          </MainCard>
          </Grid> */}
        </>
      )}
      <Grid item xs={12} md={12} lg={12}>
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
            textAlignLast: "end",
          }}
        >
          {/* <ChatBotView /> */}
        </Box>
      </Grid>

      {/* row 3 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Orders</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ProjectTable />
        </MainCard>
      </Grid> */}
      {/* <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Finance Growth" />
              <Typography variant="h5">+45.14%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">0.58%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">Low</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </MainCard>
      </Grid> */}

      {/* row 4 */}
      {/* <Grid item xs={12} md={7} lg={8}>
        <SaleReportCard />
      </Grid> */}
      {/* <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Transaction History</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                  <GiftOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $1,430
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    78%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                  <MessageOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #984947</Typography>} secondary="5 August, 1:45 PM" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $302
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    8%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                  <SettingOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    + $682
                  </Typography>
                  <Typography variant="h6" color="secondary" noWrap>
                    16%
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid> */}
    </Grid>
  );
}
