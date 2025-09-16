import { Outlet } from "react-router";
import MainHeader from "~/components/MainHeader";
import { Toaster } from "~/components/ui/sonner";

export default function MainLayout() {
    return (
        <div className="min-h-dvh">
            <MainHeader />
            <Outlet />
            <Toaster richColors />
        </div>
    );
}
