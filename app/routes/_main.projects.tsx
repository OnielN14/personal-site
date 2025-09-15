import { Outlet } from "react-router";

export default function MainLayout() {
    return (
        <div className="pt-[5rem]">
            <Outlet />
        </div>
    );
}
