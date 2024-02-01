import { Form, NavLink, useLocation } from "@remix-run/react";
import styles from "./MainHeader.module.css";
import { cn } from "~/lib/utils";
import { LuLogOut } from "react-icons/lu"
import { AnimatePresence, motion } from "framer-motion";
import { VariantProps, cva } from "class-variance-authority";
import { Button } from "../ui/button";

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

interface MenuItemProps {
    label: string
    to: string

}
const MenuItem = ({ label, to }: MenuItemProps) => {
    const location = useLocation()

    return (
        <NavLink key={label} className={cn(styles.Navigation, 'relative inline-block')} to={to}>
            <ConditionalCheck validation={() => checkLocation(location.pathname, to)} >
                {(isValid) => (
                    <AnimatePresence initial={false}>
                        {
                            isValid
                                ?
                                (
                                    <motion.div key={`${label}-bg`} variants={labelBgVariant} initial='idle' animate='active' exit='idle' className="bg-foreground absolute rounded-md inset-0" />
                                )
                                : null
                        }
                        <motion.span key={`${label}-label`} variants={labelTextVariant} animate={isValid ? 'active' : 'idle'} className="relative">{label}</motion.span>
                    </AnimatePresence>
                )}
            </ConditionalCheck>

        </NavLink>
    )
}

const mainHeaderVariants = cva("flex p-2 justify-center rounded-xl bg-background transition-shadow border-2", {
    variants: {
        variant: {
            default: "shadow-lg border-background",
            flat: "border-gray-200"
        }
    },
    defaultVariants: {
        variant: 'default'
    }
})

type MainHeaderVariants = VariantProps<typeof mainHeaderVariants>

interface MainHeaderProps {
    loggedIn: boolean
}

export default function MainHeader({ loggedIn }: MainHeaderProps) {
    const location = useLocation()
    let variant: MainHeaderVariants['variant'] = 'default'

    const isHome = checkLocation("/", location.pathname)
    if (isHome) variant = 'flat'

    return (
        <div className="flex justify-center fixed inset-[0_0_auto_0] p-2 z-50">
            <div className={cn(mainHeaderVariants({ variant }))}>
                {
                    links.map((v) => (
                        <MenuItem key={v.label} {...v} />
                    ))
                }
                {
                    loggedIn ? (
                        <Form action="/logout" method="post">
                            <Button variant="ghost">
                                <LuLogOut size={20} />
                            </Button>
                        </Form>
                    ) : null
                }
            </div>
        </div>
    )
}