import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import KanbanBoard from '@/Components/Kanban/KanbanBoard';
import KanbanColumn from '@/Components/Kanban/KanbanColumn';
import KanbanCard from '@/Components/Kanban/KanbanCard';
import SidePanel from '@/Components/Kanban/SidePanel';
import Badge from '@/Components/Badge';
import StatusTimeline from '@/Components/StatusTimeline';

const DESAIN_STATUS_COLORS = { menunggu: 'gold', dikerjakan: 'neutral', revisi: 'danger', disetujui: 'accent' };
const DESAIN_STATUS_LABELS = { menunggu: 'Menunggu approval', dikerjakan: 'Draft', revisi: 'Revisi', disetujui: 'Disetujui' };

export default function Index({ orders }) {
  const { auth } = usePage().props;
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const { data: mockupData, setData: setMockupData, post: postMockup, processing: mockupProcessing, reset: resetMockup } = useForm({
    file_mockup: null,
  });
  
  const { data: rejectData, setData: setRejectData, post: postReject, processing: rejectProcessing, reset: resetReject } = useForm({
    catatan_revisi: '',
  });

  const [isRejecting, setIsRejecting] = useState(false);

  // Mengelompokkan order berdasarkan status desain
  const groupedOrders = {
    dikerjakan: [], // Draft
    revisi: [],
    menunggu: [], // Menunggu approval
    disetujui: [],
  };

  orders?.forEach(order => {
    const status = order.desain?.status || 'dikerjakan';
    if (groupedOrders[status]) {
        groupedOrders[status].push(order);
    } else {
        groupedOrders.dikerjakan.push(order);
    }
  });

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setIsRejecting(false);
    resetMockup();
    resetReject();
  };

  const closePanel = () => {
    setSelectedOrder(null);
    setIsRejecting(false);
  };

  const handleMockupSubmit = (e) => {
    e.preventDefault();
    postMockup(route('desain.upload-mockup', selectedOrder.id), {
        onSuccess: () => closePanel()
    });
  };

  const handleApprove = () => {
    router.post(route('desain.approve', selectedOrder.desain.id), {}, {
        onSuccess: () => closePanel()
    });
  };

  const handleReject = (e) => {
    e.preventDefault();
    postReject(route('desain.reject', selectedOrder.desain.id), {
      onSuccess: () => {
          setIsRejecting(false);
          closePanel();
      }
    });
  };

  return (
    <AppLayout 
      title={
        <div className="flex flex-col justify-center mt-1">
            <div className="flex items-center gap-3 leading-none">
                <span>Divisi Desain</span>
                <Badge status="gold">{orders?.length || 0} order berjalan</Badge>
            </div>
            <span className="text-[12px] text-ink-soft mt-1 font-sans font-normal normal-case tracking-normal leading-none">Mockup & approval — antrian desain aktif hari ini</span>
        </div>
      }
    >
      <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex h-[calc(100vh-12rem)] relative">
              <div className="flex-1 overflow-hidden">
                  <KanbanBoard>
                      {/* Draft Column */}
                      <KanbanColumn title="Draft" count={groupedOrders.dikerjakan.length} color="neutral">
                          {groupedOrders.dikerjakan.map(order => (
                              <KanbanCard 
                                  key={order.id} 
                                  order={order}
                                  imagePlaceholder={true}
                                  badgeText={order.desain?.versi ? `Versi ${order.desain.versi}` : null}
                                  badgeStatus="neutral"
                                  onClick={() => handleCardClick(order)}
                              />
                          ))}
                      </KanbanColumn>
                      
                      {/* Revisi Column */}
                      <KanbanColumn title="Revisi" count={groupedOrders.revisi.length} color="danger">
                          {groupedOrders.revisi.map(order => (
                              <KanbanCard 
                                  key={order.id} 
                                  order={order}
                                  imagePlaceholder={true}
                                  badgeText={order.desain?.versi ? `Revisi ke-${order.desain.versi}` : null}
                                  badgeStatus="danger"
                                  onClick={() => handleCardClick(order)}
                              />
                          ))}
                      </KanbanColumn>

                      {/* Menunggu Approval Column */}
                      <KanbanColumn title="Menunggu approval" count={groupedOrders.menunggu.length} color="gold">
                          {groupedOrders.menunggu.map(order => (
                              <KanbanCard 
                                  key={order.id} 
                                  order={order}
                                  imagePlaceholder={true}
                                  badgeText={order.desain?.versi ? `Versi ${order.desain.versi}` : null}
                                  badgeStatus="gold"
                                  onClick={() => handleCardClick(order)}
                              />
                          ))}
                      </KanbanColumn>

                      {/* Disetujui Column */}
                      <KanbanColumn title="Disetujui" count={groupedOrders.disetujui.length} color="accent">
                          {groupedOrders.disetujui.map(order => (
                              <KanbanCard 
                                  key={order.id} 
                                  order={order}
                                  imagePlaceholder={true}
                                  badgeText={order.desain?.versi ? `Versi ${order.desain.versi}` : null}
                                  badgeStatus="accent"
                                  onClick={() => handleCardClick(order)}
                              />
                          ))}
                      </KanbanColumn>
                  </KanbanBoard>
              </div>

          {/* Side Panel Detail */}
          <SidePanel isOpen={!!selectedOrder} onClose={closePanel}>
              {selectedOrder && (
                  <div>
                      <div className="text-xs text-gray-500 mb-1">{selectedOrder.no_order}</div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedOrder.customer?.nama}</h2>
                      <div className="text-sm text-gray-600 mb-6">
                          {selectedOrder.jenis_produk} • {selectedOrder.jumlah} pcs • deadline {new Date(selectedOrder.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>

                      {/* Image / Mockup Preview */}
                      <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[200px] flex items-center justify-center border border-gray-200">
                          {selectedOrder.desain?.file_mockup ? (
                              /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedOrder.desain.file_mockup) ? (
                                  <img 
                                      src={`/storage/${selectedOrder.desain.file_mockup}`} 
                                      alt="Mockup Desain" 
                                      className="max-w-full h-auto max-h-64 object-contain rounded"
                                  />
                              ) : (
                                  <a href={`/storage/${selectedOrder.desain.file_mockup}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                                      Unduh File Mockup
                                  </a>
                              )
                          ) : (
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                          )}
                      </div>
                      
                      {selectedOrder.desain && (
                          <div className="mb-4">
                              <Badge color={DESAIN_STATUS_COLORS[selectedOrder.desain.status]}>
                                  {DESAIN_STATUS_LABELS[selectedOrder.desain.status]} - Versi {selectedOrder.desain.versi}
                              </Badge>
                          </div>
                      )}

                      {/* Upload Form */}
                      {(!selectedOrder.desain || selectedOrder.desain.status !== 'disetujui') && (
                          <form onSubmit={handleMockupSubmit} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Mockup Baru</label>
                              <input 
                                  type="file" 
                                  onChange={(e) => setMockupData('file_mockup', e.target.files[0])} 
                                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 mb-3" 
                              />
                              <button type="submit" disabled={mockupProcessing || !mockupData.file_mockup} className="w-full bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50">
                                  Ajukan approval
                              </button>
                          </form>
                      )}

                      {/* Approval Buttons (Admin only) */}
                      {auth.user.level_akses <= 2 && selectedOrder.desain && selectedOrder.desain.status !== 'disetujui' && (
                          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">Aksi Review (Admin)</h4>
                              {!isRejecting ? (
                                  <div className="flex gap-2">
                                      <button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                          Setujui Desain
                                      </button>
                                      <button onClick={() => setIsRejecting(true)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                          Revisi
                                      </button>
                                  </div>
                              ) : (
                                  <form onSubmit={handleReject} className="space-y-3">
                                      <textarea
                                          value={rejectData.catatan_revisi}
                                          onChange={(e) => setRejectData('catatan_revisi', e.target.value)}
                                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                                          rows="2"
                                          placeholder="Catatan revisi..."
                                          required
                                      ></textarea>
                                      <div className="flex gap-2">
                                          <button type="submit" disabled={rejectProcessing} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                              Kirim Revisi
                                          </button>
                                          <button type="button" onClick={() => setIsRejecting(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                                              Batal
                                          </button>
                                      </div>
                                  </form>
                              )}
                          </div>
                      )}

                      {/* Communication History / Timeline */}
                      <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Riwayat Komunikasi antar divisi</h3>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <StatusTimeline logs={selectedOrder.orderLogs} />
                          </div>
                      </div>
                  </div>
              )}
          </SidePanel>
      </div>
      </div>
    </AppLayout>
  );
}
