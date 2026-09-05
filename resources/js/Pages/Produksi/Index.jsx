import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Alert from '@/Components/Alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import KanbanBoard from '@/Components/Kanban/KanbanBoard';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import KanbanCard from '@/Components/Kanban/KanbanCard';

export default function Index({ ordersByStatus, bottlenecks }) {
  const columns = [
    { key: 'desain', title: 'Desain', color: 'blue', link: 'desain.show' },
    { key: 'produksi', title: 'Menunggu Jadwal (Produksi)', color: 'gray', link: 'orders.show' },
    { key: 'cutting', title: 'Cutting', color: 'orange', link: 'cutting.show' },
    { key: 'jahit', title: 'Jahit', color: 'green', link: 'jahit.show' },
    { key: 'printing', title: 'Printing', color: 'indigo', link: 'printing.show' },
    { key: 'pemasangan', title: 'Pemasangan', color: 'yellow', link: 'pemasangan.show' }
  ];

  const forwardToCutting = (orderId, e) => {
    e.stopPropagation(); // Mencegah klik card memicu navigasi
    if (confirm('Jadwalkan order ini untuk mulai dikerjakan di Divisi Cutting?')) {
        router.post(route('orders.update-status', orderId), {
            status: 'cutting',
            catatan: 'Dijadwalkan untuk cutting'
        });
    }
  };

  const handleCardClick = (link, orderId) => {
      router.visit(route(link, orderId));
  };

  return (
    <AppLayout title="Dashboard Koordinator Produksi">
      {bottlenecks?.length > 0 && (
        <div className="mb-6">
          <Alert type="warning" title={`⚠️ Ada ${bottlenecks.length} order yang tertahan terlalu lama!`} />
        </div>
      )}

      <div className="flex h-[calc(100vh-12rem)] relative">
        <div className="flex-1 overflow-hidden">
          <KanbanBoard>
            {columns.map(col => (
              <KanbanColumn 
                key={col.key} 
                title={col.title} 
                count={ordersByStatus[col.key]?.length || 0} 
                color={col.color}
              >
                {(ordersByStatus[col.key] || []).map(order => {
                  const isBottleneck = bottlenecks?.some(b => b.id === order.id);
                  return (
                    <div key={order.id} className="relative">
                        <KanbanCard 
                            order={order}
                            imagePlaceholder={false}
                            badgeText={isBottleneck ? "Tertahan" : `${order.hari_di_status} hari di status ini`}
                            badgeColor={isBottleneck ? "red" : "gray"}
                            onClick={() => handleCardClick(col.link, order.id)}
                        />
                        {isBottleneck && (
                            <div className="absolute top-3 right-3 text-red-500" title="Tertahan terlalu lama!">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                            </div>
                        )}
                        {col.key === 'produksi' && (
                            <button 
                                onClick={(e) => forwardToCutting(order.id, e)}
                                className="absolute bottom-3 right-3 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded font-medium transition-colors border border-indigo-200 shadow-sm"
                            >
                                Mulai Cutting
                            </button>
                        )}
                    </div>
                  );
                })}
              </KanbanColumn>
            ))}
          </KanbanBoard>
        </div>
      </div>
    </AppLayout>
  );
}
