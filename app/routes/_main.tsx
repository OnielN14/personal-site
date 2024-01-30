import { Outlet } from "@remix-run/react";
import MainHeader from "~/components/MainHeader";
export { default as ErrorBoundary } from "~/components/ErrorBoundary";

export default function MainLayout() {
    return (
        <div className="min-h-dvh">
            <MainHeader />
            <Outlet />
        </div>
    )
}