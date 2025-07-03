import { Card, CardContent } from "@/components/ui/card"

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="text-center py-12">
        <div className="text-gray-400 mb-4">{Icon && <Icon className="w-16 h-16 mx-auto" />}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  )
}
