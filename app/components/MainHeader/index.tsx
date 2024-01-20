import { NavLink, useLocation } from "@remix-run/react";
import styles from "./MainHeader.module.css";
import { cn } from "~/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/notes", label: "Notes" },
]

function checkLocation(pathname: string, currentPathname: string): boolean {
    const splittedPathname = pathname.split("/")
    const splittedCurrentPathname = currentPathname.split("/")

    return splittedPathname[1] === splittedCurrentPathname[1]
}

const labelBgVariant = {
    idle: {
        scale: 0,
        opacity: 0,
    },
    active: {
        scale: 1,
        opacity: 1,
    }
}

const labelTextVariant = {
    idle: {
        color: 'hsl(var(--foreground))'
    },
    active: {
        color: 'hsl(var(--background))'
    }
}

interface ConditionalCheckProps {
    validation: () => boolean
    children: (isValid: boolean) => React.ReactNode
}

function ConditionalCheck({ children, validation }: ConditionalCheckProps) {
    return children(validation())
}

export default function MainHeader() {
    const location = useLocation()

    return (
        <div className="flex justify-center fixed inset-[0_0_auto_0] p-2 z-50">
            <div className="flex p-2 justify-center rounded-xl shadow-lg bg-background">
                {
                    links.map((v) => (
                        <NavLink key={v.label} className={cn(styles.Navigation, 'relative inline-block')} to={v.to}>
                            <ConditionalCheck validation={() => checkLocation(location.pathname, v.to)} >
                                {(isValid) => (
                                    <AnimatePresence initial={false}>
                                        {
                                            isValid
                                                ?
                                                (
                                                    <motion.div key={`${v.label}-bg`} variants={labelBgVariant} initial='idle' animate='active' exit='idle' className="bg-foreground absolute rounded-md inset-0" />
                                                )
                                                : null
                                        }
                                        <motion.span key={`${v.label}-label`} variants={labelTextVariant} animate={isValid ? 'active' : 'idle'} className="relative">{v.label}</motion.span>
                                    </AnimatePresence>
                                )}
                            </ConditionalCheck>

                        </NavLink>
                    ))
                }
            </div>
        </div>
    )
}