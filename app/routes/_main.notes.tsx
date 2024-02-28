import { Outlet } from "@remix-run/react";

export default function MainLayout() {
    return (
        <div className="pt-[5rem]">
            <Outlet />
        </div>
    );
}
