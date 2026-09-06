import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Card from '@/Components/Card';

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
        <AppLayout title="Pengaturan Sistem">
            <div className="max-w-4xl mx-auto space-y-6">
                <form onSubmit={submit} className="space-y-6">
                    {Object.entries(groupedSettings).map(([group, groupSettings]) => (
                        <Card key={group}>
                            <h3 className="text-[18px] font-oswald font-bold text-ink capitalize mb-6 border-b border-line pb-2">
                                {group === 'company' ? 'Profil Perusahaan' : group}
                            </h3>
                            
                            <div className="space-y-6">
                                {groupSettings.map((setting) => (
                                    <div key={setting.key}>
                                        <InputLabel htmlFor={setting.key} value={setting.label} className="!mb-1 font-bold text-ink" />
                                        {setting.description && (
                                            <p className="text-[13px] text-ink-soft mb-3">{setting.description}</p>
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
                                                    <div className="mb-3">
                                                        <img 
                                                            src={`/storage/${setting.value}`} 
                                                            alt={setting.label} 
                                                            className="h-20 object-contain rounded border border-line bg-panel p-2"
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    id={setting.key}
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(setting.originalIndex, e)}
                                                    className="mt-1 block w-full text-[13px] text-ink-soft
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded file:border-0
                                                    file:text-[13px] file:font-semibold
                                                    file:bg-navy/10 file:text-navy
                                                    hover:file:bg-navy/20 cursor-pointer"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}

                    <div className="flex items-center justify-end">
                        <PrimaryButton disabled={processing} type="submit">
                            Simpan Pengaturan
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
