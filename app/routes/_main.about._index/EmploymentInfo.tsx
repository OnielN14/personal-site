import { cn } from "~/lib/utils"
import { EmploymentInfo as EmploymentInfoType } from "~/services/personal-info.server"

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'short' })

const getMonthAndYear = (dateStr: string) => {
    const date = new Date(dateStr)

    return `${monthFormatter.format(date)} ${date.getFullYear()}`
}

interface EmploymentInfoItemProps extends EmploymentInfoType {

}

const EmploymentInfoItem = ({ companyName, employmentInformation, description }: EmploymentInfoItemProps) => {
    const startDate = getMonthAndYear(employmentInformation.startDate)
    const endDate = getMonthAndYear(employmentInformation.endDate)

    return (
        <div>
            <h3 className="text-2xl uppercase font-semibold">{companyName}</h3>
            <div className="mb-2">{startDate} - {endDate}</div>
            {
                description.map((v, i) => {
                    if (v.type === 'list') {
                        return (
                            <ul key={`list-${i}`} className="list-disc pl-4">
                                {v.value.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        )
                    }

                    return <>Not implemented</>
                })
            }
        </div>
    )
}

interface EmploymentInfoProps {
    items: EmploymentInfoType[]
    className?: string
}

export default function EmploymentInfo({ items, className }: EmploymentInfoProps) {
    return (
        <div className={className}>
            <h2 className="text-3xl font-bold uppercase mb-4">Past Employment</h2>

            <ul>
                {items.map((v) => (
                    <li key={v.companyName} className={cn(
                        "pb-8 relative",
                        "before:content-[''] before:absolute before:top-2 before:-bottom-3 before:w-1 before:bg-foreground before:-ml-[1.5rem]",
                        "pl-[2rem]",
                        "after:content-[''] after:absolute after:top-2 left-0 after:-ml-[1.875rem] after:w-4 after:h-4 after:bg-foreground after:rotate-45",
                    )}>
                        <EmploymentInfoItem {...v} />
                    </li>
                ))}
            </ul>
        </div>
    )
}