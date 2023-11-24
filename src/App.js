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
import { handleGetAllSubscription } from "./redux/SubscriptionSlice";
import { handleGetAllPayers } from "./redux/ThirdPartyPayerSlice";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Magazine = lazy(() => import("./pages/magazines/Magazine"));
const EditMagazineDetails = lazy(
  () => import("./pages/magazines/EditMagazineDetails"),
);
const TaxtAndShippingCharges = lazy(
  () => import("./pages/TaxtAndShippingCharges"),
);
const Users = lazy(() => import("./pages/users/Users"));
const EditUserDetails = lazy(() => import("./pages/users/EditUserDetails"));
const EditSubscriberDetails = lazy(
  () => import("./pages/subscribers/EditSubscriberDetails"),
);
const Subscribers = lazy(() => import("./pages/subscribers/Subscribers"));
const Prospect = lazy(() => import("./pages/prospects/Prospect"));
const EditProspectDetails = lazy(
  () => import("./pages/prospects/EditProspectDetails"),
);
const Partners = lazy(() => import("./pages/partners/Partners"));
const EditPartnerDetails = lazy(
  () => import("./pages/partners/EditPartnerDetails"),
);
const ThirdPartyPayer = lazy(
  () => import("./pages/third-party-payer/ThirdPartyPayer"),
);
const EditDetailsThirdPartyPayer = lazy(
  () => import("./pages/third-party-payer/EditDetailsThirdPartyPayer"),
);
const Subscriptions = lazy(() => import("./pages/subscriptions/Subcriptions"));
const EditDetailsSubscription = lazy(
  () => import("./pages/subscriptions/EditDetailsSubscription"),
);
const Orders = lazy(() => import("./pages/orders/Orders"));
const PromoCode = lazy(() => import("./pages/PromoCode"));
const MessagesList = lazy(() => import("./pages/MessagesList"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

function App() {
  const { token, user } = useSelector((state) => state.root.auth);

  const { abortApiCall, AbortControllerRef } = useAbortApiCall();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const privateRoutes = [
    { path: "/", page: Dashboard },
    { path: "/users", page: Users },
    { path: "/users/:id", page: EditUserDetails },
    { path: "/profile", page: Profile },
    { path: "/magazines", page: Magazine },
    { path: "/magazines/:id", page: EditMagazineDetails },
    { path: "/subscribers", page: Subscribers },
    { path: "/subscribers/:id", page: EditSubscriberDetails },
    { path: "/prospects", page: Prospect },
    { path: "/prospects/:id", page: EditProspectDetails },
    { path: "/partners", page: Partners },
    { path: "/partners/:id", page: EditPartnerDetails },
    { path: "/tax-shipping", page: TaxtAndShippingCharges },
    { path: "/messages", page: MessagesList },
    { path: "/orders", page: Orders },
    { path: "/promo-codes", page: PromoCode },
    { path: "/third-party-payer", page: ThirdPartyPayer },
    { path: "/third-party-payer/:id", page: EditDetailsThirdPartyPayer },
    { path: "/subscriptions", page: Subscriptions },
    { path: "/subscriptions/:id", page: EditDetailsSubscription },
    { path: "/change-password", page: ChangePassword },
  ];

  useEffect(() => {
    dispatch(loginAllTabsEventListener());
    dispatch(logoutAllTabsEventListener());
    return () => {
      abortApiCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {privateRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute>
                    <route.page />
                  </PrivateRoute>
                }
                caseSensitive
              />
            ))}

            {/* <Route caseSensitive path="/profile" element={<Profile />} />
            <Route caseSensitive path="/users" element={<Users />} />
            <Route
              caseSensitive
              path="/user/:id"
              element={<EditUserDetails />}
            />
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
            <Route caseSensitive path="/messages" element={<MessagesList />} /> */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
