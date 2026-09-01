import Card from './Card';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
    const colorClasses = {
        brand: 'bg-brand-50 text-brand-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        blue: 'bg-blue-50 text-blue-600',
    };

    return (
        <Card className="relative overflow-hidden">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
                        
                        {trend && (
                            <span className={`inline-flex items-baseline text-sm font-semibold ${trend.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.type === 'up' ? (
                                    <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 mr-1 text-green-500" aria-hidden="true" />
                                ) : (
                                    <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 mr-1 text-red-500" aria-hidden="true" />
                                )}
                                {trend.value}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.brand}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                )}
            </div>
        </Card>
    );
}
