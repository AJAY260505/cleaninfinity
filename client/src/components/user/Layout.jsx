import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AuthComponent from "./AuthComp";
import Dashboard from "./Dashboard";
import Navbar from "../common/Navbar";
import Awareness from "./Awareness";
import Progress from "./Progress";
import NFCPage from "./NFC";
import Profile from "./Profile";
import auth_states from "../../data/stateAndDistrict.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NFCCard from "./NFC-Card";
import {
  activity_posts,
  admin_details_of_ward_items,
  admin_leaderboard,
  admin_leaderboardData,
  admin_navbar,
  admin_state_progress_page,
  admin_totalUsersInWard,
  article_data,
  auth_wards,
  awareness_cardsData,
  awareness_video_link,
  dashboard_credits,
  dashboard_data,
  dashboard_titles,
  progress_BarStyles,
  progress_data,
  progress_users,
  user_navbar,
} from "../../data/config";
import SplashScreen from "./Splash";
import { useEffect, useState } from "react";
import Notify from "../common/Notify";
import PingMe from "./PingMe";
import Activity from "../common/Activity";
import AdminAuth from "../admin/AdminAuth";
import AdminDashboard from "../admin/AdminDashboard";
import StateProgress from "../admin/StateProgress";
import Inbox from "../admin/Inbox";

function LayoutContent() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen w-screen">
      <div
        className="fixed top-0 w-full h-full -z-10"
        style={{
          backgroundImage:
            "url(/0ba822008116c4db07f85b772a5dcea9-Photoroom.png)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          filter:
            "invert(1) sepia(1) hue-rotate(75deg) saturate(3) brightness(0.4)",
          opacity: 0.1,
        }}
      />
      <div className="w-10/12 bg-black">
        <ToastContainer />
      </div>
      {location.pathname !== "/auth" &&
        location.pathname !== "/admin/auth" &&
        (location.pathname.startsWith("/admin") &&
            location.pathname !== "/admin/Authentication"
          ? <Navbar links={admin_navbar} />
          : <Navbar links={user_navbar} />)}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                BarGraphVals={dashboard_data}
                creditVal={dashboard_credits}
                titles={dashboard_titles}
              />
            }
          />
          <Route
            path="/awareness"
            element={
              <Awareness
                src={awareness_video_link}
                data={article_data}
                cardsData={awareness_cardsData}
              />
            }
          />
          <Route
            path="/progress"
            element={
              <Progress
                data={progress_data}
                users={progress_users}
                progressBarStyles={progress_BarStyles}
              />
            }
          />
          <Route path="/nfc" element={<NFCPage />} />
          <Route path="/nfc-card" element={<NFCCard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notify" element={<Notify />} />
          <Route
            path="/activity"
            element={<Activity initialPosts={activity_posts} />}
          />
          <Route path="/ping-me" element={<PingMe />} />

          <Route
            path="/auth"
            element={loading
              ? <SplashScreen />
              : <AuthComponent states={auth_states} wards={auth_wards} />}
          />
          <Route path="/admin">
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />
            <Route
              path="state_progress"
              element={
                <StateProgress />
              }
            />
            <Route path="inbox" element={<Inbox />} />
            <Route
              path="auth"
              element={<AdminAuth states={auth_states} wards={auth_wards} />}
            />
            <Route
              path="activity"
              element={
                <Activity initialPosts={activity_posts} featuresStatus={true} />
              }
            />
            <Route
              path="notifications"
              element={<Notify enableCreateNotification={true} />}
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default function Layout() {
  return (
    <Router>
      <LayoutContent />
    </Router>
  );
}
