import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/Card';
import { Link } from '@inertiajs/react';
import Badge from '@/Components/Badge';
import { formatRupiah } from '@/utils';

export default function CustomerShow({ customer }) {
    return (
        <AppLayout title={`Detail Customer: ${customer.nama}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card title="Informasi Customer">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nama</h3>
                                <p className="mt-1 text-sm text-gray-900">{customer.nama}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Kontak</h3>
                                <p className="mt-1 text-sm text-gray-900">{customer.kontak}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-sm text-gray-900">{customer.email || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Alamat</h3>
                                <p className="mt-1 text-sm text-gray-900">{customer.alamat || '-'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Catatan</h3>
                                <p className="mt-1 text-sm text-gray-900">{customer.catatan || '-'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <Link href={route('customers.edit', customer.id)} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                                    Edit Customer
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div className="md:col-span-2">
                    <Card title="Riwayat Order Terbaru">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customer.orders && customer.orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.no_order}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.tanggal_order).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRupiah(order.total_harga)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge color="gray">{order.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={route('orders.show', order.id)} className="text-indigo-600 hover:text-indigo-900">Lihat Order</Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!customer.orders || customer.orders.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada order.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
