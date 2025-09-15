import { Outlet } from "react-router";
import MainHeader from "~/components/MainHeader";

export default function MainLayout() {
    return (
        <div className="min-h-dvh">
            <MainHeader />
            <Outlet />
        </div>
    );
}
