import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckinStatsProps {
  total: number
  checkedIn: number
  remaining: number
}

export default function CheckinStats({ total, checkedIn, remaining }: CheckinStatsProps) {
  const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Registered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{total}</div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Checked In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 dark:text-green-300">{checkedIn}</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">{percentage}% of attendees</div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Still Need to Check In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{remaining}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {remaining > 0 ? `${Math.round((remaining / total) * 100)}% remaining` : "All checked in!"}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Check-in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span>{percentage}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
