import Home from "./pages/Home"
import Manage from "./pages/Manage"
import Rule from "./pages/Rule"
import User from "./pages/User"
import List from "./pages/List"
import Settings from "./pages/Settings"
import Auth from './pages/Auth'
import {
    HOME_ROUTE, 
    MANAGE_ROUTE, 
    SETTINGS_ROUTE,
    USER_ROUTE,
    LIST_ROUTE,
    RULE_ROUTE,
    AUTH_ROUTE
} from "./utils/constants"

export const adminRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: MANAGE_ROUTE,
        Component: Manage
    },
    {
        path: SETTINGS_ROUTE,
        Component: Settings
    },
    {
        path: USER_ROUTE,
        Component: User
    },
    {
        path: LIST_ROUTE,
        Component: List
    },
    {
        path: RULE_ROUTE,
        Component: Rule
    }
]

export const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component: Auth
    }
]

export const userRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home
    },
    {
        path: SETTINGS_ROUTE,
        Component: Settings
    }
]