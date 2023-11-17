import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";
import Lottie from "lottie-react";
import loading from "./assets/animations/loading.json";
import React, { Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";
import PrivateRoute from "./pages/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetMessages,
  handleLogoutFromAllTabs,
  loginAllTabsEventListener,
  logoutAllTabsEventListener,
} from "./redux/GlobalStates";
import { useTranslation } from "react-i18next";
import useAbortApiCall from "./hooks/useAbortApiCall";
import { handleGetAllUsers } from "./redux/UserSlice";
import { handleLogout } from "./redux/AuthSlice";
import { handleGetAllSubscribers } from "./redux/SubscriberSlice";
import { handleGetAllProspects } from "./redux/ProspectSlice";
import { handleGetAllPartners } from "./redux/PartnerSlice";
import { handleGetAllMagazine } from "./redux/MagazineSlice";
import { handleGetPricing } from "./redux/TaxAndShippingSlice";
import { handleGetAllOrder } from "./redux/OrderSlice";
import { handleGetAllPromoCodes } from "./redux/PromoCodeSlice";
import EditUserDetails from "./components/Users/EditUserDetails";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const Magazine = lazy(() => import("./pages/Magazine"));
const TaxtAndShippingCharges = lazy(() =>
  import("./pages/TaxtAndShippingCharges")
);
const Users = lazy(() => import("./pages/Users"));
const Subscribers = lazy(() => import("./pages/Subscribers"));
const Prospect = lazy(() => import("./pages/Prospect"));
const Partners = lazy(() => import("./pages/Partners"));
const ThirdPartyPayer = lazy(() => import("./pages/ThirdPartyPayer"));
const Subcriptions = lazy(() => import("./pages/Subcriptions"));
const Orders = lazy(() => import("./pages/Orders"));
const PromoCode = lazy(() => import("./pages/PromoCode"));
const MessagesList = lazy(() => import("./pages/MessagesList"));

function App() {
  const { token, user } = useSelector((state) => state.root.auth);

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleGetContent = () => {
    if (user === null) {
      return window.location.origin.concat("/sign-in");
    }
    const response = dispatch(
      handleGetAllUsers({ token, signal: AbortControllerRef })
    );
    if (response) {
      response.then((res) => {
        if (
          res?.payload?.status === "fail" &&
          (res?.payload?.message === "Please provide authentication token." ||
            res?.payload?.message === "Invalid token.")
        ) {
          dispatch(handleLogout());
          dispatch(handleLogoutFromAllTabs());
          toast.error("Please login again");
        }
      });
    }
    dispatch(handleGetAllSubscribers({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllProspects({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPartners({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllMagazine({ token, signal: AbortControllerRef }));
    dispatch(handleGetPricing({ token, signal: AbortControllerRef }));
    dispatch(handleGetMessages({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllOrder({ token, signal: AbortControllerRef }));
    dispatch(handleGetAllPromoCodes({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllSubscription({ token, signal: AbortControllerRef }));
    // dispatch(handleGetNewsLetter({ token, signal: AbortControllerRef }));
    // dispatch(handleGetAllPayers({ token, signal: AbortControllerRef }));
  };

  useEffect(() => {
    handleGetContent();
    dispatch(loginAllTabsEventListener());
    dispatch(logoutAllTabsEventListener());
    return () => {
      abortApiCall();
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster toastOptions={{ duration: 3000 }} position="top-center" />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload();
        }}
      >
        <Suspense
          fallback={
            <div className="relative top-0 left-0 w-screen h-screen">
              <Lottie
                style={{
                  pointerEvents: "none",
                  height: "300px",
                  width: "300px",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-full"
                animationData={loading}
                loop
              />
            </div>
          }
        >
          <Routes>
            <Route caseSensitive path="/sign-in" element={<SignIn />} />
            {/* <Route caseSensitive path="/sign-up" element={<SignUp />} /> */}
            <Route
              caseSensitive
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              caseSensitive
              path="/reset-password"
              element={<ResetPassword />}
            />
            <Route path="/*" element={<PageNotFound />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
              caseSensitive
            />
            <Route caseSensitive path="/profile" element={<Profile />} />
            <Route caseSensitive path="/users" element={<Users />} />
            <Route caseSensitive path="/user/:id" element={<EditUserDetails />} />
            <Route
              caseSensitive
              path="/subscribers"
              element={<Subscribers />}
            />
            <Route caseSensitive path="/prospects" element={<Prospect />} />
            <Route caseSensitive path="/partners" element={<Partners />} />
            <Route
              caseSensitive
              path="/third-party-payer"
              element={<ThirdPartyPayer />}
            />
            <Route
              caseSensitive
              path="/subscriptions"
              element={<Subcriptions />}
            />
            <Route caseSensitive path="/magazines" element={<Magazine />} />
            <Route caseSensitive path="/orders" element={<Orders />} />
            <Route
              caseSensitive
              path="/tax-shipping"
              element={<TaxtAndShippingCharges />}
            />
            <Route caseSensitive path="/promo-codes" element={<PromoCode />} />
            <Route caseSensitive path="/messages" element={<MessagesList />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
