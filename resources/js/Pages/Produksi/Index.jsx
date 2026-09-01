import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Index({ ordersByStatus, bottlenecks }) {
  const columns = [
    { key: 'desain', title: 'Desain', bg: 'bg-blue-50', border: 'border-blue-200', link: 'desain.show' },
    { key: 'printing', title: 'Printing', bg: 'bg-purple-50', border: 'border-purple-200', link: 'printing.show' },
    { key: 'pemasangan', title: 'Pemasangan', bg: 'bg-pink-50', border: 'border-pink-200', link: 'pemasangan.show' }
  ];

  return (
    <AppLayout title="Dashboard Koordinator Produksi">
      {bottlenecks?.length > 0 && (
        <div className="mb-6">
          <Alert type="warning" title={`⚠️ Ada ${bottlenecks.length} order yang tertahan terlalu lama!`} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.key} className={`rounded-lg border ${col.border} ${col.bg} p-4`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200/50">
              <h2 className="font-semibold text-gray-800 capitalize">{col.title}</h2>
              <span className="bg-white text-gray-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                {ordersByStatus[col.key]?.length || 0}
              </span>
            </div>
            <div className="space-y-3">
              {(ordersByStatus[col.key] || []).map(order => {
                const isBottleneck = bottlenecks?.some(b => b.id === order.id);
                return (
                  <Link key={order.id} href={route(col.link, order.id)} className={`block bg-white p-3 rounded-md shadow-sm border ${isBottleneck ? 'border-red-400' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-indigo-600">{order.no_order}</span>
                      {isBottleneck && <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-gray-700 mb-2 truncate">{order.customer?.nama}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>DL: {new Date(order.deadline).toLocaleDateString('id-ID')}</span>
                      <span>{order.hari_di_status} hari</span>
                    </div>
                  </Link>
                );
              })}
              {(!ordersByStatus[col.key] || ordersByStatus[col.key].length === 0) && (
                <p className="text-center text-sm text-gray-400 py-4">Tidak ada order</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
