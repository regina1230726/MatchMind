import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import MatchesPage from "./pages/MatchesPage";
import DashboardPage from "./pages/DashboardPage";
import PredictionsPage from "./pages/PredictionsPage";
import TeamsPage from "./pages/TeamsPage";
import MatchDetailsPage from "./pages/MatchDetailsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/matches" replace />,
            },
            {
                path: "dashboard",
                element: <DashboardPage />,
            },
            {
                path: "matches",
                element: <MatchesPage />,
            },
            {
                path: "matches/:id",
                element: <MatchDetailsPage />,
            },
            {
                path: "predictions",
                element: <PredictionsPage />,
            },
            {
                path: "teams",
                element: <TeamsPage />,
            },
        ],
    },
]);