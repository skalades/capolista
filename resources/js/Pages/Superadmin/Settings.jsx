import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Settings({ auth, settings }) {
    const { data, setData, post, processing, errors } = useForm({
        settings: settings.map(s => ({
            key: s.key,
            value: s.value || '',
            type: s.type,
            label: s.label,
            description: s.description,
            group: s.group,
        }))
    });

    const submit = (e) => {
        e.preventDefault();
        
        post(route('superadmin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                alert('Pengaturan berhasil diperbarui!');
            },
            onError: () => {
                alert('Gagal memperbarui pengaturan. Periksa input Anda.');
            }
        });
    };

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        const newSettings = [...data.settings];
        newSettings[index].value = file;
        setData('settings', newSettings);
    };

    const groupedSettings = data.settings.reduce((acc, setting, index) => {
        const group = setting.group || 'Umum';
        if (!acc[group]) acc[group] = [];
        acc[group].push({ ...setting, originalIndex: index });
        return acc;
    }, {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Sistem</h2>}
        >
            <Head title="Pengaturan Sistem" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        {Object.entries(groupedSettings).map(([group, groupSettings]) => (
                            <div key={group} className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-medium text-gray-900 capitalize mb-4 border-b pb-2">
                                    {group === 'company' ? 'Profil Perusahaan' : group}
                                </h3>
                                
                                <div className="space-y-6">
                                    {groupSettings.map((setting) => (
                                        <div key={setting.key}>
                                            <InputLabel htmlFor={setting.key} value={setting.label} />
                                            {setting.description && (
                                                <p className="text-sm text-gray-500 mb-2">{setting.description}</p>
                                            )}
                                            
                                            {setting.type === 'text' || setting.type === 'number' ? (
                                                <TextInput
                                                    id={setting.key}
                                                    type={setting.type}
                                                    className="mt-1 block w-full"
                                                    value={setting.value || ''}
                                                    onChange={(e) => {
                                                        const newSettings = [...data.settings];
                                                        newSettings[setting.originalIndex].value = e.target.value;
                                                        setData('settings', newSettings);
                                                    }}
                                                />
                                            ) : setting.type === 'image' ? (
                                                <div>
                                                    {typeof setting.value === 'string' && setting.value && (
                                                        <div className="mb-2">
                                                            <img 
                                                                src={`/storage/${setting.value}`} 
                                                                alt={setting.label} 
                                                                className="h-20 object-contain rounded border p-1"
                                                            />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        id={setting.key}
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(setting.originalIndex, e)}
                                                        className="mt-1 block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-md file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-indigo-50 file:text-indigo-700
                                                        hover:file:bg-indigo-100"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="ml-4" disabled={processing}>
                                Simpan Pengaturan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
